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
    private readonly formatted_address: string,
    private readonly place_id: string,
    private readonly latitude: number | null,
    private readonly longitude: number | null,
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
    formatted_address: string,
    place_id: string,
    latitude: number | null = null,
    longitude: number | null = null,
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
      formatted_address,
      place_id,
      latitude,
      longitude,
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
    formatted_address: string;
    place_id: string;
    latitude: number | null;
    longitude: number | null;
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
      primitives.formatted_address,
      primitives.place_id,
      primitives.latitude,
      primitives.longitude,
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

  public getFormattedAddress(): string {
    return this.formatted_address;
  }

  public getPlaceId(): string {
    return this.place_id;
  }

  public getLatitude(): number | null {
    return this.latitude;
  }

  public getLongitude(): number | null {
    return this.longitude;
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
      formatted_address: this.formatted_address,
      place_id: this.place_id,
      latitude: this.latitude,
      longitude: this.longitude,
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
