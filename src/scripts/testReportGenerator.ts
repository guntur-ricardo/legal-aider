import * as dotenv from 'dotenv';
dotenv.config();

import { ReportGenerator } from '../core/ReportGenerator';

async function main() {
    // Check for OpenAI API key    
    if (!process.env.OPENAI_API_KEY) {
        console.error('Error: OPENAI_API_KEY is not set in environment variables');
        process.exit(1);
    }

    const focus = process.argv[2] as 'commercial_contracts' | 'privacy';
    if (!focus || !['commercial_contracts', 'privacy'].includes(focus)) {
        console.error('Error: Please provide a valid legal focus (commercial_contracts or privacy)');
        process.exit(1);
    }

    const reportGenerator = new ReportGenerator();
    const chats = await reportGenerator['chatStorage'].loadChats(focus);

    console.log(`\nAnalyzing ${chats.length} chats for ${focus}...`);

    // Test topic analysis
    // console.log('\n=== Topic Analysis ===');
    // const topics = await reportGenerator['analyzeTopics'](chats);
    // console.log(JSON.stringify(topics, null, 2));

    // Test FAQ analysis
    console.log('\n=== FAQ Analysis ===');
    const faqs = await reportGenerator['analyzeFAQs'](chats);
    console.log(JSON.stringify(faqs, null, 2));
}

main().catch(console.error); 