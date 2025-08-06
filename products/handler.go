package products

import (
	"context"
	"errors"
	productsv1 "myapp/api/products/v1"

	"connectrpc.com/connect"
)

type ProductHandler struct {
}

func (p *ProductHandler) CreateProduct(p0 context.Context, p1 *connect.Request[productsv1.CreateProductRequest]) (*connect.Response[productsv1.CreateProductResponse], error) {
	return nil, connect.NewError(connect.CodeAlreadyExists, errors.New(
		"already exists",
	))
}

func (p *ProductHandler) GetAllProducts(p0 context.Context, p1 *connect.Request[productsv1.GetAllProductsRequest]) (*connect.Response[productsv1.GetAllProductsRespone], error) {
	return connect.NewResponse(&productsv1.GetAllProductsRespone{
		Products: []*productsv1.CreateProductResponse{
			{
				Name: "aaaa",
				Id:   1,
			},
			{
				Name: "sdsd",
				Id:   2,
			},
		},
	}), nil
}
