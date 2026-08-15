import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Building2, LogOut, Home, Phone } from "lucide-react";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const stats = [
    { label: t("Favorites", "المفضلة"), value: "12", icon: Heart },
    { label: t("Viewed Properties", "العقارات المشاهدة"), value: "45", icon: Building2 },
    { label: t("Contacted", "تم التواصل"), value: "8", icon: Phone },
    { label: t("Profile Completion", "اكتمال الملف الشخصي"), value: "75%", icon: Building2 },
  ];

  return (
    <div dir={dir} className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("User Dashboard", "لوحة تحكم المستخدم")}</h1>
            <p className="text-muted-foreground">
              {t("Welcome back,", "مرحباً بعودتك،")} {user?.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              <Home className="h-4 w-4 mr-2" />
              {t("Home", "الرئيسية")}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("Logout", "تسجيل الخروج")}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => (window.location.href = "/favorites")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                {t("My Favorites", "مفضلاتي")}
              </CardTitle>
              <CardDescription>
                {t("View your favorite properties", "عرض العقارات المفضلة لديك")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => (window.location.href = "/properties")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {t("Browse Properties", "تصفح العقارات")}
              </CardTitle>
              <CardDescription>
                {t("Explore available properties", "استكشاف العقارات المتاحة")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                {t("Contact Merchants", "تواصل مع التجار")}
              </CardTitle>
              <CardDescription>
                {t("Get in touch with property owners", "التواصل مع ملاك العقارات")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">{t("User Access", "صلاحيات المستخدم")}</CardTitle>
            <CardDescription>
              {t(
                "You can browse properties, save favorites, and contact merchants.",
                "يمكنك تصفح العقارات، وحفظ المفضلة، والتواصل مع التجار."
              )}
            </CardDescription>
          </CardHeader>
        </Card>
    </div>
  );
}
