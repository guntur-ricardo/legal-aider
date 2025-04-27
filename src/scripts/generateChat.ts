import { ChatGenerator } from '../core/ChatGenerator';
import { ChatContext } from '../models/Chat';
import { ChatStorage } from '../chatStorage/ChatStorage';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
        console.error('Error: OPENAI_API_KEY is not set in environment variables');
        process.exit(1);
    }

    const numChats = parseInt(process.argv[2] || '1', 10);
    if (isNaN(numChats) || numChats < 1) {
        console.error('Error: Please provide a valid number of chats to generate (>= 1)');
        process.exit(1);
    }

    const chatGenerator = new ChatGenerator('commercial_contracts');

    const context: ChatContext = {        
        userRole: 'in-house counsel',
        expertiseLevel: 'intermediate',
        jurisdiction: 'California'
    };

    console.log(`Generating ${numChats} chat(s)...`);
    for (let i = 0; i < numChats; i++) {
        const chat = await chatGenerator.generateChat(context);
        await ChatStorage.saveChat(chat);
        console.log(`Chat ${i + 1}/${numChats} saved successfully!`);
    }
}

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
}); 