import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Building2, Lock, Mail, AlertCircle } from "lucide-react";
import { DEMO_ACCOUNTS } from "@/auth/auth.mock";
import { getRoleRedirectPath } from "@/auth/permissions";

export default function Login() {
  const { t, language } = useLanguage();
  const { login, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dir = language === "ar" ? "rtl" : "ltr";

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t("Email is required", "البريد الإلكتروني مطلوب");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("Invalid email address", "عنوان بريد إلكتروني غير صالح");
    }

    if (!password) {
      newErrors.password = t("Password is required", "كلمة المرور مطلوبة");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast({
        title: t("Login successful", "تم تسجيل الدخول بنجاح"),
        description: t("Welcome back!", "مرحباً بعودتك!"),
      });
      
      // Redirect based on role
      const user = JSON.parse(localStorage.getItem("realty-auth-session") || "{}");
      const redirectPath = getRoleRedirectPath(user.role);
      setLocation(redirectPath);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("Login failed", "فشل تسجيل الدخول"),
        description: t("Invalid email or password", "البريد الإلكتروني أو كلمة المرور غير صحيحة"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (role: keyof typeof DEMO_ACCOUNTS) => {
    const account = DEMO_ACCOUNTS[role];
    setEmail(account.email);
    setPassword(account.password);
    setErrors({});
  };

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2L2 12H6V24H11V16H17V24H22V12H26L14 2Z"
                  fill="currentColor"
                  className="text-primary"
                />
              </svg>
            </div>
            <span
              className="font-bold text-3xl tracking-tight"
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              {language === "ar" ? "ديار" : "Deyar"}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {t("Premium Real Estate Platform", "منصة العقارات الفاخرة")}
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t("Welcome back", "مرحباً بعودتك")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("Sign in to your account", "سجل الدخول إلى حسابك")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email", "البريد الإلكتروني")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("your@email.com", "بريدك@الإلكتروني.com")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${language === "ar" ? "pr-10" : ""} ${errors.email ? "border-destructive" : ""}`}
                    dir="ltr"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("Password", "كلمة المرور")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("••••••••", "••••••••")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 ${language === "ar" ? "pr-10" : ""} ${errors.password ? "border-destructive" : ""}`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    {t("Remember me", "تذكرني")}
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    toast({
                      title: t("Password Reset", "إعادة تعيين كلمة المرور"),
                      description: t("Contact support to reset your password", "تواصل مع الدعم لإعادة تعيين كلمة المرور"),
                    });
                  }}
                >
                  {t("Forgot password?", "نسيت كلمة المرور؟")}
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    {t("Signing in...", "جاري تسجيل الدخول...")}
                  </>
                ) : (
                  t("Sign in", "تسجيل الدخول")
                )}
              </Button>
            </form>

            {/* Demo Access Section */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">
                {t("Demo Access", "الوصول التجريبي")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("ADMIN")}
                  className="text-xs"
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("SUPERVISOR")}
                  className="text-xs"
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  Supervisor
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("USER")}
                  className="text-xs"
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("MERCHANT")}
                  className="text-xs"
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  Merchant
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => {
                  toast({
                    title: t("Registration", "التسجيل"),
                    description: t("Registration is currently disabled for demo", "التسجيل معطل حالياً للتجربة"),
                  });
                }}
              >
                {t("Contact us", "تواصل معنا")}
              </button>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} {language === "ar" ? "ديار" : "Deyar"} — {t("All rights reserved.", "جميع الحقوق محفوظة.")}
        </p>
      </div>
    </div>
  );
}
