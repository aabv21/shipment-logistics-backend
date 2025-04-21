import rateLimit from "express-rate-limit";

const limiterMiddleware = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 200, // Limit each IP to 30 requests per `window`
  message: "Too many requests, please try again later.",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export default limiterMiddleware;
