import { useState } from "react";
import { Search, Plus, Eye, Trash2, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";

interface ServicePackage {
  id: string;
  name: string;
  packageType: "Hot Desk" | "Fixed Desk";
  price: number;
  unit: "Day" | "Week" | "Month" | "Year";
  status: "Active" | "Paused";
  users: number;
  features: string[]; // changed from benefits
  description: string;
}

const initialPackages: ServicePackage[] = [
  {
    id: "1",
    name: "Hot Desk - Daily",
    packageType: "Hot Desk",
    price: 170000,
    unit: "Day",
    status: "Active",
    users: 35,
    description: "Flexible workspace for daily use",
    features: [ // changed from benefits
      "Check-in code",
      "High-speed Wi-Fi",
      "Free use of meeting rooms",
      "Document printing support",
      "Daily cleaning and maintenance service",
      "Complimentary drinks"
    ]
  },
  {
    id: "2",
    name: "Hot Desk - Monthly",
    packageType: "Hot Desk",
    price: 2500000,
    unit: "Month",
    status: "Active",
    users: 42,
    description: "Flexible workspace for monthly use",
    features: [
      "Check-in code",
      "High-speed Wi-Fi",
      "Free use of meeting rooms",
      "Document printing support",
      "Daily cleaning and maintenance service",
      "Complimentary drinks",
      "Priority booking"
    ]
  },
  {
    id: "3",
    name: "Fixed Desk - Daily",
    packageType: "Fixed Desk",
    price: 200000,
    unit: "Day",
    status: "Active",
    users: 28,
    description: "Dedicated desk for daily use",
    features: [
      "Personal dedicated desk",
      "Lockable drawer",
      "High-speed Wi-Fi",
      "Free use of meeting rooms"
    ]
  },
  {
    id: "4",
    name: "Fixed Desk - Monthly",
    packageType: "Fixed Desk",
    price: 3500000,
    unit: "Month",
    status: "Active",
    users: 56,
    description: "Dedicated desk for monthly use",
    features: [
      "Personal dedicated desk",
      "Lockable drawer",
      "High-speed Wi-Fi",
      "Free use of meeting rooms",
      "24/7 access",
      "Mail handling service"
    ]
  }
];

export default function FreelancePackagePage() {
  const [packages, setPackages] = useState<ServicePackage[]>(initialPackages);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Hot Desk" | "Fixed Desk">("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [formData, setFormData] = useState<Partial<ServicePackage>>({
    name: "",
    packageType: "Hot Desk",
    price: 0,
    unit: "Month",
    status: "Active",
    description: "",
    features: [] // changed from benefits
  });
  const [featuresText, setFeaturesText] = useState(""); // changed from benefitsText

  const activePackages = packages.filter(p => p.status === "Active").length;
  const pausedPackages = packages.filter(p => p.status === "Paused").length;
  const totalUsers = packages.reduce((sum, p) => sum + p.users, 0);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.price.toString().includes(searchQuery);
    const matchesType = filterType === "All" || pkg.packageType === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddPackage = () => {
    const newPackage: ServicePackage = {
      id: Date.now().toString(),
      name: formData.name || "",
      packageType: formData.packageType || "Hot Desk",
      price: formData.price || 0,
      unit: formData.unit || "Month",
      status: formData.status || "Active",
      users: 0,
      description: formData.description || "",
      features: featuresText.split("\n").filter(b => b.trim() !== "") // changed
    };
    setPackages([...packages, newPackage]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditPackage = () => {
    if (!selectedPackage) return;
    
    setPackages(packages.map(pkg =>
      pkg.id === selectedPackage.id
        ? {
            ...pkg,
            name: formData.name || pkg.name,
            packageType: formData.packageType || pkg.packageType,
            price: formData.price ?? pkg.price,
            unit: formData.unit || pkg.unit,
            status: formData.status || pkg.status,
            description: formData.description || pkg.description,
            features: featuresText.split("\n").filter(b => b.trim() !== "") // changed
          }
        : pkg
    ));
    resetForm();
    setIsEditModalOpen(false);
  };

  const handleDeletePackage = (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setPackages(packages.map(pkg =>
      pkg.id === id
        ? { ...pkg, status: pkg.status === "Active" ? "Paused" : "Active" }
        : pkg
    ));
  };

  const openEditModal = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      packageType: pkg.packageType,
      price: pkg.price,
      unit: pkg.unit,
      status: pkg.status,
      description: pkg.description,
      features: pkg.features // changed
    });
    setFeaturesText(pkg.features.join("\n")); // changed
    setIsEditModalOpen(true);
  };

  const openViewModal = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      packageType: "Hot Desk",
      price: 0,
      unit: "Month",
      status: "Active",
      description: "",
      features: []
    });
    setFeaturesText("");
    setSelectedPackage(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-8 overflow-auto h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#021526] mb-2">Freelance Packages</h1>
        <p className="text-gray-600">Manage Hot Desk and Fixed Desk packages for freelancers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] text-gray-600">Active Packages</span>
            <div className="w-10 h-10 bg-green-100 rounded-[10px] flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-[32px] font-semibold text-[#021526]">{activePackages}</p>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] text-gray-600">Paused Packages</span>
            <div className="w-10 h-10 bg-orange-100 rounded-[10px] flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-[32px] font-semibold text-[#021526]">{pausedPackages}</p>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] text-gray-600">Total Users</span>
            <div className="w-10 h-10 bg-blue-100 rounded-[10px] flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-[32px] font-semibold text-[#021526]">{totalUsers}</p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-[10px] h-[44px]"
              />
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200 rounded-[10px] h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Hot Desk">Hot Desk</SelectItem>
                <SelectItem value="Fixed Desk">Fixed Desk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={openAddModal}
            className="bg-[#317752] hover:bg-[#2a6545] text-white rounded-[10px] h-[44px] px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Package
          </Button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-[24px] p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative"
          >
            {/* Package Header with Badges */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-[24px] font-semibold text-[#021526]">{pkg.packageType}</h3>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-4 py-1.5 rounded-full text-[13px] font-medium ${
                  pkg.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {pkg.status}
                </span>
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[13px] font-medium">
                  {pkg.users} Users
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-[32px] font-semibold text-[#021526]">
                đ{pkg.price.toLocaleString()}/{pkg.unit.toLowerCase()}
              </p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <p className="text-[14px] font-medium text-[#021526] mb-3">Features:</p> {/* changed */}
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (  // changed
                  <li key={index} className="text-[13px] text-gray-700 flex items-start gap-2">
                    <span className="text-[#021526] mt-0.5">•</span>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal(pkg)}
                className="flex-1 rounded-[10px] border-gray-300 h-[38px]"
              >
                <Edit className="w-4 h-4 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(pkg.id)}
                className={`flex-1 rounded-[10px] h-[38px] ${
                  pkg.status === "Active" 
                    ? "border-gray-300 text-gray-700" 
                    : "border-green-300 text-green-700"
                }`}
              >
                {pkg.status === "Active" ? "Paused" : "Active"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openViewModal(pkg)}
                className="rounded-[10px] border-gray-300 h-[38px] w-[38px] p-0"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeletePackage(pkg.id)}
                className="rounded-[10px] border-red-300 text-red-600 hover:bg-red-50 h-[38px] w-[38px] p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No packages found</p>
        </div>
      )}

      {/* Add Package Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-[500px] rounded-[16px]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold">Add New Freelance Package</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="package-type">Package Type</Label>
              <Select
                value={formData.packageType}
                onValueChange={(value: any) => setFormData({ ...formData, packageType: value })}
              >
                <SelectTrigger className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hot Desk">Hot Desk</SelectItem>
                  <SelectItem value="Fixed Desk">Fixed Desk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                placeholder="e.g., Hot Desk - Monthly"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (VND)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px]"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value: any) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Week">Week</SelectItem>
                    <SelectItem value="Month">Month</SelectItem>
                    <SelectItem value="Year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the package..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px] min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="features">Features (one per line)</Label> {/* changed */}
              <Textarea
                id="features"
                placeholder="High-speed Wi-Fi&#10;Free coffee&#10;Meeting rooms"
                value={featuresText} /* changed */
                onChange={(e) => setFeaturesText(e.target.value)} /* changed */
                className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px] min-h-[120px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="status">Status</Label>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-gray-600">
                  {formData.status === "Active" ? "Active" : "Paused"}
                </span>
                <Switch
                  checked={formData.status === "Active"}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked ? "Active" : "Paused" })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 rounded-[10px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPackage}
              className="flex-1 bg-[#317752] hover:bg-[#2a6545] text-white rounded-[10px]"
            >
              Add Package
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Package Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[500px] rounded-[16px]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold">Edit Freelance Package</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-package-type">Package Type</Label>
              <Select
                value={formData.packageType}
                onValueChange={(value: any) => setFormData({ ...formData, packageType: value })}
              >
                <SelectTrigger className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hot Desk">Hot Desk</SelectItem>
                  <SelectItem value="Fixed Desk">Fixed Desk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-name">Package Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter service package name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (VND)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  placeholder="0"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px]"
                />
              </div>
              <div>
                <Label htmlFor="edit-unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value: any) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Week">Week</SelectItem>
                    <SelectItem value="Month">Month</SelectItem>
                    <SelectItem value="Year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe the package..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px] min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="edit-features">Features (one per line)</Label> {/* changed */}
              <Textarea
                id="edit-features"
                placeholder="High-speed Wi-Fi&#10;Free coffee&#10;Meeting rooms"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className="mt-1.5 bg-gray-50 border-gray-200 rounded-[10px] min-h-[120px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-status">Status</Label>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-gray-600">
                  {formData.status === "Active" ? "Active" : "Paused"}
                </span>
                <Switch
                  checked={formData.status === "Active"}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked ? "Active" : "Paused" })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 rounded-[10px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditPackage}
              className="flex-1 bg-[#317752] hover:bg-[#2a6545] text-white rounded-[10px]"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Package Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-[500px] rounded-[16px]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold">Package Details</DialogTitle>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 rounded-[12px] p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[18px] font-semibold text-[#021526]">{selectedPackage.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-[12px] ${
                    selectedPackage.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {selectedPackage.status}
                  </span>
                </div>
                <span className="text-[13px] text-gray-600 bg-white px-2 py-1 rounded">
                  {selectedPackage.packageType}
                </span>
              </div>

              <div>
                <Label className="text-gray-600">Price</Label>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[28px] font-semibold text-[#317752]">
                    {selectedPackage.price.toLocaleString()}
                  </span>
                  <span className="text-[14px] text-gray-600">VND / {selectedPackage.unit}</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-600">Active Users</Label>
                <p className="mt-1 text-[16px] font-medium">{selectedPackage.users}</p>
              </div>

              <div>
                <Label className="text-gray-600">Description</Label>
                <p className="mt-1 text-[14px] text-gray-700">{selectedPackage.description}</p>
              </div>

              <div>
                <Label className="text-gray-600">Features</Label> {/* changed */}
                <ul className="mt-2 space-y-2">
                  {selectedPackage.features.map((feature, index) => ( // changed
                    <li key={index} className="flex items-start gap-2 text-[14px] text-gray-700">
                      <span className="text-[#317752] mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={() => setIsViewModalOpen(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-[10px]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
