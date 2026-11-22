import { ArrowRight, BookOpen, Headphones, Layers, GraduationCap, ListChecks, Sparkles } from "lucide-react";
import "./AtiLearnEnglishIntro.css";

type IntroTab = "tenses" | "flashcards" | "irregular-verbs" | "units" | "listening" | "checklist";

interface AtiLearnEnglishIntroProps {
  language?: "vi" | "en";
  onNavigate: (tab: IntroTab) => void;
}

function AtiLearnEnglishIntro({ language = "vi", onNavigate }: AtiLearnEnglishIntroProps) {
  const isEnglish = language === "en";
  const theory = [
    { title: isEnglish ? "12 English Tenses" : "12 thì tiếng Anh", desc: isEnglish ? "Understand tense structures and usage." : "Nắm cấu trúc, cách dùng và ví dụ của 12 thì.", icon: GraduationCap, tab: "tenses" as const },
    { title: isEnglish ? "Vocabulary" : "Từ vựng", desc: isEnglish ? "Build vocabulary by topic and level." : "Mở rộng vốn từ theo chủ đề và cấp độ.", icon: Layers, tab: "flashcards" as const },
    { title: isEnglish ? "Irregular Verbs" : "Động từ bất quy tắc", desc: isEnglish ? "Learn base, past and past participle forms." : "Học V1, V2, V3 cùng phiên âm và nghĩa.", icon: BookOpen, tab: "irregular-verbs" as const },
  ];
  const practice = [
    { title: isEnglish ? "1,500 Sentence Practice" : "Luyện tập 1.500 câu", desc: isEnglish ? "Practice translating and responding sentence by sentence." : "Luyện dịch và phản xạ từng câu theo Unit.", icon: BookOpen, tab: "units" as const },
    { title: isEnglish ? "Listening" : "Luyện nghe", desc: isEnglish ? "Listen, repeat and improve your comprehension." : "Nghe câu mẫu, luyện phát âm và cải thiện khả năng nghe.", icon: Headphones, tab: "listening" as const },
    { title: isEnglish ? "Learning Checklist" : "Danh sách học tập", desc: isEnglish ? "Track your progress across all units." : "Theo dõi tiến độ, bài tập và nội dung cần ôn ở từng Unit.", icon: ListChecks, tab: "checklist" as const },
  ];

  return (
    <main className="ati-learn-intro">
      <section className="ati-learn-hero">
        <div className="ati-learn-eyebrow"><Sparkles size={15} /> ATI LEARN ENGLISH</div>
        <h1>{isEnglish ? "Learn English with a clear path" : "Học tiếng Anh theo lộ trình rõ ràng"}</h1>
        <p>{isEnglish ? "A structured learning space combining essential theory and practical English response training." : "Nền tảng học tiếng Anh được tổ chức thành từng phần rõ ràng: học lý thuyết, tích lũy từ vựng và luyện phản xạ qua 1.500 câu thực hành."}</p>
        <div className="ati-learn-hero-actions">
          <button type="button" onClick={() => onNavigate("units")}>{isEnglish ? "Start practicing" : "Bắt đầu luyện tập"}<ArrowRight size={17} /></button>
          <span>{isEnglish ? "Theory · Practice · Progress" : "Lý thuyết · Thực hành · Theo dõi tiến độ"}</span>
        </div>
      </section>

      <section className="ati-learn-section">
        <div className="ati-learn-section-heading"><span>01</span><div><h2>{isEnglish ? "Theory" : "Lý thuyết"}</h2><p>{isEnglish ? "Build a strong foundation before practicing." : "Xây dựng nền tảng ngữ pháp và từ vựng."}</p></div></div>
        <div className="ati-learn-cards">
          {theory.map(({ title, desc, icon: Icon, tab }) => <button className="ati-learn-card" key={tab} type="button" onClick={() => onNavigate(tab)}><span className="ati-learn-card-icon"><Icon size={21}/></span><strong>{title}</strong><p>{desc}</p><span className="ati-learn-card-link">{isEnglish ? "Explore" : "Khám phá"}<ArrowRight size={15}/></span></button>)}
        </div>
      </section>

      <section className="ati-learn-section">
        <div className="ati-learn-section-heading"><span>02</span><div><h2>{isEnglish ? "1,500 English Response Sentences" : "1.500 câu phản xạ tiếng Anh"}</h2><p>{isEnglish ? "Practice, listen and monitor your learning progress in one place." : "Tập trung luyện tập, luyện nghe và quản lý tiến độ của bộ 1.500 câu."}</p></div></div>
        <div className="ati-learn-cards">
          {practice.map(({ title, desc, icon: Icon, tab }) => <button className="ati-learn-card" key={tab} type="button" onClick={() => onNavigate(tab)}><span className="ati-learn-card-icon"><Icon size={21}/></span><strong>{title}</strong><p>{desc}</p><span className="ati-learn-card-link">{isEnglish ? "Open" : "Truy cập"}<ArrowRight size={15}/></span></button>)}
        </div>
      </section>
    </main>
  );
}

export default AtiLearnEnglishIntro;
