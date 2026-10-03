# 🎲 Dice - Ứng dụng lắc xúc xắc (React Native + Expo)

Ứng dụng mô phỏng việc lắc xúc xắc: 

- Giao diện gồm AppBar, hình xúc xắc, kết quả và nút **Lắc xúc xắc**.
- Hiển thị ảnh xúc xắc từ thư mục `assets/dice/`.
- Sinh số ngẫu nhiên từ 1 đến 6 bằng `Math.random()`, đổi ảnh tương ứng.
- Quản lý trạng thái bằng hook `useState`.

**Tính năng nâng cao**

- Hiệu ứng xoay 2 vòng và phóng to/thu nhỏ khi lắc (`Animated`).
- Lắc điện thoại để tung xúc xắc (`expo-sensors` - Accelerometer).
- Rung phản hồi khi lắc và khi có kết quả (`expo-haptics`).
- Đếm số lần lắc, có nút bật/tắt chế độ lắc điện thoại.

## 🛠 Công nghệ sử dụng

- [React Native](https://reactnative.dev/)
- [Expo SDK](https://expo.dev/)
- `expo-sensors`, `expo-haptics`

## 📁 Cấu trúc thư mục

```
Dice/
├── assets/
│   └── dice/
│       ├── dice-1.png
│       ├── ...
│       └── dice-6.png
├── screenshots/
├── App.js
├── app.json
├── package.json
└── README.md
```

## 🚀 Cài đặt và chạy

**Yêu cầu:** Node.js 18 trở lên, ứng dụng **Expo Go** trên điện thoại (hoặc emulator).

```bash
# 1. Clone dự án
git clone 
cd 

# 2. Cài thư viện
npm install

# 3. Chạy ứng dụng
npx expo start
```

Sau đó quét mã QR bằng Expo Go, hoặc nhấn `a` (Android), `i` (iOS), `w` (web).

> Tính năng lắc điện thoại và rung chỉ hoạt động trên thiết bị thật.


