/**
 * Detect mentions (@username) in text
 * @param text Text to parse
 * @returns Array of unique usernames mentioned
 */
export const extractMentions = (text: string): string[] => {
  // Regex: @followed by alphanumeric, underscore, or period (no spaces)
  const mentionRegex = /@([\w.]+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  // Return unique mentions
  return [...new Set(mentions)];
};

/**
 * Render text with mentions highlighted
 * @param text Text containing mentions
 * @param onMentionClick Optional callback when mention is clicked
 * @returns JSX with mentions wrapped
 */
export const renderTextWithMentions = (
  text: string,
  onMentionClick?: (username: string) => void
): (string | JSX.Element)[] => {
  const parts: (string | JSX.Element)[] = [];
  const mentionRegex = /@([\w.]+)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add mention as clickable span
    const mentionUsername = match[1];
    parts.push(
      <span
        key={`mention-${key++}`}
        className="mention"
        onClick={() => onMentionClick?.(mentionUsername)}
        style={onMentionClick ? { cursor: 'pointer' } : undefined}
        role={onMentionClick ? 'button' : undefined}
        tabIndex={onMentionClick ? 0 : undefined}
      >
        @{mentionUsername}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

/**
 * Check if text contains mention of specific user
 * @param text Text to check
 * @param username Username to look for
 * @returns true if mentioned
 */
export const isMentioned = (text: string, username: string): boolean => {
  const mentions = extractMentions(text);
  return mentions.some(
    (mention) => mention.toLowerCase() === username.toLowerCase()
  );
};

/**
 * Get mention suggestions from a list of usernames
 * @param query Current typing (e.g., "@jo")
 * @param availableUsers List of all usernames
 * @returns Filtered suggestions
 */
export const getMentionSuggestions = (
  query: string,
  availableUsers: string[]
): string[] => {
  if (!query.startsWith('@')) {
    return [];
  }

  const searchTerm = query.substring(1).toLowerCase();
  
  // If just "@", show all users
  if (searchTerm.length === 0) {
    return availableUsers.slice(0, 5);
  }
  
  return availableUsers
    .filter((user) => user.toLowerCase().startsWith(searchTerm))
    .slice(0, 5); // Max 5 suggestions
};
