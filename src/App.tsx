
import { useEffect, useMemo, useRef, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { Search, ArrowRight, Command, UserRound, CircleHelp, LogOut, ChevronDown, ShieldCheck, Bell, CheckCheck, Trash2, CloudCheck, CloudOff, Info, MonitorCog } from "lucide-react";

import { auth, authPersistence } from "./firebase";

import Checklist from "./components/Checklist";
import Units from "./components/Units";
import Listening from "./components/Listening";
import Flashcards from "./components/Flashcards";
import CefrFlashcards from "./components/CefrFlashcards";
import MyVocabulary from "./components/MyVocabulary";
import Information from "./components/Information";
import AtiLearnEnglishIntro from "./components/AtiLearnEnglishIntro";
import Profile from "./components/Profile";
import Settings, { type AtiTheme } from "./components/Settings";
import Dashboard from "./components/Dashboard";
import LearningDashboard from "./components/LearningDashboard";
import Statistics from "./components/Statistics";
import Tenses from "./components/Tenses";
import IrregularVerbs from "./components/IrregularVerbs";
import { useLearningProgressSync } from "./services/learningProgressSync";
import { flushPendingLearningActivities } from "./services/learningActivity";

import Login from "./components/Login";
import Register from "./components/Register";
import PublicHome from "./components/PublicHome";

import Sidebar, { type TabType } from "./components/Sidebar";
import "./App.css";
import "./ATIExperience.css";
import "./ATIUnifiedSystem.css";

const VALID_TABS: TabType[] = [
  "dashboard",
  "learning-dashboard",
  "checklist",
  "statistics",
  "units",
  "listening",
  "tenses",
  "irregular-verbs",
  "flashcards",
  "cefr",
  "my-vocabulary",
  "information",
  "ati-introduction",
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
  "irregular-verbs": "/hoc-tieng-anh/dong-tu-bat-quy-tac",
  flashcards: "/hoc-tieng-anh/flashcard-tu-vung",
  cefr: "/hoc-tieng-anh/tu-vung-cefr",
  "my-vocabulary": "/hoc-tieng-anh/tu-vung-cua-toi",
  profile: "/tai-khoan/ho-so-ca-nhan",
  information: "/gioi-thieu-t-ai-group",
  "ati-introduction": "/ati-learn-english/gioi-thieu",
  settings: "/tai-khoan/cai-dat",
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("ati-sidebar-collapsed") === "true");
  const [theme, setTheme] = useState<AtiTheme>(() => localStorage.getItem("ati-theme") === "dark" ? "dark" : "light");
  const [language, setLanguage] = useState<"vi" | "en">(() => localStorage.getItem("ati-language") === "en" ? "en" : "vi");
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem("ati-notifications-enabled") !== "false");
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const globalSearchRef = useRef<HTMLDivElement>(null);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationStorageKey = `ati-notifications-${user?.uid ?? "guest"}`;
  type AtiNotification = {
    id: string;
    title: string;
    message: string;
    createdAt: number;
    read: boolean;
    kind: "success" | "warning" | "info";
  };
  const [notifications, setNotifications] = useState<AtiNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`ati-notifications-${auth.currentUser?.uid ?? "guest"}`);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((item) =>
        item && typeof item.id === "string" && typeof item.title === "string" &&
        typeof item.message === "string" && typeof item.createdAt === "number" &&
        typeof item.read === "boolean"
      ).slice(0, 30) : [];
    } catch {
      return [];
    }
  });
  const notificationOwnerKey = useRef(notificationStorageKey);
  const skipNotificationPersist = useRef(false);
  const learningSyncStatus = useLearningProgressSync(user);
  const previousSyncStatus = useRef(learningSyncStatus);

  useEffect(() => {
    if (!user) return;
    void flushPendingLearningActivities(user.uid);
    const handleOnline = () => { void flushPendingLearningActivities(user.uid); };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [user?.uid]);

  useEffect(() => {
    localStorage.setItem("ati-theme", theme);
    document.documentElement.dataset.atiTheme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ati-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.title = "ATI Group | Technology - AI";
  }, []);

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
        setNotificationOpen(false);
      }
    };
    window.addEventListener("keydown", handleGlobalShortcut);
    return () => window.removeEventListener("keydown", handleGlobalShortcut);
  }, []);

  useEffect(() => {
    const closeGlobalSearch = (event: PointerEvent) => {
      if (
        globalSearchRef.current &&
        !globalSearchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeGlobalSearch);
    return () => document.removeEventListener("pointerdown", closeGlobalSearch);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
  }, [activeTab]);

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
    const closeNotification = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", closeNotification);
    return () => document.removeEventListener("mousedown", closeNotification);
  }, []);

  useEffect(() => {
    if (notificationOwnerKey.current !== notificationStorageKey) {
      notificationOwnerKey.current = notificationStorageKey;
      skipNotificationPersist.current = true;
      try {
        const saved = localStorage.getItem(notificationStorageKey);
        const parsed = saved ? JSON.parse(saved) : [];
        setNotifications(Array.isArray(parsed) ? parsed.filter((item) =>
          item && typeof item.id === "string" && typeof item.title === "string" &&
          typeof item.message === "string" && typeof item.createdAt === "number" &&
          typeof item.read === "boolean"
        ).slice(0, 30) : []);
      } catch {
        setNotifications([]);
      }
      return;
    }
    if (skipNotificationPersist.current) {
      skipNotificationPersist.current = false;
      return;
    }
    try {
      localStorage.setItem(notificationStorageKey, JSON.stringify(notifications.slice(0, 30)));
    } catch {
      // Notifications remain available for this session if local storage is unavailable.
    }
  }, [notifications, notificationStorageKey]);

  useEffect(() => {
    const previous = previousSyncStatus.current;
    if (previous !== learningSyncStatus) {
      if (notificationsEnabled && learningSyncStatus === "synced") {
        setNotifications((current) => [{
          id: `sync-${Date.now()}`,
          title: "Đồng bộ học tập thành công",
          message: "Tiến độ học tập của bạn đã được đồng bộ với tài khoản ATI.",
          createdAt: Date.now(),
          read: false,
          kind: "success" as const,
        }, ...current].slice(0, 30));
      } else if (notificationsEnabled && learningSyncStatus === "error") {
        setNotifications((current) => [{
          id: `sync-error-${Date.now()}`,
          title: "Đồng bộ chưa thành công",
          message: "Đã xảy ra sự cố khi đồng bộ tiến độ học tập. Vui lòng kiểm tra kết nối và thử lại.",
          createdAt: Date.now(),
          read: false,
          kind: "warning" as const,
        }, ...current].slice(0, 30));
      } else if (notificationsEnabled && learningSyncStatus === "offline") {
        setNotifications((current) => [{
          id: `sync-offline-${Date.now()}`,
          title: "Thiết bị đang ngoại tuyến",
          message: "Một số thay đổi có thể chưa được đồng bộ cho đến khi kết nối mạng được khôi phục.",
          createdAt: Date.now(),
          read: false,
          kind: "info" as const,
        }, ...current].slice(0, 30));
      }
      previousSyncStatus.current = learningSyncStatus;
    }
  }, [learningSyncStatus, notificationsEnabled]);

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
    statistics: "Thống kê 1.500 câu",
    units: "Luyện tập 1.500 câu",
    listening: "Luyện nghe",
    tenses: "12 English Tenses",
    "irregular-verbs": "Động từ bất quy tắc",
    flashcards: "Flashcard từ vựng",
    cefr: "Flashcard CEFR",
    "my-vocabulary": "Từ vựng của tôi",
    information: "Giới thiệu",
    "ati-introduction": "Giới thiệu ATI Learn English",
    profile: "Hồ sơ tài khoản",
    settings: "Cài đặt ATI",
  };



  const searchablePages = useMemo(
    () =>
      (Object.entries(pageTitles) as [TabType, string][])
        .filter(([tab, title]) => {
          const query = globalSearch.trim().toLocaleLowerCase("vi");
          if (!query) return tab !== "information" && tab !== "ati-introduction" && tab !== "profile";
          return title.toLocaleLowerCase("vi").includes(query) ||
            tab.toLocaleLowerCase("vi").includes(query);
        })
        .slice(0, 6),
    [globalSearch]
  );

  useEffect(() => {
    setSelectedSearchIndex(0);
  }, [globalSearch, searchOpen]);

  const navigateFromSearch = (tab: TabType) => {
    setActiveTab(tab);
    setGlobalSearch("");
    setSearchOpen(false);
  };

  const unreadNotificationCount = notifications.filter((item) => !item.read).length;

  const markAllNotificationsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  };

  const clearNotifications = () => setNotifications([]);

  const formatNotificationTime = (timestamp: number) => {
    const elapsed = Math.max(0, Date.now() - timestamp);
    if (elapsed < 60_000) return "Vừa xong";
    if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)} phút trước`;
    if (elapsed < 86_400_000) return `${Math.floor(elapsed / 3_600_000)} giờ trước`;
    return new Date(timestamp).toLocaleDateString("vi-VN");
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
        language={language}
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
              <h1>{pageTitles[activeTab]}</h1>
            </div>
          </div>

          <div
            ref={globalSearchRef}
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
                if (event.key === "ArrowDown" && searchablePages.length) {
                  event.preventDefault();
                  setSelectedSearchIndex((index) => Math.min(index + 1, searchablePages.length - 1));
                } else if (event.key === "ArrowUp" && searchablePages.length) {
                  event.preventDefault();
                  setSelectedSearchIndex((index) => Math.max(index - 1, 0));
                } else if (event.key === "Enter" && searchablePages[selectedSearchIndex]) {
                  event.preventDefault();
                  navigateFromSearch(searchablePages[selectedSearchIndex][0]);
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  setSearchOpen(false);
                  setGlobalSearch("");
                  (event.currentTarget as HTMLInputElement).blur();
                }
              }}
            />
            <kbd><Command size={11} /> K</kbd>
            {searchOpen && (
              <div className="ati-search-results">
                <div className="ati-search-results-label">
                  {globalSearch.trim() ? "KẾT QUẢ TÌM KIẾM" : "TRUY CẬP NHANH"}
                </div>
                {searchablePages.length ? searchablePages.map(([tab, title], index) => (
                  <button
                    type="button"
                    key={tab}
                    className={selectedSearchIndex === index ? "is-selected" : ""}
                    onMouseEnter={() => setSelectedSearchIndex(index)}
                    onClick={() => navigateFromSearch(tab)}
                  >
                    <span>{title}</span><ArrowRight size={14} />
                  </button>
                )) : (
                  <p>Không tìm thấy tính năng phù hợp.</p>
                )}
                <div className="ati-search-hint">↑ ↓ di chuyển · Enter để mở · Esc để đóng</div>
              </div>
            )}
          </div>

          <div className="topbar-right">
            <div className="ati-language-switch" role="group" aria-label="Chọn ngôn ngữ / Choose language">
              <button
                type="button"
                className={language === "vi" ? "is-active" : ""}
                aria-pressed={language === "vi"}
                onClick={() => setLanguage("vi")}
                title="Tiếng Việt"
              >
                <span aria-hidden="true">🇻🇳</span><span className="ati-language-code">VI</span>
              </button>
              <button
                type="button"
                className={language === "en" ? "is-active" : ""}
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
                title="English"
              >
                <span aria-hidden="true">🇺🇸</span><span className="ati-language-code">EN</span>
              </button>
            </div>
            <div className="ati-notification-wrap" ref={notificationRef}>
              <button
                type="button"
                className={`ati-notification-trigger ${notificationOpen ? "is-open" : ""}`}
                aria-label={`Thông báo${unreadNotificationCount ? `, ${unreadNotificationCount} chưa đọc` : ""}`}
                aria-expanded={notificationOpen}
                onClick={() => {
                  setNotificationOpen((open) => !open);
                  setAccountMenuOpen(false);
                }}
              >
                <Bell size={18} />
                {unreadNotificationCount > 0 && <span className="ati-notification-badge">{unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}</span>}
              </button>
              {notificationOpen && (
                <section className="ati-notification-panel" aria-label="Trung tâm thông báo">
                  <header className="ati-notification-panel-head">
                    <div><strong>Thông báo</strong><span>{unreadNotificationCount ? `${unreadNotificationCount} thông báo chưa đọc` : "Cập nhật từ ATI"}</span></div>
                    <button type="button" onClick={markAllNotificationsRead} disabled={unreadNotificationCount === 0} title="Đánh dấu tất cả đã đọc"><CheckCheck size={16} /></button>
                  </header>
                  {notifications.length ? (
                    <>
                      <div className="ati-notification-list">
                        {notifications.map((item) => (
                          <article className={`ati-notification-item ${item.read ? "is-read" : "is-unread"}`} key={item.id}>
                            <span className={`ati-notification-kind kind-${item.kind}`}>
                              {item.kind === "success" ? <CloudCheck size={16} /> : item.kind === "warning" ? <CloudOff size={16} /> : <Info size={16} />}
                            </span>
                            <button type="button" className="ati-notification-content" onClick={() => markNotificationRead(item.id)}>
                              <strong>{item.title}</strong>
                              <span>{item.message}</span>
                              <small>{formatNotificationTime(item.createdAt)}</small>
                            </button>
                            {!item.read && <i className="ati-notification-unread-dot" />}
                          </article>
                        ))}
                      </div>
                      <footer className="ati-notification-panel-foot">
                        <span>{notifications.length} thông báo gần đây</span>
                        <button type="button" onClick={clearNotifications}><Trash2 size={13} /> Xóa tất cả</button>
                      </footer>
                    </>
                  ) : (
                    <div className="ati-notification-empty">
                      <span><Bell size={22} /></span>
                      <strong>Bạn đã cập nhật!</strong>
                      <p>Thông báo về trạng thái đồng bộ học tập sẽ xuất hiện tại đây.</p>
                    </div>
                  )}
                </section>
              )}
            </div>
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
                  <button type="button" role="menuitem" onClick={() => { setActiveTab("settings"); setAccountMenuOpen(false); }}>
                    <MonitorCog size={16} /><span>Cài đặt</span><ArrowRight size={14} />
                  </button>
                  <button type="button" role="menuitem" onClick={() => { setActiveTab("information"); setAccountMenuOpen(false); }}>
                    <CircleHelp size={16} /><span>Thông tin ATI</span><ArrowRight size={14} />
                  </button>
                  <div className="ati-account-divider" />
                  <button type="button" role="menuitem" className="ati-account-logout" onClick={() => { setAccountMenuOpen(false); void handleLogout(); }}>
                    <LogOut size={16} /><span>Đăng xuất</span>
                  </button>
                  <div className="ati-account-popover-foot">ATI GROUP · TECHNOLOGY - AI · KẾT NỐI CÔNG NGHỆ - KẾT NỐI TƯƠNG LAI</div>
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
              language={language}
            />
          )}
          {activeTab === "learning-dashboard" && (
            <LearningDashboard displayName={user.displayName || "bạn"} userId={user.uid} onNavigate={setActiveTab} language={language} />
          )}
          {activeTab === "checklist" && <Checklist onNavigate={setActiveTab} language={language} />}
          {activeTab === "statistics" && <Statistics language={language} />}
          {activeTab === "units" && <Units language={language} />}
          {activeTab === "listening" && <Listening language={language} />}
          {activeTab === "tenses" && <Tenses />}
          {activeTab === "irregular-verbs" && <IrregularVerbs language={language} />}
          {activeTab === "flashcards" && <Flashcards language={language} />}
          {activeTab === "cefr" && <CefrFlashcards language={language} />}

          {activeTab === "my-vocabulary" && <MyVocabulary language={language} />}

          {activeTab === "information" && <Information language={language} />}
          {activeTab === "ati-introduction" && <AtiLearnEnglishIntro language={language} onNavigate={setActiveTab} />}
          {activeTab === "profile" && <Profile syncStatus={learningSyncStatus} />}
          {activeTab === "settings" && (
            <Settings
              theme={theme}
              onThemeChange={setTheme}
              sidebarCollapsed={sidebarCollapsed}
              onSidebarCollapsedChange={setSidebarCollapsed}
              notificationsEnabled={notificationsEnabled}
              onNotificationsEnabledChange={setNotificationsEnabled}
              language={language}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
