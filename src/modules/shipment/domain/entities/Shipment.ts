export class Shipment {
  constructor(
    private readonly id: string | undefined,
    private readonly tracking_number: string,
    private readonly user_id: string,
    private readonly weight: number,
    private readonly length: number,
    private readonly width: number,
    private readonly height: number,
    private readonly product_type: string,
    private readonly recipient_name: string,
    private readonly recipient_phone: string,
    private readonly origin_formatted_address: string,
    private readonly origin_place_id: string,
    private readonly origin_latitude: number | null,
    private readonly origin_longitude: number | null,
    private readonly destination_formatted_address: string,
    private readonly destination_place_id: string,
    private readonly destination_latitude: number | null,
    private readonly destination_longitude: number | null,
    private readonly additional_details: string | null,
    private readonly status: string = "PENDING",
    private readonly start_date_time: Date | null,
    private readonly delivery_date_time: Date | null,
    private readonly window_delivery_time: Date | null,
    private readonly created_at: Date = new Date(),
    private readonly updated_at: Date = new Date()
  ) {}

  public static create(
    user_id: string,
    weight: number,
    length: number,
    width: number,
    height: number,
    product_type: string,
    recipient_name: string,
    recipient_phone: string,
    origin_formatted_address: string,
    origin_place_id: string,
    origin_latitude: number | null = null,
    origin_longitude: number | null = null,
    destination_formatted_address: string,
    destination_place_id: string,
    destination_latitude: number | null = null,
    destination_longitude: number | null = null,
    additional_details: string | null = null,
    start_date_time: Date | null = null,
    delivery_date_time: Date | null = null,
    window_delivery_time: Date | null = null,
    id?: string,
    tracking_number?: string
  ): Shipment {
    return new Shipment(
      id,
      tracking_number || this.generateTrackingNumber(),
      user_id,
      weight,
      length,
      width,
      height,
      product_type,
      recipient_name,
      recipient_phone,
      origin_formatted_address,
      origin_place_id,
      origin_latitude,
      origin_longitude,
      destination_formatted_address,
      destination_place_id,
      destination_latitude,
      destination_longitude,
      additional_details,
      "PENDING",
      start_date_time,
      delivery_date_time,
      window_delivery_time
    );
  }

  private static generateTrackingNumber(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `SL-${timestamp}-${randomStr}`.toUpperCase();
  }

  public static fromPrimitives(primitives: {
    id: string;
    tracking_number: string;
    user_id: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    product_type: string;
    recipient_name: string;
    recipient_phone: string;
    origin_formatted_address: string;
    origin_place_id: string;
    origin_latitude: number | null;
    origin_longitude: number | null;
    destination_formatted_address: string;
    destination_place_id: string;
    destination_latitude: number | null;
    destination_longitude: number | null;
    additional_details: string | null;
    status: string;
    start_date_time: Date | null;
    delivery_date_time: Date | null;
    window_delivery_time: Date | null;
    created_at: Date;
    updated_at: Date;
  }): Shipment {
    return new Shipment(
      primitives.id,
      primitives.tracking_number,
      primitives.user_id,
      primitives.weight,
      primitives.length,
      primitives.width,
      primitives.height,
      primitives.product_type,
      primitives.recipient_name,
      primitives.recipient_phone,
      primitives.origin_formatted_address,
      primitives.origin_place_id,
      primitives.origin_latitude,
      primitives.origin_longitude,
      primitives.destination_formatted_address,
      primitives.destination_place_id,
      primitives.destination_latitude,
      primitives.destination_longitude,
      primitives.additional_details,
      primitives.status,
      primitives.start_date_time,
      primitives.delivery_date_time,
      primitives.window_delivery_time,
      primitives.created_at,
      primitives.updated_at
    );
  }

  // Getters
  public getId(): string | undefined {
    return this.id;
  }

  public getTrackingNumber(): string {
    return this.tracking_number;
  }

  public getUserId(): string {
    return this.user_id;
  }

  public getWeight(): number {
    return this.weight;
  }

  public getLength(): number {
    return this.length;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getProductType(): string {
    return this.product_type;
  }

  public getRecipientName(): string {
    return this.recipient_name;
  }

  public getRecipientPhone(): string {
    return this.recipient_phone;
  }

  public getOriginFormattedAddress(): string {
    return this.origin_formatted_address;
  }

  public getOriginPlaceId(): string {
    return this.origin_place_id;
  }

  public getOriginLatitude(): number | null {
    return this.origin_latitude;
  }

  public getOriginLongitude(): number | null {
    return this.origin_longitude;
  }

  public getDestinationFormattedAddress(): string {
    return this.destination_formatted_address;
  }

  public getDestinationPlaceId(): string {
    return this.destination_place_id;
  }

  public getDestinationLatitude(): number | null {
    return this.destination_latitude;
  }

  public getDestinationLongitude(): number | null {
    return this.destination_longitude;
  }
  public getAdditionalDetails(): string | null {
    return this.additional_details;
  }

  public getStatus(): string {
    return this.status;
  }

  public getStartDateTime(): Date | null {
    return this.start_date_time;
  }

  public getDeliveryDateTime(): Date | null {
    return this.delivery_date_time;
  }

  public getWindowDeliveryTime(): Date | null {
    return this.window_delivery_time;
  }

  public getCreatedAt(): Date {
    return this.created_at;
  }

  public getUpdatedAt(): Date {
    return this.updated_at;
  }

  public setStatus(status: string): Shipment {
    return new Shipment(
      this.id,
      this.tracking_number,
      this.user_id,
      this.weight,
      this.length,
      this.width,
      this.height,
      this.product_type,
      this.recipient_name,
      this.recipient_phone,
      this.origin_formatted_address,
      this.origin_place_id,
      this.origin_latitude,
      this.origin_longitude,
      this.destination_formatted_address,
      this.destination_place_id,
      this.destination_latitude,
      this.destination_longitude,
      this.additional_details,
      status,
      this.start_date_time,
      this.delivery_date_time,
      this.window_delivery_time,
      this.created_at,
      new Date()
    );
  }

  public toPrimitives() {
    return {
      id: this.id,
      tracking_number: this.tracking_number,
      user_id: this.user_id,
      weight: this.weight,
      length: this.length,
      width: this.width,
      height: this.height,
      product_type: this.product_type,
      recipient_name: this.recipient_name,
      recipient_phone: this.recipient_phone,
      origin_formatted_address: this.origin_formatted_address,
      origin_place_id: this.origin_place_id,
      origin_latitude: this.origin_latitude,
      origin_longitude: this.origin_longitude,
      destination_formatted_address: this.destination_formatted_address,
      destination_place_id: this.destination_place_id,
      destination_latitude: this.destination_latitude,
      destination_longitude: this.destination_longitude,
      additional_details: this.additional_details,
      status: this.status,
      start_date_time: this.start_date_time,
      delivery_date_time: this.delivery_date_time,
      window_delivery_time: this.window_delivery_time,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
