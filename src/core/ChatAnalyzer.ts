import { Chat, ChatMessage } from '../models/Chat';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { config } from '../config/config';
import { createAIClient } from './AIClient';

interface ChatAnalysis {
    topics: string[];
    faqs: string[];
    timeSavings: {
        chatDuration: number;
        traditionalDuration: number;
        timeSaved: number;
        factors: {
            legalResearch: number;
            documentReview: number;
            preparation: number;
            followUp: number;
        };
    };
}

interface ChatUpdate {
    id: string;
    metadata: {
        chatDuration: number;
        complexity: 'low' | 'medium' | 'high';
        topics: string[];
        faqs: string[];
    };
    timeSavings: {
        traditionalDuration: number;
        timeSaved: number;
        factors: {
            legalResearch: number;
            documentReview: number;
            preparation: number;
            followUp: number;
        };
    };
}

export class ChatAnalyzer {
    private model: ChatOpenAI | ChatAnthropic;
    private readonly WORDS_PER_MINUTE = 200;
    private readonly COMPREHENSION_MULTIPLIER = 1.5;
    private readonly RESPONSE_FORMULATION = 2;

    constructor() {    
        this.model = createAIClient(
            config.aiModel,
            config.defaultModel,
            config.temperature
        );
    }

    private calculateChatDuration(messages: ChatMessage[]): number {
        let totalTime = 0;

        for (const message of messages) {
            const wordCount = message.content.split(/\s+/).length;
            const readingTime = (wordCount / this.WORDS_PER_MINUTE) * this.COMPREHENSION_MULTIPLIER;

            if (message.role === 'user') {
                totalTime += readingTime + this.RESPONSE_FORMULATION;
            } else {
                totalTime += readingTime;
            }
        }

        return Math.ceil(totalTime);
    }

    private async extractTopics(messages: ChatMessage[]): Promise<string[]> {
        const prompt = `Analyze the following legal consultation conversation and extract detailed legal topics and sub-topics.
        For each main topic, include:
        1. The primary legal concept
        2. Key sub-topics or related issues
        3. The context or specific aspects discussed
        4. Any jurisdictional considerations mentioned
        
        Format each topic as: "Main Topic: [topic] | Sub-topics: [sub1, sub2] | Context: [context] | Jurisdiction: [jurisdiction]"
        
        Conversation:
        ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`;

        const response = await this.model.invoke(prompt);
        return response.content.toString().split('\n').filter(topic => topic.trim() !== '');
    }

    private async extractFAQs(messages: ChatMessage[]): Promise<string[]> {
        const prompt = `Analyze the following legal consultation conversation and extract the key questions asked.
        Focus on questions that represent common legal queries or concerns.
        Return the questions as a comma-separated list.
        
        Conversation:
        ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`;

        const response = await this.model.invoke(prompt);
        return response.content.toString().split(',').map(faq => faq.trim());
    }

    private calculateTimeSavings(chat: Chat, topics: string[], faqs: string[]): ChatAnalysis['timeSavings'] {
        // Base times for traditional methods (in minutes)
        const baseTimes = {
            legalResearch: 30,
            documentReview: 20,
            preparation: 15,
            followUp: 10
        };

        // Calculate complexity multiplier based on analysis
        const complexityMultiplier = this.calculateComplexityMultiplier(topics, faqs, chat.metadata.complexity);

        // Calculate traditional duration for each factor and round to nearest whole number
        const factors = {
            legalResearch: Math.round(baseTimes.legalResearch * complexityMultiplier),
            documentReview: Math.round(baseTimes.documentReview * complexityMultiplier),
            preparation: Math.round(baseTimes.preparation * complexityMultiplier),
            followUp: Math.round(baseTimes.followUp * complexityMultiplier)
        };

        // Calculate total traditional duration
        const traditionalDuration = Object.values(factors).reduce((sum, time) => sum + time, 0);
        const chatDuration = this.calculateChatDuration(chat.messages);

        return {
            chatDuration,
            traditionalDuration,
            timeSaved: traditionalDuration - chatDuration,
            factors
        };
    }

    private calculateComplexityMultiplier(topics: string[], faqs: string[], complexity: 'low' | 'medium' | 'high'): number {
        let multiplier = 1.0;
        
        // Adjust based on number of topics
        multiplier += (topics.length - 1) * 0.2;
        
        // Adjust based on number of FAQs
        multiplier += (faqs.length - 1) * 0.1;
        
        // Adjust based on chat complexity
        if (complexity === 'high') multiplier *= 1.5;
        if (complexity === 'medium') multiplier *= 1.2;
        
        return multiplier;
    }

    async analyze(chat: Chat): Promise<ChatAnalysis> {
        const [topics, faqs] = await Promise.all([
            this.extractTopics(chat.messages),
            this.extractFAQs(chat.messages)
        ]);

        const timeSavings = this.calculateTimeSavings(chat, topics, faqs);

        return {
            topics,
            faqs,
            timeSavings
        };
    }

    async analyzeForUpdate(chat: Chat): Promise<ChatUpdate> {
        const analysis = await this.analyze(chat);
        const chatDuration = this.calculateChatDuration(chat.messages);
        const timeSavings = this.calculateTimeSavings(chat, analysis.topics, analysis.faqs);

        return {
            id: chat.id,
            metadata: {
                chatDuration,
                complexity: chat.metadata.complexity,
                topics: analysis.topics,
                faqs: analysis.faqs
            },
            timeSavings
        };
    }
} 