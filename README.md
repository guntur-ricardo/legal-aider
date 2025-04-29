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
  - `ChatGenerator`: Handles synthetic chat generation using LangChain
  - `LegalFocusManager`: Manages different legal focus areas (commercial contracts, privacy)
  - `ChatStorage`: Handles storage of generated chats (local storage for now)
- **Configuration**
  - AI model configuration (GPT/Claude)
  - Legal focus area templates
  - Chat generation parameters
- **Current Status**: ✅ In Progress
  - Chat generation with varied expertise levels and jurisdictions
  - Local storage implementation
  - Basic focus area management

### Phase 2: Chat Analysis (Planned)
- **Core Components**
  - `ChatAnalyzer`: Processes individual chats
  - `InsightExtractor`: Identifies key topics and FAQs
  - `TimeSavingsCalculator`: Estimates time savings
    - Tracks two key metrics:
      - `chatDuration`: Time spent in AI consultation
      - `traditionalDuration`: Estimated time for equivalent traditional research
    - Calculates time savings: `traditionalDuration - chatDuration`
    - Considers factors for traditional duration:
      - Legal research time
      - Document review time
      - Consultation preparation
      - Follow-up communication
- **Features**
  - Topic extraction
  - FAQ identification
  - Time savings estimation
  - Analysis storage
- **Status**: ⏳ Planned

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
│   │   └── ChatAnalyzer.ts
│   │   └── ReportGenerator.ts
│   ├── models/         # Type definitions
│   │   └── Chat.ts
│   │   └── Analysis.ts
│   │   └── Report.ts
│   ├── chatStorage/    # Chat persistence
│   │   └── ChatStorage.ts
│   │   └── legalChats.json
│   │   └── archivedLegalChats.json
│   └── scripts/        # CLI tools
│       ├── generateChat.ts
│       └── archiveChats.ts
├── config/             # Configuration files
│   └── config.ts
└── package.json
```

## Contributing

[Placeholder for contribution guidelines]

## License

[Placeholder for license information]