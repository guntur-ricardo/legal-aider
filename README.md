# Legal Aider

A legal consultation AI assistant that generates, analyzes, and reports on legal conversations to help legal teams understand common queries and estimate time savings.

## Overview

Legal Aider is a comprehensive tool that helps legal teams by:
1. Generating realistic legal consultation conversations
2. Analyzing these conversations to extract insights, FAQs, time savings estimates
3. Generating reports with visualizations 

## Project Phases

### Phase 1: Synthetic Chat Generation (Current)
- **Core Components**
  - `ChatGenerator`: Handles synthetic chat generation using LangChain and is configurable via role, expertise and jurisdiction.
  - `ChatStorage`: Handles storage of generated chats (local storage for now)
- **Configuration**
  - AI model configuration (GPT/Claude)
  - Legal focus area templates
  - Chat generation parameters
- **Current Status**: ✅ Implemented

### Phase 2: Chat Analysis (Current)
- **Core Components**
  - `ChatAnalyzer`: Single class handling all analysis aspects
    - Topic Extraction: Uses LLM to identify key legal topics discussed
    - FAQ Generation: Uses LLM to extract common questions and answers
    - Time Analysis: Calculates two key metrics:
      - `chatDuration`: Estimated time spent in AI consultation
        - Based on word count and reading speed
        - Includes comprehension and response formulation time
      - `traditionalDuration`: Estimated time for traditional research
        - Considers legal research time
        - Includes document review and consultation preparation
      - Calculates time savings: `traditionalDuration - chatDuration`
- **Features**
  - LLM-powered topic and FAQ extraction
  - Standardized time calculations
  - Analysis results stored in chat metadata
- **Status**: ✅ Implemented

### Phase 3: Report Generation (Planned)
- **Core Components**
  - `ReportGenerator`: Creates email reports
  - `VisualizationBuilder`: Creates charts/graphs
  - `EmailTemplate`: React-Email templates
- **Features**
  - Summary generation
  - Visual data representation
  - Email formatting
- **Status**: ⏳ Planned

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API key

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Usage

#### Generating Chats
Generate legal consultation chats with varied expertise levels and jurisdictions:

```bash
# Generate a single chat
npm run generate-chat commercial_contracts

# Generate multiple chats
npm run generate-chat commercial_contracts 5
npm run generate-chat privacy 3
```

#### Analyzing Chats
Analyze chats to extract insights, FAQs, and time savings estimates:

```bash
# Run analysis in dry-run mode (preview without saving)
npm run analyze-chats commercial_contracts --dry-run
```

The analysis will:
1. Extract key topics and FAQs from the conversation
2. Calculate chat duration based on message content
3. Estimate traditional research time
4. Calculate potential time savings
5. Update the chat metadata with analysis results

#### Managing Chats
Archive and clear chats for a specific legal focus:

```bash
npm run archive-chats commercial_contracts
```

## Project Structure

```
legal-aider/
├── src/
│   ├── main.ts
│   ├── core/           # Core functionality
│   │   ├── ChatGenerator.ts
│   │   ├── ChatAnalyzer.ts
│   │   └── ReportGenerator.ts
│   ├── models/         # Type definitions
│   │   ├── Chat.ts
│   │   ├── Analysis.ts
│   │   └── Report.ts
│   ├── chatStorage/    # Chat persistence
│   │   ├── ChatStorage.ts
│   │   ├── legalChats.json
│   │   └── archivedLegalChats.json
│   └── scripts/        # CLI tools
│       ├── generateChat.ts
│       ├── analyzeAndUpdateChats.ts
│       └── archiveChats.ts
├── config/             # Configuration files
│   └── config.ts
└── package.json
```

## Contributing

[Placeholder for contribution guidelines]

## License

[Placeholder for license information]