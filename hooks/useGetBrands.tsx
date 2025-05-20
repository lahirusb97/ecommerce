import { useState, useEffect, useCallback, useRef } from "react";

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface UseGetBrandsReturn {
  brands: Brand[];
  brandsLoading: boolean;
  brandsError: boolean;
  refresh: () => void;
}

export default function useGetBrands(): UseGetBrandsReturn {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState<boolean>(true);
  const [brandsError, setBrandsError] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchBrands = useCallback(async () => {
    // abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setBrandsLoading(true);
    setBrandsError(false);

    try {
      const res = await fetch("/api/brand", {
        method: "GET",
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch brands (${res.status})`);
      }

      const data: Brand[] = await res.json();
      if (!controller.signal.aborted) {
        setBrands(data);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error("Error fetching brands:", err);
        setBrandsError(true);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setBrandsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchBrands();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchBrands]);

  return {
    brands,
    brandsLoading,
    brandsError,
    refresh: fetchBrands,
  };
}
