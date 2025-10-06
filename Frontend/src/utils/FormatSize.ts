/**
 * Convert a number of bytes to a human-readable string.
 * @param bytes Number of bytes
 * @param decimals Decimal places (default: 1)
 */
export function formatSize(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";

  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB"];

  if (bytes === 0) return "0 B";

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(decimals)} ${units[i]}`;
}