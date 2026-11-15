import { useEffect, useMemo, useRef, useState } from "react";

import {

  onAuthStateChanged,

  signOut,

  type User,

} from "firebase/auth";

import { Search, ArrowRight, Command, UserRound, CircleHelp, LogOut, ChevronDown, ShieldCheck } from "lucide-react";

import { auth, authPersistence } from "./firebase";

import Checklist from "./components/Checklist";

import Units from "./components/Units";

import Listening from "./components/Listening";

import Flashcards from "./components/Flashcards";

import CefrFlashcards from "./components/CefrFlashcards";

import MyVocabulary from "./components/MyVocabulary";

import Information from "./components/Information";

import Profile from "./components/Profile";
import Settings, { type AtiTheme } from "./components/Settings";

import Dashboard from "./components/Dashboard";

import LearningDashboard from "./components/LearningDashboard";

import Statistics from "./components/Statistics";

import Tenses from "./components/Tenses";

import { useLearningProgressSync } from "./services/learningProgressSync";

import Login from "./components/Login";

import Register from "./components/Register";

import PublicHome from "./components/PublicHome";

import Sidebar, { type TabType } from "./components/Sidebar";

import "./App.css";

const VALID_TABS: TabType[] = [

  "dashboard",

  "learning-dashboard",

  "checklist",

  "statistics",

  "units",

  "listening",

  "tenses",

  "flashcards",

  "cefr",

  "my-vocabulary",

  "information",

  "profile",

  "settings",

];

const TAB_ROUTES: Record<TabType, string> = {

  dashboard: "/dashboard",

  "learning-dashboard": "/hoc-tieng-anh",

  checklist: "/hoc-tieng-anh/tong-quan",

  statistics: "/hoc-tieng-anh/thong-ke",

  units: "/hoc-tieng-anh/luyen-tap-1500-cau",

  listening: "/hoc-tieng-anh/luyen-nghe",

  tenses: "/hoc-tieng-anh/12-thi-tieng-anh",

  flashcards: "/hoc-tieng-anh/flashcard-tu-vung",

  cefr: "/hoc-tieng-anh/tu-vung-cefr",

  "my-vocabulary": "/hoc-tieng-anh/tu-vung-cua-toi",

  profile: "/tai-khoan/ho-so-ca-nhan",

  settings: "/tai-khoan/cai-dat",

  information: "/gioi-thieu-t-ai-group",

};

function getTabFromUrl(): TabType {

  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  const routeMatch = (Object.entries(TAB_ROUTES) as [TabType, string][])

    .find(([, route]) => route === pathname)

    ?? (pathname === "/gioi-thieu-ntt-group" ? ["information", TAB_ROUTES.information] as [TabType, string] : undefined);

  if (routeMatch) return routeMatch[0];

  // Compatibility with links created by older versions that used URL hashes.

  const tabFromHash = window.location.hash.replace(/^#\/?/, "") as TabType;

  return VALID_TABS.includes(tabFromHash) ? tabFromHash : "dashboard";

}

function App() {

  const [user, setUser] = useState<User | null>(null);

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [showRegister, setShowRegister] = useState(false);

  const [authView, setAuthView] = useState<"home" | "login">("home");

  const [activeTab, setActiveTab] = useState<TabType>(() => getTabFromUrl());

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem("ati-sidebar-collapsed") === "true"
  );
  const [theme, setTheme] = useState<AtiTheme>(
    () => localStorage.getItem("ati-theme") === "dark" ? "dark" : "light"
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => localStorage.getItem("ati-notifications-enabled") !== "false"
  );

  const [globalSearch, setGlobalSearch] = useState("");

  const [searchOpen, setSearchOpen] = useState(false);

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);

  const learningSyncStatus = useLearningProgressSync(user);

  useEffect(() => {
    localStorage.setItem("ati-theme", theme);
    document.documentElement.dataset.atiTheme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ati-sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem("ati-notifications-enabled", String(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {

    let unsubscribe: (() => void) | undefined;

    let cancelled = false;

    authPersistence

      .then(() => {

        if (cancelled) return;

        unsubscribe = onAuthStateChanged(auth, (currentUser) => {

          setUser(currentUser);

          setCheckingAuth(false);

        });

      })

      .catch((error) => {

        console.error("Firebase Authentication error:", error);

        if (!cancelled) {

          setCheckingAuth(false);

        }

      });

    return () => {

      cancelled = true;

      unsubscribe?.();

    };

  }, []);

  useEffect(() => {

    const handleGlobalShortcut = (event: KeyboardEvent) => {

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {

        event.preventDefault();

        setSearchOpen(true);

        window.setTimeout(() => document.getElementById("ati-global-search")?.focus(), 0);

      }

      if (event.key === "Escape") {

        setSearchOpen(false);

        setAccountMenuOpen(false);

      }

    };

    window.addEventListener("keydown", handleGlobalShortcut);

    return () => window.removeEventListener("keydown", handleGlobalShortcut);

  }, []);

  useEffect(() => {

    const closeAccountMenu = (event: MouseEvent) => {

      if (

        accountMenuRef.current &&

        !accountMenuRef.current.contains(event.target as Node)

      ) {

        setAccountMenuOpen(false);

      }

    };

    document.addEventListener("mousedown", closeAccountMenu);

    return () => document.removeEventListener("mousedown", closeAccountMenu);

  }, []);

  useEffect(() => {

    const syncTabFromUrl = () => {

      setActiveTab(getTabFromUrl());

    };

    window.addEventListener("popstate", syncTabFromUrl);

    window.addEventListener("hashchange", syncTabFromUrl);

    return () => {

      window.removeEventListener("popstate", syncTabFromUrl);

      window.removeEventListener("hashchange", syncTabFromUrl);

    };

  }, []);

  useEffect(() => {

    const nextPath = TAB_ROUTES[activeTab];

    if (window.location.pathname !== nextPath || window.location.hash) {

      window.history.pushState(null, "", nextPath);

    }

  }, [activeTab]);

  const handleLogout = async () => {

    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");

    if (!confirmed) return;

    try {

      await signOut(auth);

      setActiveTab("dashboard");

    } catch (error) {

      console.error("Logout error:", error);

      alert("Đăng xuất thất bại. Vui lòng thử lại.");

    }

  };

  const pageTitles: Record<TabType, string> = {

    dashboard: "Tổng quan ATI Group",

    "learning-dashboard": "Tổng quan Học tiếng Anh",

    checklist: "Tổng quan học tập",

    statistics: "Báo cáo học tập",

    units: "Luyện tập 1.500 câu",

    listening: "Luyện nghe",

    tenses: "12 English Tenses",

    flashcards: "Flashcard từ vựng",

    cefr: "Flashcard CEFR",

    "my-vocabulary": "Từ vựng của tôi",

    information: "Thông tin ứng dụng",

    profile: "Hồ sơ tài khoản",

    settings: "Cài đặt ATI",

  };

  const searchablePages = useMemo(

    () =>

      (Object.entries(pageTitles) as [TabType, string][])

        .filter(([tab, title]) => {

          const query = globalSearch.trim().toLocaleLowerCase("vi");

          if (!query) return tab !== "information" && tab !== "profile";

          return title.toLocaleLowerCase("vi").includes(query) ||

            tab.toLocaleLowerCase("vi").includes(query);

        })

        .slice(0, 6),

    [globalSearch]

  );

  const navigateFromSearch = (tab: TabType) => {

    setActiveTab(tab);

    setGlobalSearch("");

    setSearchOpen(false);

  };

  const toggleSidebar = () => {

    setSidebarCollapsed((previous) => !previous);

  };

  if (checkingAuth) {

    return (

      <div className="auth-loading" role="status" aria-live="polite">

        <div className="auth-loading-orbit auth-loading-orbit-one" />

        <div className="auth-loading-orbit auth-loading-orbit-two" />

        <div className="auth-loading-card">

          <img

            className="auth-loading-logo"

            src="/ati-approved-logo.png"

            alt="ATI Group"

          />

          <span className="auth-loading-title">ATI GROUP</span>

          <span className="auth-loading-caption">Đang khởi tạo không gian của bạn</span>

          <span className="auth-loading-progress"><i /></span>

        </div>

      </div>

    );

  }

  if (!user) {

    if (showRegister) return <Register onSwitch={() => setShowRegister(false)} onBack={() => { setShowRegister(false); setAuthView("home"); }} />;

    if (authView === "login") return <Login onSwitch={() => setShowRegister(true)} onBack={() => setAuthView("home")} />;

    return <PublicHome onLogin={() => setAuthView("login")} onExplore={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} />;

  }

  return (

    <div

      className={`app-container ati-theme-${theme} ${

        sidebarCollapsed ? "sidebar-collapsed" : ""

      }`}

    >

      <Sidebar

        activeTab={activeTab}

        onTabChange={setActiveTab}

        collapsed={sidebarCollapsed}

        onToggle={toggleSidebar}

      />

      <main className="main-content">

        <header className="topbar">

          <div className="topbar-brand">

            <button

              className="topbar-logo-button"

              type="button"

              onClick={() => setActiveTab("dashboard")}

              aria-label="ATI – Trang chủ"

              title="ATI – Trang chủ"

            >

              <img className="topbar-ati-logo" src="/ati-approved-logo.png" alt="ATI" />

            </button>

            <div className="topbar-page-info">

              {activeTab !== "dashboard" && activeTab !== "profile" && activeTab !== "information" && (

                <span className="topbar-module-context">ATI GROUP <span>/</span> ENGLISH MASTER</span>

              )}

              <h1>{pageTitles[activeTab]}</h1>

            </div>

          </div>

          <div

            className={`ati-global-search ${searchOpen ? "is-open" : ""}`}

            onClick={(event) => {

              if ((event.target as HTMLElement).closest(".ati-search-results")) return;

              setSearchOpen(true);

              window.setTimeout(() => document.getElementById("ati-global-search")?.focus(), 0);

            }}

          >

            <Search size={17} aria-hidden="true" />

            <input

              id="ati-global-search"

              type="search"

              value={globalSearch}

              placeholder="Tìm nhanh tính năng..."

              aria-label="Tìm kiếm trang và tính năng"

              aria-expanded={searchOpen}

              onFocus={() => setSearchOpen(true)}

              onChange={(event) => {

                setGlobalSearch(event.target.value);

                setSearchOpen(true);

              }}

              onKeyDown={(event) => {

                if (event.key === "Enter" && searchablePages[0]) {

                  event.preventDefault();

                  navigateFromSearch(searchablePages[0][0]);

                }

              }}

            />

            <kbd><Command size={11} /> K</kbd>

            {searchOpen && (

              <div className="ati-search-results">

                <div className="ati-search-results-label">

                  {globalSearch.trim() ? "KẾT QUẢ TÌM KIẾM" : "TRUY CẬP NHANH"}

                </div>

                {searchablePages.length ? searchablePages.map(([tab, title]) => (

                  <button type="button" key={tab} onClick={() => navigateFromSearch(tab)}>

                    <span>{title}</span><ArrowRight size={14} />

                  </button>

                )) : (

                  <p>Không tìm thấy tính năng phù hợp.</p>

                )}

                <div className="ati-search-hint">Nhấn Enter để mở kết quả đầu tiên · Esc để đóng</div>

              </div>

            )}

          </div>

          <div className="topbar-right">

            <div className="ati-account-menu-wrap" ref={accountMenuRef}>

              <button

                className={`ati-account-trigger ${accountMenuOpen ? "is-open" : ""}`}

                type="button"

                onClick={() => setAccountMenuOpen((open) => !open)}

                aria-haspopup="menu"

                aria-expanded={accountMenuOpen}

                aria-label="Mở menu tài khoản"

              >

                <span className="ati-account-avatar">

                  {user.photoURL ? (

                    <img src={user.photoURL} alt="" />

                  ) : (

                    (user.displayName || user.email || "U").charAt(0).toUpperCase()

                  )}

                </span>

                <span className="ati-account-trigger-copy">

                  <strong>{user.displayName || "Học viên"}</strong>

                  <small>Tài khoản ATI</small>

                </span>

                <ChevronDown size={15} className="ati-account-chevron" />

              </button>

              {accountMenuOpen && (

                <div className="ati-account-popover" role="menu" aria-label="Menu tài khoản">

                  <div className="ati-account-popover-head">

                    <span className="ati-account-avatar ati-account-avatar-large">

                      {user.photoURL ? <img src={user.photoURL} alt="" /> : (user.displayName || user.email || "U").charAt(0).toUpperCase()}

                    </span>

                    <div>

                      <strong>{user.displayName || "Học viên"}</strong>

                      <span>{user.email}</span>

                    </div>

                  </div>

                  <div className="ati-account-status">

                    <ShieldCheck size={14} />

                    Đang đăng nhập an toàn

                  </div>

                  <div className="ati-account-divider" />

                  <button type="button" role="menuitem" onClick={() => { setActiveTab("profile"); setAccountMenuOpen(false); }}>

                    <UserRound size={16} /><span>Hồ sơ cá nhân</span><ArrowRight size={14} />

                  </button>

                  <button type="button" role="menuitem" onClick={() => { setActiveTab("information"); setAccountMenuOpen(false); }}>

                    <CircleHelp size={16} /><span>Thông tin ATI</span><ArrowRight size={14} />

                  </button>

                  <div className="ati-account-divider" />

                  <button type="button" role="menuitem" className="ati-account-logout" onClick={() => { setAccountMenuOpen(false); void handleLogout(); }}>

                    <LogOut size={16} /><span>Đăng xuất</span>

                  </button>

                  <div className="ati-account-popover-foot">ATI GROUP · BUILD · CONNECT · GROW</div>

                </div>

              )}

            </div>

          </div>

        </header>

        <section className="page-content">

          {activeTab === "dashboard" && (

            <Dashboard

              displayName={user.displayName || "bạn"}

              onNavigate={setActiveTab}

            />

          )}

          {activeTab === "learning-dashboard" && (

            <LearningDashboard displayName={user.displayName || "bạn"} onNavigate={setActiveTab} />

          )}

          {activeTab === "checklist" && <Checklist onNavigate={setActiveTab} />}

          {activeTab === "statistics" && <Statistics />}

          {activeTab === "units" && <Units />}

          {activeTab === "listening" && <Listening />}

          {activeTab === "tenses" && <Tenses />}

          {activeTab === "flashcards" && <Flashcards />}

          {activeTab === "cefr" && <CefrFlashcards />}

          {activeTab === "my-vocabulary" && <MyVocabulary />}

          {activeTab === "information" && <Information />}

          {activeTab === "profile" && <Profile syncStatus={learningSyncStatus} />}
          {activeTab === "settings" && (
            <Settings
              theme={theme}
              onThemeChange={setTheme}
              sidebarCollapsed={sidebarCollapsed}
              onSidebarCollapsedChange={setSidebarCollapsed}
              notificationsEnabled={notificationsEnabled}
              onNotificationsEnabledChange={setNotificationsEnabled}
            />
          )}

        </section>

      </main>

    </div>

  );

}

export default App;
