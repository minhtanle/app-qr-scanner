# PWA Mobile Starter

Template khung cho các ứng dụng PWA mobile giả lập native app.

## Tính năng có sẵn

- ✅ Xử lý safe-area (tai thỏ, màn hình cong)
- ✅ Nút thao tác cố định ở cạnh dưới (bottom action bar)
- ✅ Scroll nội dung dài với ios-scroll-lock
- ✅ Layout camera-section + info-section đè lên nhau
- ✅ Service Worker với cache strategy thông minh
- ✅ Tự động reload khi có version mới
- ✅ GitHub Pages auto deploy với GitHub Actions
- ✅ Không cần build step (dùng CDN cho Tailwind, Font Awesome)

## Cấu trúc thư mục

```
.
├── index.html                 # Frame + App content
├── sw.js                     # Service Worker (cache strategy)
├── manifest.webmanifest      # PWA manifest
├── main.js                   # App-specific logic (QR Scanner...)
├── assets/
│   ├── css/
│   │   └── style.css        # TẤT CẢ styles (safe-area, scroll...)
│   ├── js/
│   │   └── app.js           # Generic JS (modal, touch, SW)
│   └── icons/               # App icons (192, 256, 512)
├── .github/workflows/
│   └── deploy.yml           # GitHub Pages auto deploy
└── scripts/
    └── bump-version.ps1     # Tự động tăng version
```

## Cách sử dụng cho app mới

1. **Clone repo này** hoặc dùng "Use this template" trên GitHub
2. **Sửa nội dung** trong `index.html`:
   - Đổi `APP TITLE`, `APP CONTENT`, `TÁC VỤ CHÍNH`...
   - Giữ nguyên phần FRAME (camera-section, info-section, action-bar)
3. **Xóa hoặc thay đổi** `main.js` (nếu app không dùng QR Scanner)
4. **Cập nhật** `manifest.webmanifest` (tên app, icons...)
5. **Push lên GitHub** → Tự động deploy lên GitHub Pages

## Cập nhật version

Chạy script trước khi commit:
```powershell
.\scripts\bump-version.ps1
```

Script sẽ tự động tăng patch version trong:
- `assets/js/app.js` (buildVersion)
- `sw.js` (CACHE_VERSION)

## Triển khai (Deploy)

- Push code lên nhánh `main`
- GitHub Actions sẽ tự động deploy lên GitHub Pages
- URL: `https://<username>.github.io/<repo-name>/`

## Ghi chú

- **FRAME**: Không sửa các phần có comment `<!-- FRAME -->` (trừ khi muốn thay đổi cấu trúc chung)
- **APP CONTENT**: Sửa nội dung trong các phần `<!-- APP CONTENT -->`
- Không cần npm install hay build step nào
- Dùng Tailwind CSS qua CDN (phiên bản 4)
