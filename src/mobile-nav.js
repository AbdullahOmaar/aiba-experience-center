const nav=document.querySelector("#mobile-section-nav");
if(nav){
  const links=[...nav.querySelectorAll('a[href^="#"]')];
  const sections=links.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const setCurrent=id=>{
    let activeLink=null;
    links.forEach(link=>{
      if(link.getAttribute("href")==="#"+id){
        link.setAttribute("aria-current","location");
        activeLink=link;
      }else link.removeAttribute("aria-current");
    });
    if(activeLink&&nav.getClientRects().length){
      const behavior=matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth";
      activeLink.scrollIntoView({behavior,block:"nearest",inline:"nearest"});
    }
  };
  const initial=location.hash.slice(1);
  if(sections.some(section=>section.id===initial))setCurrent(initial);
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting)
        .sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
      if(visible[0])setCurrent(visible[0].target.id);
    },{rootMargin:"-20% 0px -68% 0px",threshold:[0,.15,.35,.6]});
    sections.forEach(section=>observer.observe(section));
  }
  links.forEach(link=>link.addEventListener("click",()=>{
    const id=link.getAttribute("href").slice(1);
    setCurrent(id);
  }));
}
