-- +goose up

ALTER TABLE products ADD COLUMN description TEXT DEFAULT NULL;

-- +goose down

ALTER TABLE products DROP COLUMN description;