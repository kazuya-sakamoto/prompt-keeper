import { Command } from "commander";
import { setCommand, interactiveCommand } from "./commands";
import { SetCommandOptions } from "./types";

const program = new Command();

program
  .name("pk")
  .description("CLI tool for managing AI prompts linked to code files")
  .version("1.0.0");

program
  .command("set")
  .alias("s")
  .description("Add a prompt to a code file")
  .argument("<file>", "Path to the file to link the prompt")
  .argument("<prompt>", "AI prompt content")
  .option("-m, --model <model>", "Specify AI model (e.g., gpt-4)")
  .action(async (file: string, prompt: string, options: SetCommandOptions) => {
    try {
      await setCommand(file, prompt, options);
    } catch (error) {
      console.error("Error:", (error as Error).message);
      process.exit(1);
    }
  });

program
  .command("interactive")
  .alias("i")
  .description("Add a prompt interactively")
  .argument("<file>", "Path to the file to link the prompt")
  .action(async (file: string) => {
    try {
      await interactiveCommand(file);
    } catch (error) {
      console.error("Error:", (error as Error).message);
      process.exit(1);
    }
  });

program.parse();
