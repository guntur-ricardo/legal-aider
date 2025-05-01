import { Chat } from '../models/Chat';
import { ChatStorage } from '../chatStorage/ChatStorage';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { config } from '../config/config';
import { createAIClient } from './AIClient';

interface TopicAnalysis {
    topics: {
        name: string;
        themes: string[];
        frequency: number;
        exampleTopics: string[];
    }[];
}

interface FAQAnalysis {
    faqs: {
        theme: string;
        representativeQuestion: string;
        count: number;
        similarQuestions: string[];
    }[];
}

interface TimeSavingsData {
    summary: {
        totalTimeSaved: number;
        averageTimeSavedPerChat: number;
        totalTraditionalTime: number;
        totalAITime: number;
    };
    perChat: {
        chatId: string;
        chatDuration: number;
        traditionalDuration: number;
        timeSaved: number;
        factors: {
            legalResearch: number;
            documentReview: number;
            preparation: number;
            followUp: number;
        };
    }[];
}

interface ChartData {
    type: 'pie' | 'bar';
    data: {
        labels: string[];
        values: number[];
    };
    title: string;
}

interface Report {
    topics: TopicAnalysis;
    faqs: FAQAnalysis;
    timeSavings: TimeSavingsData;
    chartData: ChartData[];
    emailTemplate: any;  // Will be React-Email template
}

export class ReportGenerator {
    private chatStorage: ChatStorage;
    private model: ChatOpenAI | ChatAnthropic;

    constructor() {
        this.chatStorage = new ChatStorage();
        this.model = createAIClient(
            config.aiModel,
            config.defaultModel,
            config.temperature
        );
    }

    async generateReport(focus: 'commercial_contracts' | 'privacy'): Promise<Report> {
        // 1. Load all analyzed chats
        const chats = await this.chatStorage.loadChats(focus);
        
        // 2. Process topics and FAQs
        console.log(`Analyzing topics and FAQs for ${focus} chats...`);
        const topics = await this.analyzeTopics(chats);
        const faqs = await this.analyzeFAQs(chats);
        
        // 3. Calculate time savings
        const timeSavings = this.calculateTimeSavings(chats);
        
        // 4. Generate visualizations
        const chartData = this.generateChartData(topics, faqs, timeSavings);
        
        // 5. Create email template
        const emailTemplate = this.createEmailTemplate(topics, faqs, timeSavings, chartData);
        
        return {
            topics,
            faqs,
            timeSavings,            
            chartData,
            emailTemplate
        };
    }

    private cleanJsonResponse(response: string): string {
        // Remove markdown code block syntax if present
        return response.replace(/```json\n?|\n?```/g, '').trim();
    }

    private async analyzeTopics(chats: Chat[]): Promise<TopicAnalysis> {
        // Extract all topics from chats
        const allTopics = chats.flatMap(chat => chat.metadata.topics || []);

        // Create prompt for topic analysis
        const prompt = `Analyze these legal topics and group them into 3-5 main categories. 
For each category, provide:
1. Category name: A broad legal area or concept
2. Key themes: High-level legal concepts or principles (2-3 themes)
3. Frequency of occurrence: How many times this category appears
4. Example topics: Specific instances from the provided topics that illustrate this category

Themes should be broad legal concepts, while example topics should be specific instances from the list.

Topics to analyze:
${allTopics.join('\n')}

Return the response in JSON format matching this structure exactly. Do not include any other text or comments:
{
    "topics": [
        {
            "name": "string",  // Broad legal area
            "themes": ["string"],  // 2-3 high-level concepts
            "frequency": number,
            "exampleTopics": ["string"]  // Specific instances from the list
        }
    ]
}`;

        try {
            const response = await this.model.invoke(prompt);
            const cleanedResponse = this.cleanJsonResponse(response.content.toString());            
            return JSON.parse(cleanedResponse);
        } catch (error) {
            console.error('Error analyzing topics:', error);            
            throw error;
        }
    }

    private async analyzeFAQs(chats: Chat[]): Promise<FAQAnalysis> {
        // Extract all questions from chats
        const allQuestions = chats.flatMap(chat => 
            chat.messages
                .filter(msg => msg.role === 'user' && msg.messageType === 'question')
                .map(msg => msg.content)
        );

        // Create prompt for FAQ analysis
        const prompt = `Analyze these legal questions to demonstrate the capabilities of an AI legal assistant.
Focus on showing the breadth of legal expertise and practical value to legal teams.

For each group:
1. Identify a core legal concept that would be valuable to legal teams
2. Provide a representative question that:
   - Shows the sophistication of queries handled
   - Is specific enough to demonstrate expertise
   - Is general enough to be relevant to many legal teams
3. Count ONLY the exact matches or very close variations
4. Include 2-3 similar questions that show the range of applications

Questions to analyze:
${allQuestions.join('\n')}

Return the response in JSON format matching this structure exactly. Do not include any other text or comments:
{
    "faqs": [
        {
            "theme": "string",  // Core legal concept valuable to legal teams
            "representativeQuestion": "string",  // Balanced between specific and general
            "count": number,  // Only exact or very close matches
            "similarQuestions": ["string"]  // 2-3 examples showing range
        }
    ]
}`;

        try {
            const response = await this.model.invoke(prompt);
            const cleanedResponse = this.cleanJsonResponse(response.content.toString());            
            return JSON.parse(cleanedResponse);            
        } catch (error) {
            console.error('Error analyzing FAQs:', error);
            throw error;
        }
    }

    private calculateTimeSavings(chats: Chat[]): TimeSavingsData {
        const perChatSavings = chats.map(chat => {
            if (!chat.timeSavings) {
                throw new Error(`Chat ${chat.id} is missing time savings data. Please run analyzeAndUpdateChats first.`);
            }
            return {
                chatId: chat.id,
                chatDuration: chat.metadata.chatDuration,
                traditionalDuration: chat.timeSavings.traditionalDuration,
                timeSaved: chat.timeSavings.timeSaved,
                factors: chat.timeSavings.factors
            };
        });

        // Calculate summary statistics
        const totalTimeSaved = perChatSavings.reduce((sum, chat) => sum + chat.timeSaved, 0);
        const totalTraditionalTime = perChatSavings.reduce((sum, chat) => sum + chat.traditionalDuration, 0);
        const totalAITime = perChatSavings.reduce((sum, chat) => sum + chat.chatDuration, 0);
        const averageTimeSavedPerChat = totalTimeSaved / chats.length;

        return {
            summary: {
                totalTimeSaved,
                averageTimeSavedPerChat,
                totalTraditionalTime,
                totalAITime
            },
            perChat: perChatSavings
        };
    }

    private generateChartData(
        topics: TopicAnalysis,
        faqs: FAQAnalysis,
        timeSavings: TimeSavingsData
    ): ChartData[] {
        return [
            // Topics Distribution (Pie)
            {
                type: 'pie',
                data: {
                    labels: topics.topics.map(t => t.name),
                    values: topics.topics.map(t => t.frequency)
                },
                title: 'Distribution of Legal Topics'
            },
            // Time Comparison (Bar)
            {
                type: 'bar',
                data: {
                    labels: ['Traditional Research', 'AI Consultation'],
                    values: [
                        timeSavings.summary.totalTraditionalTime,
                        timeSavings.summary.totalAITime
                    ]
                },
                title: 'Time Comparison: AI vs Traditional'
            },
            // Question Types (Pie)
            {
                type: 'pie',
                data: {
                    labels: faqs.faqs.map(f => f.theme),
                    values: faqs.faqs.map(f => f.count)
                },
                title: 'Distribution of Question Types'
            }
        ];
    }

    private createEmailTemplate(
        topics: TopicAnalysis,
        faqs: FAQAnalysis,
        timeSavings: TimeSavingsData,
        chartData: ChartData[]
    ): any {
        return {
            component: 'LegalAnalysisEmail',
            props: {
                topics: topics.topics,
                faqs: faqs.faqs,
                timeSavings: timeSavings,
                chartData: chartData
            }
        };
    }
} 