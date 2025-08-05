export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  tokens?: number;
  model?: string;
  created_at: string;
}