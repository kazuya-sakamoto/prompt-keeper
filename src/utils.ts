import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { Prompt, PromptFile } from "./types";

export const getPromptFilePath = (filePath: string): string => {
  const parsedPath = path.parse(filePath);
  return path.join(parsedPath.dir, `${parsedPath.name}.prompt.json`);
};

export const createNewPrompt = (
  promptText: string,
  version: number,
  model: string | null = null
): Prompt => {
  return {
    id: uuidv4(),
    prompt: promptText,
    model,
    createdAt: new Date().toISOString(),
    version,
  };
};

export const readPromptFile = async (
  promptFilePath: string,
  originalFilePath: string
): Promise<PromptFile> => {
  try {
    const content = await fs.readFile(promptFilePath, "utf-8");
    try {
      return JSON.parse(content);
    } catch (parseError) {
      return {
        file: originalFilePath,
        prompts: [],
      };
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {
        file: originalFilePath,
        prompts: [],
      };
    }
    throw error;
  }
};

export const writePromptFile = async (
  promptFilePath: string,
  data: PromptFile
): Promise<void> => {
  await fs.writeFile(promptFilePath, JSON.stringify(data, null, 2), "utf-8");
};

export const ensureFileExists = async (filePath: string): Promise<void> => {
  try {
    await fs.access(filePath);
  } catch (error) {
    throw new Error(`File ${filePath} does not exist.`);
  }
};

export const readFileContent = async (filePath: string): Promise<string[]> => {
  const content = await fs.readFile(filePath, "utf-8");
  return content.split("\n");
};

export const addPromptComment = async (
  filePath: string,
  promptId: string,
  lineNumber: number
): Promise<void> => {
  const lines = await readFileContent(filePath);
  const extension = path.extname(filePath);
  const commentPrefix = extension === ".py" ? "#" : "//";

  const commentLine = `${commentPrefix} prompt-id: ${promptId}`;
  lines.splice(lineNumber, 0, commentLine);

  await fs.writeFile(filePath, lines.join("\n"), "utf-8");
};
