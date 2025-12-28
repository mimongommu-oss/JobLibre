
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
const MyJobs = lazy(() => import('./pages/MyJobs').then(module => ({ default: module.MyJobs }))); // NEW
const Messages = lazy(() => import('./pages/Messages').then(module => ({ default: module.Messages })));
const JobDetails = lazy(() => import('./pages/JobDetails').then(module => ({ default: module.JobDetails })));

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const { infoModal, closeInfoModal, activeCommentJobId, setActiveCommentJobId } = useUser();
  const { activeConversationId, setActiveConversationId } = useChatContext();

  // Watch for active conversation changes to switch tabs
  useEffect(() => {
    if (activeConversationId) {
        setActiveTab(AppTab.MESSAGES);
        // Important: Close any open job details if we are redirecting to chat
        setSelectedJob(null);
    }
  }, [activeConversationId]);

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
                        setActiveTab(tab);
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
        return <Home onChangeTab={setActiveTab} onJobSelect={setSelectedJob} />;
      case AppTab.MY_JOBS:
        return <MyJobs onNavigate={setActiveTab} onJobSelect={setSelectedJob} />;
      case AppTab.CREATE:
        return <CreateJob onBack={() => setActiveTab(AppTab.HOME)} onSuccess={(tab) => setActiveTab(tab)} />;
      case AppTab.PROFILE:
        return <Profile onNavigate={setActiveTab} />;
      case AppTab.MESSAGES:
        return <Messages />;
      default:
        return <Home onChangeTab={setActiveTab} onJobSelect={setSelectedJob} />;
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
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
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
