import { useState } from "react";
import { 
  Search, Plus, Edit, Trash2, Eye, Ban, CheckCircle, Mail, Phone, Calendar, 
  Filter, Download, Shield, Users
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { toast } from "sonner";

import type { User } from "./UserManagement";
import { usersApi } from "../../api/usersApi";

type Props = { users: User[]; reload?: () => Promise<void> | void; loading?: boolean };

export default function AdminManage({ users, reload, loading }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isViewUserDialogOpen, setIsViewUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading] = useState(false);

  const itemsPerPage = 8;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatCurrency = (amount: number) => `${(amount || 0).toLocaleString('vi-VN')} đ`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("vi-VN");
  const getInitials = (name: string | null) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) return parts[0][0] + parts[parts.length - 1][0];
    return name.substring(0, 2);
  };

  const handleViewUser = (user: User) => { setSelectedUser(user); setIsViewUserDialogOpen(true); };
  const handleEditUser = (user: User) => { setSelectedUser(user); toast.info(`Opening edit form for ${user.full_name || user.email}`); };
  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    if (!reload) {
      // mock mode: just toast
      toast.success(`${user.full_name || user.email} has been ${nextStatus === "active" ? "activated" : "deactivated"}`);
      return;
    }
    try {
      await usersApi.updateStatus(user.id, nextStatus as any);
      toast.success(`${user.full_name || user.email} has been ${nextStatus === "active" ? "activated" : "deactivated"}`);
      await Promise.resolve(reload());
    } catch (e: any) {
      toast.error(e?.message || "Failed to update status");
    }
  };
  const handleDeleteUser = (user: User) => { setSelectedUser(user); setIsDeleteDialogOpen(true); };
  const confirmDelete = async () => {
    if (!selectedUser) return;
    if (!reload) {
      // mock mode
      toast.success(`User ${selectedUser.full_name || selectedUser.email} has been deleted`);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      return;
    }
    try {
      await usersApi.remove(selectedUser.id);
      toast.success(`User ${selectedUser.full_name || selectedUser.email} has been deleted`);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      await Promise.resolve(reload());
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete user");
    }
  };
  const handleAddUser = () => setIsAddUserDialogOpen(true);
  const handleExportUsers = () => toast.success("Exporting user data...");

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div className="invisible" aria-hidden>
          <h2 className="text-[28px]">Admin</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-[10px] px-4 h-[40px] border-gray-300" onClick={handleExportUsers}>
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
          <Button className="bg-[#317752] hover:bg-[#2a6545] text-white rounded-[10px] px-4 h-[40px]" onClick={handleAddUser}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Admin
          </Button>
        </div>
      </div>

      <Card className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search by name, email or user ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-gray-50 border-gray-200 rounded-[10px] h-[42px]" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-[42px] rounded-[10px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className={`rounded-[10px] px-4 h-[42px] ${showFilters ? "bg-gray-100" : ""}`} onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-[12px] p-4 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-[13px] text-gray-600 mb-2 block">Created Date From</Label>
                <Input type="date" className="h-[38px] rounded-[8px]" />
              </div>
              <div>
                <Label className="text-[13px] text-gray-600 mb-2 block">Created Date To</Label>
                <Input type="date" className="h-[38px] rounded-[8px]" />
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full h-[38px] rounded-[8px]">Apply Filters</Button>
              </div>
            </div>
          </div>
        )}

        {isLoading || loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#317752] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-[14px] mt-3">Loading admins...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-[14px]">No admins found</p>
            <p className="text-gray-400 text-[12px] mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="rounded-[12px] border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[13px] w-[80px]">User ID</TableHead>
                    <TableHead className="text-[13px]">Full Name</TableHead>
                    <TableHead className="text-[13px]">Contact</TableHead>
                    <TableHead className="text-[13px]">Created Date</TableHead>
                    <TableHead className="text-[13px]">Status</TableHead>
                    <TableHead className="text-[13px] text-center">Total Bookings</TableHead>
                    <TableHead className="text-[13px]">Total Payments</TableHead>
                    <TableHead className="text-[13px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id} className={`hover:bg-gray-50 ${user.status === "inactive" ? "opacity-50" : ""}`}>
                      <TableCell className="text-[13px]">#{user.id}</TableCell>
                      <TableCell>
                      <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-[#317752] text-white text-[12px]">{getInitials(user.full_name)}</AvatarFallback>
                          </Avatar>
                          <span className="text-[13px] text-[#021526]">{user.full_name || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[12px] text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-[12px] text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-[13px] text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(user.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"} border-0 text-[11px]`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-[13px] text-[#021526] font-medium">{user.total_bookings || 0}</span>
                      </TableCell>
                      <TableCell className="text-[13px]">{formatCurrency(user.total_payments || 0)}</TableCell>
                      <TableCell className="text-right">
            <TooltipProvider delayDuration={150}>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors group" onClick={() => handleViewUser(user)}>
                      <Eye className="w-[18px] h-[18px] text-gray-500 group-hover:text-gray-700" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-gray-900 text-white text-[11px] px-2 py-1">View Details</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 transition-colors group" onClick={() => handleEditUser(user)}>
                      <Edit className="w-[18px] h-[18px] text-blue-500 group-hover:text-blue-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-gray-900 text-white text-[11px] px-2 py-1">Edit Admin</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 transition-colors group ${user.status === "active" ? "hover:bg-orange-50" : "hover:bg-green-50"}`} onClick={() => handleToggleStatus(user)}>
                                  {user.status === "active" ? (
                                    <Ban className="w-[18px] h-[18px] text-orange-500 group-hover:text-orange-600" />
                                  ) : (
                                    <CheckCircle className="w-[18px] h-[18px] text-green-500 group-hover:text-green-600" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-gray-900 text-white text-[11px] px-2 py-1">{user.status === "active" ? "Deactivate" : "Activate"}</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50 transition-colors group" onClick={() => handleDeleteUser(user)}>
                      <Trash2 className="w-[18px] h-[18px] text-red-500 group-hover:text-red-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-gray-900 text-white text-[11px] px-2 py-1">Delete Admin</TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-[13px] text-gray-600">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} admins</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9 px-3 rounded-[8px]" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Previous</Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" className={`h-9 w-9 rounded-[8px] ${currentPage === pageNum ? "bg-[#317752] hover:bg-[#2a6545] text-white" : ""}`} onClick={() => setCurrentPage(pageNum)}>
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button variant="outline" size="sm" className="h-9 px-3 rounded-[8px]" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[20px]">Add New Admin</DialogTitle>
            <DialogDescription>Create a new admin account with the information below</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label className="text-[13px] text-gray-600 mb-2 block">Full Name</Label>
              <Input placeholder="Enter full name" className="h-[42px] rounded-[10px]" />
            </div>
            <div>
              <Label className="text-[13px] text-gray-600 mb-2 block">Email *</Label>
              <Input type="email" placeholder="email@example.com" className="h-[42px] rounded-[10px]" required />
            </div>
            <div>
              <Label className="text-[13px] text-gray-600 mb-2 block">Phone Number</Label>
              <Input placeholder="0901234567" className="h-[42px] rounded-[10px]" />
            </div>
            <div>
              <Label className="text-[13px] text-gray-600 mb-2 block">Password *</Label>
              <Input type="password" placeholder="Enter password" className="h-[42px] rounded-[10px]" required />
            </div>
            <div>
              <Label className="text-[13px] text-gray-600 mb-2 block">Confirm Password *</Label>
              <Input type="password" placeholder="Confirm password" className="h-[42px] rounded-[10px]" required />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-[10px]" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#317752] hover:bg-[#2a6545] text-white rounded-[10px]" onClick={() => { toast.success("New admin has been created successfully!"); setIsAddUserDialogOpen(false); }}>Create Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewUserDialogOpen} onOpenChange={setIsViewUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[20px]">Admin Details</DialogTitle>
            <DialogDescription>Complete information about the selected admin</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-[#317752] text-white text-[20px]">{getInitials(selectedUser.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-[18px] text-[#021526] mb-1">{selectedUser.full_name || selectedUser.email}</h3>
                  <Badge className="bg-purple-100 text-purple-700 border-0 text-[11px]">Admin</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><Label className="text-[12px] text-gray-500 mb-1 block">User ID</Label><p className="text-[14px] text-[#021526]">#{selectedUser.id}</p></div>
                <div>
                  <Label className="text-[12px] text-gray-500 mb-1 block">Status</Label>
                  <Badge className={`${selectedUser.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"} border-0 text-[11px]`}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </Badge>
                </div>
                <div><Label className="text-[12px] text-gray-500 mb-1 block">Email</Label><p className="text-[14px] text-[#021526]">{selectedUser.email}</p></div>
                <div><Label className="text-[12px] text-gray-500 mb-1 block">Phone Number</Label><p className="text-[14px] text-[#021526]">{selectedUser.phone || "N/A"}</p></div>
                <div><Label className="text-[12px] text-gray-500 mb-1 block">Created Date</Label><p className="text-[14px] text-[#021526]">{formatDate(selectedUser.created_at)}</p></div>
                <div><Label className="text-[12px] text-gray-500 mb-1 block">Last Updated</Label><p className="text-[14px] text-[#021526]">{formatDate(selectedUser.updated_at)}</p></div>
                <div><Label className="text-[12px] text-gray-500 mb-1 block">Total Bookings</Label><p className="text-[14px] text-[#021526]">{selectedUser.total_bookings || 0}</p></div>
                <div><Label className="text-[12px] text-gray-500 mb-1 block">Total Payments</Label><p className="text-[18px] text-[#317752]">{formatCurrency(selectedUser.total_payments || 0)}</p></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="rounded-[10px]" onClick={() => setIsViewUserDialogOpen(false)}>Close</Button>
            <Button className="bg-[#317752] hover:bg-[#2a6545] text-white rounded-[10px]" onClick={() => { setIsViewUserDialogOpen(false); if (selectedUser) handleEditUser(selectedUser); }}>Edit Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the admin account
              {selectedUser && ` "${selectedUser.full_name || selectedUser.email}"`} and all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 w-full flex items-center justify-end gap-3">
            <button type="button" className="rounded-[10px] h-10 px-5 border border-gray-300 bg-white text-gray-700" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</button>
            <button type="button" className="rounded-[10px] h-10 px-5 bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>Delete Admin</button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


