CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
  expires_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_refresh_token_hash ON refresh_tokens(token_hash);

CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor TEXT NOT NULL,
  receipt_date DATE,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_receipts_user_id ON receipts(user_id);
CREATE INDEX idx_receipts_date ON receipts(receipt_date);

CREATE TABLE receipt_items (
  id SERIAL PRIMARY KEY,
  receipt_id INTEGER NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC,
  price NUMERIC(10,2),
  category TEXT NOT NULL
);

CREATE INDEX idx_receipt_items_receipt_id ON receipt_items(receipt_id);
CREATE INDEX idx_receipt_items_category ON receipt_items(category);
