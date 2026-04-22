import React from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface SafeMarkdownProps {
  content: string;
  className?: string;
}

/**
 * SafeMarkdown — High-Fidelity Security Component
 * 
 * Implements "Defense in Depth" (XSS Protection):
 * 1. Parses Markdown via marked.
 * 2. Purifies the resulting HTML via DOMPurify to strip all malicious 
 *    scripts, 'javascript:' links, and event handlers.
 * 3. Renders safely using dangerouslySetInnerHTML ONLY after sanitization.
 */
export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ content, className }) => {
  // Configured to allow standard rich text but block all dangerous vectors
  const cleanHtml = React.useMemo(() => {
    const rawHtml = marked.parse(content);
    return DOMPurify.sanitize(rawHtml as string, {
      ALLOWED_TAGS: [
        'b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'ul', 'ol', 'li', 'code', 'pre', 'br', 'hr', 'blockquote', 'table', 
        'thead', 'tbody', 'tr', 'th', 'td', 'span'
      ],
      ALLOWED_ATTR: ['href', 'target', 'class', 'id', 'rel'],
      ALLOW_DATA_ATTR: false, // Prevent data-attribute exploits
    });
  }, [content]);

  return (
    <div 
      className={`prose prose-slate max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }} 
    />
  );
};
