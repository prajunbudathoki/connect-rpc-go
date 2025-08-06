-- name: GetProductByID :one
SELECT * FROM Product
WHERE id = $1 LIMIT 1;

-- name: GetAllProducts :many
SELECT * FROM Product 
ORDER By name;


-- name: InsertProduct :one
-- INSERT INTO Product (
--     name,price
-- ) VALUES (
--     $1,$2
-- )
-- RETURNING *;