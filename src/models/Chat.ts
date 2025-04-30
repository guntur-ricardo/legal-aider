export interface Chat {
    id: string;
    legalFocus: 'commercial_contracts' | 'privacy';
    context: ChatContext;
    messages: ChatMessage[];
    metadata: ChatMetadata;
    timeSavings?: TimeSavings;
}

export interface ChatContext {
    userRole: string;
    expertiseLevel: string;
    jurisdiction: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    messageType: 'question' | 'answer' | 'follow-up';
}

export interface ChatMetadata {
    createdAt: string;
    chatDuration: number;  // Time spent in AI consultation (minutes)
    complexity: 'low' | 'medium' | 'high';
    topics: string[];      // Legal topics discussed in the chat
    faqs: string[];        // Frequently asked questions from the chat
}

export interface TimeSavings {
    traditionalDuration: number;  // Estimated time for traditional methods (minutes)
    timeSaved: number;           // traditionalDuration - chatDuration (minutes)
    factors: {
        legalResearch: number;   // Estimated time for legal research
        documentReview: number;  // Estimated time for document review
        preparation: number;     // Estimated time for preparation
        followUp: number;        // Estimated time for follow-up communication
    };
} 