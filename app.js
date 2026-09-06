(function(){
  'use strict';
  const products=Array.isArray(window.PRINTER_PRODUCTS)?window.PRINTER_PRODUCTS:[];
  const FLOW_DATA={"power":[["確認插座有電","先確認延長線／插座的開關有開；如果方便，可改插到已知正常的牆上插座測試。"],["確認電源線與機器電源開關","電源線兩端都插緊，並確認機器後方或側面的電源開關已切到開啟。"],["暫時不要透過延長線測試","如果目前接在延長線或不斷電系統上，可先改接牆上插座，排除供電問題。"],["拔電等待 30 秒後重新開機","先關機並拔掉電源，等待約 30 秒，再接回電源重新開機。"],["觀察有沒有燈號、畫面或啟動聲","記下是完全沒反應，還是有亮燈但畫面沒出來；這個差異有助於後續判斷。"],["若有異味、冒煙或異常高溫，直接停止","這種情況不要再重複通電，先拔除電源並把狀況傳給我。"]],"paperout":[["確認標籤紙真的還有","查看紙捲是否用完、底紙是否斷掉，或標籤是否已經整捲脫離走紙路徑。"],["重新安裝一次標籤紙","照機器上的走紙圖示重新穿紙，紙張要平整，不要扭曲或繞錯位置。"],["把導紙器調到「輕輕靠住」","導紙器太鬆容易走偏，太緊又可能造成卡紙；輕靠紙張兩側即可。"],["看一下標籤的間距／黑標是否正常","確認每張標籤之間有固定間距；若使用背面黑標紙，黑標應完整、沒有被折到或髒污。"],["關機後清掉看得到的紙屑或殘膠","只清潔外部可見的位置，不拆外殼、不移動內部零件。"],["確認上蓋／印字區有確實關好","部分機型沒有完全關閉時會無法正常判斷耗材，重新壓緊並確認卡住定位。"],["重新開機，只按一次 FEED 測試","看是否能正常送出一張並停在下一張的位置；如果還是持續報 Paper Out，就先不要一直重複操作。"]],"ribbon":[["先確認目前是不是需要使用碳帶","一般熱轉印標籤需要碳帶；熱感紙通常不需要。若不確定，不要先改機器模式，拍一下紙跟碳帶給我。"],["確認碳帶沒有用完或斷掉","查看供應端是否還有碳帶，並確認中間沒有斷裂、皺成一團或纏住。"],["重新照路徑安裝碳帶","依機器上的碳帶路徑重新穿好，方向要一致，不要繞錯滾輪。"],["把碳帶拉平，不要有明顯皺折","碳帶需要有基本張力，但不要用力拉太緊。"],["確認回收端有固定住","回收紙管／回收軸要有確實咬住碳帶，不能一轉就空轉。"],["確認上蓋／印字區有確實關好","重新關閉後確認有卡到定位，再進行測試。"],["重新開機，只先列印 1～2 張","若仍持續顯示 Ribbon Out，就先停止，不要反覆拆裝或一直列印。"]],"connect":[["先看印表機本身有沒有錯誤","印表機要在 Ready／就緒狀態；如果機器本身顯示缺紙、缺碳帶或其他錯誤，先處理機器端問題。"],["重新插一次 USB／網路線","兩端都重新插緊；網路線可看接頭附近是否有亮燈或閃爍。"],["確認電腦選到的是正確印表機","列印時看一下印表機名稱，避免選到舊機、其他部門的印表機或 PDF 印表機。"],["查看 Windows 有沒有顯示「離線」或「暫停」","打開列印佇列，若看到離線／暫停，先取消該狀態。"],["清掉卡住的列印工作","如果佇列裡卡了很多文件，先全部取消，再重新送一張測試。"],["重新啟動印表機與電腦","先關閉印表機，再重新啟動電腦；電腦開好後再開印表機。"],["列印一次 Windows 測試頁","若測試頁也完全沒反應，把 Windows 顯示的錯誤畫面與目前是 USB／網路連線一起傳給我。"]],"quality":[["確認標籤紙與碳帶都有裝平","紙張或碳帶歪掉、皺掉，都可能造成字體一邊深一邊淡。"],["看看碳帶有沒有皺折或破損","如果固定位置一直出現空白、白線或糊掉，先看同一位置的碳帶是否也有皺。"],["關機冷卻後清潔印字接觸區","使用適合的清潔用品輕拭可接觸的印字區域；不要使用刀片、螺絲起子等硬物刮。"],["重新印同一張，確認問題是「整張」還是「固定位置」","整張都淡和固定一條白線的原因不同，先把現象分清楚。"],["如果整張太淡，濃度只提高 1～2 格再測一張","不要一次拉到最高；每調一次只印 1～2 張觀察。"],["如果開始糊字、碳帶變黏或破裂，就把濃度降回去","這通常代表熱度太高，不要再往上加。"],["固定位置仍然缺字，就先停在這裡","拍一張實際列印成品與耗材安裝照片傳給我，比一直調參數更容易判斷。"]],"feed":[["先確認是不是剛換過標籤紙","若剛換尺寸、材質、底紙、黑標紙，先記下更換前後的差異。"],["重新把紙張裝平、置中","紙張不要斜著進入走紙路徑，紙捲本身也不要歪斜。"],["把導紙器輕輕靠住紙張","太鬆會晃，太緊會卡；保持紙張可以順順移動即可。"],["看標籤間距或背面黑標是否規律","每張之間的間隔應一致；若黑標缺損、被折到或沾髒，也先換一段正常紙張測試。"],["關機後清除看得到的紙屑／殘膠","只做外部清潔，不需要拆機。"],["重新開機，只按一次 FEED","觀察它是否只走到下一張就停。"],["如果仍然連續吐很多張，就停止重複校正","把吐紙的影片、標籤正反面與型號傳給我，後面再做進一步處理。"]],"jam":[["先把印表機關機","機器停止動作後再處理紙張，避免一邊走紙一邊拉扯。"],["沿著正常走紙方向取出卡住的紙","只處理看得到、容易拿出的紙張，不要硬拉卡在深處的標籤。"],["清掉外部可見的脫落標籤與殘膠","如果標籤已經黏在滾輪或很深的位置，不要硬摳，先停下來。"],["重新把紙捲置中安裝","確認紙捲沒有歪、沒有一邊高一邊低。"],["把導紙器調到輕靠紙張","兩側要能扶住紙張，但不能把紙夾到變形。"],["重新開機，先按 FEED 走 2～3 張觀察","如果仍明顯往同一側偏、反覆皺紙或卡紙，就不要再大量列印。"]],"cutter":[["先關閉印表機電源","處理切刀問題前一定先關機，不要在刀具動作時碰紙。"],["從外側看刀口有沒有紙屑或殘膠","只查看外部可見位置，不把手伸進刀口。"],["只取出「鬆脫而且容易拿到」的紙屑","如果紙被夾在刀片深處、拉不動，就不要硬扯。"],["確認紙張沒有翹起、捲曲或背膠外露","翹起或有黏膠的紙材很容易再次卡刀。"],["重新開機，只測試一次切紙","如果仍卡住、出現異音或切刀完全不動，就直接停止測試，把照片／影片傳給我。"]]};
  const brand=document.getElementById('brand'),model=document.getElementById('model');
  if(!brand||!model)return;
  document.body.classList.add('guided-mode');
  const originalOptions=model.innerHTML;
  function esc(s){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));}
  function resetModels(){model.innerHTML=originalOptions;model.value='';}
  function filterModels(){const b=brand.value;if(!b){resetModels();return;}const rows=products.filter(p=>p.b===b);model.innerHTML='<option value="">請選擇型號（可不選）</option>'+rows.map(p=>'<option value="'+esc(p.m)+'">'+esc(p.m+'｜'+p.s)+'</option>').join('');model.value='';}
  brand.addEventListener('change',filterModels);

  function hydrateFlow(sec){
    const data=FLOW_DATA[sec.id];if(!data)return;
    sec.querySelectorAll('.checkstep').forEach(x=>x.remove());
    const hand=sec.querySelector('.handoff');if(!hand)return;
    const issue=sec.dataset.issue||'';
    data.forEach((row,i)=>{
      const label=document.createElement('label');label.className='checkstep';
      const input=document.createElement('input');input.type='checkbox';input.dataset.step=issue+'｜'+row[0];
      const body=document.createElement('span');body.className='step-body';
      const badge=document.createElement('span');badge.className='step-badge';badge.textContent='STEP '+(i+1);
      const b=document.createElement('b');b.textContent=row[0];
      const sm=document.createElement('small');sm.textContent=row[1];
      const controls=document.createElement('div');controls.className='step-controls';
      const next=document.createElement('button');next.type='button';next.className='step-next';next.textContent=i===data.length-1?'完成這一步':'完成這一步 → 下一步';
      const solved=document.createElement('button');solved.type='button';solved.className='step-solved';solved.textContent='✅ 問題已解決';
      controls.append(next,solved);body.append(badge,b,sm,controls);label.append(input,body);hand.before(label);
    });
    const h=document.createElement('div');h.className='flow-help';h.innerHTML='<b>一步一步來就好</b><span>先做目前這一步，還沒解決再往下一步。</span>';sec.querySelector('.trouble-head')?.after(h);
    const hb=hand.querySelector('b');if(hb)hb.textContent='全部做完還是沒好？';
    const back=document.createElement('button');back.type='button';back.className='back-to-issues';back.textContent='← 換其他問題';sec.querySelector('.trouble-head')?.append(back);
  }

  function setupStepFlow(sec){
    const steps=[...sec.querySelectorAll('.checkstep')];if(!steps.length)return;
    const progress=document.createElement('div');progress.className='flow-progress';progress.innerHTML='<div class="flow-meta"><span class="flow-count"></span><span class="flow-percent"></span></div><div class="flow-bar"><i></i></div>';
    sec.querySelector('.flow-help')?.after(progress);
    const solvedBox=document.createElement('div');solvedBox.className='solved-box';solvedBox.hidden=true;solvedBox.innerHTML='<div class="solved-icon">🎉</div><div><b>太好了，問題已排除</b><p>可以先正常使用；之後如果又發生，再把狀況傳給我就可以。</p><button type="button" class="restart-flow">重新排查</button></div>';
    progress.after(solvedBox);
    let current=0,solved=false;
    function render(){
      steps.forEach((step,i)=>{step.hidden=solved||i!==current;step.classList.toggle('current',!solved&&i===current);step.classList.toggle('done',i<current);});
      const done=Math.min(current,steps.length);
      const pct=Math.round(done/steps.length*100);
      progress.hidden=solved;
      progress.querySelector('.flow-count').textContent=done===steps.length?'基本排查已完成':'目前第 '+(Math.min(current+1,steps.length))+' / '+steps.length+' 步';
      progress.querySelector('.flow-percent').textContent=pct+'%';
      progress.querySelector('i').style.width=pct+'%';
      const hand=sec.querySelector('.handoff');if(hand)hand.hidden=solved||current<steps.length;
      solvedBox.hidden=!solved;
    }
    steps.forEach((step,i)=>{
      const input=step.querySelector('input');
      step.querySelector('.step-next')?.addEventListener('click',()=>{input.checked=true;current=i+1;render();if(current<steps.length)setTimeout(()=>steps[current].scrollIntoView({behavior:'smooth',block:'center'}),80);else sec.querySelector('.handoff')?.scrollIntoView({behavior:'smooth',block:'center'});});
      step.querySelector('.step-solved')?.addEventListener('click',()=>{input.checked=true;current=i+1;solved=true;render();solvedBox.scrollIntoView({behavior:'smooth',block:'center'});});
    });
    solvedBox.querySelector('.restart-flow')?.addEventListener('click',()=>{steps.forEach(s=>s.querySelector('input').checked=false);current=0;solved=false;render();steps[0].scrollIntoView({behavior:'smooth',block:'center'});});
    sec.querySelector('.back-to-issues')?.addEventListener('click',()=>{sec.classList.remove('active-trouble');document.querySelector('.issues')?.scrollIntoView({behavior:'smooth',block:'start'});});
    render();
  }

  document.querySelectorAll('.trouble').forEach(hydrateFlow);
  document.querySelectorAll('.trouble').forEach(setupStepFlow);
  document.querySelectorAll('.issue-card').forEach(card=>card.addEventListener('click',e=>{
    e.preventDefault();
    const id=(card.getAttribute('href')||'').replace('#','');const target=document.getElementById(id);if(!target)return;
    document.querySelectorAll('.trouble').forEach(s=>s.classList.remove('active-trouble'));
    target.classList.add('active-trouble');
    setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'start'}),30);
  }));

  const footer=document.querySelector('footer');if(footer)footer.textContent='如果照步驟試過還是不行，把畫面、照片跟型號傳給我就可以了。｜版本 1.7';
  document.querySelectorAll('.make-summary').forEach(btn=>btn.addEventListener('click',()=>{
    const sec=document.getElementById(btn.dataset.target);if(!sec)return;const issue=sec.dataset.issue||'未指定';
    const checked=[...sec.querySelectorAll('input[type=checkbox]:checked')].map(x=>{const raw=x.dataset.step||'';return raw.includes('｜')?raw.split('｜').slice(1).join('｜'):raw;}).filter(Boolean);
    const total=sec.querySelectorAll('.checkstep').length;
    const text=['【標籤機簡易排查結果】','品牌：'+(brand.value||'未填'),'型號：'+(model.value||'未填'),'問題：'+issue,'完成步驟：'+checked.length+' / '+total,'','已完成：'].concat(checked.length?checked.map((x,i)=>(i+1)+'. '+x):['尚未完成任何步驟']).concat(['','如果照上面步驟試過還是沒好，我再協助處理。']).join('\n');
    const pre=document.getElementById('summary-'+btn.dataset.target);if(pre){pre.textContent=text;pre.hidden=false;pre.scrollIntoView({behavior:'smooth',block:'nearest'});}
  }));
  const brands=[...brand.options].map(o=>o.value).filter(Boolean),models=new Set(products.map(p=>p.m));
  console.info('[customer-tool self-check]',{brands:brands.length,products:products.length,uniqueModels:models.size,flows:document.querySelectorAll('.trouble').length,steps:document.querySelectorAll('.checkstep').length,version:'1.7'});
})();
