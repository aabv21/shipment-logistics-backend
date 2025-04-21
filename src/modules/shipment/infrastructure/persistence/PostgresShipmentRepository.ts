import { Pool } from "pg";
import { IShipmentRepository } from "../../domain/repositories/IShipmentRepository";
import { Shipment } from "../../domain/entities/Shipment";
import { PostgresConfig } from "@config/databases/postgres/PostgresConfig";

export class PostgresShipmentRepository implements IShipmentRepository {
  private pool: InstanceType<typeof Pool>;

  constructor() {
    const postgresConfig = PostgresConfig.getInstance();
    this.pool = postgresConfig.getPool();
  }

  async save(shipment: Shipment): Promise<Shipment> {
    const query = `
      INSERT INTO shipping_orders (
        tracking_number, user_id, weight, length, width, height,
        product_type, recipient_name, recipient_phone, 
        origin_formatted_address, origin_place_id, origin_latitude, origin_longitude,
        destination_formatted_address, destination_place_id, destination_latitude, destination_longitude,
        additional_details, status, start_date_time, delivery_date_time, window_delivery_time
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      shipment.getTrackingNumber(),
      shipment.getUserId(),
      shipment.getWeight(),
      shipment.getLength(),
      shipment.getWidth(),
      shipment.getHeight(),
      shipment.getProductType(),
      shipment.getRecipientName(),
      shipment.getRecipientPhone(),
      shipment.getOriginFormattedAddress(),
      shipment.getOriginPlaceId(),
      shipment.getOriginLatitude(),
      shipment.getOriginLongitude(),
      shipment.getDestinationFormattedAddress(),
      shipment.getDestinationPlaceId(),
      shipment.getDestinationLatitude(),
      shipment.getDestinationLongitude(),
      shipment.getAdditionalDetails(),
      shipment.getStatus(),
      shipment.getStartDateTime(),
      shipment.getDeliveryDateTime(),
      shipment.getWindowDeliveryTime(),
    ]);

    return Shipment.fromPrimitives(result.rows[0]);
  }

  async findById(id: string): Promise<Shipment | null> {
    const result = await this.pool.query(
      "SELECT * FROM shipping_orders WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return Shipment.fromPrimitives(result.rows[0]);
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ shipments: Shipment[]; total: number }> {
    const offset = (page - 1) * limit;

    const countResult = await this.pool.query(
      "SELECT COUNT(*) FROM shipping_orders WHERE user_id = $1",
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.pool.query(
      "SELECT * FROM shipping_orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [userId, limit, offset]
    );

    const shipments = result.rows.map((row) => Shipment.fromPrimitives(row));

    return {
      shipments,
      total,
    };
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ shipments: Shipment[]; total: number }> {
    const offset = (page - 1) * limit;

    const countResult = await this.pool.query(
      "SELECT COUNT(*) FROM shipping_orders"
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await this.pool.query(
      "SELECT * FROM shipping_orders ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const shipments = result.rows.map((row) => Shipment.fromPrimitives(row));

    return {
      shipments,
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.pool.query("DELETE FROM shipping_orders WHERE id = $1", [id]);
  }

  async findByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    const result = await this.pool.query(
      "SELECT * FROM shipping_orders WHERE tracking_number = $1",
      [trackingNumber]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return Shipment.fromPrimitives(result.rows[0]);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const query = `
      UPDATE shipping_orders
      SET status = $1, updated_at = NOW()
      WHERE id = $2
    `;
    await this.pool.query(query, [status, id]);
  }
}
