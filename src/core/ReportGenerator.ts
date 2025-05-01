import { Chat } from '../models/Chat';
import { ChatStorage } from '../chatStorage/ChatStorage';
import { ChatOpenAI } from '@langchain/openai';
import { config } from '../config/config';

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
    private model: ChatOpenAI;

    constructor() {
        this.chatStorage = new ChatStorage();
        this.model = new ChatOpenAI({
            modelName: config.defaultModel,            
        });
    }

    async generateReport(focus: 'commercial_contracts' | 'privacy'): Promise<Report> {
        // 1. Load all analyzed chats
        const chats = await this.chatStorage.loadChats(focus);
        
        // 2. Process topics and FAQs
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

Return the response in JSON format matching this structure:
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
            // const response = await this.model.invoke(prompt);
            // return JSON.parse(response.content.toString());
            return {
                "topics": [
                  {
                    "name": "Contract Drafting & Enforceability",
                    "themes": [
                      "Formation, clarity and integration of contract terms",
                      "Statutory / UCC compliance and public-policy limits",
                      "Drafting precision to ensure judicial enforceability"
                    ],
                    "frequency": 13,
                    "exampleTopics": [
                      "Contract Formation & Enforceability (Illinois)",
                      "Uniform Commercial Code (UCC) Applicability",
                      "Drafting Clarity & Enforceability (Delaware)",
                      "Enforceability of Contract Terms under NY Law"
                    ]
                  },
                  {
                    "name": "Risk Allocation & Liability Management",
                    "themes": [
                      "Limitations of liability, damages caps and exclusions",
                      "Warranties, indemnities and insurance back-stops",
                      "Quantitative risk assessment and financial impact analysis"
                    ],
                    "frequency": 20,
                    "exampleTopics": [
                      "Warranty Provisions & Limitations of Liability",
                      "Indemnification Clauses",
                      "Limitation of Liability for Data Breaches & Security Incidents",
                      "Product-Liability Exposure"
                    ]
                  },
                  {
                    "name": "Intellectual Property & Data Rights",
                    "themes": [
                      "Ownership vs. licensing of IP and derivative works",
                      "Confidentiality, trade-secret and data-privacy protections",
                      "Scope of use, sublicensing and residual-knowledge rights"
                    ],
                    "frequency": 18,
                    "exampleTopics": [
                      "Software Licensing Agreement Structure",
                      "Intellectual Property Rights Assurance",
                      "Data Privacy & Usage Rights (Texas)",
                      "Intellectual Property Ownership of Deliverables"
                    ]
                  },
                  {
                    "name": "Termination, Assignment & Subcontracting Controls",
                    "themes": [
                      "Grounds and procedures for termination or suspension",
                      "Post-termination obligations, remedies and step-in rights",
                      "Consent, monitoring and liability for assignments or subcontractors"
                    ],
                    "frequency": 14,
                    "exampleTopics": [
                      "Termination & Exit Rights (California)",
                      "Commercial Contract Termination Clause under NY Contract Law",
                      "Assignment of Contractual Rights and Obligations (Delaware)",
                      "Termination & Remedies Linked to Subcontracting"
                    ]
                  },
                  {
                    "name": "Dispute Resolution & Negotiation Strategy",
                    "themes": [
                      "ADR mechanisms, governing-law and forum selection",
                      "Negotiation, communication and stakeholder management",
                      "Ongoing monitoring, audit and compliance enforcement"
                    ],
                    "frequency": 16,
                    "exampleTopics": [
                      "Dispute Resolution Mechanisms (Texas)",
                      "Negotiation Strategies for Startup Founders in Supply Agreements",
                      "Internal Stakeholder Consultation",
                      "Breach of Contract Enforcement"
                    ]
                  }
                ]
              }
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

Return the response in JSON format matching this structure:
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
            // const response = await this.model.invoke(prompt);
            // return JSON.parse(response.content.toString());
            return {
                "faqs": [
                  {
                    "theme": "Risk Allocation – Warranty & Limitation-of-Liability Clauses",
                    "representativeQuestion": "How should a company negotiate a limitation-of-liability or warranty clause in a technology contract while safeguarding its interests under the governing state law?",
                    "count": 17,
                    "similarQuestions": [
                      "What specific legal considerations should be assessed before accepting a limitation-of-liability clause related to data breaches under California law?",
                      "How can you ensure that a limitation-of-liability clause for project delays is enforceable under New York law and does not unduly restrict your remedies?",
                      "What negotiation strategies help preserve recovery for damages caused by defective products when facing a supplier's proposed liability cap under Illinois law?"
                    ]
                  },
                  {
                    "theme": "Exit Rights – Early Termination Clauses",
                    "representativeQuestion": "How should a startup negotiate a vendor's request for a minimal-notice termination clause while protecting its interests under New York law?",
                    "count": 1,
                    "similarQuestions": [
                      "What contractual safeguards can limit a counter-party's ability to walk away on short notice without paying transition costs?",
                      "How do New York UCC provisions on good-faith and commercial reasonableness influence negotiations over unilateral termination rights?"
                    ]
                  },
                  {
                    "theme": "Contract Enforcement – Breach, Remedies & Dispute Resolution",
                    "representativeQuestion": "How should a construction company enforce a subcontractor's breached agreement and pursue damages under Texas law?",
                    "count": 3,
                    "similarQuestions": [
                      "What legal remedies are available under Texas law when a subcontractor's delays cause cost overruns on a project?",
                      "How can a company leverage contractual dispute-resolution mechanisms to recover losses from a vendor's non-performance while minimizing project disruption?"
                    ]
                  },
                  {
                    "theme": "Transfer of Obligations – Assignment & Subcontracting Controls",
                    "representativeQuestion": "How can a company negotiate assignment or subcontracting clauses to retain control over third-party involvement while remaining compliant with Delaware law?",
                    "count": 9,
                    "similarQuestions": [
                      "What legal considerations arise when a marketing agency seeks the right to subcontract services without prior approval under Delaware law?",
                      "How can a construction company set up approval mechanisms before a subcontractor assigns its contract rights to a third party, ensuring enforceability under Delaware law?"
                    ]
                  },
                  {
                    "theme": "Intellectual Property Ownership in Development Agreements",
                    "representativeQuestion": "How should a startup negotiate ownership of code and other IP created by a software developer to ensure future use and protection under Illinois law?",
                    "count": 5,
                    "similarQuestions": [
                      "What contract language secures a company's access to source code while respecting a developer's retained IP rights under Illinois law?",
                      "How can parties craft an ownership clause that equitably distributes rights arising from collaborative software development projects?"
                    ]
                  },
                  {
                    "theme": "Data Usage & Privacy – Vendor Use of Anonymized Information",
                    "representativeQuestion": "How can a company negotiate a data-usage clause that permits a marketing agency to use anonymized campaign data while protecting privacy rights under Texas law?",
                    "count": 5,
                    "similarQuestions": [
                      "What legal considerations apply to allowing third-party marketing agencies to repurpose anonymized customer data collected during a campaign under Texas law?",
                      "How can you monitor and control a vendor's use of anonymized data to ensure compliance with contractual privacy obligations and state data-protection statutes?"
                    ]
                  }
                ]
              }
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