export function initDossier(){

const secMap = {
  overview:'Sintesi & One-pager', sviluppo:'Diventare il #1', requisiti:'40 Requisiti software',
  roadmap:'Roadmap MoSCoW', preventivatore:'Preventivatore live', guida:"Guida all'uso",
  'prezzo-req':'Requisiti \u2194 Prezzo', 'mkt-mercato':'Mercato & Competitor', 'mkt-pricing':'Analisi pricing',
  'mkt-segmenti':'Segmenti & esigenze', 'mkt-rischi':'Rischi & COVE', adempimenti:'Adempimenti software',
  compliance:'Checklist normativa', fonti:'Fonti'
};
const navLinks = document.querySelectorAll('#nav a');
navLinks.forEach(a=>a.addEventListener('click',()=>{
  const t=a.dataset.t; if(!t) return;
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('show'));
  const el=document.getElementById('s-'+t); if(el) el.classList.add('show');
  navLinks.forEach(x=>x.classList.remove('active')); a.classList.add('active');
  const cr=document.getElementById('crumb'); if(cr) cr.textContent=secMap[t]||'';
  const m=document.querySelector('.main'); if(m) m.scrollTo({top:0,behavior:'smooth'});
  window.scrollTo({top:0,behavior:'smooth'});
}));
window.filterReq = function(p,btn){
  document.querySelectorAll('#s-requisiti .tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.reqtbl tbody tr').forEach(tr=>{
    tr.style.display = (p==='all'||tr.dataset.p===p)?'':'none';
  });
  if(p!=='all') document.querySelectorAll('#s-requisiti .acc').forEach(a=>a.open=true);
};
document.querySelectorAll('#rischiTabs .tab').forEach(t=>t.addEventListener('click',()=>{
  document.querySelectorAll('#rischiTabs .tab').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  document.querySelectorAll('#s-mkt-rischi .tabpane').forEach(p=>p.classList.remove('show'));
  const el=document.getElementById('rt-'+t.dataset.rt); if(el) el.classList.add('show');
}));
const CFG = {
  fasce:[
    {id:'micro', nome:'Micro (< 100 pasti/gg)', baseMese:120},
    {id:'small', nome:'Piccolo (100\u2013300 pasti/gg)', baseMese:200},
    {id:'medium',nome:'Medio (300\u2013800 pasti/gg)', baseMese:350},
    {id:'large', nome:'Grande (800\u20132.000 pasti/gg)', baseMese:550},
    {id:'xl',    nome:'XL (> 2.000 pasti/gg)', baseMese:800},
  ],
  costoStrutturaExtra:35, markupCaterline:0.35, setup:150, giorni:365,
  scontoVolume:[{min:0,s:0},{min:20,s:.05},{min:50,s:.08},{min:80,s:.10}]
};
let DISTR = [
  {id:'micro', pasti:70,   strut:1, clienti:20},
  {id:'small', pasti:200,  strut:1, clienti:28},
  {id:'medium',pasti:550,  strut:2, clienti:16},
  {id:'large', pasti:1400, strut:4, clienti:6},
  {id:'xl',    pasti:3000, strut:8, clienti:4},
];
let VISTA='mese';
function eur(n){return '\u20AC '+Math.round(n||0).toLocaleString('it-IT');}
function scVol(n){let f=0;CFG.scontoVolume.forEach(x=>{if(n>=x.min)f=x.s});return f;}
function baseOf(id){const f=CFG.fasce.find(x=>x.id===id);return f?f.baseMese:0;}
function renderSegRows(){
  const box=document.getElementById('segRows'); if(!box)return; box.innerHTML='';
  DISTR.forEach((r,i)=>{
    const f=CFG.fasce.find(x=>x.id===r.id);
    const div=document.createElement('div'); div.className='segrow';
    div.innerHTML='<div class="top"><b>'+f.nome+'</b><span class="mini" id="mini-'+r.id+'"></span></div>'+
      '<div class="fields">'+
      '<div><label>Pasti/giorno</label><input type="number" data-i="'+i+'" data-k="pasti" value="'+r.pasti+'"></div>'+
      '<div><label>N. strutture</label><input type="number" data-i="'+i+'" data-k="strut" value="'+r.strut+'"></div>'+
      '<div><label>N. clienti</label><input type="number" data-i="'+i+'" data-k="clienti" value="'+r.clienti+'"></div>'+
      '<div><label>Base/mese</label><input type="number" data-b="'+r.id+'" value="'+f.baseMese+'"></div></div>';
    box.appendChild(div);
  });
  box.querySelectorAll('input[data-i]').forEach(inp=>inp.addEventListener('input',e=>{
    DISTR[+e.target.dataset.i][e.target.dataset.k]=+e.target.value||0; calc();
  }));
  box.querySelectorAll('input[data-b]').forEach(inp=>inp.addEventListener('input',e=>{
    CFG.fasce.find(f=>f.id===e.target.dataset.b).baseMese=+e.target.value||0; renderBaseParams(); calc();
  }));
}
function renderBaseParams(){
  const box=document.getElementById('baseParams'); if(!box)return; box.innerHTML='';
  CFG.fasce.forEach(f=>{
    box.insertAdjacentHTML('beforeend','<span>'+f.nome+'</span><input type="number" data-b2="'+f.id+'" value="'+f.baseMese+'">');
  });
  box.querySelectorAll('input[data-b2]').forEach(inp=>inp.addEventListener('input',e=>{
    CFG.fasce.find(f=>f.id===e.target.dataset.b2).baseMese=+e.target.value||0; renderSegRows(); calc();
  }));
}
function calc(){
  const nTot=DISTR.reduce((a,r)=>a+(+r.clienti||0),0);
  const sv=scVol(nTot); const mult = VISTA==='mese'?1:12;
  let ricavo=0, fatt=0, setupTot=0;
  const det=document.getElementById('detTbody'); if(det)det.innerHTML='';
  DISTR.forEach(r=>{
    const base=baseOf(r.id);
    const extra=(Math.max(1,r.strut)-1)*CFG.costoStrutturaExtra;
    const whole=(base+extra)*(1-sv);
    const retail=whole*(1+CFG.markupCaterline);
    const pastiAnno=r.pasti*CFG.giorni;
    const cpp=pastiAnno>0?(retail*12)/pastiAnno:0;
    ricavo+=whole*r.clienti; fatt+=retail*r.clienti; setupTot+=CFG.setup*r.clienti;
    const mini=document.getElementById('mini-'+r.id);
    if(mini)mini.innerHTML='a noi <b>'+eur(whole*mult)+'</b> \u00B7 \u20AC/pasto '+cpp.toFixed(3);
    if(det)det.insertAdjacentHTML('beforeend',
      '<tr><td>'+r.id.charAt(0).toUpperCase()+r.id.slice(1)+'</td><td class="num">'+r.clienti+'</td>'+
      '<td class="num">'+eur(whole*mult)+'</td><td class="num">'+eur(retail*mult)+'</td>'+
      '<td class="num">'+cpp.toFixed(3)+'</td><td class="num">'+eur(whole*r.clienti*mult)+'</td></tr>');
  });
  const marg=fatt-ricavo;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('kRicavo',eur(ricavo*mult)); set('kMedio',eur(nTot>0?(ricavo/nTot)*mult:0));
  set('kClienti',nTot); set('kSconto',Math.round(sv*100)+'%');
  set('kFatt',eur(fatt*mult)); set('kMarg',eur(marg*mult)); set('kSetup',eur(setupTot));
  document.querySelectorAll('.sfx').forEach(s=>s.textContent = VISTA==='mese'?'/mese':'/anno');
  const ex=document.getElementById('extraLbl'); if(ex) ex.textContent=CFG.costoStrutturaExtra;
}
document.querySelectorAll('#vistaToggle button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#vistaToggle button').forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); VISTA=b.dataset.v; calc();
}));
['pExtra','pMarkup','pSetup','pGiorni'].forEach(id=>{
  const e=document.getElementById(id); if(!e)return;
  e.addEventListener('input',()=>{
    CFG.costoStrutturaExtra=+document.getElementById('pExtra').value||0;
    CFG.markupCaterline=(+document.getElementById('pMarkup').value||0)/100;
    CFG.setup=+document.getElementById('pSetup').value||0;
    CFG.giorni=+document.getElementById('pGiorni').value||365;
    calc();
  });
});
renderSegRows(); renderBaseParams(); calc();

}
