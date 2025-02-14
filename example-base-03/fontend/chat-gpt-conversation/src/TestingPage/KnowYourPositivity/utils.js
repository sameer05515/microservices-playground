// utils.js

export function generateSlug(text) {
  if (typeof text !== "string") {
    console.log("text: ", text, "typeof text", typeof text);
    throw new Error("invalid-text");
  }
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .substring(0, 30); // Limit length
}
