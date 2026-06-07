import { useLanguage } from "@/contexts/LanguageContext";
import { useGetProperty, useListFavorites, useAddFavorite, useRemoveFavorite, getListFavoritesQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, Bed, Bath, Square, Calendar, Car, ArrowLeft, ArrowRight, Phone, Mail, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PropertyDetail() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  
  const { data: property, isLoading } = useGetProperty(Number(id));
  const { data: favorites = [] } = useListFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto space-y-8">
        <Skeleton className="w-full h-[50vh] rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="w-3/4 h-12" />
            <Skeleton className="w-full h-32" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold">{t("Property not found", "العقار غير موجود")}</h1>
      </div>
    );
  }

  const isFav = favorites.includes(property.id);

  const toggleFavorite = () => {
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

  const title = language === "ar" ? property.titleAr : property.title;
  const desc = language === "ar" ? property.descriptionAr : property.description;
  const address = language === "ar" ? property.addressAr : property.address;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-US", {
      style: "currency",
      currency: language === "ar" ? "AED" : "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Image Gallery */}
      <div className="mb-8 space-y-4">
        <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden bg-muted">
          <img 
            src={property.images[activeImage]} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 text-primary border-none text-base px-4 py-1.5 backdrop-blur-md font-bold">
              {property.type === "sale" ? t("For Sale", "للبيع") : t("For Rent", "للإيجار")}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6 bg-white/50 hover:bg-white/80 backdrop-blur-md rounded-full w-12 h-12"
            onClick={toggleFavorite}
          >
            <Heart className={`w-6 h-6 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
        
        {property.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-32 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 transition-all ${activeImage === i ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">{title}</h1>
              <div className="text-3xl font-bold text-primary shrink-0">
                {formatPrice(property.price)}
                {property.type === "rent" && <span className="text-lg font-normal text-muted-foreground"> / {t("month", "شهر")}</span>}
              </div>
            </div>
            <p className="flex items-center text-lg text-muted-foreground gap-2">
              <MapPin className="w-5 h-5 text-primary" /> {address}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-muted/30 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                <Bed className="w-8 h-8 text-primary" />
                <div>
                  <div className="font-bold text-lg">{property.bedrooms}</div>
                  <div className="text-sm text-muted-foreground">{t("Bedrooms", "غرف نوم")}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                <Bath className="w-8 h-8 text-primary" />
                <div>
                  <div className="font-bold text-lg">{property.bathrooms}</div>
                  <div className="text-sm text-muted-foreground">{t("Bathrooms", "حمامات")}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                <Square className="w-8 h-8 text-primary" />
                <div>
                  <div className="font-bold text-lg">{property.area}</div>
                  <div className="text-sm text-muted-foreground">{t("Sq Meters", "متر مربع")}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <div className="font-bold text-lg">{property.yearBuilt || "-"}</div>
                  <div className="text-sm text-muted-foreground">{t("Year Built", "سنة البناء")}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">{t("Description", "الوصف")}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">{desc}</p>
          </div>

          {property.amenities.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{t("Amenities", "المميزات")}</h2>
              <div className="flex flex-wrap gap-3">
                {(language === "ar" && property.amenitiesAr ? property.amenitiesAr : property.amenities).map((amenity, i) => (
                  <Badge key={i} variant="outline" className="px-4 py-2 text-base font-normal bg-card">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">{t("Location", "الموقع")}</h2>
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-border">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.lng-0.02},${property.lat-0.02},${property.lng+0.02},${property.lat+0.02}&layer=mapnik&marker=${property.lat},${property.lng}`}
              ></iframe>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="border-primary/20 shadow-lg overflow-hidden">
              <div className="bg-primary p-6 text-primary-foreground text-center">
                <h3 className="font-bold text-xl mb-1">{t("Contact Agent", "تواصل مع الوكيل")}</h3>
                <p className="text-primary-foreground/80 text-sm">{t("Get more information about this property", "احصل على مزيد من المعلومات حول هذا العقار")}</p>
              </div>
              <CardContent className="p-6 space-y-6 bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{language === "ar" && property.agentNameAr ? property.agentNameAr : property.agentName || "Agent"}</div>
                    <div className="text-sm text-muted-foreground">{t("Real Estate Agent", "وكيل عقاري")}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full h-12 text-base flex gap-2" size="lg">
                    <Phone className="w-5 h-5" /> 
                    {property.agentPhone || "+1 234 567 890"}
                  </Button>
                  <Button variant="outline" className="w-full h-12 text-base flex gap-2" size="lg">
                    <Mail className="w-5 h-5" /> 
                    {t("Send Email", "إرسال بريد إلكتروني")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
