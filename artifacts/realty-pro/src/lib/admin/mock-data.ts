export interface AdminKPICard {
  title: string;
  titleAr: string;
  value: string;
  icon: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  subtitle: string;
  subtitleAr: string;
}

export interface PropertyStatus {
  status: string;
  statusAr: string;
  count: number;
  percentage: number;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended" | "pending";
  joinDate: string;
}

export interface Merchant {
  id: string;
  name: string;
  email: string;
  properties: number;
  status: "active" | "suspended" | "pending";
  joined: string;
}

export interface ReviewQueueItem {
  id: string;
  category: string;
  categoryAr: string;
  title: string;
  titleAr: string;
  count: number;
  priority: "high" | "medium" | "low";
  action: string;
  actionAr: string;
}

export interface Activity {
  id: string;
  icon: string;
  description: string;
  descriptionAr: string;
  timestamp: string;
  actor?: string;
}

export interface SystemHealth {
  service: string;
  serviceAr: string;
  status: "operational" | "degraded" | "down";
}

export interface PerformanceDataPoint {
  date: string;
  users: number;
  properties: number;
  leads: number;
}

// KPI Cards
export const adminKPIs: AdminKPICard[] = [
  {
    title: "Total Users",
    titleAr: "إجمالي المستخدمين",
    value: "12,840",
    icon: "Users",
    change: "+12.4%",
    changeType: "positive",
    subtitle: "vs last month",
    subtitleAr: "مقارنة بالشهر الماضي",
  },
  {
    title: "Active Users",
    titleAr: "المستخدمون النشطون",
    value: "8,456",
    icon: "UserCheck",
    change: "+8.2%",
    changeType: "positive",
    subtitle: "currently online",
    subtitleAr: "متصل حالياً",
  },
  {
    title: "Total Merchants",
    titleAr: "إجمالي التجار",
    value: "1,245",
    icon: "Building2",
    change: "+15.7%",
    changeType: "positive",
    subtitle: "registered merchants",
    subtitleAr: "تاجر مسجل",
  },
  {
    title: "Active Merchants",
    titleAr: "التجار النشطون",
    value: "987",
    icon: "Store",
    change: "+5.3%",
    changeType: "positive",
    subtitle: "with active listings",
    subtitleAr: "مع قوائم نشطة",
  },
  {
    title: "Total Properties",
    titleAr: "إجمالي العقارات",
    value: "15,678",
    icon: "Home",
    change: "+18.2%",
    changeType: "positive",
    subtitle: "property listings",
    subtitleAr: "قائمة عقارات",
  },
  {
    title: "Published Properties",
    titleAr: "العقارات المنشورة",
    value: "14,234",
    icon: "CheckCircle",
    change: "+16.8%",
    changeType: "positive",
    subtitle: "live listings",
    subtitleAr: "قوائم مباشرة",
  },
  {
    title: "Pending Properties",
    titleAr: "العقارات المعلقة",
    value: "1,444",
    icon: "Clock",
    change: "-2.3%",
    changeType: "negative",
    subtitle: "awaiting review",
    subtitleAr: "بانتظار المراجعة",
  },
  {
    title: "Total Leads",
    titleAr: "إجمالي العملاء المحتملين",
    value: "45,678",
    icon: "MessageSquare",
    change: "+22.1%",
    changeType: "positive",
    subtitle: "inquiries generated",
    subtitleAr: "استفسارات تم إنشاؤها",
  },
];

// Property Status Breakdown
export const propertyStatuses: PropertyStatus[] = [
  { status: "Published", statusAr: "منشور", count: 14234, percentage: 90.8, color: "bg-green-500" },
  { status: "Pending Review", statusAr: "قيد المراجعة", count: 1444, percentage: 9.2, color: "bg-yellow-500" },
  { status: "Draft", statusAr: "مسودة", count: 0, percentage: 0, color: "bg-gray-400" },
  { status: "Rejected", statusAr: "مرفوض", count: 0, percentage: 0, color: "bg-red-500" },
  { status: "Archived", statusAr: "أرشيف", count: 0, percentage: 0, color: "bg-gray-300" },
];

// Recent Users
export const recentUsers: User[] = [
  { id: "1", name: "Ahmed Mohamed", email: "ahmed@example.com", role: "USER", status: "active", joinDate: "2024-01-15" },
  { id: "2", name: "Sara Ali", email: "sara@example.com", role: "USER", status: "active", joinDate: "2024-01-14" },
  { id: "3", name: "Omar Hassan", email: "omar@example.com", role: "MERCHANT", status: "active", joinDate: "2024-01-13" },
  { id: "4", name: "Fatima Khalil", email: "fatima@example.com", role: "USER", status: "pending", joinDate: "2024-01-12" },
  { id: "5", name: "Mahmoud Said", email: "mahmoud@example.com", role: "SUPERVISOR", status: "active", joinDate: "2024-01-11" },
];

// Merchant Overview
export const recentMerchants: Merchant[] = [
  { id: "1", name: "El-Nour Real Estate", email: "elnour@example.com", properties: 45, status: "active", joined: "2024-01-10" },
  { id: "2", name: "Cairo Properties", email: "cairo@example.com", properties: 32, status: "active", joined: "2024-01-09" },
  { id: "3", name: "Nile Valley Homes", email: "nile@example.com", properties: 28, status: "pending", joined: "2024-01-08" },
  { id: "4", name: "Pyramid Estates", email: "pyramid@example.com", properties: 19, status: "active", joined: "2024-01-07" },
  { id: "5", name: "Delta Properties", email: "delta@example.com", properties: 15, status: "suspended", joined: "2024-01-06" },
];

// Review Queue
export const reviewQueue: ReviewQueueItem[] = [
  {
    id: "1",
    category: "Properties",
    categoryAr: "العقارات",
    title: "Properties awaiting approval",
    titleAr: "عقارات بانتظار الموافقة",
    count: 12,
    priority: "high",
    action: "Review",
    actionAr: "مراجعة",
  },
  {
    id: "2",
    category: "Merchants",
    categoryAr: "التجار",
    title: "Merchant applications",
    titleAr: "طلبات التجار",
    count: 4,
    priority: "high",
    action: "Review",
    actionAr: "مراجعة",
  },
  {
    id: "3",
    category: "Reports",
    categoryAr: "البلاغات",
    title: "Reported listings",
    titleAr: "قوائم تم الإبلاغ عنها",
    count: 7,
    priority: "medium",
    action: "Investigate",
    actionAr: "تحقيق",
  },
  {
    id: "4",
    category: "Accounts",
    categoryAr: "الحسابات",
    title: "Suspended accounts",
    titleAr: "حسابات معلقة",
    count: 3,
    priority: "medium",
    action: "Review",
    actionAr: "مراجعة",
  },
];

// Recent Activity
export const recentActivities: Activity[] = [
  {
    id: "1",
    icon: "Building2",
    description: "Merchant submitted a new property",
    descriptionAr: "تاجر قدم عقار جديد",
    timestamp: "2 minutes ago",
    actor: "El-Nour Real Estate",
  },
  {
    id: "2",
    icon: "UserPlus",
    description: "New user registered",
    descriptionAr: "مستخدم جديد مسجل",
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    icon: "CheckCircle",
    description: "Property approved",
    descriptionAr: "عقار تمت الموافقة عليه",
    timestamp: "1 hour ago",
    actor: "Mahmoud Said",
  },
  {
    id: "4",
    icon: "Store",
    description: "Merchant account activated",
    descriptionAr: "حساب تاجر تم تفعيله",
    timestamp: "2 hours ago",
    actor: "Admin",
  },
  {
    id: "5",
    icon: "AlertTriangle",
    description: "Property reported",
    descriptionAr: "عقار تم الإبلاغ عنه",
    timestamp: "3 hours ago",
  },
];

// System Health
export const systemHealth: SystemHealth[] = [
  { service: "Platform Status", serviceAr: "حالة المنصة", status: "operational" },
  { service: "Listings Service", serviceAr: "خدمة القوائم", status: "operational" },
  { service: "Notifications", serviceAr: "الإشعارات", status: "operational" },
  { service: "Authentication", serviceAr: "المصادقة", status: "operational" },
];

// Performance Data (30 days)
export const performanceData: PerformanceDataPoint[] = [
  { date: "Jan 1", users: 120, properties: 45, leads: 89 },
  { date: "Jan 5", users: 145, properties: 52, leads: 102 },
  { date: "Jan 10", users: 178, properties: 68, leads: 134 },
  { date: "Jan 15", users: 234, properties: 89, leads: 167 },
  { date: "Jan 20", users: 289, properties: 112, leads: 201 },
  { date: "Jan 25", users: 345, properties: 134, leads: 245 },
  { date: "Jan 30", users: 412, properties: 156, leads: 289 },
];

// Quick Actions
export const quickActions = [
  { id: "1", label: "Add Property", labelAr: "إضافة عقار", icon: "Plus", href: "/admin/properties/add" },
  { id: "2", label: "Add User", labelAr: "إضافة مستخدم", icon: "UserPlus", href: "/admin/users/add" },
  { id: "3", label: "Add Supervisor", labelAr: "إضافة مشرف", icon: "Shield", href: "/admin/supervisors/add" },
  { id: "4", label: "Review Properties", labelAr: "مراجعة العقارات", icon: "FileText", href: "/admin/reviews/properties" },
  { id: "5", label: "Review Merchants", labelAr: "مراجعة التجار", icon: "Store", href: "/admin/reviews/merchants" },
  { id: "6", label: "View Reports", labelAr: "عرض التقارير", icon: "BarChart", href: "/admin/reports" },
];

// Sidebar Navigation
export const sidebarNavItems = [
  { id: "overview", label: "Overview", labelAr: "نظرة عامة", icon: "LayoutDashboard", href: "/admin", available: true },
  { id: "users", label: "Users", labelAr: "المستخدمون", icon: "Users", href: "/admin/users", available: true },
  { id: "supervisors", label: "Supervisors", labelAr: "المشرفون", icon: "Shield", href: "/admin/supervisors", available: true },
  { id: "merchants", label: "Merchants", labelAr: "التجار", icon: "Building2", href: "/admin/merchants", available: false },
  { id: "properties", label: "Properties", labelAr: "العقارات", icon: "Home", href: "/properties", available: true },
  { id: "reviews", label: "Property Reviews", labelAr: "مراجعة العقارات", icon: "FileText", href: "/admin/reviews", available: false },
  { id: "leads", label: "Leads", labelAr: "العملاء المحتملون", icon: "MessageSquare", href: "/admin/leads", available: false },
  { id: "reports", label: "Reports", labelAr: "التقارير", icon: "BarChart", href: "/admin/reports", available: false },
  { id: "notifications", label: "Notifications", labelAr: "الإشعارات", icon: "Bell", href: "/admin/notifications", available: false },
  { id: "settings", label: "Settings", labelAr: "الإعدادات", icon: "Settings", href: "/admin/settings", available: false },
];
