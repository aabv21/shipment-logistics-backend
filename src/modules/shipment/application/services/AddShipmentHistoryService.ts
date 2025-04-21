import {
  ShippingOrderHistoryRepository,
  CreateShippingOrderHistoryDTO,
} from "../../domain/repositories/IShipmentStatusHistoryRepository";
import { ShipmentStatusHistory } from "../../domain/entities/ShipmentStatusHistory";
import { WebSocketService } from "../../../../services/websocket.service";
import { GetShipmentWithHistoryService } from "./GetShipmentWithHistoryService";
import { IShipmentRepository } from "../../domain/repositories/IShipmentRepository";

export class AddShipmentHistoryService {
  constructor(
    private readonly historyRepository: ShippingOrderHistoryRepository,
    private readonly wsService: WebSocketService,
    private readonly getShipmentWithHistoryService: GetShipmentWithHistoryService,
    private readonly shipmentRepository: IShipmentRepository
  ) {}

  async execute(
    data: CreateShippingOrderHistoryDTO,
    userId: string
  ): Promise<ShipmentStatusHistory> {
    const historyEntry = await this.historyRepository.create(data);

    // Update shipment status
    const shipment = await this.shipmentRepository.findById(data.shipment_id);
    if (shipment) {
      await this.shipmentRepository.updateStatus(data.shipment_id, data.status);
    }

    // Refresh cache immediately
    const cacheKey = `shipment:${data.shipment_id}`;
    this.getShipmentWithHistoryService.fetchAndCacheShipment(
      data.shipment_id,
      cacheKey
    );

    // Notify through WebSocket with the complete history data after 3 seconds
    setTimeout(() => {
      this.wsService.notifyHistoryUpdate(
        data.shipment_id,
        userId,
        historyEntry.toPrimitives()
      );
    }, 3000);

    return historyEntry;
  }
}
