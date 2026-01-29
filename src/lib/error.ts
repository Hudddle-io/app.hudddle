// Utility to produce user-friendly error messages from backend responses or JS errors
export async function getFriendlyErrorMessage(
  err: unknown,
  defaultMessage = "Something went wrong. Please try again.",
): Promise<string> {
  try {
    // If it's a fetch Response
    if (
      err &&
      typeof err === "object" &&
      "ok" in (err as any) &&
      typeof (err as any).json === "function"
    ) {
      const res = err as Response;
      try {
        const data = await res.json();
        const msg =
          data?.message ||
          data?.error ||
          (typeof data === "string" ? data : null);
        return mapOrFallback(msg, defaultMessage);
      } catch {
        return defaultMessage;
      }
    }

    // If it's an Error instance
    if (err instanceof Error) {
      return mapOrFallback(err.message, defaultMessage);
    }

    // Axios-like error shape: err.response.data
    const asAny = err as any;
    if (asAny?.response?.data) {
      const data = asAny.response.data;
      const msg =
        data.message || data.error || (typeof data === "string" ? data : null);
      return mapOrFallback(msg, defaultMessage);
    }

    // Plain string
    if (typeof err === "string") return mapOrFallback(err, defaultMessage);

    return defaultMessage;
  } catch (e) {
    return defaultMessage;
  }
}

function mapOrFallback(msg: any, defaultMessage: string) {
  if (!msg) return defaultMessage;
  const raw = String(msg).trim();
  const normalized = raw.toLowerCase();

  // Common mappings
  if (normalized.includes("invalid") && normalized.includes("credential"))
    return "Invalid email or password.";
  if (normalized.includes("not found") && normalized.includes("user"))
    return "No account found with that email address.";
  if (normalized.includes("already") && normalized.includes("exists"))
    return "An account already exists with that email.";
  if (normalized.includes("password"))
    return "The password provided is incorrect or does not meet requirements.";
  if (normalized.includes("token") || normalized.includes("expired"))
    return "Your session expired. Please sign in again.";
  if (normalized.includes("verification") || normalized.includes("verify"))
    return "Please verify your email address before continuing.";

  // If message looks safe and short, show it; otherwise fallback
  if (raw.length > 0 && raw.length < 200 && !/trace|stack|\<|\{/.test(raw)) {
    return raw;
  }

  return defaultMessage;
}
