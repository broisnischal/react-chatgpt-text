import React, { FC } from 'react';

const blinkCaret = `
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

interface Props {
  message: string;
  thinkingDelay?: number;
  minTypingDelay?: number;
  maxTypingDelay?: number;
  className?: string;
  caretBackground?: string;
  notDisplayCaretAfterFinishes?: boolean;
}

const TextEffect: FC<Props> = ({
  message,
  thinkingDelay = 2000,
  minTypingDelay = 50,
  maxTypingDelay = 400,
  className,
  caretBackground,
  notDisplayCaretAfterFinishes,
}) => {
  const [words, setWords] = React.useState<string[]>([]);
  const [index, setIndex] = React.useState<number>(0);
  const [displayText, setDisplayText] = React.useState<string>('');
  const [thinking, setThinking] = React.useState<boolean>(true);
  const [finish, setFinish] = React.useState<boolean>(false);

  React.useEffect(() => {
    const wordsArray = message.split(' ');
    setWords(wordsArray);
  }, [message]);

  React.useEffect(() => {
    if (index < words.length) {
      const word = words[index];
      const wordLength = word.length;
      let typingDelay = Math.floor(
        Math.random() * (maxTypingDelay - minTypingDelay) + minTypingDelay
      );

      if (wordLength > 10) {
        typingDelay = Math.floor(typingDelay * 1.5);
      } else if (wordLength < 5) {
        typingDelay = Math.floor(typingDelay / 2);
      }

      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + word + ' ');
        setIndex(prev => prev + 1);
        setThinking(false);
      }, typingDelay);

      return () => clearTimeout(timeout);
    }

    return () => {};
  }, [index, words, maxTypingDelay, minTypingDelay]);

  React.useEffect(() => {
    if (words.length === index + 1) {
      setFinish(true);
    }
    return () => {};
  }, [words, index]);

  const handleThinkingTimeout = React.useCallback(() => {
    setThinking(false);
  }, []);

  React.useEffect(() => {
    if (index === 0) {
      const timeout = setTimeout(handleThinkingTimeout, thinkingDelay);
      return () => clearTimeout(timeout);
    }
    if (index < words.length) {
      const timeout = setTimeout(handleThinkingTimeout, thinkingDelay);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [index, words, thinkingDelay, handleThinkingTimeout]);

  React.useEffect(() => {
    if (thinking) {
      const timeout = setTimeout(handleThinkingTimeout, thinkingDelay);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [thinking, thinkingDelay, handleThinkingTimeout]);

  const handleSetThinkingTimeout = React.useCallback(() => {
    setThinking(true);
  }, []);

  React.useEffect(() => {
    if (!thinking && index < words.length) {
      const timeout = setTimeout(handleSetThinkingTimeout, thinkingDelay);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [thinking, thinkingDelay, index, words, handleSetThinkingTimeout]);

  const caretStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '10',
    height: '17px',
    backgroundColor: '#333',
    animation: `${blinkCaret} 0.75s step-end infinite`,
    transform: 'translateY(3px)',
  };

  return (
    <div>
      <span className={className}>{displayText}</span>
      <span
        style={{
          ...caretStyle,
          background: caretBackground,
          display: notDisplayCaretAfterFinishes && finish ? 'none' : '',
        }}
      ></span>
    </div>
  );
};

export default TextEffect;
