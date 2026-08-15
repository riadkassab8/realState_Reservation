import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAdminKPIs } from "@/lib/admin/useAdminData";
import { Users, Building2, Briefcase, MessageSquare } from "lucide-react";

export function AdminStats() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const kpis = useAdminKPIs();

  const stats = [
    {
      title: t("Total Users", "إجمالي المستخدمين"),
      value: kpis.totalUsers.toString(),
      icon: Users,
      change: "+0",
      changeType: "neutral" as const,
      subtitle: t("All registered users", "جميع المستخدمين المسجلين"),
    },
    {
      title: t("Active Users", "المستخدمون النشطون"),
      value: kpis.activeUsers.toString(),
      icon: Users,
      change: "+0",
      changeType: "neutral" as const,
      subtitle: t("Currently active", "نشط حالياً"),
    },
    {
      title: t("Total Merchants", "إجمالي التجار"),
      value: kpis.totalMerchants.toString(),
      icon: Briefcase,
      change: "+0",
      changeType: "neutral" as const,
      subtitle: t("Registered merchants", "التجار المسجلون"),
    },
    {
      title: t("Active Merchants", "التجار النشطون"),
      value: kpis.activeMerchants.toString(),
      icon: Briefcase,
      change: "+0",
      changeType: "neutral" as const,
      subtitle: t("Currently active", "نشط حالياً"),
    },
    {
      title: t("Total Properties", "إجمالي العقارات"),
      value: kpis.totalProperties.toString(),
      icon: Building2,
      change: "+0",
      changeType: "neutral" as const,
      subtitle: t("All property listings", "جميع قوائم العقارات"),
    },
    {
      title: t("Published Properties", "العقارات المنشورة"),
      value: kpis.publishedProperties.toString(),
      icon: Building2,
      change: "+0",
      changeType: "neutral" as const,
      subtitle: t("Live listings", "القوائم المنشورة"),
    },
    {
      title: t("Pending Properties", "العقارات قيد المراجعة"),
      value: kpis.pendingProperties.toString(),
      icon: Building2,
      change: "+0",
      changeType: "neutral" as const,
      subtitle: t("Awaiting review", "في انتظار المراجعة"),
    },
    {
      title: t("Total Leads", "إجمالي العملاء المحتملين"),
      value: kpis.totalLeads.toString(),
      icon: MessageSquare,
      change: "+0",
      changeType: "neutral" as const,
      subtitle: t("Lead inquiries", "استفسارات العملاء المحتملين"),
    },
  ];

  const getChangeColor = (changeType: "positive" | "negative" | "neutral") => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div dir={dir} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
