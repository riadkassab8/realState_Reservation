import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminPerformanceData } from "@/lib/admin/useAdminData";

type TimeRange = "7d" | "30d" | "90d" | "1y";

export function AdminPerformanceChart() {
  const { t, language } = useLanguage();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const dir = language === "ar" ? "rtl" : "ltr";
  const performanceData = useAdminPerformanceData(timeRange);

  const timeRanges = [
    { value: "7d" as TimeRange, label: "7 Days", labelAr: "7 أيام" },
    { value: "30d" as TimeRange, label: "30 Days", labelAr: "30 يوم" },
    { value: "90d" as TimeRange, label: "90 Days", labelAr: "90 يوم" },
    { value: "1y" as TimeRange, label: "1 Year", labelAr: "سنة واحدة" },
  ];

  const maxValue = Math.max(
    ...performanceData.map((d) => Math.max(d.users, d.properties, d.leads))
  );

  const getBarHeight = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  return (
    <Card dir={dir}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("Platform Performance", "أداء المنصة")}</CardTitle>
            <CardDescription>
              {t("New users, properties, and leads over time", "المستخدمون الجدد والعقارات والعملاء المحتملون بمرور الوقت")}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range.value)}
              >
                {language === "ar" ? range.labelAr : range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">{t("Users", "المستخدمون")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">{t("Properties", "العقارات")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">{t("Leads", "العملاء المحتملون")}</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 flex items-end gap-2 md:gap-4">
            {performanceData.map((data) => (
              <div key={data.date} className="flex-1 flex flex-col gap-1">
                <div className="flex-1 flex gap-1 items-end h-full">
                  {/* Users Bar */}
                  <div
                    className="flex-1 bg-primary rounded-t transition-all hover:opacity-80"
                    style={{ height: `${getBarHeight(data.users)}%` }}
                    title={`${t("Users", "المستخدمون")}: ${data.users}`}
                  />
                  {/* Properties Bar */}
                  <div
                    className="flex-1 bg-green-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${getBarHeight(data.properties)}%` }}
                    title={`${t("Properties", "العقارات")}: ${data.properties}`}
                  />
                  {/* Leads Bar */}
                  <div
                    className="flex-1 bg-blue-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${getBarHeight(data.leads)}%` }}
                    title={`${t("Leads", "العملاء المحتملون")}: ${data.leads}`}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center truncate">
                  {data.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
