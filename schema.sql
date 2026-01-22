-- 1. Planners (The Users)
CREATE TABLE IF NOT EXISTS planners (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at INTEGER DEFAULT (unixepoch())
);

-- 2. Clients (The Couples) [cite: 51]
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    planner_id TEXT NOT NULL,
    partner_1_name TEXT NOT NULL,
    partner_2_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    notes TEXT, -- Internal comments [cite: 56]
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (planner_id) REFERENCES planners(id)
);

-- 3. Weddings ( The Event Details) 
CREATE TABLE IF NOT EXISTS weddings (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    wedding_date TEXT, -- Stored as YYYY-MM-DD
    venue_name TEXT,
    guest_count INTEGER,
    status TEXT DEFAULT 'planning', -- planning, completed
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- 4. Tasks (The Workflow) [cite: 58]
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    wedding_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT, -- e.g., "Floral", "Catering"
    due_date TEXT,
    is_completed BOOLEAN DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (wedding_id) REFERENCES weddings(id)
);

-- 5. Timeline Events [cite: 65]
CREATE TABLE IF NOT EXISTS timeline_events (
    id TEXT PRIMARY KEY,
    wedding_id TEXT NOT NULL,
    start_time TEXT NOT NULL, -- "14:00"
    end_time TEXT,
    activity TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id)
);

-- 6. Vendors (Rolodex) [cite: 73]
CREATE TABLE IF NOT EXISTS vendors (
    id TEXT PRIMARY KEY,
    planner_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., "Photographer"
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    FOREIGN KEY (planner_id) REFERENCES planners(id)
);

-- 7. Wedding Vendors (Assigning vendors to specific weddings) [cite: 76]
CREATE TABLE IF NOT EXISTS wedding_vendors (
    id TEXT PRIMARY KEY,
    wedding_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    status TEXT DEFAULT 'proposed', -- proposed, booked, paid
    FOREIGN KEY (wedding_id) REFERENCES weddings(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- 8. Social Tracking [cite: 87]
CREATE TABLE IF NOT EXISTS social_plans (
    id TEXT PRIMARY KEY,
    wedding_id TEXT NOT NULL,
    platform TEXT, -- Instagram, Pinterest
    handle_hashtag TEXT,
    content_ideas TEXT,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id)
);
