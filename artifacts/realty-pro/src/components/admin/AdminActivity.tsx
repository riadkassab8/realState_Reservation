import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminActivity } from "@/lib/admin/useAdminData";
import * as Icons from "lucide-react";

export function AdminActivity() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const recentActivities = useAdminActivity();

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  return (
    <Card dir={dir}>
      <CardHeader>
        <CardTitle>{t("Recent Activity", "النشاط الأخير")}</CardTitle>
        <CardDescription>
          {t("Latest platform activities and events", "أحدث أنشطة وأحداث المنصة")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("No recent activity", "لا يوجد نشاط حديث")}
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {getIcon(activity.icon)}
                  </div>
                  {index < recentActivities.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium">
                    {language === "ar" ? activity.descriptionAr : activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    {activity.actor && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{activity.actor}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
