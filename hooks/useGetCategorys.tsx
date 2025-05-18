import { useState, useEffect, useCallback, useRef } from "react";

import { paramsNullCleaner } from "@/lib/paramsNullCleaner";

interface CategoryModel {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
}

interface UseGetCategoryReturn {
  categories: CategoryModel[];
  categoriesLoading: boolean;
  categoriesError: boolean;
  refresh: () => void;
  setCategoryParamsData: (newParams: CategoryParams) => void;
}

interface CategoryParams {
  search: string | null;
}

const useGetCategories = (): UseGetCategoryReturn => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<boolean>(false);
  const [params, setParams] = useState<CategoryParams>({
    search: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setCategoriesLoading(true);
    setCategoriesError(false);

    try {
      const query = new URLSearchParams(paramsNullCleaner(params)).toString();
      const res = await fetch(`/api/category/${query}`, {
        method: "GET",
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data: CategoryModel[] = await res.json();

      if (!controller.signal.aborted) {
        setCategories(data);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setCategoriesError(true);
      }
    } finally {
      setCategoriesLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCategories();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCategories]);

  const setParamsData = (newParams: CategoryParams) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  return {
    categories,
    categoriesLoading,
    categoriesError,
    refresh: fetchCategories,
    setCategoryParamsData: setParamsData,
  };
};

export default useGetCategories;
