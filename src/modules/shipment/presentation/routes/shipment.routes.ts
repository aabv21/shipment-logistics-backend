import { Router, RequestHandler } from "express";
import { ShipmentController } from "@shipment/presentation/controllers/ShipmentController";
import { validateRequest } from "@shared/utils/validation.util";
import { CreateShipmentDto } from "@shipment/application/dtos/CreateShipmentDto";
import { authenticateToken } from "@middlewares/auth";
import { parseNumericFields } from "@shared/middlewares/numberParser.middleware";

export const createShipmentRoutes = (
  shipmentController: ShipmentController
): Router => {
  const router = Router();

  router.post(
    "/",
    authenticateToken as RequestHandler,
    parseNumericFields,
    validateRequest(CreateShipmentDto),
    shipmentController.create.bind(shipmentController) as RequestHandler
  );

  router.get(
    "/",
    authenticateToken as RequestHandler,
    shipmentController.list.bind(shipmentController) as RequestHandler
  );

  router.get(
    "/:id",
    authenticateToken as RequestHandler,
    shipmentController.getWithHistory.bind(shipmentController) as RequestHandler
  );

  router.delete(
    "/:id",
    authenticateToken as RequestHandler,
    shipmentController.delete.bind(shipmentController) as RequestHandler
  );

  router.post(
    "/:id/history",
    authenticateToken as RequestHandler,
    shipmentController.addHistoryStatus.bind(
      shipmentController
    ) as RequestHandler
  );

  return router;
};
