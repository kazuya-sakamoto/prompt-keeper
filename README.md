# prompt-keeper 🚀

> A CLI tool for managing AI prompts linked to code files, making your AI-assisted development traceable and maintainable.

[![npm version](https://badge.fury.io/js/prompt-keeper.svg)](https://www.npmjs.com/package/prompt-keeper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

## Why prompt-keeper? 🤔

- 📝 **Track Your AI Conversations**: Keep a history of all AI prompts used in your codebase
- 🔍 **Code Traceability**: Easily find which AI prompts generated specific code sections
- 🤖 **Multi-Model Support**: Works with popular AI models (Claude, GPT-4, Gemini, etc.)
- 🎯 **Developer Friendly**: Simple CLI interface with interactive mode

## Quick Demo

![terminal](https://github.com/user-attachments/assets/a62cf820-edf5-47c6-baf6-fc1483d763e1)

## Quick Start 🚀

```bash
# Install globally
npm install -g prompt-keeper

# Start using with interactive mode
pk i your-file.ts
```

[View full documentation](https://github.com/kazuya-sakamoto/prompt-keeper#readme)

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
  "file": "test/MyComponent.tsx",
  "prompts": [
    {
      "id": "8ffd78c0-d00c-433d-a8d5-af111cc79020",
      "prompt": "This is a test prompt, and it's a library that can manage what kind of prompts were used to implement code in the past. This is a sample saved prompt.",
      "model": "o3-mini",
      "createdAt": "2025-02-15T02:00:22.206Z",
      "version": 1
    },
    {
      "id": "b19e27f8-9b25-4c2f-a011-da3898206f82",
      "prompt": "Implement memoization for this component",
      "model": "o3-mini-high",
      "createdAt": "2025-02-15T12:10:18.760Z",
      "version": 2
    }
  ]
}
```

It also adds a prompt ID comment to your code file:

```typescript
import React, { memo } from "react";

// prompt-id: 8ffd78c0-d00c-433d-a8d5-af111cc79020
const MyComponent: React.FC = () => {
  return (
    <div>
      <h1>Test Component</h1>
    </div>
  );
};

// prompt-id: b19e27f8-9b25-4c2f-a011-da3898206f82
export default memo(MyComponent);
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
