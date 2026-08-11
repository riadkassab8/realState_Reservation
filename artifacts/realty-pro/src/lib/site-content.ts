export const BRAND_NAME = "Deyar";
export const BRAND_NAME_AR = "ديار";

export const WHATSAPP_NUMBER = "01098277229";
export const WHATSAPP_E164 = "201098277229";

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}

export const EGYPT_GOVERNORATES = [
  { en: "Cairo", ar: "القاهرة" },
  { en: "Giza", ar: "الجيزة" },
  { en: "Alexandria", ar: "الإسكندرية" },
  { en: "Qalyubia", ar: "القليوبية" },
  { en: "Dakahlia", ar: "الدقهلية" },
  { en: "Sharkia", ar: "الشرقية" },
  { en: "Gharbia", ar: "الغربية" },
  { en: "Monufia", ar: "المنوفية" },
  { en: "Beheira", ar: "البحيرة" },
  { en: "Kafr El Sheikh", ar: "كفر الشيخ" },
  { en: "Damietta", ar: "دمياط" },
  { en: "Port Said", ar: "بورسعيد" },
  { en: "Ismailia", ar: "الإسماعيلية" },
  { en: "Suez", ar: "السويس" },
  { en: "North Sinai", ar: "شمال سيناء" },
  { en: "South Sinai", ar: "جنوب سيناء" },
  { en: "Red Sea", ar: "البحر الأحمر" },
  { en: "New Valley", ar: "الوادي الجديد" },
  { en: "Matrouh", ar: "مطروح" },
  { en: "Fayoum", ar: "الفيوم" },
  { en: "Beni Suef", ar: "بني سويف" },
  { en: "Minya", ar: "المنيا" },
  { en: "Assiut", ar: "أسيوط" },
  { en: "Sohag", ar: "سوهاج" },
  { en: "Qena", ar: "قنا" },
  { en: "Luxor", ar: "الأقصر" },
  { en: "Aswan", ar: "أسوان" },
] as const;

export const GOVERNORATE_IMAGE_MAP: Record<string, string> = {
  Cairo: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=900&q=80",
  Giza: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&q=80",
  Alexandria: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80",
  "Red Sea": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80",
  "South Sinai": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900&q=80",
  Matrouh: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
  Luxor: "https://images.unsplash.com/photo-1548013146-72479768bada?w=900&q=80",
  Aswan: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80",
  Ismailia: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80",
  default: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80",
};

export const VALUE_POINTS = [
  {
    titleEn: "Verified listings",
    titleAr: "عقارات موثقة",
    bodyEn: "Each listing is presented with clearer pricing, richer details, and ready-to-chat WhatsApp contact.",
    bodyAr: "كل عقار معروض بسعر أوضح وتفاصيل أغنى وتواصل مباشر على واتساب بدون خطوات معقدة.",
  },
  {
    titleEn: "All governorates",
    titleAr: "كل محافظات مصر",
    bodyEn: "From Cairo to Aswan, from Alexandria to Sinai, the platform is structured around Egypt's full map.",
    bodyAr: "من القاهرة لأسوان، ومن الإسكندرية لسيناء، المنصة مبنية حول خريطة مصر كاملة.",
  },
  {
    titleEn: "Fast response",
    titleAr: "رد أسرع",
    bodyEn: "No email forms. No dead ends. Every call to action takes the visitor straight to WhatsApp.",
    bodyAr: "مفيش بريد ولا نماذج معطلة. كل دعوة للتواصل بتفتح واتساب مباشرة.",
  },
] as const;

export const TRUST_ITEMS = [
  { en: "تسعير واضح", ar: "تسعير واضح" },
  { en: "معلومات كاملة", ar: "معلومات كاملة" },
  { en: "تواصل فوري", ar: "تواصل فوري" },
  { en: "تغطية جمهورية", ar: "تغطية جمهورية" },
] as const;
