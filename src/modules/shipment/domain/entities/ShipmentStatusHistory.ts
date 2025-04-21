type ShipmentStatus = "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

interface ShipmentStatusHistoryProps {
  shipment_id: string;
  status: ShipmentStatus;
  location_formatted_address: string;
  location_place_id: string;
  location_latitude: number | null;
  location_longitude: number | null;
  notes?: string;
}

export class ShipmentStatusHistory {
  private constructor(
    private readonly shipment_id: string,
    private readonly status: ShipmentStatus,
    private readonly location_formatted_address: string,
    private readonly location_place_id: string,
    private readonly location_latitude: number | null,
    private readonly location_longitude: number | null,
    private readonly notes: string | null = null,
    private readonly id?: string,
    private readonly created_at: Date = new Date()
  ) {}

  static create(props: ShipmentStatusHistoryProps): ShipmentStatusHistory {
    return new ShipmentStatusHistory(
      props.shipment_id,
      props.status,
      props.location_formatted_address,
      props.location_place_id,
      props.location_latitude,
      props.location_longitude,
      props.notes || null
    );
  }

  // Getters
  getId(): string | undefined {
    return this.id;
  }

  getShipmentId(): string {
    return this.shipment_id;
  }

  getStatus(): ShipmentStatus {
    return this.status;
  }

  getLocationFormattedAddress(): string {
    return this.location_formatted_address;
  }

  getLocationPlaceId(): string {
    return this.location_place_id;
  }

  getLocationLatitude(): number | null {
    return this.location_latitude;
  }

  getLocationLongitude(): number | null {
    return this.location_longitude;
  }

  getNotes(): string | null {
    return this.notes;
  }

  getCreatedAt(): Date {
    return this.created_at;
  }

  static fromPrimitives(plainData: {
    id: string;
    shipment_id: string;
    status: ShipmentStatus;
    location_formatted_address: string;
    location_place_id: string;
    location_latitude: number | null;
    location_longitude: number | null;
    notes: string | null;
    created_at: Date;
  }): ShipmentStatusHistory {
    return new ShipmentStatusHistory(
      plainData.shipment_id,
      plainData.status,
      plainData.location_formatted_address,
      plainData.location_place_id,
      plainData.location_latitude,
      plainData.location_longitude,
      plainData.notes,
      plainData.id,
      plainData.created_at
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      shipment_id: this.shipment_id,
      status: this.status,
      location_formatted_address: this.location_formatted_address,
      location_place_id: this.location_place_id,
      location_latitude: this.location_latitude,
      location_longitude: this.location_longitude,
      notes: this.notes,
      created_at: this.created_at,
    };
  }
}
