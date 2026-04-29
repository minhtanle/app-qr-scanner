// App version - sẽ được bump-version.ps1 cập nhật
const buildVersion = '1.1.3';

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

// Service Worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });

    window.addEventListener('load', () => {
        alert(`Da tai code moi. Build: ${buildVersion}`);

        navigator.serviceWorker.register('./sw.js').catch(() => {
            // Silent catch: app should still work without PWA features.
        });
    });
} else {
    window.addEventListener('load', () => {
        alert(`Da tai code moi. Build: ${buildVersion}`);
    });
}
