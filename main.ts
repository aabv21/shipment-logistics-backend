// Aliases
import "./src/aliases";

// Packages
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import morgan from "morgan";

// Middlewares
import debounceMiddleware from "./src/middlewares/debounce";
import limiterMiddleware from "./src/middlewares/limiter";
import loggerMiddleware from "./src/middlewares/logger";

// Config
import { PostgresConfig } from "./src/config/databases/postgres/PostgresConfig";
import { RedisConfig } from "./src/config/databases/redis/RedisConfig";

// Controllers
import { UserModule } from "./src/modules/user/user.module";
import { ShipmentModule } from "./src/modules/shipment/shipment.module";

// Load environment variables first
dotenv.config();

// Initialize databases
new PostgresConfig();
new RedisConfig();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(loggerMiddleware);
app.use(debounceMiddleware);
app.use(limiterMiddleware);

// Routes
app.use("/api/users", new UserModule().getRoutes());
app.use("/api/shipments", new ShipmentModule().getRoutes());

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Static files
app.use(express.static("public"));

// Create HTTP server
const server = createServer(app);

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
