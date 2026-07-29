1️⃣ Diagram KIẾN TRÚC CHÍNH THỨC
🧩 High-level Architecture (Official)
        ┌────────────┐
        │   HRIS     │  (ASP.NET)
        │  DB chính  │
        └─────┬──────┘
              │
              │ (CDC / Job / Trigger)
              ▼
        ┌────────────┐
        │ HRIS DB    │  ← DB trung gian (READ ONLY)
        │  (Replica)│
        └─────┬──────┘
              │
              │ Poll / CDC
              ▼
        ┌──────────────────────┐
        │      API ZONE        │  (NestJS)
        │----------------------│
        │ - Mapper             │
        │ - Validator          │
        │ - Outbox Pattern     │
        │ - Kafka Producer     │
        └─────┬────────────────┘
              │
        ┌─────▼────────────────────────────────────┐
        │                KAFKA                      │
        │--------------------------------------------│
        │ hris.employee.updated                     │
        │ crm.customer.updated                      │
        │ lms.user.synced                           │
        │ *_retry                                   │
        │ *_dlq                                     │
        └─────┬────────────────────────────────────┘
              │
   ┌──────────┼───────────────┐
   ▼          ▼               ▼
┌───────┐ ┌────────┐   ┌──────────┐
│ CRM   │ │ LMS API │   │ Search   │
│ DB TG │ │ (Cloud) │   │ ES/Algo  │
└───────┘ └────────┘   └──────────┘


2️⃣ Kafka đang GIẢI QUYẾT vấn đề gì?
Vấn đề sếp lo	Kafka giải quyết
Update DB trực tiếp dễ lỗi	❌ Không update trực tiếp
Hệ thống khác nhau	✅ Event chuẩn hoá
Mất data khi lỗi	✅ Replay được
LMS chậm / timeout	✅ Async
Sau này thêm system	✅ Subscribe thêm

👉 Kafka KHÔNG thay API ZONE
👉 Kafka làm event backbone



3️⃣ Sequence Diagram (để sếp hiểu luồng)
Ví dụ: HRIS đổi tên nhân viên
HRIS DB TG
   |
   | detect change
   ▼
API ZONE
   |
   | validate + map
   | produce event
   ▼
Kafka (hris.employee.updated)
   |
   | consume
   ▼
CRM Consumer
   |
   | upsert DB trung gian CRM
   ▼
CRM OK


❗ Vì sao em đổi Tran Van B → Nguyen Van Teo mà không chạy?
➡️ Vì chưa có CDC / trigger / poller detect change
➡️ Kafka KHÔNG tự đọc DB



4️⃣ Event Schema CHUẨN (để ghi RFC)
{
  "event_id": "uuid",
  "event_type": "hris.employee.updated",
  "tenant_id": "company_a",
  "source": "HRIS",
  "occurred_at": "2025-12-25T10:00:00Z",
  "version": 1,
  "payload": {
    "employee_id": "E123",
    "full_name": "Nguyen Van Teo",
    "email": "teo@company.com"
  }
}


📌 Rule:

Không đổi schema cũ

Version tăng khi breaking change


5️⃣ Kafka DLQ & Retry (rất hay ghi điểm với sếp)
🔁 Retry Strategy
Topic	Dùng khi
hris.employee.updated	Luồng chính
hris.employee.updated.retry	Lỗi tạm
hris.employee.updated.dlq	Lỗi vĩnh viễn
Flow
Main topic
   |
   | error
   ▼
Retry (delay)
   |
   | fail again
   ▼
DLQ

NestJS Consumer mẫu
try {
  await this.handle(event);
} catch (e) {
  if (isRetryable(e)) {
    await this.kafka.send('hris.employee.updated.retry', event);
  } else {
    await this.kafka.send('hris.employee.updated.dlq', {
      ...event,
      error: e.message,
    });
  }
}


6️⃣ Rebuild TOÀN BỘ DATA từ Kafka (điểm Architect)

👉 Khi CRM mất DB, hoặc LMS cần sync lại

kafka-consumer-groups.sh \
--bootstrap-server localhost:9092 \
--group crm-consumer \
--reset-offsets \
--to-earliest \
--execute \
--topic hris.employee.updated


💡 Sếp nghe câu này là gật đầu liền:

❝ Chỉ cần Kafka còn data → hệ thống rebuild lại được ❞