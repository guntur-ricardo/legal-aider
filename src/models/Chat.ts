export interface Chat {
    id: string;
    legalFocus: 'commercial_contracts' | 'privacy';
    context: ChatContext;
    messages: ChatMessage[];
    metadata: ChatMetadata;
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
    estimatedDuration: number;
    complexity: 'low' | 'medium' | 'high';
} 