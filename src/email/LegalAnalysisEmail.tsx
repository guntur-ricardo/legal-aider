import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Img,
} from '@react-email/components';

interface LegalAnalysisEmailProps {
  topics: {
    name: string;
    themes: string[];
    frequency: number;
    exampleTopics: string[];
  }[];
  faqs: {
    theme: string;
    representativeQuestion: string;
    count: number;
    similarQuestions: string[];
  }[];
  timeSavings: {
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
  };
}

// Static preview data
const previewData: LegalAnalysisEmailProps = {
  topics: [
    {
      name: "Contract Drafting & Enforceability",
      themes: ["Formation", "Clarity", "Compliance"],
      frequency: 13,
      exampleTopics: ["Contract Formation", "UCC Applicability"]
    }
  ],
  faqs: [
    {
      theme: "Risk Allocation",
      representativeQuestion: "How should a company negotiate a limitation-of-liability clause?",
      count: 17,
      similarQuestions: ["What considerations apply to liability caps?", "How to ensure enforceability?"]
    }
  ],
  timeSavings: {
    summary: {
      totalTimeSaved: 120,
      averageTimeSavedPerChat: 30,
      totalTraditionalTime: 180,
      totalAITime: 60
    },
    perChat: [
      {
        chatId: "123",
        chatDuration: 20,
        traditionalDuration: 60,
        timeSaved: 40,
        factors: {
          legalResearch: 20,
          documentReview: 15,
          preparation: 15,
          followUp: 10
        }
      }
    ]
  }
};

export const LegalAnalysisEmail = ({
  topics = previewData.topics,
  faqs = previewData.faqs,
  timeSavings = previewData.timeSavings,
}: Partial<LegalAnalysisEmailProps> = {}) => {
  const previewText = "Legal AI Analysis Report";
  const brandColor = 'rgba(14, 31, 69, 0.9)';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[600px] shadow-sm">
            {/* Logo Banner */}
            <Section className="w-full">
              <Img
                src="gc-ai-logo.png"
                width="600"
                alt="GC AI Logo"
                className="w-full"
              />
            </Section>

            <Section className="mt-[32px]">
              <Heading className="text-[#0E1F45] text-[28px] font-semibold text-center p-0 my-[30px] mx-0">
                Legal AI Analysis Report
              </Heading>
              <Section className="mt-4 mb-8">
                <Text className="text-gray-600 text-[14px] leading-[22px] text-center">
                  This analysis presents key insights derived from actual interactions between legal professionals and our GC AI legal assistant. The data reflects real-world usage patterns, demonstrating how GC AI can enhance legal workflows, reduce research time, and provide immediate access to legal expertise. The following sections detail the most common legal topics discussed, time savings achieved, and frequently asked questions, offering a comprehensive view of AI's potential impact on legal practice.
                </Text>
              </Section>
            </Section>

            {/* Topics Section */}
            <Section className="mt-[32px] bg-white rounded-lg p-6">
              <Heading className="text-[#0E1F45] text-[22px] font-semibold p-0 my-[20px] mx-0">
                Main Topics Discussed
              </Heading>
              
              {/* Placeholder for Topics Chart */}
              <Section className="my-6 bg-gray-100 rounded p-4 text-center text-gray-500">
                [Pie Chart: Distribution of Legal Topics]
              </Section>

              {topics.map((topic) => (
                <Section key={topic.name} className="mb-[24px] last:mb-0">
                  <Text className="text-[#0E1F45] text-[18px] leading-[24px] font-semibold">
                    {topic.name}
                  </Text>
                  <Text className="text-gray-600 text-[14px] leading-[20px] mt-1">
                    Frequency: {topic.frequency} occurrences
                  </Text>
                  <Text className="text-gray-600 text-[14px] leading-[20px] mt-1">
                    Key Themes: {topic.themes.join(', ')}
                  </Text>
                </Section>
              ))}
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0 w-full" />

            {/* Time Savings Section */}
            <Section className="mt-[32px] bg-white rounded-lg p-6">
              <Heading className="text-[#0E1F45] text-[22px] font-semibold p-0 my-[20px] mx-0">
                Time Savings Analysis
              </Heading>

              <Section className="mb-6">
                <Text className="text-gray-600 text-[14px] leading-[22px]">
                  Our time savings calculations are based on industry-standard estimates for traditional legal research and consultation processes. For each interaction, we compare the time taken by GC AI to provide accurate legal insights against the typical time required for traditional methods, including:
                </Text>
                <ul className="list-disc pl-6 mt-2 text-gray-600 text-[14px] leading-[22px]">
                  <li>Legal research and case law review</li>
                  <li>Document analysis and review</li>
                  <li>Preparation for client consultation</li>
                  <li>Follow-up research and clarification</li>
                </ul>
                <Text className="text-gray-600 text-[14px] leading-[22px] mt-4">
                  These estimates are conservative and based on actual legal practice patterns, ensuring a fair comparison between AI-assisted and traditional legal workflows. The following analysis is derived from 10 distinct legal consultations, providing a representative sample of real-world usage patterns.
                </Text>
              </Section>

              {/* Placeholder for Time Savings Chart */}
              <Section className="my-6 bg-gray-100 rounded p-4 text-center text-gray-500">
                [Bar Chart: AI vs Traditional Time Comparison]
              </Section>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <Text className="text-[#0E1F45] text-[16px] leading-[24px] font-semibold">
                    Total Time Saved
                  </Text>
                  <Text className="text-gray-600 text-[14px] leading-[20px]">
                    {timeSavings.summary.totalTimeSaved} minutes
                  </Text>
                  <Text className="text-gray-500 text-[12px] leading-[18px] mt-1">
                    Equivalent to {Math.round(timeSavings.summary.totalTimeSaved / 60)} hours of legal work
                  </Text>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <Text className="text-[#0E1F45] text-[16px] leading-[24px] font-semibold">
                    Average per Chat
                  </Text>
                  <Text className="text-gray-600 text-[14px] leading-[20px]">
                    {timeSavings.summary.averageTimeSavedPerChat} minutes
                  </Text>
                  <Text className="text-gray-500 text-[12px] leading-[18px] mt-1">
                    Per legal consultation
                  </Text>
                </div>
              </div>
              
              <Section className="mt-6">
                <Text className="text-gray-600 text-[14px] leading-[20px]">
                  Traditional Research Time: {timeSavings.summary.totalTraditionalTime} minutes
                </Text>
                <Text className="text-gray-600 text-[14px] leading-[20px]">
                  AI Consultation Time: {timeSavings.summary.totalAITime} minutes
                </Text>
                <Text className="text-gray-500 text-[12px] leading-[18px] mt-2">
                  *Time savings represent actual efficiency gains based on real-world legal practice patterns
                </Text>
              </Section>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0 w-full" />

            {/* FAQ Section */}
            <Section className="mt-[32px] bg-white rounded-lg p-6">
              <Heading className="text-[#0E1F45] text-[22px] font-semibold p-0 my-[20px] mx-0">
                Common Legal Questions
              </Heading>

              {/* Placeholder for FAQ Chart */}
              <Section className="my-6 bg-gray-100 rounded p-4 text-center text-gray-500">
                [Pie Chart: Distribution of Question Types]
              </Section>

              {faqs.map((faq) => (
                <Section key={faq.theme} className="mb-[24px] last:mb-0">
                  <Text className="text-[#0E1F45] text-[18px] leading-[24px] font-semibold">
                    {faq.theme}
                  </Text>
                  <Text className="text-gray-600 text-[14px] leading-[20px] mt-1">
                    Representative Question: {faq.representativeQuestion}
                  </Text>
                  <Text className="text-gray-600 text-[14px] leading-[20px] mt-1">
                    Count: {faq.count}
                  </Text>
                </Section>
              ))}
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[32px] mx-0 w-full" />

            <Section className="mt-[32px] bg-white rounded-lg p-6">
              <Text className="text-gray-600 text-[12px] leading-[24px]">
                This analysis is based on actual legal consultation patterns and demonstrates the potential time savings and efficiency gains from using AI-powered legal assistance.
              </Text>
              <Text className="text-gray-600 text-[12px] leading-[24px] mt-2">
                All time estimates are based on standard legal research and consultation practices.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

LegalAnalysisEmail.PreviewProps = previewData;

export default LegalAnalysisEmail; 