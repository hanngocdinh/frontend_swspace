import { useState } from "react";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Users, Shield, CheckCircle, Ban } from "lucide-react";

import AdminManage from "./AdminManage";
import UserManage from "./UserManage";
// using mock data locally

export interface User {
  id: number;
  email: string;
  phone: string | null;
  full_name: string | null;
  role: "user" | "admin";
  status: "active" | "inactive";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  total_bookings?: number;
  total_payments?: number;
}

const mockUsers: User[] = [
  { id: 1, email: "admin@swspace.com", phone: "0901234567", full_name: "Nguyễn Văn An", role: "admin", status: "active", avatar_url: null, created_at: "2024-01-15T08:00:00Z", updated_at: "2024-01-15T08:00:00Z", total_bookings: 45, total_payments: 25000000 },
  { id: 2, email: "admin.phuong@swspace.com", phone: "0956789012", full_name: "Vũ Thị Phương", role: "admin", status: "active", avatar_url: null, created_at: "2024-02-12T09:30:00Z", updated_at: "2024-02-12T09:30:00Z", total_bookings: 38, total_payments: 22100000 },
  { id: 3, email: "admin.minh@swspace.com", phone: "0912345678", full_name: "Trần Văn Minh", role: "admin", status: "active", avatar_url: null, created_at: "2024-03-05T10:00:00Z", updated_at: "2024-03-05T10:00:00Z", total_bookings: 28, total_payments: 15000000 },
  { id: 4, email: "admin.hai@swspace.com", phone: "0923456789", full_name: "Lê Thị Hải", role: "admin", status: "inactive", avatar_url: null, created_at: "2024-01-20T11:15:00Z", updated_at: "2024-10-15T14:30:00Z", total_bookings: 12, total_payments: 6800000 },
  { id: 5, email: "tranthib@email.com", phone: "0912345678", full_name: "Trần Thị Bình", role: "user", status: "active", avatar_url: null, created_at: "2024-02-20T07:45:00Z", updated_at: "2024-02-20T07:45:00Z", total_bookings: 32, total_payments: 18500000 },
  { id: 6, email: "levanc@email.com", phone: "0923456789", full_name: "Lê Văn Cường", role: "user", status: "active", avatar_url: null, created_at: "2024-03-10T08:20:00Z", updated_at: "2024-03-10T08:20:00Z", total_bookings: 28, total_payments: 15200000 },
  { id: 7, email: "phamthid@email.com", phone: "0934567890", full_name: "Phạm Thị Dung", role: "user", status: "inactive", avatar_url: null, created_at: "2024-01-25T09:00:00Z", updated_at: "2024-09-10T16:20:00Z", total_bookings: 12, total_payments: 6800000 },
  { id: 8, email: "hoangvane@email.com", phone: "0945678901", full_name: "Hoàng Văn Em", role: "user", status: "active", avatar_url: null, created_at: "2024-04-05T10:30:00Z", updated_at: "2024-04-05T10:30:00Z", total_bookings: 51, total_payments: 32400000 },
  { id: 9, email: "dovang@email.com", phone: "0967890123", full_name: "Đỗ Văn Giang", role: "user", status: "active", avatar_url: null, created_at: "2024-05-18T11:00:00Z", updated_at: "2024-05-18T11:00:00Z", total_bookings: 19, total_payments: 9800000 },
  { id: 10, email: "ngothih@email.com", phone: "0978901234", full_name: "Ngô Thị Hoa", role: "user", status: "inactive", avatar_url: null, created_at: "2024-03-22T08:45:00Z", updated_at: "2024-08-30T15:10:00Z", total_bookings: 8, total_payments: 4200000 },
  { id: 11, email: "buivani@email.com", phone: "0989012345", full_name: "Bùi Văn Ích", role: "user", status: "active", avatar_url: null, created_at: "2024-06-01T09:20:00Z", updated_at: "2024-06-01T09:20:00Z", total_bookings: 24, total_payments: 13500000 },
  { id: 12, email: "dinhthik@email.com", phone: "0990123456", full_name: "Đinh Thị Kim", role: "user", status: "active", avatar_url: null, created_at: "2024-04-28T10:15:00Z", updated_at: "2024-04-28T10:15:00Z", total_bookings: 35, total_payments: 19800000 },
  { id: 13, email: "caothim@email.com", phone: "0912233445", full_name: "Cao Thị Mai", role: "user", status: "active", avatar_url: null, created_at: "2024-05-05T11:30:00Z", updated_at: "2024-05-05T11:30:00Z", total_bookings: 42, total_payments: 24600000 },
  { id: 14, email: "maivanl@email.com", phone: "0901122334", full_name: "Mai Văn Long", role: "user", status: "active", avatar_url: null, created_at: "2024-06-15T08:00:00Z", updated_at: "2024-06-15T08:00:00Z", total_bookings: 29, total_payments: 16700000 },
  { id: 15, email: "phanvank@email.com", phone: "0934455667", full_name: "Phan Văn Khoa", role: "user", status: "inactive", avatar_url: null, created_at: "2024-02-10T09:45:00Z", updated_at: "2024-07-20T13:25:00Z", total_bookings: 6, total_payments: 3200000 },
];

type UserRole = "admin" | "user";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<UserRole>("admin");

  const usersInTab = mockUsers.filter((u) => u.role === activeTab);
  const totalUsers = usersInTab.length;
  const activeUsers = usersInTab.filter((u) => u.status === "active").length;
  const inactiveUsers = usersInTab.filter((u) => u.status === "inactive").length;

  return (
    <div className="p-8 overflow-auto h-full bg-[#F5F5F5]">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-[14px]">
          <span className="text-gray-500 hover:text-[#317752] cursor-pointer">Dashboard</span>
          <span className="text-gray-400">/</span>
          <span className="text-[#317752]">User Management</span>
        </div>
      </div>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[28px] text-[#021526] mb-2">User Management</h1>
          <p className="text-[15px] text-gray-600">Manage all user accounts and permissions</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white inline-flex rounded-[12px] p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-6 py-2.5 rounded-[10px] text-[14px] transition-all flex items-center gap-2 ${
              activeTab === "admin" ? "bg-[#317752] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={`px-6 py-2.5 rounded-[10px] text-[14px] transition-all flex items-center gap-2 ${
              activeTab === "user" ? "bg-[#317752] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4" />
            User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] bg-blue-50 rounded-[12px] flex items-center justify-center">
              {activeTab === "admin" ? (
                <Shield className="w-7 h-7 text-blue-600" />
              ) : (
                <Users className="w-7 h-7 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Total {activeTab === "admin" ? "Admins" : "Users"}</p>
              <p className="text-[28px] text-[#021526]">{totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] bg-green-50 rounded-[12px] flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Active</p>
              <p className="text-[28px] text-[#021526]">{activeUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] bg-red-50 rounded-[12px] flex items-center justify-center">
              <Ban className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Inactive</p>
              <p className="text-[28px] text-[#021526]">{inactiveUsers}</p>
            </div>
          </div>
        </Card>
      </div>

      {activeTab === "admin" ? (
        <AdminManage users={mockUsers.filter((u) => u.role === "admin")} />
      ) : (
        <UserManage users={mockUsers.filter((u) => u.role === "user")} />
      )}
    </div>
  );
}



