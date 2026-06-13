import { useLanguage } from "@/contexts/LanguageContext";
import { useGetFeaturedProperties, useGetStatsSummary, useGetStatsCities } from "@workspace/api-client-react";
import { PropertyCard } from "@/components/ui/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search, Building2, TrendingUp, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { setLocation } from "wouter/use-location";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

const CITY_IMAGES: Record<string, string> = {
  // Saudi Arabia
  "Riyadh": "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=700&q=80",
  "Jeddah": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=700&q=80",
  "Khobar": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80",
  "Dhahran": "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=700&q=80",
  "Dammam": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=700&q=80",
  "Mecca": "https://images.unsplash.com/photo-1564507593729-f6e2e32c1e27?w=700&q=80",
  "Medina": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80",
  "NEOM": "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=700&q=80",
  // Egypt
  "Cairo": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=700&q=80",
  "Giza": "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=700&q=80",
  "Alexandria": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=80",
  "Hurghada": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=700&q=80",
  // Gulf
  "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=80",
  "Abu Dhabi": "https://images.unsplash.com/photo-1529293624168-61236f4c8174?w=700&q=80",
  "Doha": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=700&q=80",
  "Muscat": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=700&q=80",
  "Manama": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=700&q=80",
  "Kuwait City": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80",
  "Amman": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=700&q=80",
  "default": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=700&q=80",
};

export default function Home() {
  const { t, language } = useLanguage();
  const [, setLoc] = useLocation();
  const { data: featured, isLoading: isLoadingFeatured } = useGetFeaturedProperties();
  const { data: stats, isLoading: isLoadingStats } = useGetStatsSummary();
  const { data: cities, isLoading: isLoadingCities } = useGetStatsCities();

  const [searchType, setSearchType] = useState<string>("all");
  const [searchCity, setSearchCity] = useState<string>("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchType !== "all") params.append("type", searchType);
    if (searchCity !== "all") params.append("city", searchCity);
    setLoc(`/properties?${params.toString()}`);
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

        <div className="container relative z-20 px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl space-y-6"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                🇸🇦 {t("Saudi Arabia", "المملكة العربية السعودية")}
              </span>
              <span className="text-white/40 text-xs">·</span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                🇪🇬 {t("Egypt", "مصر")}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg leading-tight">
              {t("Find Your Dream Home", "اكتشف منزل أحلامك")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto font-medium">
              {t(
                "The Arab world's premier real estate platform — operating across Saudi Arabia and Egypt.",
                "المنصة العقارية الأولى في العالم العربي — تعمل في المملكة العربية السعودية ومصر."
              )}
            </p>

            <div className="mt-8 bg-background/95 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-4xl mx-auto border border-border/50">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="h-12 bg-transparent border-none text-foreground text-lg focus:ring-0">
                      <SelectValue placeholder={t("Property Type", "نوع العقار")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Types", "جميع الأنواع")}</SelectItem>
                      <SelectItem value="sale">{t("For Sale", "للبيع")}</SelectItem>
                      <SelectItem value="rent">{t("For Rent", "للإيجار")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="hidden md:block w-px bg-border my-2" />

                <div className="flex-1">
                  <Select value={searchCity} onValueChange={setSearchCity}>
                    <SelectTrigger className="h-12 bg-transparent border-none text-foreground text-lg focus:ring-0">
                      <SelectValue placeholder={t("Select City", "اختر المدينة")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Cities", "جميع المدن")}</SelectItem>
                      {!isLoadingCities && Array.isArray(cities) && cities.map(c => (
                        <SelectItem key={c.city} value={c.city}>
                          {language === "ar" ? c.cityAr : c.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" size="lg" className="h-12 px-8 text-lg rounded-xl shadow-lg">
                  <Search className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t("Search", "ابحث")}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-b border-border/50">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {isLoadingStats ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="w-24 h-8" />
                  <Skeleton className="w-32 h-4" />
                </div>
              ))
            ) : (
              <>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold">{stats?.totalProperties}</h3>
                  <p className="text-muted-foreground">{t("Total Properties", "إجمالي العقارات")}</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold">{stats?.forSale}</h3>
                  <p className="text-muted-foreground">{t("For Sale", "للبيع")}</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold">{stats?.totalCities}</h3>
                  <p className="text-muted-foreground">{t("Cities Covered", "المدن المغطاة")}</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold">{stats?.newThisMonth}</h3>
                  <p className="text-muted-foreground">{t("New This Month", "جديد هذا الشهر")}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                {t("Featured Properties", "عقارات مميزة")}
              </h2>
              <p className="text-muted-foreground max-w-2xl text-lg">
                {t(
                  "Explore our handpicked selection of premium properties.",
                  "استكشف تشكيلتنا المختارة بعناية من العقارات الفاخرة."
                )}
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex group" onClick={() => setLoc('/properties')}>
              {t("View All", "عرض الكل")}
              {language === "en" ?
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /> :
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              }
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingFeatured ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full aspect-[4/3] rounded-xl" />
                  <Skeleton className="w-2/3 h-6" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
              ))
            ) : (
              Array.isArray(featured) && featured.slice(0, 3).map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* City Highlights */}
      <section className="py-24 bg-muted/20">
        <div className="container px-4">
          <div className="text-center mb-4">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.25em]">
              {t("Saudi Arabia & Egypt", "المملكة العربية السعودية ومصر")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            {t("Popular Locations", "مواقع شهيرة")}
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            {t(
              "From Riyadh to Cairo, from Jeddah to Alexandria — we cover every city that matters in Saudi Arabia and Egypt.",
              "من الرياض إلى القاهرة، ومن جدة إلى الإسكندرية — نغطي كل مدينة مهمة في المملكة العربية السعودية ومصر."
            )}
          </p>

          {isLoadingCities ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.isArray(cities) && cities.map((city, i) => {
                const img = CITY_IMAGES[city.city] ?? CITY_IMAGES["default"];
                const isLarge = i === 0 || i === 3;
                return (
                  <motion.div
                    key={city.city}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: (i % 4) * 0.08 }}
                    className={`group cursor-pointer relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 ${isLarge ? "row-span-1 h-72" : "h-56"}`}
                    onClick={() => setLoc(`/properties?city=${city.city}`)}
                  >
                    <img
                      src={img}
                      alt={language === "ar" ? city.cityAr : city.city}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <h3 className="text-xl font-bold leading-tight mb-1">
                        {language === "ar" ? city.cityAr : city.city}
                      </h3>
                      <p className="text-white/70 text-xs font-medium">
                        {city.count} {t("properties", "عقار")}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white/95 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {t("Explore", "استكشف")}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
