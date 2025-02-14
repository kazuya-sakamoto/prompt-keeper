import path from "path";
import {
  getPromptFilePath,
  createNewPrompt,
  readPromptFile,
  writePromptFile,
  ensureFileExists,
} from "./utils";
import { SetCommandOptions } from "./types";

export const setCommand = async (
  filePath: string,
  promptText: string,
  options: SetCommandOptions = {}
): Promise<void> => {
  try {
    // ファイルパスを絶対パスに変換
    const absoluteFilePath = path.resolve(process.cwd(), filePath);

    // 指定されたファイルの存在確認
    await ensureFileExists(absoluteFilePath);

    // プロンプトファイルのパスを取得
    const promptFilePath = getPromptFilePath(absoluteFilePath);

    // 既存のプロンプトファイルを読み込むか、新規作成
    const promptFile = await readPromptFile(promptFilePath);

    // 新しいバージョン番号を計算
    const newVersion = promptFile.prompts.length + 1;

    // 新しいプロンプトを作成
    const newPrompt = createNewPrompt(
      promptText,
      newVersion,
      options.model || null
    );

    // プロンプトを追加
    promptFile.prompts.push(newPrompt);

    // ファイルに保存
    await writePromptFile(promptFilePath, promptFile);

    console.log(`✨ プロンプトを保存しました：${promptFilePath}`);
    console.log(`📝 プロンプト：${promptText}`);
    console.log(`🔢 バージョン：${newVersion}`);
  } catch (error) {
    console.error("エラー:", (error as Error).message);
    process.exit(1);
  }
};
