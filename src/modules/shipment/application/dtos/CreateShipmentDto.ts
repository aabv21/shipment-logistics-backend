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

  @Expose()
  @IsString()
  formatted_address!: string;

  @Expose()
  @IsString()
  place_id!: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  longitude?: number;

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
