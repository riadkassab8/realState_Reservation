import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Shield, FileText, Building2, BarChart3 } from "lucide-react";

export function AdminQuickActions() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  const quickActions = [
    {
      id: "add-property",
      label: t("Add Property", "إضافة عقار"),
      labelAr: "إضافة عقار",
      icon: Plus,
      href: "/admin/properties/new",
      available: true,
    },
    {
      id: "add-user",
      label: t("Add User", "إضافة مستخدم"),
      labelAr: "إضافة مستخدم",
      icon: UserPlus,
      href: "#",
      available: false, // Coming soon
    },
    {
      id: "add-supervisor",
      label: t("Add Supervisor", "إضافة مشرف"),
      labelAr: "إضافة مشرف",
      icon: Shield,
      href: "#",
      available: false, // Coming soon
    },
    {
      id: "review-properties",
      label: t("Review Properties", "مراجعة العقارات"),
      labelAr: "مراجعة العقارات",
      icon: FileText,
      href: "/properties",
      available: true,
    },
    {
      id: "review-merchants",
      label: t("Review Merchants", "مراجعة التجار"),
      labelAr: "مراجعة التجار",
      icon: Building2,
      href: "#",
      available: false, // Coming soon
    },
    {
      id: "view-reports",
      label: t("View Reports", "عرض التقارير"),
      labelAr: "عرض التقارير",
      icon: BarChart3,
      href: "#",
      available: false, // Coming soon
    },
  ];

  const handleAction = (href: string, available: boolean) => {
    if (!available) {
      alert(t("This feature is coming soon", "هذه الميزة قريباً"));
      return;
    }
    window.location.href = href;
  };

  return (
    <Card dir={dir}>
      <CardHeader>
        <CardTitle>{t("Quick Actions", "إجراءات سريعة")}</CardTitle>
        <CardDescription>
          {t("Frequently used administrative actions", "الإجراءات الإدارية المستخدمة بشكل متكرر")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                className="flex flex-col gap-2 h-auto py-4 hover:bg-primary/10 opacity-90"
                onClick={() => handleAction(action.href, action.available)}
                disabled={!action.available}
              >
                <span className="text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium">
                  {language === "ar" ? action.labelAr : action.label}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
