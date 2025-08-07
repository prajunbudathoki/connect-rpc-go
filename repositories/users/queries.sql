-- name: CreateUser :one
INSERT INTO users (name , age , email) VALUES ($1 , $2 , sqlc.arg('gmail')) RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: UpdateUserByID :one

UPDATE users
SET 
    name = COALESCE(sqlc.narg('name') , name),
    age = COALESCE(sqlc.narg('age'), age),
    email = COALESCE(sqlc.narg('email') , email)
WHERE id = $1 RETURNING *;


-- name: GetAllUsers :many
SELECT * FROM users;

-- name: DeleteUserById :exec
DELETE FROM users WHERE id = $1;