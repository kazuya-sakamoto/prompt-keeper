export interface Prompt {
  id: string;
  prompt: string;
  model: string | null;
  createdAt: string;
  version: number;
}

export interface PromptFile {
  file: string;
  prompts: Prompt[];
}

export interface SetCommandOptions {
  model?: string;
}
