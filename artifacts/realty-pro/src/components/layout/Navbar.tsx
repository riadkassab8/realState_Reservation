import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Heart, Search } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const navItems = [
    { href: "/", label: t("Home", "الرئيسية") },
    { href: "/properties", label: t("Properties", "العقارات") },
    { href: "/about", label: t("About", "عن الشركة") },
    { href: "/sell-property", label: t("Sell Property", "اعرض عقارك") },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 relative flex items-center">
        {/* Left side - Actions */}
        <div className="flex items-center gap-2 md:gap-4 absolute left-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" onClick={toggleLanguage} className="font-medium text-base">
            العربية / EN
          </Button>

          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Heart className="w-5 h-5" />
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Center - Navigation Links */}
        <div className="hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side - Logo */}
        <div className="flex items-center gap-3 absolute right-4">
          <Link href="/" className="flex items-center gap-3">
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
            <span className="font-bold text-2xl tracking-tight hidden sm:inline-block" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {language === "ar" ? "ديار" : "Deyar"}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 border-t border-border bg-background">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="text-base font-medium hover:text-primary transition-colors block"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
