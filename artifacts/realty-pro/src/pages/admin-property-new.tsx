import { useState } from "react";
import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { addProperty } from "@/lib/admin/propertyManager";
import { PropertyInput, PropertyType, PropertyCategory } from "@workspace/api-client-react";
import { ArrowLeft, Save, Building2, MapPin, DollarSign, Home, CheckCircle } from "lucide-react";

export default function AdminPropertyNew() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const dir = language === "ar" ? "rtl" : "ltr";

  // Form state
  const [formData, setFormData] = useState<PropertyInput>({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    type: "sale" as PropertyType,
    category: "apartment" as PropertyCategory,
    price: 0,
    priceUnit: "EGP",
    area: 0,
    country: "Egypt",
    city: "Cairo",
    cityAr: "القاهرة",
    address: "",
    addressAr: "",
    lat: 30.0444,
    lng: 31.2357,
    bedrooms: 1,
    bathrooms: 1,
    images: [],
    featured: false,
    amenities: [],
    amenitiesAr: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof PropertyInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = t("Title is required", "العنوان مطلوب");
    if (!formData.titleAr.trim()) newErrors.titleAr = t("Arabic title is required", "العنوان بالعربية مطلوب");
    if (!formData.description.trim()) newErrors.description = t("Description is required", "الوصف مطلوب");
    if (!formData.descriptionAr.trim()) newErrors.descriptionAr = t("Arabic description is required", "الوصف بالعربية مطلوب");
    if (formData.price <= 0) newErrors.price = t("Price must be greater than 0", "السعر يجب أن يكون أكبر من 0");
    if (formData.area <= 0) newErrors.area = t("Area must be greater than 0", "المساحة يجب أن تكون أكبر من 0");
    if (formData.bedrooms < 0) newErrors.bedrooms = t("Bedrooms cannot be negative", "غرف النوم لا يمكن أن تكون سالبة");
    if (formData.bathrooms < 0) newErrors.bathrooms = t("Bathrooms cannot be negative", "الحمامات لا يمكن أن تكون سالبة");
    if (!formData.city.trim()) newErrors.city = t("City is required", "المدينة مطلوبة");
    if (!formData.cityAr.trim()) newErrors.cityAr = t("Arabic city is required", "المدينة بالعربية مطلوبة");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      addProperty(formData);
      setSuccess(true);
      
      setTimeout(() => {
        setLocation("/admin/properties");
      }, 1500);
    } catch (error) {
      console.error("Error creating property:", error);
      setErrors({ submit: t("Failed to create property", "فشل في إنشاء العقار") });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">
              {t("Access denied. Admin only.", "تم رفض الوصول. للمشرفين فقط.")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="p-10 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {t("Property Created Successfully", "تم إنشاء العقار بنجاح")}
            </h2>
            <p className="text-muted-foreground">
              {t("Redirecting to property management...", "جاري التوجيه إلى إدارة العقارات...")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10" dir={dir}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {t("Create New Property", "إنشاء عقار جديد")}
            </h1>
            <p className="text-muted-foreground">
              {t("Add a new property to the platform", "إضافة عقار جديد إلى المنصة")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t("Basic Information", "المعلومات الأساسية")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {t("Title (English)", "العنوان (إنجليزي)")} *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder={t("Luxury Villa in Cairo", "فيلا فاخرة في القاهرة")}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleAr">
                    {t("Title (Arabic)", "العنوان (عربي)")} *
                  </Label>
                  <Input
                    id="titleAr"
                    value={formData.titleAr}
                    onChange={(e) => handleInputChange("titleAr", e.target.value)}
                    placeholder={t("فيلا فاخرة في القاهرة", "Luxury Villa in Cairo")}
                    className={errors.titleAr ? "border-red-500" : ""}
                  />
                  {errors.titleAr && <p className="text-sm text-red-500">{errors.titleAr}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{t("Property Type", "نوع العقار")}</Label>
                  <Select value={formData.type} onValueChange={(v) => handleInputChange("type", v)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">{t("For Sale", "للبيع")}</SelectItem>
                      <SelectItem value="rent">{t("For Rent", "للإيجار")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t("Category", "الفئة")}</Label>
                  <Select value={formData.category} onValueChange={(v) => handleInputChange("category", v)}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">{t("Apartment", "شقة")}</SelectItem>
                      <SelectItem value="villa">{t("Villa", "فيلا")}</SelectItem>
                      <SelectItem value="office">{t("Office", "مكتب")}</SelectItem>
                      <SelectItem value="land">{t("Land", "أرض")}</SelectItem>
                      <SelectItem value="commercial">{t("Commercial", "تجاري")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("Description (English)", "الوصف (إنجليزي)")} *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder={t("Describe the property...", "وصف العقار...")}
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionAr">
                  {t("Description (Arabic)", "الوصف (عربي)")} *
                </Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) => handleInputChange("descriptionAr", e.target.value)}
                  placeholder={t("وصف العقار...", "Describe the property...")}
                  rows={4}
                  className={errors.descriptionAr ? "border-red-500" : ""}
                />
                {errors.descriptionAr && <p className="text-sm text-red-500">{errors.descriptionAr}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("Location", "الموقع")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t("City (English)", "المدينة (إنجليزي)")} *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Cairo"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cityAr">{t("City (Arabic)", "المدينة (عربي)")} *</Label>
                  <Input
                    id="cityAr"
                    value={formData.cityAr}
                    onChange={(e) => handleInputChange("cityAr", e.target.value)}
                    placeholder="القاهرة"
                    className={errors.cityAr ? "border-red-500" : ""}
                  />
                  {errors.cityAr && <p className="text-sm text-red-500">{errors.cityAr}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">{t("Address (English)", "العنوان (إنجليزي)")}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Fifth Settlement"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressAr">{t("Address (Arabic)", "العنوان (عربي)")}</Label>
                  <Input
                    id="addressAr"
                    value={formData.addressAr}
                    onChange={(e) => handleInputChange("addressAr", e.target.value)}
                    placeholder="التجمع الخامس"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">{t("Latitude", "خط العرض")}</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => handleInputChange("lat", parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">{t("Longitude", "خط الطول")}</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => handleInputChange("lng", parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {t("Pricing", "التسعير")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{t("Price", "السعر")} *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                    placeholder="15000000"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceUnit">{t("Currency", "العملة")}</Label>
                  <Select value={formData.priceUnit} onValueChange={(v) => handleInputChange("priceUnit", v)}>
                    <SelectTrigger id="priceUnit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EGP">EGP</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="SAR">SAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                {t("Property Details", "تفاصيل العقار")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">{t("Area (sqm)", "المساحة (متر مربع)")} *</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area || ""}
                    onChange={(e) => handleInputChange("area", parseFloat(e.target.value) || 0)}
                    className={errors.area ? "border-red-500" : ""}
                  />
                  {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">{t("Bedrooms", "غرف النوم")}</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms || ""}
                    onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value) || 0)}
                    className={errors.bedrooms ? "border-red-500" : ""}
                  />
                  {errors.bedrooms && <p className="text-sm text-red-500">{errors.bedrooms}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">{t("Bathrooms", "الحمامات")}</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms || ""}
                    onChange={(e) => handleInputChange("bathrooms", parseInt(e.target.value) || 0)}
                    className={errors.bathrooms ? "border-red-500" : ""}
                  />
                  {errors.bathrooms && <p className="text-sm text-red-500">{errors.bathrooms}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
                />
                <Label htmlFor="featured">{t("Featured Property", "عقار مميز")}</Label>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Images", "الصور")}</CardTitle>
              <CardDescription>
                {t("Enter image URLs (one per line)", "أدخل روابط الصور (رابط في كل سطر)")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.images.join("\n")}
                onChange={(e) => handleInputChange("images", e.target.value.split("\n").filter(Boolean))}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Error Message */}
          {errors.submit && (
            <Card className="border-red-500 bg-red-50 dark:bg-red-950">
              <CardContent className="p-4">
                <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/admin")}
              disabled={isSubmitting}
            >
              {t("Cancel", "إلغاء")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  {t("Creating...", "جاري الإنشاء...")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("Create Property", "إنشاء العقار")}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
