import path from "path";
import {
  getPromptFilePath,
  createNewPrompt,
  readPromptFile,
  writePromptFile,
  ensureFileExists,
  readFileContent,
  addPromptComment,
} from "./utils";
import { SetCommandOptions } from "./types";
import inquirer from "inquirer";

const AI_MODELS = [
  { name: "Claude 3.5 Sonnet v2", value: "claude-3.5-sonnet-v2" },
  { name: "O3-mini", value: "o3-mini" },
  { name: "O3-mini High", value: "o3-mini-high" },
  { name: "Gemini 2.0 Flash", value: "gemini-2.0-flash" },
  { name: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
  { name: "Gemini 2.0 Experimental Advanced", value: "gemini-2.0-exp-adv" },
  { name: "GPT-4o", value: "gpt-4o" },
  { name: "GPT-4o Mini", value: "gpt-4o-mini" },
  { name: "カスタム", value: "custom" },
] as const;

export const setCommand = async (
  filePath: string,
  promptText: string,
  options: SetCommandOptions = {}
): Promise<void> => {
  try {
    const absoluteFilePath = path.resolve(process.cwd(), filePath);
    await ensureFileExists(absoluteFilePath);

    const promptFilePath = getPromptFilePath(absoluteFilePath);
    const promptFile = await readPromptFile(promptFilePath, filePath);

    const newVersion = promptFile.prompts.length + 1;
    const newPrompt = createNewPrompt(
      promptText,
      newVersion,
      options.model || null
    );

    promptFile.prompts.push(newPrompt);
    await writePromptFile(promptFilePath, promptFile);

    console.log(`Prompt saved: ${promptFilePath}`);
    console.log(`Prompt: ${promptText}`);
    console.log(`Version: ${newVersion}`);
    if (options.model) {
      console.log(`Model: ${options.model}`);
    }
  } catch (error) {
    console.error("Error:", (error as Error).message);
    process.exit(1);
  }
};

export const interactiveCommand = async (filePath: string): Promise<void> => {
  try {
    const absoluteFilePath = path.resolve(process.cwd(), filePath);
    await ensureFileExists(absoluteFilePath);

    // プロンプトとモデルの入力
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "prompt",
        message: "Enter your prompt:",
        validate: (input) => input.trim().length > 0 || "Prompt is required",
      },
      {
        type: "list",
        name: "modelChoice",
        message: "Select the model to use:",
        choices: [
          { name: "No model specified", value: null },
          ...AI_MODELS.map((model) => ({
            name: model.name,
            value: model.value,
          })),
        ],
      },
      {
        type: "input",
        name: "customModel",
        message: "Enter custom model name:",
        when: (answers) => answers.modelChoice === "custom",
        validate: (input) =>
          input.trim().length > 0 || "Model name is required",
      },
    ]);

    const modelToUse =
      answers.modelChoice === "custom"
        ? answers.customModel
        : answers.modelChoice;

    // プロンプトの保存
    const promptFilePath = getPromptFilePath(absoluteFilePath);
    const promptFile = await readPromptFile(promptFilePath, filePath);
    const newVersion = promptFile.prompts.length + 1;
    const newPrompt = createNewPrompt(answers.prompt, newVersion, modelToUse);
    promptFile.prompts.push(newPrompt);
    await writePromptFile(promptFilePath, promptFile);

    // ファイルの内容を表示
    const lines = await readFileContent(absoluteFilePath);
    console.log("\nFile contents:");
    lines.forEach((line, index) => {
      console.log(`${String(index + 1).padStart(3, " ")} | ${line}`);
    });

    // コメントを追加する位置の選択
    const { position } = await inquirer.prompt([
      {
        type: "list",
        name: "position",
        message: "Select where to add the prompt ID comment:",
        choices: [
          { name: "Beginning of file", value: 0 },
          { name: "End of file", value: lines.length },
          { name: "Select specific line", value: "custom" },
        ],
      },
    ]);

    let lineNumber = position;
    if (position === "custom") {
      const { lineNum } = await inquirer.prompt<{ lineNum: number }>([
        {
          type: "number",
          name: "lineNum",
          message: "Which line number?",
          validate: (input: any) =>
            (typeof input === "number" && input > 0 && input <= lines.length) ||
            "Please enter a valid line number",
        },
      ]);
      lineNumber = lineNum - 1;
    }

    // コメントの追加
    await addPromptComment(absoluteFilePath, newPrompt.id, lineNumber);

    console.log(`Prompt saved: ${promptFilePath}`);
    console.log(`Prompt: ${answers.prompt}`);
    console.log(`Version: ${newVersion}`);
    if (modelToUse) {
      console.log(`Model: ${modelToUse}`);
    }
    console.log(`Prompt ID: ${newPrompt.id}`);
  } catch (error) {
    console.error("Error:", (error as Error).message);
    process.exit(1);
  }
};
