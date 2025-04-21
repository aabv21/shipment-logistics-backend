import { ShipmentStatusHistory } from "../entities/ShipmentStatusHistory";

export interface CreateShippingOrderHistoryDTO {
  shipment_id: string;
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";
  location_formatted_address: string;
  location_place_id: string;
  location_latitude: string;
  location_longitude: string;
  notes?: string;
}

export interface ShippingOrderHistoryRepository {
  create(data: CreateShippingOrderHistoryDTO): Promise<ShipmentStatusHistory>;
  findByShippingOrderId(shipmentId: string): Promise<ShipmentStatusHistory[]>;
}

export interface IShipmentStatusHistoryRepository {
  save(statusHistory: ShipmentStatusHistory): Promise<void>;
  findByShipmentId(shipmentId: string): Promise<ShipmentStatusHistory[]>;
}
