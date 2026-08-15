import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminPropertyStatuses } from "@/lib/admin/useAdminData";

export function AdminPropertyOverview() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const propertyStatuses = useAdminPropertyStatuses();

  const totalProperties = propertyStatuses.reduce((sum, status) => sum + status.count, 0);

  return (
    <Card dir={dir}>
      <CardHeader>
        <CardTitle>{t("Property Status Overview", "نظرة عامة على حالة العقارات")}</CardTitle>
        <CardDescription>
          {t("Breakdown of property listings by status", "توزيع قوائم العقارات حسب الحالة")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="relative h-4 rounded-full bg-muted overflow-hidden">
            {propertyStatuses.map((status) => (
              status.count > 0 && (
                <div
                  key={status.status}
                  className={`absolute top-0 h-full ${status.color} transition-all`}
                  style={{
                    width: `${status.percentage}%`,
                    left: `${propertyStatuses
                      .slice(0, propertyStatuses.indexOf(status))
                      .reduce((sum, s) => sum + s.percentage, 0)}%`,
                  }}
                />
              )
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {propertyStatuses.map((status) => (
              <div key={status.status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${status.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {language === "ar" ? status.statusAr : status.status}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {status.count.toLocaleString()} ({status.percentage}%)
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("Total Properties", "إجمالي العقارات")}</span>
              <span className="font-semibold">{totalProperties.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
