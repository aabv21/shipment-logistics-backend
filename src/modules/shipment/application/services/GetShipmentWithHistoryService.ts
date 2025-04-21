import { IShipmentRepository } from "../../domain/repositories/IShipmentRepository";
import { IShipmentStatusHistoryRepository } from "../../domain/repositories/IShipmentStatusHistoryRepository";
import { IRedisClient } from "@shared/infrastructure/redis/IRedisClient";
import { Shipment } from "../../domain/entities/Shipment";
import { ShipmentStatusHistory } from "../../domain/entities/ShipmentStatusHistory";

interface ShipmentWithHistory {
  shipment: Shipment;
  history: ShipmentStatusHistory[];
}

export class GetShipmentWithHistoryService {
  constructor(
    private shipmentRepository: IShipmentRepository,
    private historyRepository: IShipmentStatusHistoryRepository,
    private redisClient: IRedisClient
  ) {}

  async execute(id: string): Promise<ShipmentWithHistory | null> {
    const cacheKey = `shipment:${id}`;
    const cachedData = await this.redisClient.get(cacheKey);

    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      // Update cache in background
      this.updateCacheInBackground(id, cacheKey);
      return {
        shipment: Shipment.fromPrimitives(parsed.shipment),
        history: parsed.history.map((h: any) =>
          ShipmentStatusHistory.fromPrimitives(h)
        ),
      };
    }

    return this.fetchAndCacheShipment(id, cacheKey);
  }

  private async updateCacheInBackground(id: string, cacheKey: string) {
    try {
      const result = await this.fetchAndCacheShipment(id, cacheKey);
      return result;
    } catch (error) {
      console.error("Error updating cache in background:", error);
    }
  }

  private async fetchAndCacheShipment(id: string, cacheKey: string) {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) return null;

    const history = await this.historyRepository.findByShipmentId(id);
    const result = { shipment, history };

    await this.redisClient.set(
      cacheKey,
      JSON.stringify({
        shipment: shipment.toPrimitives(),
        history: history.map((h) => h.toPrimitives()),
      }),
      60 * 15 // 15 minutes
    );

    return result;
  }
}
