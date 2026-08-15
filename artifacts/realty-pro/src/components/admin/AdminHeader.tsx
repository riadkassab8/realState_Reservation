import { useState } from "react";
import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, LogOut, Settings, User, ChevronDown } from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { DEMO_ACCOUNTS } from "@/auth/auth.mock";

interface AdminHeaderProps {
  title?: string;
  titleAr?: string;
}

export function AdminHeader({ title = "Admin Dashboard", titleAr = "لوحة تحكم الإدارة" }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const dir = language === "ar" ? "rtl" : "ltr";

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const getInitials = (name?: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Search across real data
    if (query.length > 2) {
      const lowerQuery = query.toLowerCase();
      
      // Search properties
      const matchedProperties = MOCK_PROPERTIES.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.titleAr.includes(query) ||
          p.city.toLowerCase().includes(lowerQuery) ||
          p.cityAr.includes(query)
      );
      
      // Search users
      const matchedUsers = Object.entries(DEMO_ACCOUNTS).filter(
        ([, account]) =>
          account.name.toLowerCase().includes(lowerQuery) ||
          account.email.toLowerCase().includes(lowerQuery)
      );
      
      console.log("Search results:", {
        properties: matchedProperties.length,
        users: matchedUsers.length,
      });
      
      // For now, just log results. In a real implementation, this would
      // navigate to a search results page or show a dropdown
    }
  };

  return (
    <header dir={dir} className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* Left side - Title and Date */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">
              {language === "ar" ? titleAr : title}
            </h1>
            <p className="text-xs text-muted-foreground">{getCurrentDate()}</p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search properties, users...", "بحث العقارات، المستخدمين...")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={`pl-10 ${language === "ar" ? "pr-10" : ""} bg-muted/50 border-0`}
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications - No real notification data exists */}
          <Button variant="ghost" size="icon" className="relative" disabled>
            <Bell className="h-5 w-5" />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{user?.name || t("Platform Admin", "مدير المنصة")}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || t("Platform Admin", "مدير المنصة")}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                {t("My Profile", "ملفي الشخصي")}
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                {t("Account Settings", "إعدادات الحساب")}
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Bell className="mr-2 h-4 w-4" />
                {t("Notifications", "الإشعارات")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {t("Logout", "تسجيل الخروج")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
