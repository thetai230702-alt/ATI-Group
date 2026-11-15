import { ArrowRight, BrainCircuit, Cpu, Factory, GraduationCap, Layers3, Sparkles, Workflow, Zap } from "lucide-react";
import "./PublicHome.css";

interface PublicHomeProps { onLogin: () => void; onExplore: () => void; }
const areas = [
  { icon: Cpu, number: "01", title: "Technology", text: "Nền tảng số và các giải pháp phần mềm phục vụ công việc." },
  { icon: BrainCircuit, number: "02", title: "Artificial Intelligence", text: "Ứng dụng AI để tự động hóa và mở rộng khả năng sáng tạo." },
  { icon: Factory, number: "03", title: "Manufacturing", text: "Thiết kế kỹ thuật, chế tạo máy và tối ưu quy trình sản xuất." },
  { icon: GraduationCap, number: "04", title: "Learning", text: "Không gian học tập và phát triển năng lực liên tục." },
];
export default function PublicHome({ onLogin, onExplore }: PublicHomeProps) {
  return <main className="public-home">
    <header className="public-header">
      <a className="public-brand" href="/" aria-label="ATI Group"><img src="/ati-approved-logo.png" alt="ATI Group"/><span><strong>ATI GROUP</strong><small>TECHNOLOGY · AI · MANUFACTURING</small></span></a>
      <nav className="public-nav"><a href="#about">Về ATI</a><a href="#ecosystem">Hệ sinh thái</a><a href="#principles">Giá trị</a></nav>
      <button className="public-login-button" onClick={onLogin}>Đăng nhập <ArrowRight size={16}/></button>
    </header>
    <section className="public-hero">
      <div className="public-hero-grid"/>
      <div className="public-hero-copy">
        <div className="public-eyebrow"><span/> AN INTEGRATED TECHNOLOGY ECOSYSTEM</div>
        <h1>Kết nối công nghệ.<br/><em>Kiến tạo tương lai.</em></h1>
        <p>ATI Group phát triển hệ sinh thái kết nối công nghệ, trí tuệ nhân tạo, kỹ thuật chế tạo và học tập — biến ý tưởng thành những giải pháp có giá trị thực tiễn.</p>
        <div className="public-hero-actions"><button className="public-primary-cta" onClick={onLogin}>Khám phá nền tảng <ArrowRight size={18}/></button><button className="public-text-cta" onClick={onExplore}>Tìm hiểu về ATI <span>↓</span></button></div>
        <div className="public-hero-proof"><span><Zap size={15}/> Tư duy đổi mới</span><span><Workflow size={15}/> Kết nối đa lĩnh vực</span><span><Layers3 size={15}/> Phát triển bền vững</span></div>
      </div>
      <div className="public-hero-art" aria-label="ATI Group technology ecosystem"><div className="public-orbit orbit-one"/><div className="public-orbit orbit-two"/><div className="public-orbit orbit-three"/><div className="public-art-node node-ai"><BrainCircuit/><span>AI</span></div><div className="public-art-node node-tech"><Cpu/><span>TECH</span></div><div className="public-art-node node-mfg"><Factory/><span>MAKER</span></div><div className="public-art-core"><img src="/ati-approved-logo.png" alt=""/><small>BUILD · CONNECT · GROW</small></div><div className="public-art-caption"><i/> ECOSYSTEM OVERVIEW</div></div>
      <div className="public-hero-bottom"><span>ATI GROUP</span><span>INNOVATION THROUGH INTEGRATION</span><span>01 / 04</span></div>
    </section>
    <section className="public-intro" id="about"><div><span className="public-section-kicker">WHO WE ARE</span><h2>Một hệ sinh thái.<br/><em>Nhiều khả năng phát triển.</em></h2></div><p>Chúng tôi tin rằng công nghệ phát huy sức mạnh lớn nhất khi được kết nối. ATI Group từng bước xây dựng môi trường tích hợp, nơi tri thức, công cụ và giải pháp cùng hỗ trợ con người làm việc hiệu quả hơn.</p></section>
    <section className="public-ecosystem" id="ecosystem"><div className="public-section-heading"><div><span className="public-section-kicker">OUR ECOSYSTEM</span><h2>Các lĩnh vực trọng tâm</h2></div><span className="public-section-index">01 — 04</span></div><div className="public-area-grid">{areas.map(({icon:Icon,number,title,text})=><article className="public-area-card" key={number}><div className="public-area-top"><span>{number}</span><Icon size={24}/></div><h3>{title}</h3><p>{text}</p><span className="public-area-line"/></article>)}</div></section>
    <section className="public-principles" id="principles"><div className="public-principle-mark"><Layers3 size={27}/></div><div><span className="public-section-kicker">OUR APPROACH</span><h2>Không ngừng học hỏi.<br/>Không ngừng cải tiến.</h2></div><p>Tập trung vào tính ứng dụng, trải nghiệm người dùng và khả năng phát triển lâu dài — đó là nền tảng trong cách ATI xây dựng sản phẩm.</p></section>
    <section className="public-access"><div><span className="public-section-kicker">READY TO EXPLORE?</span><h2>Bắt đầu hành trình cùng ATI.</h2><p>Đăng nhập để truy cập các công cụ và không gian làm việc trong hệ sinh thái ATI Group.</p></div><button className="public-primary-cta" onClick={onLogin}>Đăng nhập hệ thống <ArrowRight size={18}/></button><Sparkles className="public-access-sparkle" size={90}/></section>
    <footer className="public-footer"><a className="public-brand" href="/"><img src="/ati-approved-logo.png" alt="ATI"/><span><strong>ATI GROUP</strong><small>TECHNOLOGY · AI · MANUFACTURING</small></span></a><span>© 2026 ATI Group. All rights reserved.</span><span>BUILD · CONNECT · GROW</span></footer>
  </main>;
}
