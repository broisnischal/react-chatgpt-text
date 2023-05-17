import React, { FC } from 'react';

interface Props {
  text: string;
  thinkingDelay?: number;
  minTypingDelay?: number;
  maxTypingDelay?: number;
  textClassName?: string;
  styles?: React.CSSProperties | undefined;
  caretBackground?: string;
  cursorBlinkSpeed?: number;
  notDisplayCaretAfterFinishes?: boolean;
}

const TextEffect: FC<Props> = ({
  text,
  thinkingDelay = 2000,
  minTypingDelay = 50,
  maxTypingDelay = 400,
  textClassName,
  styles,
  caretBackground = '#333',
  cursorBlinkSpeed = 1000,
  notDisplayCaretAfterFinishes,
}) => {
  const [words, setWords] = React.useState<string[]>([]);
  const [index, setIndex] = React.useState<number>(0);
  const [displayText, setDisplayText] = React.useState<string>('');
  const [thinking, setThinking] = React.useState<boolean>(true);
  const [finish, setFinish] = React.useState<boolean>(false);
  const [opacity, setOpacity] = React.useState<number>(1);

  React.useEffect(() => {
    const animate = () => {
      setOpacity(0);

      setTimeout(() => {
        setOpacity(1);
      }, 500);
    };

    const interval = setInterval(animate, cursorBlinkSpeed);

    return () => {
      clearInterval(interval);
    };
  }, [cursorBlinkSpeed]);

  React.useEffect(() => {
    const wordsArray = text.split(' ');

    setWords(wordsArray);
  }, [text]);

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

  return (
    <div>
      <span className={textClassName} style={{ ...styles }}>
        {displayText}
      </span>
      <span
        style={{
          width: '10px',
          height: '17px',
          background: caretBackground,
          transform: 'translateY(3px)',
          display:
            notDisplayCaretAfterFinishes && finish ? 'none' : 'inline-block',
          opacity: opacity,
        }}
      ></span>
    </div>
  );
};

export default TextEffect;
