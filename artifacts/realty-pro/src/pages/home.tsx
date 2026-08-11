import { useLanguage } from "@/contexts/LanguageContext";
import { useGetFeaturedProperties, useGetStatsSummary, useGetStatsCities } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search, Building2, TrendingUp, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { EGYPT_GOVERNORATES } from "@/lib/site-content";
import { PropertyCard } from "@/components/ui/property-card";
import { useState } from "react";

const CITY_IMAGES: Record<string, string> = {
  // Egypt - All 27 Governorates
  "Cairo": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=700&q=80",
  "Giza": "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=700&q=80",
  "Alexandria": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=80",
  "Dakahlia": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80",
  "Red Sea": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=700&q=80",
  "Beheira": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=700&q=80",
  "Fayoum": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80",
  "Gharbia": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80",
  "Ismailia": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700&q=80",
  "Monufia": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80",
  "Minya": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80",
  "Qalyubia": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80",
  "New Valley": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80",
  "Suez": "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=700&q=80",
  "Aswan": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=80",
  "Assiut": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80",
  "Beni Suef": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=700&q=80",
  "Port Said": "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=700&q=80",
  "Damietta": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80",
  "Sharkia": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80",
  "South Sinai": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=700&q=80",
  "Kafr El Sheikh": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80",
  "Matrouh": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80",
  "Luxor": "https://images.unsplash.com/photo-1548013146-72479768bada?w=700&q=80",
  "Qena": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80",
  "North Sinai": "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=700&q=80",
  "Sohag": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80",
  "default": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=700&q=80",
};

export default function Home() {
  const { t, language } = useLanguage();
  const [location, setLocation] = useLocation();
  const { data: featured, isLoading: isLoadingFeatured } = useGetFeaturedProperties();
  const { data: stats, isLoading: isLoadingStats } = useGetStatsSummary();

  const [searchType, setSearchType] = useState<string>("all");
  const [searchCity, setSearchCity] = useState<string>("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchType !== "all") params.append("type", searchType);
    if (searchCity !== "all") params.append("city", searchCity);
    setLocation(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80")' }}
        />

        <div className="container mx-auto px-4 relative z-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl space-y-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                🇪🇬 {t("Egypt", "مصر")}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg leading-tight">
              {t("Find Your Dream Home", "اكتشف منزل أحلامك")}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-md max-w-2xl mx-auto font-medium leading-relaxed mt-6">
              {t(
                "Egypt's premier real estate platform — covering all 27 governorates.",
                "المنصة العقارية الأولى في مصر — تغطي كل الـ 27 محافظة."
              )}
            </p>

            <div className="mt-10 rounded-card p-5 shadow-2xl max-w-4xl mx-auto border border-white/10" style={{ background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(12px)' }}>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="h-14 bg-transparent border-none text-foreground text-base focus:ring-0 rounded-input">
                      <SelectValue placeholder={t("Property Type", "نوع العقار")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto rounded-card" position="popper" sideOffset={4}>
                      <SelectItem value="all">{t("All Types", "جميع الأنواع")}</SelectItem>
                      <SelectItem value="sale">{t("For Sale", "للبيع")}</SelectItem>
                      <SelectItem value="rent">{t("For Rent", "للإيجار")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="hidden md:block w-px bg-white/20 my-2" />

                <div className="flex-1">
                  <Select value={searchCity} onValueChange={setSearchCity}>
                    <SelectTrigger className="h-14 bg-transparent border-none text-foreground text-base focus:ring-0 rounded-input">
                      <SelectValue placeholder={t("Select City", "اختر المدينة")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto rounded-card" position="popper" sideOffset={4}>
                      <SelectItem value="all">{t("All Cities", "جميع المدن")}</SelectItem>
                      {EGYPT_GOVERNORATES.map((c) => (
                        <SelectItem key={c.en} value={c.en}>
                          {language === "ar" ? c.ar : c.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" size="lg" className="h-14 px-8 text-base font-semibold rounded-button shadow-lg">
                  <Search className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t("Search", "ابحث")}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-24 lg:py-32 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {isLoadingStats ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <Skeleton className="w-28 h-10" />
                  <Skeleton className="w-36 h-5" />
                </div>
              ))
            ) : (
              <>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-4xl font-bold">{stats?.totalProperties}</h3>
                  <p className="text-sm text-muted-foreground">{t("Total Properties", "إجمالي العقارات")}</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <h3 className="text-4xl font-bold">{stats?.forSale}</h3>
                  <p className="text-sm text-muted-foreground">{t("For Sale", "للبيع")}</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <h3 className="text-4xl font-bold">{stats?.totalCities}</h3>
                  <p className="text-sm text-muted-foreground">{t("Governorates Covered", "المحافظات المغطاة")}</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-4xl font-bold">{stats?.newThisMonth}</h3>
                  <p className="text-sm text-muted-foreground">{t("New This Month", "جديد هذا الشهر")}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12 md:mb-16">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                {t("Featured Properties", "عقارات مميزة")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {t(
                  "Explore our handpicked selection of premium properties.",
                  "استكشف تشكيلتنا المختارة بعناية من العقارات الفاخرة."
                )}
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex group text-base font-semibold" onClick={() => setLocation('/properties')}>
              {t("View All", "عرض الكل")}
              {language === "en" ?
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /> :
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              }
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {isLoadingFeatured ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full aspect-[4/3] rounded-card" />
                  <Skeleton className="w-2/3 h-8" />
                  <Skeleton className="w-1/2 h-5" />
                </div>
              ))
            ) : (
              Array.isArray(featured) && featured.slice(0, 3).map((property, i) => (
                <div
                  key={property.id}
                  onClick={() => setLocation(`/properties/${property.id}`)}
                  className="property-card aspect-[4/3] shadow-md"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <img
                    src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
                    alt={language === "ar" ? property.titleAr : property.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* City Highlights */}
      <section className="py-20 md:py-24 lg:py-32 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <span className="text-sm font-bold text-primary uppercase tracking-[0.25em]">
              {t("Egypt", "مصر")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
            {t("Popular Locations", "مواقع شهيرة")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground text-center mb-16 max-w-xl mx-auto leading-relaxed">
            {t(
              "From Cairo to Aswan, from Alexandria to Sinai — we cover all 27 governorates of Egypt.",
              "من القاهرة لأسوان، ومن الإسكندرية لسيناء — نغطي كل الـ 27 محافظة في مصر."
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EGYPT_GOVERNORATES.slice(0, 6).map((city, i) => {
              const img = CITY_IMAGES[city.en] ?? CITY_IMAGES["default"];
              const isFeatured = i === 0 || i === 1;
              return (
                <motion.div
                  key={city.en}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                  className={`group cursor-pointer relative rounded-card overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 ${isFeatured ? "row-span-1 h-72" : "h-64"}`}
                  onClick={() => setLocation(`/properties?city=${city.en}`)}
                >
                  <img
                    src={img}
                    alt={language === "ar" ? city.ar : city.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="text-2xl font-bold leading-tight mb-2">
                      {language === "ar" ? city.ar : city.en}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">
                      {t("Explore properties", "استكشف العقارات")}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/95 text-primary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider rounded-badge">
                      {t("Explore", "استكشف")}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
