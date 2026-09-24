/**
 * GOOGLE APPS SCRIPT - NHẬN KẾT QUẢ HOLLAND
 * - Ghi 1 dòng vào tab KetQuaHolland
 * - Gửi email Gmail cho tư vấn viên (tóm tắt điểm + đáp án đã chọn)
 *
 * Cách dùng:
 * 1) Tạo một Google Sheet trống.
 * 2) Extensions > Apps Script.
 * 3) Xóa code cũ, dán toàn bộ file này.
 * 4) Điền ADVISOR_EMAIL = email tư vấn viên nhận kết quả.
 * 5) Nếu muốn dùng token bảo vệ, điền EXPECTED_TOKEN. Không dùng thì để ''.
 * 6) Deploy > New deployment > Web app.
 * 7) Execute as: Me.
 * 8) Who has access: Anyone.
 * 9) Copy URL /exec và đặt vào GOOGLE_APPS_SCRIPT_URL của website.
 *
 * Lưu ý: Lần đầu chạy, Google sẽ xin quyền gửi email (Gmail).
 * Hãy chấp nhận quyền khi authorize.
 */

const SHEET_NAME = 'KetQuaHolland';
const EXPECTED_TOKEN = ''; // Tùy chọn: ví dụ 'abc123-secret'

// *** BẮT BUỘC: email tư vấn viên nhận kết quả ***
const ADVISOR_EMAILS = [
  'thaitran046@gmail.com',
  'admin@duhochangluong.edu.vn',
  'nguyentuan19962000125@gmail.com'
];
// Có thể thêm nhiều email, cách nhau bằng dấu phẩy trong ADVISOR_EMAIL hoặc dùng mảng:
// const ADVISOR_EMAIL = 'a@gmail.com, b@gmail.com';

const HEADERS = [
  'Thời gian',
  'Họ và tên',
  'Số điện thoại',
  'Email',
  'Lớp',
  'Trường',
  'Nhóm 1',
  'Nhóm 2',
  'Nhóm 3',
  'Nhóm 4',
  'Nhóm 5',
  'Nhóm 6',
  'Nhóm nổi trội',
  'Tên nhóm nội bộ',
  'Top 2',
  'Tên Top 2',
  'Top 3',
  'Tên Top 3',
  'Tổng số ô đã tick',
  'Tổng số mệnh đề'
];

function doGet() {
  return json_({ ok: true, service: 'holland-google-sheet', emailConfigured: Boolean(ADVISOR_EMAIL) });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : '{}');

    if (EXPECTED_TOKEN && data.token !== EXPECTED_TOKEN) {
      return json_({ ok: false, error: 'Token không hợp lệ.' });
    }

    if (!data.fullName || !data.phone) {
      return json_({ ok: false, error: 'Thiếu họ tên hoặc số điện thoại.' });
    }

    // 1) Ghi Google Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.fullName || '',
      data.phone || '',
      data.email || '',
      data.grade || '',
      data.school || '',
      data.group1 || '',
      data.group2 || '',
      data.group3 || '',
      data.group4 || '',
      data.group5 || '',
      data.group6 || '',
      data.dominantGroup || '',
      data.dominantGroupInternal || '',
      data.secondGroup || '',
      data.secondGroupInternal || '',
      data.thirdGroup || '',
      data.thirdGroupInternal || '',
      Number(data.selectedCount || 0),
      Number(data.totalQuestions || 108)
    ]);

    // 2) Gửi email tư vấn viên
    let emailSent = false;
    if (ADVISOR_EMAIL && ADVISOR_EMAIL.indexOf('@') !== -1) {
      try {
        sendAdvisorEmail_(data);
        emailSent = true;
      } catch (mailErr) {
        // Vẫn trả ok vì Sheet đã ghi thành công; log lỗi email
        console.error('Gửi email thất bại: ' + String(mailErr));
      }
    }

    return json_({ ok: true, emailSent: emailSent });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function sendAdvisorEmail_(data) {
  const subject =
    '[Holland] Kết quả: ' +
    (data.fullName || 'Học sinh') +
    ' — ' +
    (data.dominantGroupInternal || data.dominantGroup || '');

  const when = data.submittedAt
    ? Utilities.formatDate(new Date(data.submittedAt), Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm')
    : Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm');

  const groups = [
    { label: 'Nhóm 1 · Kỹ thuật', score: data.group1 },
    { label: 'Nhóm 2 · Nghiên cứu', score: data.group2 },
    { label: 'Nhóm 3 · Nghệ thuật', score: data.group3 },
    { label: 'Nhóm 4 · Xã hội', score: data.group4 },
    { label: 'Nhóm 5 · Quản lý', score: data.group5 },
    { label: 'Nhóm 6 · Nghiệp vụ', score: data.group6 }
  ];

  let scoreRows = '';
  for (var i = 0; i < groups.length; i++) {
    scoreRows +=
      '<tr><td style="padding:8px 12px;border-bottom:1px solid #e8eef5;">' +
      groups[i].label +
      '</td><td style="padding:8px 12px;border-bottom:1px solid #e8eef5;text-align:right;font-weight:700;">' +
      (groups[i].score || '0/0') +
      '</td></tr>';
  }

  // Tóm tắt đáp án đã chọn theo nhóm
  var selectedHtml = '';
  var selectedByGroup = data.selectedByGroup;
  if (selectedByGroup && selectedByGroup.length) {
    for (var g = 0; g < selectedByGroup.length; g++) {
      var group = selectedByGroup[g];
      var items = group.items || [];
      if (!items.length) continue;
      selectedHtml +=
        '<div style="margin-top:18px;">' +
        '<div style="font-weight:800;color:#1557bf;margin-bottom:6px;">' +
        'Nhóm ' +
        group.groupNo +
        ' · ' +
        (group.shortName || '') +
        ' (' +
        (group.score != null ? group.score : items.length) +
        '/' +
        (group.max || 18) +
        ')</div>' +
        '<ul style="margin:0;padding-left:18px;color:#334;">';
      for (var j = 0; j < items.length; j++) {
        selectedHtml += '<li style="margin:3px 0;">' + escapeHtml_(items[j]) + '</li>';
      }
      selectedHtml += '</ul></div>';
    }
  }

  if (!selectedHtml) {
    selectedHtml =
      '<p style="color:#66788a;margin:12px 0 0;">Không có danh sách chi tiết đáp án (phiên bản payload cũ hoặc chưa chọn câu nào).</p>';
  }

  const html =
    '<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;color:#16324a;">' +
    '<div style="background:linear-gradient(135deg,#175fc7,#2b7ae5);color:#fff;border-radius:16px 16px 0 0;padding:22px 24px;">' +
    '<div style="font-size:12px;opacity:.85;letter-spacing:.06em;font-weight:700;">TRẮC NGHIỆM HOLLAND</div>' +
    '<div style="font-size:22px;font-weight:800;margin-top:6px;">Kết quả mới từ học sinh</div>' +
    '</div>' +
    '<div style="border:1px solid #dce6ef;border-top:0;border-radius:0 0 16px 16px;padding:22px 24px;background:#fff;">' +
    '<table style="width:100%;border-collapse:collapse;margin-bottom:8px;">' +
    row_('Họ và tên', data.fullName) +
    row_('Số điện thoại', data.phone) +
    row_('Email', data.email || '—') +
    row_('Lớp', data.grade || '—') +
    row_('Trường', data.school || '—') +
    row_('Thời gian', when) +
    row_('Đã chọn', (data.selectedCount || 0) + ' / ' + (data.totalQuestions || 108)) +
    '</table>' +
    '<div style="margin:20px 0 10px;font-weight:800;font-size:15px;">Điểm 6 nhóm</div>' +
    '<table style="width:100%;border-collapse:collapse;background:#f7fafc;border-radius:12px;overflow:hidden;">' +
    scoreRows +
    '</table>' +
    '<div style="margin-top:18px;padding:16px 18px;background:#eef6ff;border-radius:12px;border:1px solid #8fb9ef;">' +
    '<div style="font-size:12px;color:#1557bf;font-weight:700;">NHÓM NỔI TRỘI</div>' +
    '<div style="font-size:20px;font-weight:800;margin-top:4px;">' +
    escapeHtml_(data.dominantGroup || '—') +
    (data.dominantGroupInternal
      ? ' <span style="font-size:15px;font-weight:600;color:#334;">(' +
        escapeHtml_(data.dominantGroupInternal) +
        ')</span>'
      : '') +
    '</div>' +
    (data.secondGroup
      ? '<div style="margin-top:8px;font-size:13px;color:#51677a;">Top 2: ' +
        escapeHtml_(data.secondGroup) +
        (data.secondGroupInternal ? ' · ' + escapeHtml_(data.secondGroupInternal) : '') +
        '</div>'
      : '') +
    (data.thirdGroup
      ? '<div style="font-size:13px;color:#51677a;">Top 3: ' +
        escapeHtml_(data.thirdGroup) +
        (data.thirdGroupInternal ? ' · ' + escapeHtml_(data.thirdGroupInternal) : '') +
        '</div>'
      : '') +
    '</div>' +
    '<div style="margin-top:22px;font-weight:800;font-size:15px;">Tóm tắt đáp án đã chọn</div>' +
    selectedHtml +
    '<p style="margin-top:28px;font-size:12px;color:#8795a2;">Email tự động từ hệ thống trắc nghiệm Holland. Kết quả cũng đã được ghi vào Google Sheet.</p>' +
    '</div></div>';

  // Plain text fallback
  var plain =
    'Kết quả Holland — ' +
    (data.fullName || '') +
    '\nSĐT: ' +
    (data.phone || '') +
    '\nEmail: ' +
    (data.email || '') +
    '\nLớp: ' +
    (data.grade || '') +
    ' | Trường: ' +
    (data.school || '') +
    '\nThời gian: ' +
    when +
    '\nĐã chọn: ' +
    (data.selectedCount || 0) +
    '/' +
    (data.totalQuestions || 108) +
    '\n\nĐiểm:\n' +
    'Nhóm 1: ' +
    (data.group1 || '') +
    '\nNhóm 2: ' +
    (data.group2 || '') +
    '\nNhóm 3: ' +
    (data.group3 || '') +
    '\nNhóm 4: ' +
    (data.group4 || '') +
    '\nNhóm 5: ' +
    (data.group5 || '') +
    '\nNhóm 6: ' +
    (data.group6 || '') +
    '\n\nNổi trội: ' +
    (data.dominantGroup || '') +
    ' (' +
    (data.dominantGroupInternal || '') +
    ')\n';

  MailApp.sendEmail({
    to: ADVISOR_EMAIL,
    subject: subject,
    htmlBody: html,
    body: plain,
    name: 'Holland Assessment'
  });
}

function row_(label, value) {
  return (
    '<tr>' +
    '<td style="padding:6px 0;color:#66788a;width:130px;vertical-align:top;">' +
    label +
    '</td>' +
    '<td style="padding:6px 0;font-weight:700;">' +
    escapeHtml_(value == null || value === '' ? '—' : String(value)) +
    '</td></tr>'
  );
}

function escapeHtml_(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
