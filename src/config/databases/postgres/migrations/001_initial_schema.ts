import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

async function createExtensions(client: pkg.PoolClient) {
  await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  console.log("Checked uuid-ossp extension");
}

async function createUsersTable(client: pkg.PoolClient) {
  const exists = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    );
  `);

  if (!exists.rows[0].exists) {
    await client.query(`
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
    `);
    console.log("Created users table");
  } else {
    console.log("Users table already exists");
  }
}

async function createCarriersTable(client: pkg.PoolClient) {
  const exists = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'carriers'
    );
  `);

  if (!exists.rows[0].exists) {
    await client.query(`
      CREATE TABLE carriers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id),
        is_available BOOLEAN DEFAULT true,
        vehicle_type VARCHAR(50) NOT NULL,
        vehicle_capacity DECIMAL(10, 2) NOT NULL,
        vehicle_plate_number VARCHAR(20) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created carriers table");
  }
}

async function createRoutesTable(client: pkg.PoolClient) {
  const exists = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'routes'
    );
  `);

  if (!exists.rows[0].exists) {
    await client.query(`
      CREATE TABLE routes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        origin_formatted_address TEXT NOT NULL,
        origin_place_id VARCHAR(255) NOT NULL,
        origin_latitude DECIMAL(10, 8),
        origin_longitude DECIMAL(11, 8),
        destination_formatted_address TEXT NOT NULL,
        destination_place_id VARCHAR(255) NOT NULL,
        destination_latitude DECIMAL(10, 8),
        destination_longitude DECIMAL(11, 8),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created routes table");
  }
}

async function createShippingOrdersTable(client: pkg.PoolClient) {
  const exists = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'shipping_orders'
    );
  `);

  if (!exists.rows[0].exists) {
    await client.query(`
      CREATE TABLE shipping_orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tracking_number VARCHAR(50) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id),
        route_id UUID REFERENCES routes(id),
        carrier_id UUID REFERENCES carriers(id),
        weight DECIMAL(10, 2) NOT NULL,
        length DECIMAL(10, 2) NOT NULL,
        width DECIMAL(10, 2) NOT NULL,
        height DECIMAL(10, 2) NOT NULL,
        product_type VARCHAR(50) NOT NULL,
        recipient_name VARCHAR(100) NOT NULL,
        recipient_phone VARCHAR(20) NOT NULL,
        origin_formatted_address TEXT NOT NULL,
        origin_place_id VARCHAR(255) NOT NULL,
        origin_latitude DECIMAL(10, 8),
        origin_longitude DECIMAL(11, 8),
        destination_formatted_address TEXT NOT NULL,
        destination_place_id VARCHAR(255) NOT NULL,
        destination_latitude DECIMAL(10, 8),
        destination_longitude DECIMAL(11, 8),
        additional_details TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
          CHECK (status IN ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
        start_date_time TIMESTAMP WITH TIME ZONE,
        delivery_date_time TIMESTAMP WITH TIME ZONE,
        window_delivery_time TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created shipping_orders table");
  }
}

async function createShippingOrderStatusHistoryTable(client: pkg.PoolClient) {
  const exists = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'shipping_order_status_history'
    );
  `);

  if (!exists.rows[0].exists) {
    await client.query(`
      CREATE TABLE shipping_order_status_history (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        shipping_order_id UUID REFERENCES shipping_orders(id),
        carrier_id UUID REFERENCES carriers(id),
        status VARCHAR(20) NOT NULL 
          CHECK (status IN ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
        location_formatted_address TEXT,
        location_place_id VARCHAR(255),
        location_latitude DECIMAL(10, 8),
        location_longitude DECIMAL(11, 8),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created shipping_order_status_history table");
  }
}

async function createIndices(client: pkg.PoolClient) {
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_shipping_orders_tracking_number ON shipping_orders(tracking_number);
    CREATE INDEX IF NOT EXISTS idx_shipping_orders_status ON shipping_orders(status);
    CREATE INDEX IF NOT EXISTS idx_shipping_orders_user_id ON shipping_orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_shipping_orders_route_id ON shipping_orders(route_id);
    CREATE INDEX IF NOT EXISTS idx_shipping_orders_carrier_id ON shipping_orders(carrier_id);
    CREATE INDEX IF NOT EXISTS idx_carriers_user_id ON carriers(user_id);
    CREATE INDEX IF NOT EXISTS idx_carriers_vehicle_plate_number ON carriers(vehicle_plate_number);
    CREATE INDEX IF NOT EXISTS idx_shipping_order_status_history_order_id ON shipping_order_status_history(shipping_order_id);
    CREATE INDEX IF NOT EXISTS idx_shipping_order_status_history_carrier_id ON shipping_order_status_history(carrier_id);
  `);
  console.log("Created indices");
}

export async function runMigration(pool: InstanceType<typeof Pool>) {
  console.log("Starting database migration...");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Transaction started");

    // Create tables in order respecting dependencies
    await createExtensions(client);
    await createUsersTable(client);
    await createCarriersTable(client);
    await createRoutesTable(client);
    await createShippingOrdersTable(client);
    await createShippingOrderStatusHistoryTable(client);
    await createIndices(client);

    await client.query("COMMIT");
    console.log("Migration completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
  }
}
