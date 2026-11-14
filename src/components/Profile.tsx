import { useEffect, useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  GraduationCap,
  House,
  Save,
  UserRound,
  Cloud,
  CloudCheck,
  CloudOff,
  LoaderCircle,
  Camera,
  X,
} from "lucide-react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref as storageRef, uploadBytes, deleteObject } from "firebase/storage";
import "./Profile.css";

type ProfileTab = "personal" | "work" | "education" | "family";
type ProfileData = {
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
  address: string;
  jobTitle: string;
  company: string;
  department: string;
  workAddress: string;
  school: string;
  major: string;
  degree: string;
  graduationYear: string;
  maritalStatus: string;
  emergencyContact: string;
  emergencyPhone: string;
  avatarData: string;
};

const emptyProfile: ProfileData = {
  fullName: "", displayName: "", email: "", phone: "", birthday: "",
  gender: "", address: "", jobTitle: "", company: "", department: "",
  workAddress: "", school: "", major: "", degree: "", graduationYear: "",
  maritalStatus: "", emergencyContact: "", emergencyPhone: "", avatarData: "",
};

const tabs: { id: ProfileTab; label: string; icon: typeof UserRound }[] = [
  { id: "personal", label: "Thông tin cá nhân", icon: UserRound },
  { id: "work", label: "Công việc", icon: BriefcaseBusiness },
  { id: "education", label: "Học vấn", icon: GraduationCap },
  { id: "family", label: "Gia đình", icon: House },
];

type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";

interface ProfileProps {
  syncStatus: SyncStatus;
}

function Profile({ syncStatus }: ProfileProps) {
  const user = auth.currentUser;
  const storageKey = `ntt-profile-${user?.uid ?? "guest"}`;
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...emptyProfile, ...JSON.parse(saved) } : emptyProfile;
    } catch {
      return emptyProfile;
    }
  });
  const [savedMessage, setSavedMessage] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [cloudStatus, setCloudStatus] = useState<"loading" | "ready" | "saving" | "synced" | "error">("loading");
  const [cloudMessage, setCloudMessage] = useState("Đang tải hồ sơ từ tài khoản ATI...");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const completionFields: (keyof ProfileData)[] = [
    "fullName", "displayName", "phone", "birthday", "gender", "address",
    "jobTitle", "company", "department", "school", "major", "degree",
  ];
  const completedFields = completionFields.filter((key) => Boolean(profile[key].trim())).length;
  const completionPercent = Math.round((completedFields / completionFields.length) * 100);

  useEffect(() => {
    setProfile((current) => ({
      ...current,
      fullName: current.fullName || user?.displayName || "",
      displayName: current.displayName || user?.displayName || "",
      email: current.email || user?.email || "",
    }));
  }, [user]);

  useEffect(() => {
    let active = true;
    const loadCloudProfile = async () => {
      if (!user) {
        setCloudStatus("error");
        setCloudMessage("Bạn cần đăng nhập để đồng bộ hồ sơ.");
        return;
      }
      setCloudStatus("loading");
      try {
        const snapshot = await getDoc(doc(db, "users", user.uid, "private", "profile"));
        if (!active) return;
        if (snapshot.exists()) {
          const cloudData = snapshot.data() as Partial<ProfileData> & { avatarUrl?: string };
          const merged = { ...emptyProfile, ...cloudData, email: user.email || cloudData.email || "" };
          if (cloudData.avatarUrl) merged.avatarData = cloudData.avatarUrl;
          setProfile((current) => ({ ...current, ...merged }));
          try { localStorage.setItem(storageKey, JSON.stringify(merged)); } catch { /* local cache is optional */ }
        }
        setCloudStatus("ready");
        setCloudMessage(snapshot.exists() ? "Hồ sơ đã được tải từ tài khoản ATI." : "Chưa có hồ sơ trên cloud. Hãy lưu để tạo hồ sơ.");
      } catch (error) {
        console.error("ATI cloud profile load failed:", error);
        if (!active) return;
        setCloudStatus("error");
        setCloudMessage("Không thể tải hồ sơ cloud. Kiểm tra Firestore Rules và kết nối.");
      }
    };
    void loadCloudProfile();
    return () => { active = false; };
  }, [user, storageKey]);

  const initials = useMemo(() => {
    const name = profile.fullName || user?.displayName || user?.email || "ATI";
    return name.split(/\s+/).slice(-2).map((part) => part[0]).join("").toUpperCase();
  }, [profile.fullName, user]);

  const update = (key: keyof ProfileData, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setSavedMessage("");
  };

  const saveProfile = async () => {
    if (!user) {
      setSavedMessage("Vui lòng đăng nhập để lưu hồ sơ.");
      return;
    }
    setCloudStatus("saving");
    setCloudMessage("Đang lưu hồ sơ lên cloud...");
    try {
      const { avatarData, ...profileFields } = profile;
      let avatarUrl = avatarData;
      if (avatarData.startsWith("data:image/")) {
        const response = await fetch(avatarData);
        const blob = await response.blob();
        const imageRef = storageRef(storage, `avatars/${user.uid}/profile.jpg`);
        await uploadBytes(imageRef, blob, { contentType: "image/jpeg" });
        avatarUrl = await getDownloadURL(imageRef);
      }
      const cloudProfile = {
        ...profileFields,
        avatarUrl: avatarUrl.startsWith("http") ? avatarUrl : "",
        uid: user.uid,
        email: user.email || profile.email,
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", user.uid, "private", "profile"), cloudProfile, { merge: true });
      const localProfile = { ...profile, avatarData: avatarUrl };
      setProfile(localProfile);
      localStorage.setItem(storageKey, JSON.stringify(localProfile));
      setCloudStatus("synced");
      setCloudMessage("Hồ sơ đã được đồng bộ với tài khoản ATI.");
      setSavedMessage("Đã lưu hồ sơ lên cloud thành công.");
    } catch (error) {
      console.error("ATI cloud profile save failed:", error);
      setCloudStatus("error");
      setCloudMessage("Lưu cloud thất bại. Kiểm tra Firestore/Storage Rules và cấu hình Firebase Storage.");
      setSavedMessage("Không thể đồng bộ cloud. Dữ liệu trên biểu mẫu vẫn được giữ lại.");
    }
  };

  const handleAvatarUpload = (file?: File) => {
    setAvatarError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAvatarError("Vui lòng chọn tệp hình ảnh.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Ảnh vượt quá 5 MB. Vui lòng chọn ảnh nhỏ hơn.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setAvatarError("Không thể đọc ảnh. Vui lòng thử lại.");
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => setAvatarError("Tệp ảnh không hợp lệ.");
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 320;
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (!context) {
          setAvatarError("Trình duyệt không hỗ trợ xử lý ảnh.");
          return;
        }
        const cropSize = Math.min(image.width, image.height);
        const sx = (image.width - cropSize) / 2;
        const sy = (image.height - cropSize) / 2;
        context.drawImage(image, sx, sy, cropSize, cropSize, 0, 0, size, size);
        const avatarData = canvas.toDataURL("image/jpeg", 0.84);
        const nextProfile = { ...profile, avatarData };
        setProfile(nextProfile);
        try {
          localStorage.setItem(storageKey, JSON.stringify(nextProfile));
          setSavedMessage("Ảnh đại diện đã được lưu trên thiết bị này.");
        } catch {
          setAvatarError("Không đủ dung lượng để lưu ảnh. Hãy chọn ảnh khác.");
        }
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    const nextProfile = { ...profile, avatarData: "" };
    setProfile(nextProfile);
    setAvatarError("");
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextProfile));
      setSavedMessage("Đã xóa ảnh trên thiết bị. Nhấn Lưu thay đổi để đồng bộ cloud.");
      if (user) {
        void deleteObject(storageRef(storage, `avatars/${user.uid}/profile.jpg`)).catch(() => undefined);
      }
    } catch {
      setAvatarError("Không thể lưu thay đổi. Vui lòng thử lại.");
    }
  };

  const field = (
    label: string,
    key: keyof ProfileData,
    placeholder: string,
    type: string = "text",
    readOnly = false,
  ) => (
    <label className="profile-field" key={key}>
      <span>{label}</span>
      <input
        type={type}
        value={profile[key]}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(event) => update(key, event.target.value)}
      />
    </label>
  );

  const selectField = (label: string, key: keyof ProfileData, options: string[]) => (
    <label className="profile-field" key={key}>
      <span>{label}</span>
      <select value={profile[key]} onChange={(event) => update(key, event.target.value)}>
        <option value="">-- Chọn --</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            {profile.avatarData ? <img src={profile.avatarData} alt="Ảnh đại diện" /> : initials}
          </div>
          <button type="button" className="profile-avatar-edit" onClick={() => avatarInputRef.current?.click()} aria-label="Tải ảnh đại diện">
            <Camera size={15} />
          </button>
          <input
            ref={avatarInputRef}
            className="profile-avatar-input"
            type="file"
            accept="image/*"
            onChange={(event) => {
              handleAvatarUpload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>
        <div className="profile-hero-copy">
          <span className="profile-eyebrow">ATI Group · ACCOUNT CENTER</span>
          <h2>{profile.fullName || user?.displayName || "Hồ sơ của tôi"}</h2>
          <p>{user?.email || "Cập nhật thông tin tài khoản và hồ sơ cá nhân của bạn."}</p>
        </div>
        <div className={`profile-sync-status profile-hero-sync is-${syncStatus}`} title={{
          idle: "Đang chờ kết nối để đồng bộ",
          syncing: "Đang đồng bộ dữ liệu học tập",
          synced: "Dữ liệu học tập đã được đồng bộ",
          offline: "Thiết bị đang ngoại tuyến",
          error: "Đồng bộ dữ liệu gặp lỗi",
        }[syncStatus]} aria-live="polite">
          {syncStatus === "syncing" ? <LoaderCircle className="sync-spin" size={15} /> :
           syncStatus === "synced" ? <CloudCheck size={15} /> :
           syncStatus === "offline" || syncStatus === "error" ? <CloudOff size={15} /> :
           <Cloud size={15} />}
          <span>{{
            idle: "Chờ đồng bộ",
            syncing: "Đang đồng bộ",
            synced: "Đã đồng bộ",
            offline: "Ngoại tuyến",
            error: "Lỗi đồng bộ",
          }[syncStatus]}</span>
        </div>
      </section>

      <section className={`profile-cloud-card is-${cloudStatus}`} aria-live="polite">
        <span className="profile-cloud-icon">
          {cloudStatus === "synced" ? <CloudCheck size={18} /> : cloudStatus === "error" ? <CloudOff size={18} /> : <Cloud size={18} />}
        </span>
        <div><strong>ATI Cloud Profile</strong><p>{cloudMessage}</p></div>
        <span className={`profile-cloud-pill is-${cloudStatus}`}>
          {cloudStatus === "loading" ? "Đang tải" : cloudStatus === "saving" ? "Đang lưu" : cloudStatus === "synced" ? "Đã đồng bộ" : cloudStatus === "error" ? "Chưa kết nối" : "Sẵn sàng"}
        </span>
      </section>

      <section className="profile-completion-card">
        <div className="profile-completion-top">
          <div>
            <span>PROFILE COMPLETION</span>
            <strong>Độ hoàn thiện hồ sơ</strong>
          </div>
          <b>{completionPercent}%</b>
        </div>
        <div className="profile-completion-track"><i style={{ width: `${completionPercent}%` }} /></div>
        <p>{completionPercent === 100 ? "Hồ sơ của bạn đã đầy đủ thông tin cơ bản." : `Bạn đã hoàn thành ${completedFields}/${completionFields.length} thông tin cơ bản. Bổ sung thêm để hoàn thiện hồ sơ ATI.`}</p>
        {avatarError && <div className="profile-avatar-error" role="alert">{avatarError}</div>}
        {profile.avatarData && (
          <button type="button" className="profile-avatar-remove" onClick={removeAvatar}><X size={13} /> Xóa ảnh đại diện</button>
        )}
      </section>

      <section className="profile-card">
        <div className="profile-card-heading">
          <div>
            <span className="profile-eyebrow">ACCOUNT PROFILE</span>
            <h3>Hồ sơ tài khoản</h3>
            <p>Quản lý thông tin cơ bản của bạn trong hệ sinh thái ATI Group.</p>
          </div>
          <button className="profile-save" type="button" onClick={saveProfile}>
            <Save size={16} /> Lưu thay đổi
          </button>
        </div>

        <div className="profile-tabs" role="tablist" aria-label="Nhóm thông tin hồ sơ">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              className={`profile-tab ${activeTab === id ? "active" : ""}`}
              key={id}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={16} /> <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="profile-form" role="tabpanel">
          {activeTab === "personal" && (
            <>
              <div className="profile-section-title"><UserRound size={17} /> Thông tin cá nhân</div>
              <div className="profile-grid">
                {field("Họ và tên", "fullName", "Nhập họ và tên")}
                {field("Tên hiển thị", "displayName", "Tên hiển thị trên hệ thống")}
                {field("Email tài khoản", "email", "Email đăng nhập", "email", true)}
                {field("Số điện thoại", "phone", "Nhập số điện thoại", "tel")}
                {field("Ngày sinh", "birthday", "", "date")}
                {selectField("Giới tính", "gender", ["Nam", "Nữ", "Khác", "Không muốn tiết lộ"])}
                {field("Địa chỉ", "address", "Số nhà, đường, phường/xã, tỉnh/thành")}
              </div>
            </>
          )}

          {activeTab === "work" && (
            <>
              <div className="profile-section-title"><BriefcaseBusiness size={17} /> Thông tin công việc</div>
              <div className="profile-grid">
                {field("Vị trí công việc", "jobTitle", "Ví dụ: Chuyên viên")}
                {field("Công ty / Tổ chức", "company", "Tên công ty")}
                {field("Phòng ban", "department", "Tên phòng ban")}
                {field("Địa chỉ làm việc", "workAddress", "Địa chỉ nơi làm việc")}
              </div>
            </>
          )}

          {activeTab === "education" && (
            <>
              <div className="profile-section-title"><GraduationCap size={17} /> Thông tin học vấn</div>
              <div className="profile-grid">
                {field("Trường học", "school", "Tên trường / cơ sở đào tạo")}
                {field("Chuyên ngành", "major", "Chuyên ngành học")}
                {field("Bằng cấp", "degree", "Ví dụ: Cử nhân")}
                {field("Năm tốt nghiệp", "graduationYear", "YYYY", "number")}
              </div>
            </>
          )}

          {activeTab === "family" && (
            <>
              <div className="profile-section-title"><House size={17} /> Thông tin gia đình</div>
              <div className="profile-grid">
                {selectField("Tình trạng hôn nhân", "maritalStatus", ["Độc thân", "Đã kết hôn", "Khác"])}
                {field("Người liên hệ khẩn cấp", "emergencyContact", "Họ tên người liên hệ")}
                {field("Số điện thoại liên hệ", "emergencyPhone", "Số điện thoại", "tel")}
              </div>
            </>
          )}
        </div>

        <div className="profile-card-footer">
          <span>{savedMessage || "Thông tin cá nhân chỉ hiển thị trong tài khoản của bạn trên thiết bị này."}</span>
          <button className="profile-save mobile-save" type="button" onClick={saveProfile}>
            <Save size={16} /> Lưu thay đổi
          </button>
        </div>
      </section>
    </div>
  );
}

export default Profile;
