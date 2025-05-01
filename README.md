# Legal Aider

A legal consultation AI assistant that generates, analyzes, and reports on legal conversations to help legal teams understand common queries and estimate time savings.

## Overview

Legal Aider is a comprehensive tool that:
1. Generats realistic legal consultation conversations
2. Analyzes these conversations to extract insights, FAQs, time savings estimates
3. Generates reports with visualizations 

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
│   ├── email/          # Email templates and assets
│   │   ├── LegalAnalysisEmail.tsx
│   │   ├── legal-analysis.html
│   │   └── gc-ai-logo.png
│   └── scripts/        # CLI tools
│       ├── generateChat.ts
│       ├── analyzeAndUpdateChats.ts
│       ├── archiveChats.ts
│       └── generate-email.ts
├── config/             # Configuration files
│   └── config.ts
└── package.json
```

## Project Phases

### Phase 1: Synthetic Chat Generation
- **Core Components**
  - `ChatGenerator`: Handles synthetic chat generation using LangChain and is configurable via role, expertise and jurisdiction.
  - `ChatStorage`: Handles storage of generated chats (local storage for now)
- **Configuration**
  - AI model configuration (GPT/Claude)
  - Legal focus area templates
  - Chat generation parameters
- **Key Architectural Decisions & Trade-offs**
  - Single Chat Generation: Each chat is generated with a dedicated AI invocation
    - ✅ Maximizes AI focus on generating high-quality interactions
    - ❌ Increases number of API requests and associated costs
  - Context-Aware Generation: Includes existing chats when generating new ones
    - ✅ Ensures variety and prevents repetitive conversations
    - ❌ Larger context per request increases token usage
  - Local JSON Storage: Simple file-based storage for chats
    - ✅ Easy to implement and inspect chat data
    - ✅ Maintains chat structure with metadata
    - ❌ Not suitable for production/concurrent access
  - Modular Parameter System: Configurable roles, expertise levels, and jurisdictions
    - ✅ Highly flexible chat generation
    - ✅ Easy to extend with new parameters
    - ❌ Increased complexity in parameter validation
- **Current Status**: ✅ Implemented

### Phase 2: Chat Analysis
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
- **Key Architectural Decisions & Trade-offs**
  - LLM-Based Analysis: Using LLMs for topic and FAQ extraction
    - ✅ High-quality, context-aware analysis
    - ✅ Natural language understanding capabilities
    - ❌ Higher computational cost and latency
  - Time-Based Metrics: Focus on time savings calculations
    - ✅ Tangible value proposition for stakeholders
    - ✅ Standardized methodology for comparison
    - ❌ May not capture all aspects of value (e.g., quality, accuracy)
    - NOTE: I would personally do some case studies with lawyers to fine tune time calculation.
  - Metadata Storage: Analysis results stored within chat objects
    - ✅ Maintains data cohesion
    - ✅ Easy to access analysis results with chat data
    - ❌ Increased storage requirements
- **Status**: ✅ Implemented

### Phase 3: Report Generation
- **Core Components**
  - `ReportGenerator`: Creates email reports
  - `Chart`: Creates charts/graphs
  - `LegalAnalysisEmail`: React-Email templates
- **Features**
  - Data Summary generation and compilation
  - Visual data representation
  - Email formatting
- **Key Architectural Decisions & Trade-offs**
  - SVG-Based Charts: Custom SVG implementation for data visualization
    - ✅ No external dependencies
    - ✅ Consistent rendering across email clients
    - ❌ More complex to implement than using chart libraries
  - Static HTML Output: Generating static HTML files for preview
    - ✅ Easy to preview and test
    - ✅ Can be used as email templates
    - ❌ Requires regeneration for data updates
    NOTE: I basically did this just to demo it. Real world generation would be in some email service that has access to the report endpoint.
- **Status**: ✅ Implemented

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API key (if using OpenAI)
- Anthropic API key (if using Anthropic)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your API keys:
   ```
   # Required for OpenAI
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Required for Anthropic
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

### Usage

#### Generating Chats
Generate legal consultation chats with varied expertise levels and jurisdictions:

```bash
# Generate a single chat
npm run generate-chat commercial_contracts

# Generate multiple chats
npm run generate-chat commercial_contracts 5
npm run generate-chat privacy 10
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

#### Email Reports

The system can generate professional email reports summarizing legal consultations and time savings. These reports are created using React Email templates and can be previewed in the browser.

##### Setup

The email template is located at `src/email/LegalAnalysisEmail.tsx`
   - Uses React Email components for consistent email rendering
   - Implements a responsive design with Tailwind CSS
   - Includes sections for:
     - Main topics discussed
     - Time savings analysis
     - Common legal questions
   - Features professional styling with the brand color (#0E1F45)

##### Generating Email Reports

To generate an HTML preview of the email report:

```bash
npm run generate-email
```

This will:
1. Load chat data from `legalChats.json`
2. Generate a report using `ReportGenerator`
3. Transform the data for the email template
4. Render the email as HTML
5. Save the output to `src/email/legal-analysis.html`

The generated HTML file can be:
- Previewed in a browser
- Used as a template for email campaigns
- Shared with stakeholders

##### Email Template Features

- Professional layout with brand colors
- Responsive design for all email clients
- Data visualization placeholders for:
  - Topic distribution
  - Time savings comparison
  - Question type analysis
- Detailed time savings analysis with methodology explanation
- Contextual summaries of legal topics and FAQs

#### Managing Chats
Archive and clear chats for a specific legal focus:

```bash
npm run archive-chats commercial_contracts
```

#### Demo!
```bash
npm run demo
```
This will:
1. Archive any existing chats for both privacy and commercial_contracts
2. Generate 10 new chats for each focus area with varied:
   - Expertise levels (beginner, intermediate, expert)
   - User roles (in-house counsel, startup founder, legal consultant)
   - Jurisdictions (CA, NY, TX, DE, IL)
3. Analyze the generated chats to extract:
   - Key legal topics and themes
   - Common questions and answers
   - Time savings estimates
4. Generate email reports for each focus area:
   - `legal-analysis-privacy.html`
   - `legal-analysis-commercial_contracts.html`


## Contributing

[Placeholder for contribution guidelines]

## License

[Placeholder for license information]
