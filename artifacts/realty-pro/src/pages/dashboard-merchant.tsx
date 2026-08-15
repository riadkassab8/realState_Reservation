import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Plus, LogOut, Home, MessageSquare, TrendingUp } from "lucide-react";

export default function MerchantDashboard() {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const stats = [
    { label: t("My Properties", "عقاراتي"), value: "15", icon: Building2 },
    { label: t("Total Views", "إجمالي المشاهدات"), value: "2,345", icon: TrendingUp },
    { label: t("Leads", "العملاء المحتملون"), value: "34", icon: MessageSquare },
    { label: t("Active Listings", "القوائم النشطة"), value: "12", icon: Building2 },
  ];

  return (
    <div dir={dir} className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("Merchant Dashboard", "لوحة تحكم التاجر")}</h1>
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

        {/* Merchant Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                {t("Add Property", "إضافة عقار")}
              </CardTitle>
              <CardDescription>
                {t("List a new property for sale or rent", "عرض عقار جديد للبيع أو الإيجار")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {t("Manage Properties", "إدارة العقارات")}
              </CardTitle>
              <CardDescription>
                {t("Edit and manage your property listings", "تعديل وإدارة قوائم عقاراتك")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                {t("View Leads", "عرض العملاء المحتملين")}
              </CardTitle>
              <CardDescription>
                {t("Manage inquiries from interested buyers", "إدارة الاستفسارات من المشترين المهتمين")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">{t("Merchant Access", "صلاحيات التاجر")}</CardTitle>
            <CardDescription>
              {t(
                "You can manage your properties, create new listings, and view leads.",
                "يمكنك إدارة عقاراتك، وإنشاء قوائم جديدة، وعرض العملاء المحتملين."
              )}
            </CardDescription>
          </CardHeader>
        </Card>
    </div>
  );
}
