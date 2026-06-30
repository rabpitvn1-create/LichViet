# LichViet

Skeleton cho ứng dụng lịch Việt đơn giản chạy phía client bằng HTML, CSS và JavaScript thuần.

## Mục tiêu

- Hiển thị lịch tháng.
- Chuyển tháng trước/sau.
- Chọn ngày để xem sự kiện.
- Nạp dữ liệu sự kiện mẫu từ `data/events.json`.
- Sẵn sàng mở rộng sang âm lịch, ngày lễ Việt Nam, nhắc việc và lưu trữ backend.

## Cấu trúc thư mục

```text
.
├── index.html
├── README.md
├── .gitignore
├── data/
│   └── events.json
└── src/
    ├── app.js
    └── styles.css
```

## Chạy cục bộ

Cách nhanh nhất:

```bash
python3 -m http.server 8080
```

Sau đó mở:

```text
http://localhost:8080
```

Có thể mở `index.html` trực tiếp, nhưng dùng HTTP server sẽ ổn định hơn khi nạp JSON.

## Hướng phát triển tiếp theo

- Thêm chuyển đổi dương lịch sang âm lịch.
- Thêm dữ liệu ngày lễ Việt Nam.
- Thêm form tạo/sửa/xóa sự kiện.
- Lưu sự kiện vào LocalStorage hoặc backend.
- Bổ sung chế độ xem tuần/ngày.
- Thêm kiểm thử cho logic sinh lịch.
