import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";
import { productsClient } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: App,
  async loader() {
    const res = await productsClient.getAllProducts({});

    return { products: res.products };
  },
});

function App() {
  const { products } = Route.useLoaderData();
  return (
    <div className="text-center">
      {products.map((p) => {
        return (
          <div>
            <h1>{p.name}</h1>
          </div>
        );
      })}
    </div>
  );
}
