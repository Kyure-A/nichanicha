export const generateId = (username: string) => {
  const date = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const hash = new Bun.CryptoHasher("sha256")
    .update(date + username)
    .digest("hex");
  return hash.split("").reverse().join("").substring(0, 8);
};
