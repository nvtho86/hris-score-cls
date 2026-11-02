export function buildSyncMail(data: {
  users: any[];
  system: string;
  total: number;
  success: number;
  failed: number;
  errors: any[];
}) {
  const successRate =
    data.total > 0
      ? ((data.success / data.total) * 100).toFixed(2)
      : '0.00';

  // Escape HTML để đảm bảo dữ liệu hiển thị an toàn trong email
  const escapeHtml = (value: any): string =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  // Hỗ trợ tên field theo PascalCase và camelCase
  const getValue = (item: any, ...keys: string[]) => {
    for (const key of keys) {
      if (item?.[key] !== undefined && item[key] !== null) {
        return escapeHtml(item[key]);
      }
    }
    return '';
  };


  const tableHeaderStyle = `
    border: 1px solid #ddd;
    padding: 10px 8px;
    background-color: #f5f5f5;
    font-weight: bold;
    text-align: left;
    white-space: nowrap;
  `;

  const tableCellStyle = `
    border: 1px solid #ddd;
    padding: 10px 8px;
    text-align: left;
  `;

  return `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      max-width: 1100px;
      margin: 0 auto;
      color: #333;
      font-size: 13px;
      line-height: 1.5;
    ">

      <!-- Header -->
      <div style="
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 6px 6px 0 0;
        border-bottom: 3px solid #2f75b5;
      ">
        <h2 style="margin: 0; color: #2f75b5;">
        Báo cáo đồng bộ hóa hệ thống thông tin quản lý nhân sự (HRIS)
        </h2>
        <p style="margin: 8px 0 0; color: #666;">
        Báo cáo đồng bộ hóa tự động từ quá trình tích hợp hệ thống thông tin quản lý nhân sự (HRIS)
        </p>
      </div>

      <!-- General Information -->
      <div style="padding: 20px 0;">
        <table width="100%" cellpadding="8" cellspacing="0"
          style="border-collapse: collapse; border: 1px solid #ddd;">
          <tr>
            <td style="
              width: 180px;
              background-color: #f7f7f7;
              border: 1px solid #ddd;
            ">
              <b>System</b>
            </td>
            <td style="border: 1px solid #ddd;">
              ${escapeHtml(data.system)}
            </td>
          </tr>
          <tr>
            <td style="
              background-color: #f7f7f7;
              border: 1px solid #ddd;
            ">
              <b>Time</b>
            </td>
            <td style="border: 1px solid #ddd;">
              ${escapeHtml(new Date().toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh',
              }))}
            </td>
          </tr>
        </table>
      </div>

      <!-- Synchronization Summary -->
      <h3 style="margin-bottom: 10px;">
        Mô tả đồng bộ
      </h3>

      <table width="100%" cellpadding="10" cellspacing="0"
        style="
          border-collapse: collapse;
          text-align: center;
          margin-bottom: 25px;
        ">
        <tr>
          <th style="${tableHeaderStyle}; text-align: center;">Total</th>
          <th style="${tableHeaderStyle}; text-align: center;">Success</th>
          <th style="${tableHeaderStyle}; text-align: center;">Failed</th>
          <th style="${tableHeaderStyle}; text-align: center;">Success Rate</th>
        </tr>
        <tr>
          <td style="${tableCellStyle}">
            <b>${data.total}</b>
          </td>
          <td style="${tableCellStyle}; color: green; font-weight: bold;">
            ${data.success}
          </td>
          <td style="
            ${tableCellStyle};
            color: ${data.failed > 0 ? '#d9534f' : 'green'};
            font-weight: bold;
          ">
            ${data.failed}
          </td>
          <td style="${tableCellStyle}; font-weight: bold;">
            ${successRate}%
          </td>
        </tr>
      </table>

      <!-- Synchronized Users -->
      <h3 style="margin-bottom: 10px;">
      Đồng bộ user
      </h3>

      <p style="margin-bottom: 10px; color: #666;">
        Thông tin nhân viện được cập nhật từ HRIS.
      </p>

      <div style="width: 100%; overflow-x: auto; margin-bottom: 25px;">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="
            border-collapse: collapse;
            width: 100%;
            font-size: 12px;
          ">
          <thead>
            <tr>
              <th style="${tableHeaderStyle}">Employee Code</th>
              <th style="${tableHeaderStyle}">FullName</th>
              <th style="${tableHeaderStyle}">Level</th>
              <th style="${tableHeaderStyle}">Job Title</th>
              <th style="${tableHeaderStyle}">Manager Name</th>
              <th style="${tableHeaderStyle}">Office</th>
              <th style="${tableHeaderStyle}">Department</th>
              <th style="${tableHeaderStyle}">Team</th>
            </tr>
          </thead>
          <tbody>
            ${
              data.users?.length
                ? data.users.map((user) => `
                    <tr>
                      <td style="${tableCellStyle}">
                        ${getValue(user, 'Code', 'code')}
                      </td>
                      <td style="${tableCellStyle}">
                        ${getValue(user, 'FullName', 'fullname')}
                      </td>
                      <td style="${tableCellStyle}">
                        ${getValue(user, 'Level', 'level')}
                      </td>
                      <td style="${tableCellStyle}">
                        ${getValue(user, 'JobTitle', 'jobTitle', 'job_title')}
                      </td>
                      <td style="${tableCellStyle}">
                        ${getValue(user, 'ManagerName', 'managerName', 'manager_name')}
                      </td>
                      <td style="${tableCellStyle}">
                        ${getValue(user, 'Branch', 'branch')}
                      </td>
                      <td style="${tableCellStyle}">
                        ${getValue(user, 'Department', 'department')}
                      </td>
                      <td style="${tableCellStyle}">
                      ${getValue(user, 'Branch', 'branch')}_${getValue(user, 'Department', 'department')}_${getValue(user, 'Team', 'team')}
                      </td>
                    </tr>
                  `).join('')
                : `
                    <tr>
                      <td colspan="6" style="
                        ${tableCellStyle};
                        text-align: center;
                        color: #777;
                      ">
                        No synchronized user records.
                      </td>
                    </tr>
                  `
            }
          </tbody>
        </table>
      </div>

      <!-- Failed Records -->
      ${
        data.failed > 0
          ? `
            <h3 style="color: #d9534f; margin-bottom: 10px;">
              Failed Records
            </h3>

            <table width="100%" cellpadding="0" cellspacing="0"
              style="
                border-collapse: collapse;
                margin-bottom: 25px;
                font-size: 12px;
              ">
              <thead>
                <tr>
                  <th style="${tableHeaderStyle}">#</th>
                  <th style="${tableHeaderStyle}">Employee Code</th>
                  <th style="${tableHeaderStyle}">Employee Name</th>
                  <th style="${tableHeaderStyle}">Error</th>
                </tr>
              </thead>
              <tbody>
                ${
                  data.errors?.length
                    ? data.errors.map((item, index) => `
                        <tr>
                          <td style="${tableCellStyle}; text-align: center;">
                            ${index + 1}
                          </td>
                          <td style="${tableCellStyle}">
                            ${getValue(item, 'code', 'Code')}
                          </td>
                          <td style="${tableCellStyle}">
                            ${getValue(item, 'name', 'FullName', 'fullName')}
                          </td>
                          <td style="
                            ${tableCellStyle};
                            color: #d9534f;
                            overflow-wrap: anywhere;
                          ">
                            ${getValue(item, 'message', 'error')}
                          </td>
                        </tr>
                      `).join('')
                    : `
                        <tr>
                          <td colspan="4" style="${tableCellStyle}">
                            Failed records were reported, but no error details
                            are available.
                          </td>
                        </tr>
                      `
                }
              </tbody>
            </table>
          `
          : `
            <div style="
              padding: 15px;
              background-color: #f0f9f0;
              border: 1px solid #b7dfb7;
              border-radius: 5px;
              color: green;
              margin-bottom: 25px;
            ">
              <b>✓ Quá trình đồng bộ hóa đã hoàn tất thành công..</b>
              <br/>
              Cả ${data.total} bản ghi đã được đồng bộ hóa thành công.
            </div>
          `
      }

      <!-- Footer -->
      <div style="
        border-top: 1px solid #ddd;
        padding-top: 15px;
        color: #777;
        font-size: 12px;
      ">
        This email is automatically generated by HRIS Integration.
        <br/>
        Please do not reply to this email.
      </div>

    </div>
  `;
}