import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminReviewQueue } from "@/lib/admin/useAdminData";
import { AlertTriangle, Clock, FileText, Users } from "lucide-react";
import * as Icons from "lucide-react";

export function AdminReviewQueue() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const reviewQueue = useAdminReviewQueue();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return t("High", "عالي");
      case "medium":
        return t("Medium", "متوسط");
      case "low":
        return t("Low", "منخفض");
      default:
        return priority;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Properties":
        return <FileText className="h-5 w-5" />;
      case "Merchants":
        return <Users className="h-5 w-5" />;
      case "Reports":
        return <AlertTriangle className="h-5 w-5" />;
      case "Accounts":
        return <Users className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <Card dir={dir}>
      <CardHeader>
        <CardTitle>{t("Needs Your Attention", "يحتاج انتباهك")}</CardTitle>
        <CardDescription>
          {t("Items requiring immediate review or action", "العناصر التي تتطلب مراجعة فورية أو اتخاذ إجراء")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reviewQueue.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("No items requiring review", "لا توجد عناصر تتطلب المراجعة")}
          </div>
        ) : (
          <div className="space-y-3">
            {reviewQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {language === "ar" ? item.titleAr : item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {language === "ar" ? item.categoryAr : item.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`} />
                        <span className="text-xs text-muted-foreground">
                          {getPriorityLabel(item.priority)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.count} items</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant={item.priority === "high" ? "default" : "outline"}>
                  {language === "ar" ? item.actionAr : item.action}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
