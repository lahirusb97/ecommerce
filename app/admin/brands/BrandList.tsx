// app/admin/brands/BrandList.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrand, updateBrand, deleteBrand } from "./brandActions";
import { Brand } from "@/lib/generated/prisma";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialBrands: Brand[];
}

export default function BrandList({ initialBrands }: Props) {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [editingId, setEditingId] = useState<string | null>(null);

  // keep local state in sync when props change
  useEffect(() => {
    setBrands(initialBrands);
  }, [initialBrands]);

  // CREATE
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await createBrand({
        name: fd.get("name") as string,
        slug: fd.get("slug") as string,
      });
      toast.success("Brand created successfully");
    } catch (error) {
      const result = error as { success: boolean; error: string };
      if (!result.success) {
        toast.error(result.error);
      }
    }
    router.refresh();
  };

  // UPDATE
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await updateBrand({
        id: fd.get("id") as string,
        name: fd.get("name") as string,
        slug: fd.get("slug") as string,
      });
      toast.success("Brand updated successfully");
    } catch (error) {
      const result = error as { success: boolean; error: string };
      if (!result.success) {
        toast.error(result.error);
      }
    }
    setEditingId(null);
    router.refresh();
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand and all its products?")) return;
    try {
      await deleteBrand({ id });
      toast.success("Brand deleted successfully");
    } catch (error) {
      const result = error as { success: boolean; error: string };
      if (!result.success) {
        toast.error(result.error);
      }
    }
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">New Brand</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div className="flex flex-col space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Brand name
            </label>
            <Input name="name" placeholder="Brand name" required />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="slug" className="text-sm font-medium">
              URL slug (unique)
            </label>
            <Input name="slug" placeholder="URL slug (unique)" required />
          </div>
          <Button type="submit">Create</Button>
        </form>

        <hr />

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2">Name</th>
              <th className="p-2">Slug</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) =>
              editingId === b.id.toString() ? (
                <tr key={b.id.toString()}>
                  <td colSpan={3} className="p-2">
                    <form
                      onSubmit={handleUpdate}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
                    >
                      <input type="hidden" name="id" value={b.id.toString()} />
                      <Input name="name" defaultValue={b.name} required />
                      <Input name="slug" defaultValue={b.slug} required />
                      <div className="flex justify-end gap-2">
                        <Button type="submit" size="xsm">
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="xsm"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={b.id.toString()} className="border-b">
                  <td className="p-2">{b.name}</td>
                  <td className="p-2">{b.slug}</td>
                  <td className="p-2 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="xsm"
                      onClick={() => setEditingId(b.id.toString())}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="destructive"
                      size="xsm"
                      onClick={() => handleDelete(b.id.toString())}
                    >
                      <Trash2 />
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
