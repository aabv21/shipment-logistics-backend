import { Router } from "express";
import { PostgresShipmentRepository } from "./infrastructure/persistence/PostgresShipmentRepository";
import { CreateShipmentService } from "./application/services/CreateShipmentService";
import { ListShipmentsService } from "./application/services/ListShipmentsService";
import { ShipmentController } from "./presentation/controllers/ShipmentController";
import { createShipmentRoutes } from "./presentation/routes/shipment.routes";

export class ShipmentModule {
  private readonly shipmentRepository: PostgresShipmentRepository;
  private readonly createShipmentService: CreateShipmentService;
  private readonly listShipmentsService: ListShipmentsService;
  private readonly shipmentController: ShipmentController;

  constructor() {
    this.shipmentRepository = new PostgresShipmentRepository();
    this.createShipmentService = new CreateShipmentService(
      this.shipmentRepository
    );
    this.listShipmentsService = new ListShipmentsService(
      this.shipmentRepository
    );
    this.shipmentController = new ShipmentController(
      this.createShipmentService,
      this.listShipmentsService,
      this.shipmentRepository
    );
  }

  public getRoutes(): Router {
    return createShipmentRoutes(this.shipmentController);
  }
}
