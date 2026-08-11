import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildWhatsAppLink, EGYPT_GOVERNORATES } from "@/lib/site-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Home, MessageCircle, Phone, ShieldCheck, Square } from "lucide-react";

export default function SellProperty() {
  const { t, language } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Cairo");
  const [propertyType, setPropertyType] = useState("apartment");
  const [dealType, setDealType] = useState("sale");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [notes, setNotes] = useState("");

  const cityLabel = useMemo(() => {
    const selected = EGYPT_GOVERNORATES.find((item) => item.en === city);
    return language === "ar" ? selected?.ar ?? city : selected?.en ?? city;
  }, [city, language]);

  const typeLabel = {
    apartment: t("Apartment", "شقة"),
    villa: t("Villa", "فيلا"),
    commercial: t("Commercial", "تجاري"),
    land: t("Land", "أرض"),
  }[propertyType];

  const dealLabel = dealType === "sale" ? t("For Sale", "للبيع") : t("For Rent", "للإيجار");

  const message = language === "ar"
    ? `مرحباً، أريد عرض عقاري مع ديار:\n\nالاسم: ${name || "-"}\nرقم الهاتف: ${phone || "-"}\nنوع العملية: ${dealLabel}\nنوع العقار: ${typeLabel}\nالمحافظة: ${cityLabel}\nالمساحة: ${area || "-"} متر مربع\nعدد الغرف: ${bedrooms || "-"}\nالسعر المطلوب: ${price || "-"}\nملاحظات: ${notes || "-"}`
    : `Hello, I want to list my property with Deyar:\n\nName: ${name || "-"}\nPhone: ${phone || "-"}\nDeal type: ${dealLabel}\nProperty type: ${typeLabel}\nGovernorate: ${cityLabel}\nArea: ${area || "-"} sqm\nBedrooms: ${bedrooms || "-"}\nAsking price: ${price || "-"}\nNotes: ${notes || "-"}`;

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-6">
          <div className="space-y-4">
            <Badge className="rounded-badge px-4 py-2 text-sm">
              <Home className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t("List your property", "اعرض عقارك")}
            </Badge>
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                {t("Sell or rent your property through Deyar", "بيع أو أجر عقارك من خلال ديار")}
              </h1>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">
                {t(
                  "Send the key details on WhatsApp and the broker will follow up to verify photos, pricing, and viewing availability.",
                  "ابعت أهم التفاصيل على واتساب والوسيط هيتابع معاك لتأكيد الصور والتسعير ومواعيد المعاينة."
                )}
              </p>
            </div>
          </div>

          <Card className="rounded-card border-border/60">
            <CardContent className="p-5 md:p-7">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label={t("Your name", "اسمك")}>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 text-base" />
                </Field>
                <Field label={t("WhatsApp number", "رقم الواتساب")}>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 text-base" />
                </Field>

                <Field label={t("Deal type", "نوع العملية")}>
                  <Select value={dealType} onValueChange={setDealType}>
                    <SelectTrigger className="h-12 rounded-input text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-card">
                      <SelectItem value="sale">{t("For Sale", "للبيع")}</SelectItem>
                      <SelectItem value="rent">{t("For Rent", "للإيجار")}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label={t("Property type", "نوع العقار")}>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-12 rounded-input text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-card">
                      <SelectItem value="apartment">{t("Apartment", "شقة")}</SelectItem>
                      <SelectItem value="villa">{t("Villa", "فيلا")}</SelectItem>
                      <SelectItem value="commercial">{t("Commercial", "تجاري")}</SelectItem>
                      <SelectItem value="land">{t("Land", "أرض")}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label={t("Governorate", "المحافظة")}>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-12 rounded-input text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 rounded-card">
                      {EGYPT_GOVERNORATES.map((item) => (
                        <SelectItem key={item.en} value={item.en}>
                          {language === "ar" ? item.ar : item.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label={t("Area", "المساحة")}>
                  <Input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="h-12 text-base" placeholder={t("sqm", "متر مربع")} />
                </Field>

                <Field label={t("Bedrooms", "غرف النوم")}>
                  <Input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="h-12 text-base" />
                </Field>
                <Field label={t("Asking price", "السعر المطلوب")}>
                  <Input value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 text-base" placeholder={t("EGP", "جنيه")} />
                </Field>

                <div className="md:col-span-2">
                  <Field label={t("Notes", "ملاحظات")}>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-32 resize-none text-base"
                      placeholder={t("Finishing, floor, delivery status, payment details...", "التشطيب، الدور، حالة التسليم، تفاصيل السداد...")}
                    />
                  </Field>
                </div>
              </div>

              <a href={buildWhatsAppLink(message)} target="_blank" rel="noopener noreferrer" className="mt-7 block">
                <Button className="h-12 w-full rounded-button bg-green-600 text-base font-semibold text-white hover:bg-green-700 md:w-auto md:px-8">
                  <MessageCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                  {t("Send Listing on WhatsApp", "ابعت بيانات العقار على واتساب")}
                </Button>
              </a>
            </CardContent>
          </Card>
        </main>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <InfoItem icon={ShieldCheck} title={t("Verified before publishing", "مراجعة قبل النشر")} body={t("We review the details before showing the listing to buyers.", "بنراجع التفاصيل قبل عرض العقار للمشترين.")} />
          <InfoItem icon={Camera} title={t("Photos matter", "الصور مهمة")} body={t("The broker can guide you on the best photo list for faster leads.", "الوسيط يقدر يوجهك لأفضل صور تجيب عملاء أسرع.")} />
          <InfoItem icon={Square} title={t("Clear pricing", "تسعير واضح")} body={t("Better pricing details help filter serious buyers.", "تفاصيل السعر الواضحة تساعد في جذب العملاء الجادين.")} />
          <InfoItem icon={Phone} title={t("Fast follow-up", "متابعة سريعة")} body={t("Your request opens directly in WhatsApp with all details ready.", "طلبك بيفتح مباشرة على واتساب بكل البيانات جاهزة.")} />
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

function InfoItem({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <Card className="rounded-card border-border/60">
      <CardContent className="flex gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}
