import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideNavbar from "../../components/admin/SideNavbar";
import TopNavbar from "../../components/admin/TopNavbar";
import FreelancersTable from "../../components/admin/FreelancersTable";
import ClientsTable from "../../components/admin/ClientTable";
import DashboardSummary from "../../components/admin/DashboardSummary";
import ClientVerificationTable from "../../components/admin/clientVerificationTable";
import ClientVerificationDetail from "../../components/admin/clientVerificationDetails";

const validTabs = ["dashboard", "freelancers", "clients","clientVerification"];

const DevConnectDashboard = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const defaultTab = validTabs.includes(tab) ? tab : "dashboard";

  const tapCount = useRef(0);
  const timer = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showVerificationDetails, setShowVerificationDetails] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);

  useEffect(() => {
    if (!validTabs.includes(tab)) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      setActiveTab(tab);
    }
          if (tab !== "clientVerification") {
        setShowVerificationDetails(false);
      }

  }, [tab,navigate]);

  const handleTap = () => {
    tapCount.current += 1;

    if (tapCount.current === 1) {
      timer.current = setTimeout(() => {
        tapCount.current = 0;
      }, 400);
    }

    if (tapCount.current === 2) {
      clearTimeout(timer.current);
      tapCount.current = 0;
      setSidebarOpen(!sidebarOpen);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

   const handleReviewClick = (verificationDataID) => {
    console.log(verificationDataID)
    setSelectedVerification(verificationDataID);
    setShowVerificationDetails(true);
  };
  
  const handleBackToList = () => {
    setShowVerificationDetails(false);
    setSelectedVerification(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "freelancers":
        return <FreelancersTable />;
      case "clients":
        return <ClientsTable />;
       case "clientVerification":
         return showVerificationDetails ? (
          <ClientVerificationDetail 
            verificationDataID={selectedVerification} 
            onBack={handleBackToList} 
          />
        ) : (
          <ClientVerificationTable onReviewClick={handleReviewClick} />
        );
      case "dashboard":
      default:
        return <DashboardSummary />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "freelancers":
        return "Freelancers";
      case "clients":
        return "Clients";
      case "clientVerification":
        return showVerificationDetails 
          ? "Verification Request Details" 
          : "Verification Requests";

      case "dashboard":
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNavbar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        handleTap={handleTap}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          navigate(`/admin/${tab}`);
        }}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <TopNavbar toggleSidebar={toggleSidebar} activeTab={activeTab} />
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
            {activeTab === "clientVerification" && showVerificationDetails && (
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center text-sm"
              >
                <span className="mr-2">←</span> Back to List
              </button>
            )}
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DevConnectDashboard;
