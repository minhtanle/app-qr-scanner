// Touch Inspector - Hiện thông tin element khi chạm vào màn hình
let inspectorMode = false;
let highlightEl = null;
let tooltipEl = null;

function toggleTouchInspector() {
    inspectorMode = !inspectorMode;
    
    if (inspectorMode) {
        // Tạo overlay highlight
        highlightEl = document.createElement('div');
        highlightEl.id = 'touch-inspector-highlight';
        highlightEl.style.cssText = `
            position: fixed;
            border: 2px solid #ff0080;
            background: rgba(255, 0, 128, 0.1);
            pointer-events: none;
            z-index: 99999;
            transition: all 0.15s ease;
        `;
        document.body.appendChild(highlightEl);
        
        // Tạo tooltip
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'touch-inspector-tooltip';
        tooltipEl.style.cssText = `
            position: fixed;
            background: #1a1a2e;
            color: #fff;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 11px;
            font-family: monospace;
            z-index: 100000;
            pointer-events: none;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            line-height: 1.4;
        `;
        document.body.appendChild(tooltipEl);
        
        document.addEventListener('touchstart', onTouchInspector, true);
        document.addEventListener('touchmove', onTouchInspector, true);
        
        console.log('%c🔍 Touch Inspector ON', 'color: #ff0080; font-weight: bold;');
    } else {
        if (highlightEl) highlightEl.remove();
        if (tooltipEl) tooltipEl.remove();
        document.removeEventListener('touchstart', onTouchInspector, true);
        document.removeEventListener('touchmove', onTouchInspector, true);
        console.log('%c🔍 Touch Inspector OFF', 'color: #888; font-weight: bold;');
    }
}

function onTouchInspector(e) {
    if (!inspectorMode) return;
    
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    
    const el = document.elementFromPoint(x, y);
    if (!el || el.id === 'touch-inspector-highlight' || el.id === 'touch-inspector-tooltip') return;
    
    // Highlight element
    const rect = el.getBoundingClientRect();
    highlightEl.style.left = rect.left + 'px';
    highlightEl.style.top = rect.top + 'px';
    highlightEl.style.width = rect.width + 'px';
    highlightEl.style.height = rect.height + 'px';
    
    // Tooltip info
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classes = el.className ? `.${el.className.split(' ').join('.')}` : '';
    const size = `${Math.round(rect.width)} x ${Math.round(rect.height)}`;
    
    tooltipEl.innerHTML = `
        <div style="color: #ff0080; font-weight: bold;">${tag}${id}</div>
        <div style="color: #00ff88;">${classes.substring(0, 50)}</div>
        <div style="color: #ffaa00; margin-top: 4px;">${size}</div>
    `;
    
    // Đặt tooltip vị trí (tránh tràn màn hình)
    let tooltipX = rect.left;
    let tooltipY = rect.top - 60;
    if (tooltipY < 10) tooltipY = rect.bottom + 10;
    if (tooltipX + 300 > window.innerWidth) tooltipX = window.innerWidth - 310;
    
    tooltipEl.style.left = tooltipX + 'px';
    tooltipEl.style.top = tooltipY + 'px';
}

window.toggleTouchInspector = toggleTouchInspector;
