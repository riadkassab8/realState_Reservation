import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminUsers } from "@/lib/admin/useAdminData";
import { MoreHorizontal, Eye, Edit, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminUsersTable() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const recentUsers = useAdminUsers();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "suspended":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return t("Active", "نشط");
      case "suspended":
        return t("Suspended", "معلق");
      case "pending":
        return t("Pending", "قيد الانتظار");
      default:
        return status;
    }
  };

  const getRoleLabel = (role: string) => {
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

  const handleUserAction = (action: string, userId: string) => {
    alert(t(`${action} action is coming soon`, `إجراء ${action} قريباً`));
  };

  return (
    <Card dir={dir}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("Recent Users", "المستخدمون الأخيرون")}</CardTitle>
            <CardDescription>
              {t("Latest user registrations and activity", "أحدث التسجيلات والنشاط للمستخدمين")}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => alert(t("This feature is coming soon", "هذه الميزة قريباً"))}>
            {t("View All", "عرض الكل")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Name", "الاسم")}</TableHead>
                <TableHead>{t("Email", "البريد الإلكتروني")}</TableHead>
                <TableHead>{t("Role", "الدور")}</TableHead>
                <TableHead>{t("Status", "الحالة")}</TableHead>
                <TableHead>{t("Join Date", "تاريخ الانضمام")}</TableHead>
                <TableHead className="text-right">{t("Actions", "الإجراءات")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {t("No users found", "لم يتم العثور على مستخدمين")}
                  </TableCell>
                </TableRow>
              ) : (
                recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                        <span className="text-sm">{getStatusLabel(user.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.joinDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction("View", user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("View", "عرض")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction("Edit", user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("Edit", "تعديل")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction("Suspend", user.id)} className="text-destructive">
                            <Ban className="mr-2 h-4 w-4" />
                            {t("Suspend", "تعليق")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
