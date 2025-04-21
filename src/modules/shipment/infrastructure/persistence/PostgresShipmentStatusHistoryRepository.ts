import { Pool } from "pg";
import {
  IShipmentStatusHistoryRepository,
  CreateShippingOrderHistoryDTO,
  ShippingOrderHistoryRepository,
} from "../../domain/repositories/IShipmentStatusHistoryRepository";
import { ShipmentStatusHistory } from "../../domain/entities/ShipmentStatusHistory";
import { PostgresConfig } from "@config/databases/postgres/PostgresConfig";

export class PostgresShipmentStatusHistoryRepository
  implements ShippingOrderHistoryRepository, IShipmentStatusHistoryRepository
{
  private pool: Pool;

  constructor() {
    const postgresConfig = PostgresConfig.getInstance();
    this.pool = postgresConfig.getPool();
  }

  async create(
    data: CreateShippingOrderHistoryDTO
  ): Promise<ShipmentStatusHistory> {
    const result = await this.pool.query(
      `INSERT INTO shipping_order_status_history (
        shipping_order_id, status, location_formatted_address, 
        location_place_id, location_latitude, location_longitude, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        data.shipment_id,
        data.status,
        data.location_formatted_address,
        data.location_place_id,
        data.location_latitude,
        data.location_longitude,
        data.notes,
      ]
    );

    return ShipmentStatusHistory.fromPrimitives({
      ...result.rows[0],
      shipment_id: result.rows[0].shipping_order_id,
      created_at: new Date(result.rows[0].created_at),
    });
  }

  async findByShippingOrderId(
    shipment_id: string
  ): Promise<ShipmentStatusHistory[]> {
    return this.findByShipmentId(shipment_id);
  }

  async save(statusHistory: ShipmentStatusHistory): Promise<void> {
    const data = statusHistory.toPrimitives();
    await this.pool.query(
      `INSERT INTO shipping_order_status_history (
        shipping_order_id, status, location_formatted_address, 
        location_place_id, location_latitude, location_longitude, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        data.shipment_id,
        data.status,
        data.location_formatted_address,
        data.location_place_id,
        data.location_latitude,
        data.location_longitude,
        data.notes,
      ]
    );
  }

  async findByShipmentId(shipmentId: string): Promise<ShipmentStatusHistory[]> {
    const result = await this.pool.query(
      "SELECT * FROM shipping_order_status_history WHERE shipping_order_id = $1 ORDER BY created_at DESC",
      [shipmentId]
    );

    return result.rows.map((row) =>
      ShipmentStatusHistory.fromPrimitives({
        ...row,
        shipment_id: row.shipping_order_id,
        created_at: new Date(row.created_at),
      })
    );
  }
}
