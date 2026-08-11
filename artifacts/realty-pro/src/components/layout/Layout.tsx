import { Navbar } from "./Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_NUMBER, buildWhatsAppLink } from "@/lib/site-content";
import { MessageCircle } from "lucide-react";

export function Footer() {
  const { t, language } = useLanguage();
  
  return (
    <footer className="border-t border-border bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2L2 12H6V24H11V16H17V24H22V12H26L14 2Z"
                    fill="currentColor"
                    className="text-primary"
                  />
                </svg>
              </div>
              <span className="font-bold text-2xl tracking-tight" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {language === "ar" ? "ديار" : "Deyar"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(
                "Premium real estate marketplace for Egypt.",
                "منصة العقارات الفاخرة لمصر."
              )}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{t("Quick Links", "روابط سريعة")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary">{t("Home", "الرئيسية")}</a></li>
              <li><a href="/properties" className="hover:text-primary">{t("Properties", "العقارات")}</a></li>
              <li><a href="/about" className="hover:text-primary">{t("About", "عن الشركة")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("Contact", "اتصل بنا")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href={buildWhatsAppLink("مرحباً، أريد الاستفسار عن عقار")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-green-600 transition-colors"
                >
                  <span className="text-green-600 font-semibold">WhatsApp:</span> {WHATSAPP_NUMBER}
                </a>
              </li>
              <li>{t("Egypt", "مصر")}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ديار. {t("All rights reserved.", "جميع الحقوق محفوظة.")}</p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const message = t(
    "Hello, I want help finding a suitable property.",
    "مرحباً، أريد المساعدة في العثور على عقار مناسب."
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
      <a
        href={buildWhatsAppLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("Chat on WhatsApp", "تواصل على واتساب")}
        className="fixed bottom-20 end-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-2xl shadow-green-950/25 transition-transform hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 md:bottom-6 md:end-6"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
