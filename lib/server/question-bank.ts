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
  { group: 'R', section: 'self', text: 'khép kín.' },
  { group: 'R', section: 'self', text: 'Thích làm việc ngoài trời.' },
  { group: 'R', section: 'can', text: 'Sửa chữa các thiết bị điện, ô tô, xe máy, xe đạp,..' },
  { group: 'R', section: 'can', text: 'Chơi một môn thể thao.' },
  { group: 'R', section: 'can', text: 'Đọc bản vẽ/ bản thiết kế.' },
  { group: 'R', section: 'can', text: 'Sử dụng/ vận hành/ bảo trì máy móc, thiết bị.' },
  { group: 'R', section: 'can', text: 'Sử dụng công cụ để tạo kiểu tóc mới cho mình.' },
  { group: 'R', section: 'can', text: 'Tự may áo/váy/đầm cho mình.' },
  { group: 'R', section: 'like', text: 'Làm vườn/ trồng cây xanh, hoa kiểng.' },
  { group: 'R', section: 'like', text: 'Xây dựng/ lắp ráp mô hình.' },
  { group: 'R', section: 'like', text: 'Vận động tay chân và sử dụng tay chân để làm việc.' },
  { group: 'R', section: 'like', text: 'Tự ráp đồ nội thất (bàn/ghế/tủ)/ tự đóng bàn, ghế, tủ,….' },
  { group: 'R', section: 'like', text: 'Nấu ăn, làm bánh.' },
  { group: 'R', section: 'like', text: 'Tham dự khoá học kỹ thuật (điện, sữa chữa máy móc…).' },

  // I — Nghiên cứu / Phân tích
  { group: 'I', section: 'self', text: 'Có hiểu biết rộng.' },
  { group: 'I', section: 'self', text: 'Thích làm việc một mình.' },
  { group: 'I', section: 'self', text: 'Có khả năng phân tích cao.' },
  { group: 'I', section: 'self', text: 'Suy nghĩ logic.' },
  { group: 'I', section: 'self', text: 'Yêu thích khoa học.' },
  { group: 'I', section: 'self', text: 'Có khả năng quan sát tốt.' },
  { group: 'I', section: 'can', text: 'Suy nghĩ về những khái niệm trừu tượng.' },
  { group: 'I', section: 'can', text: 'Giải các bài toán khó hoặc phức tạp.' },
  { group: 'I', section: 'can', text: 'Tiếp thu nhanh các lý thuyết khoa học.' },
  { group: 'I', section: 'can', text: 'Giải thích các công thức toán học.' },
  { group: 'I', section: 'can', text: 'Phân tích dữ liệu.' },
  { group: 'I', section: 'can', text: 'Tiến hành thí nghiệm khoa học.' },
  { group: 'I', section: 'like', text: 'Đặt câu hỏi.' },
  { group: 'I', section: 'like', text: 'Tìm hiểu nhiều ý kiến khác nhau về 1 vấn đề cụ thể nào đó.' },
  { group: 'I', section: 'like', text: 'Sử dụng máy vi tính.' },
  { group: 'I', section: 'like', text: 'Đọc sách/ báo chuyên ngành/ kỹ thuật.' },
  { group: 'I', section: 'like', text: 'Thiết lập đề tài nghiên cứu, làm khảo sát và kiểm tra kết quả.' },
  { group: 'I', section: 'like', text: 'Tham quan bảo tàng khoa học, phòng thí nghiệm/ cơ sở nghiên cứu.' },

  // A — Nghệ thuật / Sáng tạo
  { group: 'A', section: 'self', text: 'Rất sáng tạo.' },
  { group: 'A', section: 'self', text: 'Giàu trí tưởng tượng.' },
  { group: 'A', section: 'self', text: 'Thích cải tiến và đổi mới.' },
  { group: 'A', section: 'self', text: 'Độc đáo, khác lạ.' },
  { group: 'A', section: 'self', text: 'Dễ xúc động.' },
  { group: 'A', section: 'self', text: 'Rất Nhạy cảm.' },
  { group: 'A', section: 'can', text: 'Phác thảo, vẽ, tô tranh.' },
  { group: 'A', section: 'can', text: 'Chơi một nhạc cụ.' },
  { group: 'A', section: 'can', text: 'Viết truyện, thơ hoặc sáng tác nhạc.' },
  { group: 'A', section: 'can', text: 'Hát, diễn xuất, nhảy hoặc khiêu vũ.' },
  { group: 'A', section: 'can', text: 'Tự thiết kế quần áo cho mình, bạn bè và người thân/ thiết kế nội thất.' },
  { group: 'A', section: 'can', text: 'Chụp hình với những góc ảnh đẹp.' },
  { group: 'A', section: 'like', text: 'Tham gia khóa học thiết kế.' },
  { group: 'A', section: 'like', text: 'Học hát, nhạc, nhảy, khiêu vũ hoặc diễn xuất.' },
  { group: 'A', section: 'like', text: 'Làm đồ thủ công hoặc tự làm quà cho người thân, bạn bè.' },
  { group: 'A', section: 'like', text: 'Đọc truyện viễn tưởng, kịch, thơ ca.' },
  { group: 'A', section: 'like', text: 'Thể hiện bản thân theo cách sáng tạo/mặc những thời trang lạ và thú vị.' },
  { group: 'A', section: 'like', text: 'Xem hòa nhạc, kịch, triển lãm nghệ thuật.' },

  // S — Xã hội / Hỗ trợ
  { group: 'S', section: 'self', text: 'Rất thân thiện và hòa đồng.' },
  { group: 'S', section: 'self', text: 'Dễ thấu hiểu người khác.' },
  { group: 'S', section: 'self', text: 'Hào phóng.' },
  { group: 'S', section: 'self', text: 'Hay giúp đỡ người khác.' },
  { group: 'S', section: 'self', text: 'Có tinh thần đồng đội, tinh thần hợp tác.' },
  { group: 'S', section: 'self', text: 'Dễ tha thứ.' },
  { group: 'S', section: 'can', text: 'Chỉ dẫn hoặc dạy người khác.' },
  { group: 'S', section: 'can', text: 'Điều hành các cuộc thảo luận.' },
  { group: 'S', section: 'can', text: 'Hòa giải mâu thuẫn/ tranh chấp.' },
  { group: 'S', section: 'can', text: 'Diễn đạt suy nghĩ và cảm xúc rõ ràng.' },
  { group: 'S', section: 'can', text: 'Hợp tác tốt với những người khác.' },
  { group: 'S', section: 'can', text: 'Chơi môn thể thao có tính đồng đội.' },
  { group: 'S', section: 'like', text: 'Làm việc nhóm.' },
  { group: 'S', section: 'like', text: 'Tham gia hoạt động tình nguyện với các nhóm hoạt động xã hội tại trường, nhà thờ, chùa, phường,...' },
  { group: 'S', section: 'like', text: 'Gặp gỡ và làm quen bạn mới.' },
  { group: 'S', section: 'like', text: 'Lắng nghe và tư vấn cho người khác.' },
  { group: 'S', section: 'like', text: 'Đóng góp trong các cuộc thảo luận.' },
  { group: 'S', section: 'like', text: 'Tham gia hội thảo về phát triển cộng đồng và giải quyết vấn đề xã hội.' },

  // E — Quản lý / Khởi nghiệp
  { group: 'E', section: 'self', text: 'Thích phiêu lưu.' },
  { group: 'E', section: 'self', text: 'Quyết đoán.' },
  { group: 'E', section: 'self', text: 'Thuộc dạng nổi tiếng ở trường.' },
  { group: 'E', section: 'self', text: 'Có sức thuyết phục.' },
  { group: 'E', section: 'self', text: 'Có nhiều hoài bão và tham vọng.' },
  { group: 'E', section: 'self', text: 'Thích giao du và kết bạn.' },
  { group: 'E', section: 'can', text: 'Khởi đầu/ đề xuất một dự án mới.' },
  { group: 'E', section: 'can', text: 'Thuyết phục người khác làm việc theo ý của tôi.' },
  { group: 'E', section: 'can', text: 'Lãnh đạo một nhóm.' },
  { group: 'E', section: 'can', text: 'Bán hàng hoặc quảng bá ý tưởng.' },
  { group: 'E', section: 'can', text: 'Lên kế hoạch/ chiến lược để đạt mục tiêu.' },
  { group: 'E', section: 'can', text: 'Điều hành hoạt động kinh doanh của gia đình.' },
  { group: 'E', section: 'like', text: 'Có quyền lực, địa vị/ được bầu cử vào những vị trí quan trọng.' },
  { group: 'E', section: 'like', text: 'Đưa ra quyết định có ảnh hưởng đến những người khác.' },
  { group: 'E', section: 'like', text: 'Giành chiến thắng một giải thưởng lãnh đạo hoặc bán hàng.' },
  { group: 'E', section: 'like', text: 'Gặp gỡ những người có quan trọng.' },
  { group: 'E', section: 'like', text: 'Tham gia khóa học về kinh doanh/marketing/ bán hàng.' },
  { group: 'E', section: 'like', text: 'Đọc tạp chí về kinh doanh.' },

  // C — Nghiệp vụ / Quy củ
  { group: 'C', section: 'self', text: 'Gọn gàng và ngăn nắp.' },
  { group: 'C', section: 'self', text: 'Làm việc có nguyên tắc, trình tự và kế hoạch.' },
  { group: 'C', section: 'self', text: 'Chú trọng tính chính xác.' },
  { group: 'C', section: 'self', text: 'Thích làm việc với dữ liệu, con số hoặc văn bản.' },
  { group: 'C', section: 'self', text: 'Tuân thủ nguyên tắc.' },
  { group: 'C', section: 'self', text: 'Chu đáo và tỉ mỉ.' },
  { group: 'C', section: 'can', text: 'Làm việc tốt trong khuôn khổ hệ thống.' },
  { group: 'C', section: 'can', text: 'Giải quyết công việc giấy tờ nhanh chóng, hiêu quả, ngăn nắp.' },
  { group: 'C', section: 'can', text: 'Thực hiện công việc đòi hỏi chú ý đến các chi tiết(sửa lỗi các văn bản, sắp xếp, dàn dựng chương trình cho sự kiện, …).' },
  { group: 'C', section: 'can', text: 'Tổ chức, dàn dựng chương trình cho các hoạt động, sự kiện: tổ chức đêm ca nhạc, buổi dã ngoại cho cả lớp, câu lạc bộ.' },
  { group: 'C', section: 'can', text: 'Gõ văn bản nhanh hoặc viết tốc ký.' },
  { group: 'C', section: 'can', text: 'Lưu trữ dữ liệu và hồ sơ chính xác.' },
  { group: 'C', section: 'like', text: 'Sử dụng các thiết bị xử lý dữ liệu.' },
  { group: 'C', section: 'like', text: 'Sưu tầm đồ vật tkỷ niệm.' },
  { group: 'C', section: 'like', text: 'Học, tìm hiểu các thủ tục, quy định, luật lệ (vd: luật thuế, luật kinh doanh …).' },
  { group: 'C', section: 'like', text: 'Sắp xếp nhà cửa hoặc nơi làm việc.' },
  { group: 'C', section: 'like', text: 'Chơi trò tìm sự khác biệt giữa hai hình ảnh.' },
  { group: 'C', section: 'like', text: 'Làm việc dựa trên hướng dẫn cụ thể.' },
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
