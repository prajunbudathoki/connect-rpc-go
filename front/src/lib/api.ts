import { ProductService } from "@/gen/products/v1/products_pb";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
});

export const productsClient = createClient(ProductService, transport);
