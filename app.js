(function(){
  'use strict';
  const products = Array.isArray(window.PRINTER_PRODUCTS) ? window.PRINTER_PRODUCTS : [];
  const brand = document.getElementById('brand');
  const model = document.getElementById('model');
  if (!brand || !model) return;
  const originalOptions = model.innerHTML;
  function esc(s){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));}
  function resetModels(){
    model.innerHTML = originalOptions;
    model.value = '';
  }
  function filterModels(){
    const b=brand.value;
    if(!b){resetModels();return;}
    const rows=products.filter(p=>p.b===b);
    model.innerHTML='<option value="">請選擇型號（可不選）</option>'+rows.map(p=>'<option value="'+esc(p.m)+'">'+esc(p.m+'｜'+p.s)+'</option>').join('');
    model.value='';
  }
  brand.addEventListener('change', filterModels);
  document.querySelectorAll('.make-summary').forEach(btn=>btn.addEventListener('click',()=>{
    const sec=document.getElementById(btn.dataset.target);
    if(!sec) return;
    const issue=sec.dataset.issue || '未指定';
    const checked=[...sec.querySelectorAll('input[type=checkbox]:checked')].map(x=>{
      const raw=x.dataset.step||'';
      return raw.includes('｜') ? raw.split('｜').slice(1).join('｜') : raw;
    }).filter(Boolean);
    const text=['【標籤機客戶基本排查摘要】','品牌：'+(brand.value||'未填'),'型號：'+(model.value||'未填'),'問題：'+issue,'','已完成：']
      .concat(checked.length?checked.map((x,i)=>(i+1)+'. '+x):['尚未勾選完成項目'])
      .concat(['','基本排查後若仍異常，請停止進一步調整，並將錯誤畫面／列印照片提供給工程人員。']).join('\n');
    const pre=document.getElementById('summary-'+btn.dataset.target);
    if(pre){pre.textContent=text;pre.hidden=false;}
  }));
  // 自我檢查：不影響使用，只在 console 留下結果。
  const brands=[...brand.options].map(o=>o.value).filter(Boolean);
  const models=new Set(products.map(p=>p.m));
  console.info('[customer-tool self-check]', {brands:brands.length, products:products.length, uniqueModels:models.size});
})();
