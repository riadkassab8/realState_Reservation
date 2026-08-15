import { useState, useEffect } from "react";
import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllUsers, updateUser, getUserByEmail, type ExtendedUser } from "@/lib/admin/userManager";
import { UserRole } from "@/auth/auth.types";
import { ArrowLeft, Save, User, CheckCircle } from "lucide-react";

export default function AdminUserEdit() {
  const { user: currentUser } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const dir = language === "ar" ? "rtl" : "ltr";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER" as UserRole,
    status: "active" as ExtendedUser["status"],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const userId = params.id;
    if (!userId) {
      setNotFound(true);
      return;
    }

    const allUsers = getAllUsers();
    const targetUser = allUsers.find((u) => u.id === userId);

    if (!targetUser) {
      setNotFound(true);
      return;
    }

    setFormData({
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      status: targetUser.status,
    });
  }, [params.id]);

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
    } else {
      const existingUser = getUserByEmail(formData.email);
      if (existingUser && existingUser.id !== params.id) {
        newErrors.email = t("Email already exists", "البريد الإلكتروني موجود بالفعل");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userId = params.id;
    if (!userId) return;

    // Prevent self-destruction
    if (userId === currentUser?.id && formData.role !== "ADMIN") {
      if (!confirm(t("You are changing your own role. This may affect your access. Continue?", "أنت تقوم بتغيير دورك الخاص. قد يؤثر هذا على وصولك. متابعة؟"))) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      updateUser(userId, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      });
      setSuccess(true);

      setTimeout(() => {
        setLocation("/admin/users");
      }, 1500);
    } catch (error) {
      console.error("Error updating user:", error);
      setErrors({ submit: t("Failed to update user", "فشل في تحديث المستخدم") });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser || currentUser.role !== "ADMIN") {
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

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">
              {t("User not found", "المستخدم غير موجود")}
            </p>
            <Button className="mt-4" onClick={() => setLocation("/admin/users")}>
              {t("Back to Users", "العودة إلى المستخدمين")}
            </Button>
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
              {t("User Updated Successfully", "تم تحديث المستخدم بنجاح")}
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

  const isSelf = params.id === currentUser?.id;

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
              {t("Edit User", "تعديل المستخدم")}
            </h1>
            <p className="text-muted-foreground">
              {t("Update user information", "تحديث معلومات المستخدم")}
            </p>
          </div>
        </div>

        {isSelf && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardContent className="p-4">
              <p className="text-yellow-800 dark:text-yellow-200">
                {t("You are editing your own account. Be careful with role changes.", "أنت تقوم بتعديل حسابك الخاص. كن حذراً مع تغييرات الدور.")}
              </p>
            </CardContent>
          </Card>
        )}

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
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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
                    <SelectItem value="suspended">{t("Suspended", "معلق")}</SelectItem>
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
                  {t("Updating...", "جاري التحديث...")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("Update User", "تحديث المستخدم")}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
