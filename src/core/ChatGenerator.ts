import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { Chat, ChatContext, ChatMessage, ChatMetadata } from '../models/Chat';
import { config } from '../config/config';
import { v4 as uuidv4 } from 'uuid';
import { ChatStorage } from '../chatStorage/ChatStorage';

/*
 * Sample Chat for reference
 * {
  id: "chat_123",
  legalFocus: "commercial_contracts",
  context: {
    scenario: "Reviewing a software licensing agreement for a startup",
    userRole: "in-house counsel",
    expertiseLevel: "intermediate",
    jurisdiction: "California"
  },
  messages: [
    {
      role: "user",
      content: "What are the key clauses I should look for in this software licensing agreement?",
      timestamp: "2024-04-26T12:00:00Z",
      messageType: "question"
    },
    {
      role: "assistant",
      content: "The most critical clauses to review are: 1) License Grant...",
      timestamp: "2024-04-26T12:01:00Z",
      messageType: "answer"
    }
  ],
  metadata: {
    createdAt: "2024-04-26T12:00:00Z",
    estimatedDuration: 15,
    complexity: "medium"
  }
}
 */
export class ChatGenerator {
    private model: ChatOpenAI;
    private focus: 'commercial_contracts' | 'privacy';

    constructor(focus: 'commercial_contracts' | 'privacy') {
        // Initialize OpenAI model
        this.model = new ChatOpenAI({
            modelName: config.defaultModel,
            temperature: 0.7,
        });
        this.focus = focus;
    }

    private async generateSystemPrompt(context: ChatContext): Promise<string> {
        const frameworks = config.legalFrameworks[this.focus];
        const expertiseConfig = config.expertiseLevels[context.expertiseLevel as keyof typeof config.expertiseLevels];

        return `You are a legal AI assistant specializing in ${this.focus} with expertise in ${context.jurisdiction} law.
        The user is a ${context.expertiseLevel} level ${context.userRole}.
        Consider the following legal frameworks in your responses: ${frameworks.join(', ')}.
        
        Adjust your responses based on the user's expertise level:
        - Explanation depth: ${expertiseConfig.explanationDepth}
        - Terminology level: ${expertiseConfig.terminologyLevel}
        - Citation frequency: ${expertiseConfig.citationFrequency}
        
        When discussing legal concepts, focus on ${context.jurisdiction} law and regulations.
        Generate a realistic legal consultation conversation that matches the user's role and expertise level.`;
    }

    private async generateUserMessage(context: ChatContext): Promise<string> {
        const existingChats = await ChatStorage.getChatsByFocus(this.focus);
        const existingQuestions = existingChats.flatMap(chat => 
            chat.messages.filter(m => m.role === 'user').map(m => m.content)
        );

        const prompt = `Generate a realistic legal question or scenario for a ${context.expertiseLevel} level 
        ${context.userRole} about ${this.focus} in ${context.jurisdiction}. The question should be significantly different from these existing questions:
        ${existingQuestions.join('\n')}
        
        Make sure the new question:
        1. Is appropriate for a ${context.expertiseLevel} level ${context.userRole}
        2. Covers a different aspect of ${this.focus}
        3. Has a different context or scenario
        4. Addresses different legal considerations
        5. Is relevant to ${context.jurisdiction} law`;

        const response = await this.model.invoke(prompt);
        return response.content.toString();
    }

    private async generateAssistantResponse(
        context: ChatContext,
        userMessage: string
    ): Promise<string> {
        const systemPrompt = await this.generateSystemPrompt(context);
        const response = await this.model.invoke([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ]);
        return response.content.toString();
    }

    async generateChat(context: ChatContext): Promise<Chat> {
        const chatId = uuidv4();
        const messages: ChatMessage[] = [];
        const now = new Date().toISOString();

        // Generate initial user message
        const userMessage = await this.generateUserMessage(context);
        messages.push({
            role: 'user',
            content: userMessage,
            timestamp: now,
            messageType: 'question'
        });

        // Generate assistant response
        const assistantResponse = await this.generateAssistantResponse(context, userMessage);
        messages.push({
            role: 'assistant',
            content: assistantResponse,
            timestamp: new Date(Date.now() + 60000).toISOString(), // 1 minute later
            messageType: 'answer'
        });

        // Generate follow-up questions and responses
        for (let i = 0; i < 2; i++) {
            const followUpPrompt = `Generate a follow-up question based on the previous conversation:
            User: ${userMessage}
            Assistant: ${assistantResponse}`;

            const followUp = await this.model.invoke(followUpPrompt);
            const followUpContent = followUp.content.toString();
            
            messages.push({
                role: 'user',
                content: followUpContent,
                timestamp: new Date(Date.now() + (i + 2) * 60000).toISOString(),
                messageType: 'follow-up'
            });

            const followUpResponse = await this.generateAssistantResponse(context, followUpContent);
            messages.push({
                role: 'assistant',
                content: followUpResponse,
                timestamp: new Date(Date.now() + (i + 3) * 60000).toISOString(),
                messageType: 'answer'
            });
        }

        return {
            id: chatId,
            legalFocus: this.focus,
            context,
            messages,
            metadata: {
                createdAt: now,
                chatDuration: 15, // Default 15 minutes for AI consultation
                complexity: 'medium'
            },
            timeSavings: {
                traditionalDuration: 60, // Default 1 hour for traditional methods
                timeSaved: 45,          // Default 45 minutes saved
                factors: {
                    legalResearch: 30,
                    documentReview: 15,
                    preparation: 10,
                    followUp: 5
                }
            }
        };
    }
} 