import type { AIProvider, AIProviderType } from "./types";
import { OpenAIProvider } from "./providers/openai";

// AI provider factory
export class AIProviderFactory {
  private static providers: Map<AIProviderType, AIProvider> = new Map();

  /**
   * Get or create an AI provider instance
   */
  static getProvider(
    type: AIProviderType,
    config?: { apiKey?: string }
  ): AIProvider {
    // Check if provider already exists
    const existingProvider = this.providers.get(type);
    if (existingProvider) {
      return existingProvider;
    }

    // Create new provider based on type
    let provider: AIProvider;

    switch (type) {
      case "openai":
        const openaiKey = config?.apiKey || process.env.OPENAI_API_KEY;
        if (!openaiKey) {
          throw new Error("OpenAI API key is required");
        }
        provider = new OpenAIProvider(openaiKey);
        break;

      case "anthropic":
        throw new Error("Anthropic provider not implemented yet");

      case "gemini":
        throw new Error("Gemini provider not implemented yet");

      default:
        throw new Error(`Unsupported AI provider: ${type}`);
    }

    // Cache the provider
    this.providers.set(type, provider);
    return provider;
  }

  /**
   * Get the default provider (OpenAI)
   */
  static getDefaultProvider(): AIProvider {
    return this.getProvider("openai");
  }

  /**
   * Clear cached providers (useful for testing)
   */
  static clearCache(): void {
    this.providers.clear();
  }

  /**
   * Get all available provider types
   */
  static getAvailableProviders(): AIProviderType[] {
    return ["openai"]; // Only OpenAI is implemented for now
    // Future: return ["openai", "claude", "xai", "meta"];
  }

  /**
   * Check if a provider type is supported
   */
  static isProviderSupported(type: string): type is AIProviderType {
    const supportedProviders: string[] = this.getAvailableProviders();
    return supportedProviders.includes(type);
  }
}
