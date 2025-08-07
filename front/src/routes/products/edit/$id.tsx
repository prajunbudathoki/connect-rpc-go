import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { productsClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/inputs/form-context";

export const Route = createFileRoute("/products/edit/$id")({
  component: RouteComponent,
  async loader({ params }) {
    const product = await productsClient.updateProduct({
      id: BigInt(params.id),
    });
    return { product };
  },
});

function RouteComponent() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      id: product.data?.id,
      name: product.data?.name,
      price: product.data?.price,
      description: product.data?.description,
    },
    onSubmit: async ({ value }) => {
      try {
        await productsClient.updateProduct({
          id: value.id,
          name: value.name,
          description: value.description,
          price: value.price,
        });
        toast.success("Product updated successfully");
        navigate({ to: "/" });
      } catch (error) {
        console.error(error);
        toast.error("Failed to update product");
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Edit Product using Connect RPC
      </h1>
      <form.AppForm>
        <form.AppField
          name="name"
          children={(field) => (
            <field.TextField
              label="Product Name"
              placeholder="Enter product name"
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <form.AppField
          name="price"
          children={(field) => (
            <field.TextField
              label="Product Price"
              placeholder="Enter product price"
              value={Number(field.state.value)}
              onChange={(e) => field.handleChange(BigInt(e.target.value))}
            />
          )}
        />
        <form.AppField
          name="description"
          children={(field) => (
            <field.TextField
              label="Product Description"
              placeholder="Enter product description"
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <Button
          className="w-full py-2 font-semibold"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          Update
        </Button>
      </form.AppForm>
    </div>
  );
}
