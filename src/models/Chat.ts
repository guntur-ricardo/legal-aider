export interface Chat {
    id: string;
    legalFocus: string;
    messages: ChatMessage[];
    timestamp: Date;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
} 