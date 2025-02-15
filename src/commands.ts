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
  { name: "GPT-4", value: "gpt-4" },
  { name: "GPT-4 Turbo", value: "gpt-4-turbo-preview" },
  { name: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
  { name: "Claude 3 Opus", value: "claude-3-opus" },
  { name: "Claude 3 Sonnet", value: "claude-3-sonnet" },
  { name: "Claude 3 Haiku", value: "claude-3-haiku" },
  { name: "Gemini Pro", value: "gemini-pro" },
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

    console.log(`✨ プロンプトを保存しました：${promptFilePath}`);
    console.log(`📝 プロンプト：${promptText}`);
    console.log(`🔢 バージョン：${newVersion}`);
    if (options.model) {
      console.log(`🤖 モデル：${options.model}`);
    }
  } catch (error) {
    console.error("エラー:", (error as Error).message);
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
        message: "プロンプトを入力してください:",
        validate: (input) => input.trim().length > 0 || "プロンプトは必須です",
      },
      {
        type: "list",
        name: "modelChoice",
        message: "使用するモデルを選択してください:",
        choices: [
          { name: "モデルを指定しない", value: null },
          ...AI_MODELS.map((model) => ({
            name: model.name,
            value: model.value,
          })),
        ],
      },
      {
        type: "input",
        name: "customModel",
        message: "カスタムモデル名を入力してください:",
        when: (answers) => answers.modelChoice === "custom",
        validate: (input) => input.trim().length > 0 || "モデル名は必須です",
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
    console.log("\nファイルの内容:");
    lines.forEach((line, index) => {
      console.log(`${String(index + 1).padStart(3, " ")} | ${line}`);
    });

    // コメントを追加する位置の選択
    const { position } = await inquirer.prompt([
      {
        type: "list",
        name: "position",
        message: "プロンプトIDをコメントとして追加する位置を選択してください:",
        choices: [
          { name: "ファイルの先頭", value: 0 },
          { name: "ファイルの末尾", value: lines.length },
          { name: "特定の行を選択", value: "custom" },
        ],
      },
    ]);

    let lineNumber = position;
    if (position === "custom") {
      const { lineNum } = await inquirer.prompt<{ lineNum: number }>([
        {
          type: "number",
          name: "lineNum",
          message: "何行目に追加しますか？",
          validate: (input: any) =>
            (typeof input === "number" && input > 0 && input <= lines.length) ||
            "有効な行番号を入力してください",
        },
      ]);
      lineNumber = lineNum - 1; // 1-indexedから0-indexedに変換
    }

    // コメントの追加
    await addPromptComment(absoluteFilePath, newPrompt.id, lineNumber);

    console.log(`✨ プロンプトを保存しました：${promptFilePath}`);
    console.log(`📝 プロンプト：${answers.prompt}`);
    console.log(`🔢 バージョン：${newVersion}`);
    if (modelToUse) {
      console.log(`🤖 モデル：${modelToUse}`);
    }
    console.log(`🔗 プロンプトID：${newPrompt.id}`);
  } catch (error) {
    console.error("エラー:", (error as Error).message);
    process.exit(1);
  }
};
