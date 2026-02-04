import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { getMentionSuggestions } from '../../utils/mentions';
import styles from './MentionInput.module.css';

interface MentionInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  availableUsers: string[];
}

export function MentionInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  availableUsers,
}: MentionInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCursorPosition(e.currentTarget.selectionStart || 0);
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    setCursorPosition(e.currentTarget.selectionStart || 0);
  };

  const insertMention = (username: string) => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const textUpToCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    
    const lastAtIndex = textUpToCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const newValue =
        value.substring(0, lastAtIndex) +
        `@${username} ` +
        textAfterCursor;
      
      onChange(newValue);
      setSuggestions([]);
      
      setTimeout(() => {
        const newCursorPos = lastAtIndex + username.length + 2;
        inputEl.setSelectionRange(newCursorPos, newCursorPos);
        inputEl.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          id={id}
          className={styles.input}
          value={value}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          placeholder={placeholder}
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
    </div>
  );
}
