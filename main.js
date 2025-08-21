const scanResultElem = document.getElementById('scan-result');
const apiRespElem = document.getElementById('api-response');
const scanAgainBtn = document.getElementById('scan-again');
const startBtn = document.getElementById('start-scan');
const stopBtn = document.getElementById('stop-scan');
const qrReaderElem = document.getElementById('qr-reader');
const qrPlaceholderElem = document.getElementById('qr-placeholder');

let html5QrCode = null;
let lastScannedText = null;
const API_ENDPOINT = 'https://webhook.site/96425fe6-6a22-45e7-a76e-2a2ed4eed360'; // Sửa lại endpoint nếu cần

function resetUI() {
  scanResultElem.innerHTML = '';
  apiRespElem.innerHTML = '';
  scanAgainBtn.style.display = 'none';
  lastScannedText = null;
  stopBtn.disabled = true;
  startBtn.disabled = false;
  qrReaderElem.style.display = 'none';
  qrPlaceholderElem.style.display = 'flex';
}

function showScanAgain() {
  scanAgainBtn.style.display = 'inline-block';
}

function startScanner() {
  resetUI();
  qrReaderElem.style.display = 'block';
  qrPlaceholderElem.style.display = 'none';

  // Khởi tạo scanner nếu chưa có
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("qr-reader");
  }

  html5QrCode.start(
    { facingMode: "environment" },
    {
      fps: 12,
      qrbox: { width: 220, height: 220 }
    },
    onScanSuccess,
    onScanError
  ).then(() => {
    stopBtn.disabled = false;
    startBtn.disabled = true;
  }).catch(err => {
    scanResultElem.innerHTML = `<span class="text-danger">Không thể mở camera: ${err}</span>`;
    stopBtn.disabled = true;
    startBtn.disabled = false;
  });
}

function stopScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      stopBtn.disabled = true;
      startBtn.disabled = false;
      qrReaderElem.style.display = 'none';
      qrPlaceholderElem.style.display = 'flex';
    }).catch(() => {
      // Ignore stop error
    });
  }
}

function onScanSuccess(decodedText, decodedResult) {
  if (lastScannedText === decodedText) return;
  lastScannedText = decodedText;
  html5QrCode.stop().then(() => {
    stopBtn.disabled = true;
    startBtn.disabled = false;
    scanResultElem.innerHTML = `<b>Mã QR:</b> ${decodedText}`;
    apiRespElem.innerHTML = `<span class='spinner-border spinner-border-sm'></span> Đang gửi dữ liệu...`;
    showScanAgain();

    // Gọi API
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr: decodedText })
    })
      .then(resp => {
        if (!resp.ok) throw new Error('API lỗi');
        return resp.json();
      })
      .then(data => {
        apiRespElem.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      })
      .catch(() => {
        apiRespElem.innerHTML = `<span class='text-danger'>Lỗi khi gửi dữ liệu lên API!</span>`;
        showScanAgain();
      });
  });
}

// Xử lý khi quét lỗi (không cần hiển thị liên tục)
function onScanError(errorMessage) {}

// Quét lại
scanAgainBtn.onclick = function() {
  resetUI();
  // Nếu html5QrCode chưa có, tạo mới
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("qr-reader");
  }
  startScanner();
};

startBtn.onclick = startScanner;
stopBtn.onclick = stopScanner;

// Khởi động giao diện ban đầu
window.onload = resetUI;