import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice as formatPriceFn } from "@/lib/format-price";
import { buildWhatsAppLink } from "@/lib/site-content";
import {
  useMockGetProperty as useGetProperty,
  useMockListProperties as useListProperties,
  useMockListFavorites as useListFavorites,
} from "@/lib/localData";
import { motion } from "framer-motion";
import {
  Banknote,
  Bath,
  Bed,
  Building2,
  Calculator,
  Calendar,
  Camera,
  Car,
  CheckCircle2,
  Heart,
  Home,
  Info,
  MessageCircle,
  Percent,
  Send,
  ShieldCheck,
  Sparkles,
  Square,
  User,
  Video,
} from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/ui/property-card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const PAYMENT_PLANS = [
  {
    id: "starter",
    labelEn: "Plan A",
    labelAr: "الخطة أ",
    downPaymentPercent: 10,
    years: 5,
    annualRate: 16,
  },
  {
    id: "balanced",
    labelEn: "Plan B",
    labelAr: "الخطة ب",
    downPaymentPercent: 20,
    years: 10,
    annualRate: 18,
  },
  {
    id: "extended",
    labelEn: "Plan C",
    labelAr: "الخطة ج",
    downPaymentPercent: 30,
    years: 15,
    annualRate: 20,
  },
] as const;

export default function PropertyDetailEnhanced() {
  const { id } = useParams();
  const { t, language } = useLanguage();

  const { data: property, isLoading } = useGetProperty(Number(id));
  const { data: favorites = [], addFavorite, removeFavorite } = useListFavorites();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState<(typeof PAYMENT_PLANS)[number]["id"]>("balanced");
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [viewingType, setViewingType] = useState("in-person");
  const [viewingTime, setViewingTime] = useState("tomorrow");

  const { data: similarData, isLoading: isLoadingSimilar } = useListProperties(
    property
      ? {
          category: property.category as any,
          city: property.city,
          limit: 6,
        }
      : undefined,
    { query: { enabled: Boolean(property) } }
  );

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto space-y-8">
        <Skeleton className="w-full h-[58vh] rounded-3xl" />
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
  const isPending = addFavorite.isPending || removeFavorite.isPending;
  const title = language === "ar" ? property.titleAr : property.title;
  const desc = language === "ar" ? property.descriptionAr : property.description;
  const address = language === "ar" ? property.addressAr : property.address;
  const amenities = language === "ar" && property.amenitiesAr?.length ? property.amenitiesAr : property.amenities;
  const images = property.images.length
    ? property.images
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"];

  const formatPrice = (price: number) => formatPriceFn(price, property.priceUnit, language);
  const pricePerMeter = property.area > 0 ? Math.round(property.price / property.area) : 0;
  const selectedPlan = PAYMENT_PLANS.find((plan) => plan.id === selectedPlanId) ?? PAYMENT_PLANS[0];
  const downPaymentPercent = selectedPlan.downPaymentPercent;
  const years = selectedPlan.years;
  const annualRate = selectedPlan.annualRate;

  const downPayment = Math.round(property.price * (downPaymentPercent / 100));
  const financedAmount = Math.max(property.price - downPayment, 0);
  const months = Math.max(years * 12, 1);
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    monthlyRate === 0
      ? Math.round(financedAmount / months)
      : Math.round((financedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months)));
  const incomeRatio = monthlyIncome > 0 ? monthlyPayment / monthlyIncome : 0;
  const decision =
    monthlyIncome <= 0
      ? "unknown"
      : incomeRatio <= 0.35
        ? "comfortable"
        : incomeRatio <= 0.5
          ? "stretch"
          : "high";

  const decisionCopy = {
    unknown: {
      title: t("Add your income for a clearer decision", "أضف دخلك الشهري لقرار أوضح"),
      body: t("The calculator is ready, but affordability needs monthly income.", "الحاسبة جاهزة، لكن تقييم القدرة يحتاج الدخل الشهري."),
      className: "bg-muted text-foreground border-border",
    },
    comfortable: {
      title: t("Looks comfortable", "القرار مريح مبدئياً"),
      body: t("The estimated installment is within a healthy range of your income.", "القسط التقريبي داخل نطاق صحي من دخلك."),
      className: "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-200 dark:border-green-900",
    },
    stretch: {
      title: t("Possible, but review carefully", "ممكن، لكن راجعه بهدوء"),
      body: t("The installment may pressure monthly cash flow. Consider a higher down payment.", "القسط ممكن يضغط على السيولة الشهرية. فكر في مقدم أكبر."),
      className: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-900",
    },
    high: {
      title: t("High commitment", "التزام مرتفع"),
      body: t("This option may be heavy unless income or down payment changes.", "الاختيار ده قد يكون تقيل إلا لو الدخل أو المقدم اتغير."),
      className: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-200 dark:border-red-900",
    },
  }[decision];

  const brokerNotes = [
    property.featured
      ? t("Featured listing with stronger buyer attention.", "عقار مميز يجذب اهتمام أعلى من المشترين.")
      : t("Good option to shortlist if it matches your budget.", "اختيار مناسب للقائمة المختصرة لو مطابق لميزانيتك."),
    property.area >= 180
      ? t("Large area makes it suitable for families or long-term living.", "المساحة الكبيرة تجعله مناسباً للعائلات أو السكن طويل المدى.")
      : t("Compact area can be easier to furnish, rent, and maintain.", "المساحة العملية أسهل في التشطيب والتأجير والصيانة."),
    property.bedrooms >= 3
      ? t("Bedroom count supports family use and resale demand.", "عدد الغرف مناسب للعائلات ويدعم الطلب عند إعادة البيع.")
      : t("Bedroom count is better for singles, couples, or investment rental.", "عدد الغرف أنسب للأفراد أو الأزواج أو الاستثمار الإيجاري."),
  ];

  const toggleFavorite = () => {
    if (isPending) return;

    const mutation = isFav ? removeFavorite : addFavorite;
    mutation.mutate({ data: { propertyId: property.id } });
  };

  const buildViewingMessage = () => {
    const viewingTypeLabel =
      viewingType === "video"
        ? t("Video walkthrough", "معاينة فيديو")
        : viewingType === "weekend"
          ? t("Weekend viewing", "معاينة في الويك إند")
          : t("In-person viewing", "معاينة حضورية");
    const viewingTimeLabel =
      viewingTime === "today"
        ? t("Today", "اليوم")
        : viewingTime === "tomorrow"
          ? t("Tomorrow", "غداً")
          : viewingTime === "weekend"
            ? t("This weekend", "الويك إند")
            : t("Agent's nearest slot", "أقرب موعد متاح");

    return language === "ar"
      ? `مرحباً، أريد حجز معاينة للعقار:\n\nالعنوان: ${title}\nالسعر: ${formatPrice(property.price)}\nنوع المعاينة: ${viewingTypeLabel}\nالموعد المفضل: ${viewingTimeLabel}\n\nالرابط: ${window.location.href}`
      : `Hello, I want to book a viewing for this property:\n\nTitle: ${title}\nPrice: ${formatPrice(property.price)}\nViewing type: ${viewingTypeLabel}\nPreferred time: ${viewingTimeLabel}\n\nLink: ${window.location.href}`;
  };

  const buildWhatsAppMessage = () => {
    const propPrice = formatPrice(property.price);

    return language === "ar"
      ? `مرحباً، أريد الاستفسار عن العقار:\n\nالعنوان: ${title}\nالسعر: ${propPrice}\nالمساحة: ${property.area} متر مربع\n\nنتيجة حاسبة الشراء:\nخطة السداد: ${selectedPlan.labelAr} - ${downPaymentPercent}% مقدم / ${years} سنوات / فائدة ${annualRate}%\nالمقدم: ${formatPrice(downPayment)}\nقيمة التمويل: ${formatPrice(financedAmount)}\nالقسط التقريبي: ${formatPrice(monthlyPayment)} شهرياً\nالتقييم: ${decisionCopy.title}\n\nالرابط: ${window.location.href}`
      : `Hello, I'm interested in this property:\n\nTitle: ${title}\nPrice: ${propPrice}\nArea: ${property.area} sqm\n\nPurchase calculator result:\nPayment plan: ${selectedPlan.labelEn} - ${downPaymentPercent}% down / ${years} years / ${annualRate}% rate\nDown payment: ${formatPrice(downPayment)}\nFinanced amount: ${formatPrice(financedAmount)}\nEstimated installment: ${formatPrice(monthlyPayment)} monthly\nDecision: ${decisionCopy.title}\n\nLink: ${window.location.href}`;
  };

  const similarProperties = Array.isArray(similarData?.properties)
    ? similarData.properties.filter((item) => item.id !== property.id).slice(0, 3)
    : [];

  return (
    <div className="pb-24 lg:pb-10">
      <section className="relative">
        <div className="relative h-[64vh] min-h-[520px] overflow-hidden bg-muted">
          <img src={images[activeImage]} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="container mx-auto px-4 pb-8 md:pb-12">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="max-w-5xl text-white"
              >
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <Badge className="bg-white text-primary hover:bg-white border-none rounded-badge px-4 py-2 text-sm font-bold">
                    {property.type === "sale" ? t("For Sale", "للبيع") : t("For Rent", "للإيجار")}
                  </Badge>
                  {property.featured && (
                    <Badge className="bg-primary text-primary-foreground border-none rounded-badge px-4 py-2 text-sm font-bold shadow-lg">
                      <Sparkles className="w-4 h-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                      {t("Featured", "مميز")}
                    </Badge>
                  )}
                  <Badge className="bg-black/35 text-white border border-white/25 rounded-badge px-4 py-2 text-sm font-semibold backdrop-blur capitalize">
                    {property.category}
                  </Badge>
                </div>

                <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">{address}</p>

                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-3xl font-bold md:text-5xl">
                      {formatPrice(property.price)}
                      {property.type === "rent" && (
                        <span className="text-lg font-normal text-white/80"> / {t("month", "شهر")}</span>
                      )}
                    </div>
                    {pricePerMeter > 0 && (
                      <p className="mt-2 text-sm text-white/75">
                        {formatPrice(pricePerMeter)} {t("per sqm", "للمتر")}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="rounded-button bg-white text-primary hover:bg-white/90"
                      onClick={toggleFavorite}
                      disabled={isPending}
                    >
                      <Heart className={`w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                      {isFav ? t("Saved", "محفوظ") : t("Save", "حفظ")}
                    </Button>
                    <a href={buildWhatsAppLink(buildWhatsAppMessage())} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="rounded-button bg-green-600 text-white hover:bg-green-700">
                        <MessageCircle className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                        {t("WhatsApp", "واتساب")}
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="-mt-10 relative z-10 flex gap-3 overflow-x-auto pb-3">
            {images.map((img, i) => (
              <button
                key={`${img}-${i}`}
                onClick={() => setActiveImage(i)}
                className={`relative h-24 w-36 shrink-0 overflow-hidden rounded-card border-2 bg-muted shadow-lg transition-all ${
                  activeImage === i ? "border-primary" : "border-white/70 opacity-80 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-10">
            <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat icon={Bed} value={property.bedrooms} label={t("Bedrooms", "غرف نوم")} />
              <Stat icon={Bath} value={property.bathrooms} label={t("Bathrooms", "حمامات")} />
              <Stat icon={Square} value={property.area} label={t("Sq Meters", "متر مربع")} />
              <Stat icon={Calendar} value={property.yearBuilt || "-"} label={t("Year Built", "سنة البناء")} />
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Home className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{t("Property Story", "تفاصيل العقار")}</h2>
              </div>
              <p className="text-lg leading-8 text-muted-foreground whitespace-pre-wrap">{desc}</p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-card border-border/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">{t("Broker Notes", "ملاحظات الوسيط")}</h2>
                  </div>
                  <div className="space-y-4">
                    {brokerNotes.map((note) => (
                      <div key={note} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <p className="text-sm leading-6 text-muted-foreground">{note}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-card border-border/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Camera className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">{t("Viewing Support", "دعم المعاينة")}</h2>
                  </div>
                  <div className="space-y-4 text-sm leading-6 text-muted-foreground">
                    <p>{t("Ask for a quick video walkthrough before visiting.", "اطلب جولة فيديو سريعة قبل المعاينة.")}</p>
                    <p>{t("Share your preferred time and the agent will confirm availability.", "ابعت الوقت المناسب لك والوسيط هيأكد التوفر.")}</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {amenities.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">{t("Amenities", "المميزات")}</h2>
                <div className="flex flex-wrap gap-3">
                  {amenities.map((amenity, i) => (
                    <Badge key={`${amenity}-${i}`} variant="outline" className="rounded-badge bg-card px-4 py-2 text-base font-normal">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{t("Similar Properties", "عقارات مشابهة")}</h2>
              </div>
              {isLoadingSimilar ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-[4/3] w-full rounded-card" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : similarProperties.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {similarProperties.map((item) => (
                    <PropertyCard key={item.id} property={item} />
                  ))}
                </div>
              ) : (
                <Card className="rounded-card border-border/60">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    {t("No close alternatives are available right now.", "لا توجد بدائل قريبة متاحة حالياً.")}
                  </CardContent>
                </Card>
              )}
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card className="rounded-card border-primary/20 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Camera className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold">{t("Book a Smart Viewing", "احجز معاينة ذكية")}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t("Choose how and when you prefer to view this property.", "اختر طريقة وموعد المعاينة المناسبين لك.")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Select value={viewingType} onValueChange={setViewingType}>
                    <SelectTrigger className="h-11 rounded-input text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-card">
                      <SelectItem value="in-person">
                        {t("In-person viewing", "معاينة حضورية")}
                      </SelectItem>
                      <SelectItem value="video">
                        {t("Video walkthrough", "معاينة فيديو")}
                      </SelectItem>
                      <SelectItem value="weekend">
                        {t("Weekend viewing", "معاينة في الويك إند")}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={viewingTime} onValueChange={setViewingTime}>
                    <SelectTrigger className="h-11 rounded-input text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-card">
                      <SelectItem value="today">{t("Today", "اليوم")}</SelectItem>
                      <SelectItem value="tomorrow">{t("Tomorrow", "غداً")}</SelectItem>
                      <SelectItem value="weekend">{t("This weekend", "الويك إند")}</SelectItem>
                      <SelectItem value="nearest">{t("Agent's nearest slot", "أقرب موعد متاح")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <a href={buildWhatsAppLink(buildViewingMessage())} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="h-12 w-full rounded-button bg-primary text-base font-semibold">
                      {viewingType === "video" ? <Video className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" /> : <Send className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />}
                      {t("Request Viewing on WhatsApp", "اطلب المعاينة على واتساب")}
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-card border-primary/20 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold">{t("Purchase Decision Calculator", "حاسبة قرار الشراء")}</h2>
                    <p className="text-sm text-muted-foreground">{t("Estimate your down payment and monthly commitment.", "احسب المقدم والالتزام الشهري التقريبي.")}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <PaymentPlanSelect
                    label={t("Payment plan", "خطة السداد")}
                    value={selectedPlanId}
                    onChange={(value) => setSelectedPlanId(value as (typeof PAYMENT_PLANS)[number]["id"])}
                    language={language}
                  />
                  <p className="rounded-card bg-muted/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
                    {t(
                      "Down payment, installment years, and annual rate are tied to the developer's available payment plans. They are not free-form negotiation inputs.",
                      "المقدم وسنوات التقسيط والفائدة مرتبطين بخطط السداد المتاحة فعلياً من المطوّر، وليست قيماً حرة يحددها العميل."
                    )}
                  </p>
                  <ReadonlyPlanValue label={t("Down payment", "المقدم")} value={`${downPaymentPercent}%`} icon={Percent} />
                  <ReadonlyPlanValue label={t("Installment years", "سنوات التقسيط")} value={`${years} ${t("years", "سنوات")}`} icon={Calendar} />
                  <ReadonlyPlanValue label={t("Annual rate", "الفائدة السنوية")} value={`${annualRate}%`} icon={Banknote} />
                  <NumberField label={t("Monthly income", "الدخل الشهري")} suffix={property.priceUnit || "EGP"} value={monthlyIncome} min={0} step={1000} onChange={setMonthlyIncome} icon={User} />
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <ResultRow label={t("Down payment", "المقدم")} value={formatPrice(downPayment)} />
                  <ResultRow label={t("Financed amount", "قيمة التمويل")} value={formatPrice(financedAmount)} />
                  <ResultRow label={t("Estimated monthly", "القسط التقريبي")} value={formatPrice(monthlyPayment)} strong />
                  {monthlyIncome > 0 && <ResultRow label={t("Income ratio", "نسبة القسط للدخل")} value={`${Math.round(incomeRatio * 100)}%`} />}
                </div>

                <div className={`mt-5 rounded-card border p-4 ${decisionCopy.className}`}>
                  <div className="flex gap-3">
                    <Info className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-bold">{decisionCopy.title}</p>
                      <p className="mt-1 text-sm leading-6 opacity-90">{decisionCopy.body}</p>
                    </div>
                  </div>
                </div>

                <a href={buildWhatsAppLink(buildWhatsAppMessage())} target="_blank" rel="noopener noreferrer" className="mt-5 block">
                  <Button className="h-12 w-full rounded-button bg-green-600 text-base font-semibold text-white hover:bg-green-700">
                    <MessageCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                    {t("Send Result on WhatsApp", "ابعت النتيجة على واتساب")}
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="rounded-card border-border/60">
              <CardContent className="p-6">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <User className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{language === "ar" && property.agentNameAr ? property.agentNameAr : property.agentName || "Agent"}</div>
                    <div className="text-sm text-muted-foreground">{t("Real Estate Agent", "وسيط عقاري")}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-card bg-muted/40 p-3">
                    <Car className="mb-2 h-5 w-5 text-primary" />
                    <p className="font-semibold">{property.parkingSpaces ?? 0}</p>
                    <p className="text-muted-foreground">{t("Parking", "جراج")}</p>
                  </div>
                  <div className="rounded-card bg-muted/40 p-3">
                    <Square className="mb-2 h-5 w-5 text-primary" />
                    <p className="font-semibold">{pricePerMeter ? formatPrice(pricePerMeter) : "-"}</p>
                    <p className="text-muted-foreground">{t("per sqm", "للمتر")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <a href={buildWhatsAppLink(buildWhatsAppMessage())} target="_blank" rel="noopener noreferrer">
          <Button className="h-12 w-full rounded-button bg-green-600 text-base font-semibold text-white hover:bg-green-700">
            <MessageCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
            {t("Contact on WhatsApp", "تواصل على واتساب")}
          </Button>
        </a>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
}) {
  return (
    <Card className="rounded-card border-border/60 bg-card">
      <CardContent className="flex min-h-[130px] flex-col items-center justify-center gap-2 p-4 text-center">
        <Icon className="h-7 w-7 text-primary" />
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

function PaymentPlanSelect({
  label,
  value,
  onChange,
  language,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  language: "en" | "ar";
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Calculator className="h-4 w-4 text-primary" />
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 text-base rounded-input">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-card">
          {PAYMENT_PLANS.map((plan) => (
            <SelectItem key={plan.id} value={plan.id} className="py-3">
              <span className="font-medium">
                {language === "ar" ? plan.labelAr : plan.labelEn}
              </span>
              <span className="text-muted-foreground">
                {" "}
                - {plan.downPaymentPercent}% / {plan.years} {language === "ar" ? "سنوات" : "years"} / {plan.annualRate}%
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function ReadonlyPlanValue({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="block space-y-2">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </span>
      <div className="flex h-11 items-center rounded-input border border-input bg-muted/40 px-3 text-base font-semibold text-foreground">
        {value}
      </div>
    </div>
  );
}

function NumberField({
  label,
  suffix,
  value,
  min,
  max,
  step,
  onChange,
  icon: Icon,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max?: number;
  step: number;
  onChange: (value: number) => void;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </span>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-11 text-base"
        />
        <span className="w-16 shrink-0 text-sm font-medium text-muted-foreground">{suffix}</span>
      </div>
    </label>
  );
}

function ResultRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={strong ? "text-lg font-bold text-primary" : "font-semibold"}>{value}</span>
    </div>
  );
}
