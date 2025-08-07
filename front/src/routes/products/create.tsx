import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { productsClient } from "@/lib/api";

export const Route = createFileRoute("/products/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(BigInt(0));
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await productsClient.createProduct({
        name,
        description,
      });
      toast.success("product created successfully");
      navigate({ to: "/" });
    } catch (error) {
      console.error(error);
      toast.error("failed to create product");
    }
  };
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create Product using Connect RPC
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5 ">
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded px-4 py-2 w-full "
        />
        <input
          type="number"
          placeholder="Product price"
          value={Number(price)}
          onChange={(e) => setPrice(BigInt(e.target.value))}
          required
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          type="submit"
          variant="default"
          className="w-full py-2 font-semibold"
        >
          Create
        </Button>
      </form>
    </div>
  );
}
