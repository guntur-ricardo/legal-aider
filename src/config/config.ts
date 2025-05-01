export type AIModel = 'openai' | 'anthropic';

// Anthropic Models
// claude-3-7-sonnet-20250219
// claude-3-5-sonnet-20241022
// claude-3-5-haiku-20241022
//claude-3-opus-20240229

// OpenAI Models
// gpt-o3
// gpt-4.1
// gpt-4o-mini

export const config = {
    legalFocuses: ['commercial_contracts', 'privacy'] as const,
    defaultModel: 'gpt-4.1',
    aiModel: 'openai' as AIModel,
    temperature: 0.7,
    timeSavingsMultiplier: 2.5, // Estimated time saved compared to traditional research
    
    // Legal frameworks by focus
    legalFrameworks: {
        commercial_contracts: [
            'Uniform Commercial Code (UCC)',
            'Contract Law Principles',
            'Intellectual Property Rights',
            'Data Protection Requirements'
        ],
        privacy: [
            'General Data Protection Regulation (GDPR)',
            'California Consumer Privacy Act (CCPA)',
            'Health Insurance Portability and Accountability Act (HIPAA)',
            'Data Protection Principles'
        ]
    },

    // Expertise level configurations
    expertiseLevels: {
        beginner: {
            explanationDepth: 'basic',
            terminologyLevel: 'simplified',
            citationFrequency: 'low'
        },
        intermediate: {
            explanationDepth: 'moderate',
            terminologyLevel: 'standard',
            citationFrequency: 'medium'
        },
        expert: {
            explanationDepth: 'detailed',
            terminologyLevel: 'technical',
            citationFrequency: 'high'
        }
    }
}; 