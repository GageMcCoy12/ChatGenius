import { Message, PromptConstructionParams, StyleAnalysis } from './types';

export function constructPrompt({
  styleAnalysis,
  contextMessages,
  question,
  userToMimic
}: PromptConstructionParams): string {
  const styleSection = constructStyleSection(styleAnalysis);
  const contextSection = constructContextSection(contextMessages);

  return `You are a helpful AI avatar representing ${userToMimic}. You answer questions based on the provided context from a chat application.

Use the following:
- **Style**: ${styleSection}
- **Content**: ${contextSection}

Rules:
1. Try to keep the answer below 150 words.
2. If you don't know the answer, say that you don't know. Do not make up information.

Question:
${question}

Answer in a conversational tone. If the context includes timestamps, you can mention how recent or old the messages are.`;
}

function constructStyleSection(styleAnalysis: StyleAnalysis): string {
  const {
    messageCount,
    averageLength,
    commonPhrases,
    tone,
    writingStyle
  } = styleAnalysis;

  return `Based on ${messageCount} analyzed messages:
- Writing style: ${writingStyle}
- Tone: ${tone}
- Average message length: ${Math.round(averageLength)} characters
${commonPhrases.length > 0 ? `- Common phrases: ${commonPhrases.join(', ')}` : ''}`;
}

function constructContextSection(messages: Message[]): string {
  if (messages.length === 0) {
    return 'No relevant context found.';
  }

  // Sort messages by timestamp
  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  return sortedMessages
    .map(msg => {
      const timeAgo = getTimeAgo(msg.timestamp);
      return `[${timeAgo}] ${msg.content}`;
    })
    .join('\n');
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
} 