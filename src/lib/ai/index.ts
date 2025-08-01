// Import for internal use
import { AIProviderFactory } from "./factory";
import type { AIProviderType } from "./types";

// Main AI module exports
export { AIProviderFactory } from "./factory";
export { OpenAIProvider } from "./providers/openai";

export type {
  AIProvider,
  AIResponse,
  Message,
  AIProviderType,
  ModelConfig,
  TokenUsage,
  AIProviderConfig,
} from "./types";

export {
  AIProviderError,
  AIRateLimitError,
  AIQuotaExceededError,
} from "./types";

// Convenience function to get the default AI provider
export const getAIProvider = () => {
  return AIProviderFactory.getDefaultProvider();
};

// Convenience function to get a specific AI provider
export const getSpecificAIProvider = (type: AIProviderType) => {
  return AIProviderFactory.getProvider(type);
};