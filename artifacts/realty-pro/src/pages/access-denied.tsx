import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function AccessDenied() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "ADMIN":
        return "/admin";
      case "SUPERVISOR":
        return "/supervisor";
      case "USER":
        return "/dashboard";
      case "MERCHANT":
        return "/merchant";
      default:
        return "/dashboard";
    }
  };

  return (
    <div dir={dir} className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-destructive/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">
              {t("Access Denied", "تم رفض الوصول")}
            </CardTitle>
            <CardDescription className="text-base">
              {t(
                "You don't have permission to access this page.",
                "ليس لديك صلاحية للوصول إلى هذه الصفحة."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-1">
                {t("Your account role:", "دور حسابك:")}
              </p>
              <p className="text-muted-foreground">
                {user?.role || t("Not logged in", "غير مسجل الدخول")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => (window.location.href = getDashboardPath())}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("Back to Dashboard", "العودة إلى لوحة التحكم")}
              </Button>
              <Button
                className="flex-1"
                onClick={() => (window.location.href = "/")}
              >
                <Home className="h-4 w-4 mr-2" />
                {t("Go to Home", "الذهاب للرئيسية")}
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
