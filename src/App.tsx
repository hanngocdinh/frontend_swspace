import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardContent from "./components/dashboard/DashboardContent";
import FreelancePackagePage from "./pages/PackageManagement/FreelancePackagePage";
import TeamPackagePage from "./pages/PackageManagement/TeamPackagePage";
import Floor1Page from "./pages/SpaceManagement/Floor1Page";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <DashboardLayout>
            <DashboardContent />
          </DashboardLayout>
        );
      case "service-freelance":
        return (
          <DashboardLayout>
            <FreelancePackagePage />
          </DashboardLayout>
        );
      case "service-team":
        return (
          <DashboardLayout>
            <TeamPackagePage />
          </DashboardLayout>
        );
      case "user-management":
        return (
          <DashboardLayout>
            <div className="text-center py-20">
              <h2 className="text-[24px] font-semibold mb-2">User Management</h2>
              <p className="text-gray-600">This page is under construction</p>
            </div>
          </DashboardLayout>
        );
      case "space-management":
        return (
          <DashboardLayout>
            <div className="text-center py-20">
              <h2 className="text-[24px] font-semibold mb-2">Space Management</h2>
              <p className="text-gray-600">This page is under construction</p>
            </div>
          </DashboardLayout>
        );
      case "floor-1":
        return (
          <DashboardLayout>
            <Floor1Page />
          </DashboardLayout>
        );
      case "floor-2":
        return (
          <DashboardLayout>
            <div className="text-center py-20">
              <h2 className="text-[24px] font-semibold mb-2">Floor 2 Management</h2>
              <p className="text-gray-600">This page is under construction</p>
            </div>
          </DashboardLayout>
        );
      case "floor-3":
        return (
          <DashboardLayout>
            <div className="text-center py-20">
              <h2 className="text-[24px] font-semibold mb-2">Floor 3 Management</h2>
              <p className="text-gray-600">This page is under construction</p>
            </div>
          </DashboardLayout>
        );
      case "payments":
        return (
          <DashboardLayout>
            <div className="text-center py-20">
              <h2 className="text-[24px] font-semibold mb-2">Payments</h2>
              <p className="text-gray-600">This page is under construction</p>
            </div>
          </DashboardLayout>
        );
      case "report":
        return (
          <DashboardLayout>
            <div className="text-center py-20">
              <h2 className="text-[24px] font-semibold mb-2">Report</h2>
              <p className="text-gray-600">This page is under construction</p>
            </div>
          </DashboardLayout>
        );
      case "settings":
        return (
          <DashboardLayout>
            <div className="text-center py-20">
              <h2 className="text-[24px] font-semibold mb-2">Settings</h2>
              <p className="text-gray-600">This page is under construction</p>
            </div>
          </DashboardLayout>
        );
      case "help-center":
        return (
          <DashboardLayout>
            <div className="text-center py-20">
              <h2 className="text-[24px] font-semibold mb-2">Help Center</h2>
              <p className="text-gray-600">This page is under construction</p>
            </div>
          </DashboardLayout>
        );
      default:
        return (
          <DashboardLayout>
            <div className="text-center py-20">
              <h2 className="text-[24px] font-semibold mb-2">Page Not Found</h2>
              <p className="text-gray-600">The requested page does not exist</p>
            </div>
          </DashboardLayout>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-100">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderContent()}
    </div>
  );
}