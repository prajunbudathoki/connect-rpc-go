import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { productsClient } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/inputs/form-context";

export const Route = createFileRoute("/products/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      name: "",
      price: BigInt(0),
      description: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await productsClient.createProduct({
          name: value.name,
          price: value.price,
          description: value.description,
        });
        toast.success("Product created successfully");
        navigate({ to: "/" });
      } catch (error) {
        console.error(error);
        toast.error("Failed to create product");
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create Product using Connect RPC
      </h1>
      <form.AppForm >
        <form.AppField
          name="name"
          children={(field) => (
            <field.TextField
              label="Product Name"
              placeholder="Enter product name"
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              required
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
              required
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
          onClick={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          Create
        </Button>
      </form.AppForm>
    </div>
  );
}
