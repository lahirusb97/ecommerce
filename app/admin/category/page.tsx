import React from "react";
import CreateMainCategoryForm from "./CreateMainCategoryForm";
import CreateSubCategoryForm from "./CreateSubCategoryForm";

export default function page() {
  return (
    <div>
      <CreateMainCategoryForm />
      <CreateSubCategoryForm />
    </div>
  );
}
