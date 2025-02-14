import { Command } from "commander";
import { setCommand } from "./commands";
import { SetCommandOptions } from "./types";

const program = new Command();

program
  .name("prompt-keeper")
  .description("AIプロンプトをコードファイルに紐づけて管理するCLIツール")
  .version("1.0.0");

program
  .command("set")
  .description("コードファイルにプロンプトを追加します")
  .argument("<file>", "プロンプトを紐づけるファイルのパス")
  .argument("<prompt>", "AIプロンプトの内容")
  .option("-m, --model <model>", "AIモデルの指定（例：gpt-4）")
  .action(async (file: string, prompt: string, options: SetCommandOptions) => {
    try {
      await setCommand(file, prompt, options);
    } catch (error) {
      console.error("エラー:", (error as Error).message);
      process.exit(1);
    }
  });

program.parse();
