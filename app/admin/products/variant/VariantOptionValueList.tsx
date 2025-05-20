"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VariantOptionCreate from "./VariantOptionCreate";
import { VariantOptionValueEditRow } from "./VariantOptionValueEditRow";
import type { VariantOptionValue, VariantOption } from "@/lib/generated/prisma";
import { deleteVariantOptionValue, updateVariantOptionValue } from "./actions";
import isPrismaKnownRequestError from "@/lib/isPrismaKnownRequestError";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  initialValues: VariantOptionValue[];
  initialOptions: VariantOption[];
}

export default function VariantOptionValueList({
  initialValues,
  initialOptions,
}: Props) {
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdate = async ({
    id,
    optionId,
    value,
  }: {
    id: string;
    optionId: string;
    value: string;
  }) => {
    // 1) call our server action
    await updateVariantOptionValue({
      id,
      optionId: Number(optionId),
      value,
    });

    // 2) Re-render the server component tree
    router.refresh();

    // 3) close the edit row
    setEditingId(null);
  };
  // 2) Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this variant value?")) return;
    try {
      await deleteVariantOptionValue({ id });
      // router.refresh() is optional here since revalidatePath was called,
      // but won’t hurt:
      router.refresh();
      toast.success("Variant value deleted successfully");
    } catch (err) {
      if (isPrismaKnownRequestError(err)) {
        toast.error(
          typeof err.message === "string" ? err.message : "Delete failed."
        );
      } else {
        toast.error("Delete failed.");
      }
    }
  };
  return (
    <Card className="w-full pt-2 md:w-2/3 gap-0 mx-auto shadow-lg rounded-2xl border">
      <CardHeader className="px-4 pt-0">
        <CardTitle className="text-xl">Variant Option Values</CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-0 ">
        <p className="text-sm text-muted-foreground mb-1">
          All values belonging to each product variant option.
        </p>

        <div className="mb-1">
          <VariantOptionCreate options={initialOptions} />
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-sm bg-background border rounded-xl">
            <thead>
              <tr className="bg-muted text-left">
                <th className="p-2 font-semibold">Option</th>
                <th className="p-2 font-semibold">Value</th>
                <th className="p-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {initialValues.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-4 text-center text-muted-foreground"
                  >
                    No variant option values found.
                  </td>
                </tr>
              )}

              {initialValues.map((item) =>
                editingId === item.id.toString() ? (
                  <VariantOptionValueEditRow
                    key={item.id}
                    id={item.id.toString()}
                    options={initialOptions}
                    initialOptionId={item.optionId.toString()}
                    initialValue={item.value}
                    colSpan={3}
                    onSaved={() => setEditingId(null)}
                    onCancel={() => setEditingId(null)}
                    onUpdate={handleUpdate}
                  />
                ) : (
                  <tr
                    key={item.id}
                    className="border-b last:border-b-0 hover:bg-accent/40 transition"
                  >
                    <td className="p-2">
                      {initialOptions.find((o) => o.id === item.optionId)?.name}
                    </td>
                    <td className="p-2">{item.value}</td>
                    <td className="p-2  text-right">
                      <Button
                        variant="outline"
                        size="xsm"
                        className="mr-1"
                        onClick={() => setEditingId(item.id.toString())}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="xsm"
                        onClick={() => handleDelete(item.id.toString())}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
