import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminSystemHealth } from "@/lib/admin/useAdminData";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export function AdminSystemHealth() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const systemHealth = useAdminSystemHealth();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "down":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "operational":
        return t("Operational", "تعمل");
      case "degraded":
        return t("Degraded", "متدهورة");
      case "down":
        return t("Down", "متوقفة");
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "down":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card dir={dir}>
      <CardHeader>
        <CardTitle>{t("System Health", "صحة النظام")}</CardTitle>
        <CardDescription>
          {t("Current status of platform services", "الحالة الحالية لخدمات المنصة")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systemHealth.map((service) => (
            <div key={service.service} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <span className="text-sm font-medium">
                  {language === "ar" ? service.serviceAr : service.service}
                </span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                {getStatusLabel(service.status)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
