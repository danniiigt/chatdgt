// Types for AI providers integration

export interface Message {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
}

export interface AIResponse {
  content: string;
  tokens: number;
  model: string;
  finishReason?: "stop" | "length" | "content_filter" | "tool_calls";
}

export interface AIStreamChunk {
  content: string;
  isComplete: boolean;
  tokens?: number;
  model?: string;
  finishReason?: "stop" | "length" | "content_filter" | "tool_calls";
}

export interface AIProvider {
  name: string;
  generateResponse(messages: Message[], model?: string): Promise<AIResponse>;
  generateStreamingResponse(messages: Message[], model?: string): AsyncGenerator<AIStreamChunk, void, unknown>;
  getSupportedModels(): string[];
  getDefaultModel(): string;
}

export interface AIProviderConfig {
  apiKey: string;
  baseURL?: string;
  maxTokens?: number;
  temperature?: number;
}

// Available AI providers
export type AIProviderType = "openai" | "anthropic" | "gemini";

// Model configurations
export interface ModelConfig {
  name: string;
  displayName: string;
  maxTokens: number;
  contextWindow: number;
  costPer1kTokens: {
    input: number;
    output: number;
  };
}

// Token counting utilities
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

// Error types
export class AIProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public originalError?: any
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}

export class AIRateLimitError extends AIProviderError {
  constructor(provider: string, retryAfter?: number) {
    super(`Rate limit exceeded for ${provider}`, provider);
    this.name = "AIRateLimitError";
    this.retryAfter = retryAfter;
  }
  retryAfter?: number;
}

export class AIQuotaExceededError extends AIProviderError {
  constructor(provider: string) {
    super(`Quota exceeded for ${provider}`, provider);
    this.name = "AIQuotaExceededError";
  }
}
