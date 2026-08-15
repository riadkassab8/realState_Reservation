import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarNavItems } from "@/lib/admin/mock-data";
import * as Icons from "lucide-react";
import { useLocation } from "wouter";

interface AdminSidebarProps {
  currentPath?: string;
}

export function AdminSidebar({ currentPath = "/admin" }: AdminSidebarProps) {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dir = language === "ar" ? "rtl" : "ltr";

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const handleNavClick = (item: any, e: React.MouseEvent) => {
    if (!item.available) {
      e.preventDefault();
      alert(t("This feature is coming soon", "هذه الميزة قريباً"));
      return;
    }
    setIsOpen(false);
  };

  const NavContent = () => (
    <nav className="space-y-1" dir={dir}>
      {sidebarNavItems.map((item) => {
        const isActive = location === item.href;
        const isAvailable = (item as any).available !== false;
        return (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => handleNavClick(item, e)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : isAvailable
                ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                : "text-muted-foreground opacity-50 cursor-not-allowed"
            }`}
          >
            <span className="flex-shrink-0">{getIcon(item.icon)}</span>
            <span>{language === "ar" ? item.labelAr : item.label}</span>
            {!isAvailable && (
              <span className="text-xs opacity-60 ml-auto">
                {t("Soon", "قريباً")}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border bg-muted/30 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <div className="p-4">
          <NavContent />
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Icons.Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side={language === "ar" ? "right" : "left"} className="w-64 p-0">
          <div className="p-4">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
