import { IShipmentRepository } from "../../domain/repositories/IShipmentRepository";
import { Shipment } from "../../domain/entities/Shipment";
import { CreateShipmentDto } from "../dtos/CreateShipmentDto";

export class CreateShipmentService {
  constructor(private shipmentRepository: IShipmentRepository) {}

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
      dto.formatted_address,
      dto.place_id,
      dto.latitude || null,
      dto.longitude || null,
      dto.additional_details || null,
      dto.start_date_time ? new Date(dto.start_date_time) : null,
      dto.delivery_date_time ? new Date(dto.delivery_date_time) : null,
      dto.window_delivery_time ? new Date(dto.window_delivery_time) : null
    );

    await this.shipmentRepository.save(shipment);
    return shipment;
  }
}
