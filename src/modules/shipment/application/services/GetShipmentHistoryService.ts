import { ShippingOrderHistoryRepository } from "../../domain/repositories/IShipmentStatusHistoryRepository";
import { ShipmentStatusHistory } from "../../domain/entities/ShipmentStatusHistory";

export class GetShipmentHistoryService {
  constructor(
    private readonly historyRepository: ShippingOrderHistoryRepository
  ) {}

  async execute(shipment_id: string): Promise<ShipmentStatusHistory[]> {
    return this.historyRepository.findByShippingOrderId(shipment_id);
  }
}
