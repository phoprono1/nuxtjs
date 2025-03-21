const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return ""; // Tránh lỗi nếu text là null hoặc undefined
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export default {
  truncateText,
};
