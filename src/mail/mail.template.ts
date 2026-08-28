export function buildSyncMail(data: {
  users: any[];
  system: string;
  total: number;
  success: number;
  failed: number;
  errors: any[];
}) {
  console.log('================Log Email===================');
  console.log(data.users);
  console.log('================Log Email===================');

  const successRate =
    data.total > 0
      ? ((data.success / data.total) * 100).toFixed(2)
      : '0.00';

  return `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      color: #333;
    ">

      <!-- Header -->
      <div style="
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 6px 6px 0 0;
        border-bottom: 3px solid #2f75b5;
      ">
        <h2 style="
          margin: 0;
          color: #2f75b5;
        ">
          HRIS Synchronization Report
        </h2>

        <p style="
          margin: 8px 0 0;
          color: #666;
        ">
          Automatic synchronization report from HRIS Integration
        </p>
      </div>

      <!-- General Information -->
      <div style="padding: 20px 0;">

        <table
          width="100%"
          cellpadding="8"
          cellspacing="0"
          style="
            border-collapse: collapse;
            border: 1px solid #ddd;
          "
        >
          <tr>
            <td style="
              width: 180px;
              background-color: #f7f7f7;
              border: 1px solid #ddd;
            ">
              <b>System</b>
            </td>

            <td style="border: 1px solid #ddd;">
              ${data.system}
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
              ${new Date().toLocaleString('vi-VN')}
            </td>
          </tr>
        </table>

      </div>

      <!-- Summary -->
      <h3 style="margin-bottom: 10px;">
        Synchronization Summary
      </h3>

      <table
        width="100%"
        cellpadding="10"
        cellspacing="0"
        style="
          border-collapse: collapse;
          text-align: center;
          margin-bottom: 25px;
        "
      >
        <tr>
          <th style="
            border: 1px solid #ddd;
            background-color: #f5f5f5;
          ">
            Total
          </th>

          <th style="
            border: 1px solid #ddd;
            background-color: #f5f5f5;
          ">
            Success
          </th>

          <th style="
            border: 1px solid #ddd;
            background-color: #f5f5f5;
          ">
            Failed
          </th>

          <th style="
            border: 1px solid #ddd;
            background-color: #f5f5f5;
          ">
            Success Rate
          </th>
        </tr>

        <tr>
          <td style="border: 1px solid #ddd;">
            <b>${data.total}</b>
          </td>

          <td style="
            border: 1px solid #ddd;
            color: green;
            font-weight: bold;
          ">
            ${data.success}
          </td>

          <td style="
            border: 1px solid #ddd;
            color: ${data.failed > 0 ? 'red' : 'green'};
            font-weight: bold;
          ">
            ${data.failed}
          </td>

          <td style="
            border: 1px solid #ddd;
            font-weight: bold;
          ">
            ${successRate}%
          </td>
        </tr>
      </table>

      <!-- User Records -->
      <h3>
        Synchronized Users
      </h3>

      <table
        width="100%"
        cellpadding="8"
        cellspacing="0"
        style="
          border-collapse: collapse;
          margin-bottom: 25px;
        "
      >
        <tr>
          <th style="
            border: 1px solid #ddd;
            background-color: #f5f5f5;
          ">
            #
          </th>

          <th style="
            border: 1px solid #ddd;
            background-color: #f5f5f5;
          ">
            Employee Code
          </th>

          <th style="
            border: 1px solid #ddd;
            background-color: #f5f5f5;
          ">
            Employee Name
          </th>

          <th style="
            border: 1px solid #ddd;
            background-color: #f5f5f5;
          ">
            Email
          </th>
        </tr>

        ${
          data.users
            ?.map(
              (user, index) => `
                <tr>
                  <td style="
                    border: 1px solid #ddd;
                    text-align: center;
                  ">
                    ${index + 1}
                  </td>

                  <td style="border: 1px solid #ddd;">
                    ${user.Code ?? user.code ?? ''}
                  </td>

                  <td style="border: 1px solid #ddd;">
                    ${user.FullName ?? user.name ?? ''}
                  </td>

                  <td style="border: 1px solid #ddd;">
                    ${user.Email ?? user.email ?? ''}
                  </td>
                </tr>
              `,
            )
            .join('') || ''
        }

      </table>

      <!-- Failed Records -->
      ${
        data.failed > 0
          ? `
            <h3 style="color: #d9534f;">
              Failed Records
            </h3>

            <table
              width="100%"
              cellpadding="8"
              cellspacing="0"
              style="
                border-collapse: collapse;
                margin-bottom: 25px;
              "
            >
              <tr>
                <th style="
                  border: 1px solid #ddd;
                  background-color: #f5f5f5;
                ">
                  #
                </th>

                <th style="
                  border: 1px solid #ddd;
                  background-color: #f5f5f5;
                ">
                  Employee Code
                </th>

                <th style="
                  border: 1px solid #ddd;
                  background-color: #f5f5f5;
                ">
                  Employee Name
                </th>

                <th style="
                  border: 1px solid #ddd;
                  background-color: #f5f5f5;
                ">
                  Error
                </th>
              </tr>

              ${
                data.errors
                  ?.map(
                    (item, index) => `
                      <tr>
                        <td style="
                          border: 1px solid #ddd;
                          text-align: center;
                        ">
                          ${index + 1}
                        </td>

                        <td style="border: 1px solid #ddd;">
                          ${item.code ?? ''}
                        </td>

                        <td style="border: 1px solid #ddd;">
                          ${item.name ?? ''}
                        </td>

                        <td style="
                          border: 1px solid #ddd;
                          color: #d9534f;
                        ">
                          ${item.message ?? ''}
                        </td>
                      </tr>
                    `,
                  )
                  .join('') || ''
              }

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
              <b>✓ Synchronization completed successfully.</b>
              <br/>
              All ${data.total} records were synchronized successfully.
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