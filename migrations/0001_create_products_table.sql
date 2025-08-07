-- +goose up

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL
);

-- +goose down

DROP TABLE IF EXISTS products;