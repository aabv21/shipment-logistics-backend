import { Server } from "socket.io";
import { Server as HttpServer } from "http";

interface WebSocketConfig {
  cors: {
    origin: string | string[];
    methods: string[];
  };
  path?: string;
  pingTimeout?: number;
  pingInterval?: number;
}

export class WebSocketService {
  private static instance: WebSocketService;
  private io: Server;
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  private constructor(httpServer: HttpServer, config: WebSocketConfig) {
    this.io = new Server(httpServer, {
      cors: config.cors,
      path: config.path || "/socket.io",
      pingTimeout: config.pingTimeout || 5000,
      pingInterval: config.pingInterval || 10000,
    });

    this.io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("register", (userId: string) => {
        console.log(`Registering user ${userId} with socket ${socket.id}`);
        this.userSockets.set(userId, socket.id);
        console.log(
          "Current user sockets:",
          Array.from(this.userSockets.entries())
        );
      });

      socket.on("disconnect", () => {
        // Remove user from map when they disconnect
        for (const [userId, socketId] of this.userSockets.entries()) {
          if (socketId === socket.id) {
            this.userSockets.delete(userId);
            console.log(`User ${userId} disconnected, socket ${socketId}`);
            console.log(
              "Updated user sockets:",
              Array.from(this.userSockets.entries())
            );
            break;
          }
        }
      });
    });
  }

  public static initialize(httpServer: HttpServer): void {
    if (!WebSocketService.instance) {
      const config: WebSocketConfig = {
        cors: {
          origin:
            process.env.WEBSOCKET_ALLOWED_ORIGINS?.split(",") ||
            process.env.FRONTEND_URL ||
            "http://localhost:5173",
          methods: ["GET", "POST"],
        },
        path: process.env.WEBSOCKET_PATH,
        pingTimeout: parseInt(process.env.WEBSOCKET_PING_TIMEOUT || "5000"),
        pingInterval: parseInt(process.env.WEBSOCKET_PING_INTERVAL || "10000"),
      };

      WebSocketService.instance = new WebSocketService(httpServer, config);
      console.log("WebSocket service initialized with config:", {
        cors: config.cors,
        path: config.path,
      });
    }
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      throw new Error(
        "WebSocketService must be initialized with an HTTP server first"
      );
    }
    return WebSocketService.instance;
  }

  notifyHistoryUpdate(
    shipmentId: string,
    userId: string,
    historyData: any
  ): void {
    console.log(
      `Attempting to notify user ${userId} about shipment ${shipmentId}`
    );
    console.log(
      "All registered sockets:",
      Array.from(this.userSockets.entries())
    );
    const socketId = this.userSockets.get(userId);
    console.log(`Found socket ID for user ${userId}:`, socketId);

    if (socketId) {
      console.log(
        `Emitting event history-created-${userId} to socket ${socketId}`
      );
      this.io.to(socketId).emit(`history-created-${userId}`, historyData);
    } else {
      console.log(`No socket found for user ${userId}`);
    }
  }

  notifyUser(userId: string, event: string, data: any): void {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }
}
