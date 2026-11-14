(function(){
var d=document,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* cabecalho: fica solido depois da abertura */
var h=d.querySelector('.hdr'),hero=d.querySelector('.hero');
function onScroll(){if(!h)return;var lim=(hero?hero.offsetHeight:300)-90;h.classList.toggle('solid',window.scrollY>lim)}
onScroll();addEventListener('scroll',onScroll,{passive:true});

/* rodizio de capas (so cliente final; parado com movimento reduzido) */
var tpl=d.getElementById('hero-more');
if(tpl&&hero&&!reduce){
 var start=function(){
  hero.insertBefore(tpl.content.cloneNode(true),hero.querySelector('.planks'));
  var sl=[].slice.call(hero.querySelectorAll('.slide')),cur=0;
  function go(){
   if(d.hidden||window.scrollY>hero.offsetHeight*.8)return;
   var n=(cur+1)%sl.length,img=sl[n].querySelector('img');
   if(!img.complete||!img.naturalWidth)return;
   var old=sl[cur];sl[n].classList.add('on','top');old.classList.remove('top');cur=n;
   setTimeout(function(){if(old!==sl[cur])old.classList.remove('on')},1700);
  }
  setInterval(go,6000);
 };
 var kick=function(){setTimeout(start,2200)};
 if(d.readyState==='complete')kick();else addEventListener('load',kick);
}

/* revelacao na rolagem */
var els=[].slice.call(d.querySelectorAll('.rv,.cut,.joint,.boards,.stack'));
if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')})}
else{
 var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
 els.forEach(function(e){io.observe(e)});
 setTimeout(function(){els.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)e.classList.add('in')})},60);
}

/* comparador antes e depois */
[].forEach.call(d.querySelectorAll('.cmp'),function(c){
 var inp=c.querySelector('input'),drag=false;
 function set(v){v=Math.max(0,Math.min(100,v));c.style.setProperty('--pos',v+'%');inp.value=v;inp.setAttribute('aria-valuetext',Math.round(v)+'% do antes visivel')}
 function fromX(x){var r=c.getBoundingClientRect();set((x-r.left)/r.width*100)}
 c.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'){drag=true;c.setPointerCapture(e.pointerId);fromX(e.clientX)}});
 c.addEventListener('pointermove',function(e){if(drag)fromX(e.clientX)});
 c.addEventListener('pointerup',function(){drag=false});
 c.addEventListener('pointercancel',function(){drag=false});
 inp.addEventListener('input',function(){set(+inp.value)});
 set(50);
});

/* carrossel de avaliacoes */
[].forEach.call(d.querySelectorAll('[data-rev]'),function(root){
 var list=root.querySelector('.rev-list'),cards=[].slice.call(list.children),bar=root.querySelector('.prog i');
 var prev=root.querySelector('.prev'),next=root.querySelector('.next');
 function step(){return cards[0].getBoundingClientRect().width+28}
 function upd(){
  var max=list.scrollWidth-list.clientWidth,p=max>0?list.scrollLeft/max:0;
  if(bar){var w=Math.max(6,100*list.clientWidth/list.scrollWidth);bar.style.width=w+'%';bar.style.left=(p*(100-w))+'%'}
  var lr=list.getBoundingClientRect();
  cards.forEach(function(c){var r=c.getBoundingClientRect(),vis=r.right>lr.left+10&&r.left<lr.right-10;if(vis)c.removeAttribute('inert');else c.setAttribute('inert','')});
 }
 prev.addEventListener('click',function(){list.scrollBy({left:-step()*(innerWidth>900?2:1),behavior:reduce?'auto':'smooth'})});
 next.addEventListener('click',function(){list.scrollBy({left:step()*(innerWidth>900?2:1),behavior:reduce?'auto':'smooth'})});
 list.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
 addEventListener('resize',upd);upd();
});

/* explorador de linhas (arquitetos) */
var ex=d.querySelector('[data-exp]');
if(ex){
 var tabs=[].slice.call(ex.querySelectorAll('[data-tier-btn]')),tiers=[].slice.call(ex.querySelectorAll('[data-tier]'));
 function showTier(i,pi){
  tabs.forEach(function(b,k){b.setAttribute('aria-pressed',k===i?'true':'false')});
  tiers.forEach(function(t,k){t.hidden=k!==i});
  showProd(i,pi||0);
 }
 function showProd(i,pi){
  var t=tiers[i];
  [].forEach.call(t.querySelectorAll('[data-prod-btn]'),function(b,k){b.setAttribute('aria-pressed',k===pi?'true':'false')});
  [].forEach.call(t.querySelectorAll('.pnl'),function(p,k){p.hidden=k!==pi});
 }
 tabs.forEach(function(b,i){b.addEventListener('click',function(){showTier(i,0)})});
 tiers.forEach(function(t,i){[].forEach.call(t.querySelectorAll('[data-prod-btn]'),function(b,k){b.addEventListener('click',function(){showProd(i,k)})})});
 ex.classList.add('ready');showTier(0,0);
}
})();
