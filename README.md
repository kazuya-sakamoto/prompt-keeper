# prompt-keeper

A CLI tool for managing AI prompts linked to code files.

## Features

- Manage prompt history for each code file
- Version control for prompts
- AI model specification support
- Link prompts to code files with comments
- Flexible comment insertion position
- Interactive prompt input support

## Installation

```bash
npm install -g prompt-keeper
```

## Usage

The tool provides two command aliases for easier use:

- `pk`: Short for "prompt-keeper"
- `prompt-keeper`: Full command name

Both commands work exactly the same way. Use whichever you prefer.

### Interactive Mode

```bash
pk i <file-path>
# or
pk interactive <file-path>
# or
prompt-keeper interactive <file-path>
```

The interactive mode guides you through the following steps:

1. Enter your prompt
2. Select an AI model from the available options:
   - Claude 3.5 Sonnet v2
   - O3-mini
   - O3-mini High
   - Gemini 2.0 Flash
   - Gemini 1.5 Pro
   - Gemini 2.0 Experimental Advanced
   - GPT-4o
   - GPT-4o Mini
   - Custom
3. Choose where to add the prompt ID comment:
   - Beginning of file
   - End of file
   - Specific line number

### Command Line Mode

```bash
pk s <file-path> "your prompt" --model <model-name>
# or
pk set <file-path> "your prompt" --model <model-name>
# or
prompt-keeper set <file-path> "your prompt" --model <model-name>
```

#### Options

- `-m, --model <model>`: Specify AI model (e.g., claude-3.5-sonnet-v2)

### Generated Files

The tool generates a prompt file in the same directory as your code file with the format `{filename}.prompt.json`.

Example: For `MyComponent.tsx` → `MyComponent.prompt.json`

```json
{
  "file": "src/MyComponent",
  "prompts": [
    {
      "id": "uuid",
      "prompt": "Implement a counter component in React",
      "model": "claude-3.5-sonnet-v2",
      "createdAt": "2025-02-14T15:00:45.008Z",
      "version": 1
    }
  ]
}
```

It also adds a prompt ID comment to your code file:

```typescript
// prompt-id: uuid
import React from "react";
```

## Development

### Local Setup

```bash
# Clone the repository
git clone https://github.com/kazuya-sakamoto/prompt-keeper.git
cd prompt-keeper

# Install dependencies
npm install

# Link package globally (Option 1)
npm link

# Now you can use the pk command directly
pk i <file-path>

# Or use npm script without linking (Option 2)
npm run pk -- i <file-path>
```

### Build

```bash
npm run build
```

## Requirements

- Node.js >= 14.0.0

## License

MIT © [Kazuya Sakamoto](https://github.com/kazuya-sakamoto)

## Contributing

Issues and Pull Requests are welcome!
