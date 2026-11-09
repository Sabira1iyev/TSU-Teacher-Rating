export function validateChatBody(body: unknown) {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return "Invalid request body";
  }

  if (!("history" in body)) {
    return "Missing history field";
  }
  const history = body.history;
  if (!Array.isArray(history) || history.length === 0 || history.length > 10) {
    return "Invalid history format";
  }
  return null;
}
