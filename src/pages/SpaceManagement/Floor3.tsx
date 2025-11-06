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
  AlertCircle,
  Building2,
  DoorOpen,
  Calendar
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { toast } from "sonner";

// ==================== ROOM TYPES ====================
interface Space {
  id: string;
  type: "Event Hall" | "Conference Area" | "Open Networking Zone";
  zone: string;
  capacity: number;
  status: "Available" | "Occupied" | "Reserved" | "Maintenance";
  user?: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  booking?: {
    package: string;
    startDate: string;
    endDate: string;
    paymentStatus: "Paid" | "Pending" | "Overdue";
    eventTitle?: string;
  };
}

interface AIStatus {
  cameraName: string;
  status: "online" | "offline";
  detectedPeople: number;
  lastUpdate: string;
}

// ==================== FLOOR 3 DATA ====================
const floor3Spaces: Space[] = [
  // Event Halls
  { 
    id: "EH-301", 
    type: "Event Hall", 
    zone: "Main Hall", 
    capacity: 200,
    status: "Occupied",
    user: { name: "Nguyễn Thị A", email: "nguyenthia@email.com", phone: "0901234567", company: "Tech Conference Ltd" },
    booking: { 
      package: "Full Day Event", 
      startDate: "2025-10-21 08:00", 
      endDate: "2025-10-21 18:00",
      paymentStatus: "Paid",
      eventTitle: "Annual Tech Summit 2025"
    }
  },
  { 
    id: "EH-302", 
    type: "Event Hall", 
    zone: "East Wing", 
    capacity: 150,
    status: "Reserved",
    user: { name: "Trần Văn B", email: "tranvanb@email.com", phone: "0912345678", company: "Business Solutions" },
    booking: { 
      package: "Half Day Event", 
      startDate: "2025-10-22 09:00", 
      endDate: "2025-10-22 13:00",
      paymentStatus: "Pending",
      eventTitle: "Product Launch Event"
    }
  },
  { id: "EH-303", type: "Event Hall", zone: "West Wing", capacity: 100, status: "Available" },
  { id: "EH-304", type: "Event Hall", zone: "North Wing", capacity: 80, status: "Maintenance" },
  
  // Conference Areas
  { 
    id: "CA-401", 
    type: "Conference Area", 
    zone: "Central Area", 
    capacity: 50,
    status: "Occupied",
    user: { name: "Lê Thị C", email: "lethic@email.com", phone: "0923456789", company: "Startup Hub" },
    booking: { 
      package: "Weekly Conference", 
      startDate: "2025-10-20", 
      endDate: "2025-10-27",
      paymentStatus: "Paid"
    }
  },
  { id: "CA-402", type: "Conference Area", zone: "Central Area", capacity: 40, status: "Available" },
  { 
    id: "CA-403", 
    type: "Conference Area", 
    zone: "South Wing", 
    capacity: 60,
    status: "Reserved",
    user: { name: "Phạm Văn D", email: "phamvand@email.com", phone: "0934567890", company: "Innovation Lab" },
    booking: { 
      package: "Daily Conference", 
      startDate: "2025-10-21", 
      endDate: "2025-10-21",
      paymentStatus: "Paid"
    }
  },
  { id: "CA-404", type: "Conference Area", zone: "South Wing", capacity: 45, status: "Available" },
  
  // Open Networking Zones
  { 
    id: "ONZ-501", 
    type: "Open Networking Zone", 
    zone: "Lounge Area", 
    capacity: 30,
    status: "Occupied",
    user: { name: "Hoàng Thị E", email: "hoangthie@email.com", phone: "0945678901", company: "Networking Club" },
    booking: { 
      package: "Monthly Access", 
      startDate: "2025-10-01", 
      endDate: "2025-11-01",
      paymentStatus: "Paid"
    }
  },
  { id: "ONZ-502", type: "Open Networking Zone", zone: "Lounge Area", capacity: 25, status: "Available" },
  { id: "ONZ-503", type: "Open Networking Zone", zone: "Café Area", capacity: 35, status: "Available" },
  { id: "ONZ-504", type: "Open Networking Zone", zone: "Café Area", capacity: 30, status: "Occupied",
    user: { name: "Vũ Văn F", email: "vuvanf@email.com", phone: "0956789012", company: "Entrepreneur Circle" },
    booking: { 
      package: "Weekly Access", 
      startDate: "2025-10-15", 
      endDate: "2025-10-22",
      paymentStatus: "Paid"
    }
  },
  { id: "ONZ-505", type: "Open Networking Zone", zone: "Terrace Area", capacity: 40, status: "Available" },
  { id: "ONZ-506", type: "Open Networking Zone", zone: "Terrace Area", capacity: 35, status: "Reserved",
    user: { name: "Đỗ Thị G", email: "dothig@email.com", phone: "0967890123", company: "Business Network" },
    booking: { 
      package: "Daily Access", 
      startDate: "2025-10-21", 
      endDate: "2025-10-21",
      paymentStatus: "Pending"
    }
  },
];

const aiCameras: AIStatus[] = [
  {
    cameraName: "Main Hall Camera",
    status: "online",
    detectedPeople: 182,
    lastUpdate: "1 min ago"
  },
  {
    cameraName: "Central Area Camera",
    status: "online",
    detectedPeople: 48,
    lastUpdate: "2 mins ago"
  },
  {
    cameraName: "Lounge Area Camera",
    status: "online",
    detectedPeople: 28,
    lastUpdate: "1 min ago"
  },
  {
    cameraName: "Café Area Camera",
    status: "online",
    detectedPeople: 32,
    lastUpdate: "1 min ago"
  },
  {
    cameraName: "Terrace Area Camera",
    status: "offline",
    detectedPeople: 0,
    lastUpdate: "20 mins ago"
  }
];

export default function Floor3() {
  const [searchSpace, setSearchSpace] = useState("");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Space Stats
  const totalSpaces = floor3Spaces.length;
  const eventHalls = floor3Spaces.filter(s => s.type === "Event Hall").length;
  const conferenceAreas = floor3Spaces.filter(s => s.type === "Conference Area").length;
  const networkingZones = floor3Spaces.filter(s => s.type === "Open Networking Zone").length;
  const occupiedSpaces = floor3Spaces.filter(s => s.status === "Occupied").length;
  const reservedSpaces = floor3Spaces.filter(s => s.status === "Reserved").length;
  const availableSpaces = floor3Spaces.filter(s => s.status === "Available").length;
  const maintenanceSpaces = floor3Spaces.filter(s => s.status === "Maintenance").length;

  // Filter Spaces
  const filteredSpaces = floor3Spaces.filter(space => {
    const matchesSearch = space.id.toLowerCase().includes(searchSpace.toLowerCase()) ||
                         space.zone.toLowerCase().includes(searchSpace.toLowerCase()) ||
                         space.type.toLowerCase().includes(searchSpace.toLowerCase());
    const matchesStatus = statusFilter === "all" || space.status === statusFilter;
    const matchesType = typeFilter === "all" || space.type === typeFilter;
    const matchesZone = zoneFilter === "all" || space.zone === zoneFilter;
    return matchesSearch && matchesStatus && matchesType && matchesZone;
  });

  const handleSpaceClick = (space: Space) => {
    setSelectedSpace(space);
  };

  const handleMarkAsVacant = () => {
    toast.success(`Space ${selectedSpace?.id} marked as vacant`);
    setSelectedSpace(null);
  };

  const handleCancelBooking = () => {
    toast.success(`Booking for ${selectedSpace?.id} has been canceled`);
    setSelectedSpace(null);
  };

  const handleExportReport = () => {
    toast.success("Exporting report...");
  };

  return (
    <>
      {/* Stats Cards - Floor 3 */}
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
              <p className="text-[13px] text-gray-600 mb-1">Total Spaces</p>
              <p className="text-[28px] font-semibold text-[#021526]">{totalSpaces}</p>
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
              <p className="text-[28px] font-semibold text-[#021526]">{availableSpaces}</p>
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
              <p className="text-[28px] font-semibold text-[#021526]">{occupiedSpaces}</p>
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
              <p className="text-[28px] font-semibold text-[#021526]">{reservedSpaces}</p>
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
              <p className="text-[28px] font-semibold text-[#021526]">{maintenanceSpaces}</p>
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
              <p className="text-[24px] font-semibold text-[#021526]">4/5</p>
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
                <span className="text-[12px] text-gray-600">Detected Spaces</span>
              </div>
              <p className="text-[24px] font-semibold text-[#021526]">{occupiedSpaces}</p>
              <p className="text-[11px] text-gray-500">{Math.round((occupiedSpaces/totalSpaces)*100)}% occupied</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-gray-600">Main Hall</span>
              <Badge className="bg-green-100 text-green-700 border-0 text-[11px]">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-[13px] mt-2">
              <span className="text-gray-600">Central Area</span>
              <Badge className="bg-green-100 text-green-700 border-0 text-[11px]">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-[13px] mt-2">
              <span className="text-gray-600">Lounge Area</span>
              <Badge className="bg-green-100 text-green-700 border-0 text-[11px]">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-[13px] mt-2">
              <span className="text-gray-600">Café Area</span>
              <Badge className="bg-green-100 text-green-700 border-0 text-[11px]">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-[13px] mt-2">
              <span className="text-gray-600">Terrace Area</span>
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
                <p className="text-[13px] text-gray-800">Trần Văn B reserved event hall EH-302</p>
                <p className="text-[11px] text-gray-500 mt-1">09:15</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-orange-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Main Hall camera detected occupancy change</p>
                <p className="text-[11px] text-gray-500 mt-1">09:20</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-red-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Payment overdue alert for CA-401</p>
                <p className="text-[11px] text-gray-500 mt-1">09:25</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-blue-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Hoàng Thị E checked out (ONZ-501)</p>
                <p className="text-[11px] text-gray-500 mt-1">09:30</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-green-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Nguyễn Thị A checked in (EH-301)</p>
                <p className="text-[11px] text-gray-500 mt-1">08:45</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-orange-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-800">Space EH-304 marked as maintenance by AI</p>
                <p className="text-[11px] text-gray-500 mt-1">08:30</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content - Space Map + Sidebar */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Space Map */}
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
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-[12px] text-gray-600 mb-2 block">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-[36px] rounded-[8px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Event Hall">Event Hall</SelectItem>
                      <SelectItem value="Conference Area">Conference Area</SelectItem>
                      <SelectItem value="Open Networking Zone">Open Networking Zone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                      <SelectItem value="Main Hall">Main Hall</SelectItem>
                      <SelectItem value="East Wing">East Wing</SelectItem>
                      <SelectItem value="West Wing">West Wing</SelectItem>
                      <SelectItem value="North Wing">North Wing</SelectItem>
                      <SelectItem value="Central Area">Central Area</SelectItem>
                      <SelectItem value="South Wing">South Wing</SelectItem>
                      <SelectItem value="Lounge Area">Lounge Area</SelectItem>
                      <SelectItem value="Café Area">Café Area</SelectItem>
                      <SelectItem value="Terrace Area">Terrace Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[12px] text-gray-600 mb-2 block">Quick Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="e.g., EH-301, CA-401, ONZ-501"
                      value={searchSpace}
                      onChange={(e) => setSearchSpace(e.target.value)}
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
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=900&fit=crop"
              alt="Floor 3 Plan - Networking Space"
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

        {/* Space List Sidebar */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-[18px] font-semibold text-[#021526] mb-5">Select Space</h3>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search space..."
              value={searchSpace}
              onChange={(e) => setSearchSpace(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 rounded-[10px] h-[42px]"
            />
          </div>

          {/* Space List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredSpaces.map((space) => (
              <div
                key={space.id}
                onClick={() => handleSpaceClick(space)}
                className="flex items-center justify-between p-4 rounded-[12px] border border-gray-200 hover:border-[#317752] hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div>
                  <p className="text-[14px] font-semibold text-[#021526]">{space.id}</p>
                  <p className="text-[12px] text-gray-500">{space.type} • {space.zone}</p>
                  <p className="text-[11px] text-gray-400">Capacity: {space.capacity}</p>
                </div>
                <Badge className={`${
                  space.status === "Available" ? "bg-gray-100 text-gray-700" :
                  space.status === "Occupied" ? "bg-blue-100 text-blue-700" :
                  space.status === "Reserved" ? "bg-orange-100 text-orange-700" :
                  "bg-red-100 text-red-700"
                } border-0`}>
                  {space.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Space Detail Sheet */}
      <Sheet open={!!selectedSpace} onOpenChange={() => setSelectedSpace(null)}>
        <SheetContent className="w-[500px] rounded-l-[20px]">
          <SheetHeader>
            <SheetTitle className="text-[22px] font-semibold">
              {selectedSpace?.type} {selectedSpace?.id}
            </SheetTitle>
          </SheetHeader>

          {selectedSpace && (
            <div className="mt-6 space-y-6">
              <div className="bg-gray-50 rounded-[12px] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] text-gray-600">Status</span>
                  <Badge className={`${
                    selectedSpace.status === "Available" ? "bg-gray-100 text-gray-700" :
                    selectedSpace.status === "Occupied" ? "bg-blue-100 text-blue-700" :
                    selectedSpace.status === "Reserved" ? "bg-orange-100 text-orange-700" :
                    "bg-red-100 text-red-700"
                  } border-0`}>
                    {selectedSpace.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[14px] text-gray-600">Zone</span>
                  <span className="text-[14px] font-medium text-[#021526]">{selectedSpace.zone}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[14px] text-gray-600">Capacity</span>
                  <span className="text-[14px] font-medium text-[#021526]">{selectedSpace.capacity} people</span>
                </div>
              </div>

              {selectedSpace.user && (
                <>
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#021526] mb-3">User Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-[14px] text-gray-700">{selectedSpace.user.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-[14px] text-gray-700">{selectedSpace.user.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-[14px] text-gray-700">{selectedSpace.user.phone}</span>
                      </div>
                      {selectedSpace.user.company && (
                        <div className="flex items-center gap-3">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="text-[14px] text-gray-700">{selectedSpace.user.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedSpace.booking && (
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#021526] mb-3">Booking Details</h4>
                      <div className="space-y-3">
                        {selectedSpace.booking.eventTitle && (
                          <div>
                            <span className="text-[13px] text-gray-600">Event Title</span>
                            <p className="text-[13px] font-medium text-[#021526] mt-1">{selectedSpace.booking.eventTitle}</p>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-[13px] text-gray-600">Package</span>
                          <span className="text-[13px] font-medium text-[#021526]">{selectedSpace.booking.package}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[13px] text-gray-600">Period</span>
                          <span className="text-[13px] font-medium text-[#021526]">
                            {selectedSpace.booking.startDate} - {selectedSpace.booking.endDate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[13px] text-gray-600">Payment</span>
                          <Badge className={`${
                            selectedSpace.booking.paymentStatus === "Paid" ? "bg-green-100 text-green-700" :
                            selectedSpace.booking.paymentStatus === "Pending" ? "bg-orange-100 text-orange-700" :
                            "bg-red-100 text-red-700"
                          } border-0 text-[11px]`}>
                            {selectedSpace.booking.paymentStatus}
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

              {!selectedSpace.user && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">This space is available for booking</p>
                  <Button className="bg-[#317752] hover:bg-[#2a6545] text-white rounded-[10px]">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Space
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

