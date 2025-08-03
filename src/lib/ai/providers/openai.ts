import OpenAI from "openai";
import type {
  AIProvider,
  AIResponse,
  AIStreamChunk,
  Message,
  ModelConfig,
} from "../types";
import {
  AIProviderError,
  AIRateLimitError,
  AIQuotaExceededError,
} from "../types";

// OpenAI model configurations
const OPENAI_MODELS: Record<string, ModelConfig> = {
  "gpt-4o-mini": {
    name: "gpt-4o-mini",
    displayName: "GPT-4o Mini",
    maxTokens: 16384,
    contextWindow: 128000,
    costPer1kTokens: {
      input: 0.00015,
      output: 0.0006,
    },
  },
  "gpt-4o": {
    name: "gpt-4o",
    displayName: "GPT-4o",
    maxTokens: 4096,
    contextWindow: 128000,
    costPer1kTokens: {
      input: 0.005,
      output: 0.015,
    },
  },
  "gpt-3.5-turbo": {
    name: "gpt-3.5-turbo",
    displayName: "GPT-3.5 Turbo",
    maxTokens: 4096,
    contextWindow: 16385,
    costPer1kTokens: {
      input: 0.0015,
      output: 0.002,
    },
  },
};

// System prompt in English with language instruction
const SYSTEM_PROMPT = `You are a helpful AI assistant. Always respond in the same language that the user is speaking to you. Be conversational, helpful, and provide accurate information. 

IMPORTANT FORMATTING RULES:
- ALWAYS use proper markdown formatting
- For numbered lists, put each item on a separate line
- Use proper line breaks between paragraphs
- Use double line breaks to separate sections
- Format lists like this:
  1. First item
  2. Second item
  3. Third item
- Never put multiple list items on the same line`;

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private models = OPENAI_MODELS;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }

    this.client = new OpenAI({
      apiKey,
    });
  }

  get name(): string {
    return "openai";
  }

  getSupportedModels(): string[] {
    return Object.keys(this.models);
  }

  getDefaultModel(): string {
    return "gpt-4o-mini";
  }

  getModelConfig(model: string): ModelConfig | undefined {
    return this.models[model];
  }

  private formatMessages(
    messages: Message[]
  ): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
    // Add system prompt at the beginning
    const formattedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
      ];

    // Add user messages (filter out system messages from input)
    const userMessages = messages.filter((msg) => msg.role !== "system");
    userMessages.forEach((msg) => {
      formattedMessages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      });
    });

    return formattedMessages;
  }

  async generateResponse(
    messages: Message[],
    model: string = this.getDefaultModel()
  ): Promise<AIResponse> {
    try {
      if (!this.models[model]) {
        throw new AIProviderError(`Unsupported model: ${model}`, this.name);
      }

      const modelConfig = this.models[model];
      const formattedMessages = this.formatMessages(messages);

      const completion = await this.client.chat.completions.create({
        model,
        messages: formattedMessages,
        max_tokens: modelConfig.maxTokens,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const choice = completion.choices[0];
      if (!choice || !choice.message) {
        throw new AIProviderError(
          "No response received from OpenAI",
          this.name
        );
      }

      const content = choice.message.content || "";
      const inputTokens = completion.usage?.prompt_tokens || 0;
      const outputTokens = completion.usage?.completion_tokens || 0;
      const totalTokens =
        completion.usage?.total_tokens || inputTokens + outputTokens;

      return {
        content,
        tokens: totalTokens,
        model,
        finishReason: choice.finish_reason as any,
      };
    } catch (error: any) {
      // Handle OpenAI specific errors
      if (error.status === 429) {
        const retryAfter = error.headers?.["retry-after"]
          ? parseInt(error.headers["retry-after"])
          : undefined;
        throw new AIRateLimitError(this.name, retryAfter);
      }

      if (error.status === 402 || error.code === "insufficient_quota") {
        throw new AIQuotaExceededError(this.name);
      }

      if (error.status === 401) {
        throw new AIProviderError(
          "Invalid API key for OpenAI",
          this.name,
          error
        );
      }

      if (error.status === 400) {
        throw new AIProviderError(
          `Invalid request to OpenAI: ${error.message}`,
          this.name,
          error
        );
      }

      // Re-throw if it's already our custom error
      if (error instanceof AIProviderError) {
        throw error;
      }

      // Generic error handling
      throw new AIProviderError(
        `OpenAI API error: ${error.message || "Unknown error"}`,
        this.name,
        error
      );
    }
  }

  async *generateStreamingResponse(
    messages: Message[],
    model: string = this.getDefaultModel()
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    try {
      if (!this.models[model]) {
        throw new AIProviderError(`Unsupported model: ${model}`, this.name);
      }

      const modelConfig = this.models[model];
      const formattedMessages = this.formatMessages(messages);

      const stream = await this.client.chat.completions.create({
        model,
        messages: formattedMessages,
        max_tokens: modelConfig.maxTokens,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
      });

      let fullContent = "";
      let buffer = "";
      let totalTokens = 0;

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        const finishReason = chunk.choices[0]?.finish_reason;

        if (delta?.content) {
          const content = delta.content;
          fullContent += content;
          buffer += content;

          // Look for natural breaking points: line breaks first (for markdown), then sentences
          const lineBreaks = /\n+/;
          const sentenceEnders = /[.!?]\s+/;
          const punctuation = /[.!?:;,]\s+/;

          // Check for line breaks first (markdown formatting takes priority)
          if (lineBreaks.test(buffer)) {
            const lines = buffer.split(lineBreaks);
            if (lines.length > 1) {
              // Send all complete lines except the last one
              const completeLines = lines.slice(0, -1);
              const chunkContent = completeLines.join("\n") + "\n";

              // Keep the last line in buffer
              buffer = lines[lines.length - 1];

              yield {
                content: chunkContent,
                isComplete: false,
                model,
              };
            }
          }
          // Check for complete sentences (but avoid breaking numbered lists)
          else if (
            sentenceEnders.test(buffer) &&
            !/^\d+\.\s/.test(buffer.trim())
          ) {
            const sentences = buffer.split(sentenceEnders);
            if (sentences.length > 1) {
              // Send all complete sentences except the last (potentially incomplete) one
              const completeSentences = sentences.slice(0, -1);
              const chunkContent = completeSentences.join(". ") + ". ";

              // Keep the last sentence in buffer
              buffer = sentences[sentences.length - 1];

              yield {
                content: chunkContent,
                isComplete: false,
                model,
              };
            }
          }
          // Fallback: send chunk every 15-20 words to avoid too long delays
          else {
            const words = buffer.split(/\s+/);
            if (words.length >= 15) {
              // Find a good breaking point (comma, colon, semicolon)
              let breakPoint = -1;
              for (let i = 10; i < words.length - 2; i++) {
                if (punctuation.test(words[i] + " ")) {
                  breakPoint = i + 1;
                  break;
                }
              }

              if (breakPoint > 0) {
                const wordsToSend = words.slice(0, breakPoint);
                const chunkContent = wordsToSend.join(" ");
                buffer = words.slice(breakPoint).join(" ");

                yield {
                  content: chunkContent,
                  isComplete: false,
                  model,
                };
              }
            }
          }
        }

        // Handle completion
        if (finishReason === "stop" || finishReason === "length") {
          // Send any remaining content in buffer
          if (buffer.trim()) {
            yield {
              content: buffer.trim(),
              isComplete: false,
              model,
            };
          }

          // Estimate tokens (rough approximation: 1 token ≈ 0.75 words)
          totalTokens = Math.ceil(fullContent.split(/\s+/).length / 0.75);

          // Send final chunk
          yield {
            content: "",
            isComplete: true,
            tokens: totalTokens,
            model,
            finishReason: finishReason as any,
          };
          break;
        }
      }
    } catch (error: any) {
      // Handle OpenAI specific errors (same as non-streaming)
      if (error.status === 429) {
        const retryAfter = error.headers?.["retry-after"]
          ? parseInt(error.headers["retry-after"])
          : undefined;
        throw new AIRateLimitError(this.name, retryAfter);
      }

      if (error.status === 402 || error.code === "insufficient_quota") {
        throw new AIQuotaExceededError(this.name);
      }

      if (error.status === 401) {
        throw new AIProviderError(
          "Invalid API key for OpenAI",
          this.name,
          error
        );
      }

      if (error.status === 400) {
        throw new AIProviderError(
          `Invalid request to OpenAI: ${error.message}`,
          this.name,
          error
        );
      }

      // Re-throw if it's already our custom error
      if (error instanceof AIProviderError) {
        throw error;
      }

      // Generic error handling
      throw new AIProviderError(
        `OpenAI streaming API error: ${error.message || "Unknown error"}`,
        this.name,
        error
      );
    }
  }
}
