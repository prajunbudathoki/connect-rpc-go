package products

import (
	"context"
	productsv1 "myapp/api/products/v1"
	productsrepo "myapp/repositories/products"

	"connectrpc.com/connect"
)

type ProductHandler struct {
	store *productsrepo.Queries
}

func (p *ProductHandler) CreateProduct(ctx context.Context, req *connect.Request[productsv1.CreateProductRequest]) (*connect.Response[productsv1.CreateProductResponse], error) {
	product, err := p.store.CreateProduct(ctx, productsrepo.CreateProductParams{
		Name:        req.Msg.Name,
		Price:       req.Msg.Price,
		Description: req.Msg.Description,
	})

	if err != nil {
		return nil, err
	}
	return connect.NewResponse(&productsv1.CreateProductResponse{
		Data: &productsv1.Product{
			Name:        product.Name,
			Price:       product.Price,
			Id:          product.ID,
			Description: product.Description,
		},
	}), nil
}

func (p *ProductHandler) GetAllProducts(ctx context.Context, req *connect.Request[productsv1.GetAllProductsRequest]) (*connect.Response[productsv1.GetAllProductsRespone], error) {
	products, err := p.store.GetAllProducts(ctx)

	if err != nil {
		return nil, err
	}

	productsres := make([]*productsv1.Product, 0, len(products))
	for _, product := range products {
		productsres = append(productsres, &productsv1.Product{
			Name:        product.Name,
			Price:       product.Price,
			Id:          product.ID,
			Description: product.Description,
		})
	}

	return connect.NewResponse(&productsv1.GetAllProductsRespone{
		Products: productsres,
	}), nil
}

func (p *ProductHandler) GetProduct(ctx context.Context, req *connect.Request[productsv1.GetProductRequest]) (*connect.Response[productsv1.GetProductResponse], error) {
	product, err := p.store.GetProductByID(ctx, req.Msg.Id)

	if err != nil {
		return nil, err
	}

	return connect.NewResponse(&productsv1.GetProductResponse{
		Data: &productsv1.Product{
			Name:        product.Name,
			Price:       product.Price,
			Id:          product.ID,
			Description: product.Description,
		},
	}), nil
}

func (p *ProductHandler) UpdateProduct(ctx context.Context, req *connect.Request[productsv1.UpdateProductRequest]) (*connect.Response[productsv1.UpdateProductResponse], error) {
	_, err := p.store.GetProductByID(ctx, req.Msg.Id)

	if err != nil {
		return nil, err
	}

	product, err := p.store.UpdateProductByID(ctx, productsrepo.UpdateProductByIDParams{
		ID:          req.Msg.Id,
		Name:        req.Msg.Name,
		Price:       req.Msg.Price,
		Description: req.Msg.Description,
	})

	if err != nil {
		return nil, err
	}
	return connect.NewResponse(&productsv1.UpdateProductResponse{
		Data: &productsv1.Product{
			Name:        product.Name,
			Description: product.Description,
			Price:       product.Price,
			Id:          int64(product.ID),
		},
	}), nil
}

func (p *ProductHandler) DeleteProduct(ctx context.Context, req *connect.Request[productsv1.DeleteProductRequest]) (*connect.Response[productsv1.DeleteProductResponse], error) {
	err := p.store.DeleteProductById(ctx, req.Msg.Id)
	if err != nil {
		return connect.NewResponse(&productsv1.DeleteProductResponse{
			Succcess: false,
		}), err
	}
	return connect.NewResponse(&productsv1.DeleteProductResponse{
		Succcess: true,
	}), nil
}

func NewProductHandler(store *productsrepo.Queries) *ProductHandler {
	return &ProductHandler{
		store: store,
	}
}
