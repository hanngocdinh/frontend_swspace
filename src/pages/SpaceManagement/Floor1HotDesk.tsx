import { useState } from "react";
import dayjs from "dayjs";
import { 
  ChevronLeft, 
  ChevronRight,
  Users,
  Calendar as CalendarIcon,
  Video,
  TrendingUp,
  Clock,
  CheckCircle,
  Zap,
  Bot
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";

/* --- Mock Data --- */
const mockCameraData = [
  { id: 1, name: "Main Entrance (Camera A)", people: 5, status: "Online", statusColor: "text-green-600", location: "Reception", lastUpdate: "Just now" },
  { id: 2, name: "Workspace Area 1", people: 16, status: "Alert", statusColor: "text-orange-600", location: "Hot Desk Zone A", lastUpdate: "1 min ago" },
  { id: 3, name: "Workspace Area 2", people: 8, status: "Normal", statusColor: "text-gray-600", location: "Hot Desk Zone B", lastUpdate: "2 min ago" },
];

const mockStats = {
  totalSeats: 50,
  booked: 21,
  available: 29, // Fixed: 50 - 21 = 29
  occupancyRate: 20,
  dailyBookings: 40,
  weeklyBookings: 10,
  monthlyBookings: 7,
  yearlyBookings: 10,
  camerasOnline: "2/2",
  peopleDetected: 35,
  discrepancy: 14 // Fixed: 35 - 21 = 14
};

/* --- MAIN COMPONENT --- */
export default function Floor1HotDesk() {
  const [showCameraModal, setShowCameraModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <main className="flex-1 overflow-y-auto p-8">
        {/* Calendar */}
        <div className="mb-8">
          <CalendarSection />
        </div>

        {/* Booking Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <BookingCard icon={<CalendarIcon size={18} className="text-blue-600" />} title="Daily Bookings" value={mockStats.dailyBookings.toString()} subtitle="Day Packages" bgColor="bg-blue-100" />
          <BookingCard icon={<CalendarIcon size={18} className="text-orange-600" />} title="Weekly Bookings" value={mockStats.weeklyBookings.toString()} subtitle="Week Packages" bgColor="bg-orange-100" />
          <BookingCard icon={<CalendarIcon size={18} className="text-green-600" />} title="Monthly Bookings" value={mockStats.monthlyBookings.toString()} subtitle="Month Packages" bgColor="bg-green-100" />
          <BookingCard icon={<CalendarIcon size={18} className="text-purple-600" />} title="Yearly Bookings" value={mockStats.yearlyBookings.toString()} subtitle="Year Packages" bgColor="bg-purple-100" />
        </div>

        {/* Workspace Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users size={28} />} title="Total Seats" value={mockStats.totalSeats.toString()} subtitle="Total Hot Desk Seats" bgColor="bg-gray-200" />
          <StatCard icon={<CheckCircle size={28} />} title="Booked" value={mockStats.booked.toString()} subtitle="Currently Booked" bgColor="bg-blue-200" />
          <StatCard icon={<TrendingUp size={28} />} title="Available" value={mockStats.available.toString()} subtitle="Seats Available" bgColor="bg-green-100" />
          <StatCard icon={<TrendingUp size={28} />} title="Occupancy Rate" value={`${mockStats.occupancyRate}%`} bgColor="bg-purple-100" hasChart />
        </div>

        {/* AI Live Status + Camera */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Bot size={28} className="text-[#2d6b4a]" />
              <h2 className="text-xl font-black">AI Live Status</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6 pb-6 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Video size={32} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">AI Detection System</h3>
                    <p className="text-sm text-gray-600">Real-time people counting</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <MetricBox icon={<div className="w-2 h-2 bg-green-500 rounded-full" />} title="Cameras Online" value={mockStats.camerasOnline} />
                <MetricBox icon={<Clock size={20} />} title="People Detected" value={mockStats.peopleDetected.toString()} />
                <MetricBox icon={<Zap size={20} />} title="Discrepancy" value={`+${mockStats.discrepancy}`} />
              </div>

              <div className="space-y-2">
                <CameraItem name="Camera A - Zone 1" status="Online" people={18} />
                <CameraItem name="Camera B - Zone 2" status="Online" people={17} />
              </div>
            </div>
          </div>

          {/* Camera Panel */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Camera Status</h3>
              <button onClick={() => setShowCameraModal(true)} className="text-sm text-[#2d6b4a] hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {mockCameraData.map((camera) => (
                <CameraStatusItem
                  key={camera.id}
                  name={camera.name}
                  people={`${camera.people} people`}
                  status={camera.status}
                  statusColor={camera.statusColor}
                  lastUpdate={camera.lastUpdate}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- Calendar Section --- */
function CalendarSection() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const startOfMonth = currentMonth.startOf("month");
  const startDay = startOfMonth.day(); // Chủ nhật = 0
  const prevMonthDays = startDay === 0 ? 6 : startDay - 1;
  const totalCells = 42; // 6 hàng x 7 cột
  const calendarDays = Array.from({ length: totalCells }, (_, i) =>
    startOfMonth.subtract(prevMonthDays, "day").add(i, "day")
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{currentMonth.format("MMMM YYYY")}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.month() === currentMonth.month();
          const isToday = day.isSame(dayjs(), "day");
          const isSelected = day.isSame(selectedDate, "day");

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`
                w-full h-8 flex items-center justify-center text-sm border border-gray-200
                transition-colors
                ${!isCurrentMonth ? "text-gray-400 bg-gray-50" : "text-gray-800 hover:bg-gray-100"}
                ${isSelected ? "bg-green-600 text-white border-green-600 font-medium" : ""}
                ${isToday && !isSelected ? "border-green-600 text-green-700 font-medium" : ""}
              `}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '32px',
                width: '100%'
              }}
            >
              {day.date()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --- Subcomponents --- */
function BookingCard({ icon, title, value, subtitle, bgColor }: any) {
  return (
    <div className="bg-white shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer" style={{ borderRadius: '10px' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 ${bgColor} flex items-center justify-center shadow-sm`} style={{ borderRadius: '10px' }}>
          {icon}
        </div>
        <h3 className="font-bold text-sm text-gray-800">{title}</h3>
      </div>
      <div className="text-center">
        <p className="text-4xl font-black text-gray-900 mb-2">{value}</p>
        <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, bgColor, hasChart = false, onClick }: any) {
  return (
    <div onClick={onClick} className={`bg-white shadow-md p-5 border border-gray-200 ${onClick ? 'hover:shadow-lg transition cursor-pointer' : ''}`} style={{ borderRadius: '10px' }}>
      <h3 className="font-bold mb-4">{title}</h3>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-14 h-14 ${bgColor} flex items-center justify-center`} style={{ borderRadius: '10px' }}>
          {icon}
        </div>
        <p className="text-2xl font-black pt-2">{value}</p>
      </div>
      {subtitle && <p className="text-sm text-gray-600 text-center">{subtitle}</p>}
      {hasChart && (
        <div className="mt-4 h-8 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 relative overflow-hidden" style={{ borderRadius: '10px' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      )}
    </div>
  );
}

function MetricBox({ icon, title, value }: any) {
  return (
    <div className="bg-gray-50 p-4 hover:bg-gray-100 transition" style={{ borderRadius: '10px' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="text-gray-600">{icon}</div>
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <p className="text-xl font-black text-center">{value}</p>
    </div>
  );
}

function CameraItem({ name, status, people }: any) {
  return (
    <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 transition" style={{ borderRadius: '10px' }}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600">{people} people</span>
        <span className="bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold" style={{ borderRadius: '10px' }}>
          {status}
        </span>
      </div>
    </div>
  );
}

function CameraStatusItem({ name, people, status, statusColor, lastUpdate }: any) {
  return (
    <div className="border border-gray-200 p-3 hover:shadow-md transition cursor-pointer" style={{ borderRadius: '10px' }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'Online' ? 'bg-green-500' : status === 'Alert' ? 'bg-orange-500' : 'bg-gray-500'}`} />
          <span className="font-semibold text-sm">{name}</span>
        </div>
        <span className={`text-xs font-semibold ${statusColor}`}>{status}</span>
      </div>
      <div className="ml-4 space-y-1">
        <p className="text-xs text-gray-600">
          {people} people
        </p>
        <p className="text-xs text-gray-400">
          {lastUpdate}
        </p>
      </div>
    </div>
  );
}
