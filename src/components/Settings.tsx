import { PanelLeft, Bell, Check, MonitorCog, Palette } from "lucide-react";
import "./Settings.css";

export type AtiTheme = "light" | "dark";

interface SettingsProps {
  theme: AtiTheme;
  onThemeChange: (theme: AtiTheme) => void;
  sidebarCollapsed: boolean;
  onSidebarCollapsedChange: (collapsed: boolean) => void;
  notificationsEnabled: boolean;
  onNotificationsEnabledChange: (enabled: boolean) => void;
  language?: "vi" | "en";
}

function Settings({
  theme,
  onThemeChange,
  sidebarCollapsed,
  onSidebarCollapsedChange,
  notificationsEnabled,
  onNotificationsEnabledChange,
  language = "vi",
}: SettingsProps) {
  return (
    <div className="ati-settings-page">
      <section className="ati-settings-hero">
        <span className="ati-settings-eyebrow"><MonitorCog size={14} /> PERSONAL WORKSPACE</span>
        <h2>{language === "en" ? 'ATI Workspace Settings' : 'Cài đặt không gian ATI'}</h2>
        <p>{language === "en" ? 'Customize the appearance and behavior of ATI to suit your workflow.' : 'Tùy chỉnh giao diện và cách ATI hoạt động theo thói quen của bạn.'}</p>
      </section>

      <section className="ati-settings-section">
        <div className="ati-settings-section-title">
          <span className="ati-settings-section-icon"><Palette size={18} /></span>
          <div><h3>{language === "en" ? 'Appearance' : 'Giao diện'}</h3><p>{language === "en" ? 'Choose how your workspace looks.' : 'Lựa chọn phong cách hiển thị cho không gian làm việc.'}</p></div>
        </div>
        <div className="ati-theme-options">
          <button type="button" className={`ati-theme-option ${theme === "light" ? "selected" : ""}`} onClick={() => onThemeChange("light")} aria-pressed={theme === "light"}>
            <span className="ati-theme-preview theme-preview-light"><i /><i /><i /></span>
            <span className="ati-theme-option-copy"><strong>{language === "en" ? 'Light mode' : 'Chế độ sáng'}</strong><small>{language === "en" ? 'White background with ATI blue' : 'Nền trắng, xanh ATI'}</small></span>
            {theme === "light" && <Check size={17} />}
          </button>
          <button type="button" className={`ati-theme-option ${theme === "dark" ? "selected" : ""}`} onClick={() => onThemeChange("dark")} aria-pressed={theme === "dark"}>
            <span className="ati-theme-preview theme-preview-dark"><i /><i /><i /></span>
            <span className="ati-theme-option-copy"><strong>{language === "en" ? 'Dark mode' : 'Chế độ tối'}</strong><small>{language === "en" ? 'Reduce screen brightness' : 'Giảm độ sáng màn hình'}</small></span>
            {theme === "dark" && <Check size={17} />}
          </button>
        </div>
      </section>

      <section className="ati-settings-section">
        <div className="ati-settings-section-title">
          <span className="ati-settings-section-icon"><PanelLeft size={18} /></span>
          <div><h3>{language === "en" ? 'Sidebar' : 'Thanh điều hướng'}</h3><p>{language === "en" ? 'Choose how the left menu is displayed.' : 'Chọn cách hiển thị menu bên trái.'}</p></div>
        </div>
        <button type="button" className="ati-settings-row" onClick={() => onSidebarCollapsedChange(!sidebarCollapsed)} aria-pressed={sidebarCollapsed}>
          <span className="ati-settings-row-icon"><PanelLeft size={17} /></span>
          <span className="ati-settings-row-copy"><strong>{language === "en" ? 'Collapse sidebar' : 'Thu gọn thanh bên'}</strong><small>{sidebarCollapsed ? "Menu đang ở chế độ thu gọn" : "Menu đang hiển thị đầy đủ"}</small></span>
          <span className={`ati-settings-switch ${sidebarCollapsed ? "on" : ""}`}><i /></span>
        </button>
      </section>

      <section className="ati-settings-section">
        <div className="ati-settings-section-title">
          <span className="ati-settings-section-icon"><Bell size={18} /></span>
          <div><h3>{language === "en" ? 'Notifications' : 'Thông báo'}</h3><p>{language === "en" ? 'Manage learning and sync notifications.' : 'Kiểm soát thông báo trạng thái học tập và đồng bộ.'}</p></div>
        </div>
        <button type="button" className="ati-settings-row" onClick={() => onNotificationsEnabledChange(!notificationsEnabled)} aria-pressed={notificationsEnabled}>
          <span className="ati-settings-row-icon"><Bell size={17} /></span>
          <span className="ati-settings-row-copy"><strong>{language === "en" ? 'In-app notifications' : 'Thông báo trong ứng dụng'}</strong><small>{notificationsEnabled ? "Đang bật thông báo trạng thái đồng bộ" : "Đang tắt thông báo mới"}</small></span>
          <span className={`ati-settings-switch ${notificationsEnabled ? "on" : ""}`}><i /></span>
        </button>
      </section>

      <p className="ati-settings-footnote">{language === "en" ? 'These settings are saved in this browser. Some preferences are not synced across devices.' : 'Các tùy chọn được lưu trên trình duyệt hiện tại. Một số tùy chỉnh chưa đồng bộ giữa các thiết bị.'}</p>
    </div>
  );
}

export default Settings;
