import { Router, RequestHandler } from "express";
import { ShipmentController } from "@shipment/presentation/controllers/ShipmentController";
import { validateRequest } from "@shared/utils/validation.util";
import { CreateShipmentDto } from "@shipment/application/dtos/CreateShipmentDto";
import { authenticateToken } from "@middlewares/auth";

export const createShipmentRoutes = (
  shipmentController: ShipmentController
): Router => {
  const router = Router();

  router.post(
    "/",
    authenticateToken as RequestHandler,
    validateRequest(CreateShipmentDto),
    shipmentController.create.bind(shipmentController)
  );

  router.get(
    "/",
    authenticateToken as RequestHandler,
    shipmentController.list.bind(shipmentController)
  );

  router.delete(
    "/:id",
    authenticateToken as RequestHandler,
    shipmentController.delete.bind(shipmentController)
  );

  return router;
};
