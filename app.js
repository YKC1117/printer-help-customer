(function(){
  'use strict';

  const VERSION = '1.10.1';
  const products = Array.isArray(window.PRINTER_PRODUCTS) ? window.PRINTER_PRODUCTS : [];
  const flows = window.PRINTER_FLOWS && typeof window.PRINTER_FLOWS === 'object' ? window.PRINTER_FLOWS : {};
  const photos = window.PRINTER_PHOTOS && typeof window.PRINTER_PHOTOS === 'object' ? window.PRINTER_PHOTOS : {};
  const brand = document.getElementById('brand');
  const model = document.getElementById('model');
  if (!brand || !model) return;

  document.body.classList.add('guided-mode');
  const originalOptions = model.innerHTML;
  const flowStates = new Map();

  function esc(s){
    return String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c));
  }

  function resetModels(){
    model.innerHTML = originalOptions;
    model.value = '';
  }

  function filterModels(){
    const b = brand.value;
    if(!b){ resetModels(); return; }
    const rows = products.filter(p => p.b === b);
    model.innerHTML = '<option value="">請選擇型號（可不選）</option>' + rows.map(p => '<option value="'+esc(p.m)+'">'+esc(p.m+'｜'+p.s)+'</option>').join('');
    model.value = '';
  }
  brand.addEventListener('change', filterModels);

  function photoChecklist(id){
    const items = photos[id] || ['錯誤畫面', '耗材安裝狀況', '機器型號貼紙'];
    return '<div class="photo-checklist"><b>📷 請幫我拍這些</b><ol>' + items.map(x => '<li>'+esc(x)+'</li>').join('') + '</ol><span>照片不用特別整理，拍清楚就可以。</span></div>';
  }

  function activateIssue(id){
    const target = document.getElementById(id);
    if(!target) return;
    document.querySelectorAll('.trouble').forEach(s => s.classList.remove('active-trouble'));
    target.classList.add('active-trouble');
    setTimeout(() => target.scrollIntoView({behavior:'smooth', block:'start'}), 40);
  }

  function addBackButton(sec){
    if(sec.querySelector('.back-to-issues')) return;
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'back-to-issues';
    back.textContent = '← 換其他問題';
    sec.querySelector('.trouble-head')?.append(back);
    back.addEventListener('click', () => {
      sec.classList.remove('active-trouble');
      document.querySelector('.issues')?.scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  function hydrateFlow(sec){
    const baseData = Array.isArray(flows[sec.id]) ? flows[sec.id] : null;
    if(!baseData) return;

    // connect 的第一個判斷已由 addConnectionBranch 的分支選單取代。
    // 使用 handledByBranch 標記過濾，避免未來新增或調整順序時誤刪其他步驟。
    const data = baseData.filter(step => !step.handledByBranch);

    sec.querySelectorAll('.checkstep,.flow-help,.flow-progress,.solved-box,.branch-box,.branch-stop,.branch-back').forEach(x => x.remove());
    const hand = sec.querySelector('.handoff');
    if(!hand) return;
    const issue = sec.dataset.issue || '';

    data.forEach((row, i) => {
      const label = document.createElement('label');
      label.className = 'checkstep';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.dataset.step = issue + '｜' + row.title;

      const body = document.createElement('span');
      body.className = 'step-body';
      const badge = document.createElement('span');
      badge.className = 'step-badge';
      badge.textContent = 'STEP ' + (i + 1);
      const b = document.createElement('b');
      b.textContent = row.title;
      const sm = document.createElement('small');
      sm.textContent = row.desc;

      const controls = document.createElement('div');
      controls.className = 'step-controls';

      if(i > 0){
        const prev = document.createElement('button');
        prev.type = 'button';
        prev.className = 'step-prev';
        prev.textContent = '← 上一步';
        controls.append(prev);
      }

      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'step-next';
      next.textContent = i === data.length - 1 ? '完成這一步' : '還是有問題 → 下一步';
      const solved = document.createElement('button');
      solved.type = 'button';
      solved.className = 'step-solved';
      solved.textContent = '✅ 這一步後恢復正常';

      controls.append(next, solved);
      body.append(badge, b, sm, controls);
      label.append(input, body);
      hand.before(label);
    });

    const h = document.createElement('div');
    h.className = 'flow-help';
    h.innerHTML = '<b>一步一步來就好</b><span>做完目前這一步，如果還是沒好再繼續；恢復正常就直接按綠色按鈕。</span>';
    sec.querySelector('.trouble-head')?.after(h);

    hand.insertAdjacentHTML('beforeend', photoChecklist(sec.id));
    const hb = hand.querySelector('b');
    if(hb) hb.textContent = '全部做完還是沒好？';
    addBackButton(sec);
    if(sec.id === 'connect') addConnectionBranch(sec);
  }

  function addConnectionBranch(sec){
    const box = document.createElement('div');
    box.className = 'branch-box';
    box.innerHTML = '<span class="branch-label">先判斷一下</span><b>印表機本身現在有顯示錯誤嗎？</b><p>先看機器螢幕或燈號，不用急著處理電腦。</p><div class="branch-options"><button type="button" data-route="paperout">📄 有，顯示 Paper Out</button><button type="button" data-route="ribbon">🎞️ 有，顯示 Ribbon Out</button><button type="button" data-route="other">⚠️ 有，但不是這兩種</button><button type="button" data-route="ready" class="branch-ready">✅ 沒有錯誤／顯示 Ready</button></div>';
    sec.querySelector('.flow-help')?.after(box);

    const stop = document.createElement('div');
    stop.className = 'branch-stop';
    stop.hidden = true;
    stop.innerHTML = '<b>先停在這裡比較好</b><p>如果機器本身已經有其他錯誤訊息，先不要改 Windows 或驅動設定。把錯誤畫面拍給我會比較快。</p>' + photoChecklist('connect') + '<div class="branch-stop-actions"><button type="button" class="branch-copy">📋 複製回報內容</button><button type="button" class="branch-reset">← 回上一題</button></div>';
    box.after(stop);

    box.querySelectorAll('[data-route]').forEach(btn => btn.addEventListener('click', () => {
      const route = btn.dataset.route;
      if(route === 'paperout' || route === 'ribbon'){
        activateIssue(route);
        return;
      }
      if(route === 'other'){
        box.hidden = true;
        stop.hidden = false;
        sec.querySelector('.flow-progress')?.setAttribute('hidden','');
        sec.querySelector('.branch-back')?.setAttribute('hidden','');
        sec.querySelectorAll('.checkstep').forEach(x => x.hidden = true);
        sec.querySelector('.handoff').hidden = true;
        return;
      }
      if(route === 'ready'){
        box.hidden = true;
        const state = flowStates.get(sec.id);
        if(state){ state.branchReady = true; state.render(); }
      }
    }));

    stop.querySelector('.branch-copy')?.addEventListener('click', () => {
      const text = [
        '【標籤機簡易排查結果】',
        '品牌：' + (brand.value || '未填'),
        '型號：' + (model.value || '未填'),
        '問題：電腦送印沒反應／連不到印表機',
        '目前狀況：印表機本身有其他錯誤訊息',
        '',
        '請附上：',
        '1. 印表機目前的錯誤畫面',
        '2. 機器型號貼紙',
        '3. USB／網路線目前的連接狀況'
      ].join('\n');
      copyText(text, stop.querySelector('.branch-copy'));
    });

    stop.querySelector('.branch-reset')?.addEventListener('click', () => {
      stop.hidden = true;
      box.hidden = false;
      const state = flowStates.get(sec.id);
      if(state){ state.branchReady = false; state.render(); }
    });
  }

  function setupStepFlow(sec){
    const steps = [...sec.querySelectorAll('.checkstep')];
    if(!steps.length) return;

    const progress = document.createElement('div');
    progress.className = 'flow-progress';
    progress.innerHTML = '<div class="flow-meta"><span class="flow-count"></span><span class="flow-percent"></span></div><div class="flow-bar"><i></i></div>';
    const anchor = sec.querySelector('.branch-box') || sec.querySelector('.flow-help');
    anchor?.after(progress);

    let branchBack = null;
    if(sec.id === 'connect'){
      branchBack = document.createElement('button');
      branchBack.type = 'button';
      branchBack.className = 'branch-back';
      branchBack.textContent = '← 這題答錯了，回分支題';
      branchBack.hidden = true;
      progress.after(branchBack);
    }

    const solvedBox = document.createElement('div');
    solvedBox.className = 'solved-box';
    solvedBox.hidden = true;
    solvedBox.innerHTML = '<div class="solved-icon">🎉</div><div><b>太好了，問題已排除</b><p>建議再正常操作 2～3 次確認穩定。如果之後又發生，再把狀況傳給我就可以。</p><button type="button" class="restart-flow">重新排查</button></div>';
    (branchBack || progress).after(solvedBox);

    let current = 0;
    let solved = false;
    let branchReady = sec.id !== 'connect';

    function render(){
      const canShow = branchReady;
      steps.forEach((step, i) => {
        step.hidden = solved || !canShow || i !== current;
        step.classList.toggle('current', !solved && canShow && i === current);
        step.classList.toggle('done', i < current);
      });
      const done = Math.min(current, steps.length);
      const pct = Math.round(done / steps.length * 100);
      progress.hidden = solved || !canShow;
      progress.querySelector('.flow-count').textContent = done === steps.length ? '基本排查已完成' : '目前第 ' + Math.min(current + 1, steps.length) + ' / ' + steps.length + ' 步';
      progress.querySelector('.flow-percent').textContent = pct + '%';
      progress.querySelector('i').style.width = pct + '%';
      if(branchBack) branchBack.hidden = solved || !canShow;
      const hand = sec.querySelector('.handoff');
      if(hand) hand.hidden = solved || !canShow || current < steps.length;
      solvedBox.hidden = !solved;
    }

    const state = {
      get current(){ return current; },
      set current(v){ current = v; },
      get branchReady(){ return branchReady; },
      set branchReady(v){ branchReady = v; },
      get solved(){ return solved; },
      render
    };
    flowStates.set(sec.id, state);

    steps.forEach((step, i) => {
      const input = step.querySelector('input');

      step.querySelector('.step-prev')?.addEventListener('click', () => {
        current = Math.max(0, i - 1);
        render();
        setTimeout(() => steps[current].scrollIntoView({behavior:'smooth', block:'center'}), 80);
      });

      step.querySelector('.step-next')?.addEventListener('click', () => {
        input.checked = true;
        current = i + 1;
        render();
        if(current < steps.length){
          setTimeout(() => steps[current].scrollIntoView({behavior:'smooth', block:'center'}), 80);
        } else {
          sec.querySelector('.handoff')?.scrollIntoView({behavior:'smooth', block:'center'});
        }
      });

      step.querySelector('.step-solved')?.addEventListener('click', () => {
        input.checked = true;
        current = i + 1;
        solved = true;
        render();
        solvedBox.scrollIntoView({behavior:'smooth', block:'center'});
      });
    });

    branchBack?.addEventListener('click', () => {
      branchReady = false;
      const branch = sec.querySelector('.branch-box');
      const stop = sec.querySelector('.branch-stop');
      if(branch) branch.hidden = false;
      if(stop) stop.hidden = true;
      render();
      branch?.scrollIntoView({behavior:'smooth', block:'center'});
    });

    solvedBox.querySelector('.restart-flow')?.addEventListener('click', () => {
      steps.forEach(s => s.querySelector('input').checked = false);
      current = 0;
      solved = false;
      branchReady = sec.id !== 'connect';
      const branch = sec.querySelector('.branch-box');
      const stop = sec.querySelector('.branch-stop');
      if(branch) branch.hidden = false;
      if(stop) stop.hidden = true;
      render();
      (branch || steps[0]).scrollIntoView({behavior:'smooth', block:'center'});
    });

    render();
  }

  async function copyText(text, button){
    let ok = false;
    try{
      if(navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    }catch(e){}

    if(!ok){
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try{ ok = document.execCommand('copy'); }catch(e){}
      ta.remove();
    }

    if(button){
      const old = button.textContent;
      button.textContent = ok ? '✅ 已複製，可直接貼 LINE' : '請長按下方文字複製';
      button.classList.toggle('copied', ok);
      setTimeout(() => {
        button.textContent = old;
        button.classList.remove('copied');
      }, 2600);
    }
    return ok;
  }

  function makeSummary(sec){
    const issue = sec.dataset.issue || '未指定';
    const checked = [...sec.querySelectorAll('input[type=checkbox]:checked')].map(x => {
      const raw = x.dataset.step || '';
      const cut = raw.indexOf('｜');
      return cut >= 0 ? raw.substring(cut + 1) : raw;
    }).filter(Boolean);
    const total = sec.querySelectorAll('.checkstep').length;
    const photoItems = photos[sec.id] || [];
    const state = flowStates.get(sec.id);
    const result = state?.solved ? '已排除' : '仍未排除';

    return [
      '【標籤機簡易排查結果】',
      '品牌：' + (brand.value || '未填'),
      '型號：' + (model.value || '未填'),
      '問題：' + issue,
      '完成步驟：' + checked.length + ' / ' + total,
      '',
      '已完成：'
    ].concat(
      checked.length ? checked.map((x, i) => (i + 1) + '. ' + x) : ['尚未完成任何步驟']
    ).concat([
      '',
      '目前結果：' + result,
      '',
      '建議附上照片：'
    ]).concat(
      photoItems.map((x, i) => (i + 1) + '. ' + x)
    ).concat([
      '',
      '以上資料直接貼給我即可。'
    ]).join('\n');
  }

  function makeUnknownSummary(sec){
    const detail = (sec.querySelector('#unknown-description')?.value || '').trim();
    const photoItems = photos.unknown || [];
    return [
      '【標籤機簡易排查結果】',
      '品牌：' + (brand.value || '未填'),
      '型號：' + (model.value || '未填'),
      '問題：找不到符合的問題／不確定',
      '狀況描述：' + detail,
      '',
      '建議附上照片：'
    ].concat(photoItems.map((x, i) => (i + 1) + '. ' + x)).concat([
      '',
      '以上資料直接貼給我即可。'
    ]).join('\n');
  }

  function setUnknownError(sec, show){
    const field = sec.querySelector('#unknown-description');
    const error = sec.querySelector('.unknown-error');
    if(field) field.classList.toggle('input-error', show);
    if(error) error.hidden = !show;
  }

  function validateUnknown(sec){
    const field = sec.querySelector('#unknown-description');
    if(!field) return true;
    const valid = field.value.trim().length > 0;
    setUnknownError(sec, !valid);
    if(!valid){
      field.focus();
      field.scrollIntoView({behavior:'smooth', block:'center'});
    }
    return valid;
  }

  function setupUnknownIssue(sec){
    addBackButton(sec);
    const photoTarget = sec.querySelector('.unknown-photos');
    if(photoTarget) photoTarget.innerHTML = photoChecklist('unknown');
    const field = sec.querySelector('#unknown-description');
    const counter = sec.querySelector('#unknown-counter');

    function updateUnknownCounter(){
      if(!field || !counter) return;
      const max = Number(field.maxLength) > 0 ? Number(field.maxLength) : 500;
      counter.textContent = '已輸入 ' + field.value.length + ' / ' + max + ' 字';
    }

    updateUnknownCounter();
    field?.addEventListener('input', () => {
      updateUnknownCounter();
      if(field.value.trim()) setUnknownError(sec, false);
    });
  }

  document.querySelectorAll('.trouble:not([data-direct="true"])').forEach(hydrateFlow);
  document.querySelectorAll('.trouble:not([data-direct="true"])').forEach(setupStepFlow);
  document.querySelectorAll('.trouble[data-direct="true"]').forEach(setupUnknownIssue);

  document.querySelectorAll('.issue-card').forEach(card => card.addEventListener('click', e => {
    e.preventDefault();
    activateIssue((card.getAttribute('href') || '').replace('#',''));
  }));

  document.querySelectorAll('.make-summary').forEach(btn => {
    btn.textContent = '整理＋複製排查結果';
    btn.addEventListener('click', async () => {
      const sec = document.getElementById(btn.dataset.target);
      if(!sec) return;

      if(sec.dataset.direct === 'true' && !validateUnknown(sec)) return;

      const text = sec.dataset.direct === 'true' ? makeUnknownSummary(sec) : makeSummary(sec);
      const pre = document.getElementById('summary-' + btn.dataset.target);
      if(pre){ pre.textContent = text; pre.hidden = false; }

      let copyBtn = sec.querySelector('.copy-summary');
      if(!copyBtn){
        copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'copy-summary';
        copyBtn.textContent = '📋 再複製一次';
        btn.after(copyBtn);
        copyBtn.addEventListener('click', () => copyText(pre?.textContent || (sec.dataset.direct === 'true' ? makeUnknownSummary(sec) : makeSummary(sec)), copyBtn));
      }
      await copyText(text, btn);
      pre?.scrollIntoView({behavior:'smooth', block:'nearest'});
    });
  });

  function selfCheck(){
    const brands = [...brand.options].map(o => o.value).filter(Boolean);
    const models = new Set(products.map(p => p.m));
    const issueCards = [...document.querySelectorAll('.issue-card')];
    const standardSections = [...document.querySelectorAll('.trouble:not([data-direct="true"])')];
    const directSections = [...document.querySelectorAll('.trouble[data-direct="true"]')];
    const missingTargets = issueCards.map(card => (card.getAttribute('href') || '').replace('#','')).filter(id => !document.getElementById(id));
    const missingFlows = standardSections.map(sec => sec.id).filter(id => !Array.isArray(flows[id]));
    const connectBranchMarkers = Array.isArray(flows.connect) ? flows.connect.filter(step => step.handledByBranch).length : 0;
    const stepCount = document.querySelectorAll('.checkstep').length;
    const prevButtons = document.querySelectorAll('.step-prev').length;
    const expectedPrevButtons = standardSections.reduce((sum, sec) => sum + Math.max(sec.querySelectorAll('.checkstep').length - 1, 0), 0);
    const connectBackButtons = document.querySelectorAll('#connect .branch-back').length;
    const unknownErrors = document.querySelectorAll('#unknown .unknown-error').length;
    const unknownCounters = document.querySelectorAll('#unknown #unknown-counter').length;

    const report = {
      version: VERSION,
      brands: brands.length,
      products: products.length,
      uniqueModels: models.size,
      issueCards: issueCards.length,
      standardFlows: standardSections.length,
      directIssues: directSections.length,
      steps: stepCount,
      prevButtons,
      expectedPrevButtons,
      connectBackButtons,
      unknownErrors,
      unknownCounters,
      missingTargets,
      missingFlows,
      connectBranchMarkers
    };
    console.info('[customer-tool self-check]', report);
    if(
      brands.length !== 7 ||
      products.length !== 111 ||
      issueCards.length !== 9 ||
      standardSections.length !== 8 ||
      directSections.length !== 1 ||
      missingTargets.length ||
      missingFlows.length ||
      connectBranchMarkers !== 1 ||
      prevButtons !== expectedPrevButtons ||
      connectBackButtons !== 1 ||
      unknownErrors !== 1 ||
      unknownCounters !== 1
    ){
      console.warn('[customer-tool self-check warning]', report);
    }
  }

  selfCheck();
})();