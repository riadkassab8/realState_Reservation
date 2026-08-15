import { useState } from "react";
import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { addUser, getUserByEmail, type ExtendedUser } from "@/lib/admin/userManager";
import { ArrowLeft, Save, Shield, CheckCircle } from "lucide-react";

export default function AdminSupervisorNew() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const dir = language === "ar" ? "rtl" : "ltr";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    status: "active" as ExtendedUser["status"],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("Name is required", "الاسم مطلوب");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("Email is required", "البريد الإلكتروني مطلوب");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("Invalid email format", "تنسيق البريد الإلكتروني غير صالح");
    } else if (getUserByEmail(formData.email)) {
      newErrors.email = t("Email already exists", "البريد الإلكتروني موجود بالفعل");
    }

    if (!formData.password.trim()) {
      newErrors.password = t("Password is required", "كلمة المرور مطلوبة");
    } else if (formData.password.length < 6) {
      newErrors.password = t("Password must be at least 6 characters", "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "SUPERVISOR", // Always SUPERVISOR for this form
        status: formData.status,
      });
      setSuccess(true);

      setTimeout(() => {
        setLocation("/admin/supervisors");
      }, 1500);
    } catch (error) {
      console.error("Error creating supervisor:", error);
      setErrors({ submit: t("Failed to create supervisor", "فشل في إنشاء المشرف") });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">
              {t("Access denied. Admin only.", "تم رفض الوصول. للمشرفين فقط.")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="p-10 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {t("Supervisor Created Successfully", "تم إنشاء المشرف بنجاح")}
            </h2>
            <p className="text-muted-foreground">
              {t("Redirecting to supervisor management...", "جاري التوجيه إلى إدارة المشرفين...")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10" dir={dir}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/supervisors")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              {t("Add New Supervisor", "إضافة مشرف جديد")}
            </h1>
            <p className="text-muted-foreground">
              {t("Create a new supervisor account", "إنشاء حساب مشرف جديد")}
            </p>
          </div>
        </div>

        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              {t(
                "Supervisors have permissions to moderate properties, manage users, review merchants, and manage content.",
                "المشرفون لديهم صلاحيات لمراجعة العقارات، إدارة المستخدمين، مراجعة التجار، وإدارة المحتوى."
              )}
            </p>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t("Supervisor Information", "معلومات المشرف")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("Name", "الاسم")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("John Doe", "محمد أحمد")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("Email", "البريد الإلكتروني")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="supervisor@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("Password", "كلمة المرور")} *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="••••••"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{t("Status", "الحالة")}</Label>
                <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("Active", "نشط")}</SelectItem>
                    <SelectItem value="inactive">{t("Inactive", "غير نشط")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("Role", "الدور")}</Label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Badge className="bg-blue-500">SUPERVISOR</Badge>
                  <span className="text-sm text-muted-foreground">
                    {t("Automatically assigned", "مُعين تلقائياً")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {errors.submit && (
            <Card className="border-red-500 bg-red-50 dark:bg-red-950">
              <CardContent className="p-4">
                <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/admin/supervisors")}
              disabled={isSubmitting}
            >
              {t("Cancel", "إلغاء")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  {t("Creating...", "جاري الإنشاء...")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("Create Supervisor", "إنشاء المشرف")}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
