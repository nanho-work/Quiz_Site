import type { InterviewBlock } from '../firebase/reader-api';

export function interviewBodyText(blocks: InterviewBlock[]) {
  return blocks.map(block => {
    if (block.type === 'text') return block.text;
    if (block.type === 'qa') {
      const question = /^Q[.:]\s/.test(block.question) ? block.question : `Q. ${block.question}`;
      return `${question}\n\n${block.answer}`;
    }
    return '';
  }).join('\n\n');
}

export function splitInterviewManuscript(text: string) {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trimStart();
  const header = /^(?:#\s+)?사람을 만나다[ \t]*\n(?:#{1,6}\s+)?([^\n]+)\n+/.exec(normalized);
  return header
    ? { title: header[1].trim(), body: normalized.slice(header[0].length) }
    : { title: '', body: normalized };
}

export function formatInterviewBlocks(blocks: InterviewBlock[]): InterviewBlock[] {
  return blocks.flatMap((block): InterviewBlock[] => {
    if (block.type !== 'text') return [block];
    const text = block.text.replace(/\r\n?/g, '\n').trim();
    if (!text) return [];

    const sections = text.split(/^(?=(?:#{1,6}[ \t]+)?Q[.:][ \t]+\S|---[ \t]*$)/m);
    return sections.flatMap((section): InterviewBlock[] => {
      const match = /^(?:#{1,6}[ \t]+)?(Q[.:][ \t]+[^\n]+)\n+([\s\S]+)$/.exec(section.trim());
      if (match && match[1].length <= 500 && match[2].trim().length <= 20000) {
        return [{ type: 'qa', question: match[1], answer: match[2].trim() }];
      }
      const text = section.replace(/^---[ \t]*(?:\n|$)/, '').trim();
      return text ? [{ type: 'text', text }] : [];
    });
  });
}
