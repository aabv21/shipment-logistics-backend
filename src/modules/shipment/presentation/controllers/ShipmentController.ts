import { Request, Response, NextFunction } from "express";
import { CreateShipmentService } from "../../application/services/CreateShipmentService";
import { ListShipmentsService } from "../../application/services/ListShipmentsService";
import { CreateShipmentDto } from "../../application/dtos/CreateShipmentDto";
import { IShipmentRepository } from "../../domain/repositories/IShipmentRepository";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export class ShipmentController {
  constructor(
    private readonly createShipmentService: CreateShipmentService,
    private readonly listShipmentsService: ListShipmentsService,
    private readonly shipmentRepository: IShipmentRepository
  ) {}

  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const dto: CreateShipmentDto = req.body;
      const shipment = await this.createShipmentService.execute(userId, dto);

      res.status(201).json({
        success: true,
        data: shipment.toPrimitives(),
        message: "Shipment created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async list(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.user?.role === "ADMIN" ? undefined : req.user?.id;

      const { shipments, total } = await this.listShipmentsService.execute(
        page,
        limit,
        userId
      );

      res.json({
        success: true,
        data: {
          shipments: shipments.map((shipment) => shipment.toPrimitives()),
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const shipmentId = req.params.id;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const shipment = await this.shipmentRepository.findById(shipmentId);
      if (!shipment) {
        res.status(404).json({
          success: false,
          message: "Shipment not found",
        });
        return;
      }

      await this.shipmentRepository.delete(shipmentId);

      res.json({
        success: true,
        message: "Shipment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
