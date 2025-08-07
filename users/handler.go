package users

import (
	"context"
	usersv1 "myapp/api/users/v1"
	productsrepo "myapp/repositories/products"
	usersrepo "myapp/repositories/users"

	"connectrpc.com/connect"
)

type UserHandler struct {
	repo        *usersrepo.Queries
	productRepo *productsrepo.Queries
}

func (u *UserHandler) GetAllUsers(ctx context.Context, req *connect.Request[usersv1.GetAllUsersRequest]) (*connect.Response[usersv1.GetAllUsersResponse], error) {
	users, err := u.repo.GetAllUsers(ctx)
	if err != nil {
		return nil, err
	}
	usersRes := make([]*usersv1.User, 0, len(users))
	for _, user := range users {
		usersRes = append(usersRes, &usersv1.User{
			Name:  user.Name,
			Age:   user.Age,
			Email: user.Email,
			Id:    user.ID,
		})
	}
	return connect.NewResponse(&usersv1.GetAllUsersResponse{
		Users: usersRes,
	}), nil
}

func (u *UserHandler) GetUserById(ctx context.Context, req *connect.Request[usersv1.GetUserByIdRequest]) (*connect.Response[usersv1.GetUserByIdResponse], error) {
	user, err := u.repo.GetUserByID(ctx, req.Msg.Id)

	if err != nil {
		return nil, err
	}

	return connect.NewResponse(&usersv1.GetUserByIdResponse{
		Data: &usersv1.User{
			Name:  user.Name,
			Age:   user.Age,
			Email: user.Email,
			Id:    user.ID,
		},
	}), nil

}

func (u *UserHandler) CreateUser(ctx context.Context, req *connect.Request[usersv1.CreateUserRequest]) (*connect.Response[usersv1.CreateUserResponse], error) {
	user, err := u.repo.CreateUser(ctx, usersrepo.CreateUserParams{
		Gmail: req.Msg.Email,
		Age:   req.Msg.Age,
		Name:  req.Msg.Name,
	})

	if err != nil {
		return nil, err
	}

	return connect.NewResponse(&usersv1.CreateUserResponse{
		Data: &usersv1.User{
			Name:  user.Name,
			Age:   user.Age,
			Email: user.Email,
			Id:    user.ID,
		},
	}), nil

}

func (u *UserHandler) UpdateUser(ctx context.Context, req *connect.Request[usersv1.UpdateUserRequest]) (*connect.Response[usersv1.UpdateUserResponse], error) {
	user, err := u.repo.UpdateUserByID(ctx, usersrepo.UpdateUserByIDParams{
		ID:    req.Msg.Id,
		Name:  req.Msg.Name,
		Email: req.Msg.Email,
		Age:   req.Msg.Age,
	})
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(&usersv1.UpdateUserResponse{
		User: &usersv1.User{
			Id:    user.ID,
			Age:   user.Age,
			Name:  user.Name,
			Email: user.Email,
		},
	}), nil
}

func (u *UserHandler) DeleteUser(ctx context.Context, req *connect.Request[usersv1.DeleteUserByIdRequest]) (*connect.Response[usersv1.DeleteUserByIdResponse], error) {
	err := u.repo.DeleteUserById(ctx, req.Msg.Id)

	if err != nil {
		return nil, err
	}

	return connect.NewResponse(&usersv1.DeleteUserByIdResponse{
		Success: true,
	}), nil
}

func NewUsersHandler(repo *usersrepo.Queries, productsRepo *productsrepo.Queries) *UserHandler {

	return &UserHandler{
		repo:        repo,
		productRepo: productsRepo,
	}
}
