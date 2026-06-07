import { Property } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/lib/format-price";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import { useAddFavorite, useRemoveFavorite, useListFavorites, getListFavoritesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const { data: favorites = [] } = useListFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const isFav = favorites.includes(property.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFav) {
      removeFavorite.mutate(
        { data: { propertyId: property.id } },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() }) }
      );
    } else {
      addFavorite.mutate(
        { data: { propertyId: property.id } },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() }) }
      );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link href={`/properties/${property.id}`}>
        <Card className="h-full overflow-hidden border-border/50 hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex flex-col bg-card">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"} 
              alt={language === "ar" ? property.titleAr : property.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white border-none font-semibold backdrop-blur-sm">
                {property.type === "sale" ? t("For Sale", "للبيع") : t("For Rent", "للإيجار")}
              </Badge>
              {property.featured && (
                <Badge className="bg-primary text-primary-foreground border-none font-semibold shadow-lg">
                  {t("Featured", "مميز")}
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all"
              onClick={toggleFavorite}
            >
              <motion.div whileTap={{ scale: 0.8 }}>
                <Heart className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
              </motion.div>
            </Button>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="text-2xl font-bold tracking-tight drop-shadow-md">
                {formatPrice(property.price, property.priceUnit, language)}
                {property.type === "rent" && <span className="text-sm font-normal text-white/80"> / {t("month", "شهر")}</span>}
              </div>
            </div>
          </div>

          <CardContent className="p-5 flex-grow flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                {language === "ar" ? property.titleAr : property.title}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
                <span className="line-clamp-1">{language === "ar" ? property.addressAr : property.address}</span>
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t border-border/50">
              <div className="flex items-center gap-1.5" title={t("Bedrooms", "غرف النوم")}>
                <Bed className="w-4 h-4 text-primary/70" />
                <span className="font-medium">{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1.5" title={t("Bathrooms", "الحمامات")}>
                <Bath className="w-4 h-4 text-primary/70" />
                <span className="font-medium">{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1.5" title={t("Area", "المساحة")}>
                <Square className="w-4 h-4 text-primary/70" />
                <span className="font-medium">{property.area} {t("sqm", "م²")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
