export interface Analysis {
    chatId: string;
    topics: string[];
    faqs: FAQ[];
    estimatedTimeSavings: number; // in minutes
    timestamp: Date;
}

export interface FAQ {
    question: string;
    frequency: number;
} 