"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/generated/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { updateCategory, deleteCategory } from "./categoryAction";

interface CategoryWithChildren extends Category {
  children: Category[];
}

interface CategoryTableProps {
  categories: CategoryWithChildren[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Editing state for parent categories
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");

  // Editing state for subcategories
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<
    string | null
  >(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState("");

  // Handlers for parent categories
  const handleEditCategory = (id: string, name: string) => {
    setEditingSubcategoryId(null);
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const handleSaveCategory = async () => {
    if (!editingCategoryId) return;
    const cat = categories.find((c) => c.id.toString() === editingCategoryId);
    if (!cat) return;

    await updateCategory({
      id: editingCategoryId,
      name: editingCategoryName,
      slug: cat.slug,
      parentId: cat.parentId ? cat.parentId.toString() : null,
    });
    setEditingCategoryId(null);
    startTransition(() => router.refresh());
  };

  const handleCancelCategory = () => {
    setEditingCategoryId(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory({ id });
    startTransition(() => router.refresh());
  };

  // Handlers for subcategories
  const handleEditSubcategory = (parentId: string, sub: Category) => {
    setEditingCategoryId(null);
    setEditingSubcategoryId(sub.id.toString());
    setEditingSubcategoryName(sub.name);
  };

  const handleSaveSubcategory = async () => {
    if (!editingSubcategoryId) return;
    // find parentId and slug
    let parentId: string | null = null;
    let subSlug = "";
    categories.forEach((cat) => {
      const found = cat.children.find(
        (c) => c.id.toString() === editingSubcategoryId
      );
      if (found) {
        parentId = cat.id.toString();
        subSlug = found.slug;
      }
    });
    if (!parentId) return;

    await updateCategory({
      id: editingSubcategoryId,
      name: editingSubcategoryName,
      slug: subSlug,
      parentId,
    });
    setEditingSubcategoryId(null);
    startTransition(() => router.refresh());
  };

  const handleCancelSubcategory = () => {
    setEditingSubcategoryId(null);
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm("Delete this subcategory?")) return;
    await deleteCategory({ id });
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-4">
      {/* Mobile: cards */}
      <div className="md:hidden space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id.toString()}
            className="p-4 bg-background rounded-lg shadow-sm border"
          >
            <div className="flex justify-between items-center mb-2">
              {editingCategoryId === cat.id.toString() ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    className="h-8"
                  />
                  <Button
                    size="xsm"
                    variant="outline"
                    onClick={handleSaveCategory}
                    disabled={isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="xsm"
                    variant="outline"
                    onClick={handleCancelCategory}
                    disabled={isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                  <div className="flex space-x-2">
                    <Button
                      size="xsm"
                      variant="outline"
                      onClick={() =>
                        handleEditCategory(cat.id.toString(), cat.name)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="xsm"
                      variant="destructive"
                      onClick={() => handleDeleteCategory(cat.id.toString())}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>

            {cat.children.length > 0 ? (
              <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                {cat.children.map((sub) => (
                  <li
                    key={sub.id.toString()}
                    className="flex justify-between items-center"
                  >
                    {editingSubcategoryId === sub.id.toString() ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingSubcategoryName}
                          onChange={(e) =>
                            setEditingSubcategoryName(e.target.value)
                          }
                          className="h-7"
                        />
                        <Button
                          size="xsm"
                          variant="outline"
                          onClick={handleSaveSubcategory}
                          disabled={isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="xsm"
                          variant="outline"
                          onClick={handleCancelSubcategory}
                          disabled={isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span>{sub.name}</span>
                        <div className="flex space-x-1">
                          <Button
                            size="xsm"
                            variant="outline"
                            onClick={() =>
                              handleEditSubcategory(cat.id.toString(), sub)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="xsm"
                            variant="destructive"
                            onClick={() =>
                              handleDeleteSubcategory(sub.id.toString())
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No subcategories
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border bg-background rounded-lg">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 text-sm font-semibold text-foreground">
                Category
              </th>
              <th className="p-3 text-sm font-semibold text-foreground">
                Subcategories
              </th>
              <th className="p-3 text-sm font-semibold text-foreground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => (
              <tr
                key={cat.id.toString()}
                className="hover:bg-accent/10 transition-colors"
              >
                <td className="p-3 text-sm">
                  {editingCategoryId === cat.id.toString() ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="h-8"
                      />
                      <Button
                        size="xsm"
                        variant="outline"
                        onClick={handleSaveCategory}
                        disabled={isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="xsm"
                        variant="outline"
                        onClick={handleCancelCategory}
                        disabled={isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    cat.name
                  )}
                </td>

                <td className="p-3 text-sm">
                  {cat.children.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {cat.children.map((sub) => (
                        <span
                          key={sub.id.toString()}
                          className="inline-flex items-center space-x-1"
                        >
                          {editingSubcategoryId === sub.id.toString() ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={editingSubcategoryName}
                                onChange={(e) =>
                                  setEditingSubcategoryName(e.target.value)
                                }
                                className="h-7"
                              />
                              <Button
                                size="xsm"
                                variant="outline"
                                onClick={handleSaveSubcategory}
                                disabled={isPending}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="xsm"
                                variant="outline"
                                onClick={handleCancelSubcategory}
                                disabled={isPending}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span>{sub.name}</span>
                              <Button
                                size="xsm"
                                variant="outline"
                                onClick={() =>
                                  handleEditSubcategory(cat.id.toString(), sub)
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="xsm"
                                variant="destructive"
                                onClick={() =>
                                  handleDeleteSubcategory(sub.id.toString())
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>

                <td className="p-3 text-right space-x-2">
                  {editingCategoryId !== cat.id.toString() && (
                    <>
                      <Button
                        size="xsm"
                        variant="outline"
                        onClick={() =>
                          handleEditCategory(cat.id.toString(), cat.name)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="xsm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(cat.id.toString())}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
