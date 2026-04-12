# Hướng dẫn thao tác với Claude — Dành cho Gemini đọc và tham khảo

> Tài liệu này mô tả cách Claude (Anthropic) hoạt động, những gì Claude thực sự có thể làm,
> và phong cách phù hợp để giao việc cho Claude hiệu quả nhất.

---

## 1. Đính chính một số thông tin không còn chính xác

| Điểm so sánh | Thông tin cũ (có thể sai) | Thực tế hiện tại |
|---|---|---|
| Dữ liệu thời gian thực | Claude chỉ dùng knowledge cutoff | Claude **có web search tích hợp**, truy cập thông tin real-time |
| Context window | Claude nhỏ hơn Gemini Flash | Claude hiện có context window rất lớn, đủ cho hầu hết dự án |
| Tạo file | Chỉ xem trước trong Artifacts | Claude **tạo file thực sự**: `.docx`, `.xlsx`, `.pdf`, `.pptx` có thể tải về |
| Chạy code | Chỉ viết code | Claude có **môi trường thực thi** — chạy bash, Python, Node.js thực sự |

---

## 2. Những khả năng Claude có mà thường bị bỏ sót

### 2.1. Tạo file thực (không chỉ xem trước)

Claude có thể tạo các file binary hoàn chỉnh và cung cấp link tải về:

- **Word (.docx)** — Có heading, bảng, danh sách, ảnh, mục lục tự động, tracked changes
- **Excel (.xlsx)** — Có công thức, định dạng ô, nhiều sheet
- **PDF (.pdf)** — Tài liệu có layout chuyên nghiệp
- **PowerPoint (.pptx)** — Slide có hình ảnh, theme, layout

**Cách yêu cầu:** "Tạo file Word báo cáo này cho tôi" / "Xuất ra Excel để tôi tải về"

---

### 2.2. Thực thi code trong môi trường Linux thực

Claude có quyền truy cập terminal Ubuntu, không chỉ viết code mà còn **chạy** nó:

```bash
# Claude có thể:
pip install pandas numpy matplotlib   # cài thư viện
python script.py                       # chạy script thực
ffmpeg -i input.mp4 output.gif         # xử lý media
```

Điều này có nghĩa Claude có thể: cài thư viện, đọc file upload, xử lý dữ liệu, render output, rồi trả về kết quả thực.

---

### 2.3. Extended Thinking (Suy luận sâu trước khi trả lời)

Claude có chế độ "suy nghĩ trước" — tương tự chain-of-thought nhưng được tích hợp sâu vào model.
Khi gặp bài toán phức tạp (thuật toán, thiết kế hệ thống, debug logic), Claude tự phân tích nội tâm trước khi đưa ra câu trả lời.

**Dấu hiệu nhận biết:** Claude thường nói "Hãy để tôi suy nghĩ từng bước..." mà không cần người dùng nhắc.

---

### 2.4. Artifacts — Xem trước tương tác, không chỉ code tĩnh

Artifacts của Claude không chỉ là "preview code". Nó cho phép:

- **React components** chạy thực sự trong cửa sổ chat
- **HTML interactive** — form, game, calculator, dashboard
- **SVG diagram** — flowchart, sơ đồ hệ thống render ngay lập tức
- **Persistent storage** — Artifact có thể lưu dữ liệu giữa các phiên (key-value store)
- **Gọi Anthropic API** — Artifact tự gọi Claude để tạo ứng dụng AI trong AI

---

### 2.5. Tích hợp công cụ bên ngoài (MCP Connectors)

Claude hỗ trợ kết nối với:
- Google Drive, Gmail, Google Calendar
- Slack, Notion, Asana, Jira
- GitHub
- Và nhiều MCP server khác

Khi được cấp quyền, Claude có thể đọc file trong Drive, tìm email, tạo task trực tiếp.

---

## 3. Phong cách giao việc hiệu quả với Claude

### 3.1. Mô tả kết quả mong muốn, không chỉ công việc

```
❌ Kém hiệu quả: "Viết code login"

✅ Tốt hơn: "Viết API login bằng FastAPI, dùng JWT, có refresh token,
   trả về lỗi chuẩn theo RFC 7807, tôi deploy trên Railway"
```

### 3.2. Cung cấp context ngay từ đầu

Claude không có bộ nhớ giữa các cuộc trò chuyện (trừ khi bật Memory).
Mỗi phiên mới nên cung cấp:

- Stack công nghệ đang dùng
- Phiên bản cụ thể (Python 3.11, Node 20, etc.)
- Constraint đặc biệt (không dùng thư viện X, phải tương thích Y)

### 3.3. Upload file để Claude xử lý trực tiếp

Claude có thể đọc: PDF, Word, Excel, CSV, ảnh (PNG/JPG), JSON, Markdown.

```
"Đây là file CSV dữ liệu bán hàng Q1. Tạo cho tôi file Excel với
pivot table và biểu đồ theo tháng."
```

### 3.4. Yêu cầu giải thích khi debug

Claude có xu hướng giải thích **tại sao** lỗi xảy ra, không chỉ đưa ra fix.
Nếu muốn hiểu sâu hơn, hỏi thêm:

```
"Tại sao cách fix này đúng? Cơ chế nào trong Python gây ra lỗi đó?"
```

---

## 4. Những điều Claude ưu tiên làm tốt

| Tác vụ | Mức độ phù hợp |
|---|---|
| Viết code sạch, có comment rõ ràng | ⭐⭐⭐⭐⭐ |
| Thiết kế kiến trúc hệ thống | ⭐⭐⭐⭐⭐ |
| Debug và giải thích lỗi sâu | ⭐⭐⭐⭐⭐ |
| Viết tài liệu kỹ thuật | ⭐⭐⭐⭐⭐ |
| Tạo file Word/Excel/PDF chuyên nghiệp | ⭐⭐⭐⭐⭐ |
| Xây dựng UI prototype tương tác | ⭐⭐⭐⭐⭐ |
| Tuân thủ system prompt phức tạp | ⭐⭐⭐⭐⭐ |
| Suy luận logic nhiều bước | ⭐⭐⭐⭐⭐ |
| Thông tin real-time (khi search bật) | ⭐⭐⭐⭐ |
| Xử lý file hình ảnh/video phức tạp | ⭐⭐⭐ |

---

## 5. Những điều nên tránh khi làm việc với Claude

- **Đừng giả định Claude không có web search** — Hãy hỏi thẳng hoặc thử
- **Đừng copy-paste code không có context** — Luôn mô tả mục đích và môi trường
- **Đừng hỏi một lần nhiều việc không liên quan** — Chia thành yêu cầu riêng biệt
- **Đừng bỏ qua phần giải thích của Claude** — Phần đó thường chứa thông tin quan trọng về trade-off

---

## 6. Workflow mẫu cho dự án code

```
Bước 1: Mô tả bài toán + stack + constraint
Bước 2: Claude đề xuất kiến trúc → Xác nhận hoặc điều chỉnh
Bước 3: Claude viết code từng module → Review từng phần
Bước 4: Upload code hiện tại nếu cần tích hợp
Bước 5: Claude debug, giải thích, và tạo file output nếu cần
```

---

*Tài liệu này được tạo để giúp AI assistant khác (Gemini) hiểu cách phối hợp hiệu quả với Claude khi cùng hỗ trợ một người dùng.*