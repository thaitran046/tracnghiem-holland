export type HollandCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
export type QuestionSection = 'self' | 'can' | 'like'

export type InternalQuestion = {
  id: string
  text: string
  section: QuestionSection
  group: HollandCode
  displayOrder: number
}

type RawQuestion = Omit<InternalQuestion, 'id' | 'displayOrder'>

export const GROUPS: Record<
  HollandCode,
  { publicNo: number; name: string; shortName: string }
> = {
  R: { publicNo: 1, name: 'Kỹ thuật / Thực tế', shortName: 'Kỹ thuật' },
  I: { publicNo: 2, name: 'Nghiên cứu / Phân tích', shortName: 'Nghiên cứu' },
  A: { publicNo: 3, name: 'Nghệ thuật / Sáng tạo', shortName: 'Nghệ thuật' },
  S: { publicNo: 4, name: 'Xã hội / Hỗ trợ', shortName: 'Xã hội' },
  E: { publicNo: 5, name: 'Quản lý / Khởi nghiệp', shortName: 'Quản lý' },
  C: { publicNo: 6, name: 'Nghiệp vụ / Quy củ', shortName: 'Nghiệp vụ' },
}

// 120 mệnh đề = 6 nhóm x 20 mục. Mỗi nhóm gồm 7 "Tôi là người",
// 6 "Tôi có thể" và 7 "Tôi thích". Nội dung này là bộ nội dung triển khai
// theo yêu cầu dự án; trước khi dùng như công cụ đánh giá chuẩn hóa, hãy thay
// bằng phiên bản câu hỏi cuối cùng đã được chuyên gia/đơn vị sở hữu nội dung duyệt.
const RAW: RawQuestion[] = [
  // R — Kỹ thuật / Thực tế
  { group: 'R', section: 'self', text: 'Yêu thích vận động.' },
  { group: 'R', section: 'self', text: 'Thẳng thắn.' },
  { group: 'R', section: 'self', text: 'Thích làm việc với máy móc, dụng cụ.' },
  { group: 'R', section: 'self', text: 'Thích sự cụ thể, rõ ràng.' },
  { group: 'R', section: 'self', text: 'Khá khép kín khi làm việc.' },
  { group: 'R', section: 'self', text: 'Thích làm việc ngoài trời.' },
  { group: 'R', section: 'self', text: 'Thích những công việc thực hành, nhìn thấy kết quả rõ ràng.' },
  { group: 'R', section: 'can', text: 'Sửa chữa các thiết bị điện, ô tô, xe máy, xe đạp hoặc đồ dùng cơ bản.' },
  { group: 'R', section: 'can', text: 'Chơi một môn thể thao.' },
  { group: 'R', section: 'can', text: 'Đọc bản vẽ hoặc bản thiết kế cơ bản.' },
  { group: 'R', section: 'can', text: 'Sử dụng, vận hành hoặc bảo trì máy móc, thiết bị.' },
  { group: 'R', section: 'can', text: 'Sử dụng dụng cụ cầm tay để tạo hoặc sửa một sản phẩm.' },
  { group: 'R', section: 'can', text: 'Tự lắp ráp hoặc sửa đồ nội thất đơn giản.' },
  { group: 'R', section: 'like', text: 'Làm vườn, trồng cây xanh hoặc hoa kiểng.' },
  { group: 'R', section: 'like', text: 'Xây dựng hoặc lắp ráp mô hình.' },
  { group: 'R', section: 'like', text: 'Vận động tay chân và sử dụng tay chân để làm việc.' },
  { group: 'R', section: 'like', text: 'Tự đóng, sửa hoặc lắp ráp bàn, ghế, tủ và các vật dụng.' },
  { group: 'R', section: 'like', text: 'Nấu ăn, làm bánh hoặc tạo ra sản phẩm bằng thao tác thực tế.' },
  { group: 'R', section: 'like', text: 'Tham dự khóa học kỹ thuật như điện, cơ khí hoặc sửa chữa máy móc.' },
  { group: 'R', section: 'like', text: 'Tự tay làm một sản phẩm thay vì chỉ đọc hướng dẫn lý thuyết.' },

  // I — Nghiên cứu / Phân tích
  { group: 'I', section: 'self', text: 'Có hiểu biết rộng và thích tìm hiểu kiến thức mới.' },
  { group: 'I', section: 'self', text: 'Thích làm việc một mình khi cần tập trung.' },
  { group: 'I', section: 'self', text: 'Có khả năng phân tích vấn đề.' },
  { group: 'I', section: 'self', text: 'Suy nghĩ logic.' },
  { group: 'I', section: 'self', text: 'Yêu thích khoa học.' },
  { group: 'I', section: 'self', text: 'Có khả năng quan sát tốt.' },
  { group: 'I', section: 'self', text: 'Hay đặt câu hỏi “vì sao” và muốn tìm nguyên nhân.' },
  { group: 'I', section: 'can', text: 'Suy nghĩ về những khái niệm trừu tượng.' },
  { group: 'I', section: 'can', text: 'Giải các bài toán khó hoặc phức tạp.' },
  { group: 'I', section: 'can', text: 'Tiếp thu nhanh các lý thuyết khoa học.' },
  { group: 'I', section: 'can', text: 'Giải thích các công thức hoặc lập luận toán học.' },
  { group: 'I', section: 'can', text: 'Phân tích dữ liệu để tìm ra quy luật hoặc kết luận.' },
  { group: 'I', section: 'can', text: 'Tiến hành thí nghiệm hoặc kiểm tra một giả thuyết.' },
  { group: 'I', section: 'like', text: 'Đặt câu hỏi và tìm câu trả lời cho những vấn đề chưa rõ.' },
  { group: 'I', section: 'like', text: 'Tìm hiểu nhiều ý kiến khác nhau về một vấn đề cụ thể.' },
  { group: 'I', section: 'like', text: 'Sử dụng máy vi tính để tìm hiểu, xử lý hoặc phân tích thông tin.' },
  { group: 'I', section: 'like', text: 'Đọc sách, báo chuyên ngành hoặc tài liệu kỹ thuật.' },
  { group: 'I', section: 'like', text: 'Thiết lập đề tài nghiên cứu, làm khảo sát và kiểm tra kết quả.' },
  { group: 'I', section: 'like', text: 'Tham quan bảo tàng khoa học, phòng thí nghiệm hoặc cơ sở nghiên cứu.' },
  { group: 'I', section: 'like', text: 'Tìm hiểu một chủ đề thật sâu trước khi đưa ra kết luận.' },

  // A — Nghệ thuật / Sáng tạo
  { group: 'A', section: 'self', text: 'Rất sáng tạo.' },
  { group: 'A', section: 'self', text: 'Giàu trí tưởng tượng.' },
  { group: 'A', section: 'self', text: 'Thích cải tiến và đổi mới.' },
  { group: 'A', section: 'self', text: 'Có phong cách riêng và thích sự độc đáo.' },
  { group: 'A', section: 'self', text: 'Dễ xúc động trước âm nhạc, hình ảnh hoặc câu chuyện.' },
  { group: 'A', section: 'self', text: 'Nhạy cảm với màu sắc, âm thanh hoặc cảm xúc.' },
  { group: 'A', section: 'self', text: 'Thích tự do thể hiện ý tưởng hơn là làm theo khuôn mẫu.' },
  { group: 'A', section: 'can', text: 'Phác thảo, vẽ hoặc tô tranh.' },
  { group: 'A', section: 'can', text: 'Chơi một nhạc cụ.' },
  { group: 'A', section: 'can', text: 'Viết truyện, thơ hoặc sáng tác nội dung.' },
  { group: 'A', section: 'can', text: 'Hát, diễn xuất, nhảy hoặc khiêu vũ.' },
  { group: 'A', section: 'can', text: 'Tự thiết kế quần áo, đồ trang trí hoặc không gian theo ý tưởng của mình.' },
  { group: 'A', section: 'can', text: 'Chụp hình và lựa chọn những góc ảnh đẹp.' },
  { group: 'A', section: 'like', text: 'Tham gia khóa học thiết kế hoặc sáng tạo.' },
  { group: 'A', section: 'like', text: 'Học hát, nhạc, nhảy, khiêu vũ hoặc diễn xuất.' },
  { group: 'A', section: 'like', text: 'Làm đồ thủ công hoặc tự làm quà cho người thân, bạn bè.' },
  { group: 'A', section: 'like', text: 'Đọc truyện viễn tưởng, kịch, thơ hoặc tác phẩm văn học.' },
  { group: 'A', section: 'like', text: 'Thể hiện bản thân theo cách sáng tạo và khác biệt.' },
  { group: 'A', section: 'like', text: 'Xem hòa nhạc, kịch, triển lãm hoặc các hoạt động nghệ thuật.' },
  { group: 'A', section: 'like', text: 'Biến một ý tưởng bình thường thành cách thể hiện mới mẻ hơn.' },

  // S — Xã hội / Hỗ trợ
  { group: 'S', section: 'self', text: 'Rất thân thiện và hòa đồng.' },
  { group: 'S', section: 'self', text: 'Dễ thấu hiểu cảm xúc của người khác.' },
  { group: 'S', section: 'self', text: 'Hào phóng và sẵn sàng chia sẻ.' },
  { group: 'S', section: 'self', text: 'Hay giúp đỡ người khác.' },
  { group: 'S', section: 'self', text: 'Có tinh thần đồng đội và hợp tác.' },
  { group: 'S', section: 'self', text: 'Dễ tha thứ và biết lắng nghe.' },
  { group: 'S', section: 'self', text: 'Quan tâm đến việc người khác cảm thấy thế nào.' },
  { group: 'S', section: 'can', text: 'Chỉ dẫn hoặc dạy người khác.' },
  { group: 'S', section: 'can', text: 'Điều hành một cuộc thảo luận theo hướng mọi người cùng tham gia.' },
  { group: 'S', section: 'can', text: 'Hòa giải mâu thuẫn hoặc tranh chấp.' },
  { group: 'S', section: 'can', text: 'Diễn đạt suy nghĩ và cảm xúc rõ ràng.' },
  { group: 'S', section: 'can', text: 'Hợp tác tốt với nhiều kiểu người khác nhau.' },
  { group: 'S', section: 'can', text: 'Chơi hoặc phối hợp tốt trong môn thể thao có tính đồng đội.' },
  { group: 'S', section: 'like', text: 'Làm việc nhóm.' },
  { group: 'S', section: 'like', text: 'Tham gia hoạt động tình nguyện hoặc hoạt động cộng đồng.' },
  { group: 'S', section: 'like', text: 'Gặp gỡ và làm quen bạn mới.' },
  { group: 'S', section: 'like', text: 'Lắng nghe và tư vấn cho người khác.' },
  { group: 'S', section: 'like', text: 'Đóng góp ý kiến trong các cuộc thảo luận.' },
  { group: 'S', section: 'like', text: 'Tham gia hội thảo về phát triển cộng đồng và giải quyết vấn đề xã hội.' },
  { group: 'S', section: 'like', text: 'Tham gia hoạt động giúp một người khác học tập hoặc tiến bộ.' },

  // E — Quản lý / Khởi nghiệp
  { group: 'E', section: 'self', text: 'Thích phiêu lưu và thử thách.' },
  { group: 'E', section: 'self', text: 'Quyết đoán.' },
  { group: 'E', section: 'self', text: 'Dễ tạo ảnh hưởng trong một nhóm.' },
  { group: 'E', section: 'self', text: 'Có sức thuyết phục.' },
  { group: 'E', section: 'self', text: 'Có nhiều hoài bão và tham vọng.' },
  { group: 'E', section: 'self', text: 'Thích giao du và kết bạn.' },
  { group: 'E', section: 'self', text: 'Thích chủ động dẫn dắt thay vì chỉ chờ hướng dẫn.' },
  { group: 'E', section: 'can', text: 'Khởi đầu hoặc đề xuất một dự án mới.' },
  { group: 'E', section: 'can', text: 'Thuyết phục người khác ủng hộ một ý tưởng.' },
  { group: 'E', section: 'can', text: 'Lãnh đạo một nhóm.' },
  { group: 'E', section: 'can', text: 'Bán hàng hoặc quảng bá một ý tưởng.' },
  { group: 'E', section: 'can', text: 'Lên kế hoạch hoặc chiến lược để đạt mục tiêu.' },
  { group: 'E', section: 'can', text: 'Điều hành một hoạt động kinh doanh hoặc dự án nhỏ.' },
  { group: 'E', section: 'like', text: 'Đảm nhận vị trí có trách nhiệm và ảnh hưởng.' },
  { group: 'E', section: 'like', text: 'Đưa ra quyết định có ảnh hưởng đến người khác.' },
  { group: 'E', section: 'like', text: 'Tham gia các cuộc thi, hoạt động lãnh đạo hoặc bán hàng.' },
  { group: 'E', section: 'like', text: 'Gặp gỡ những người có kinh nghiệm hoặc có ảnh hưởng.' },
  { group: 'E', section: 'like', text: 'Tham gia khóa học về kinh doanh, marketing hoặc bán hàng.' },
  { group: 'E', section: 'like', text: 'Đọc nội dung về kinh doanh, thị trường hoặc khởi nghiệp.' },
  { group: 'E', section: 'like', text: 'Thử biến một ý tưởng thành dự án có kết quả cụ thể.' },

  // C — Nghiệp vụ / Quy củ
  { group: 'C', section: 'self', text: 'Gọn gàng và ngăn nắp.' },
  { group: 'C', section: 'self', text: 'Làm việc có nguyên tắc, trình tự và kế hoạch.' },
  { group: 'C', section: 'self', text: 'Chú trọng tính chính xác.' },
  { group: 'C', section: 'self', text: 'Thích làm việc với dữ liệu, con số hoặc văn bản.' },
  { group: 'C', section: 'self', text: 'Tuân thủ nguyên tắc và quy định.' },
  { group: 'C', section: 'self', text: 'Chu đáo và tỉ mỉ.' },
  { group: 'C', section: 'self', text: 'Cảm thấy thoải mái khi công việc có quy trình rõ ràng.' },
  { group: 'C', section: 'can', text: 'Làm việc tốt trong một hệ thống có quy trình.' },
  { group: 'C', section: 'can', text: 'Giải quyết công việc giấy tờ nhanh chóng và ngăn nắp.' },
  { group: 'C', section: 'can', text: 'Thực hiện công việc đòi hỏi chú ý đến các chi tiết.' },
  { group: 'C', section: 'can', text: 'Tổ chức và sắp xếp chương trình cho một hoạt động hoặc sự kiện.' },
  { group: 'C', section: 'can', text: 'Gõ văn bản nhanh hoặc nhập dữ liệu chính xác.' },
  { group: 'C', section: 'can', text: 'Lưu trữ dữ liệu và hồ sơ chính xác.' },
  { group: 'C', section: 'like', text: 'Sử dụng các thiết bị hoặc phần mềm để xử lý dữ liệu.' },
  { group: 'C', section: 'like', text: 'Sưu tầm, phân loại hoặc lưu giữ đồ vật theo hệ thống.' },
  { group: 'C', section: 'like', text: 'Tìm hiểu các thủ tục, quy định hoặc luật lệ.' },
  { group: 'C', section: 'like', text: 'Sắp xếp nhà cửa hoặc nơi làm việc gọn gàng.' },
  { group: 'C', section: 'like', text: 'Chơi trò tìm sự khác biệt hoặc phát hiện lỗi nhỏ.' },
  { group: 'C', section: 'like', text: 'Làm việc dựa trên hướng dẫn cụ thể.' },
  { group: 'C', section: 'like', text: 'Lập danh sách, lịch hoặc bảng theo dõi để kiểm soát công việc.' },
]

const SECTION_ORDER: QuestionSection[] = ['self', 'can', 'like']

function seededShuffle<T>(items: T[], seed: number): T[] {
  const out = [...items]
  let state = seed >>> 0
  const rand = () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 4294967296
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const orderedRaw = SECTION_ORDER.flatMap((section, index) =>
  seededShuffle(
    RAW.filter((q) => q.section === section),
    20260921 + index * 997,
  ),
)

export const QUESTION_BANK: InternalQuestion[] = orderedRaw.map((q, index) => ({
  ...q,
  id: `Q${String(index + 1).padStart(3, '0')}`,
  displayOrder: index + 1,
}))

if (QUESTION_BANK.length !== 120) {
  throw new Error(`Question bank must contain exactly 120 items, got ${QUESTION_BANK.length}`)
}

export const QUESTION_BY_ID = new Map(QUESTION_BANK.map((q) => [q.id, q]))
