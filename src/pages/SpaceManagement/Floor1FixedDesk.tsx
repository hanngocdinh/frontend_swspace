import { useState } from "react";
import { 
  Search, 
  Download, 
  Plus, 
  Edit,
  Video, 
  Users,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Filter,
  Maximize,
  Eye,
  Activity,
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { toast } from "sonner";

// ==================== FIXED DESK TYPES ====================
interface Seat {
  id: string;
  zone: string;
  status: "Available" | "Occupied" | "Reserved" | "Maintenance";
  user?: {
    name: string;
    email: string;
    phone: string;
  };
  booking?: {
    package: string;
    startDate: string;
    endDate: string;
    paymentStatus: "Paid" | "Pending" | "Overdue";
  };
}

interface AIStatus {
  cameraName: string;
  status: "online" | "offline";
  detectedPeople: number;
  lastUpdate: string;
}

// ==================== FIXED DESK DATA ====================
const fixedDeskSeats: Seat[] = [
  { 
    id: "FD-01", 
    zone: "Zone A", 
    status: "Occupied",
    user: { name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "0901234567" },
    booking: { 
      package: "Monthly Premium", 
      startDate: "2025-10-01", 
      endDate: "2025-11-01",
      paymentStatus: "Paid"
    }
  },
  { id: "FD-02", zone: "Zone A", status: "Available" },
  { 
    id: "FD-03", 
    zone: "Zone A", 
    status: "Reserved",
    user: { name: "Trần Thị B", email: "tranthib@email.com", phone: "0912345678" },
    booking: { 
      package: "Daily Pass", 
      startDate: "2025-10-21", 
      endDate: "2025-10-21",
      paymentStatus: "Pending"
    }
  },
  { id: "FD-04", zone: "Zone A", status: "Available" },
  { 
    id: "FD-05", 
    zone: "Zone A", 
    status: "Occupied",
    user: { name: "Lê Văn C", email: "levanc@email.com", phone: "0923456789" },
    booking: { 
      package: "Weekly Pass", 
      startDate: "2025-10-15", 
      endDate: "2025-10-22",
      paymentStatus: "Paid"
    }
  },
  { id: "FD-06", zone: "Zone B", status: "Available" },
  { id: "FD-07", zone: "Zone B", status: "Maintenance" },
  { id: "FD-08", zone: "Zone B", status: "Occupied",
    user: { name: "Phạm Thị D", email: "phamthid@email.com", phone: "0934567890" },
    booking: { 
      package: "Monthly Standard", 
      startDate: "2025-10-01", 
      endDate: "2025-11-01",
      paymentStatus: "Overdue"
    }
  },
  { id: "FD-09", zone: "Zone B", status: "Available" },
  { id: "FD-10", zone: "Zone B", status: "Reserved",
    user: { name: "Hoàng Văn E", email: "hoangvane@email.com", phone: "0945678901" },
    booking: { 
      package: "Daily Pass", 
      startDate: "2025-10-21", 
      endDate: "2025-10-21",
      paymentStatus: "Paid"
    }
  },
  { id: "FD-11", zone: "Zone C", status: "Available" },
  { id: "FD-12", zone: "Zone C", status: "Occupied",
    user: { name: "Vũ Thị F", email: "vuthif@email.com", phone: "0956789012" },
    booking: { 
      package: "Monthly Premium", 
      startDate: "2025-10-10", 
      endDate: "2025-11-10",
      paymentStatus: "Paid"
    }
  },
  { id: "FD-13", zone: "Zone C", status: "Available" },
  { id: "FD-14", zone: "Zone C", status: "Available" },
  { id: "FD-15", zone: "Zone C", status: "Occupied",
    user: { name: "Đỗ Văn G", email: "dovang@email.com", phone: "0967890123" },
    booking: { 
      package: "Weekly Pass", 
      startDate: "2025-10-17", 
      endDate: "2025-10-24",
      paymentStatus: "Paid"
    }
  },
];

const aiCameras: AIStatus[] = [
  {
    cameraName: "Main Entrance Camera",
    status: "online",
    detectedPeople: 8,
    lastUpdate: "1 min ago"
  },
  {
    cameraName: "Workspace Area 1",
    status: "online",
    detectedPeople: 12,
    lastUpdate: "2 mins ago"
  },
  {
    cameraName: "Workspace Area 2",
    status: "online",
    detectedPeople: 15,
    lastUpdate: "1 min ago"
  },
  {
    cameraName: "Back Area",
    status: "offline",
    detectedPeople: 0,
    lastUpdate: "15 mins ago"
  }
];

export default function Floor1FixedDesk() {
  const [searchSeat, setSearchSeat] = useState("");
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fixed Desk Stats
  const totalSeats = fixedDeskSeats.length;
  const occupiedSeats = fixedDeskSeats.filter(s => s.status === "Occupied").length;
  const reservedSeats = fixedDeskSeats.filter(s => s.status === "Reserved").length;
  const availableSeats = fixedDeskSeats.filter(s => s.status === "Available").length;
  const maintenanceSeats = fixedDeskSeats.filter(s => s.status === "Maintenance").length;

  // Filter Fixed Desk seats
  const filteredSeats = fixedDeskSeats.filter(seat => {
    const matchesSearch = seat.id.toLowerCase().includes(searchSeat.toLowerCase()) ||
                         seat.zone.toLowerCase().includes(searchSeat.toLowerCase());
    const matchesStatus = statusFilter === "all" || seat.status === statusFilter;
    const matchesZone = zoneFilter === "all" || seat.zone === zoneFilter;
    return matchesSearch && matchesStatus && matchesZone;
  });

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };

  const handleMarkAsVacant = () => {
    toast.success(`Seat ${selectedSeat?.id} marked as vacant`);
    setSelectedSeat(null);
  };

  const handleCancelBooking = () => {
    toast.success(`Booking for ${selectedSeat?.id} has been canceled`);
    setSelectedSeat(null);
  };

  const handleExportReport = () => {
    toast.success("Exporting report...");
  };

  return (
    <>
      {/* Stats Cards - Fixed Desk */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] bg-gray-100 rounded-[12px] flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"/>
                <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"/>
              </svg>
            </div>
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Total Seats</p>
              <p className="text-[28px] font-semibold text-[#021526]">{totalSeats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] bg-green-50 rounded-[12px] flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Available</p>
              <p className="text-[28px] font-semibold text-[#021526]">{availableSeats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] bg-blue-50 rounded-[12px] flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Occupied</p>
              <p className="text-[28px] font-semibold text-[#021526]">{occupiedSeats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] bg-orange-50 rounded-[12px] flex items-center justify-center">
              <Clock className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Reserved</p>
              <p className="text-[28px] font-semibold text-[#021526]">{reservedSeats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] bg-red-50 rounded-[12px] flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Maintenance</p>
              <p className="text-[28px] font-semibold text-[#021526]">{maintenanceSeats}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Status & Activity Log Row */}
      <div className="grid grid-cols-[1fr_400px] gap-6 mb-6">
        {/* AI Status Panel */}
        <Card className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-[48px] h-[48px] bg-purple-50 rounded-[12px] flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-[#021526]">AI Occupancy Detection</h3>
                <p className="text-[13px] text-gray-600">Real-time monitoring status</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[12px] text-gray-600">Cameras Active</span>
              </div>
              <p className="text-[24px] font-semibold text-[#021526]">3/4</p>
            </div>

            <div className="bg-gray-50 rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3 h-3 text-gray-600" />
                <span className="text-[12px] text-gray-600">Last Detection</span>
              </div>
              <p className="text-[24px] font-semibold text-[#021526]">2m</p>
              <p className="text-[11px] text-gray-500">ago</p>
            </div>

            <div className="bg-gray-50 rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3 h-3 text-gray-600" />
                <span className="text-[12px] text-gray-600">Detected Seats</span>
              </div>
              <p className="text-[24px] font-semibold text-[#021526]">{occupiedSeats}</p>
              <p className="text-[11px] text-gray-500">{Math.round((occupiedSeats/totalSeats)*100)}% occupied</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-gray-600">Camera Zone A</span>
              <Badge className="bg-green-100 text-green-700 border-0 text-[11px]">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-[13px] mt-2">
              <span className="text-gray-600">Camera Zone B</span>
              <Badge className="bg-green-100 text-green-700 border-0 text-[11px]">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-[13px] mt-2">
              <span className="text-gray-600">Camera Zone C</span>
              <Badge className="bg-green-100 text-green-700 border-0 text-[11px]">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-[13px] mt-2">
              <span className="text-gray-600">Camera Entrance</span>
              <Badge className="bg-red-100 text-red-700 border-0 text-[11px]">Offline</Badge>
            </div>
          </div>
        </Card>

        {/* Activity Log */}
        <Card className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[18px] font-semibold text-[#021526]">Recent Activities</h3>
            <Button variant="ghost" size="sm" className="text-[#317752] hover:text-[#2a6545] text-[13px]">
              View All
            </Button>
          </div>

          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-green-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Trần Thị B reserved seat FD-03</p>
                <p className="text-[11px] text-gray-500 mt-1">09:15</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-orange-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Camera Zone A detected occupancy change</p>
                <p className="text-[11px] text-gray-500 mt-1">09:20</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-red-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Payment overdue alert for FD-08</p>
                <p className="text-[11px] text-gray-500 mt-1">09:25</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-blue-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Lê Văn C checked out (FD-05)</p>
                <p className="text-[11px] text-gray-500 mt-1">09:30</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-green-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Nguyễn Văn A checked in (FD-01)</p>
                <p className="text-[11px] text-gray-500 mt-1">08:45</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-orange-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Seat FD-07 marked as maintenance by AI</p>
                <p className="text-[11px] text-gray-500 mt-1">08:30</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content - Seat Map + Sidebar */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Seat Map */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-semibold text-[#021526]">Seat Map Layout</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`rounded-[10px] px-4 h-[36px] ${showFilters ? 'bg-gray-100' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                className="rounded-[10px] px-4 h-[36px] border-gray-300 bg-gray-50 hover:bg-gray-100"
              >
                <Maximize className="w-4 h-4 mr-2" />
                FullScreen
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-50 rounded-[12px] p-4 mb-5">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[12px] text-gray-600 mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-[36px] rounded-[8px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Occupied">Occupied</SelectItem>
                      <SelectItem value="Reserved">Reserved</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[12px] text-gray-600 mb-2 block">Zone</label>
                  <Select value={zoneFilter} onValueChange={setZoneFilter}>
                    <SelectTrigger className="h-[36px] rounded-[8px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      <SelectItem value="Zone A">Zone A</SelectItem>
                      <SelectItem value="Zone B">Zone B</SelectItem>
                      <SelectItem value="Zone C">Zone C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[12px] text-gray-600 mb-2 block">Quick Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="e.g., FD-02"
                      value={searchSeat}
                      onChange={(e) => setSearchSeat(e.target.value)}
                      className="pl-9 h-[36px] rounded-[8px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Floor Plan */}
          <div className="relative bg-gray-50 rounded-[16px] overflow-hidden border-2 border-gray-200 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=900&fit=crop"
              alt="Floor Plan"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-400 rounded-[6px]"></div>
              <span className="text-[14px] text-gray-700">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-400 rounded-[6px]"></div>
              <span className="text-[14px] text-gray-700">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-[6px]"></div>
              <span className="text-[14px] text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-400 rounded-[6px]"></div>
              <span className="text-[14px] text-gray-700">Maintenance</span>
            </div>
          </div>
        </div>

        {/* Seat List Sidebar */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-[18px] font-semibold text-[#021526] mb-5">Select Seat</h3>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search seat..."
              value={searchSeat}
              onChange={(e) => setSearchSeat(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 rounded-[10px] h-[42px]"
            />
          </div>

          {/* Seat List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredSeats.map((seat) => (
              <div
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                className="flex items-center justify-between p-4 rounded-[12px] border border-gray-200 hover:border-[#317752] hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div>
                  <p className="text-[14px] font-semibold text-[#021526]">{seat.id}</p>
                  <p className="text-[12px] text-gray-500">{seat.zone}</p>
                </div>
                <Badge className={`${
                  seat.status === "Available" ? "bg-gray-100 text-gray-700" :
                  seat.status === "Occupied" ? "bg-blue-100 text-blue-700" :
                  seat.status === "Reserved" ? "bg-orange-100 text-orange-700" :
                  "bg-red-100 text-red-700"
                } border-0`}>
                  {seat.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seat Detail Sheet */}
      <Sheet open={!!selectedSeat} onOpenChange={() => setSelectedSeat(null)}>
        <SheetContent className="w-[500px] rounded-l-[20px]">
          <SheetHeader>
            <SheetTitle className="text-[22px] font-semibold">
              Seat {selectedSeat?.id}
            </SheetTitle>
          </SheetHeader>

          {selectedSeat && (
            <div className="mt-6 space-y-6">
              <div className="bg-gray-50 rounded-[12px] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-gray-600">Status</span>
                  <Badge className={`${
                    selectedSeat.status === "Available" ? "bg-gray-100 text-gray-700" :
                    selectedSeat.status === "Occupied" ? "bg-blue-100 text-blue-700" :
                    selectedSeat.status === "Reserved" ? "bg-orange-100 text-orange-700" :
                    "bg-red-100 text-red-700"
                  } border-0`}>
                    {selectedSeat.status}
                  </Badge>
                </div>
              </div>

              {selectedSeat.user && (
                <>
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#021526] mb-3">User Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-[14px] text-gray-700">{selectedSeat.user.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-[14px] text-gray-700">{selectedSeat.user.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-[14px] text-gray-700">{selectedSeat.user.phone}</span>
                      </div>
                    </div>
                  </div>

                  {selectedSeat.booking && (
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#021526] mb-3">Booking Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-[13px] text-gray-600">Package</span>
                          <span className="text-[13px] font-medium text-[#021526]">{selectedSeat.booking.package}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[13px] text-gray-600">Period</span>
                          <span className="text-[13px] font-medium text-[#021526]">
                            {selectedSeat.booking.startDate} - {selectedSeat.booking.endDate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[13px] text-gray-600">Payment</span>
                          <Badge className={`${
                            selectedSeat.booking.paymentStatus === "Paid" ? "bg-green-100 text-green-700" :
                            selectedSeat.booking.paymentStatus === "Pending" ? "bg-orange-100 text-orange-700" :
                            "bg-red-100 text-red-700"
                          } border-0 text-[11px]`}>
                            {selectedSeat.booking.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-4">
                    <Button
                      className="w-full bg-[#317752] hover:bg-[#2a6545] text-white rounded-[10px]"
                      onClick={handleMarkAsVacant}
                    >
                      Mark as Vacant
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-[10px] border-red-300 text-red-600 hover:bg-red-50"
                      onClick={handleCancelBooking}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </>
              )}

              {!selectedSeat.user && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">This seat is available</p>
                  <Button className="bg-[#317752] hover:bg-[#2a6545] text-white rounded-[10px]">
                    Assign User
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
