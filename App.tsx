
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { BottomNav } from './components/BottomNav';
import { AppTab, Job } from './types';
import { Loader2 } from 'lucide-react';
import { UserProvider, useUser } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { ChatProvider, useChatContext } from './context/ChatContext';
import { InfoModal } from './components/ui/InfoModal';
import { LocationGuardModal } from './components/LocationGuardModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { JobCommentsModal } from './components/JobCommentsModal';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const CreateJob = lazy(() => import('./pages/CreateJob').then(module => ({ default: module.CreateJob })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const MyJobs = lazy(() => import('./pages/MyJobs').then(module => ({ default: module.MyJobs }))); 
const Messages = lazy(() => import('./pages/Messages').then(module => ({ default: module.Messages })));
const JobDetails = lazy(() => import('./pages/JobDetails').then(module => ({ default: module.JobDetails })));

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  // Track the previous tab to handle "Back" correctly
  const [lastTab, setLastTab] = useState<AppTab>(AppTab.HOME);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const { infoModal, closeInfoModal, activeCommentJobId, setActiveCommentJobId } = useUser();
  const { activeConversationId, setActiveConversationId } = useChatContext();

  // Watch for active conversation changes to switch tabs
  useEffect(() => {
    if (activeConversationId) {
        handleTabChange(AppTab.MESSAGES);
        // Important: Close any open job details if we are redirecting to chat
        setSelectedJob(null);
    }
  }, [activeConversationId]);

  const handleTabChange = (newTab: AppTab) => {
      // If we are going to a "modal-like" tab (like Create), save where we came from.
      // If we are just switching main tabs, update history normally.
      if (newTab === AppTab.CREATE) {
          setLastTab(activeTab); 
      } else {
          // Optional: You could implement a full stack history here if needed
          // For now, standard navigation just updates active
      }
      setActiveTab(newTab);
  };

  const handleBackFromCreate = () => {
      setActiveTab(lastTab);
  };

  if (loading) {
      return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  const PageLoader = () => (
    <div className="flex items-center justify-center h-screen bg-jobbg">
       <Loader2 className="w-8 h-8 text-jobgreen animate-spin" />
    </div>
  );

  if (selectedJob) {
      return (
          <div className="w-full h-full bg-white relative">
              <Suspense fallback={<PageLoader />}>
                  <JobDetails 
                    job={selectedJob} 
                    onBack={() => setSelectedJob(null)} 
                    onNavigate={(tab) => {
                        setSelectedJob(null);
                        handleTabChange(tab);
                    }}
                  />
              </Suspense>
              <InfoModal 
                isOpen={infoModal.isOpen} 
                title={infoModal.title} 
                content={infoModal.content} 
                onClose={closeInfoModal} 
            />
            {/* Modal for Job Details context */}
            <JobCommentsModal 
                isOpen={!!activeCommentJobId} 
                onClose={() => setActiveCommentJobId(null)} 
                jobId={activeCommentJobId} 
            />
          </div>
      );
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return <Home onChangeTab={handleTabChange} onJobSelect={setSelectedJob} />;
      case AppTab.MY_JOBS:
        return <MyJobs onNavigate={handleTabChange} onJobSelect={setSelectedJob} />;
      case AppTab.CREATE:
        return <CreateJob onBack={handleBackFromCreate} onSuccess={(tab) => setActiveTab(tab)} />;
      case AppTab.PROFILE:
        return <Profile onNavigate={handleTabChange} />;
      case AppTab.MESSAGES:
        return <Messages onJobSelect={setSelectedJob} />;
      default:
        return <Home onChangeTab={handleTabChange} onJobSelect={setSelectedJob} />;
    }
  };

  return (
    <div className="w-full h-full bg-jobbg">
      <LocationGuardModal />

      <main className="w-full min-h-screen bg-white shadow-none relative pb-safe">
        <Suspense fallback={<PageLoader />}>
            {renderContent()}
        </Suspense>
        
        {activeTab !== AppTab.CREATE && (
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}

        <InfoModal 
            isOpen={infoModal.isOpen} 
            title={infoModal.title} 
            content={infoModal.content} 
            onClose={closeInfoModal} 
        />

        <JobCommentsModal 
            isOpen={!!activeCommentJobId} 
            onClose={() => setActiveCommentJobId(null)} 
            jobId={activeCommentJobId} 
        />
      </main>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <UIProvider>
                <AuthProvider>
                    <ChatProvider>
                        {/* Marketplace needs ChatProvider for application logic */}
                        <MarketplaceProvider>
                            <UserProvider>
                                <AppContent />
                            </UserProvider>
                        </MarketplaceProvider>
                    </ChatProvider>
                </AuthProvider>
            </UIProvider>
        </ErrorBoundary>
    );
};

export default App;
