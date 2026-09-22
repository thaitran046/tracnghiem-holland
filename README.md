# Holland 108 câu → Google Sheet + Gmail tư vấn viên

Flow:

`Form thông tin → 108 mệnh đề → chấm 6 nhóm ở server → học sinh thấy Nhóm 1–6 → ghi 1 dòng Google Sheet + gửi email Gmail cho tư vấn viên`

## Tính năng

- 108 mệnh đề (6 nhóm × 18), chia 18 màn hình × 6 câu
- Lưu tiến độ **localStorage** (F5 không mất bài)
- Nút **Tiếp tục bài đang làm** / **Làm mới từ đầu**
- Validate SĐT, hiển thị số ô đã chọn, nút Làm lại
- **Ghi Google Sheet** + **gửi Gmail** (tóm tắt điểm + danh sách đáp án đã chọn theo từng nhóm)
- Không database, không admin dashboard

## 1. Chạy thử (chưa cần Sheet / email)

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Không cấu hình vẫn làm đủ 108 câu và xem kết quả; chỉ phần đồng bộ sẽ báo chưa kết nối.

Kiểm tra: `http://localhost:3000/api/health`

## 2. Cấu hình Google Apps Script (Sheet + Gmail)

1. Tạo Google Sheet mới.
2. **Extensions → Apps Script**.
3. Xóa code mặc định, dán toàn bộ nội dung `google-apps-script/Code.gs`.
4. **Quan trọng:** sửa dòng:

```js
const ADVISOR_EMAIL = 'tu-van-vien@gmail.com';
```

thành email tư vấn viên thật (có thể nhiều email, cách nhau bằng dấu phẩy).

5. (Tùy chọn) điền `EXPECTED_TOKEN` nếu muốn bảo vệ endpoint.
6. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Lần đầu Google sẽ xin quyền **Gmail** (gửi email) và **Spreadsheet** — hãy chấp nhận.
8. Copy URL kết thúc bằng `/exec`.

### Test nhanh email trong Apps Script

- Mở `google-apps-script/TestPayload.json`, copy JSON.
- Trong Apps Script: chạy thử bằng cách tạm thêm hàm:

```js
function testEmail() {
  const data = { /* dán nội dung TestPayload.json */ };
  sendAdvisorEmail_(data);
}
```

- Chọn hàm `testEmail` → Run → kiểm tra hộp thư tư vấn viên.

## 3. Kết nối website

```bash
cp .env.example .env.local
```

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXXXXXX/exec
GOOGLE_APPS_SCRIPT_TOKEN=
```

Restart `npm run dev`. `/api/health` phải báo `googleSheetConfigured: true`.

## 4. Email tư vấn viên nhận gì?

- Họ tên, SĐT, email, lớp, trường, thời gian
- Điểm 6 nhóm (vd. 12/18)
- Nhóm nổi trội + Top 2 / Top 3 (tên nội bộ: Kỹ thuật, Nghiên cứu…)
- **Tóm tắt đáp án đã chọn** theo từng nhóm (danh sách mệnh đề học sinh đã tick)

Đồng thời 1 dòng được ghi vào tab `KetQuaHolland` trên Sheet.

## 5. Mapping nhóm nội bộ

| Nhóm công khai | Tên nội bộ (Sheet + email) |
|----------------|----------------------------|
| Nhóm 1 | Kỹ thuật |
| Nhóm 2 | Nghiên cứu |
| Nhóm 3 | Nghệ thuật |
| Nhóm 4 | Xã hội |
| Nhóm 5 | Quản lý |
| Nhóm 6 | Nghiệp vụ |

Học sinh **chỉ thấy** Nhóm 1–6 trên web. Tên nội bộ chỉ có trên Sheet và email tư vấn viên.

## 6. Deploy Vercel

Thêm Environment Variables:

```text
GOOGLE_APPS_SCRIPT_URL = URL /exec
GOOGLE_APPS_SCRIPT_TOKEN = (để trống nếu không dùng)
```

Redeploy.

## 7. Token bảo vệ (tùy chọn)

Trong `Code.gs`:

```js
const EXPECTED_TOKEN = 'mot-token-rieng';
```

Trong `.env.local` / Vercel:

```env
GOOGLE_APPS_SCRIPT_TOKEN=mot-token-rieng
```

## 8. Xử lý lỗi thường gặp

| Hiện tượng | Nguyên nhân | Cách xử lý |
|------------|-------------|------------|
| Web báo “chưa kết nối hoặc gửi chưa thành công” | Chưa set `GOOGLE_APPS_SCRIPT_URL` hoặc URL sai | Kiểm tra `.env.local`, restart dev server |
| Sheet có dòng nhưng không nhận email | Sai `ADVISOR_EMAIL` hoặc chưa cấp quyền Gmail | Sửa email, Deploy lại, Authorize lại |
| Apps Script báo permission | Chưa chấp nhận scope Gmail | Run thử `testEmail`, chấp nhận quyền |
| Token không hợp lệ | `EXPECTED_TOKEN` ≠ env | Đồng bộ hai giá trị |

## 9. Lưu ý nội dung trắc nghiệm

Bộ 108 mệnh đề là bộ triển khai theo yêu cầu dự án. Trước khi dùng chính thức như công cụ chuẩn hóa, nên thay bằng phiên bản đã được chuyên gia/đơn vị sở hữu nội dung duyệt.
