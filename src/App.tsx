import React, { useState, useEffect } from 'react';
import { User, AdTaskItem } from './types';
import { StorageService, PendingSignup, SUPER_ADMIN_ACCOUNT } from './services/storageService';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { OtpVerificationModal } from './components/OtpVerificationModal';
import { TelegramCheckpointModal } from './components/TelegramCheckpointModal';
import { AdStreamModal } from './components/AdStreamModal';
import { AboutModal } from './components/Modals/AboutModal';
import { ContactHelpdeskModal } from './components/Modals/ContactHelpdeskModal';

export default function App() {
  // 1. Current Logged In User State
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());

  // 2. Persistent Protection Pending Signup State (Mobile Refresh Bug Fix)
  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(() => StorageService.getPendingSignup());

  // 3. Navigation Route ('home' | 'dashboard' | 'admin')
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (window.location.pathname === '/admin-portal' || window.location.hash === '#admin-portal') {
      return 'admin';
    }
    const user = StorageService.getCurrentUser();
    if (user?.isAdmin && user?.email.toLowerCase() === SUPER_ADMIN_ACCOUNT.email.toLowerCase()) {
      return 'admin';
    }
    if (user) {
      return 'dashboard';
    }
    return 'home';
  });

  // 4. Modal Visibility States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpdeskOpen, setIsHelpdeskOpen] = useState(false);

  // 5. Active Ad Task Streaming State
  const [activeAdTask, setActiveAdTask] = useState<AdTaskItem | null>(null);

  // 6. Test Friday Mode Override
  const [isFridayOverride, setIsFridayOverride] = useState<boolean>(() => StorageService.getFridayOverride());

  // Listen to browser URL / hash changes
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin-portal' || hash === '#admin-portal') {
        setCurrentRoute('admin');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Sync route if user auth changes
  const handleSuccessLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
    
    // Routing Repair: Instant viewport mounting without white screens
    if (user.isAdmin && user.email.toLowerCase() === SUPER_ADMIN_ACCOUNT.email.toLowerCase()) {
      setCurrentRoute('admin');
      window.history.pushState({}, '', '/admin-portal');
    } else {
      setCurrentRoute('dashboard');
    }
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentRoute('home');
    if (window.location.pathname === '/admin-portal') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleOtpRequired = (pending: PendingSignup) => {
    setPendingSignup(pending);
    setIsAuthOpen(false);
  };

  const handleVerifiedSuccess = (user: User) => {
    setPendingSignup(null);
    setCurrentUser(user);
    // User will automatically see TelegramCheckpoint if hasJoinedTelegram is false
    setCurrentRoute('dashboard');
  };

  const handleCancelOtp = () => {
    StorageService.clearPendingSignup();
    setPendingSignup(null);
  };

  const handleTelegramUnlocked = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleNavigate = (route: string) => {
    if (route === 'admin') {
      if (!currentUser?.isAdmin) {
        handleOpenAuth('login');
        return;
      }
      setCurrentRoute('admin');
      window.history.pushState({}, '', '/admin-portal');
    } else if (route === 'dashboard') {
      if (!currentUser) {
        handleOpenAuth('login');
        return;
      }
      setCurrentRoute('dashboard');
      window.history.pushState({}, '', '/');
    } else {
      setCurrentRoute('home');
      window.history.pushState({}, '', '/');
    }
  };

  const handleToggleFridayOverride = () => {
    const nextVal = !isFridayOverride;
    setIsFridayOverride(nextVal);
    StorageService.setFridayOverride(nextVal);
  };

  const handleCompleteAdTask = () => {
    if (!currentUser) return;
    try {
      const res = StorageService.completeAdTask(currentUser.id);
      setCurrentUser(res.user);
      setActiveAdTask(null);
    } catch (err) {
      console.error(err);
      setActiveAdTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        isFridayOverride={isFridayOverride}
        onToggleFridayOverride={handleToggleFridayOverride}
      />

      {/* 2. Main Viewport Routing */}
      <main className="flex-1 flex flex-col">
        {currentRoute === 'admin' ? (
          <AdminPortal
            currentUser={currentUser}
            onNavigateHome={() => handleNavigate('home')}
            onSwitchUserSession={(u) => {
              StorageService.setCurrentUser(u);
              setCurrentUser(u);
              setCurrentRoute('dashboard');
            }}
            isFridayOverride={isFridayOverride}
            onToggleFridayOverride={handleToggleFridayOverride}
          />
        ) : currentRoute === 'dashboard' && currentUser ? (
          <UserDashboard
            user={currentUser}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onOpenAdStream={(ad) => setActiveAdTask(ad)}
            isFridayOverride={isFridayOverride}
            onToggleFridayOverride={handleToggleFridayOverride}
            onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
          />
        ) : (
          <LandingPage
            onOpenSignUp={() => handleOpenAuth('signup')}
            onOpenLogIn={() => handleOpenAuth('login')}
            onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        )}
      </main>

      {/* 3. PERSISTENT PROTECTION (MOBILE REFRESH BUG FIX): 
          If pending signup exists in localStorage, lock viewport to 6-digit confirmation box */}
      {pendingSignup && (
        <OtpVerificationModal
          pendingSignup={pendingSignup}
          onVerifiedSuccess={handleVerifiedSuccess}
          onCancel={handleCancelOtp}
        />
      )}

      {/* 4. ONE-TIME MANDATORY TELEGRAM CHANNEL CHECKPOINT */}
      {currentUser && !currentUser.hasJoinedTelegram && !pendingSignup && (
        <TelegramCheckpointModal
          user={currentUser}
          onUnlocked={handleTelegramUnlocked}
        />
      )}

      {/* 5. INTEGRATED DUAL-LAYER STACKED AD TASK MODAL (30s with 20s security lock) */}
      {activeAdTask && currentUser && (
        <AdStreamModal
          isOpen={Boolean(activeAdTask)}
          ad={activeAdTask}
          currentTaskNumber={currentUser.adsCompletedToday + 1}
          totalDailyTasks={34}
          onClose={() => setActiveAdTask(null)}
          onCompleteTask={handleCompleteAdTask}
        />
      )}

      {/* 6. Auth Modal (Signup / Login) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={handleSuccessLogin}
        onOtpRequired={handleOtpRequired}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />

      {/* 7. About Us Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenSignUp={() => {
          setIsAboutOpen(false);
          handleOpenAuth('signup');
        }}
      />

      {/* 8. Helpdesk Modal */}
      <ContactHelpdeskModal
        isOpen={isHelpdeskOpen}
        onClose={() => setIsHelpdeskOpen(false)}
      />

    </div>
  );
}
