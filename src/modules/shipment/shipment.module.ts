import { Router } from "express";
import { PostgresShipmentRepository } from "./infrastructure/persistence/PostgresShipmentRepository";
import { PostgresShipmentStatusHistoryRepository } from "./infrastructure/persistence/PostgresShipmentStatusHistoryRepository";
import { CreateShipmentService } from "./application/services/CreateShipmentService";
import { ListShipmentsService } from "./application/services/ListShipmentsService";
import { GetShipmentWithHistoryService } from "./application/services/GetShipmentWithHistoryService";
import { AddShipmentHistoryService } from "./application/services/AddShipmentHistoryService";
import { ShipmentController } from "./presentation/controllers/ShipmentController";
import { createShipmentRoutes } from "./presentation/routes/shipment.routes";
import { RedisConfig } from "@config/databases/redis/RedisConfig";
import { WebSocketService } from "../../services/websocket.service";

export class ShipmentModule {
  private readonly shipmentRepository: PostgresShipmentRepository;
  private readonly shipmentStatusHistoryRepository: PostgresShipmentStatusHistoryRepository;
  private readonly redisClient: RedisConfig;
  private readonly createShipmentService: CreateShipmentService;
  private readonly listShipmentsService: ListShipmentsService;
  private readonly getShipmentWithHistoryService: GetShipmentWithHistoryService;
  private readonly addShipmentHistoryService: AddShipmentHistoryService;
  private readonly shipmentController: ShipmentController;

  constructor(private readonly wsService: WebSocketService) {
    this.shipmentRepository = new PostgresShipmentRepository();
    this.shipmentStatusHistoryRepository =
      new PostgresShipmentStatusHistoryRepository();
    this.redisClient = RedisConfig.getInstance();

    this.createShipmentService = new CreateShipmentService(
      this.shipmentRepository,
      this.shipmentStatusHistoryRepository
    );

    this.listShipmentsService = new ListShipmentsService(
      this.shipmentRepository
    );

    this.getShipmentWithHistoryService = new GetShipmentWithHistoryService(
      this.shipmentRepository,
      this.shipmentStatusHistoryRepository,
      this.redisClient
    );

    this.addShipmentHistoryService = new AddShipmentHistoryService(
      this.shipmentStatusHistoryRepository,
      this.wsService,
      this.getShipmentWithHistoryService,
      this.shipmentRepository
    );

    this.shipmentController = new ShipmentController(
      this.createShipmentService,
      this.listShipmentsService,
      this.getShipmentWithHistoryService,
      this.shipmentRepository,
      this.addShipmentHistoryService
    );
  }

  public getRoutes(): Router {
    return createShipmentRoutes(this.shipmentController);
  }
}
