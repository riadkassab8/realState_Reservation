import { useLanguage } from "@/contexts/LanguageContext";
import {
  useMockListProperties as useListProperties,
  useMockListFavorites as useListFavorites,
} from "@/lib/localData";
import { PropertyCard } from "@/components/ui/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Favorites() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  
  const { data: favorites = [], isLoading: isLoadingFavs } = useListFavorites();
  
  // We fetch a larger list to filter locally since the API might not support an array of IDs filter directly.
  // In a real production app, the backend would have a dedicated endpoint for this.
  const { data: propertiesData, isLoading: isLoadingProps } = useListProperties({ limit: 100 });

  const isLoading = isLoadingFavs || isLoadingProps;
  
  const favoriteProperties = propertiesData?.properties.filter(p => favorites.includes(p.id)) || [];

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">{t("Saved Properties", "العقارات المحفوظة")}</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-2xl" />
          ))}
        </div>
      ) : favoriteProperties.length === 0 ? (
        <div className="text-center py-32 bg-card rounded-3xl border border-border">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3">{t("No saved properties yet", "لا توجد عقارات محفوظة بعد")}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
            {t("Properties you favorite will appear here. Start exploring to build your collection.", "العقارات التي تفضلها ستظهر هنا. ابدأ في استكشاف العقارات لبناء مجموعتك.")}
          </p>
          <Button size="lg" onClick={() => setLocation("/properties")}>
            {t("Browse Properties", "تصفح العقارات")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProperties.map(property => (
            <PropertyCard key={property.id} property={property} isFavorite={true} />
          ))}
        </div>
      )}
    </div>
  );
}
