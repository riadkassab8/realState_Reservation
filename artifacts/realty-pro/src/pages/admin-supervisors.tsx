import { useState, useMemo } from "react";
import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllUsers, deleteUser, updateUserStatus, getUsersByRole, type ExtendedUser } from "@/lib/admin/userManager";
import { ArrowLeft, Plus, Search, Eye, Edit, Trash2, Check, X, Shield } from "lucide-react";
import { UserRole } from "@/auth/auth.types";

export default function AdminSupervisors() {
  const { user: currentUser } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const dir = language === "ar" ? "rtl" : "ltr";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const supervisors = getUsersByRole("SUPERVISOR");

  // Filter and sort supervisors
  const filteredSupervisors = useMemo(() => {
    let users = [...supervisors];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      users = users.filter((u) => u.status === statusFilter);
    }

    // Sort
    users.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return users;
  }, [supervisors, searchQuery, statusFilter, sortBy]);

  // KPI stats
  const stats = useMemo(() => {
    return {
      total: supervisors.length,
      active: supervisors.filter((u) => u.status === "active").length,
      inactive: supervisors.filter((u) => u.status === "inactive").length,
      suspended: supervisors.filter((u) => u.status === "suspended").length,
      newThisMonth: supervisors.filter((u) => {
        const created = new Date(u.createdAt);
        const now = new Date();
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return created >= monthAgo;
      }).length,
    };
  }, [supervisors]);

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      alert(t("Cannot delete your own account", "لا يمكن حذف حسابك الخاص"));
      return;
    }
    if (confirm(t("Are you sure you want to delete this supervisor?", "هل أنت متأكد من حذف هذا المشرف؟"))) {
      deleteUser(id);
      window.location.reload();
    }
  };

  const handleStatusChange = (id: string, newStatus: ExtendedUser["status"]) => {
    if (id === currentUser?.id) {
      alert(t("Cannot change your own status", "لا يمكن تغيير حالة حسابك الخاص"));
      return;
    }
    updateUserStatus(id, newStatus);
    window.location.reload();
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

  const getStatusColor = (status: ExtendedUser["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: ExtendedUser["status"]) => {
    switch (status) {
      case "active":
        return t("Active", "نشط");
      case "inactive":
        return t("Inactive", "غير نشط");
      case "suspended":
        return t("Suspended", "معلق");
      default:
        return status;
    }
  };

  const getPermissionsLabel = () => {
    return t(
      "Moderate Properties, Manage Users, Review Merchants, Manage Content",
      "مراجعة العقارات، إدارة المستخدمين، مراجعة التجار، إدارة المحتوى"
    );
  };

  return (
    <div className="container mx-auto px-4 py-10" dir={dir}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/admin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="h-8 w-8" />
                {t("Supervisors", "المشرفون")}
              </h1>
              <p className="text-muted-foreground">
                {t("Manage platform supervisors", "إدارة مشرفي المنصة")}
              </p>
            </div>
          </div>
          <Button onClick={() => setLocation("/admin/supervisors/new")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("Add Supervisor", "إضافة مشرف")}
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">
                {t("Total Supervisors", "إجمالي المشرفين")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">
                {t("Active Supervisors", "المشرفون النشطون")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
              <div className="text-sm text-muted-foreground">
                {t("Inactive Supervisors", "المشرفون غير النشطين")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</div>
              <div className="text-sm text-muted-foreground">
                {t("New This Month", "جديد هذا الشهر")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
                <Input
                  placeholder={t("Search supervisors...", "البحث في المشرفين...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rtl:pr-10 rtl:pl-4"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t("All Status", "جميع الحالات")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Status", "جميع الحالات")}</SelectItem>
                  <SelectItem value="active">{t("Active", "نشط")}</SelectItem>
                  <SelectItem value="inactive">{t("Inactive", "غير نشط")}</SelectItem>
                  <SelectItem value="suspended">{t("Suspended", "معلق")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Sort by", "ترتيب حسب")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("Newest", "الأحدث")}</SelectItem>
                  <SelectItem value="oldest">{t("Oldest", "الأقدم")}</SelectItem>
                  <SelectItem value="name">{t("Name", "الاسم")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Supervisors Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t("All Supervisors", "جميع المشرفين")}</CardTitle>
            <CardDescription>
              {t("View and manage all platform supervisors", "عرض وإدارة جميع مشرفي المنصة")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Name", "الاسم")}</TableHead>
                    <TableHead>{t("Email", "البريد الإلكتروني")}</TableHead>
                    <TableHead>{t("Status", "الحالة")}</TableHead>
                    <TableHead>{t("Joined", "تاريخ الانضمام")}</TableHead>
                    <TableHead>{t("Permissions", "الصلاحيات")}</TableHead>
                    <TableHead className="text-right">{t("Actions", "الإجراءات")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSupervisors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        {t("No supervisors found", "لم يتم العثور على مشرفين")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSupervisors.map((supervisor) => (
                      <TableRow key={supervisor.id}>
                        <TableCell className="font-medium">{supervisor.name}</TableCell>
                        <TableCell className="text-muted-foreground">{supervisor.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(supervisor.status)}`} />
                            <span className="text-sm">{getStatusLabel(supervisor.status)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(supervisor.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs max-w-xs">
                          {getPermissionsLabel()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setLocation(`/admin/users/${supervisor.id}`)}
                              title={t("View", "عرض")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setLocation(`/admin/supervisors/${supervisor.id}/edit`)}
                              title={t("Edit", "تعديل")}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {supervisor.status === "active" ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(supervisor.id, "inactive")}
                                title={t("Deactivate", "تعطيل")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(supervisor.id, "active")}
                                title={t("Activate", "تفعيل")}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(supervisor.id)}
                              title={t("Delete", "حذف")}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
