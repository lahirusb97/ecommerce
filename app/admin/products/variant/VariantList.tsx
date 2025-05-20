"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { VariantOption } from "@/lib/generated/prisma";
import { VariantEditTableRow } from "./VariantEditTableRow";
import { VariantCreateTableRow } from "./VariantCreateTableRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function VariantList() {
  const [options, setOptions] = useState<VariantOption[]>([]);
  const [editing, setEditing] = useState<VariantOption | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOptions = async () => {
    setLoading(true);
    const res = await fetch("/api/variant-options");
    const data = await res.json();
    setOptions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this option?")) return;
    const res = await fetch(`/api/variant-options/${id}/`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Variant option deleted successfully");
      fetchOptions();
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      if (typeof data.error === "string") {
        toast.error(data.error);
      } else {
        toast.error("Failed to delete variant option.");
      }
    }
    // You can show a toast here on error
  };

  return (
    <Card className="w-full pt-2 md:w-2/3 gap-0 mx-auto shadow-lg rounded-2xl border">
      <CardHeader className="p-2 flex flex-col">
        <CardTitle className="text-xl mb-1 tracking-tight text-foreground">
          Variant Options
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-2">
          Manage your product variant options (e.g. Size, Color) here.
        </p>
      </CardHeader>
      <CardContent className="p-2">
        <VariantCreateTableRow onCreated={fetchOptions} />

        <table className="min-w-full rounded-xl overflow-hidden border bg-background">
          <thead>
            <tr className="bg-muted rounded-xl text-left">
              <th className="p-2 font-medium text-sm w-[70%]">Name</th>
              <th className="p-2 font-medium text-sm text-right w-[30%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {options.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="text-center py-4 text-muted-foreground"
                >
                  No variant options found.
                </td>
              </tr>
            )}
            {options.map((option) =>
              editing && editing.id === option.id ? (
                <VariantEditTableRow
                  key={option.id.toString()}
                  id={option.id.toString()}
                  initialName={option.name}
                  colSpan={2}
                  onSaved={() => {
                    setEditing(null);
                    fetchOptions();
                  }}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <tr
                  key={option.id.toString()}
                  className="border-b last:border-b-0 hover:bg-accent/50 transition"
                >
                  <td className="p-2 align-middle">{option.name}</td>
                  <td className="p-2 text-right flex justify-end gap-1 align-middle">
                    <Button
                      variant="outline"
                      size="xsm"
                      className="border-muted"
                      onClick={() => setEditing(option)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="xsm"
                      onClick={() => handleDelete(option.id.toString())}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              )
            )}
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-2">
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </td>
                  <td className="p-2 text-right">
                    <div className="h-4 bg-muted rounded w-10 ml-auto" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
