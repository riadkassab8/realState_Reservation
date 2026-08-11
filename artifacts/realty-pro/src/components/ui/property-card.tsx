import { Property } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/lib/format-price";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Square, MessageCircle } from "lucide-react";
import { useAddFavorite, useRemoveFavorite, useListFavorites, getListFavoritesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { buildWhatsAppLink } from "@/lib/site-content";

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
  const isPending = addFavorite.isPending || removeFavorite.isPending;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Toggle favorite clicked", property.id, isFav, "isPending:", isPending);
    
    if (isPending) {
      console.log("Mutation is pending, ignoring click");
      return;
    }
    
    if (isFav) {
      console.log("Removing from favorites");
      removeFavorite.mutate(
        { data: { propertyId: property.id } },
        { 
          onSuccess: () => {
            console.log("Successfully removed from favorites");
            queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() });
          },
          onError: (error) => {
            console.error("Error removing from favorites:", error);
          }
        }
      );
    } else {
      console.log("Adding to favorites");
      addFavorite.mutate(
        { data: { propertyId: property.id } },
        { 
          onSuccess: () => {
            console.log("Successfully added to favorites");
            queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey() });
          },
          onError: (error) => {
            console.error("Error adding to favorites:", error);
          }
        }
      );
    }
  };

  const buildWhatsAppMessage = () => {
    const propTitle = language === "ar" ? property.titleAr : property.title;
    const propPrice = formatPrice(property.price, property.priceUnit, language);
    const propAddress = language === "ar" ? property.addressAr : property.address;
    
    return language === "ar"
      ? `مرحباً، أريد الاستفسار عن العقار:\n\nالعنوان: ${propTitle}\nالسعر: ${propPrice}\nالموقع: ${propAddress}\nالمساحة: ${property.area} متر مربع`
      : `Hello, I'm interested in this property:\n\nTitle: ${propTitle}\nPrice: ${propPrice}\nLocation: ${propAddress}\nArea: ${property.area} sqm`;
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(buildWhatsAppLink(buildWhatsAppMessage()), '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={`/properties/${property.id}`}>
        <Card className="h-full overflow-hidden border-border/50 hover:shadow-2xl transition-shadow duration-300 group cursor-pointer flex flex-col bg-card rounded-card">
          <div className="relative aspect-[4/3] overflow-hidden property-3d-hover">
            <img 
              src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"} 
              alt={language === "ar" ? property.titleAr : property.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white border-none font-semibold backdrop-blur-sm rounded-badge px-3 py-1.5 text-sm">
                {property.type === "sale" ? t("For Sale", "للبيع") : t("For Rent", "للإيجار")}
              </Badge>
              {property.featured && (
                <Badge className="bg-primary text-primary-foreground border-none font-semibold shadow-lg rounded-badge px-3 py-1.5 text-sm">
                  {t("Featured", "مميز")}
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all z-20"
              onClick={toggleFavorite}
              disabled={isPending}
            >
              <motion.div whileTap={{ scale: 0.8 }}>
                <Heart className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
              </motion.div>
            </Button>

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="text-3xl font-bold tracking-tight drop-shadow-md">
                {formatPrice(property.price, property.priceUnit, language)}
                {property.type === "rent" && <span className="text-base font-normal text-white/80"> / {t("month", "شهر")}</span>}
              </div>
            </div>
          </div>

          <CardContent className="p-6 flex-grow flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                {language === "ar" ? property.titleAr : property.title}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2 leading-relaxed">
                <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
                <span className="line-clamp-1">{language === "ar" ? property.addressAr : property.address}</span>
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-5 border-t border-border/50">
              <div className="flex items-center gap-1.5 font-medium" title={t("Bedrooms", "غرف النوم")}>
                <Bed className="w-4 h-4 text-primary/70" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium" title={t("Bathrooms", "الحمامات")}>
                <Bath className="w-4 h-4 text-primary/70" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium" title={t("Area", "المساحة")}>
                <Square className="w-4 h-4 text-primary/70" />
                <span>{property.area} {t("sqm", "م²")}</span>
              </div>
            </div>

            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 h-12 text-base font-semibold rounded-button"
              size="sm"
            >
              <MessageCircle className="w-4 h-4" />
              {t("WhatsApp", "واتساب")}
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
