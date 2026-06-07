import { Navbar } from "./Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t border-border bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">R</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Realty Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(
                "Premium real estate marketplace for the discerning buyer.",
                "منصة العقارات الفاخرة للمشتري المتميز."
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
              <li>info@realtypro.example.com</li>
              <li>+971 50 123 4567</li>
              <li>{t("Dubai, UAE", "دبي، الإمارات")}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Realty Pro. {t("All rights reserved.", "جميع الحقوق محفوظة.")}</p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
