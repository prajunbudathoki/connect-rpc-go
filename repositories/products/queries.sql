-- name: CreateProduct :one
INSERT INTO products (name , price , description) VALUES ($1 , $2 , sqlc.narg('description')) RETURNING *;

-- name: GetProductByID :one
SELECT * FROM products WHERE id = $1;

-- name: UpdateProductByID :one

UPDATE products
SET 
    name = COALESCE(sqlc.narg('name') , name),
    price = COALESCE(sqlc.narg('price'), price),
    description = COALESCE(sqlc.narg('description') , description)
WHERE id = $1 RETURNING *;


-- name: GetAllProducts :many
SELECT * FROM products;

-- name: DeleteProductById :exec
DELETE FROM products WHERE id = $1;