import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminMerchants } from "@/lib/admin/useAdminData";
import { MoreHorizontal, Eye, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminMerchantOverview() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const recentMerchants = useAdminMerchants();

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

  const handleMerchantAction = (action: string, merchantId: string) => {
    alert(t(`${action} action is coming soon`, `إجراء ${action} قريباً`));
  };

  return (
    <Card dir={dir}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("Recent Merchant Activity", "نشاط التجار الأخير")}</CardTitle>
            <CardDescription>
              {t("Latest merchant registrations and property activity", "أحدث تسجيلات التجار ونشاط العقارات")}
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
                <TableHead>{t("Merchant", "التاجر")}</TableHead>
                <TableHead>{t("Properties", "العقارات")}</TableHead>
                <TableHead>{t("Status", "الحالة")}</TableHead>
                <TableHead>{t("Joined", "تاريخ الانضمام")}</TableHead>
                <TableHead className="text-right">{t("Actions", "الإجراءات")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMerchants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {t("No merchants found", "لم يتم العثور على تجار")}
                  </TableCell>
                </TableRow>
              ) : (
                recentMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{merchant.name}</p>
                        <p className="text-xs text-muted-foreground">{merchant.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{merchant.properties}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(merchant.status)}`} />
                        <span className="text-sm">{getStatusLabel(merchant.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{merchant.joined}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleMerchantAction("View", merchant.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("View", "عرض")}
                          </DropdownMenuItem>
                          {merchant.status === "active" && (
                            <>
                              <DropdownMenuItem onClick={() => handleMerchantAction("Approve", merchant.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                {t("Approve", "موافقة")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMerchantAction("Reject", merchant.id)} className="text-destructive">
                                <X className="mr-2 h-4 w-4" />
                                {t("Reject", "رفض")}
                              </DropdownMenuItem>
                            </>
                          )}
                          {merchant.status === "inactive" && (
                            <DropdownMenuItem onClick={() => handleMerchantAction("Suspend", merchant.id)} className="text-destructive">
                              <X className="mr-2 h-4 w-4" />
                              {t("Suspend", "تعليق")}
                            </DropdownMenuItem>
                          )}
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
