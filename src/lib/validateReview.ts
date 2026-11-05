import { SEMESTERS } from "./constants";

export function validateReviewBody(body: any): string | null {
  if (typeof body !== "object" || body === null) {
    console.log("Invalid request body!");
    return "Invalid request body!";
  }

  if (
    typeof body.overallRating !== "number" ||
    !Number.isFinite(body.overallRating) ||
    body.overallRating < 1 ||
    body.overallRating > 5 ||
    typeof body.criteria.teaching !== "number" ||
    !Number.isFinite(body.criteria.teaching) ||
    body.criteria.teaching < 1 ||
    body.criteria.teaching > 5 ||
    typeof body.criteria.examDifficulty !== "number" ||
    !Number.isFinite(body.criteria.examDifficulty) ||
    body.criteria.examDifficulty < 1 ||
    body.criteria.examDifficulty > 5 ||
    typeof body.criteria.homeWork !== "number" ||
    !Number.isFinite(body.criteria.homeWork) ||
    body.criteria.homeWork < 1 ||
    body.criteria.homeWork > 5 ||
    typeof body.criteria.accessibility !== "number" ||
    !Number.isFinite(body.criteria.accessibility) ||
    body.criteria.accessibility < 1 ||
    body.criteria.accessibility > 5 ||
    typeof body.criteria.examControlLevel !== "number" ||
    !Number.isFinite(body.criteria.examControlLevel) ||
    body.criteria.examControlLevel < 1 ||
    body.criteria.examControlLevel > 5
  ) {
    return "Invalid rating values!";
  }

  if (typeof body.semester !== "string" || !SEMESTERS.includes(body.semester)) {
    return "Invalid semester value!";
  }

  if (typeof body.comment !== "string" || body.comment.trim().length > 500) {
    return "Invalid comment value!";
  }

  return null;
}
