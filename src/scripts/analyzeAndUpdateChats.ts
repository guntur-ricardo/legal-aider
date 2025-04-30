import * as dotenv from 'dotenv';
dotenv.config();

import { ChatStorage } from '../chatStorage/ChatStorage';
import { ChatAnalyzer } from '../core/ChatAnalyzer';
import { Chat } from '../models/Chat';

async function analyzeAndUpdateChats(focus: 'commercial_contracts' | 'privacy', dryRun: boolean = false) {    
    console.log(`Starting analysis${dryRun ? ' (DRY RUN - no updates will be made)' : ''} for ${focus} chats...`);
    
    const chatStorage = new ChatStorage();
    const chatAnalyzer = new ChatAnalyzer();
    
    try {
        // Load all chats for the specified focus
        const chats = await chatStorage.loadChats(focus);
        console.log(`Found ${chats.length} chats to analyze`);
        
        // Process each chat
        for (const chat of chats) {
            console.log(`\nAnalyzing chat ${chat.id}...`);
            
            try {
                // Get the update data from analyzer
                const updateData = await chatAnalyzer.analyzeForUpdate(chat);
                
                // Log the analysis results
                console.log('\nAnalysis Results:');
                console.log('Topics:');
                updateData.metadata.topics.forEach(topic => console.log(`- ${topic}`));
                
                console.log('\nFAQs:');
                updateData.metadata.faqs.forEach(faq => console.log(`- ${faq}`));
                
                console.log('\nTime Savings:');
                console.log(`- AI Chat Duration: ${updateData.metadata.chatDuration} minutes`);
                console.log(`- Traditional Method Duration: ${updateData.timeSavings.traditionalDuration} minutes`);
                console.log(`- Time Saved: ${updateData.timeSavings.timeSaved} minutes`);
                
                console.log('\nTraditional Method Breakdown:');
                console.log(`- Legal Research: ${updateData.timeSavings.factors.legalResearch} minutes`);
                console.log(`- Document Review: ${updateData.timeSavings.factors.documentReview} minutes`);
                console.log(`- Preparation: ${updateData.timeSavings.factors.preparation} minutes`);
                console.log(`- Follow-up: ${updateData.timeSavings.factors.followUp} minutes`);
                
                if (!dryRun) {
                    // Update the chat with new analysis
                    await chatStorage.updateChat(focus, chat.id, {
                        metadata: {
                            ...chat.metadata,
                            chatDuration: updateData.metadata.chatDuration,
                            complexity: updateData.metadata.complexity,
                            topics: updateData.metadata.topics,
                            faqs: updateData.metadata.faqs
                        },
                        timeSavings: updateData.timeSavings
                    });
                    console.log(`✓ Successfully updated chat ${chat.id}`);
                } else {
                    console.log(`[DRY RUN] Would update chat ${chat.id}`);
                }
                
            } catch (error) {
                console.error(`Error analyzing chat ${chat.id}:`, error);
                continue; // Continue with next chat even if one fails
            }
        }
        
        console.log(`\nAnalysis${dryRun ? ' (DRY RUN)' : ''} completed successfully!`);
        
    } catch (error) {
        console.error('Error during analysis and update process:', error);
        process.exit(1);
    }
}

// Get focus and dry run flag from command line arguments
const focus = process.argv[2] as 'commercial_contracts' | 'privacy';
const dryRun = process.argv[3] === 'true';

if (!focus || !['commercial_contracts', 'privacy'].includes(focus)) {
    console.error('Please specify a valid focus: commercial_contracts or privacy');
    process.exit(1);
}

// Run the analysis
analyzeAndUpdateChats(focus, dryRun); 