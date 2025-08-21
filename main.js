// Đảm bảo đoạn này chạy khi DOM đã load
document.addEventListener('DOMContentLoaded', function() {
  // Đường dẫn worker chuẩn
  QrScanner.WORKER_PATH = 'https://unpkg.com/qr-scanner@1.4.2/qr-scanner-worker.min.js';

  const videoElem = document.getElementById('qr-video');
  const startBtn = document.getElementById('start-scan');
  const loadingElem = document.getElementById('loading');
  const timeoutMsg = document.getElementById('timeout-msg');

  let scanner = null;
  let scanTimeout = null;

  function resetUI() {
    loadingElem.style.display = "block";
    timeoutMsg.style.display = "none";
    startBtn.disabled = false;
  }

  function startScan() {
    resetUI();
    startBtn.disabled = true;

    try {
      scanner = new QrScanner(videoElem, result => {
        stopScan();
        alert("Đã quét được: " + result);
      });

      scanner.start().then(() => {
        loadingElem.style.display = "none";
        scanTimeout = setTimeout(() => {
          stopScan();
          timeoutMsg.style.display = "block";
          startBtn.disabled = false;
        }, 15000);
      }).catch(err => {
        loadingElem.innerText = "Không thể mở camera: " + err;
        startBtn.disabled = false;
      });
    } catch (e) {
      alert("Lỗi khởi tạo scanner: " + e);
    }
  }

  function stopScan() {
    if (scanner) {
      scanner.stop();
      scanner.destroy();
      scanner = null;
    }
    if (scanTimeout) {
      clearTimeout(scanTimeout);
      scanTimeout = null;
    }
  }

  startBtn.addEventListener('click', startScan);
  resetUI();
});