CREATE TABLE Product (
    id BIGSERIAL PRIMARY KEY,
    name text NOT NULL,
    price NUMERIC(6,2) NOT NULL
)