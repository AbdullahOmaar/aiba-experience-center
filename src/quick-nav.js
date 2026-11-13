import { MODULES, JOURNEYS, FINANCIAL_CONCEPTS } from "./content.js";

const dialog = document.querySelector("#quick-nav-dialog");
const openButton = document.querySelector("#quick-nav-open");
const closeButton = document.querySelector("#quick-nav-close");
const input = document.querySelector("#quick-nav-search");
const results = document.querySelector("#quick-nav-results");
const hint = document.querySelector("#quick-nav-hint");
const count = document.querySelector("#quick-nav-count");
const status = document.querySelector("#quick-nav-status");
if (!dialog || !openButton || !closeButton || !input || !results || !count || !status) throw new Error("Quick navigation markup is incomplete");

let activeIndex = 0;
let currentItems = [];
let previousFocus = null;
const isArabic = () => document.documentElement.lang === "ar";
const localized = value => isArabic() ? value.ar : value.en;
const labels = {
  en: {
    sections:"SECTION", module:"MODULE", feature:"FEATURE", journey:"JOURNEY", concept:"FINANCIAL CONCEPT",
    empty:"No matches. Try another word or search in Arabic.",
    sectionStory:"Business story", sectionMap:"Module universe", sectionExplorer:"Module explorer",
    sectionFeatures:"Feature explorer", sectionJourneys:"Business flows", sectionFinancial:"Financial concepts",
    sectionAI:"AI capabilities", sectionTrust:"Trust & security", sectionFinal:"Next step", sectionTop:"Back to top",
    descriptionSection:"Jump to this part of the experience", descriptionModule:"Open the module and its responsibilities",
    descriptionFeature:"Open this specific responsibility", descriptionJourney:"Open this explanatory journey", descriptionConcept:"Open this financial concept boundary",
    open:"Open", close:"Close quick navigation", title:"Where would you like to go?",
    placeholder:"Search modules, features, concepts or sections…", searchLabel:"Search the experience", resultsLabel:"Navigation results", countNone:"No results", countMany:"{count} results", countLimited:"Showing {shown} of {total} results", hint:"Search in English or Arabic · Use ↑ ↓ then Enter"
  },
  ar: {
    sections:"قسم", module:"وحدة", feature:"ميزة", journey:"مسار", concept:"مفهوم مالي",
    empty:"مفيش نتائج مطابقة. جرّب كلمة تانية أو ابحث بالإنجليزي.",
    sectionStory:"قصة المنتج", sectionMap:"خريطة الوحدات", sectionExplorer:"استكشاف الوحدات",
    sectionFeatures:"استكشاف المميزات", sectionJourneys:"مسارات الأعمال", sectionFinancial:"المفاهيم المالية",
    sectionAI:"قدرات الذكاء الاصطناعي", sectionTrust:"الثقة والأمان", sectionFinal:"الخطوة التالية", sectionTop:"العودة للأعلى",
    descriptionSection:"انتقل إلى هذا الجزء من التجربة", descriptionModule:"افتح الوحدة ومسؤولياتها",
    descriptionFeature:"افتح المسؤولية المحددة", descriptionJourney:"افتح المسار التوضيحي", descriptionConcept:"افتح حدود هذا المفهوم المالي",
    open:"فتح", close:"إغلاق التنقل السريع", title:"تحب تروح فين؟",
    placeholder:"ابحث عن وحدة أو ميزة أو مفهوم أو قسم…", searchLabel:"ابحث داخل التجربة", resultsLabel:"نتائج التنقل", countNone:"لا توجد نتائج", countMany:"عدد النتائج: {count}", countLimited:"عرض {shown} من {total} نتيجة", hint:"ابحث بالعربي أو الإنجليزي · استخدم ↑ ↓ ثم Enter"
  }
};
const sections = [
  {id:"top",key:"sectionTop",en:"Back to top",ar:"العودة للأعلى",keywords:"home hero start"},
  {id:"transformation",key:"sectionStory",en:"Business story",ar:"قصة المنتج",keywords:"story transformation"},
  {id:"modules",key:"sectionMap",en:"Module universe",ar:"خريطة الوحدات",keywords:"graph map relationships"},
  {id:"module-explorer",key:"sectionExplorer",en:"Module explorer",ar:"استكشاف الوحدات",keywords:"directory search"},
  {id:"features",key:"sectionFeatures",en:"Feature explorer",ar:"استكشاف المميزات",keywords:"responsibilities capability"},
  {id:"journeys",key:"sectionJourneys",en:"Business flows",ar:"مسارات الأعمال",keywords:"journey flow process"},
  {id:"financial",key:"sectionFinancial",en:"Financial concepts",ar:"المفاهيم المالية",keywords:"invoice payment allocation expense cash report"},
  {id:"ai",key:"sectionAI",en:"AI capabilities",ar:"قدرات الذكاء الاصطناعي",keywords:"assistant intelligence"},
  {id:"trust",key:"sectionTrust",en:"Trust & security",ar:"الثقة والأمان",keywords:"security permissions tenant"},
  {id:"final-entry",key:"sectionFinal",en:"Next step",ar:"الخطوة التالية",keywords:"open aiba"}
];
function buildItems(){
  const l=labels[isArabic()?"ar":"en"];
  const items=sections.map(s=>({id:"section-"+s.id,type:"section",typeLabel:l.sections,title:s[isArabic()?"ar":"en"],description:l.descriptionSection,keywords:s.keywords,action:()=>document.querySelector("#"+s.id)?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}));
  MODULES.forEach(m=>items.push({id:"module-"+m.id,type:"module",typeLabel:l.module,title:m.id+" · "+localized(m.title),description:localized(m.short),keywords:[m.id,m.key,localized(m.description),...m.facets.flatMap(f=>f.filter(Boolean))].join(" "),action:()=>openModule(m.id)}));
  MODULES.forEach(m=>m.facets.forEach((f,index)=>items.push({id:"feature-"+m.id+"-"+index,type:"feature",typeLabel:l.feature,title:m.id+" · "+(isArabic()?f[1]:f[0]),description:isArabic()?f[3]:f[2],keywords:[m.id,m.key,...f].join(" "),action:()=>openFeature(m.id,index)})));
  JOURNEYS.forEach(j=>items.push({id:"journey-"+j.id,type:"journey",typeLabel:l.journey,title:localized(j.title),description:localized(j.summary),keywords:[j.id,...j.steps.flat()].join(" "),action:()=>openJourney(j.id)}));
  FINANCIAL_CONCEPTS.forEach(c=>items.push({id:"concept-"+c.id,type:"concept",typeLabel:l.concept,title:localized(c),description:isArabic()?c.arText:c.enText,keywords:[c.id,c.en,c.ar,c.enText,c.arText,c.enDetail,c.arDetail].join(" "),action:()=>openConcept(c.id)}));
  return items;
}
function openModule(id){
  const clear=document.querySelector("#module-clear");
  const search=document.querySelector("#module-search");
  if(clear) clear.click();
  if(search){search.value=id;search.dispatchEvent(new Event("input",{bubbles:true}));}
  document.querySelector("#module-grid .module-card")?.click();
}
function openFeature(id,index){
  openModule(id);
  document.querySelectorAll("#module-detail .detail-facet")[index]?.click();
  document.querySelector("#features")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
}
function openJourney(id){document.querySelector("#journey-tab-"+id)?.click();document.querySelector("#journeys")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}
function openConcept(id){const selector="#financial-map [data-financial-concept="+id+"]";document.querySelector(selector)?.click();document.querySelector("#financial")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});document.querySelector(selector)?.focus();}
function render(){
  const l=labels[isArabic()?"ar":"en"];
  const query=input.value.trim().toLocaleLowerCase(isArabic()?"ar":"en");
  const matches=buildItems().filter(item=>!query||[item.title,item.description,item.keywords,item.typeLabel].join(" ").toLocaleLowerCase(isArabic()?"ar":"en").includes(query));
  const total=matches.length;
  currentItems=matches.slice(0,12);
  results.replaceChildren();
  activeIndex=0;
  results.setAttribute("aria-label",l.resultsLabel);
  const countText=total===0?l.countNone:total>12?l.countLimited.replace("{shown}",String(currentItems.length)).replace("{total}",String(total)):l.countMany.replace("{count}",String(total));
  count.textContent=countText;
  status.textContent=total===0?countText+". "+l.empty:countText;
  if(!currentItems.length){const empty=document.createElement("p");empty.className="quick-nav-empty";empty.textContent=l.empty;results.append(empty);input.removeAttribute("aria-activedescendant");return;}
  currentItems.forEach((item,index)=>{
    const button=document.createElement("button");button.type="button";button.className="quick-nav-option";button.id="quick-nav-option-"+index;button.setAttribute("role","option");button.setAttribute("aria-selected",String(index===activeIndex));
    const icon=document.createElement("span");icon.className="quick-nav-option-icon";icon.setAttribute("aria-hidden","true");icon.textContent=item.type==="module"?"◈":item.type==="feature"?"✦":item.type==="journey"?"⌁":item.type==="concept"?"◉":"↗";
    const copy=document.createElement("span");copy.className="quick-nav-option-copy";
    const title=document.createElement("span");title.className="quick-nav-option-title";title.textContent=item.title;
    const description=document.createElement("span");description.className="quick-nav-option-description";description.textContent=item.description;
    const type=document.createElement("span");type.className="quick-nav-option-type";type.textContent=item.typeLabel;
    copy.append(title,description);button.append(icon,copy,type);
    button.addEventListener("mouseenter",()=>setActive(index));
    button.addEventListener("click",()=>choose(index));
    results.append(button);
  });
  input.setAttribute("aria-activedescendant","quick-nav-option-0");
}
function setActive(index){
  if(!currentItems.length)return;
  activeIndex=(index+currentItems.length)%currentItems.length;
  [...results.querySelectorAll(".quick-nav-option")].forEach((button,i)=>button.setAttribute("aria-selected",String(i===activeIndex)));
  input.setAttribute("aria-activedescendant","quick-nav-option-"+activeIndex);
  results.querySelector("#quick-nav-option-"+activeIndex)?.scrollIntoView({block:"nearest"});
}
function choose(index){
  const item=currentItems[index];if(!item)return;
  dialog.close();item.action();
}
function open(){
  previousFocus=document.activeElement;
  input.value="";
  syncLanguage();
  render();
  dialog.showModal();
  input.setAttribute("aria-expanded","true");
  requestAnimationFrame(()=>input.focus());
}
function syncLanguage(){
  const l=labels[isArabic()?"ar":"en"];
  document.querySelector(".quick-nav-trigger-label").textContent=isArabic()?"انتقال سريع":"Quick jump";
  openButton.setAttribute("aria-label",isArabic()?"فتح التنقل السريع":"Open quick navigation");
  closeButton.setAttribute("aria-label",l.close);
  document.querySelector("#quick-nav-title").textContent=l.title;
  input.placeholder=l.placeholder;
  input.setAttribute("aria-label",l.searchLabel);
  results.setAttribute("aria-label",l.resultsLabel);
  hint.textContent=l.hint;
}
openButton.addEventListener("click",open);
closeButton.addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
dialog.addEventListener("close",()=>{input.setAttribute("aria-expanded","false");input.removeAttribute("aria-activedescendant");if(previousFocus?.isConnected)previousFocus.focus();});
input.addEventListener("input",render);
input.addEventListener("keydown",event=>{
  if(event.key==="ArrowDown"){event.preventDefault();setActive(activeIndex+1);}
  else if(event.key==="ArrowUp"){event.preventDefault();setActive(activeIndex-1);}
  else if(event.key==="Enter"){event.preventDefault();choose(activeIndex);}
});
document.addEventListener("keydown",event=>{
  if(dialog.open||event.altKey)return;
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();open();return;}
  const target=event.target;
  const typing=target instanceof HTMLElement&&(target.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(target.tagName));
  if(!typing&&event.key==="/"){event.preventDefault();open();}
});
new MutationObserver(()=>{if(dialog.open){syncLanguage();render();}else syncLanguage();}).observe(document.documentElement,{attributes:true,attributeFilter:["lang","dir"]});
syncLanguage();
