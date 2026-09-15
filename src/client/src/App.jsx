import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import LiveHealthCheckModal from './components/common/LiveHealthCheckModal';
import DataSimulationControl from './components/dashboard/DataSimulationControl';
import NEXORAAIChatDrawer from './components/ai/AEROAIChatDrawer';

import CommandCenterPage from './pages/CommandCenterPage';
import EquipmentListPage from './pages/EquipmentListPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import PredictiveMaintenancePage from './pages/PredictiveMaintenancePage';
import SupplyChainPage from './pages/SupplyChainPage';
import SupplierRiskPage from './pages/SupplierRiskPage';
import ResilienceSimulatorPage from './pages/ResilienceSimulatorPage';
import InventoryPage from './pages/InventoryPage';
import AlertsPage from './pages/AlertsPage';
import IntelligencePage from './pages/IntelligencePage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

import { AuthProvider } from './context/AuthContext';
import { SimulationProvider } from './context/SimulationContext';
import { FleetHealthProvider } from './context/FleetHealthContext';

export default function App() {
  const [liveScanOpen, setLiveScanOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <AuthProvider>
      <FleetHealthProvider>
        <SimulationProvider>
          <Router>
            <div className="min-h-screen bg-[#020409] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-jb matrix-bg">
              {/* Header Navbar — responsive, has hamburger for mobile */}
              <Navbar
                onOpenLiveScan={() => setLiveScanOpen(true)}
                onToggleAiChat={() => setAiChatOpen(!aiChatOpen)}
              />

              {/* Body Content */}
              <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
                {/* Desktop Sidebar — collapsible */}
                <Sidebar />

                <main className="flex-1 p-4 sm:p-5 overflow-x-hidden min-w-0">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<CommandCenterPage />} />
                    <Route path="/equipment" element={<EquipmentListPage />} />
                    <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
                    <Route path="/digital-twin" element={<EquipmentListPage />} />
                    <Route path="/maintenance" element={<PredictiveMaintenancePage />} />
                    <Route path="/supply-chain" element={<SupplyChainPage />} />
                    <Route path="/suppliers" element={<SupplierRiskPage />} />
                    <Route path="/simulator" element={<ResilienceSimulatorPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/alerts" element={<AlertsPage />} />
                    <Route path="/intelligence" element={<IntelligencePage />} />
                    <Route path="/case-studies" element={<CaseStudiesPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                  </Routes>
                </main>
              </div>

              {/* Footer */}
              <Footer />

              {/* Live Telemetry Health Check Modal */}
              <LiveHealthCheckModal
                isOpen={liveScanOpen}
                onClose={() => setLiveScanOpen(false)}
              />

              {/* Simulation Controls Modal */}
              <DataSimulationControl
                isOpen={adminModalOpen}
                onClose={() => setAdminModalOpen(false)}
              />

              {/* Floating NEXORA AI Chat Assistant Drawer */}
              <NEXORAAIChatDrawer
                isOpen={aiChatOpen}
                onClose={() => setAiChatOpen(false)}
              />
            </div>
          </Router>
        </SimulationProvider>
      </FleetHealthProvider>
    </AuthProvider>
  );
}
