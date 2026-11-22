import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpDown, ArrowUp, ArrowDown, BookOpen, Check, CheckCircle2, CircleHelp, Layers3, Search, Shuffle, Volume2, X, Keyboard, Settings2, Play } from "lucide-react";
import "./IrregularVerbs.css";
import { recordLearningActivity } from "../services/learningActivity";

type Level = "easy" | "medium" | "hard";
type Verb = { id:number; base:string; past:string; participle:string; ipa:[string,string,string]; meaning:string; level:Level };
type StudyMode = "cards" | "typing" | "quiz";
const VERBS: Verb[] = [

  {id:1,base:"be",past:"was / were",participle:"been",ipa:["/biː/","/wʌz/ · /wɝː/","/bɪn/"],meaning:"thì, là, ở",level:"easy"},
  {id:2,base:"become",past:"became",participle:"become",ipa:["/bɪˈkʌm/","/bɪˈkeɪm/","/bɪˈkʌm/"],meaning:"trở thành",level:"easy"},
  {id:3,base:"begin",past:"began",participle:"begun",ipa:["/bɪˈɡɪn/","/bɪˈɡæn/","/bɪˈɡʌn/"],meaning:"bắt đầu",level:"easy"},
  {id:4,base:"break",past:"broke",participle:"broken",ipa:["/breɪk/","/broʊk/","/ˈbroʊkən/"],meaning:"làm vỡ, phá vỡ",level:"easy"},
  {id:5,base:"bring",past:"brought",participle:"brought",ipa:["/brɪŋ/","/brɔːt/","/brɔːt/"],meaning:"mang, đem đến",level:"easy"},
  {id:6,base:"build",past:"built",participle:"built",ipa:["/bɪld/","/bɪlt/","/bɪlt/"],meaning:"xây dựng",level:"easy"},
  {id:7,base:"buy",past:"bought",participle:"bought",ipa:["/baɪ/","/bɔːt/","/bɔːt/"],meaning:"mua",level:"easy"},
  {id:8,base:"come",past:"came",participle:"come",ipa:["/kʌm/","/keɪm/","/kʌm/"],meaning:"đến",level:"easy"},
  {id:9,base:"do",past:"did",participle:"done",ipa:["/duː/","/dɪd/","/dʌn/"],meaning:"làm",level:"easy"},
  {id:10,base:"drink",past:"drank",participle:"drunk",ipa:["/drɪŋk/","/dræŋk/","/drʌŋk/"],meaning:"uống",level:"easy"},
  {id:11,base:"drive",past:"drove",participle:"driven",ipa:["/draɪv/","/droʊv/","/ˈdrɪvən/"],meaning:"lái xe",level:"easy"},
  {id:12,base:"eat",past:"ate",participle:"eaten",ipa:["/iːt/","/eɪt/","/ˈiːtən/"],meaning:"ăn",level:"easy"},
  {id:13,base:"fall",past:"fell",participle:"fallen",ipa:["/fɔːl/","/fel/","/ˈfɔːlən/"],meaning:"ngã, rơi",level:"easy"},
  {id:14,base:"feel",past:"felt",participle:"felt",ipa:["/fiːl/","/felt/","/felt/"],meaning:"cảm thấy",level:"easy"},
  {id:15,base:"find",past:"found",participle:"found",ipa:["/faɪnd/","/faʊnd/","/faʊnd/"],meaning:"tìm thấy",level:"easy"},
  {id:16,base:"get",past:"got",participle:"gotten",ipa:["/ɡet/","/ɡɑːt/","/ˈɡɑːtən/"],meaning:"nhận được, có được",level:"easy"},
  {id:17,base:"give",past:"gave",participle:"given",ipa:["/ɡɪv/","/ɡeɪv/","/ˈɡɪvən/"],meaning:"đưa, tặng",level:"easy"},
  {id:18,base:"go",past:"went",participle:"gone",ipa:["/ɡoʊ/","/went/","/ɡɔːn/"],meaning:"đi",level:"easy"},
  {id:19,base:"have",past:"had",participle:"had",ipa:["/hæv/","/hæd/","/hæd/"],meaning:"có",level:"easy"},
  {id:20,base:"hear",past:"heard",participle:"heard",ipa:["/hɪr/","/hɝːd/","/hɝːd/"],meaning:"nghe thấy",level:"easy"},
  {id:21,base:"know",past:"knew",participle:"known",ipa:["/noʊ/","/nuː/","/noʊn/"],meaning:"biết",level:"easy"},
  {id:22,base:"leave",past:"left",participle:"left",ipa:["/liːv/","/left/","/left/"],meaning:"rời đi, để lại",level:"easy"},
  {id:23,base:"make",past:"made",participle:"made",ipa:["/meɪk/","/meɪd/","/meɪd/"],meaning:"làm, tạo ra",level:"easy"},
  {id:24,base:"meet",past:"met",participle:"met",ipa:["/miːt/","/met/","/met/"],meaning:"gặp gỡ",level:"easy"},
  {id:25,base:"read",past:"read",participle:"read",ipa:["/riːd/","/red/","/red/"],meaning:"đọc",level:"easy"},
  {id:26,base:"run",past:"ran",participle:"run",ipa:["/rʌn/","/ræn/","/rʌn/"],meaning:"chạy",level:"easy"},
  {id:27,base:"say",past:"said",participle:"said",ipa:["/seɪ/","/sed/","/sed/"],meaning:"nói",level:"easy"},
  {id:28,base:"see",past:"saw",participle:"seen",ipa:["/siː/","/sɔː/","/siːn/"],meaning:"nhìn thấy",level:"easy"},
  {id:29,base:"sit",past:"sat",participle:"sat",ipa:["/sɪt/","/sæt/","/sæt/"],meaning:"ngồi",level:"easy"},
  {id:30,base:"sleep",past:"slept",participle:"slept",ipa:["/sliːp/","/slept/","/slept/"],meaning:"ngủ",level:"easy"},
  {id:31,base:"speak",past:"spoke",participle:"spoken",ipa:["/spiːk/","/spoʊk/","/ˈspoʊkən/"],meaning:"nói, phát biểu",level:"easy"},
  {id:32,base:"take",past:"took",participle:"taken",ipa:["/teɪk/","/tʊk/","/ˈteɪkən/"],meaning:"lấy, mang theo",level:"easy"},
  {id:33,base:"tell",past:"told",participle:"told",ipa:["/tel/","/toʊld/","/toʊld/"],meaning:"kể, bảo",level:"easy"},
  {id:34,base:"think",past:"thought",participle:"thought",ipa:["/θɪŋk/","/θɔːt/","/θɔːt/"],meaning:"nghĩ",level:"easy"},
  {id:35,base:"understand",past:"understood",participle:"understood",ipa:["/ˌʌndərˈstænd/","/ˌʌndərˈstʊd/","/ˌʌndərˈstʊd/"],meaning:"hiểu",level:"easy"},
  {id:36,base:"wear",past:"wore",participle:"worn",ipa:["/wer/","/wɔːr/","/wɔːrn/"],meaning:"mặc, đeo",level:"easy"},
  {id:37,base:"win",past:"won",participle:"won",ipa:["/wɪn/","/wʌn/","/wʌn/"],meaning:"chiến thắng",level:"easy"},
  {id:38,base:"write",past:"wrote",participle:"written",ipa:["/raɪt/","/roʊt/","/ˈrɪtən/"],meaning:"viết",level:"easy"},
  {id:39,base:"beat",past:"beat",participle:"beaten",ipa:["/biːt/","/biːt/","/ˈbiːtən/"],meaning:"đánh, đập; đánh bại",level:"medium"},
  {id:40,base:"bite",past:"bit",participle:"bitten",ipa:["/baɪt/","/bɪt/","/ˈbɪtən/"],meaning:"cắn",level:"medium"},
  {id:41,base:"blow",past:"blew",participle:"blown",ipa:["/bloʊ/","/bluː/","/bloʊn/"],meaning:"thổi",level:"medium"},
  {id:42,base:"choose",past:"chose",participle:"chosen",ipa:["/tʃuːz/","/tʃoʊz/","/ˈtʃoʊzən/"],meaning:"chọn, lựa chọn",level:"medium"},
  {id:43,base:"cost",past:"cost",participle:"cost",ipa:["/kɔːst/","/kɔːst/","/kɔːst/"],meaning:"có giá, trị giá",level:"medium"},
  {id:44,base:"cut",past:"cut",participle:"cut",ipa:["/kʌt/","/kʌt/","/kʌt/"],meaning:"cắt",level:"medium"},
  {id:45,base:"draw",past:"drew",participle:"drawn",ipa:["/drɔː/","/druː/","/drɔːn/"],meaning:"vẽ, kéo",level:"medium"},
  {id:46,base:"dream",past:"dreamed / dreamt",participle:"dreamed / dreamt",ipa:["/driːm/","/driːmd/ · /dremt/","/driːmd/ · /dremt/"],meaning:"mơ, mơ ước",level:"medium"},
  {id:47,base:"feed",past:"fed",participle:"fed",ipa:["/fiːd/","/fed/","/fed/"],meaning:"cho ăn, nuôi",level:"medium"},
  {id:48,base:"fight",past:"fought",participle:"fought",ipa:["/faɪt/","/fɔːt/","/fɔːt/"],meaning:"chiến đấu, đánh nhau",level:"medium"},
  {id:49,base:"fly",past:"flew",participle:"flown",ipa:["/flaɪ/","/fluː/","/floʊn/"],meaning:"bay",level:"medium"},
  {id:50,base:"forget",past:"forgot",participle:"forgotten",ipa:["/fərˈɡet/","/fərˈɡɑːt/","/fərˈɡɑːtən/"],meaning:"quên",level:"medium"},
  {id:51,base:"forgive",past:"forgave",participle:"forgiven",ipa:["/fərˈɡɪv/","/fərˈɡeɪv/","/fərˈɡɪvən/"],meaning:"tha thứ",level:"medium"},
  {id:52,base:"freeze",past:"froze",participle:"frozen",ipa:["/friːz/","/froʊz/","/ˈfroʊzən/"],meaning:"đóng băng",level:"medium"},
  {id:53,base:"hide",past:"hid",participle:"hidden",ipa:["/haɪd/","/hɪd/","/ˈhɪdən/"],meaning:"giấu, trốn",level:"medium"},
  {id:54,base:"hold",past:"held",participle:"held",ipa:["/hoʊld/","/held/","/held/"],meaning:"giữ, cầm",level:"medium"},
  {id:55,base:"keep",past:"kept",participle:"kept",ipa:["/kiːp/","/kept/","/kept/"],meaning:"giữ, bảo quản",level:"medium"},
  {id:56,base:"lay",past:"laid",participle:"laid",ipa:["/leɪ/","/leɪd/","/leɪd/"],meaning:"đặt, để (vật gì đó)",level:"medium"},
  {id:57,base:"lead",past:"led",participle:"led",ipa:["/liːd/","/led/","/led/"],meaning:"dẫn dắt, lãnh đạo",level:"medium"},
  {id:58,base:"lend",past:"lent",participle:"lent",ipa:["/lend/","/lent/","/lent/"],meaning:"cho mượn",level:"medium"},
  {id:59,base:"lie",past:"lay",participle:"lain",ipa:["/laɪ/","/leɪ/","/leɪn/"],meaning:"nằm",level:"medium"},
  {id:60,base:"light",past:"lit",participle:"lit",ipa:["/laɪt/","/lɪt/","/lɪt/"],meaning:"thắp sáng",level:"medium"},
  {id:61,base:"lose",past:"lost",participle:"lost",ipa:["/luːz/","/lɔːst/","/lɔːst/"],meaning:"mất, thua",level:"medium"},
  {id:62,base:"pay",past:"paid",participle:"paid",ipa:["/peɪ/","/peɪd/","/peɪd/"],meaning:"trả tiền",level:"medium"},
  {id:63,base:"ride",past:"rode",participle:"ridden",ipa:["/raɪd/","/roʊd/","/ˈrɪdən/"],meaning:"đi, cưỡi (xe/ngựa)",level:"medium"},
  {id:64,base:"ring",past:"rang",participle:"rung",ipa:["/rɪŋ/","/ræŋ/","/rʌŋ/"],meaning:"reo, rung chuông",level:"medium"},
  {id:65,base:"rise",past:"rose",participle:"risen",ipa:["/raɪz/","/roʊz/","/ˈrɪzən/"],meaning:"tăng lên, mọc lên",level:"medium"},
  {id:66,base:"sell",past:"sold",participle:"sold",ipa:["/sel/","/soʊld/","/soʊld/"],meaning:"bán",level:"medium"},
  {id:67,base:"send",past:"sent",participle:"sent",ipa:["/send/","/sent/","/sent/"],meaning:"gửi",level:"medium"},
  {id:68,base:"shake",past:"shook",participle:"shaken",ipa:["/ʃeɪk/","/ʃʊk/","/ˈʃeɪkən/"],meaning:"lắc, rung",level:"medium"},
  {id:69,base:"shine",past:"shone",participle:"shone",ipa:["/ʃaɪn/","/ʃɑːn/","/ʃɑːn/"],meaning:"chiếu sáng, tỏa sáng",level:"medium"},
  {id:70,base:"shoot",past:"shot",participle:"shot",ipa:["/ʃuːt/","/ʃɑːt/","/ʃɑːt/"],meaning:"bắn",level:"medium"},
  {id:71,base:"show",past:"showed",participle:"shown",ipa:["/ʃoʊ/","/ʃoʊd/","/ʃoʊn/"],meaning:"cho xem, trình bày",level:"medium"},
  {id:72,base:"steal",past:"stole",participle:"stolen",ipa:["/stiːl/","/stoʊl/","/ˈstoʊlən/"],meaning:"đánh cắp",level:"medium"},
  {id:73,base:"swim",past:"swam",participle:"swum",ipa:["/swɪm/","/swæm/","/swʌm/"],meaning:"bơi",level:"medium"},
  {id:74,base:"throw",past:"threw",participle:"thrown",ipa:["/θroʊ/","/θruː/","/θroʊn/"],meaning:"ném, quăng",level:"medium"},
  {id:75,base:"wake",past:"woke",participle:"woken",ipa:["/weɪk/","/woʊk/","/ˈwoʊkən/"],meaning:"thức dậy, đánh thức",level:"medium"},
  {id:76,base:"arise",past:"arose",participle:"arisen",ipa:["/əˈraɪz/","/əˈroʊz/","/əˈrɪzən/"],meaning:"phát sinh, xuất hiện",level:"hard"},
  {id:77,base:"bind",past:"bound",participle:"bound",ipa:["/baɪnd/","/baʊnd/","/baʊnd/"],meaning:"buộc, ràng buộc",level:"hard"},
  {id:78,base:"cling",past:"clung",participle:"clung",ipa:["/klɪŋ/","/klʌŋ/","/klʌŋ/"],meaning:"bám chặt, bám víu",level:"hard"},
  {id:79,base:"creep",past:"crept",participle:"crept",ipa:["/kriːp/","/krept/","/krept/"],meaning:"bò, trườn; rón rén",level:"hard"},
  {id:80,base:"deal",past:"dealt",participle:"dealt",ipa:["/diːl/","/delt/","/delt/"],meaning:"giải quyết; giao dịch",level:"hard"},
  {id:81,base:"flee",past:"fled",participle:"fled",ipa:["/fliː/","/fled/","/fled/"],meaning:"bỏ chạy, chạy trốn",level:"hard"},
  {id:82,base:"forbid",past:"forbade",participle:"forbidden",ipa:["/fərˈbɪd/","/fərˈbeɪd/","/fərˈbɪdən/"],meaning:"cấm, ngăn cấm",level:"hard"},
  {id:83,base:"grind",past:"ground",participle:"ground",ipa:["/ɡraɪnd/","/ɡraʊnd/","/ɡraʊnd/"],meaning:"nghiền, xay",level:"hard"},
  {id:84,base:"kneel",past:"knelt",participle:"knelt",ipa:["/niːl/","/nelt/","/nelt/"],meaning:"quỳ",level:"hard"},
  {id:85,base:"leap",past:"leapt",participle:"leapt",ipa:["/liːp/","/lept/","/lept/"],meaning:"nhảy, nhảy vọt",level:"hard"},
  {id:86,base:"overcome",past:"overcame",participle:"overcome",ipa:["/ˌoʊvərˈkʌm/","/ˌoʊvərˈkeɪm/","/ˌoʊvərˈkʌm/"],meaning:"vượt qua, khắc phục",level:"hard"},
  {id:87,base:"seek",past:"sought",participle:"sought",ipa:["/siːk/","/sɔːt/","/sɔːt/"],meaning:"tìm kiếm",level:"hard"},
  {id:88,base:"sew",past:"sewed",participle:"sewn",ipa:["/soʊ/","/soʊd/","/soʊn/"],meaning:"may, khâu",level:"hard"},
  {id:89,base:"shrink",past:"shrank",participle:"shrunk",ipa:["/ʃrɪŋk/","/ʃræŋk/","/ʃrʌŋk/"],meaning:"co lại, thu nhỏ",level:"hard"},
  {id:90,base:"sink",past:"sank",participle:"sunk",ipa:["/sɪŋk/","/sæŋk/","/sʌŋk/"],meaning:"chìm, đắm",level:"hard"},
  {id:91,base:"slide",past:"slid",participle:"slid",ipa:["/slaɪd/","/slɪd/","/slɪd/"],meaning:"trượt, trượt đi",level:"hard"},
  {id:92,base:"spin",past:"spun",participle:"spun",ipa:["/spɪn/","/spʌn/","/spʌn/"],meaning:"quay, xoay",level:"hard"},
  {id:93,base:"spring",past:"sprang",participle:"sprung",ipa:["/sprɪŋ/","/spræŋ/","/sprʌŋ/"],meaning:"bật lên, nảy lên",level:"hard"},
  {id:94,base:"sting",past:"stung",participle:"stung",ipa:["/stɪŋ/","/stʌŋ/","/stʌŋ/"],meaning:"chích, đốt",level:"hard"},
  {id:95,base:"strike",past:"struck",participle:"struck",ipa:["/straɪk/","/strʌk/","/strʌk/"],meaning:"đánh, đình công",level:"hard"},
  {id:96,base:"swear",past:"swore",participle:"sworn",ipa:["/swer/","/swɔːr/","/swɔːrn/"],meaning:"thề, chửi thề",level:"hard"},
  {id:97,base:"sweep",past:"swept",participle:"swept",ipa:["/swiːp/","/swept/","/swept/"],meaning:"quét",level:"hard"},
  {id:98,base:"weep",past:"wept",participle:"wept",ipa:["/wiːp/","/wept/","/wept/"],meaning:"khóc",level:"hard"},
  {id:99,base:"withdraw",past:"withdrew",participle:"withdrawn",ipa:["/wɪðˈdrɔː/","/wɪðˈdruː/","/wɪðˈdrɔːn/"],meaning:"rút lại, rút tiền",level:"hard"},
  {id:100,base:"withstand",past:"withstood",participle:"withstood",ipa:["/wɪðˈstænd/","/wɪðˈstʊd/","/wɪðˈstʊd/"],meaning:"chống chịu, chịu đựng",level:"hard"},
];
const STORAGE_KEY = "ati-irregular-verbs-mastered-v2";
const REVIEW_KEY = "ati-irregular-verbs-review-v1";
const levelText:Record<Level,string> = {easy:"Cơ bản",medium:"Trung cấp",hard:"Nâng cao"};
const levelTextEn:Record<Level,string> = {easy:"Beginner",medium:"Intermediate",hard:"Advanced"};
const normalize = (v:string) => v.toLocaleLowerCase("vi").trim().replace(/\\s+/g," ");
const accepted = (v:string) => v.split("/").map(x=>normalize(x));
function readIds(key:string):number[] { try { const v=JSON.parse(localStorage.getItem(key)||"[]"); return Array.isArray(v)?v.filter((x):x is number=>Number.isInteger(x)):[]; } catch { return []; } }

export default function IrregularVerbs({language="vi"}:{language?:"vi"|"en"}) {
 const en=language==="en";
 const [screen,setScreen]=useState<"library"|"study">("library");
 const [studySettingsOpen,setStudySettingsOpen]=useState(false);
 const [search,setSearch]=useState("");
 const [level,setLevel]=useState<"all"|Level>("all");
 const [status,setStatus]=useState<"all"|"new"|"learned"|"review">("all");
 const [sortKey,setSortKey]=useState<"id"|"base"|"past"|"participle"|"meaning"|"level"|"learned"|null>(null);
 const [sortDir,setSortDir]=useState<"asc"|"desc"|null>(null);
 const [mode,setMode]=useState<StudyMode>("cards");
 const [mastered,setMastered]=useState<number[]>(()=>readIds(STORAGE_KEY));
 const [needsReview,setNeedsReview]=useState<number[]>(()=>readIds(REVIEW_KEY));
 const [selected,setSelected]=useState<number[]>([]);
 const [studyIds,setStudyIds]=useState<number[]>([]);
 const [index,setIndex]=useState(0);
 const [revealed,setRevealed]=useState(false);
 const [voice,setVoice]=useState<"US"|"UK">("US");
 const [speed,setSpeed]=useState(1);
 const [typedPast,setTypedPast]=useState("");
 const [typedParticiple,setTypedParticiple]=useState("");
 const [feedback,setFeedback]=useState<"correct"|"incorrect"| "">("");
 const [choice,setChoice]=useState("");
 const [checked,setChecked]=useState(false);
 const [round,setRound]=useState(0);
 useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(mastered));},[mastered]);
 useEffect(()=>{localStorage.setItem(REVIEW_KEY,JSON.stringify(needsReview));},[needsReview]);
 const filtered=useMemo(()=>{
  const q=normalize(search);
  return VERBS.filter(v=>(level==="all"||v.level===level)&&
   (status==="all"||(status==="new"&&!mastered.includes(v.id))||(status==="learned"&&mastered.includes(v.id))||(status==="review"&&needsReview.includes(v.id)))&&
   (!q||[v.base,v.past,v.participle,v.meaning,...v.ipa].some(x=>normalize(x).includes(q))));
 },[search,level,status,mastered,needsReview]);
 const sortedFiltered=useMemo(()=>{
  const rows=[...filtered];
  if(sortKey===null || sortDir===null)return rows;
  rows.sort((a,b)=>{
   let av:string|number, bv:string|number;
   if(sortKey==="learned"){av=mastered.includes(a.id)?1:0;bv=mastered.includes(b.id)?1:0;}
   else if(sortKey==="level"){const rank={easy:1,medium:2,hard:3};av=rank[a.level];bv=rank[b.level];}
   else {av=a[sortKey];bv=b[sortKey];}
   const result=typeof av==="number"&&typeof bv==="number"?av-bv:String(av).localeCompare(String(bv),"vi");
   return sortDir==="asc"?result:-result;
  });
  return rows;
 },[filtered,sortKey,sortDir,mastered]);
 const toggleSort=(key:Exclude<typeof sortKey,null>)=>{if(sortKey===key){if(sortDir==="asc")setSortDir("desc");else if(sortDir==="desc"){setSortKey(null);setSortDir(null);}else setSortDir("asc");}else{setSortKey(key);setSortDir("asc");}};
 const sortIcon=(key:Exclude<typeof sortKey,null>)=>sortKey!==key?<ArrowUpDown size={13}/>:sortDir==="asc"?<ArrowUp size={13}/>:<ArrowDown size={13}/>;
 const sortHeader=(label:string,key:Exclude<typeof sortKey,null>)=><button type="button" className="irregular-sort-header" onClick={()=>toggleSort(key)} title={en?"Click: ascending → descending → default":"Nhấn: tăng dần → giảm dần → mặc định"}>{label}{sortIcon(key)}</button>;
 const pool=useMemo(()=>VERBS.filter(v=>studyIds.includes(v.id)),[studyIds]);
 const current=pool.length?pool[Math.min(index,pool.length-1)]:null;
 const reset=()=>{setRevealed(false);setTypedPast("");setTypedParticiple("");setFeedback("");setChoice("");setChecked(false);};
 const speak=(text:string)=>{if(!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=voice==="US"?"en-US":"en-GB";u.rate=speed;const v=window.speechSynthesis.getVoices().find(x=>x.lang.toLowerCase()=== (voice==="US"?"en-us":"en-gb"));if(v)u.voice=v;window.speechSynthesis.speak(u);};
 const toggle=(id:number)=>{const wasLearned=mastered.includes(id);const verb=VERBS.find(v=>v.id===id);setMastered(old=>wasLearned?old.filter(x=>x!==id):[...old,id]);recordLearningActivity("irregular-verbs",wasLearned?"needs-practice":"remembered",{itemId:String(id),itemLabel:verb?.base??String(id)});};
 const markCorrect=(id:number)=>{const verb=VERBS.find(v=>v.id===id);setMastered(old=>old.includes(id)?old:[...old,id]);setNeedsReview(old=>old.filter(x=>x!==id));recordLearningActivity("irregular-verbs","remembered",{itemId:String(id),itemLabel:verb?.base??String(id)});};
 const markWrong=(id:number)=>{const verb=VERBS.find(v=>v.id===id);setNeedsReview(old=>old.includes(id)?old:[...old,id]);recordLearningActivity("irregular-verbs","needs-practice",{itemId:String(id),itemLabel:verb?.base??String(id)});};
 const start=(ids:number[])=>{if(!ids.length)return;setStudyIds(ids);setIndex(0);setMode("cards");reset();setStudySettingsOpen(false);setScreen("study");};
 const updateStudySelection=(ids:number[])=>{setSelected(ids);};
 const applyStudySelection=()=>{if(!selectedLearned.length)return;setStudyIds(selectedLearned);setIndex(0);setMode("cards");reset();setStudySettingsOpen(false);};
 const next=(step:number)=>{if(!pool.length)return;setIndex((index+step+pool.length)%pool.length);reset();};
 const random=()=>{if(pool.length<2)return;let n=index;while(n===index)n=Math.floor(Math.random()*pool.length);setIndex(n);reset();};
 const checkTyping=()=>{if(!current)return;const ok=accepted(current.past).includes(normalize(typedPast))&&accepted(current.participle).includes(normalize(typedParticiple));setFeedback(ok?"correct":"incorrect");if(ok)markCorrect(current.id);else markWrong(current.id);};
 const options=useMemo(()=>{if(!current)return[];return [current,...VERBS.filter(v=>v.id!==current.id).slice((round*7)%Math.max(1,VERBS.length-3),(round*7)%Math.max(1,VERBS.length-3)+3)].sort((a,b)=>((a.id*17+round*13)%53)-((b.id*17+round*13)%53));},[current,round]);
 const submitQuiz=()=>{if(!current)return;setChecked(true);if(choice===current.past)markCorrect(current.id);else markWrong(current.id);};
 const allLearned=VERBS.filter(v=>mastered.includes(v.id)).map(v=>v.id);
 const selectedLearned=selected.filter(id=>VERBS.some(v=>v.id===id));
 const statsLearned=VERBS.filter(v=>mastered.includes(v.id)).length;
 if(screen==="study") return <div className="irregular-page irregular-study-only">
  <button className="irregular-back-library" onClick={()=>setScreen("library")}><ArrowLeft size={17}/>{en?"Back to verb library":"Quay lại danh sách động từ"}</button>
  <section className="irregular-study-shell">
   <div className="irregular-study-heading"><div><span className="irregular-eyebrow">ATI ENGLISH MASTER</span><h2>{en?"Study irregular verbs":"Học động từ bất quy tắc"}</h2><p>{en?"Focus on your selected verbs.":"Tập trung vào những động từ đã chọn để học hoặc ôn tập."}</p></div><div className="irregular-study-heading-actions"><button className={`irregular-config-trigger ${studySettingsOpen?"active":""}`} onClick={()=>setStudySettingsOpen(v=>!v)}><Settings2 size={16}/>{en?"Settings":"Cài đặt"}</button><span className="irregular-hero-count"><strong>{pool.length}</strong><span>{en?"VERBS":"TỪ"}</span></span></div></div>
   <div className="irregular-study-settings"><label>{en?"Voice":"Giọng đọc"}<select value={voice} onChange={e=>setVoice(e.target.value as "US"|"UK")}><option value="US">English (US)</option><option value="UK">English (UK)</option></select></label><label>{en?"Speed":"Tốc độ"}<select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={0.75}>0.75x</option><option value={1}>1x</option><option value={1.25}>1.25x</option><option value={1.5}>1.5x</option></select></label></div>
   {studySettingsOpen&&<section className="irregular-content-settings"><div className="irregular-content-settings-head"><div><strong>{en?"Choose study content":"Chọn nội dung học"}</strong><span>{en?"Select learned verbs to review, or start with the full list.":"Chọn những từ đã học để ôn tập hoặc học toàn bộ danh sách."}</span></div><button type="button" onClick={()=>setStudySettingsOpen(false)} aria-label="Đóng cài đặt"><X size={17}/></button></div><div className="irregular-content-actions"><button className="irregular-secondary-btn" onClick={()=>updateStudySelection(allLearned)} disabled={!allLearned.length}>{en?"Select all learned":"Chọn tất cả đã học"}</button><button className="irregular-secondary-btn" onClick={()=>updateStudySelection(needsReview)} disabled={!needsReview.length}>{en?"Select needs review":"Chọn từ cần ôn"}</button><button className="irregular-secondary-btn" onClick={()=>updateStudySelection(VERBS.map(v=>v.id))}>{en?"Select all verbs":"Chọn toàn bộ"}</button><button className="irregular-primary-btn" onClick={applyStudySelection} disabled={!selectedLearned.length}>{en?`Apply selection (${selectedLearned.length})`:`Học/ôn ${selectedLearned.length} từ đã chọn`}</button></div><div className="irregular-content-checklist">{VERBS.filter(v=>mastered.includes(v.id)||needsReview.includes(v.id)).map(v=><label key={v.id}><input type="checkbox" checked={selected.includes(v.id)} onChange={e=>setSelected(old=>e.target.checked?[...old,v.id]:old.filter(id=>id!==v.id))}/><span><b>{v.base}</b><small>{v.past} · {v.participle}</small></span></label>)}{!allLearned.length&&<p>{en?"No learned verbs yet. Mark verbs as learned to select them here.":"Bạn chưa đánh dấu từ nào đã học. Hãy đánh dấu từ đã học để chọn ôn tập tại đây."}</p>}</div></section>}
   <div className="irregular-mode-tabs"><button className={mode==="cards"?"active":""} onClick={()=>{setMode("cards");reset();}}><Layers3 size={17}/>{en?"Flashcards":"Thẻ ghi nhớ"}</button><button className={mode==="typing"?"active":""} onClick={()=>{setMode("typing");reset();}}><Keyboard size={17}/>{en?"Typing":"Luyện gõ"}</button><button className={mode==="quiz"?"active":""} onClick={()=>{setMode("quiz");reset();}}><CircleHelp size={17}/>{en?"Quiz":"Trắc nghiệm"}</button></div>
   {!current?<div className="irregular-empty">{en?"No verbs selected.":"Chưa có động từ để học."}</div>:<>
    <div className="irregular-study-top"><span className={`irregular-level ${current.level}`}>{en?levelTextEn[current.level]:levelText[current.level]}</span><span>{index+1} / {pool.length}</span><button className={`irregular-mastered ${mastered.includes(current.id)?"done":""}`} onClick={()=>toggle(current.id)}>{mastered.includes(current.id)?<CheckCircle2 size={16}/>:<Check size={16}/>} {mastered.includes(current.id)?(en?"Learned":"Đã học"):(en?"Mark learned":"Đánh dấu đã học")}</button></div>
    {mode==="cards"&&<div className="irregular-card" onClick={()=>setRevealed(v=>!v)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setRevealed(v=>!v);}}><div className="irregular-card-kicker">V1 · BASE FORM</div><div className="irregular-base-word">{current.base}</div><div className="irregular-form-ipa">{current.ipa[0]} <button type="button" className="irregular-speak" onClick={e=>{e.stopPropagation();speak(current.base);}}><Volume2 size={17}/></button></div><div className="irregular-card-hint">{revealed?current.meaning:(en?"Tap card to reveal V2, V3 and meaning":"Nhấn thẻ để xem V2, V3 và nghĩa")}</div>{revealed&&<div className="irregular-forms-grid"><div><span>V2 · Past Simple</span><strong>{current.past}</strong><small>{current.ipa[1]}</small><button onClick={e=>{e.stopPropagation();speak(current.past);}}><Volume2 size={15}/> {en?"Listen":"Nghe"}</button></div><div><span>V3 · Past Participle</span><strong>{current.participle}</strong><small>{current.ipa[2]}</small><button onClick={e=>{e.stopPropagation();speak(current.participle);}}><Volume2 size={15}/> {en?"Listen":"Nghe"}</button></div></div>}</div>}
    {mode==="typing"&&<div className="irregular-practice-panel"><div className="irregular-practice-prompt"><span>{en?"Type V2 and V3":"Nhập dạng V2 và V3"}</span><strong>{current.base}</strong><small>{current.ipa[0]} · {current.meaning}</small><button onClick={()=>speak(current.base)}><Volume2 size={16}/> {en?"Listen":"Nghe"}</button></div><div className="irregular-typing-fields"><label>V2<input value={typedPast} onChange={e=>{setTypedPast(e.target.value);setFeedback("");}} placeholder="V2..."/></label><label>V3<input value={typedParticiple} onChange={e=>{setTypedParticiple(e.target.value);setFeedback("");}} placeholder="V3..."/></label></div><button className="irregular-primary-btn" onClick={checkTyping}>{en?"Check":"Kiểm tra"}</button>{feedback&&<div className={`irregular-feedback ${feedback}`}>{feedback==="correct"?(en?"Correct!":"Chính xác!"):(en?"Try again.":"Chưa đúng, hãy thử lại.")}<p>V2: {current.past} · V3: {current.participle}</p></div>}</div>}
    {mode==="quiz"&&<div className="irregular-practice-panel"><div className="irregular-practice-prompt"><span>{en?"Choose the past form":"Chọn dạng V2 chính xác"}</span><strong>{current.base}</strong><small>{current.meaning}</small></div><div className="irregular-quiz-options">{options.map(v=><button key={v.id} disabled={checked} className={checked&&v.id===current.id?"correct":""} onClick={()=>setChoice(v.past)}>{v.past}</button>)}</div>{checked?<div className={`irregular-feedback ${choice===current.past?"correct":"incorrect"}`}>{choice===current.past?(en?"Correct!":"Chính xác!"):`Đáp án: ${current.past}`}</div>:<button className="irregular-primary-btn" disabled={!choice} onClick={submitQuiz}>{en?"Submit":"Trả lời"}</button>}</div>}
    <div className="irregular-study-controls"><button onClick={()=>next(-1)}><ArrowLeft size={17}/>{en?"Previous":"Trước"}</button><button onClick={random}><Shuffle size={16}/>{en?"Shuffle":"Ngẫu nhiên"}</button><button onClick={()=>{next(1);setRound(v=>v+1);}}>{en?"Next":"Tiếp theo"}<ArrowRight size={17}/></button></div>
   </>}
  </section>
 </div>;
 return <div className="irregular-page">
  <section className="irregular-hero"><div className="irregular-hero-icon"><BookOpen size={27}/></div><div className="irregular-hero-copy"><span className="irregular-eyebrow">ATI ENGLISH MASTER · GRAMMAR & VOCABULARY</span><h2>{en?"Irregular Verbs":"Động từ bất quy tắc"}</h2><p>{en?"Browse, search, learn and review irregular verbs.":"Tra cứu, học theo cấp độ và chọn những từ đã học để ôn tập."}</p></div><div className="irregular-hero-count"><strong>{VERBS.length}</strong><span>{en?"VERBS":"ĐỘNG TỪ"}</span></div></section>
  <div className="irregular-stats"><div className="irregular-stat"><span>{en?"Total":"Tổng số"}</span><strong>{VERBS.length}</strong></div><div className="irregular-stat"><span>{en?"Learned":"Đã học"}</span><strong>{statsLearned}</strong></div><div className="irregular-stat"><span>{en?"Need review":"Cần ôn"}</span><strong>{needsReview.length}</strong></div></div>
  <section className="irregular-toolbar"><label className="irregular-search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={en?"Search V1, V2, V3, IPA or meaning...":"Tìm V1, V2, V3, IPA hoặc nghĩa..."}/>{search&&<button onClick={()=>setSearch("")}><X size={16}/></button>}</label><label className="irregular-filter"><span>{en?"Level":"Cấp độ"}</span><select value={level} onChange={e=>setLevel(e.target.value as "all"|Level)}><option value="all">{en?"All levels":"Tất cả"}</option><option value="easy">{en?"Beginner":"Cơ bản"}</option><option value="medium">{en?"Intermediate":"Trung cấp"}</option><option value="hard">{en?"Advanced":"Nâng cao"}</option></select></label><label className="irregular-filter"><span>{en?"Status":"Trạng thái"}</span><select value={status} onChange={e=>setStatus(e.target.value as typeof status)}><option value="all">{en?"All":"Tất cả"}</option><option value="new">{en?"Not learned":"Chưa học"}</option><option value="learned">{en?"Learned":"Đã học"}</option><option value="review">{en?"Need review":"Cần ôn tập"}</option></select></label></section>
  <section className="irregular-table-panel"><div className="irregular-table-heading"><div className="irregular-table-heading-copy"><h3>{en?"Verb library":"Danh sách động từ"}</h3><p>{en?"Choose a lesson or select learned verbs to review.":"Nhấn Học bài để bắt đầu với danh sách đang lọc, hoặc chọn các từ đã học để ôn tập."}</p><span className="irregular-table-count">{filtered.length} {en?"verbs":"động từ"}</span></div><div className="irregular-library-actions"><button type="button" className="irregular-start-study" onClick={()=>start(filtered.map(v=>v.id))} disabled={!filtered.length}><Play size={16} fill="currentColor"/>{en?"Start lesson":"Học bài"}</button><button type="button" className="irregular-review-selected" onClick={()=>start(selected.filter(id=>mastered.includes(id)))} disabled={!selected.some(id=>mastered.includes(id))}>{en?`Review selected (${selected.filter(id=>mastered.includes(id)).length})`:`Ôn tập đã chọn (${selected.filter(id=>mastered.includes(id)).length})`}</button></div></div><div className="irregular-table-wrap"><table className="irregular-table"><thead><tr><th><span className="irregular-th-label">Ôn</span></th><th>{sortHeader("#","id")}</th><th>{sortHeader("V1 · Base","base")}</th><th>{sortHeader("V2 · Past","past")}</th><th>{sortHeader("V3 · Participle","participle")}</th><th>{sortHeader(en?"Meaning":"Nghĩa","meaning")}</th><th><span className="irregular-th-label">{en?"Audio":"Nghe"}</span></th><th>{sortHeader(en?"Learned":"Đã học","learned")}</th></tr></thead><tbody>{sortedFiltered.map((v,i)=><tr key={v.id}><td><input type="checkbox" aria-label={`Chọn ${v.base} để ôn tập`} disabled={!mastered.includes(v.id)} checked={selected.includes(v.id)} onChange={e=>setSelected(old=>e.target.checked?[...old,v.id]:old.filter(x=>x!==v.id))}/></td><td>{i+1}</td><td><strong>{v.base}</strong><small>{v.ipa[0]}</small></td><td><strong>{v.past}</strong><small>{v.ipa[1]}</small></td><td><strong>{v.participle}</strong><small>{v.ipa[2]}</small></td><td>{v.meaning}<span className={`irregular-level table-level ${v.level}`}>{en?levelTextEn[v.level]:levelText[v.level]}</span></td><td><button className="irregular-table-audio" onClick={()=>speak(`${v.base}. ${v.past}. ${v.participle}`)}><Volume2 size={16}/></button></td><td><button className={`irregular-table-status ${mastered.includes(v.id)?"done":""}`} onClick={()=>toggle(v.id)}>{mastered.includes(v.id)?<CheckCircle2 size={16}/>:<span/>}</button></td></tr>)}</tbody></table></div></section>
  <p className="irregular-footnote">{en?"General American IPA. English (US) is the default voice.":"IPA theo giọng Anh-Mỹ; giọng đọc mặc định là English (US). Dữ liệu học và ôn tập được lưu trên trình duyệt."}</p>
 </div>;
}
