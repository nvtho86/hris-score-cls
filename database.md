### List table

1. User 
    - id (PK)
    - username   ----> Tên đăng nhập
    - email      ----> Email
    - password   ----> Mật khẩu mã hóa
    - is_active  ----> Đang hoạt động hay không
    - created_at ----> Ngày tạo
    - updated_at ----> Ngày cập nhật

2. Group
    - id (PK)
    - code (ADMIN, HR, TRAINER, STUDENT)  ----> Mã role
    - name                            ----> Tên role
    - created_at                      ----> Ngày tạo
    - updated_at                      ----> Ngày cập nhật

  2.1 USER_GROUPS
    - user_id (FK → USERS)
    - group_id (FK → GROUPS)

    ### Ý nghĩa:
      - 1 user có nhiều role
      - 1 role có nhiều user

3. Organization
    - id	         ----> PK
    - name	       ----> Tên đơn vị
    - parent_id	   ----> FK tự tham chiếu
    - created_at	 ----> Ngày tạo
    - updated_at	 ----> Ngày cập nhật

4. User-organization (User thuộc phòng ban nào + chức danh gì)
    - id	         ----> PK
    - user_id (FK) ----> user
    - organization_id (FK) 
    - title_id (FK) ----> Tên chức danh
    - is_owner (boolean)  ----> người sở hữu

    ### Ý nghĩa:
      User A:
        - Thuộc phòng Backend
        - Giữ chức danh Dev
        - Không phải trưởng phòng

11. ORGANIZATION_STRUCTURES – Cơ cấu tổ chức
    - id (PK)
    - name
    - parent_id (self FK)
    - created_at	 ----> Ngày tạo
    - updated_at	 ----> Ngày cập nhật

    ### Ví dụ:
      Công ty
      └── Khối CNTT
          ├── Phòng Backend
          └── Phòng Frontend

5. Title (CHỨC DANH)
    - id      ----> PK
    - name    ----> (DEV, LEAD, MANAGER)
    - organization_id ----> FK
    - created_at	 ----> Ngày tạo
    - updated_at	 ----> Ngày cập nhật
6. Course
    - id (PK)
    - code
    - name
    - topic_name
    - cost
    - start_date
    - end_date
    - owner_id (FK → USERS)
    - time
    - link
    - total_user_complete
    - created_at
    - updated_at
7. Course-progress
8. Training
    - id (PK)
    - course_id (FK)
    - trainer_id (FK → USERS)
    - start_date
    - end_date
    - created_at

9. USER_TRAININGS (User tham gia đào tạo)
    - user_id (FK)
    - training_id (FK)
    - status
    - score
    - completed_at

9. Enrollment


1. Họp về DB
2. Cách tích hợp và IN/OUT
3. Cách lấy dữ liệu thay đổi  T1-> API ZONE -> T5, T6-> API ZONE -> T2 (Dữ liệu quá lớn thì xử lý thế nào)
4. Mình gửi DB hiện tại, ERD, Mô tả thông tin detail của từng bảng
5. Thảo luận => thống nhất 
