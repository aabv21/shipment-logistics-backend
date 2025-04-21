import { IsString, IsNumber, IsOptional, IsDateString } from "class-validator";
import { Expose } from "class-transformer";

export class CreateShipmentDto {
  @Expose()
  @IsNumber()
  weight!: number;

  @Expose()
  @IsNumber()
  length!: number;

  @Expose()
  @IsNumber()
  width!: number;

  @Expose()
  @IsNumber()
  height!: number;

  @Expose()
  @IsString()
  product_type!: string;

  @Expose()
  @IsString()
  recipient_name!: string;

  @Expose()
  @IsString()
  recipient_phone!: string;

  // Origin address
  @Expose()
  @IsString()
  origin_formatted_address!: string;

  @Expose()
  @IsString()
  origin_place_id!: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  origin_latitude?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  origin_longitude?: number;

  // Destination address
  @Expose()
  @IsString()
  destination_formatted_address!: string;

  @Expose()
  @IsString()
  destination_place_id!: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  destination_latitude?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  destination_longitude?: number;

  @Expose()
  @IsString()
  @IsOptional()
  additional_details?: string;

  @Expose()
  @IsDateString()
  @IsOptional()
  start_date_time?: string;

  @Expose()
  @IsDateString()
  @IsOptional()
  delivery_date_time?: string;

  @Expose()
  @IsDateString()
  @IsOptional()
  window_delivery_time?: string;
}
