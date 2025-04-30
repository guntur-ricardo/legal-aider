import { ChatAnalyzer } from '../core/ChatAnalyzer';
import { ChatStorage } from '../chatStorage/ChatStorage';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
    if (!process.env.OPENAI_API_KEY) {
        console.error('Error: OPENAI_API_KEY is not set in environment variables');
        process.exit(1);
    }

    const focus = process.argv[2] as 'commercial_contracts' | 'privacy';
    if (!focus || !['commercial_contracts', 'privacy'].includes(focus)) {
        console.error('Error: Please provide a valid legal focus (commercial_contracts or privacy)');
        process.exit(1);
    }

    const chatId = process.argv[3]; // Optional chat ID

    const analyzer = new ChatAnalyzer();
    const chats = await ChatStorage.getChatsByFocus(focus);

    if (chatId) {
        // Analyze specific chat
        const chat = chats.find(c => c.id === chatId);
        if (!chat) {
            console.error(`Error: Chat with ID ${chatId} not found`);
            process.exit(1);
        }

        console.log(`\nAnalyzing chat ${chatId}...`);
        const analysis = await analyzer.analyze(chat);
        
        console.log('\nTopics:');
        analysis.topics.forEach(topic => console.log(`- ${topic}`));
        
        console.log('\nFAQs:');
        analysis.faqs.forEach(faq => console.log(`- ${faq}`));

        console.log('\nTime Savings Analysis:');
        console.log(`- AI Chat Duration: ${analysis.timeSavings.chatDuration} minutes`);
        console.log(`- Traditional Method Duration: ${analysis.timeSavings.traditionalDuration} minutes`);
        console.log(`- Time Saved: ${analysis.timeSavings.timeSaved} minutes`);
        
        console.log('\nTraditional Method Breakdown:');
        console.log(`- Legal Research: ${analysis.timeSavings.factors.legalResearch} minutes`);
        console.log(`- Document Review: ${analysis.timeSavings.factors.documentReview} minutes`);
        console.log(`- Preparation: ${analysis.timeSavings.factors.preparation} minutes`);
        console.log(`- Follow-up: ${analysis.timeSavings.factors.followUp} minutes`);
    } else {
        // Analyze all chats for the focus
        console.log(`\nAnalyzing all ${chats.length} chats for ${focus}...`);
        
        for (const chat of chats) {
            console.log(`\nAnalyzing chat ${chat.id}...`);
            const analysis = await analyzer.analyze(chat);
            
            console.log('\nTopics:');
            analysis.topics.forEach(topic => console.log(`- ${topic}`));
            
            console.log('\nFAQs:');
            analysis.faqs.forEach(faq => console.log(`- ${faq}`));
        }
    }
}

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
}); 