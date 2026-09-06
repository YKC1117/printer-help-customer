(function(){
  'use strict';
  const products = Array.isArray(window.PRINTER_PRODUCTS) ? window.PRINTER_PRODUCTS : [];
  const brand = document.getElementById('brand');
  const model = document.getElementById('model');
  if (!brand || !model) return;

  const originalOptions = model.innerHTML;
  function esc(s){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));}
  function resetModels(){model.innerHTML=originalOptions;model.value='';}
  function filterModels(){
    const b=brand.value;
    if(!b){resetModels();return;}
    const rows=products.filter(p=>p.b===b);
    model.innerHTML='<option value="">請選擇型號（可不選）</option>'+rows.map(p=>'<option value="'+esc(p.m)+'">'+esc(p.m+'｜'+p.s)+'</option>').join('');
    model.value='';
  }
  brand.addEventListener('change',filterModels);

  function setupStepFlow(sec){
    const steps=[...sec.querySelectorAll('.checkstep')];
    if(!steps.length) return;
    sec.classList.add('flow-ready');

    const progress=document.createElement('div');
    progress.className='flow-progress';
    progress.innerHTML='<span class="flow-count"></span><div class="flow-bar"><i></i></div>';
    const help=sec.querySelector('.flow-help');
    if(help) help.after(progress); else sec.querySelector('.trouble-head')?.after(progress);

    function refresh(){
      let firstUnchecked=steps.findIndex(s=>!s.querySelector('input').checked);
      if(firstUnchecked<0) firstUnchecked=steps.length;

      steps.forEach((step,i)=>{
        const input=step.querySelector('input');
        step.hidden=i>firstUnchecked;
        step.classList.toggle('done',input.checked);
        step.classList.toggle('current',i===firstUnchecked && firstUnchecked<steps.length);
      });

      const done=steps.filter(s=>s.querySelector('input').checked).length;
      const count=progress.querySelector('.flow-count');
      const bar=progress.querySelector('i');
      if(done===steps.length){
        count.textContent='基本排查已完成';
      }else{
        count.textContent='目前進度 '+done+' / '+steps.length;
      }
      bar.style.width=(done/steps.length*100)+'%';
      const hand=sec.querySelector('.handoff');
      if(hand) hand.classList.toggle('flow-complete',done===steps.length);
    }

    steps.forEach((step,i)=>{
      const input=step.querySelector('input');
      input.addEventListener('change',()=>{
        if(!input.checked){
          steps.slice(i+1).forEach(s=>s.querySelector('input').checked=false);
        }
        refresh();
        if(input.checked && i+1<steps.length){
          setTimeout(()=>steps[i+1].scrollIntoView({behavior:'smooth',block:'center'}),80);
        }
      });
    });
    refresh();
  }
  document.querySelectorAll('.trouble').forEach(setupStepFlow);

  document.querySelectorAll('.make-summary').forEach(btn=>btn.addEventListener('click',()=>{
    const sec=document.getElementById(btn.dataset.target);
    if(!sec) return;
    const issue=sec.dataset.issue || '未指定';
    const checked=[...sec.querySelectorAll('input[type=checkbox]:checked')].map(x=>{
      const raw=x.dataset.step||'';
      return raw.includes('｜') ? raw.split('｜').slice(1).join('｜') : raw;
    }).filter(Boolean);
    const total=sec.querySelectorAll('.checkstep').length;
    const text=['【標籤機簡易排查結果】','品牌：'+(brand.value||'未填'),'型號：'+(model.value||'未填'),'問題：'+issue,'進度：'+checked.length+' / '+total,'','已完成：']
      .concat(checked.length?checked.map((x,i)=>(i+1)+'. '+x):['尚未完成任何步驟'])
      .concat(['','如果照上面步驟試過還是沒好，我再協助處理。']).join('\n');
    const pre=document.getElementById('summary-'+btn.dataset.target);
    if(pre){pre.textContent=text;pre.hidden=false;pre.scrollIntoView({behavior:'smooth',block:'nearest'});}
  }));

  const brands=[...brand.options].map(o=>o.value).filter(Boolean);
  const models=new Set(products.map(p=>p.m));
  console.info('[customer-tool self-check]',{brands:brands.length,products:products.length,uniqueModels:models.size,flows:document.querySelectorAll('.trouble').length});
})();
