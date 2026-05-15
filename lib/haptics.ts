export function haptic(type: "light" | "medium" | "heavy" = "medium") {
  if (typeof navigator === "undefined") return;

  const patterns: Record<string, number[]> = {
    light: [10],
    medium: [20],
    heavy: [40],
  };

  try {
    navigator.vibrate?.(patterns[type] || [20]);
  } catch {
    // Silently fail if vibration API is not available
  }
}
