import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { EMOTICON_MAP, findEmoticons } from '@/lib/data/emoticons';

type Props = {
  content: string;
  className?: string;
};

export function EmoticonText({ content, className }: Props) {
  const matches = findEmoticons(content);
  if (matches.length === 0) {
    return <span className={className}>{content}</span>;
  }

  const nodes: Array<ReactNode> = [];
  let cursor = 0;

  matches.forEach((match, index) => {
    if (match.index > cursor) {
      nodes.push(
        <Fragment key={`text-${index}`}>
          {content.slice(cursor, match.index)}
        </Fragment>
      );
    }

    const src = EMOTICON_MAP[match.token];
    if (src) {
      nodes.push(
        <img
          key={`emo-${index}`}
          src={src}
          alt={match.token}
          title={match.token}
          className="mx-0.5 inline-block size-5 align-text-bottom"
          loading="lazy"
        />
      );
    } else {
      nodes.push(
        <Fragment key={`raw-${index}`}>
          {content.slice(match.index, match.index + match.length)}
        </Fragment>
      );
    }

    cursor = match.index + match.length;
  });

  if (cursor < content.length) {
    nodes.push(<Fragment key="text-tail">{content.slice(cursor)}</Fragment>);
  }

  return <span className={className}>{nodes}</span>;
}
