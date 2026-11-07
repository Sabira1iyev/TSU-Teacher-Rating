import { SEMESTERS } from "./constants";

const CRITERIA_KEYS = [
  "teaching",
  "examDifficulty",
  "homeWork",
  "accessibility",
  "examControlLevel",
] as const;

function isRating(value: unknown): boolean {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 1 &&
    value <= 5
  );
}

export function validateReviewBody(body: any): string | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return "Invalid request body!";
  }

  const criteria = body.criteria;
  if (
    !isRating(body.overallRating) ||
    typeof criteria !== "object" ||
    criteria === null ||
    !CRITERIA_KEYS.every((key) => isRating(criteria[key]))
  ) {
    return "Invalid rating values!";
  }

  if (CRITERIA_KEYS.some((key) => criteria[key] === 0)) {
    return "Please rate all criteria!";
  }

  if (typeof body.courseName !== "string" || body.courseName.length === 0) {
    return "Invalid course!";
  }

  if (typeof body.semester !== "string" || !SEMESTERS.includes(body.semester)) {
    return "Invalid semester value!";
  }

  if (typeof body.comment !== "string" || body.comment.length > 500) {
    return "Invalid comment value!";
  }

  if (typeof body.wouldRecommend !== "boolean") {
    return "Invalid recommendation value!";
  }

  if (
    body.tags !== undefined &&
    (!Array.isArray(body.tags) ||
      body.tags.length > 20 ||
      !body.tags.every((tag: unknown) => typeof tag === "string"))
  ) {
    return "Invalid tags value!";
  }

  return null;
}
