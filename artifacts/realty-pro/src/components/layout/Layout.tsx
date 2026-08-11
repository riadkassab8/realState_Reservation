import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_NUMBER, buildWhatsAppLink } from "@/lib/site-content";
import { Link } from "wouter";
import {
  MessageCircle,
  MapPin,
  Phone,
  Building2,
  Home as HomeIcon,
  Factory,
  Map as LandIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

function BrandIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 2L2 12H6V24H11V16H17V24H22V12H26L14 2Z"
        fill="currentColor"
        className="text-primary"
      />
    </svg>
  );
}

function IconBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 ${className}`}
    >
      {children}
    </span>
  );
}

export function Footer() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <footer dir={dir} className="mt-auto bg-muted/40 pb-24 md:pb-24">
      <div className="container mx-auto px-4 pt-10 md:pt-12">
        {/* Main footer card */}
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 p-4 sm:p-6 md:p-10">
            {/* Brand */}
            <div className="space-y-4 text-center sm:text-start">
              <div className="flex items-center justify-center gap-2.5 sm:justify-start">
                <BrandIcon />
                <span
                  className="font-bold text-lg tracking-tight"
                  style={{ fontFamily: "Cairo, sans-serif" }}
                >
                  {language === "ar" ? "ديار" : "Deyar"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "Premium real estate marketplace for Egypt.",
                  "منصة العقارات الفاخرة في مصر."
                )}{" "}
                {t(
                  "We help you find your dream home easily and reliably.",
                  "نساعدك في إيجاد منزل أحلامك بسهولة وثقة."
                )}
              </p>
              {/* Social icons */}
              <div className="flex items-center justify-center gap-2.5 sm:justify-start pt-1">
                {[
                  { icon: <Facebook className="h-4 w-4" />, label: "Facebook", href: "#" },
                  { icon: <Instagram className="h-4 w-4" />, label: "Instagram", href: "#" },
                  { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn", href: "#" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors hover:text-primary hover:border-primary/40"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-start">
              <h4 className="font-semibold mb-4 text-sm text-primary">
                {t("Quick Links", "روابط سريعة")}
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  { label: t("Home", "الرئيسية"), href: "/" },
                  { label: t("Properties", "العقارات"), href: "/properties" },
                  { label: t("About", "عن الشركة"), href: "/about" },
                  { label: t("Sell Property", "اعرض عقارك"), href: "/sell-property" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {language === "ar" ? (
                        <ChevronRight className="h-3.5 w-3.5 text-primary/70" />
                      ) : (
                        <ChevronLeft className="h-3.5 w-3.5 text-primary/70" />
                      )}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="text-center sm:text-start">
              <h4 className="font-semibold mb-4 text-sm text-primary">
                {t("Categories", "التصنيفات")}
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  { icon: <Building2 className="h-4 w-4" />, label: t("Apartments", "شقق"), href: "/properties?category=apartment" },
                  { icon: <HomeIcon className="h-4 w-4" />, label: t("Villas", "فيلات"), href: "/properties?category=villa" },
                  { icon: <Factory className="h-4 w-4" />, label: t("Compounds", "كمبوندات"), href: "/properties?category=commercial" },
                  { icon: <LandIcon className="h-4 w-4" />, label: t("Lands", "أراضي"), href: "/properties?category=land" },
                ].map((c) => (
                  <li key={c.label}>
                    <Link
                      to={c.href}
                      className="inline-flex items-center gap-2.5 hover:text-primary transition-colors"
                    >
                      <IconBox>
                        <span className="text-primary">{c.icon}</span>
                      </IconBox>
                      <span>{c.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center sm:text-start">
              <h4 className="font-semibold mb-4 text-sm text-primary">
                {t("Contact Us", "تواصل معنا")}
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a
                    href={buildWhatsAppLink("مرحباً، أريد الاستفسار عن عقار")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 hover:text-green-600 transition-colors"
                  >
                    <IconBox>
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    </IconBox>
                    <div className="text-start">
                      <p className="font-medium text-foreground">{t("WhatsApp", "واتساب")}</p>
                      <p dir="ltr" className="text-xs text-muted-foreground">{WHATSAPP_NUMBER}</p>
                    </div>
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <IconBox>
                    <MapPin className="h-4 w-4 text-primary" />
                  </IconBox>
                  <span>{t("Egypt", "مصر")}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <IconBox>
                    <Phone className="h-4 w-4 text-primary" />
                  </IconBox>
                  <a href={`tel:${WHATSAPP_NUMBER}`} dir="ltr" className="text-foreground hover:text-primary transition-colors">
                    {WHATSAPP_NUMBER}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border px-4 sm:px-6 md:px-10 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <BackToTop />
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="hidden md:block h-px flex-1 bg-border" />
              <p>
                © {new Date().getFullYear()} <span className="font-semibold text-primary">{language === "ar" ? "ديار" : "Deyar"}</span> — {t("All rights reserved.", "جميع الحقوق محفوظة.")}
              </p>
              <span className="hidden md:block h-px flex-1 bg-border" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 240);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const startPosition = window.pageYOffset;
        const duration = 800;
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          // Ease out cubic function
          const easeOut = 1 - Math.pow(1 - progress, 3);
          
          window.scrollTo(0, startPosition * (1 - easeOut));
          
          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };

        requestAnimationFrame(animateScroll);
      }}
      aria-label="Back to top"
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground transition-all duration-300 ease-out hover:border-primary/40 hover:text-primary hover:bg-primary/5 active:scale-95"
    >
      <ArrowUp className="h-3.5 w-3.5" />
      <span>العودة للأعلى</span>
    </button>
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
