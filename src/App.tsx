import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CaseProvider } from '@/context/CaseContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import PatientInput from '@/pages/PatientInput';
import PatientProcessing from '@/pages/PatientProcessing';
import PatientSummary from '@/pages/PatientSummary';
import MyCases from '@/pages/MyCases';
import ProfessionalDashboard from '@/pages/ProfessionalDashboard';
import CaseDetail from '@/pages/CaseDetail';
import Safety from '@/pages/Safety';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CaseProvider>
            <div className="min-h-screen flex flex-col bg-ink-50">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/patient" element={<PatientInput />} />
                  <Route path="/patient/processing" element={<PatientProcessing />} />
                  <Route path="/patient/summary/:id" element={<PatientSummary />} />
                  <Route path="/my-cases" element={<MyCases />} />
                  <Route path="/professional" element={<ProfessionalDashboard />} />
                  <Route path="/professional/case/:id" element={<CaseDetail />} />
                  <Route path="/safety" element={<Safety />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CaseProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
