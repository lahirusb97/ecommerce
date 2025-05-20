import { useState, useEffect, useCallback, useRef } from "react";

interface VariantOptionValueList {
  id: string;
  name: string;
  values: {
    id: string;
    optionId: string;
    value: string;
  }[];
}
interface UseGetVariantOptionsValuesReturn {
  variantOptionsValues: VariantOptionValueList[];
  variantOptionsValuesLoading: boolean;
  variantOptionsValuesError: boolean;
  variantOptionsValuesRefresh: () => void;
}

export default function useGetVariantOptionsValus(): UseGetVariantOptionsValuesReturn {
  const [variantOptionsValues, setVariantOptionsValues] = useState<
    VariantOptionValueList[]
  >([]);
  const [variantOptionsValuesLoading, setVariantOptionsValuesLoading] =
    useState<boolean>(true);
  const [variantOptionsValuesError, setVariantOptionsValuesError] =
    useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchVariantOptions = useCallback(async () => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setVariantOptionsValuesLoading(true);
    setVariantOptionsValuesError(false);

    try {
      const res = await fetch("/api/variant-options-values", {
        method: "GET",
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch variant options (${res.status})`);
      }

      const data: VariantOptionValueList[] = await res.json();
      if (!controller.signal.aborted) {
        setVariantOptionsValues(data);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error("Error fetching variant options:", err);
        setVariantOptionsValuesError(true);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setVariantOptionsValuesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchVariantOptions();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchVariantOptions]);

  return {
    variantOptionsValues,
    variantOptionsValuesLoading,
    variantOptionsValuesError,
    variantOptionsValuesRefresh: fetchVariantOptions,
  };
}
