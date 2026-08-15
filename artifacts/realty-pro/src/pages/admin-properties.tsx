import { useAuth } from "@/auth/auth.context";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAllProperties, deleteProperty } from "@/lib/admin/propertyManager";
import { ArrowLeft, Plus, Eye, Edit, Trash2 } from "lucide-react";

export default function AdminProperties() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const dir = language === "ar" ? "rtl" : "ltr";

  const properties = getAllProperties();

  const handleDelete = (id: number) => {
    if (confirm(t("Are you sure you want to delete this property?", "هل أنت متأكد من حذف هذا العقار؟"))) {
      deleteProperty(id);
      window.location.reload();
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
              <h1 className="text-3xl font-bold">
                {t("Property Management", "إدارة العقارات")}
              </h1>
              <p className="text-muted-foreground">
                {t("Manage all platform properties", "إدارة جميع عقارات المنصة")}
              </p>
            </div>
          </div>
          <Button onClick={() => setLocation("/admin/properties/new")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("Add Property", "إضافة عقار")}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{properties.length}</div>
              <div className="text-sm text-muted-foreground">
                {t("Total Properties", "إجمالي العقارات")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {properties.filter((p) => p.featured).length}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("Featured", "مميز")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {properties.filter((p) => p.type === "sale").length}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("For Sale", "للبيع")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t("All Properties", "جميع العقارات")}</CardTitle>
            <CardDescription>
              {t("View and manage all properties on the platform", "عرض وإدارة جميع العقارات على المنصة")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("ID", "المعرف")}</TableHead>
                    <TableHead>{t("Title", "العنوان")}</TableHead>
                    <TableHead>{t("Type", "النوع")}</TableHead>
                    <TableHead>{t("Category", "الفئة")}</TableHead>
                    <TableHead>{t("Price", "السعر")}</TableHead>
                    <TableHead>{t("City", "المدينة")}</TableHead>
                    <TableHead>{t("Featured", "مميز")}</TableHead>
                    <TableHead className="text-right">{t("Actions", "الإجراءات")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        {t("No properties found", "لم يتم العثور على عقارات")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{property.title}</p>
                            <p className="text-xs text-muted-foreground">{property.titleAr}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {property.type === "sale" ? t("Sale", "بيع") : t("Rent", "إيجار")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{property.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {property.price.toLocaleString()} {property.priceUnit}
                        </TableCell>
                        <TableCell>{property.city}</TableCell>
                        <TableCell>
                          {property.featured ? (
                            <Badge className="bg-green-500">{t("Yes", "نعم")}</Badge>
                          ) : (
                            <Badge variant="outline">{t("No", "لا")}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setLocation(`/properties/${property.id}`)}
                              title={t("View", "عرض")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => alert(t("Edit feature coming soon", "ميزة التعديل قريباً"))}
                              title={t("Edit", "تعديل")}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(property.id)}
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
