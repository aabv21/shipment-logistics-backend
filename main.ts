// Packages
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";

// Middlewares
import debounceMiddleware from "./middlewares/debounce.ts";
import limiterMiddleware from "./middlewares/limiter.ts";
import loggerMiddleware from "./middlewares/logger.ts";

// Load environment variables first
dotenv.config();

// Express
const app = express();

// Middleware
app.use(loggerMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(debounceMiddleware);
app.use(limiterMiddleware);

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Root route to serve the index.html
app.get("/", (req: Request, res: Response) => {
  res.sendFile("index.html", { root: "./public" });
});

// Daemon
const server = createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(" ");
  console.log("--------------------------------");
  console.log(`[Server] is running on port ${port}`);
  console.log("--------------------------------");
  console.log(" ");
});

export default app;
