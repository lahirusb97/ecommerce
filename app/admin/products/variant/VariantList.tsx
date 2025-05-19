"use client";
import React, { useEffect, useState } from "react";
import { VariantCreate } from "./VariantCreate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { VariantOption } from "@/lib/generated/prisma";
import { VariantEditTableRow } from "./VariantEditTableRow";

export default function VariantList() {
  const [options, setOptions] = useState<VariantOption[]>([]);
  const [editing, setEditing] = useState<VariantOption | null>(null);

  const fetchOptions = async () => {
    const res = await fetch("/api/variant-options");
    const data = await res.json();
    setOptions(data);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this option?")) return;
    const res = await fetch(`/api/variant-options/${id}`, { method: "DELETE" });
    if (res.ok) fetchOptions();
    // You can show a toast here on error
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card className="mb-6">
        <VariantCreate onCreated={fetchOptions} />
      </Card>

      <Card>
        <table className="min-w-full border-collapse rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-3 font-semibold">ID</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {options.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-muted-foreground"
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
                  colSpan={3}
                  onSaved={() => {
                    setEditing(null);
                    fetchOptions();
                  }}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <tr
                  key={option.id.toString()}
                  className="border-b last:border-b-0"
                >
                  <td className="p-3">{option.id.toString()}</td>
                  <td className="p-3">{option.name}</td>
                  <td className="p-3 text-right flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditing(option)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(option.id.toString())}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
