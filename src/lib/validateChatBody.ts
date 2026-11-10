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

  if (
    !history.every(
      (msg) =>
        typeof msg === "object" &&
        msg !== null &&
        !Array.isArray(msg) &&
        (msg.role === "user" || msg.role === "bot") &&
        typeof msg.text === "string" &&
        msg.text.length <= 1000,
    )
  ) {
    return "Invalid message format";
  }
  return null;
}
