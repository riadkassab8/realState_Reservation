import { useMemo } from "react";
import { getAllProperties } from "./propertyManager";
import { getAllUsers, type ExtendedUser } from "./userManager";
import type { Property } from "@workspace/api-client-react";

// Admin KPI Stats
export interface AdminKPIStats {
  totalUsers: number;
  activeUsers: number;
  totalMerchants: number;
  activeMerchants: number;
  totalProperties: number;
  publishedProperties: number;
  pendingProperties: number;
  totalLeads: number;
}

export function useAdminKPIs(): AdminKPIStats {
  return useMemo(() => {
    // Users: From userManager (demo + admin-created)
    const allUsers = getAllUsers();
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter((u: ExtendedUser) => u.status === "active").length;

    // Merchants: Users with MERCHANT role
    const totalMerchants = allUsers.filter((u: ExtendedUser) => u.role === "MERCHANT").length;
    const activeMerchants = allUsers.filter((u: ExtendedUser) => u.role === "MERCHANT" && u.status === "active").length;

    // Properties: From real data (mock + admin-created)
    const allProperties = getAllProperties();
    const totalProperties = allProperties.length;
    const publishedProperties = allProperties.filter((p: Property) => p.featured).length;
    // Note: No status field exists, so pending is 0
    const pendingProperties = 0;

    // Leads: No leads data exists
    const totalLeads = 0;

    return {
      totalUsers,
      activeUsers,
      totalMerchants,
      activeMerchants,
      totalProperties,
      publishedProperties,
      pendingProperties,
      totalLeads,
    };
  }, []);
}

// Performance Chart Data
export interface PerformanceDataPoint {
  date: string;
  users: number;
  properties: number;
  leads: number;
}

export function useAdminPerformanceData(timeRange: string): PerformanceDataPoint[] {
  return useMemo(() => {
    const allProperties = getAllProperties();
    const allUsers = getAllUsers().length;
    const allLeads = 0; // No leads data

    // For now, show current values across time range
    // In a real implementation, this would show historical data
    const dataPoints: PerformanceDataPoint[] = [];
    
    const ranges: Record<string, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };
    
    const days = ranges[timeRange] || 30;
    
    for (let i = 0; i < days; i += Math.ceil(days / 7)) {
      dataPoints.push({
        date: `Day ${i + 1}`,
        users: allUsers,
        properties: allProperties.length,
        leads: allLeads,
      });
    }
    
    return dataPoints;
  }, [timeRange]);
}

// Property Status Overview
export interface PropertyStatus {
  status: string;
  statusAr: string;
  count: number;
  percentage: number;
  color: string;
}

export function useAdminPropertyStatuses(): PropertyStatus[] {
  return useMemo(() => {
    const allProperties = getAllProperties();
    const total = allProperties.length;
    const featured = allProperties.filter((p: Property) => p.featured).length;
    const notFeatured = total - featured;
    
    return [
      {
        status: "Published",
        statusAr: "منشور",
        count: total,
        percentage: 100,
        color: "bg-green-500",
      },
      {
        status: "Featured",
        statusAr: "مميز",
        count: featured,
        percentage: total > 0 ? Math.round((featured / total) * 100) : 0,
        color: "bg-blue-500",
      },
      {
        status: "Standard",
        statusAr: "عادي",
        count: notFeatured,
        percentage: total > 0 ? Math.round((notFeatured / total) * 100) : 0,
        color: "bg-gray-500",
      },
    ];
  }, []);
}

// Recent Users
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPERVISOR" | "USER" | "MERCHANT";
  status: "active" | "inactive" | "suspended";
  joinDate: string;
}

export function useAdminUsers(): AdminUser[] {
  return useMemo(() => {
    const allUsers = getAllUsers();
    return allUsers.map((u: ExtendedUser) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      joinDate: new Date(u.createdAt).toISOString().split("T")[0],
    }));
  }, []);
}

// Recent Merchants
export interface AdminMerchant {
  id: string;
  name: string;
  email: string;
  properties: number;
  status: "active" | "inactive" | "suspended";
  joined: string;
}

export function useAdminMerchants(): AdminMerchant[] {
  return useMemo(() => {
    // Merchants are users with MERCHANT role
    const allUsers = getAllUsers();
    const merchants = allUsers
      .filter((u: ExtendedUser) => u.role === "MERCHANT")
      .map((u: ExtendedUser) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        properties: 0, // No way to track which properties belong to which merchant
        status: u.status,
        joined: new Date(u.createdAt).toISOString().split("T")[0],
      }));
    
    return merchants;
  }, []);
}

// Review Queue
export interface ReviewQueueItem {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  priority: "high" | "medium" | "low";
  count: number;
  action: string;
  actionAr: string;
}

export function useAdminReviewQueue(): ReviewQueueItem[] {
  return useMemo(() => {
    // No real review queue data exists
    // Return empty array to show "no items" state
    return [];
  }, []);
}

// Recent Activity
export interface ActivityItem {
  id: string;
  description: string;
  descriptionAr: string;
  icon: string;
  timestamp: string;
  actor?: string;
}

export function useAdminActivity(): ActivityItem[] {
  return useMemo(() => {
    // Derive activity from property creation timestamps
    const allProperties = getAllProperties();
    const activities: ActivityItem[] = allProperties.slice(0, 5).map((prop: Property, idx: number) => ({
      id: `activity-${idx}`,
      description: `Property "${prop.title}" was added`,
      descriptionAr: `تمت إضافة العقار "${prop.titleAr}"`,
      icon: "Building2",
      timestamp: prop.createdAt || new Date().toISOString(),
    }));
    
    return activities;
  }, []);
}

// System Health
export interface SystemHealthItem {
  service: string;
  serviceAr: string;
  status: "operational" | "degraded" | "down";
}

export function useAdminSystemHealth(): SystemHealthItem[] {
  return useMemo(() => {
    // Show real frontend-only states
    return [
      {
        service: "Frontend",
        serviceAr: "الواجهة الأمامية",
        status: "operational",
      },
      {
        service: "Authentication",
        serviceAr: "المصادقة",
        status: "operational",
      },
      {
        service: "Data Source",
        serviceAr: "مصدر البيانات",
        status: "operational",
      },
      {
        service: "Backend API",
        serviceAr: "واجهة برمجة التطبيقات",
        status: "down", // No real backend exists
      },
    ];
  }, []);
}
