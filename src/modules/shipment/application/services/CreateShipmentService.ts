import { IShipmentRepository } from "../../domain/repositories/IShipmentRepository";
import { Shipment } from "../../domain/entities/Shipment";
import { CreateShipmentDto } from "../dtos/CreateShipmentDto";
import { IShipmentStatusHistoryRepository } from "@modules/shipment/domain/repositories/IShipmentStatusHistoryRepository";
import { ShipmentStatusHistory } from "@modules/shipment/domain/entities/ShipmentStatusHistory";

export class CreateShipmentService {
  constructor(
    private shipmentRepository: IShipmentRepository,
    private shipmentStatusHistoryRepository: IShipmentStatusHistoryRepository
  ) {}

  async execute(userId: string, dto: CreateShipmentDto): Promise<Shipment> {
    const shipment = Shipment.create(
      userId,
      dto.weight,
      dto.length,
      dto.width,
      dto.height,
      dto.product_type,
      dto.recipient_name,
      dto.recipient_phone,
      dto.origin_formatted_address,
      dto.origin_place_id,
      dto.origin_latitude || null,
      dto.origin_longitude || null,
      dto.destination_formatted_address,
      dto.destination_place_id,
      dto.destination_latitude || null,
      dto.destination_longitude || null,
      dto.additional_details || null,
      dto.start_date_time ? new Date(dto.start_date_time) : null,
      dto.delivery_date_time ? new Date(dto.delivery_date_time) : null,
      dto.window_delivery_time ? new Date(dto.window_delivery_time) : null
    );

    const savedShipment = await this.shipmentRepository.save(shipment);

    const shipmentId = savedShipment.getId();
    console.log("savedShipment", savedShipment);
    console.log("shipmentId", shipmentId);
    if (!shipmentId) {
      throw new Error("No se pudo obtener el ID del envío");
    }

    const initialStatus = ShipmentStatusHistory.create({
      shipment_id: shipmentId,
      status: "PENDING",
      location_formatted_address: dto.origin_formatted_address,
      location_place_id: dto.origin_place_id,
      location_latitude: dto.origin_latitude || null,
      location_longitude: dto.origin_longitude || null,
      notes: "Envío creado y registrado en el sistema",
    });

    await this.shipmentStatusHistoryRepository.save(initialStatus);

    return shipment;
  }
}
