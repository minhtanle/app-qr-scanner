// App version - sẽ được bump-version.ps1 cập nhật
const buildVersion = '1.1.14';

// Fix viewport height on mobile (khắc phục lỗi alert làm lệch layout)
function fixViewportHeight() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    // Force reflow cho body
    document.body.style.height = window.innerHeight + 'px';
    requestAnimationFrame(() => {
        document.body.style.height = '';
    });
}

window.addEventListener('resize', fixViewportHeight);
window.addEventListener('orientationchange', () => {
    setTimeout(fixViewportHeight, 100);
});
fixViewportHeight();

// Toggle modal settings
function toggleModal() {
    const modal = document.getElementById('settingModal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

// Touch handlers để khóa scroll ngoài vùng cho phép
let touchStartY = 0;
document.addEventListener('touchstart', (event) => {
    if (event.touches && event.touches.length > 0) {
        touchStartY = event.touches[0].clientY;
    }
}, { passive: false });

document.addEventListener('touchmove', (event) => {
    const scrollable = event.target.closest('.ios-scroll-lock');

    if (!scrollable) {
        event.preventDefault();
        return;
    }

    const touchY = event.touches[0].clientY;
    const pullingDown = touchY > touchStartY;
    const atTop = scrollable.scrollTop <= 0;
    const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;

    if ((atTop && pullingDown) || (atBottom && !pullingDown)) {
        event.preventDefault();
    }
}, { passive: false });

// Xử lý Update Toast
function showUpdateToast() {
    const loadingBar = document.getElementById('loading-bar');
    const updateToast = document.getElementById('update-toast');
    const container = document.getElementById('update-toast-container');

    if (loadingBar) loadingBar.classList.add('hidden');
    if (updateToast) {
        updateToast.classList.remove('hidden');
        updateToast.addEventListener('click', () => {
            // Nếu có SW mới, skipWaiting để kích hoạt ngay
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then((registration) => {
                    if (registration.waiting) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                });
            } else {
                window.location.reload();
            }
        });
    }
}

// Service Worker registration
if ('serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });

    window.addEventListener('load', () => {
        // Hiện Version Toast
        const versionToast = document.getElementById('version-toast');
        const versionText = document.getElementById('version-text');
        if (versionToast && versionText) {
            versionText.textContent = buildVersion;
            versionToast.classList.remove('hidden');
            setTimeout(() => {
                versionToast.classList.add('hidden');
            }, 3000);
        }

        console.log(`%cDa tai code moi. Build: ${buildVersion}`, 'color: #10b981; font-weight: bold; font-size: 14px;');

        navigator.serviceWorker.register('./sw.js').then((registration) => {
            // Kiểm tra nếu có SW mới đang chờ
            if (registration.waiting) {
                showUpdateToast();
            }

            // Lắng nghe SW mới được cài đặt
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateToast();
                    }
                });
            });
        }).catch(() => {
            // Silent catch: app should still work without PWA features.
        });

        // Fix lại layout sau khi load xong
        setTimeout(fixViewportHeight, 500);
    });
} else {
    window.addEventListener('load', () => {
        console.log(`Da tai code moi. Build: ${buildVersion}`);
    });
}
