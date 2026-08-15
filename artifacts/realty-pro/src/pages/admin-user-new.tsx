import { useState } from "react";
import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addUser, getUserByEmail, type ExtendedUser } from "@/lib/admin/userManager";
import { UserRole } from "@/auth/auth.types";
import { ArrowLeft, Save, User, CheckCircle } from "lucide-react";

export default function AdminUserNew() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const dir = language === "ar" ? "rtl" : "ltr";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as UserRole,
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
        role: formData.role,
        status: formData.status,
      });
      setSuccess(true);

      setTimeout(() => {
        setLocation("/admin/users");
      }, 1500);
    } catch (error) {
      console.error("Error creating user:", error);
      setErrors({ submit: t("Failed to create user", "فشل في إنشاء المستخدم") });
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
              {t("User Created Successfully", "تم إنشاء المستخدم بنجاح")}
            </h2>
            <p className="text-muted-foreground">
              {t("Redirecting to user management...", "جاري التوجيه إلى إدارة المستخدمين...")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return t("Admin", "مشرف");
      case "SUPERVISOR":
        return t("Supervisor", "مشرف ميداني");
      case "USER":
        return t("User", "مستخدم");
      case "MERCHANT":
        return t("Merchant", "تاجر");
      default:
        return role;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10" dir={dir}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/users")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {t("Add New User", "إضافة مستخدم جديد")}
            </h1>
            <p className="text-muted-foreground">
              {t("Create a new user account", "إنشاء حساب مستخدم جديد")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("User Information", "معلومات المستخدم")}
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
                  placeholder="user@example.com"
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
                <Label htmlFor="role">{t("Role", "الدور")}</Label>
                <Select value={formData.role} onValueChange={(v) => handleInputChange("role", v)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">{getRoleLabel("USER")}</SelectItem>
                    <SelectItem value="MERCHANT">{getRoleLabel("MERCHANT")}</SelectItem>
                    <SelectItem value="SUPERVISOR">{getRoleLabel("SUPERVISOR")}</SelectItem>
                    <SelectItem value="ADMIN">{getRoleLabel("ADMIN")}</SelectItem>
                  </SelectContent>
                </Select>
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
              onClick={() => setLocation("/admin/users")}
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
                  {t("Create User", "إنشاء المستخدم")}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
