import { useState, useEffect, useMemo } from "react";
import {
  MOCK_PROPERTIES,
  MOCK_STATS_SUMMARY,
} from "./mock-data";
import { getAllProperties } from "./admin/propertyManager";
import type { Property, PropertyList, StatsSummary, FavoriteInput } from "./mock-data";

const FAV_KEY = "realty-favorites";

function readFavorites(): number[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: number[]) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable */
  }
}

export function useMockListFavorites() {
  const [ids, setIds] = useState<number[]>(() => readFavorites());

  useEffect(() => {
    const onStore = () => setIds(readFavorites());
    window.addEventListener("storage", onStore);
    window.addEventListener("realty-favorites-changed", onStore);
    return () => {
      window.removeEventListener("storage", onStore);
      window.removeEventListener("realty-favorites-changed", onStore);
    };
  }, []);

  const invalidate = () => {
    // mirrors the original onSuccess invalidation
    window.dispatchEvent(new Event("realty-favorites-changed"));
  };

  const mutateFavorite = (vars: unknown, opts?: { onSuccess?: () => void }, remove = false) => {
    const input = (vars as { data?: FavoriteInput } | undefined)?.data;
    const propertyId = typeof input?.propertyId === "number" ? input.propertyId : undefined;
    if (propertyId === undefined) {
      opts?.onSuccess?.();
      return;
    }
    setIds((prev) => {
      let next: number[];
      if (remove) {
        next = prev.filter((id) => id !== propertyId);
      } else {
        if (prev.includes(propertyId)) {
          opts?.onSuccess?.();
          return prev;
        }
        next = [...prev, propertyId];
      }
      writeFavorites(next);
      // refresh after write
      window.setTimeout(() => {
        window.dispatchEvent(new Event("realty-favorites-changed"));
      }, 0);
      opts?.onSuccess?.();
      return next;
    });
  };

  return {
    data: ids,
    isLoading: false,
    isPending: false,
    addFavorite: {
      isPending: false,
      mutate: (vars: unknown, opts?: { onSuccess?: () => void }) => mutateFavorite(vars, opts, false),
      mutateAsync: async (vars: unknown, opts?: { onSuccess?: () => void }) => mutateFavorite(vars, opts, false),
    },
    removeFavorite: {
      isPending: false,
      mutate: (vars: unknown, opts?: { onSuccess?: () => void }) => mutateFavorite(vars, opts, true),
      mutateAsync: async (vars: unknown, opts?: { onSuccess?: () => void }) => mutateFavorite(vars, opts, true),
    },
  };
}

export const MOCK_LIST_PROPERTIES_QUERY_KEY = ["listProperties"] as const;

export function useMockListProperties(
  params?: {
    type?: string;
    city?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  },
  _opts?: { query?: { enabled?: boolean } }
) {
  const data = useMemo<PropertyList>(() => {
    const allProperties = getAllProperties();
    let list = allProperties.filter((p) => {
      if (params?.type && params.type !== "all" && p.type !== params.type) return false;
      if (params?.city && params.city !== "all" && p.city !== params.city) return false;
      if (params?.category && params.category !== "all" && p.category !== params.category) return false;
      if (params?.minPrice && p.price < params.minPrice) return false;
      if (params?.maxPrice && p.price > params.maxPrice) return false;
      return true;
    });
    const limit = params?.limit ?? 50;
    const total = list.length;
    list = list.slice(0, limit);
    return {
      properties: list,
      total,
      page: 1,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }, [
    params?.type,
    params?.city,
    params?.category,
    params?.minPrice,
    params?.maxPrice,
    params?.limit,
  ]);

  return { data, isLoading: false };
}

export function useMockGetProperty(id: number) {
  const data = useMemo<Property | undefined>(() => {
    const allProperties = getAllProperties();
    return allProperties.find((p) => p.id === id);
  }, [id]);

  return { data, isLoading: false };
}

export function useMockGetFeaturedProperties() {
  const data = useMemo<Property[]>(
    () => getAllProperties().filter((p) => p.featured),
    [],
  );
  return { data, isLoading: false };
}

export function useMockGetStatsSummary() {
  const data = useMemo<StatsSummary>(() => MOCK_STATS_SUMMARY, []);
  return { data, isLoading: false };
}

export function useMockGetStatsCities() {
  const data = useMemo(
    () => {
      const allProperties = getAllProperties();
      return Array.from(new Set(allProperties.map((p) => p.city))).map((city) => {
        const prop = allProperties.find((p) => p.city === city)!;
        return {
          city: prop.city,
          cityAr: prop.cityAr,
          count: allProperties.filter((p) => p.city === city).length,
        };
      });
    },
    [],
  );
  return { data, isLoading: false };
}
