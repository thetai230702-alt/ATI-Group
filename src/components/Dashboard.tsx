import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  ChartNoAxesCombined,
  Headphones,
  Layers,
  Bot,
  Boxes,
  Building2,
  Cpu,
  GraduationCap,
  Layers3,
  Mic2,
  Network,
  Settings2,
  Sparkles,
  Star,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  getStudyActivity,
  getStudyStreak,
  getLastSevenDays,
  STUDY_ACTIVITY_EVENT,
} from "../services/studyGoals";
import type { TabType } from "./Sidebar";
import "./Dashboard.css";

type DashboardProps = {
  displayName: string;
  onNavigate: (tab: TabType) => void;
  language?: "vi" | "en";
};

const modules = [
  {
    title: "ATI Learning",
    subtitle: "Nền tảng học tập & phát triển năng lực",
    description: "Hệ thống học tiếng Anh, luyện nghe, từ vựng và theo dõi lộ trình cá nhân.",
    status: "Đang hoạt động",
    active: true,
    icon: GraduationCap,
    tone: "learning",
    action: "learning-dashboard" as TabType,
    actionLabel: "Mở phân hệ",
    tags: ["English Learning", "Learning Analytics"],
  },
  {
    title: "ATI Technology",
    subtitle: "Công nghệ & giải pháp phần mềm",
    description: "Định hướng phát triển ứng dụng, nền tảng số và các giải pháp công nghệ.",
    status: "Định hướng phát triển",
    active: false,
    icon: Cpu,
    tone: "technology",
    tags: ["Software", "Digital Solutions"],
  },
  {
    title: "ATI Manufacturing",
    subtitle: "Cơ khí & chế tạo máy",
    description: "Không gian phát triển công cụ kỹ thuật, thiết kế cơ khí và tự động hóa sản xuất.",
    status: "Định hướng phát triển",
    active: false,
    icon: Boxes,
    tone: "manufacturing",
    tags: ["Mechanical Design", "Automation"],
  },
  {
    title: "ATI Studio",
    subtitle: "Sáng tạo nội dung & truyền thông",
    description: "Định hướng xây dựng công cụ hỗ trợ sáng tạo, quản lý và phát triển nội dung.",
    status: "Sắp ra mắt",
    active: false,
    icon: Mic2,
    tone: "studio",
    tags: ["Creative", "Media"],
  },
  {
    title: "ATI Business",
    subtitle: "Quản trị & vận hành doanh nghiệp",
    description: "Định hướng tích hợp quy trình, dữ liệu và các công cụ quản lý vận hành.",
    status: "Sắp ra mắt",
    active: false,
    icon: Building2,
    tone: "business",
    tags: ["ERP", "Business Operations"],
  },
];

const quickLinks: { id: string; title: string; description: string; tab: TabType; icon: typeof BookOpen }[] = [
  { id: "units", title: "Luyện tập 1.500 câu", description: "Thực hành dịch câu", tab: "units", icon: BookOpen },
  { id: "listening", title: "Luyện nghe", description: "Nghe và luyện phát âm", tab: "listening", icon: Headphones },
  { id: "flashcards", title: "Flashcards", description: "Ôn tập từ vựng", tab: "flashcards", icon: Layers },
  { id: "checklist", title: "Checklist học tập", description: "Theo dõi mục tiêu", tab: "checklist", icon: ClipboardCheck },
];

function Dashboard({ displayName, onNavigate, language = "vi" }: DashboardProps) {
  const favoriteStorageKey = `ati-favorites-${auth.currentUser?.uid ?? "guest"}`;
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);
  const [activityRefresh, setActivityRefresh] = useState(0);

  useEffect(() => {
    const refreshActivity = () => setActivityRefresh((value) => value + 1);
    window.addEventListener("storage", refreshActivity);
    window.addEventListener(STUDY_ACTIVITY_EVENT, refreshActivity);
    window.addEventListener("focus", refreshActivity);
    return () => {
      window.removeEventListener("storage", refreshActivity);
      window.removeEventListener(STUDY_ACTIVITY_EVENT, refreshActivity);
      window.removeEventListener("focus", refreshActivity);
    };
  }, []);

  const activitySummary = (() => {
    void activityRefresh;
    const activity = getStudyActivity();
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    const days = getLastSevenDays(activity);
    return {
      today: activity[todayKey] ?? 0,
      streak: getStudyStreak(activity),
      days,
      week: days.reduce((sum, day) => sum + day.count, 0),
      max: Math.max(1, ...days.map((day) => day.count)),
    };
  })();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(favoriteStorageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      setFavorites(Array.isArray(parsed) ? parsed.filter((id): id is string =>
        quickLinks.some((link) => link.id === id)
      ) : []);
    } catch {
      setFavorites([]);
    } finally {
      setFavoritesReady(true);
    }
  }, [favoriteStorageKey]);

  useEffect(() => {
    if (!favoritesReady) return;
    try {
      localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
    } catch {
      // Favorites remain usable for the current session if storage is unavailable.
    }
  }, [favorites, favoritesReady, favoriteStorageKey]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const firstName = displayName.trim().split(/\s+/).slice(-1)[0] || "bạn";
  const activeModules = modules.filter((module) => module.active).length;

  return (
    <div className="ati-group-overview">
      <section className="ati-overview-hero">
        <div className="ati-overview-hero-copy">
          <span className="ati-overview-eyebrow"><Sparkles size={13} /> ATI GROUP · TECHNOLOGY - AI</span>
          <h2>{language === "en" ? `Hello, ${firstName}!` : `Xin chào, ${firstName}!`}</h2>
          <p>
            {language === "en"
              ? "Welcome to ATI Group — Kết nối công nghệ - Kiến tạo tương lai."
              : "Chào mừng bạn đến với ATI Group — Kết nối công nghệ - Kiến tạo tương lai."}
          </p>
          <div className="ati-overview-hero-meta">
            <span><Network size={14} /> Một nền tảng · Nhiều hệ sinh thái</span>
            <span><Layers3 size={14} /> Phát triển theo từng phân hệ</span>
          </div>
          <button
            type="button"
            className="ati-hero-primary-action"
            onClick={() => onNavigate("learning-dashboard")}
          >
            {language === "en" ? "Explore learning space" : "Khám phá không gian học tập"} <ArrowRight size={15} />
          </button>
        </div>
        <div className="ati-overview-hero-art" aria-hidden="true">
          <div className="ati-orbit orbit-a" />
          <div className="ati-orbit orbit-b" />
          <div className="ati-orbit orbit-c" />
          <div className="ati-core"><img src="/ati-approved-logo.png" alt="" /></div>
          <span className="ati-node node-ai"><Bot size={21} /></span>
          <span className="ati-node node-tech"><Cpu size={20} /></span>
          <span className="ati-node node-build"><Workflow size={20} /></span>
        </div>
      </section>

      <section className="ati-command-activity" aria-label="Hoạt động gần đây">
        <div className="ati-command-activity-main">
          <div className="ati-command-activity-heading">
            <span>ATI ACTIVITY</span>
            <strong>{language === "en" ? "Your activity pulse" : "Nhịp độ hoạt động của bạn"}</strong>
            <small>{language === "en" ? "Practice activity recorded on this device" : "Dữ liệu luyện tập được ghi nhận trên thiết bị này"}</small>
          </div>
          <div className="ati-command-metrics">
            <article><span className="activity-metric-icon"><ClipboardCheck size={17} /></span><div><small>{language === "en" ? "Today" : "Hôm nay"}</small><strong>{activitySummary.today.toLocaleString("vi-VN")}</strong><em>{language === "en" ? "sentence checks" : "lượt kiểm tra câu"}</em></div></article>
            <article><span className="activity-metric-icon streak"><Sparkles size={17} /></span><div><small>{language === "en" ? "Study streak" : "Chuỗi học tập"}</small><strong>{activitySummary.streak}</strong><em>{language === "en" ? "consecutive days" : "ngày liên tiếp"}</em></div></article>
            <article><span className="activity-metric-icon week"><ChartNoAxesCombined size={17} /></span><div><small>{language === "en" ? "Last 7 days" : "7 ngày qua"}</small><strong>{activitySummary.week.toLocaleString("vi-VN")}</strong><em>lượt kiểm tra câu</em></div></article>
          </div>
        </div>
        <div className="ati-command-week" aria-label="Biểu đồ hoạt động 7 ngày">
          <div className="ati-command-week-head"><strong>{language === "en" ? "Last 7 days" : "7 ngày gần nhất"}</strong><span>{language === "en" ? "PRACTICE" : "LUYỆN TẬP"}</span></div>
          <div className="ati-command-bars">
            {activitySummary.days.map((day) => (
              <div className="ati-command-bar-day" key={day.date} title={`${day.date}: ${day.count} lượt`}>
                <strong>{day.count || ""}</strong>
                <div><i style={{ height: `${day.count ? Math.max(8, Math.round(day.count / activitySummary.max * 100)) : 0}%` }} /></div>
                <small>{day.label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ati-overview-summary">
        <article>
          <span className="ati-summary-icon"><Layers3 size={19} /></span>
          <div><small>Hệ sinh thái</small><strong>{modules.length} phân hệ</strong><em>Các mảng phát triển của ATI</em></div>
        </article>
        <article>
          <span className="ati-summary-icon active"><Workflow size={19} /></span>
          <div><small>Đang vận hành</small><strong>{activeModules} phân hệ</strong><em>ATI Learning hiện đang hoạt động</em></div>
        </article>
        <article>
          <span className="ati-summary-icon"><Settings2 size={19} /></span>
          <div><small>Định hướng</small><strong>Technology - AI</strong><em>Kết nối công nghệ - Kiến tạo tương lai</em></div>
        </article>
      </section>

      {favorites.length > 0 && (
        <section className="ati-favorites-section" aria-label="Tính năng yêu thích">
          <div className="ati-favorites-heading">
            <div><span>YOUR FAVORITES</span><h3>Truy cập yêu thích</h3></div>
            <span>{favorites.length} mục đã ghim</span>
          </div>
          <div className="ati-favorites-grid">
            {quickLinks.filter((link) => favorites.includes(link.id)).map((link) => {
              const Icon = link.icon;
              return (
                <article className="ati-favorite-card" key={link.id}>
                  <button type="button" className="ati-favorite-open" onClick={() => onNavigate(link.tab)}>
                    <span className="ati-quick-icon"><Icon size={19} /></span>
                    <span><strong>{link.title}</strong><small>{link.description}</small></span>
                    <ArrowRight size={15} />
                  </button>
                  <button
                    type="button"
                    className="ati-favorite-remove"
                    onClick={() => toggleFavorite(link.id)}
                    aria-label={`Bỏ yêu thích ${link.title}`}
                    title="Bỏ khỏi yêu thích"
                  ><Star size={16} fill="currentColor" /></button>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="ati-quick-access" aria-label="Truy cập nhanh">
        <div className="ati-quick-access-heading">
          <div><span>QUICK ACCESS</span><h3>Lối tắt công việc</h3></div>
          <small>Ghim ngôi sao để tạo danh sách yêu thích</small>
        </div>
        <div className="ati-quick-access-grid">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            const isFavorite = favorites.includes(link.id);
            return (
              <article className="ati-quick-card" key={link.id}>
                <button type="button" className="ati-quick-open" onClick={() => onNavigate(link.tab)}>
                  <span className="ati-quick-icon"><Icon size={19} /></span>
                  <span><strong>{link.title}</strong><small>{link.description}</small></span>
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  className={`ati-quick-favorite ${isFavorite ? "is-favorite" : ""}`}
                  onClick={() => toggleFavorite(link.id)}
                  aria-label={`${isFavorite ? "Bỏ" : "Thêm"} ${link.title} ${isFavorite ? "khỏi" : "vào"} yêu thích`}
                  aria-pressed={isFavorite}
                  title={isFavorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
                ><Star size={15} fill={isFavorite ? "currentColor" : "none"} /></button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="ati-overview-section">
        <div className="ati-overview-section-heading">
          <div>
            <span>ATI ECOSYSTEM</span>
            <h3>Các phân hệ trong ATI Group</h3>
            <p>Chọn một phân hệ để truy cập không gian làm việc tương ứng.</p>
          </div>
          <span className="ati-module-count">{modules.length} MODULES</span>
        </div>

        <div className="ati-module-grid">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <article className={`ati-module-card ati-module-${module.tone} ${module.active ? "is-active" : "is-planned"}`} key={module.title}>
                <div className="ati-module-card-top">
                  <span className="ati-module-icon"><Icon size={23} /></span>
                  <span className={`ati-module-status ${module.active ? "status-active" : "status-planned"}`}>
                    <i /> {module.status}
                  </span>
                </div>
                <div className="ati-module-copy">
                  <h4>{module.title}</h4>
                  <strong>{module.subtitle}</strong>
                  <p>{module.description}</p>
                </div>
                <div className="ati-module-tags">
                  {module.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                {module.active && module.action ? (
                  <button
                    type="button"
                    className="ati-module-action"
                    onClick={() => onNavigate(module.action!)}
                  >
                    {module.actionLabel} <ArrowRight size={16} />
                  </button>
                ) : (
                  <div className="ati-module-coming"><span>Đang trong lộ trình phát triển</span><ArrowRight size={15} /></div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <footer className="ati-overview-footer">
        <div className="ati-footer-mark"><img src="/ati-approved-logo.png" alt="ATI" /></div>
        <div><strong>ATI Group</strong><p>Technology - AI</p></div>
        <span>Kết nối công nghệ - Kiến tạo tương lai</span>
      </footer>
    </div>
  );
}

export default Dashboard;
