import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CheckCircle, LogOut, Home, FileText } from "lucide-react";

export default function SupervisorDashboard() {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const stats = [
    { label: t("Pending Reviews", "المراجعات المعلقة"), value: "23", icon: FileText },
    { label: t("Active Users", "المستخدمون النشطون"), value: "456", icon: Users },
    { label: t("Properties to Review", "العقارات للمراجعة"), value: "12", icon: Building2 },
    { label: t("Completed Reviews", "المراجعات المكتملة"), value: "189", icon: CheckCircle },
  ];

  return (
    <div dir={dir} className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("Supervisor Dashboard", "لوحة تحكم المشرف الميداني")}</h1>
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

        {/* Supervisor Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {t("Moderate Properties", "الإشراف على العقارات")}
              </CardTitle>
              <CardDescription>
                {t("Review and moderate property listings", "مراجعة والإشراف على قوائم العقارات")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {t("Manage Users", "إدارة المستخدمين")}
              </CardTitle>
              <CardDescription>
                {t("Manage user accounts and permissions", "إدارة حسابات المستخدمين والصلاحيات")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                {t("Review Merchants", "مراجعة التجار")}
              </CardTitle>
              <CardDescription>
                {t("Approve or reject merchant applications", "الموافقة أو الرفض على طلبات التجار")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">{t("Supervisor Access", "صلاحيات المشرف الميداني")}</CardTitle>
            <CardDescription>
              {t(
                "You can moderate properties, manage users, and review merchant applications.",
                "يمكنك الإشراف على العقارات، وإدارة المستخدمين، ومراجعة طلبات التجار."
              )}
            </CardDescription>
          </CardHeader>
        </Card>
    </div>
  );
}
