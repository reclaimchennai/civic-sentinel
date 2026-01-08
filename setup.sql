-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Zones Table
CREATE TABLE IF NOT EXISTS zones (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT NOT NULL
);

-- Complaint Categories
CREATE TABLE IF NOT EXISTS complaint_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon_slug TEXT NOT NULL
);

-- Complaint Sub-Categories
CREATE TABLE IF NOT EXISTS complaint_sub_categories (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES complaint_categories(id),
    name TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'critical'))
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    zone_id INTEGER REFERENCES zones(id),
    sub_category_id INTEGER REFERENCES complaint_sub_categories(id),
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    twitter_tweet_id TEXT,
    user_id UUID, -- For registered users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Profiles (Gamification)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    current_points INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]'::jsonb
);

-- Rewards Catalog
CREATE TABLE IF NOT EXISTS rewards_catalog (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    cost_points INTEGER NOT NULL,
    type TEXT CHECK (type IN ('merch', 'coupon')),
    brand_name TEXT,
    image_url TEXT
);

-- Seed Data: Zones
INSERT INTO zones (name, slug) VALUES
('Adyar', 'adyar'), ('Alandur', 'alandur'), ('Alwarpet', 'alwarpet'), ('Ambattur', 'ambattur'), ('Aminjikarai', 'aminjikarai'),
('Anna Nagar', 'anna-nagar'), ('Anna Salai', 'anna-salai'), ('Arumbakkam', 'arumbakkam'), ('Ashok Nagar', 'ashok-nagar'), ('Ayanavaram', 'ayanavaram'),
('Besant Nagar', 'besant-nagar'), ('Broadway', 'broadway'), ('Chetpet', 'chetpet'), ('Choolai', 'choolai'), ('Choolaimedu', 'choolaimedu'),
('Chromepet', 'chromepet'), ('Egmore', 'egmore'), ('Ekkattuthangal', 'ekkattuthangal'), ('Ennore', 'ennore'), ('George Town', 'george-town'),
('Gopalapuram', 'gopalapuram'), ('Guindy', 'guindy'), ('Jafferkhanpet', 'jafferkhanpet'), ('K.K. Nagar', 'kk-nagar'), ('Kodambakkam', 'kodambakkam'),
('Kodungaiyur', 'kodungaiyur'), ('Kolathur', 'kolathur'), ('Korattur', 'korattur'), ('Kotturpuram', 'kotturpuram'), ('Koyambedu', 'koyambedu'),
('Madhavaram', 'madhavaram'), ('Madipakkam', 'madipakkam'), ('Maduravoyal', 'maduravoyal'), ('Manali', 'manali'), ('Manapakkam', 'manapakkam'),
('Mandaveli', 'mandaveli'), ('Mogappair', 'mogappair'), ('Mylapore', 'mylapore'), ('Nandanam', 'nandanam'), ('Nanganallur', 'nanganallur'),
('Neelangarai', 'neelangarai'), ('Nungambakkam', 'nungambakkam'), ('Pallikaranai', 'pallikaranai'), ('Parrys', 'parrys'), ('Perambur', 'perambur'),
('Perungudi', 'perungudi'), ('Porur', 'porur'), ('Purasaiwakkam', 'purasaiwakkam'), ('R.A. Puram', 'ra-puram'), ('Ramapuram', 'ramapuram'),
('Royapettah', 'royapettah'), ('Royapuram', 'royapuram'), ('Saidapet', 'saidapet'), ('Saligramam', 'saligramam'), ('Sholinganallur', 'sholinganallur'),
('Sowcarpet', 'sowcarpet'), ('T. Nagar', 't-nagar'), ('Tambaram', 'tambaram'), ('Teynampet', 'teynampet'), ('Thiruvanmiyur', 'thiruvanmiyur'),
('Thoraipakkam', 'thoraipakkam'), ('Thousand Lights', 'thousand-lights'), ('Tondiarpet', 'tondiarpet'), ('Triplicane', 'triplicane'), ('Vadapalani', 'vadapalani'),
('Valasaravakkam', 'valasaravakkam'), ('Velachery', 'velachery'), ('Vepery', 'vepery'), ('Villivakkam', 'villivakkam'), ('Virugambakkam', 'virugambakkam'),
('Washermenpet', 'washermenpet'), ('West Mambalam', 'west-mambalam')
ON CONFLICT (name) DO NOTHING;

-- Seed Data: Categories
INSERT INTO complaint_categories (id, name, icon_slug) VALUES
(1, 'Traffic Violations', 'TrafficCone'),
(2, 'Garbage & Debris', 'Trash2'),
(3, 'Street Light', 'Lightbulb'),
(4, 'Roads & Footpath', 'Footprints'),
(5, 'Water & Drainage', 'Droplets'),
(6, 'Public Health', 'Activity')
ON CONFLICT (id) DO NOTHING;

-- Seed Data: Sub-Categories
-- Traffic
INSERT INTO complaint_sub_categories (category_id, name, severity) VALUES
(1, 'No Parking', 'medium'), (1, 'One Way Violation', 'medium'), (1, 'Riding on Footpath', 'critical'),
(1, 'Defective/Fancy Number Plate', 'low'), (1, 'Stopped on Zebra Cross', 'low'), (1, 'Triple Riding', 'medium'),
(1, 'Using Mobile Phone', 'critical'), (1, 'Jumping Traffic Signal', 'critical'), (1, 'Without Helmet', 'medium'),
(1, 'Stunt Riding', 'critical'), (1, 'Footboard Travelling', 'medium'), (1, 'Tinted Glass/Black Film', 'low'),
(1, 'Abandoned Vehicle', 'low'), (1, 'Free Left Obstruction', 'medium');

-- Garbage
INSERT INTO complaint_sub_categories (category_id, name, severity) VALUES
(2, 'Overflowing Bin', 'medium'), (2, 'Burning Garbage', 'critical'), (2, 'Non-removal of Debris', 'medium'),
(2, 'Construction Waste Dumping', 'medium'), (2, 'Improper Sweeping', 'low');

-- Street Light
INSERT INTO complaint_sub_categories (category_id, name, severity) VALUES
(3, 'Non burning Street Light', 'medium'), (3, 'Burning in daytime', 'low'), (3, 'Damaged Pole', 'critical'),
(3, 'Low Hanging Wires', 'critical'), (3, 'Open Transformer Box', 'critical');

-- Roads & Footpath
INSERT INTO complaint_sub_categories (category_id, name, severity) VALUES
(4, 'Potholes', 'critical'), (4, 'Damaged Road Surface', 'medium'), (4, 'Illegal Parking on Footpath', 'medium'),
(4, 'Shop Encroachment on Footpath', 'medium'), (4, 'Broken Manhole Cover', 'critical');

-- Water & Drainage
INSERT INTO complaint_sub_categories (category_id, name, severity) VALUES
(5, 'Water Stagnation', 'medium'), (5, 'Sewage Overflow', 'critical'), (5, 'Open Manhole', 'critical'),
(5, 'Illegal Sewage Discharge', 'critical');

-- Public Health
INSERT INTO complaint_sub_categories (category_id, name, severity) VALUES
(6, 'Mosquito Menace', 'medium'), (6, 'Street Dog Menace', 'medium'), (6, 'Open Defecation', 'medium'),
(6, 'Illegal Slaughtering', 'critical');

-- Seed Data: Rewards Catalog
INSERT INTO rewards_catalog (name, cost_points, type, brand_name, image_url) VALUES
('"Mayor of Chennai" Cap', 500, 'merch', NULL, 'https://placehold.co/600x400?text=Mayor+Cap'),
('"Civic Sentinel" Badge', 200, 'merch', NULL, 'https://placehold.co/600x400?text=Civic+Badge'),
('A2B ₹100 Off Coupon', 300, 'coupon', 'A2B', 'https://placehold.co/600x400?text=A2B+Coupon'),
('Murugan Idli Free Drink', 250, 'coupon', 'Murugan Idli', 'https://placehold.co/600x400?text=Murugan+Idli+Coupon'),
('Saravana Bhavan Coffee', 150, 'coupon', 'Saravana Bhavan', 'https://placehold.co/600x400?text=Coffee+Coupon');
