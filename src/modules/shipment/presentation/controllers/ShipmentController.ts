import { Request, Response } from "express";
import { CreateShipmentService } from "../../application/services/CreateShipmentService";
import { ListShipmentsService } from "../../application/services/ListShipmentsService";
import { GetShipmentWithHistoryService } from "../../application/services/GetShipmentWithHistoryService";
import { AddShipmentHistoryService } from "../../application/services/AddShipmentHistoryService";
import { IShipmentRepository } from "../../domain/repositories/IShipmentRepository";
import { CreateShippingOrderHistoryDTO } from "../../domain/repositories/IShipmentStatusHistoryRepository";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export class ShipmentController {
  constructor(
    private createShipmentService: CreateShipmentService,
    private listShipmentsService: ListShipmentsService,
    private getShipmentWithHistoryService: GetShipmentWithHistoryService,
    private shipmentRepository: IShipmentRepository,
    private addShipmentHistoryService: AddShipmentHistoryService
  ) {}

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const shipment = await this.createShipmentService.execute(
        userId,
        req.body
      );
      res.status(201).json(shipment);
    } catch (error) {
      console.error("Error creating shipment:", error);
      res.status(500).json({ message: "Error al crear el envío" });
    }
  };

  list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.user?.id;

      const result = await this.listShipmentsService.execute(
        page,
        limit,
        userId
      );

      res.json({
        success: true,
        data: {
          shipments: result.shipments.map((shipment) =>
            shipment.toPrimitives()
          ),
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      console.error("Error listing shipments:", error);
      res.status(500).json({ message: "Error al listar los envíos" });
    }
  };

  getWithHistory = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.getShipmentWithHistoryService.execute(id);

      if (!result) {
        res.status(404).json({ message: "Envío no encontrado" });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error("Error getting shipment with history:", error);
      res
        .status(500)
        .json({ message: "Error al obtener el envío y su historial" });
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.shipmentRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting shipment:", error);
      res.status(500).json({ message: "Error al eliminar el envío" });
    }
  };

  addHistoryStatus = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const requiredFields: (keyof CreateShippingOrderHistoryDTO)[] = [
        "shipment_id",
        "status",
        "location_formatted_address",
        "location_place_id",
        "location_latitude",
        "location_longitude",
      ];

      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        res.status(400).json({
          success: false,
          error: `Campos requeridos faltantes: ${missingFields.join(", ")}`,
        });
        return;
      }

      const historyData: CreateShippingOrderHistoryDTO = {
        shipment_id: req.body.shipment_id,
        status: req.body.status,
        location_formatted_address: req.body.location_formatted_address,
        location_place_id: req.body.location_place_id,
        location_latitude: req.body.location_latitude,
        location_longitude: req.body.location_longitude,
        notes: req.body.notes,
      };

      const result = await this.addShipmentHistoryService.execute(
        historyData,
        userId
      );

      res.status(201).json({
        success: true,
        data: result.toPrimitives(),
      });
    } catch (error) {
      console.error("Error adding history status:", error);
      res.status(500).json({
        success: false,
        error: "Error al agregar actualización de estado",
      });
    }
  };
}
