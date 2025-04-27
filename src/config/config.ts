export const config = {
    legalFocuses: ['commercial_contracts', 'privacy'] as const,
    defaultModel: 'gpt-3.5-turbo',
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