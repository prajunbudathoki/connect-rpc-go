import {
  createFileRoute,
  Router,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { productsClient } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type TableData = {
  name: string;
  price: BigInt;
  description: string;
};

export const Route = createFileRoute("/")({
  component: App,
  async loader() {
    const res = await productsClient.getAllProducts({});
    return { products: res.products };
  },
});
const columnHelper = createColumnHelper<TableData>();
const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (c) => c.getValue(),
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (c) => c.getValue(),
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (c) => c.getValue(),
  }),
];

function App() {
  const { products } = Route.useLoaderData();
  const navigate = useNavigate();
  const router = useRouter();

  const data: TableData[] = products.map((p: any) => ({
    name: p.name,
    price: p.price,
    description: p.description,
  }));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mx-auto p-6">
      <Button
        className="mb-4"
        onClick={() => navigate({ to: "/products/create" })}
      >
        <Plus className="mr-2" />
        Create Product
      </Button>
      {/* <Table className="w-full border rounded-lg shadow">
        <TableCaption className="mb-2 text-lg font-semibold">
          List of all products
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="py-2 px-4">Product Name</TableHead>
            <TableHead className="py-2 px-4">Product Price</TableHead>
            <TableHead className="py-2 px-4">Product Desc</TableHead>
            <TableHead className="py-2 px-4">Product Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="py-2 px-4">{product.name}</TableCell>
              <TableCell className="py-2 px-4">{product.price}</TableCell>
              <TableCell className="py-2 px-4">{product.description}</TableCell>
              <TableCell className="py-2 px-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate({ to: `/products/edit/${product.id}` })
                  }
                >
                  <Eye className="mr-2" />
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    productsClient.deleteProduct({ id: product.id });
                    toast.success("Product deleted successfully");
                    router.invalidate();
                  }}
                >
                  <Trash className="mr-2" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
      <table>
        <thead>
          {table.getHeaderGroups().map((hGroup) => (
            <tr key={hGroup.id}>
              {hGroup.headers.map((h) => (
                <th key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((r) => (
            <tr key={r.id}>
              {r.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
