import { ChatGenerator } from '../core/ChatGenerator';
import { ChatContext } from '../models/Chat';
import { ChatStorage } from '../chatStorage/ChatStorage';
import * as dotenv from 'dotenv';
import { config } from '../config/config';

// Load environment variables
dotenv.config();

const expertiseLevels = ['beginner', 'intermediate', 'expert'] as const;
const jurisdictions = ['California', 'New York', 'Texas', 'Delaware', 'Illinois'] as const;
const userRoles = ['in-house counsel', 'startup founder', 'legal consultant'] as const;

async function main() {
    // Check for required API key
    if (config.aiModel === 'openai' && !process.env.OPENAI_API_KEY) {
        console.error('Error: OPENAI_API_KEY is not set in environment variables');
        process.exit(1);
    } else if (config.aiModel === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
        console.error('Error: ANTHROPIC_API_KEY is not set in environment variables');
        process.exit(1);
    }

    const focus = process.argv[2] as 'commercial_contracts' | 'privacy';
    if (!focus || !['commercial_contracts', 'privacy'].includes(focus)) {
        console.error('Error: Please provide a valid legal focus (commercial_contracts or privacy)');
        process.exit(1);
    }

    const numChats = parseInt(process.argv[3] || '1', 10);
    if (isNaN(numChats) || numChats < 1) {
        console.error('Error: Please provide a valid number of chats to generate (>= 1)');
        process.exit(1);
    }

    const chatGenerator = new ChatGenerator(focus);
    console.log(`Generating ${numChats} chats for ${focus} with varied expertise levels and jurisdictions...`);

    for (let i = 0; i < numChats; i++) {
        const context: ChatContext = {
            userRole: userRoles[i % userRoles.length],
            expertiseLevel: expertiseLevels[i % expertiseLevels.length],
            jurisdiction: jurisdictions[i % jurisdictions.length]
        };

        console.log(`\nGenerating chat ${i + 1}/${numChats} with:`);
        console.log(`- Role: ${context.userRole}`);
        console.log(`- Expertise: ${context.expertiseLevel}`);
        console.log(`- Jurisdiction: ${context.jurisdiction}`);

        const chat = await chatGenerator.generateChat(context);
        await ChatStorage.saveChat(chat);
        console.log('Chat saved successfully!');
    }
}

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
}); 