import {
  Award,
  BookOpen,
  BookPlus,
  BookMarked,
  ChevronDown,
  ClipboardCheck,
  ChartNoAxesCombined,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  Info,
  Layers,
  UserRound,
  Settings as SettingsIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./Sidebar.css";

export type TabType =
  | "dashboard"
  | "learning-dashboard"
  | "checklist"
  | "statistics"
  | "units"
  | "listening"
  | "flashcards"
  | "cefr"
  | "tenses"
  | "irregular-verbs"
  | "my-vocabulary"
  | "information"
  | "profile"
  | "settings";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  collapsed: boolean;
  onToggle: () => void;
  language?: "vi" | "en";
}

type LearningItem = {
  id: TabType;
  label: string;
  description: string;
  icon: typeof GraduationCap;
};

type LearningGroup = {
  id: "overview" | "practice" | "vocabulary";
  label: string;
  items: LearningItem[];
};

const learningGroups: LearningGroup[] = [
  {
    id: "overview",
    label: "TỔNG QUAN",
    items: [
      { id: "learning-dashboard", label: "Learning Overview", description: "Your learning dashboard", icon: GraduationCap },
      { id: "checklist", label: "Learning Checklist", description: "Progress and daily goals", icon: ClipboardCheck },
      { id: "statistics", label: "Learning Statistics", description: "Track your results", icon: ChartNoAxesCombined },
    ],
  },
  {
    id: "practice",
    label: "LUYỆN TẬP",
    items: [
      { id: "units", label: "1,500 Sentences", description: "Practice English by unit", icon: BookOpen },
      { id: "listening", label: "Listening Practice", description: "Listening and pronunciation", icon: Headphones },
      { id: "tenses", label: "12 English Tenses", description: "Grammar rules and examples", icon: BookMarked },
      { id: "irregular-verbs", label: "Irregular Verbs", description: "Learn V1, V2 and V3 step by step", icon: BookOpen },
    ],
  },
  {
    id: "vocabulary",
    label: "TỪ VỰNG",
    items: [
      { id: "flashcards", label: "Vocabulary Flashcards", description: "Learn words by topic", icon: Layers },
      { id: "cefr", label: "CEFR Vocabulary", description: "Build A1–C2 vocabulary", icon: Award },
      { id: "my-vocabulary", label: "My Vocabulary", description: "Your saved words", icon: BookPlus },
    ],
  },
];

function Sidebar({ activeTab, onTabChange, collapsed, onToggle, language = "vi" }: SidebarProps) {
  const isEnglish = language === "en";
  const [learningOpen, setLearningOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<LearningGroup["id"], boolean>>({
    overview: true,
    practice: true,
    vocabulary: true,
  });

  const activeGroup = learningGroups.find((group) =>
    group.items.some((item) => item.id === activeTab)
  );

  useEffect(() => {
    if (activeGroup) {
      setLearningOpen(true);
      setOpenGroups((current) => ({ ...current, [activeGroup.id]: true }));
    }
  }, [activeTab]);

  const toggleGroup = (groupId: LearningGroup["id"]) => {
    setOpenGroups((current) => ({ ...current, [groupId]: !current[groupId] }));
  };

  const renderLearningItem = (item: LearningItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const vietnameseLabels: Partial<Record<TabType, string>> = {
      "learning-dashboard": "Tổng quan học tập",
      checklist: "Danh sách học tập",
      statistics: "Thống kê học tập",
      units: "Luyện tập 1.500 câu",
      listening: "Luyện nghe",
      tenses: "12 thì tiếng Anh",
      "irregular-verbs": "Động từ bất quy tắc",
      flashcards: "Flashcard từ vựng",
      cefr: "Từ vựng CEFR",
      "my-vocabulary": "Từ vựng của tôi",
    };
    const label = isEnglish ? item.label : (vietnameseLabels[item.id] ?? item.label);
    return (
      <button
        key={item.id}
        className={`menu-item ${isActive ? "active" : ""}`}
        onClick={() => onTabChange(item.id)}
        title={collapsed ? item.label : undefined}
        aria-current={isActive ? "page" : undefined}
        type="button"
      >
        <span className="menu-icon"><Icon size={18} strokeWidth={2} /></span>
        {!collapsed && (
          <span className="menu-item-text">
            <span>{label}</span>
          </span>
        )}
        {isActive && <span className="active-indicator" />}
      </button>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-brand-row">
        <button
          className="sidebar-logo"
          type="button"
          onClick={onToggle}
          title={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
        >
          <img className="ntt-mark" src="/ati-approved-logo.png" alt="ATI" />
          {!collapsed && (
            <span className="logo-text">
              <strong>GROUP</strong>
              <small>TECHNOLOGY · AI</small>
            </span>
          )}
        </button>
      </div>

      <div className="sidebar-scroll">
        {!collapsed && <p className="menu-heading">{isEnglish ? "WORKSPACE" : "KHÔNG GIAN LÀM VIỆC"}</p>}
        <button
          type="button"
          className={`menu-item dashboard-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => onTabChange("dashboard")}
          title={collapsed ? "Tổng quan ATI Group" : undefined}
          aria-current={activeTab === "dashboard" ? "page" : undefined}
        >
          <span className="menu-icon"><LayoutDashboard size={18} strokeWidth={2} /></span>
          {!collapsed && (
            <span className="menu-item-text">
              <span>{isEnglish ? "ATI Group Overview" : "Trang chủ ATI Group"}</span>
              <small>{isEnglish ? "Open the ecosystem home" : "Mở trang chủ hệ sinh thái"}</small>
            </span>
          )}
          {activeTab === "dashboard" && <span className="active-indicator" />}
        </button>

        {!collapsed && <p className="menu-heading module-menu-heading">{isEnglish ? "MODULES" : "PHÂN HỆ"}</p>}
        <div className={`module-tree ${learningOpen ? "module-tree-open" : ""}`}>
          <button
            type="button"
            className={`module-heading ${activeGroup ? "module-active" : ""}`}
            onClick={() => {
              if (collapsed) {
                setLearningOpen(true);
                onToggle();
              } else {
                setLearningOpen((value) => !value);
              }
            }}
            title={collapsed ? "English Master" : undefined}
            aria-expanded={learningOpen}
          >
            <span className="module-heading-icon"><GraduationCap size={19} /></span>
            {!collapsed && <span className="module-heading-label">{isEnglish ? "ENGLISH MASTER" : "HỌC TIẾNG ANH"}</span>}
            {!collapsed && <ChevronDown size={16} className={`module-chevron ${learningOpen ? "open" : ""}`} />}
          </button>

          {learningOpen && (
            <nav className="sidebar-menu learning-groups" aria-label={isEnglish ? "English Master features" : "Các chức năng học tiếng Anh"}>
            {learningGroups.map((group) => {
              const groupIsActive = group.items.some((item) => item.id === activeTab);
              const groupIsOpen = openGroups[group.id];
              return (
                <section className={`learning-nav-group ${groupIsActive ? "has-active-item" : ""}`} key={group.id}>
                  {!collapsed && (
                    <button
                      type="button"
                      className="learning-group-toggle"
                      onClick={() => toggleGroup(group.id)}
                      aria-expanded={groupIsOpen}
                      aria-controls={`learning-group-${group.id}`}
                    >
                      <span>{isEnglish ? ({ overview: "OVERVIEW", practice: "PRACTICE", vocabulary: "VOCABULARY" } as const)[group.id] : group.label}</span>
                      <ChevronDown size={13} className={groupIsOpen ? "group-chevron open" : "group-chevron"} />
                    </button>
                  )}
                  {(collapsed || groupIsOpen) && (
                    <div className="learning-group-items" id={`learning-group-${group.id}`}>
                      {group.items.map(renderLearningItem)}
                    </div>
                  )}
                </section>
              );
            })}
            </nav>
          )}
        </div>

        <div className="sidebar-account-section">
          {!collapsed && <p className="menu-heading account-heading">{isEnglish ? "ACCOUNT" : "TÀI KHOẢN"}</p>}
          <button
            type="button"
            className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => onTabChange("profile")}
            title={collapsed ? "Hồ sơ tài khoản" : undefined}
            aria-current={activeTab === "profile" ? "page" : undefined}
          >
            <span className="menu-icon"><UserRound size={18} strokeWidth={2} /></span>
            {!collapsed && (
              <span className="menu-item-text">
                <span>{isEnglish ? "My Profile" : "Hồ sơ tài khoản"}</span>
                <small>{isEnglish ? "Personal details & settings" : "Thông tin cá nhân & cài đặt"}</small>
              </span>
            )}
            {activeTab === "profile" && <span className="active-indicator" />}
          </button>
          <button
            type="button"
            className={`menu-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => onTabChange("settings")}
            title={collapsed ? (isEnglish ? "Settings" : "Cài đặt") : undefined}
            aria-current={activeTab === "settings" ? "page" : undefined}
          >
            <span className="menu-icon"><SettingsIcon size={18} strokeWidth={2} /></span>
            {!collapsed && (
              <span className="menu-item-text">
                <span>{isEnglish ? "Settings" : "Cài đặt"}</span>
                <small>{isEnglish ? "Customize your workspace" : "Tùy chỉnh hệ thống"}</small>
              </span>
            )}
            {activeTab === "settings" && <span className="active-indicator" />}
          </button>
        </div>

        <div className="sidebar-platform-section">
          {!collapsed && <p className="menu-heading platform-heading">ATI GROUP</p>}
          <button
            type="button"
            className={`menu-item ${activeTab === "information" ? "active" : ""}`}
            onClick={() => onTabChange("information")}
            title={collapsed ? "Về ATI Group" : undefined}
            aria-current={activeTab === "information" ? "page" : undefined}
          >
            <span className="menu-icon"><Info size={18} strokeWidth={2} /></span>
            {!collapsed && (
              <span className="menu-item-text">
                <span>{isEnglish ? "About ATI Group" : "Giới thiệu ATI Group"}</span>
                <small>{isEnglish ? "Ecosystem information" : "Thông tin hệ sinh thái"}</small>
              </span>
            )}
            {activeTab === "information" && <span className="active-indicator" />}
          </button>
        </div>


      </div>

      {!collapsed && (
        <div className="sidebar-footer">
          <img className="sidebar-footer-mark" src="/ati-approved-logo.png" alt="ATI" />
          <div className="sidebar-footer-text">
            <strong>ATI Group</strong>
            <p>{isEnglish ? "Develop without limits." : "Phát triển không giới hạn."}</p>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
