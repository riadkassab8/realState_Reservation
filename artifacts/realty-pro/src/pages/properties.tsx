import { useLanguage } from "@/contexts/LanguageContext";
import { useListProperties } from "@workspace/api-client-react";
import { PropertyCard } from "@/components/ui/property-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useLocation } from "wouter";
import { Filter, Grid, List as ListIcon, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const SAUDI_CITIES = [
  { en: "Riyadh", ar: "الرياض" },
  { en: "Jeddah", ar: "جدة" },
  { en: "Mecca", ar: "مكة المكرمة" },
  { en: "Medina", ar: "المدينة المنورة" },
  { en: "Khobar", ar: "الخبر" },
  { en: "Dammam", ar: "الدمام" },
  { en: "Dhahran", ar: "الظهران" },
  { en: "NEOM", ar: "نيوم" },
  { en: "Abha", ar: "أبها" },
  { en: "Tabuk", ar: "تبوك" },
  { en: "Yanbu", ar: "ينبع" },
];

const EGYPT_CITIES = [
  { en: "Cairo", ar: "القاهرة" },
  { en: "Giza", ar: "الجيزة" },
  { en: "Alexandria", ar: "الإسكندرية" },
  { en: "Hurghada", ar: "الغردقة" },
  { en: "Sharm El Sheikh", ar: "شرم الشيخ" },
];

export default function Properties() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);

  const [country, setCountry] = useState<string>(searchParams.get("country") || "all");
  const [type, setType] = useState<any>(searchParams.get("type") || "all");
  const [city, setCity] = useState(searchParams.get("city") || "all");
  const [category, setCategory] = useState<any>("all");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const activeCities =
    country === "Saudi Arabia" ? SAUDI_CITIES :
    country === "Egypt" ? EGYPT_CITIES :
    [...SAUDI_CITIES, ...EGYPT_CITIES];

  const handleCountryChange = (val: string) => {
    setCountry(val);
    setCity("all");
  };

  const { data, isLoading } = useListProperties({
    type: type !== "all" ? type : undefined,
    country: country !== "all" ? (country as any) : undefined,
    city: city !== "all" ? city : undefined,
    category: category !== "all" ? category : undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    limit: 50,
  });

  const clearFilters = () => {
    setCountry("all");
    setType("all");
    setCity("all");
    setCategory("all");
    setPriceRange([0, 50000000]);
  };

  const CountryTabs = () => (
    <div className="flex gap-2 mb-6">
      {[
        { value: "all", label: t("All", "الكل") },
        { value: "Saudi Arabia", label: t("Saudi Arabia", "السعودية"), flag: "🇸🇦" },
        { value: "Egypt", label: t("Egypt", "مصر"), flag: "🇪🇬" },
      ].map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleCountryChange(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all
            ${country === opt.value
              ? "bg-primary text-primary-foreground border-primary shadow"
              : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
        >
          {opt.flag && <span>{opt.flag}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="text-sm font-semibold">{t("Property Type", "نوع العقار")}</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder={t("Select Type", "اختر النوع")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All", "الكل")}</SelectItem>
            <SelectItem value="sale">{t("For Sale", "للبيع")}</SelectItem>
            <SelectItem value="rent">{t("For Rent", "للإيجار")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold">{t("Category", "الفئة")}</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder={t("Select Category", "اختر الفئة")} />
          </SelectTrigger>
          <SelectContent>
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
          <SelectTrigger>
            <SelectValue placeholder={t("Select City", "اختر المدينة")} />
          </SelectTrigger>
          <SelectContent>
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
        <Slider
          min={0}
          max={50000000}
          step={250000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-6"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{priceRange[0].toLocaleString()}</span>
          <span>{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        {t("Clear Filters", "مسح الفلاتر")}
      </Button>
    </div>
  );

  return (
    <div className="container px-4 py-8 mx-auto flex flex-col md:flex-row gap-8">
      {/* Desktop Filters */}
      <aside className="hidden md:block w-72 shrink-0">
        <div className="sticky top-24 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{t("Filters", "تصفية")}</h2>
            <Filter className="w-5 h-5 text-muted-foreground" />
          </div>
          <CountryTabs />
          <FilterContent />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            {t("Properties", "العقارات")}
            {!isLoading && (
              <span className="text-muted-foreground text-lg ml-3 rtl:mr-3 font-normal">
                ({data?.total || 0})
              </span>
            )}
          </h1>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden flex-1">
                  <Filter className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t("Filters", "تصفية")}
                </Button>
              </SheetTrigger>
              <SheetContent side={language === "ar" ? "right" : "left"}>
                <SheetHeader>
                  <SheetTitle>{t("Filters", "تصفية")}</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <CountryTabs />
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* View Toggles */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="w-8 h-8 rounded-md"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="w-8 h-8 rounded-md"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active country badge */}
        {country !== "all" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">
              {t("Showing", "عرض")}:
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
              {country === "Saudi Arabia" ? "🇸🇦" : "🇪🇬"}
              {language === "ar"
                ? country === "Saudi Arabia" ? "المملكة العربية السعودية" : "مصر"
                : country}
            </span>
            {city !== "all" && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm font-medium">
                  {language === "ar"
                    ? activeCities.find((c) => c.en === city)?.ar ?? city
                    : city}
                </span>
              </>
            )}
          </motion.div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className={`rounded-xl ${viewMode === "grid" ? "h-[400px]" : "h-48"}`} />
            ))}
          </div>
        ) : data?.properties.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t("No properties found", "لم يتم العثور على عقارات")}</h3>
            <p className="text-muted-foreground">
              {t("Try adjusting your filters to find what you're looking for.", "حاول تعديل الفلاتر للعثور على ما تبحث عنه.")}
            </p>
            <Button variant="outline" className="mt-6" onClick={clearFilters}>
              {t("Clear Filters", "مسح الفلاتر")}
            </Button>
          </div>
        ) : (
          <motion.div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.07 } },
            }}
            initial="hidden"
            animate="show"
            key={`${country}-${city}-${type}-${category}`}
          >
            {data?.properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
