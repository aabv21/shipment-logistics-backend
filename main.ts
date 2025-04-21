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
import { DatabaseFactory } from "./src/config/databases/DatabaseFactory";

// Controllers
import { UserModule } from "./src/modules/user/user.module";
import { ShipmentModule } from "./src/modules/shipment/shipment.module";

// Services
import { WebSocketService } from "./src/services/websocket.service";

// Load environment variables first
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

const initializeDatabases = async () => {
  try {
    console.log("Initializing databases...");
    await Promise.all([
      DatabaseFactory.createPostgresConfig(),
      DatabaseFactory.createRedisConfig(),
    ]);
    console.log("Databases initialized successfully");
  } catch (error) {
    console.error("Failed to initialize databases:", error);
    throw error;
  }
};

const startServer = async () => {
  try {
    // Initialize databases first
    await initializeDatabases();

    // Middlewares
    app.use(cors());
    app.use(bodyParser.json());
    app.use(morgan("dev"));
    app.use(loggerMiddleware);
    app.use(debounceMiddleware);
    app.use(limiterMiddleware);

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize WebSocket service with HTTP server
    WebSocketService.initialize(httpServer);
    const wsService = WebSocketService.getInstance();

    // Routes
    app.use("/api/users", new UserModule().getRoutes());
    const shipmentModule = new ShipmentModule(wsService);
    app.use("/api/shipments", shipmentModule.getRoutes());

    // Health check
    app.get("/health", (req: Request, res: Response) => {
      res.json({ status: "ok" });
    });

    // Static files
    app.use(express.static("public"));

    // Start server
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    return app;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
