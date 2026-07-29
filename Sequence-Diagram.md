HR Admin
   |
   | Update Employee
   v
HRIS API
   |
   | Save Employee (MSSQL)
   |
   | Publish EMPLOYEE_UPDATED
   v
Message Broker (Kafka / RMQ)
   |
   |----------------------|
   |                      |
   v                      v
LMS Consumer          CRM Consumer
   |                      |
   | Validate Event       | Validate Event
   | Check Idempotent     | Check Idempotent
   | Upsert Employee     | Upsert Employee
   | Mark processed      | Mark processed
   v                      v
 LMS DB               CRM DB