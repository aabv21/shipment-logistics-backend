import { Shipment } from "../entities/Shipment";

export interface IShipmentRepository {
  save(shipment: Shipment): Promise<Shipment>;
  findById(id: string): Promise<Shipment | null>;
  findByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ shipments: Shipment[]; total: number }>;
  findAll(
    page: number,
    limit: number
  ): Promise<{ shipments: Shipment[]; total: number }>;
  delete(id: string): Promise<void>;
  findByTrackingNumber(trackingNumber: string): Promise<Shipment | null>;
}
