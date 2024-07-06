import { convert } from "html-to-text";

const processText = (htmlString) => {
  // Convert HTML to plain text
  const text = convert(htmlString);

  // Shorten the text to 250 characters
  const shortText = text.length > 350 ? text.slice(0, 350) + " . . ." : text;
  return shortText;
};

export default processText;
