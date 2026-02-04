import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { getMentionSuggestions } from '../../utils/mentions';
import styles from './MentionTextArea.module.css';

interface MentionTextAreaProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  availableUsers: string[];
  rows?: number;
  onCtrlEnter?: () => void;
}

export function MentionTextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  availableUsers,
  rows = 4,
  onCtrlEnter,
}: MentionTextAreaProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update suggestions based on cursor position
  useEffect(() => {
    if (availableUsers.length === 0) return;

    const textUpToCursor = value.substring(0, cursorPosition);
    const words = textUpToCursor.split(/\s/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith('@')) {
      const newSuggestions = getMentionSuggestions(lastWord, availableUsers);
      setSuggestions(newSuggestions);
      setSelectedIndex(0);
    } else {
      setSuggestions([]);
    }
  }, [value, cursorPosition, availableUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  const insertMention = (username: string) => {
    const textareaEl = textareaRef.current;
    if (!textareaEl) return;

    const textUpToCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    
    // Find the start of the current @mention
    const lastAtIndex = textUpToCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const newValue =
        value.substring(0, lastAtIndex) +
        `@${username} ` +
        textAfterCursor;
      
      onChange(newValue);
      setSuggestions([]);
      
      // Set cursor after the mention
      setTimeout(() => {
        const newCursorPos = lastAtIndex + username.length + 2;
        textareaEl.setSelectionRange(newCursorPos, newCursorPos);
        textareaEl.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter to submit (if callback provided)
    if ((e.key === 'Enter' && (e.ctrlKey || e.metaKey)) && onCtrlEnter) {
      e.preventDefault();
      onCtrlEnter();
      return;
    }

    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      insertMention(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.textareaWrapper}>
        <textarea
          ref={textareaRef}
          id={id}
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          placeholder={placeholder}
          rows={rows}
        />
        
        {suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {suggestions.map((username, index) => (
              <button
                key={username}
                type="button"
                className={`${styles.suggestion} ${
                  index === selectedIndex ? styles.selected : ''
                }`}
                onClick={() => insertMention(username)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                @{username}
              </button>
            ))}
          </div>
        )}
      </div>
      <span className={styles.hint}>
        💡 Type @ to mention someone
      </span>
    </div>
  );
}
