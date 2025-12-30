
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AppLayout } from './components/layout/AppLayout';
import { AppTab, Job } from './types';
import { Loader2 } from 'lucide-react';
import { UserProvider, useUser } from './context/UserContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider, useUI } from './context/UIContext';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { ChatProvider, useChatContext } from './context/ChatContext';
import { InfoModal } from './components/ui/InfoModal';
import { LocationGuardModal } from './components/LocationGuardModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { JobCommentsModal } from './components/JobCommentsModal';

// Modals for Direct Action
import { VerificationModal } from './components/VerificationModal';
import { CoinShopModal } from './components/CoinShopModal';

// Lazy Load Pages
const AuthScreen = lazy(() => import('./pages/AuthScreen').then(module => ({ default: module.AuthScreen })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const CreateJob = lazy(() => import('./pages/CreateJob').then(module => ({ default: module.CreateJob })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const MyJobs = lazy(() => import('./pages/MyJobs').then(module => ({ default: module.MyJobs }))); 
const Messages = lazy(() => import('./pages/Messages').then(module => ({ default: module.Messages })));
const JobDetails = lazy(() => import('./pages/JobDetails').then(module => ({ default: module.JobDetails })));

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.AUTH);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // --- GLOBAL MODAL STATES (Driven by Notifications/Actions) ---
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [shopInitialTab, setShopInitialTab] = useState<'shop' | 'premium' | 'exchange'>('shop');
  
  const { user, isAuthenticated } = useAuth();
  const { infoModal, closeInfoModal, pendingAction, clearPendingAction } = useUI();
  const { jobs } = useMarketplace();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
      // Auto-login check handled by AuthContext but UI state update here
      if (isAuthenticated) {
          // If already auth, go home (unless specific logic overrides)
          if (activeTab === AppTab.AUTH) setActiveTab(AppTab.HOME);
      }
    }, 2000); // 2s splash
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // --- SECURITY: AUTO REDIRECT TO AUTH ON LOGOUT ---
  useEffect(() => {
      if (!loading && !isAuthenticated) {
          setActiveTab(AppTab.AUTH);
      }
  }, [isAuthenticated, loading]);

  // --- INTELLIGENT ACTION ORCHESTRATOR ---
  useEffect(() => {
      if (pendingAction) {
          console.log("🚀 Executing Global Action:", pendingAction.type);
          
          switch (pendingAction.type) {
              case 'verify_identity':
                  setShowVerificationModal(true);
                  break;
              case 'recharge_wallet':
                  setShopInitialTab('shop');
                  setShowShopModal(true);
                  break;
              case 'upgrade_premium':
                  setShopInitialTab('premium');
                  setShowShopModal(true);
                  break;
              case 'view_job':
              case 'validate_mission':
                  if (pendingAction.targetId) {
                      const job = jobs.find(j => j.id === pendingAction.targetId);
                      if (job) {
                          setSelectedJob(job);
                          // We don't change tab, JobDetails overlay will render
                      }
                  }
                  break;
              case 'create_job':
                  setActiveTab(AppTab.CREATE);
                  break;
              case 'complete_profile':
                  setActiveTab(AppTab.PROFILE);
                  // We could pass a prop to Profile to open edit modal, but navigating is a good start
                  break;
              default:
                  console.warn("Unknown action type:", pendingAction.type);
          }
          
          // Clear action after handling to prevent loops
          clearPendingAction();
      }
  }, [pendingAction, jobs]);

  // --- NAVIGATION HANDLERS ---
  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    if (tab !== AppTab.HOME && tab !== AppTab.MY_JOBS) {
        setSelectedJob(null); // Clear selected job when moving away (unless we want persist)
    }
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  // --- RENDER CURRENT VIEW ---
  const renderContent = () => {
    if (selectedJob) {
        return (
            <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>}>
                <JobDetails 
                    job={selectedJob} 
                    onBack={() => setSelectedJob(null)} 
                    onNavigate={handleTabChange}
                />
            </Suspense>
        );
    }

    switch (activeTab) {
      case AppTab.AUTH:
        return (
            <Suspense fallback={<div className="h-screen bg-white" />}>
                <AuthScreen onSuccess={(tab) => setActiveTab(tab)} />
            </Suspense>
        );
      case AppTab.ADMIN:
        return (
            <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>}>
                <AdminDashboard />
            </Suspense>
        );
      case AppTab.HOME:
        return (
            <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>}>
                <Home onChangeTab={handleTabChange} onJobSelect={handleJobSelect} />
            </Suspense>
        );
      case AppTab.CREATE:
        return (
            <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>}>
                <CreateJob onBack={() => setActiveTab(AppTab.HOME)} onSuccess={handleTabChange} />
            </Suspense>
        );
      case AppTab.MY_JOBS:
        return (
            <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>}>
                <MyJobs onNavigate={handleTabChange} onJobSelect={handleJobSelect} />
            </Suspense>
        );
      case AppTab.MESSAGES:
        return (
            <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>}>
                <Messages onJobSelect={handleJobSelect} />
            </Suspense>
        );
      case AppTab.PROFILE:
        return (
            <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>}>
                <Profile onNavigate={handleTabChange} onJobSelect={handleJobSelect} />
            </Suspense>
        );
      default:
        return <div className="p-10 text-center">Page introuvable</div>;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <ErrorBoundary>
        {renderContent()}
      </ErrorBoundary>

      {/* --- GLOBAL MODALS (Triggered by Actions) --- */}
      <VerificationModal 
          isOpen={showVerificationModal} 
          onClose={() => setShowVerificationModal(false)} 
      />
      
      <CoinShopModal 
          isOpen={showShopModal} 
          onClose={() => setShowShopModal(false)}
          initialTab={shopInitialTab}
      />

      <InfoModal 
          isOpen={infoModal.isOpen} 
          title={infoModal.title} 
          content={infoModal.content} 
          onClose={closeInfoModal} 
      />

      <JobCommentsModal 
          isOpen={false} 
          onClose={() => {}} 
          jobId={null} 
      />

      {isAuthenticated && activeTab !== AppTab.ADMIN && (
          <LocationGuardModal />
      )}
    </AppLayout>
  );
};

// Root Component wrapping everything in Providers
const App: React.FC = () => {
  return (
    <AuthProvider>
        <UIProvider>
            <ChatProvider>
                <MarketplaceProvider>
                    <UserProvider>
                        <AppContent />
                    </UserProvider>
                </MarketplaceProvider>
            </ChatProvider>
        </UIProvider>
    </AuthProvider>
  );
};

export default App;
