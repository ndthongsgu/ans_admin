# ans_admin — React + TypeScript + Vite ⚡

**Mô tả ngắn:** giao diện Admin dùng React + TypeScript với Vite. README này hướng dẫn nhanh cách cài đặt, chạy ở môi trường phát triển, build và một số lệnh hữu ích.

---

## 🛠 Yêu cầu trước

- Node.js >= 18 (khuyến nghị LTS)
- npm (hoặc pnpm / yarn)

Kiểm tra phiên bản:

```bash
node -v
npm -v
```

---

## 🚀 Khởi động nhanh

1. Cài dependencies:

```bash
# từ thư mục ans_admin
npm install
# hoặc nếu muốn cài chính xác theo lockfile
npm ci
```

2. Chạy dev server (hot reload):

```bash
npm run dev
```
Mặc định Vite sẽ chạy ở `http://localhost:5173` (hoặc port được log ra).

3. Build production:

```bash
npm run build
```

4. Preview bản build (local):

```bash
npm run preview
```

---

## 🔧 Biến môi trường

- Nếu cần cấu hình URL API hoặc các biến client-side, tạo file `.env` hoặc `.env.local` trong thư mục `ans_admin`.
- Lưu ý: để Vite expose biến cho client, **phải** đặt tiền tố `VITE_`.

Ví dụ `.env`:

```ini
VITE_API_URL=https://api.example.com
VITE_FEATURE_FLAG=true
```

> **Tip:** lưu mẫu vào `.env.example` để dev khác biết cần những biến nào.

---

## ✅ Lint & Kiểm tra

- Lint project:

```bash
npm run lint
```

- Type check: phần build gọi `tsc -b` nên chạy `npm run build` sẽ phát hiện lỗi type.
- Tests: hiện tại chưa có cấu hình test. Nếu cần, mình có thể thêm `vitest`/`jest`.

---

## 🔁 Các lệnh thường dùng

- **dev:** `npm run dev` — chạy server dev
- **build:** `npm run build` — build production (`tsc -b && vite build`)
- **preview:** `npm run preview` — preview build
- **lint:** `npm run lint` — chạy ESLint

---

## 📦 Docker (tùy chọn)

Muốn mình thêm `Dockerfile` + `docker-compose.yml` để chạy cùng backend (ví dụ MySQL / API), mình sẽ tạo và test giúp.

---

## 🐛 Troubleshooting nhanh

- Nếu gặp lỗi module hoặc node-gyp: thử xóa `node_modules` và `package-lock.json`, sau đó `npm ci` lại.
- Port trùng: Vite sẽ log port; đổi biến `PORT` hoặc chạy `npx kill-port <port>`.

---

## 🔚 Ghi chú

- Code lint & cấu hình ESLint đang có sẵn trong `devDependencies`.
- Nếu muốn mình mở rộng README (ví dụ: cấu hình CI, Docker, test), chọn 1 mục để mình bổ sung.

---

Cần tôi thêm phần nào (Docker, CI, sample `.env.example`, hay hướng dẫn release) không? ✨```
