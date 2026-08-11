import { useLanguage } from "@/contexts/LanguageContext";
import { useListProperties } from "@workspace/api-client-react";
import { PropertyCard } from "@/components/ui/property-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Filter, Grid, List as ListIcon, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EGYPT_GOVERNORATES } from "@/lib/site-content";

const EGYPT_CITIES = EGYPT_GOVERNORATES;

export default function Properties() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);

  const [type, setType] = useState<any>(searchParams.get("type") || "all");
  const [city, setCity] = useState(searchParams.get("city") || "all");
  const [category, setCategory] = useState<any>("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(0);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(50000000);

  const activeCities = EGYPT_CITIES;

  // Debounce price updates to avoid lag
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 300);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice]);

  const { data, isLoading } = useListProperties({
    type: type !== "all" ? type : undefined,
    city: city !== "all" ? city : undefined,
    category: category !== "all" ? category : undefined,
    minPrice: debouncedMinPrice,
    maxPrice: debouncedMaxPrice,
    limit: 50,
  });

  const clearFilters = () => {
    setType("all");
    setCity("all");
    setCategory("all");
    setMinPrice(0);
    setMaxPrice(50000000);
    setDebouncedMinPrice(0);
    setDebouncedMaxPrice(50000000);
  };

  const hasActiveFilters = type !== "all" || city !== "all" || category !== "all" || 
    minPrice !== 0 || maxPrice !== 50000000;

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  const pricePresets = [
    { label: "All", min: 0, max: 50000000 },
    { label: "Under 1M", min: 0, max: 1000000 },
    { label: "1M - 5M", min: 1000000, max: 5000000 },
    { label: "5M - 10M", min: 5000000, max: 10000000 },
    { label: "10M - 20M", min: 10000000, max: 20000000 },
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold">{t("Property Type", "نوع العقار")}</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-12 text-base rounded-input">
            <SelectValue placeholder={t("Select Type", "اختر النوع")} />
          </SelectTrigger>
          <SelectContent className="rounded-card">
            <SelectItem value="all">{t("All", "الكل")}</SelectItem>
            <SelectItem value="sale">{t("For Sale", "للبيع")}</SelectItem>
            <SelectItem value="rent">{t("For Rent", "للإيجار")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold">{t("Category", "الفئة")}</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-12 text-base rounded-input">
            <SelectValue placeholder={t("Select Category", "اختر الفئة")} />
          </SelectTrigger>
          <SelectContent className="rounded-card">
            <SelectItem value="all">{t("All", "الكل")}</SelectItem>
            <SelectItem value="apartment">{t("Apartment", "شقة")}</SelectItem>
            <SelectItem value="villa">{t("Villa", "فيلا")}</SelectItem>
            <SelectItem value="commercial">{t("Commercial", "تجاري")}</SelectItem>
            <SelectItem value="land">{t("Land", "أرض")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold">{t("City", "المدينة")}</label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="h-12 text-base rounded-input">
            <SelectValue placeholder={t("Select City", "اختر المدينة")} />
          </SelectTrigger>
          <SelectContent className="max-h-52 overflow-y-auto rounded-card">
            <SelectItem value="all">{t("All Cities", "كل المدن")}</SelectItem>
            {activeCities.map((c) => (
              <SelectItem key={c.en} value={c.en}>
                {language === "ar" ? c.ar : c.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold">{t("Price Range", "نطاق السعر")}</label>
        
        {/* Quick Price Presets */}
        <div className="flex flex-wrap gap-2">
          {pricePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => { setMinPrice(preset.min); setMaxPrice(preset.max); }}
              className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all
                ${minPrice === preset.min && maxPrice === preset.max
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
                }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Number Inputs */}
        <div className="flex gap-3 pt-4">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block font-medium">{t("Min", "الأدنى")}</label>
            <Input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              placeholder="0"
              min={0}
              max={50000000}
              className="h-12 text-base"
              step="100000"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block font-medium">{t("Max", "الأقصى")}</label>
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              placeholder="50M"
              min={0}
              max={50000000}
              className="h-12 text-base"
              step="1000000"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1 h-12 text-base font-semibold" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          {t("Clear", "مسح")}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container px-4 py-12 md:py-16 lg:py-20 mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
      {/* Desktop Filters */}
      <aside className="hidden md:block w-72 shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("Filters", "الفلتر")}</h2>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm font-semibold">
                <X className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t("Clear", "مسح")}
              </Button>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-input gap-2">
                <Filter className="w-5 h-5" />
                {t("Filters", "الفلتر")}
                {hasActiveFilters && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-badge">
                    {[type !== "all", category !== "all", city !== "all", minPrice !== 0 || maxPrice !== 50000000].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl font-bold">{t("Filters", "الفلتر")}</SheetTitle>
              </SheetHeader>
              <FilterContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {type !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20 rounded-badge">
                {type === "sale" ? t("For Sale", "للبيع") : t("For Rent", "للإيجار")}
                <button onClick={() => setType("all")} className="hover:text-primary/70">
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            {category !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20 rounded-badge">
                {category === "apartment" ? t("Apartment", "شقة") :
                 category === "villa" ? t("Villa", "فيلا") :
                 category === "commercial" ? t("Commercial", "تجاري") :
                 category === "land" ? t("Land", "أرض") : category}
                <button onClick={() => setCategory("all")} className="hover:text-primary/70">
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            {city !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20 rounded-badge">
                {language === "ar" ? activeCities.find((c: any) => c.en === city)?.ar ?? city : city}
                <button onClick={() => setCity("all")} className="hover:text-primary/70">
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            {(minPrice !== 0 || maxPrice !== 50000000) && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20 rounded-badge">
                {formatPrice(minPrice)} - {formatPrice(maxPrice)} EGP
                <button onClick={() => { setMinPrice(0); setMaxPrice(50000000); setDebouncedMinPrice(0); setDebouncedMaxPrice(50000000); }} className="hover:text-primary/70">
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
          </motion.div>
        )}

        {/* View Toggle & Results Count */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-muted-foreground text-sm">
            {isLoading ? (
              <Skeleton className="w-24 h-5" />
            ) : (
              t(
                `${data?.total || 0} properties found`,
                `${data?.total || 0} عقار تم العثور عليه`
              )
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-button"
            >
              <Grid className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-button"
            >
              <ListIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-full aspect-[4/3] rounded-card" />
                <Skeleton className="w-3/4 h-8" />
                <Skeleton className="w-1/2 h-5" />
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {Array.isArray(data?.properties) && data.properties.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && (!data?.properties || data.properties.length === 0) && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t("No Properties Found", "لم يتم العثور على عقارات")}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t(
                "Try adjusting your filters to find what you're looking for.",
                "حاول تعديل الفلاتر للعثور على ما تبحث عنه."
              )}
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-6 h-12 text-base font-semibold rounded-button">
              {t("Clear Filters", "مسح الفلاتر")}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
