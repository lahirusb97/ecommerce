// app/(admin)/products/create/page.tsx
import CreateProductForm from "./ProductCreateForm";

export default async function CreateProductPage() {
  return (
    <div className="max-w-3xl mx-auto p-1">
      <h1 className="text-2xl font-semibold mb-1">Create New Product</h1>
      <CreateProductForm />
    </div>
  );
}
