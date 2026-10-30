import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { preconnect } from "react-dom";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const verifyResetLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:verify-reset",
});

export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:login",
});

export const forgotPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:forgot-password",
});

export const registerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "20m"),
  prefix: "ratelimit:register",
});

export const chatBotLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1m"),
  prefix: "ratelimit:chatBot",
});

export const reviewLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "1m"),
  prefix: "ratelimit:review",
});

export const resetPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:reset-password",
});

export const userEmailLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:login:email",
});

export const userResetPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:reset-password:email",
});

export const userVerifyResetLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:verify-reset:email",
});

export const verifyIpLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:auth-verify",
});

export const verifyEmailLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:auth-verify:email",
});


export const userLoginEmailLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  prefix: "ratelimit:login:email",
});