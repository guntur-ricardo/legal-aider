import { ReportGenerator } from '../core/ReportGenerator';
import { ChatStorage } from '../chatStorage/ChatStorage';
import { LegalAnalysisEmail } from '../email/LegalAnalysisEmail';
import { render } from '@react-email/render';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

type LegalFocus = 'commercial_contracts' | 'privacy';

async function generateAndPreviewEmail(focus: LegalFocus) {
  try {
    // Generate report data
    // const storage = new ChatStorage();
    // await storage.loadChats(focus);
    const generator = new ReportGenerator();
    const report = await generator.generateReport(focus);
     
    // Transform report data for email
    const emailData = {
      topics: report.topics.topics.map(topic => ({
        name: topic.name,
        themes: topic.themes,
        frequency: topic.frequency,
        exampleTopics: topic.exampleTopics
      })),
      faqs: report.faqs.faqs.map(faq => ({
        theme: faq.theme,
        representativeQuestion: faq.representativeQuestion,
        count: faq.count,
        similarQuestions: faq.similarQuestions
      })),
      timeSavings: {
        summary: {
          totalTimeSaved: report.timeSavings.summary.totalTimeSaved,
          averageTimeSavedPerChat: report.timeSavings.summary.averageTimeSavedPerChat,
          totalTraditionalTime: report.timeSavings.summary.totalTraditionalTime,
          totalAITime: report.timeSavings.summary.totalAITime
        },
        perChat: report.timeSavings.perChat.map(chat => ({
          chatId: chat.chatId,
          chatDuration: chat.chatDuration,
          traditionalDuration: chat.traditionalDuration,
          timeSaved: chat.timeSaved,
          factors: chat.factors
        }))
      },
      chartData: report.chartData,
      focus: focus
    };

    // Render email
    const emailHtml = await render(LegalAnalysisEmail(emailData));

    // Save to file in email folder with focus in filename
    const outputPath = path.join(__dirname, `../email/legal-analysis-${focus}.html`);
    fs.writeFileSync(outputPath, emailHtml);

    console.log(`Email preview generated at: ${outputPath}`);
    console.log('Open this file in your browser to view the email.');
  } catch (error) {
    console.error('Failed to generate email preview:', error);
    process.exit(1);
  }
}

// Get focus from command line arguments
const focus = process.argv[2] as LegalFocus;
if (!focus || (focus !== 'commercial_contracts' && focus !== 'privacy')) {
  console.error('Please provide a valid focus: commercial_contracts or privacy');
  process.exit(1);
}

// Run the email generation
generateAndPreviewEmail(focus); 