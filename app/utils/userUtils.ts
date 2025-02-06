const users = {
  "e86028ca-7d0e-4ea0-b3e5-1ec92b84e26c": 'KIA',
  "954faf8f-64fb-4f88-8816-52026798b66c": 'BMW',
} as const;

/**
 * 根據用戶ID回傳用戶名稱
 */
export const getUserNameById = (userId: keyof typeof users): string => {
  return users[userId] || 'Unknown User';
};
