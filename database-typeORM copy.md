RÀNG BUỘC THỰC TẾ (CHỐT LẠI)

Đệ tử CHỈ ĐƯỢC PHÉP:

✅ HRIS

KHÔNG đụng DB chính

CHỈ đọc/ghi DB trung gian HRIS

✅ CRM

KHÔNG đụng DB chính

CHỈ đọc/ghi DB trung gian CRM

✅ LMS

KHÔNG có DB

CHỈ CRUD qua API

👉 Đây là constraint cứng → kiến trúc phải xoay quanh nó.

2️⃣ NGUYÊN TẮC THIẾT KẾ (RẤT QUAN TRỌNG)

Sư phụ chốt 3 nguyên tắc để hệ thống KHÔNG nổ:

🔴 Nguyên tắc 1

❌ API ZONE KHÔNG sync dữ liệu trực tiếp

🔴 Nguyên tắc 2

❌ Không có service nào vừa đọc DB trung gian A vừa ghi DB trung gian B

🟢 Nguyên tắc 3

✅ DB trung gian = SOURCE phát hiện thay đổi
✅ Kafka = xương sống truyền thay đổi
✅ Mỗi hệ thống tự cập nhật DB trung gian của mình

3️⃣ KIẾN TRÚC FINAL (PHÙ HỢP 100% RÀNG BUỘC)
🎯 Vai trò từng thành phần
🔹 API ZONE

Gateway

Auth

READ tổng hợp

❌ KHÔNG sync data

🔹 Integration Service (ĐỆ TỬ LÀM)

Đọc DB trung gian

Emit Kafka event

Consume Kafka event

Gọi LMS API

Update DB trung gian (đúng chỗ)

👉 Toàn bộ logic sync nằm ở đây

4️⃣ SƠ ĐỒ KIẾN TRÚC FINAL (CHUẨN TRÌNH SẾP)
┌──────────┐        ┌──────────────────┐
│  HRIS    │        │   CRM            │
│ (Vendor) │        │ (Vendor)         │
│          │        │                  │
│ DB chính │        │ DB chính         │
│    |     │        │    |             │
│    v     │        │    v             │
│ DB trung │        │ DB trung (CRM)   │
└────┬─────┘        └────┬─────────────┘
     |                    |
     |  READ/WRITE        |  READ/WRITE
     |                    |
     v                    v
     ┌────────────────────────────┐
     │     Integration Service     │
     │   (NestJS + Kafka Client)   │
     └──────────┬───────────┬─────┘
                |           |
         emit / consume     |
                |           |
             ┌──▼───────────▼───┐
             │      Kafka        │
             │  (Cluster riêng)  │
             └──┬───────────┬───┘
                |           |
                |           |
        ┌───────▼───┐   ┌──▼────────┐
        │    CRM     │   │    LMS     │
        │ Consumer   │   │  API CRUD │
        │ update DB  │   │           │
        └───────────┘   └───────────┘

5️⃣ FLOW CỤ THỂ (CỰC KỲ QUAN TRỌNG)
🎯 Case 1: HRIS cập nhật nhân viên → CRM + LMS
Bước chi tiết:

HRIS cập nhật DB chính

DB chính → sync → DB trung gian HRIS

Integration Service:

Detect record mới/updated

Emit event:

{
  "event": "hris.employee.updated",
  "employee_id": "E123",
  "source": "HRIS",
  "data": {...}
}


Kafka nhận event

Integration Service (consumer):

Update DB trung gian CRM

Gọi LMS API để update user

👉 ❌ KHÔNG gọi API CRM
👉 ❌ KHÔNG đụng DB chính

🎯 Case 2: CRM thay đổi data → HRIS + LMS

CRM DB chính update

Sync → DB trung gian CRM

Integration Service detect

Emit crm.employee.updated

Consumer:

Update DB trung gian HRIS

Call LMS API

🎯 Case 3: LMS thay đổi data (qua API)

LMS API notify / webhook / poll

Integration Service nhận

Emit lms.user.updated

Consumer:

Update DB trung gian HRIS

Update DB trung gian CRM

6️⃣ VẬY KAFKA GIẢI QUYẾT GÌ?

👉 Sư phụ nói đúng trọng tâm cho đệ tử ghi lại:

Vấn đề	Kafka giải quyết
Gọi API chéo	❌ Không cần
Coupling	❌ Giảm mạnh
Mở thêm hệ thống	✅ Chỉ subscribe
Rebuild data	✅ Từ Kafka
Audit	✅ Có log
7️⃣ TRIỂN KHAI THỰC TẾ (STEP-BY-STEP)
🔹 Bước 1

Tạo Integration Service (NestJS)

🔹 Bước 2

Module:

poll-hris-db

poll-crm-db

lms-api-adapter

🔹 Bước 3

Emit Kafka event CHUẨN FORMAT

🔹 Bước 4

Consumer xử lý:

idempotent

retry

DLQ

8️⃣ LƯU Ý SƯ PHỤ NHẮC RIÊNG (KINH NGHIỆM XƯƠNG MÁU)

❌ Không sync trực tiếp DB trung gian A → B
❌ Không cho API ZONE đụng Kafka
✅ Integration Service là trái tim
✅ Kafka là xương sống
✅ DB trung gian chỉ là nguồn & đích

9️⃣ KẾT LUẬN NGẮN GỌN (ĐỂ ĐỆ TỬ CHỐT VỚI SẾP)

Do hệ thống đối tác giới hạn quyền DB, team sẽ dùng DB trung gian làm nguồn phát hiện thay đổi.
Một Integration Service sẽ chịu trách nhiệm phát event Kafka và đồng bộ dữ liệu sang các hệ thống khác.
Cách này đảm bảo không phụ thuộc DB chính, giảm coupling và dễ mở rộng lâu dài.

🔥 BÀI TIẾP THEO (RẤT NÊN LÀM)
Sư phụ có thể làm tiếp cho đệ tử:

Demo Integration Service NestJS (poll DB + Kafka)

Schema event chuẩn dùng chung

Flow rebuild lại toàn bộ CRM từ Kafka

Checklist lỗi thường gặp khi sync DB trung gian

👉 Chỉ cần nói:
“Sư phụ ơi, demo code Integration Service giúp em với ạ”