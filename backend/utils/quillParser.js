/**
 * Utility to parse job description and requirements content
 * Handles Quill HTML, plain text with bullets, and various formats
 */

/**
 * Extracts content intelligently from various formats
 * Handles: Quill HTML, dot bullets (.), dash bullets (-), asterisk bullets (*), and plain text
 * @param {string} content - HTML string from Quill or plain text
 * @returns {string[]} - Array of individual requirement/description points
 */
export const parseQuillHtml = (content) => {
  if (!content || typeof content !== "string") return [];

  let textArray = [];

  // Remove extra whitespace and normalize HTML entities
  let cleaned = content
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  // Step 1: Try to extract list items from HTML (highest priority)
  const listItemRegex = /<li[^>]*>(.*?)<\/li>/gi;
  let match;
  const listItems = [];

  while ((match = listItemRegex.exec(cleaned)) !== null) {
    let text = match[1]
      .replace(/<[^>]*>/g, "") // Remove inner HTML tags
      .replace(/^[\s•\-*.]+ /, "") // Remove bullet characters at start
      .trim();
    if (text) listItems.push(text);
  }

  if (listItems.length > 0) {
    return listItems;
  }

  // Step 2: Try to extract from paragraphs
  const paraRegex = /<p[^>]*>(.*?)<\/p>/gi;
  const paragraphItems = [];

  while ((match = paraRegex.exec(cleaned)) !== null) {
    let text = match[1]
      .replace(/<[^>]*>/g, "") // Remove inner HTML tags
      .replace(/^[\s•\-*.]+ /, "") // Remove bullet characters
      .trim();
    if (text && !paragraphItems.includes(text)) {
      paragraphItems.push(text);
    }
  }

  if (paragraphItems.length > 0) {
    return paragraphItems;
  }

  // Step 3: Parse plain text with bullet points (dot, dash, asterisk, or bullet)
  // Handle formats like: ".text", "- text", "* text", "• text"
  const bulletRegex = /^\s*[•\-*.][\s]*(.+)$/gm;
  const bulletMatches = [...cleaned.matchAll(bulletRegex)];

  if (bulletMatches.length > 0) {
    return bulletMatches
      .map((m) => m[1].trim())
      .filter((item) => item.length > 0);
  }

  // Step 4: Split by newlines as fallback
  if (cleaned.includes("\n")) {
    return cleaned
      .split("\n")
      .map((item) => item.replace(/^[\s•\-*.]+ /, "").trim()) // Remove bullet chars
      .filter((item) => item.length > 0);
  }

  // Step 5: Last resort - remove all HTML tags and return as single item if not empty
  const text = cleaned.replace(/<[^>]*>/g, "").trim();
  return text ? [text] : [];
};

/**
 * Processes content and returns both original and parsed versions
 * Useful for storing full HTML alongside plain text points
 * @param {string} content - Raw content (HTML or plain text)
 * @returns {object} - Object with original and parsed versions
 */
export const processJobContent = (content) => {
  return {
    raw: content || "",
    points: parseQuillHtml(content),
  };
};
