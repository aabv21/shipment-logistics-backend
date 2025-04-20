CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'USER', 'CARRIER')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carriers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    is_available BOOLEAN DEFAULT true,
    
    -- Vehicle information
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_capacity DECIMAL(10, 2) NOT NULL, -- en kg
    vehicle_plate_number VARCHAR(20) UNIQUE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    
    -- Origin address
    origin_formatted_address TEXT NOT NULL,
    origin_place_id VARCHAR(255) NOT NULL,
    origin_latitude DECIMAL(10, 8),
    origin_longitude DECIMAL(11, 8),
    
    -- Destination address
    destination_formatted_address TEXT NOT NULL,
    destination_place_id VARCHAR(255) NOT NULL,
    destination_latitude DECIMAL(10, 8),
    destination_longitude DECIMAL(11, 8),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shipping_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    route_id UUID REFERENCES routes(id),
    carrier_id UUID REFERENCES carriers(id),
    
    -- Package information
    weight DECIMAL(10, 2) NOT NULL,
    length DECIMAL(10, 2) NOT NULL,
    width DECIMAL(10, 2) NOT NULL,
    height DECIMAL(10, 2) NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    
    -- Recipient information
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    
    -- Destination address
    formatted_address TEXT NOT NULL,
    place_id VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Additional information
    additional_details TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    
    start_date_time TIMESTAMP WITH TIME ZONE,
    delivery_date_time TIMESTAMP WITH TIME ZONE,
    window_delivery_time TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shipping_order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipping_order_id UUID REFERENCES shipping_orders(id),
    carrier_id UUID REFERENCES carriers(id),
    status VARCHAR(20) NOT NULL 
        CHECK (status IN ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_shipping_orders_tracking_number ON shipping_orders(tracking_number);
CREATE INDEX idx_shipping_orders_status ON shipping_orders(status);
CREATE INDEX idx_shipping_orders_user_id ON shipping_orders(user_id);
CREATE INDEX idx_shipping_orders_route_id ON shipping_orders(route_id);
CREATE INDEX idx_shipping_orders_carrier_id ON shipping_orders(carrier_id);
CREATE INDEX idx_carriers_user_id ON carriers(user_id);
CREATE INDEX idx_carriers_plate_number ON carriers(plate_number);
CREATE INDEX idx_shipping_order_status_history_order_id ON shipping_order_status_history(shipping_order_id);
CREATE INDEX idx_shipping_order_status_history_carrier_id ON shipping_order_status_history(carrier_id); 