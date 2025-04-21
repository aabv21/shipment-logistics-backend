import {
  ShippingOrderHistoryRepository,
  CreateShippingOrderHistoryDTO,
} from "../../domain/repositories/IShipmentStatusHistoryRepository";
import { ShipmentStatusHistory } from "../../domain/entities/ShipmentStatusHistory";
import { WebSocketService } from "../../../../services/websocket.service";
import { GetShipmentWithHistoryService } from "./GetShipmentWithHistoryService";

export class AddShipmentHistoryService {
  constructor(
    private readonly historyRepository: ShippingOrderHistoryRepository,
    private readonly wsService: WebSocketService,
    private readonly getShipmentWithHistoryService: GetShipmentWithHistoryService
  ) {}

  async execute(
    data: CreateShippingOrderHistoryDTO,
    userId: string
  ): Promise<ShipmentStatusHistory> {
    const historyEntry = await this.historyRepository.create(data);

    // Refresh cache immediately
    await this.getShipmentWithHistoryService.execute(data.shipment_id);

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
