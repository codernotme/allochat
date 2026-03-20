import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { EMOTICON_MAP, findEmoticons } from '@/lib/data/emoticons';

type Props = {
  content: string;
  className?: string;
};

export function EmoticonText({ content, className }: Props) {
  const markdownRegex = /(\*\*[^*]+\*\*|~~[^~]+~~|\*[^*]+\*|`[^`]+`)/g;
  const output: Array<ReactNode> = [];
  let cursor = 0;
  let partIndex = 0;

  function renderEmoticons(text: string, baseKey: string): Array<ReactNode> {
    const matches = findEmoticons(text);
    if (matches.length === 0) return [text];

    const nodes: Array<ReactNode> = [];
    let textCursor = 0;

    matches.forEach((match, idx) => {
      if (match.index > textCursor) {
        nodes.push(
          <Fragment key={`${baseKey}-text-${idx}`}>
            {text.slice(textCursor, match.index)}
          </Fragment>
        );
      }

      const src = EMOTICON_MAP[match.token];
      if (src) {
        nodes.push(
          <img
            key={`${baseKey}-emo-${idx}`}
            src={src}
            alt={match.token}
            title={match.token}
            className="mx-0.5 inline-block size-5 align-text-bottom"
            loading="lazy"
          />
        );
      }

      textCursor = match.index + match.length;
    });

    if (textCursor < text.length) {
      nodes.push(<Fragment key={`${baseKey}-tail`}>{text.slice(textCursor)}</Fragment>);
    }

    return nodes;
  }

  for (const match of content.matchAll(markdownRegex)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > cursor) {
      output.push(...renderEmoticons(content.slice(cursor, index), `plain-${partIndex}`));
      partIndex += 1;
    }

    if (token.startsWith('**') && token.endsWith('**')) {
      const inner = token.slice(2, -2);
      output.push(<strong key={`strong-${partIndex}`}>{renderEmoticons(inner, `strong-${partIndex}`)}</strong>);
    } else if (token.startsWith('~~') && token.endsWith('~~')) {
      const inner = token.slice(2, -2);
      output.push(<s key={`strike-${partIndex}`}>{renderEmoticons(inner, `strike-${partIndex}`)}</s>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const inner = token.slice(1, -1);
      output.push(<em key={`italic-${partIndex}`}>{renderEmoticons(inner, `italic-${partIndex}`)}</em>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const inner = token.slice(1, -1);
      output.push(<code key={`code-${partIndex}`}>{inner}</code>);
    } else {
      output.push(...renderEmoticons(token, `raw-${partIndex}`));
    }

    cursor = index + token.length;
    partIndex += 1;
  }

  if (cursor < content.length) {
    output.push(...renderEmoticons(content.slice(cursor), `plain-tail-${partIndex}`));
  }

  return <span className={className}>{output}</span>;
}
