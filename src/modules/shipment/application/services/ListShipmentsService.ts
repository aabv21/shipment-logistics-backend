import { IShipmentRepository } from "../../domain/repositories/IShipmentRepository";
import { Shipment } from "../../domain/entities/Shipment";

export class ListShipmentsService {
  constructor(private shipmentRepository: IShipmentRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    userId?: string
  ): Promise<{ shipments: Shipment[]; total: number }> {
    if (userId) {
      return this.shipmentRepository.findByUserId(userId, page, limit);
    }
    return this.shipmentRepository.findAll(page, limit);
  }
}
