import { EvaluationCriterion, LegalDocument, User, Initiative, EvaluatorScoreSheet, SimilarityReport, AuditLog } from '../types';

export const INITIAL_CRITERIA: EvaluationCriterion[] = [
  {
    id: 'crit-a1',
    code: 'A.1',
    group: 'A',
    groupName: 'Tính mới của giải pháp',
    name: 'Tính mới so với các giải pháp đã biết tại địa phương',
    description: 'Giải pháp không trùng lặp hoàn toàn với các sáng kiến, mô hình đã được công nhận, công bố hoặc áp dụng trước đó tại UBND xã Văn Môn, thành phố Bắc Ninh hoặc các đơn vị khác.',
    maxScore: 20,
    weight: 1,
    passingScore: 10,
    isDisqualifyingIfFail: true,
    requiredEvidence: 'Mô tả rõ điểm khác biệt, phần cải tiến so với phương pháp truyền thống; biên bản kiểm tra trùng lặp.',
    legalRef: 'Điều 3, Điều 4 Điều lệ Sáng kiến (Nghị định số 13/2012/NĐ-CP)'
  },
  {
    id: 'crit-a2',
    code: 'A.2',
    group: 'A',
    groupName: 'Tính mới của giải pháp',
    name: 'Tính sáng tạo và cải tiến quy trình công tác',
    description: 'Có tính chủ động sáng tạo của tác giả; cải tiến cách thức tổ chức, áp dụng công nghệ số hoặc quy trình xử lý công việc mang lại sự đột phá.',
    maxScore: 20,
    weight: 1,
    passingScore: 10,
    isDisqualifyingIfFail: true,
    requiredEvidence: 'Sơ đồ quy trình mới so với quy trình cũ, tài liệu hướng dẫn hoặc công cụ cải tiến.',
    legalRef: 'Khoản 1 Điều 3 Thông tư số 18/2013/TT-BKHCN'
  },
  {
    id: 'crit-b1',
    code: 'B.1',
    group: 'B',
    groupName: 'Khả năng áp dụng',
    name: 'Đã được áp dụng thực tế tại cơ quan, đơn vị',
    description: 'Sáng kiến đã được triển khai áp dụng thử nghiệm hoặc chính thức trong công tác quản lý, giảng dạy hoặc chuyên môn tại địa bàn xã Văn Môn và có kết quả kiểm chứng cụ thể.',
    maxScore: 15,
    weight: 1,
    passingScore: 8,
    isDisqualifyingIfFail: false,
    requiredEvidence: 'Văn bản xác nhận áp dụng sáng kiến của Thủ trưởng cơ quan/đơn vị thụ hưởng.',
    legalRef: 'Khoản 2 Điều 3 Điều lệ Sáng kiến (Nghị định số 13/2012/NĐ-CP)'
  },
  {
    id: 'crit-b2',
    code: 'B.2',
    group: 'B',
    groupName: 'Khả năng áp dụng',
    name: 'Khả năng nhân rộng trên địa bàn xã và cấp huyện',
    description: 'Giải pháp có tính phổ quát, dễ chuyển giao, có thể nhân rộng sang các thôn, các trường học hoặc các phường, xã khác trong thành phố Bắc Ninh.',
    maxScore: 10,
    weight: 1,
    passingScore: 5,
    isDisqualifyingIfFail: false,
    requiredEvidence: 'Phương án hoặc kế hoạch triển khai nhân rộng, điều kiện kỹ thuật và nhân lực cần thiết.',
    legalRef: 'Điều 6 Quyết định số 19/2020/QĐ-UBND tỉnh Bắc Ninh'
  },
  {
    id: 'crit-c1',
    code: 'C.1',
    group: 'C',
    groupName: 'Hiệu quả kinh tế',
    name: 'Tiết kiệm chi phí, thời gian và nguồn lực',
    description: 'Định lượng hoặc định tính giá trị làm lợi: tiết kiệm ngân sách, chi phí văn phòng phẩm, rút ngắn thời gian xử lý thủ tục, tiết kiệm nhân lực. (Nếu chưa đủ dữ liệu định lượng phải ghi rõ "Chưa đủ dữ liệu định lượng để xác minh" và đánh giá định tính).',
    maxScore: 15,
    weight: 1,
    passingScore: 7,
    isDisqualifyingIfFail: false,
    requiredEvidence: 'Bảng đối chiếu chi phí, thời gian trước và sau khi áp dụng có xác nhận của bộ phận kế toán/văn phòng.',
    legalRef: 'Điều 7 Thông tư số 18/2013/TT-BKHCN'
  },
  {
    id: 'crit-d1',
    code: 'D.1',
    group: 'D',
    groupName: 'Hiệu quả xã hội',
    name: 'Cải cách hành chính, chuyển đổi số và phục vụ công dân',
    description: 'Nâng cao chất lượng phục vụ công dân/doanh nghiệp tại Bộ phận Một cửa; đẩy mạnh dịch vụ công trực tuyến, Đề án 06; tăng tính công khai, minh bạch hoạt động chính quyền cấp xã.',
    maxScore: 10,
    weight: 1,
    passingScore: 5,
    isDisqualifyingIfFail: false,
    requiredEvidence: 'Thống kê tỷ lệ hồ sơ trực tuyến, kết quả đánh giá hài lòng của người dân.',
    legalRef: 'Chương trình CCHC và Kế hoạch Chuyển đổi số tỉnh Bắc Ninh'
  },
  {
    id: 'crit-d2',
    code: 'D.2',
    group: 'D',
    groupName: 'Hiệu quả xã hội',
    name: 'Tác động môi trường, an sinh xã hội và trật tự địa phương',
    description: 'Góp phần cải thiện vệ sinh môi trường (đặc biệt giải quyết vấn đề môi trường làng nghề Mẫn Xá - Văn Môn), đảm bảo an ninh nông thôn, nâng cao chất lượng giáo dục, y tế cộng đồng.',
    maxScore: 10,
    weight: 1,
    passingScore: 5,
    isDisqualifyingIfFail: false,
    requiredEvidence: 'Báo cáo giám sát môi trường, biên bản ghi nhận của các ban ngành đoàn thể, số liệu giảm thiểu khiếu nại.',
    legalRef: 'Quy định quản lý sáng kiến cấp cơ sở UBND thành phố Bắc Ninh'
  }
];

export const INITIAL_LEGAL_DOCS: LegalDocument[] = [
  {
    id: 'leg-00',
    docNumber: '06/2022/QH15',
    title: 'Luật Thi đua, khen thưởng năm 2022',
    issuer: 'Quốc hội khóa XV',
    issuedDate: '15/06/2022',
    effectiveDate: '01/01/2024',
    status: 'active',
    appliedClauses: 'Điều 23 (Danh hiệu Chiến sĩ thi đua cơ sở: cá nhân có sáng kiến được cơ sở công nhận hoặc đề tài khoa học đã nghiệm thu)',
    linkUrl: 'https://vanban.chinhphu.vn',
    summary: 'Đạo luật nền tảng quy định tiêu chuẩn danh hiệu thi đua gắn liền với việc công nhận hiệu quả áp dụng, phạm vi ảnh hưởng của sáng kiến kinh nghiệm tại cơ quan, đơn vị.',
    category: 'central'
  },
  {
    id: 'leg-00b',
    docNumber: '98/2023/NĐ-CP',
    title: 'Nghị định số 98/2023/NĐ-CP quy định chi tiết thi hành một số điều của Luật Thi đua, khen thưởng',
    issuer: 'Chính phủ',
    issuedDate: '31/12/2023',
    effectiveDate: '01/01/2024',
    status: 'active',
    appliedClauses: 'Điều 7, Điều 11; Quy định về thẩm quyền đánh giá, công nhận sáng kiến và hiệu quả áp dụng tại cấp cơ sở',
    linkUrl: 'https://vanban.chinhphu.vn',
    summary: 'Hướng dẫn chi tiết thi hành Luật Thi đua, khen thưởng, tạo cơ sở pháp lý cho UBND cấp xã thành lập Hội đồng xét sáng kiến và công nhận phạm vi ảnh hưởng.',
    category: 'central'
  },
  {
    id: 'leg-01',
    docNumber: '13/2012/NĐ-CP',
    title: 'Nghị định số 13/2012/NĐ-CP ban hành Điều lệ Sáng kiến',
    issuer: 'Chính phủ',
    issuedDate: '02/03/2012',
    effectiveDate: '25/04/2012',
    status: 'active',
    appliedClauses: 'Điều 3 (Điều kiện công nhận), Điều 4 (Tính mới), Điều 7, 8 (Hội đồng sáng kiến), Điều 10 (Thù lao tác giả)',
    linkUrl: 'https://vanban.chinhphu.vn',
    summary: 'Quy định thống nhất về điều kiện công nhận sáng kiến, quyền tác giả sáng kiến, thành lập và hoạt động của Hội đồng xét sáng kiến các cấp.',
    category: 'central'
  },
  {
    id: 'leg-02',
    docNumber: '18/2013/TT-BKHCN',
    title: 'Thông tư số 18/2013/TT-BKHCN hướng dẫn thi hành một số quy định của Điều lệ Sáng kiến',
    issuer: 'Bộ Khoa học và Công nghệ',
    issuedDate: '01/08/2013',
    effectiveDate: '25/09/2013',
    status: 'active',
    appliedClauses: 'Điều 3 (Đối tượng và tính mới), Điều 5 (Đơn yêu cầu), Điều 8 (Hội đồng sáng kiến cơ sở), Phụ lục I - VI (Hệ thống biểu mẫu)',
    linkUrl: 'https://most.gov.vn',
    summary: 'Hướng dẫn chi tiết phương pháp xác định tính mới, khả năng áp dụng và cách tính toán hiệu quả của giải pháp đề nghị công nhận sáng kiến.',
    category: 'central'
  },
  {
    id: 'leg-03',
    docNumber: '152/2025/NĐ-CP',
    title: 'Nghị định số 152/2025/NĐ-CP quy định về phân cấp, phân quyền trong lĩnh vực thi đua, khen thưởng',
    issuer: 'Chính phủ',
    issuedDate: '14/06/2025',
    effectiveDate: '01/07/2025',
    status: 'active',
    appliedClauses: 'Điều 12, Điều 33; Mẫu số 13 (Giấy xác nhận hiệu quả áp dụng, phạm vi ảnh hưởng của sáng kiến đề nghị xét tặng Chiến sĩ thi đua)',
    summary: 'Quy định về thẩm quyền, tiêu chuẩn công nhận hiệu quả áp dụng và phạm vi ảnh hưởng của sáng kiến làm căn cứ bình xét thi đua khen thưởng.',
    category: 'central'
  },
  {
    id: 'leg-04',
    docNumber: '15/2025/TT-BNV',
    title: 'Thông tư số 15/2025/TT-BNV hướng dẫn thi hành Luật Thi đua, khen thưởng và Nghị định số 152/2025/NĐ-CP',
    issuer: 'Bộ Nội vụ',
    issuedDate: '04/08/2025',
    effectiveDate: '05/08/2025',
    status: 'active',
    appliedClauses: 'Điều 9 (Công nhận hiệu quả áp dụng, khả năng nhân rộng của sáng kiến làm căn cứ danh hiệu thi đua), Điều 11 (Hiệu lực)',
    summary: 'Quy định biện pháp tổ chức xét sáng kiến công nhận danh hiệu Chiến sĩ thi đua cơ sở. Thay thế Thông tư số 01/2024/TT-BNV.',
    category: 'central'
  },
  {
    id: 'leg-05',
    docNumber: '1603/HD-HĐSK',
    title: 'Hướng dẫn số 1603/HD-HĐSK về Hoạt động sáng kiến trên địa bàn tỉnh Bắc Ninh (Ban hành mới)',
    issuer: 'Hội đồng Sáng kiến tỉnh Bắc Ninh',
    issuedDate: '19/08/2025',
    effectiveDate: '19/08/2025',
    status: 'active',
    appliedClauses: 'Phần I (Xét công nhận tại cơ sở); Phần III (Hiệu quả áp dụng, nhân rộng); Phụ lục 1 (Mẫu 01/SK đến 09/SK); Phụ lục 2 (Mẫu 01/HQAD đến 05/HQAD)',
    summary: 'Văn bản hướng dẫn toàn diện và mới nhất của tỉnh Bắc Ninh: Tiêu chuẩn tính mới (Mẫu 05/SK), biểu mẫu nộp đơn (Mẫu 01/SK), thuyết minh (Mẫu 02/SK), biên bản (Mẫu 06/SK), quyết định công nhận (Mẫu 07/SK). Thay thế Hướng dẫn 425/HD-SKHCN.',
    category: 'provincial'
  },
  {
    id: 'leg-06',
    docNumber: '404/QĐ-HĐSK',
    title: 'Quyết định số 404/QĐ-HĐSK ban hành Quy chế hoạt động của Hội đồng Sáng kiến tỉnh Bắc Ninh',
    issuer: 'Hội đồng Sáng kiến tỉnh Bắc Ninh',
    issuedDate: '28/07/2025',
    effectiveDate: '28/07/2025',
    status: 'active',
    appliedClauses: 'Điều 2 (Nhiệm vụ), Điều 9 (Nguyên tắc làm việc ít nhất 70% đồng ý), Điều 11 (Họp 02 đợt/năm: trước 30/8 và 30/11)',
    summary: 'Ban hành quy chế hoạt động chính thức của Hội đồng Sáng kiến tỉnh Bắc Ninh. Thay thế toàn bộ các quy chế trước đây của Bắc Ninh (cũ) và Bắc Giang.',
    category: 'provincial'
  },
  {
    id: 'leg-07',
    docNumber: '304/QĐ-UBND',
    title: 'Quyết định số 304/QĐ-UBND về việc kiện toàn Hội đồng Sáng kiến tỉnh Bắc Ninh',
    issuer: 'UBND tỉnh Bắc Ninh',
    issuedDate: '16/07/2025',
    effectiveDate: '16/07/2025',
    status: 'active',
    appliedClauses: 'Điều 1 (Cơ cấu thành viên: Phó Chủ tịch UBND tỉnh làm Chủ tịch HĐ, Giám đốc Sở KH&CN làm Phó Chủ tịch HĐ)',
    summary: 'Quyết định kiện toàn tổ chức Hội đồng sáng kiến tỉnh Bắc Ninh.',
    category: 'provincial'
  },
  {
    id: 'leg-07b',
    docNumber: '28/KH-UBND',
    title: 'Kế hoạch số 28/KH-UBND về công tác xét, công nhận sáng kiến cấp cơ sở năm 2026',
    issuer: 'UBND thành phố Bắc Ninh',
    issuedDate: '15/01/2026',
    effectiveDate: '15/01/2026',
    status: 'active',
    appliedClauses: 'Mục II (Chỉ tiêu, tiến độ nộp hồ sơ đợt 1 trước 30/5, đợt 2 trước 30/10); Mục III (Quy trình thẩm định và công nhận)',
    summary: 'Kế hoạch triển khai công tác sáng kiến năm 2026 trên địa bàn thành phố Bắc Ninh; giao chỉ tiêu và hướng dẫn các xã, phường tiếp nhận và chấm sáng kiến.',
    category: 'provincial'
  },
  {
    id: 'leg-08',
    docNumber: '112/QĐ-UBND',
    title: 'Quyết định số 112/QĐ-UBND thành lập Hội đồng xét sáng kiến kinh nghiệm cấp cơ sở năm 2026',
    issuer: 'UBND xã Văn Môn, thành phố Bắc Ninh',
    issuedDate: '12/01/2026',
    effectiveDate: '12/01/2026',
    status: 'active',
    appliedClauses: 'Điều 1 (Cơ cấu Hội đồng 05 thành viên do PCT UBND xã làm Chủ tịch HĐ), Điều 2 (Quy chế chấm điểm độc lập)',
    summary: 'Quyết định thành lập Hội đồng cơ sở xã Văn Môn theo quy định tại Mẫu 04/SK Hướng dẫn số 1603/HD-HĐSK.',
    category: 'commune'
  },
  {
    id: 'leg-09',
    docNumber: '425/HD-SKHCN',
    title: 'Hướng dẫn số 425/HD-SKHCN về xét, công nhận sáng kiến và thẩm định hồ sơ sáng kiến cấp cơ sở',
    issuer: 'Sở Khoa học và Công nghệ tỉnh Bắc Ninh',
    issuedDate: '15/03/2022',
    effectiveDate: '15/03/2022',
    status: 'replaced',
    replacedBy: 'Hướng dẫn số 1603/HD-HĐSK ngày 19/8/2025 của Hội đồng Sáng kiến tỉnh Bắc Ninh',
    replacementDocId: 'leg-05',
    replacedDate: '19/08/2025',
    replacedReason: 'Cập nhật toàn diện thể thức biểu mẫu Mẫu 01/SK đến 09/SK và phương pháp tính điểm mới theo chỉ đạo của UBND tỉnh Bắc Ninh.',
    appliedClauses: 'Toàn bộ nội dung và biểu mẫu cũ',
    summary: 'VĂN BẢN ĐÃ HẾT HIỆU LỰC: Đã được thay thế hoàn toàn bởi Hướng dẫn số 1603/HD-HĐSK ngày 19/8/2025 của Hội đồng Sáng kiến tỉnh Bắc Ninh.',
    category: 'provincial'
  },
  {
    id: 'leg-10',
    docNumber: '19/2020/QĐ-UBND',
    title: 'Quyết định số 19/2020/QĐ-UBND ban hành Quy định quản lý hoạt động sáng kiến trên địa bàn tỉnh Bắc Ninh',
    issuer: 'UBND tỉnh Bắc Ninh',
    issuedDate: '28/08/2020',
    effectiveDate: '10/09/2020',
    status: 'replaced',
    replacedBy: 'Quyết định số 304/QĐ-UBND, QĐ 404/QĐ-HĐSK và Hướng dẫn số 1603/HD-HĐSK (2025)',
    replacementDocId: 'leg-06',
    replacedDate: '28/07/2025',
    replacedReason: 'Tổ chức lại Hội đồng sáng kiến tỉnh và ban hành quy chế làm việc mới sau khi kiện toàn bộ máy.',
    appliedClauses: 'Các quy định quản lý hoạt động sáng kiến cũ',
    summary: 'VĂN BẢN ĐÃ HẾT HIỆU LỰC: Đã được thay thế bởi hệ thống văn bản quy chế và hướng dẫn mới của Hội đồng Sáng kiến tỉnh Bắc Ninh năm 2025.',
    category: 'provincial'
  },
  {
    id: 'leg-11',
    docNumber: '01/2024/TT-BNV',
    title: 'Thông tư số 01/2024/TT-BNV quy định biện pháp thi hành Luật Thi đua, khen thưởng',
    issuer: 'Bộ Nội vụ',
    issuedDate: '24/02/2024',
    effectiveDate: '24/02/2024',
    status: 'replaced',
    replacedBy: 'Thông tư số 15/2025/TT-BNV ngày 04/8/2025 của Bộ Nội vụ',
    replacementDocId: 'leg-04',
    replacedDate: '05/08/2025',
    replacedReason: 'Thay thế theo Điều 11 Thông tư số 15/2025/TT-BNV của Bộ Nội vụ nhằm phù hợp với Nghị định số 152/2025/NĐ-CP.',
    appliedClauses: 'Quy định cũ về xét sáng kiến và danh hiệu thi đua',
    summary: 'VĂN BẢN ĐÃ HẾT HIỆU LỰC: Đã được thay thế kể từ ngày 05/8/2025 theo Điều 11 Thông tư số 15/2025/TT-BNV.',
    category: 'central'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Nguyễn Văn Đạt',
    role: 'admin',
    title: 'Chuyên viên Công nghệ thông tin',
    department: 'Văn phòng HĐND & UBND xã Văn Môn, thành phố Bắc Ninh',
    email: 'quantri.vanmon@bacninh.gov.vn',
    phone: '0988.123.456'
  },
  {
    id: 'usr-reception',
    name: 'Trần Thị Thu Trang',
    role: 'receptionist',
    title: 'Công chức Văn phòng - Thống kê',
    department: 'Bộ phận Tiếp nhận và Trả kết quả (Một cửa)',
    email: 'thutrang.vanmon@bacninh.gov.vn',
    phone: '0972.345.678'
  },
  {
    id: 'usr-author',
    name: 'Nguyễn Thị Hoa',
    role: 'author',
    title: 'Giáo viên THCS / Tác giả sáng kiến',
    department: 'Trường THCS Văn Môn, thành phố Bắc Ninh',
    email: 'nguyenhoa.thcswanmon@bacninh.edu.vn',
    phone: '0979.888.777'
  },
  {
    id: 'usr-president',
    name: 'Mẫn Văn Tuấn',
    role: 'council_president',
    title: 'Phó Chủ tịch UBND xã - Chủ tịch Hội đồng Sáng kiến',
    department: 'Lãnh đạo UBND xã Văn Môn',
    email: 'mvtuan.ubndvanmon@bacninh.gov.vn',
    phone: '0912.888.999'
  },
  {
    id: 'usr-secretary',
    name: 'Nguyễn Đình Hùng',
    role: 'council_secretary',
    title: 'Công chức Tư pháp - Hộ tịch - Thư ký Hội đồng',
    department: 'Tư pháp - Hộ tịch xã Văn Môn',
    email: 'ndhung.vanmon@bacninh.gov.vn',
    phone: '0983.567.890'
  },
  {
    id: 'usr-eval1',
    name: 'Trương Thị Nga',
    role: 'evaluator',
    title: 'Công chức Địa chính - Xây dựng - Môi trường',
    department: 'UBND xã Văn Môn',
    email: 'ttnga.vanmon@bacninh.gov.vn',
    phone: '0964.111.222'
  },
  {
    id: 'usr-eval2',
    name: 'Nguyễn Khắc Lâm',
    role: 'evaluator',
    title: 'Công chức Tài chính - Kế toán xã',
    department: 'Tài chính - Kế toán xã Văn Môn',
    email: 'nklam.vanmon@bacninh.gov.vn',
    phone: '0977.222.333'
  },
  {
    id: 'usr-eval3',
    name: 'Ngô Thị Mai',
    role: 'evaluator',
    title: 'Hiệu trưởng Trường THCS Văn Môn',
    department: 'Trường THCS Văn Môn',
    email: 'ntmai.thcsvanmon@bacninh.edu.vn',
    phone: '0989.444.555'
  }
];

export const INITIAL_INITIATIVES: Initiative[] = [
  {
    id: 'init-01',
    code: 'SK-2026-VM01',
    title: 'Ứng dụng mã QR động và Zalo Mini App trong hỗ trợ nộp hồ sơ dịch vụ công trực tuyến tại Bộ phận Một cửa xã Văn Môn',
    author: 'Trần Thị Thu Trang',
    authorTitle: 'Công chức Văn phòng - Thống kê',
    authorUnit: 'UBND xã Văn Môn, thành phố Bắc Ninh',
    authorDob: '1992',
    coAuthors: ['Nguyễn Văn Đạt'],
    field: 'administrative_reform',
    year: 2026,
    executionPeriod: '01/2025 - 12/2025',
    applicationStartDate: '01/03/2025',
    applicationScope: 'Bộ phận Tiếp nhận và Trả kết quả UBND xã Văn Môn và 5 thôn trên địa bàn xã',
    summary: 'Sáng kiến xây dựng giải pháp tạo mã QR động tích hợp bảng hướng dẫn nộp hồ sơ trực tuyến qua Zalo Mini App "Văn Môn Số", giúp người dân nông thôn, tiểu thương làng nghề Mẫn Xá quét mã nộp hồ sơ chỉ trong 3 bước, giảm thiểu tối đa hồ sơ phải nộp giấy tờ trực tiếp.',
    currentStatusBefore: 'Trước khi áp dụng, tỷ lệ nộp hồ sơ TTHC trực tuyến toàn trình tại xã Văn Môn chỉ đạt 41,2%. Người dân đến bộ phận Một cửa thường lúng túng khi đăng nhập VNeID trên máy tính, tốn thời gian cán bộ hướng dẫn từng người (trung bình 18-25 phút/hồ sơ). Nhiều hộ dân làng nghề bận sản xuất đúc nhôm không có thời gian đến UBND xã.',
    solutionContent: 'Thiết kế hệ thống 32 mã QR động tương ứng với 32 TTHC thường gặp (Khai sinh, kết hôn, chứng thực bản sao điện tử, xác nhận tình trạng hôn nhân). Khi quét mã bằng Zalo, hệ thống tự động điền các thông tin cơ bản từ VNeID, hiển thị video 45 giây hướng dẫn bằng tiếng Việt rõ ràng. Cán bộ tổ công nghệ số cộng đồng tại 5 thôn (Ti Quan, Quan Đình, Phù Xá, Thâm Mẫn, Mẫn Xá) được trang bị sổ tay mã QR để hỗ trợ người già nộp tại nhà.',
    noveltyPoints: 'Điểm mới căn bản là không yêu cầu người dân nhớ địa chỉ cổng Dịch vụ công quốc gia phức tạp mà kích hoạt nộp trực tiếp qua Zalo thân thuộc; cơ chế sinh QR động tự khớp biểu mẫu mẫu điện tử giúp giảm 70% thao tác nhập liệu.',
    applicationCapacity: 'Đã triển khai ổn định tại UBND xã Văn Môn 10 tháng qua; hoàn toàn có thể sao chép và chuyển giao cho các phường, xã khác trong thành phố Bắc Ninh và các xã có đặc thù làng nghề tại Bắc Ninh.',
    economicBenefit: 'Tiết kiệm ước tính 18,5 triệu đồng tiền in ấn phôi giấy tờ mẫu trong năm 2025; rút ngắn thời gian hướng dẫn của công chức từ 20 phút xuống còn 4-5 phút/hồ sơ (tiết kiệm tương đương khoảng 480 giờ lao động công ích trong năm).',
    economicDataVerified: true,
    socialBenefit: 'Nâng tỷ lệ hồ sơ trực tuyến từ 41,2% lên 89,6% (đứng top 3 toàn thành phố Bắc Ninh). Chỉ số hài lòng của người dân đạt 98,4%. Góp phần thực hiện xuất sắc Đề án 06 của Chính phủ tại địa phương.',
    attachments: [
      {
        id: 'att-01',
        name: 'Báo_cáo_mô_tả_sáng_kiến_SK-2026-VM01.docx',
        fileType: 'docx',
        fileSize: '1.4 MB',
        uploadDate: '15/01/2026',
        category: 'report',
        extractedSnippet: 'Nội dung giải pháp ứng dụng QR động kết hợp Zalo Mini App nhằm nâng cao chỉ số phục vụ công dân tại Bộ phận Một cửa UBND xã Văn Môn...'
      },
      {
        id: 'att-02',
        name: 'Giấy_xác_nhận_hiệu_quả_áp_dụng_UBND_xã.pdf',
        fileType: 'pdf',
        fileSize: '820 KB',
        uploadDate: '16/01/2026',
        category: 'evidence',
        extractedSnippet: 'UBND xã Văn Môn xác nhận sáng kiến của đồng chí Trần Thị Thu Trang đã áp dụng thực tế từ tháng 3/2025 mang lại kết quả rõ rệt...'
      }
    ],
    status: 'evaluating',
    assignedEvaluatorIds: ['usr-president', 'usr-secretary', 'usr-eval1', 'usr-eval2'],
    createdAt: '2026-01-15T08:30:00Z',
    updatedAt: '2026-01-20T14:15:00Z'
  },
  {
    id: 'init-02',
    code: 'SK-2026-VM02',
    title: 'Xây dựng mô hình "Nhóm Zalo An ninh - Môi trường làng nghề" kết hợp bản đồ nhiệt giám sát xả khói bụi tại thôn Mẫn Xá, xã Văn Môn',
    author: 'Trương Thị Nga',
    authorTitle: 'Công chức Địa chính - Xây dựng - Môi trường',
    authorUnit: 'UBND xã Văn Môn, thành phố Bắc Ninh',
    authorDob: '1988',
    coAuthors: ['Nguyễn Đình Hùng'],
    field: 'environment_craft_village',
    year: 2026,
    executionPeriod: '02/2025 - 11/2025',
    applicationStartDate: '01/04/2025',
    applicationScope: 'Khu dân cư thôn Mẫn Xá và Cụm công nghiệp làng nghề Mẫn Xá - Văn Môn',
    summary: 'Thiết lập mạng lưới tiếp nhận phản ánh tức thời tình trạng đốt xỉ lò đúc nhôm gây khói bụi đặc quánh ban đêm qua nhóm Zalo cộng đồng kiểm chứng GPS, kết hợp lập bản đồ nhiệt xác định 12 điểm nóng thường xuyên vi phạm để lực lượng liên ngành xã xử lý ngay trong 30 phút.',
    currentStatusBefore: 'Mẫn Xá là điểm nóng ô nhiễm môi trường nghiêm trọng của tỉnh Bắc Ninh do hoạt động tái chế nhôm phế liệu. Nhiều lò đốt trộm xỉ nhôm từ 23h đêm đến 4h sáng. Người dân bức xúc gửi đơn vượt cấp; công chức môi trường xã khó phát hiện do địa bàn rộng và đối tượng cảnh giới chặt chẽ.',
    solutionContent: 'Xây dựng quy chế phối hợp giữa Công an xã, Ban Chỉ huy Quân sự, Công chức Môi trường và Trưởng thôn Mẫn Xá. Ứng dụng bản đồ Google My Maps ghi nhận tọa độ GPS do người dân gửi kèm ảnh/video thời gian thực. Phân ca trực kiểm tra phản ứng nhanh, lập biên bản vi phạm và niêm phong 09 cơ sở vi phạm nghiêm trọng trong 6 tháng.',
    noveltyPoints: 'Kết hợp giám sát của nhân dân với công nghệ bản đồ số định vị nguồn khói theo thời gian thực; cơ chế phản ứng nhanh 30 phút xóa bỏ hoàn toàn tình trạng trốn tránh trách nhiệm.',
    applicationCapacity: 'Áp dụng tốt tại xã Văn Môn và có thể mở rộng cho các làng nghề tái chế chì Đông Mai, làng nghề giấy Phong Khê và Đa Hội.',
    economicBenefit: 'Giảm chi phí các đợt quan trắc đột xuất tốn kém; thu nộp phạt vi phạm hành chính về môi trường vào ngân sách 85 triệu đồng; tuy nhiên các chi phí gián tiếp về sức khỏe chưa đủ dữ liệu định lượng chính xác.',
    economicDataVerified: false,
    socialBenefit: 'Giảm 65% số vụ phản ánh khói lò đốt ban đêm trong khu dân cư; không phát sinh điểm nóng khiếu kiện đông người; nâng cao ý thức chấp hành bảo vệ môi trường của các chủ cơ sở cô đúc kim loại.',
    attachments: [
      {
        id: 'att-03',
        name: 'Thuyet_minh_sang_kien_Moi_truong_Man_Xa.docx',
        fileType: 'docx',
        fileSize: '2.1 MB',
        uploadDate: '18/01/2026',
        category: 'report'
      },
      {
        id: 'att-04',
        name: 'Bien_ban_xu_ly_vi_pham_thuc_te.pdf',
        fileType: 'pdf',
        fileSize: '1.2 MB',
        uploadDate: '18/01/2026',
        category: 'evidence'
      }
    ],
    status: 'evaluating',
    assignedEvaluatorIds: ['usr-president', 'usr-secretary', 'usr-eval2', 'usr-eval3'],
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-22T09:00:00Z'
  },
  {
    id: 'init-03',
    code: 'SK-2026-VM03',
    title: 'Giải pháp nâng cao chất lượng giáo dục STEM lồng ghép bảo vệ môi trường sống tại Trường THCS Văn Môn',
    author: 'Ngô Thị Mai',
    authorTitle: 'Hiệu trưởng',
    authorUnit: 'Trường THCS Văn Môn, thành phố Bắc Ninh',
    authorDob: '1979',
    coAuthors: ['Nguyễn Thị Lan'],
    field: 'education_training',
    year: 2026,
    executionPeriod: '09/2024 - 05/2025',
    applicationStartDate: '15/10/2024',
    applicationScope: 'Toàn bộ học sinh khối 8 và khối 9 Trường THCS Văn Môn',
    summary: 'Xây dựng chuỗi 6 chủ đề dạy học STEM liên môn (Vật lý - Hóa học - Sinh học - Công nghệ) hướng tới việc nghiên cứu chế tạo mô hình lọc bụi khói than mini và máy đo chất lượng không khí Arduino đơn giản trong phòng học.',
    currentStatusBefore: 'Dạy học các môn khoa học tự nhiên trước đây nặng về lý thuyết, học sinh chưa thấy được ứng dụng thực tiễn vào bối cảnh ô nhiễm môi trường ngay tại nơi mình sinh sống; tỷ lệ học sinh tham gia phong trào sáng tạo KHKT cấp thành phố đạt giải còn thấp.',
    solutionContent: 'Biên soạn tài liệu giáo dục địa phương về hiện trạng môi trường làng nghề Mẫn Xá; tổ chức cho học sinh tự lắp ráp các cảm biến bụi mịn PM2.5 nối mạch ESP32 để đo chất lượng không khí tại lớp học và khuôn viên trường; tổ chức Ngày hội STEM "Vì một Văn Môn xanh".',
    noveltyPoints: 'Gắn liền bài toán giáo dục STEM với chính vấn đề cấp bách của quê hương; học sinh được trải nghiệm thực tế từ khâu quan trắc đến đề xuất giải pháp xanh.',
    applicationCapacity: 'Áp dụng hiệu quả trong các trường THCS trên địa bàn thành phố Bắc Ninh, đặc biệt là các xã, phường ven khu công nghiệp và làng nghề.',
    economicBenefit: 'Chưa đủ dữ liệu định lượng để xác minh giá trị làm lợi về mặt tài chính (đây là đề tài giáo dục - nhân văn mang tính định tính cao).',
    economicDataVerified: false,
    socialBenefit: 'Học sinh đạt giải Ba cuộc thi KHKT cấp thành phố Bắc Ninh năm 2025; nâng cao nhận thức bảo vệ sức khỏe cho trên 650 học sinh và phụ huynh trong xã.',
    attachments: [
      {
        id: 'att-05',
        name: 'Giao_an_STEM_va_hinh_anh_san_pham.pdf',
        fileType: 'pdf',
        fileSize: '3.4 MB',
        uploadDate: '10/01/2026',
        category: 'report'
      }
    ],
    status: 'synthesizing',
    assignedEvaluatorIds: ['usr-president', 'usr-secretary', 'usr-eval1', 'usr-eval2'],
    createdAt: '2026-01-10T14:00:00Z',
    updatedAt: '2026-01-25T16:30:00Z'
  },
  {
    id: 'init-04',
    code: 'SK-2026-VM04',
    title: 'Quy trình đối chiếu số liệu và quản lý thu phí rác thải sinh hoạt qua mã QR tài khoản ngân hàng xã tại 5 thôn xã Văn Môn',
    author: 'Nguyễn Khắc Lâm',
    authorTitle: 'Công chức Tài chính - Kế toán',
    authorUnit: 'UBND xã Văn Môn, thành phố Bắc Ninh',
    authorDob: '1985',
    coAuthors: [],
    field: 'administrative_reform',
    year: 2026,
    executionPeriod: '03/2025 - 10/2025',
    applicationStartDate: '01/05/2025',
    applicationScope: 'Toàn bộ hộ gia đình tại 5 thôn: Ti Quan, Quan Đình, Phù Xá, Thâm Mẫn, Mẫn Xá',
    summary: 'Chuyển đổi hình thức thu tiền mặt phí vệ sinh môi trường thủ công bằng phiếu thu giấy sang thanh toán quét mã VietQR tự động định danh mã hộ gia đình, đối soát số liệu tự động bằng Google Sheets kết nối kế toán xã.',
    currentStatusBefore: 'Trưởng thôn và tổ thu gom phải đi từng nhà thu tiền mặt 30.000đ/tháng, thường xuyên thiếu hụt, tồn đọng nợ đọng kéo dài từ 3-6 tháng, tốn công kiểm đếm đối chiếu hóa đơn viết tay.',
    solutionContent: 'Cấp mã QR định danh cho từng hộ dán tại cửa nhà. Người dân thanh toán qua ứng dụng ngân hàng hoặc Viettel Money; hệ thống tự động gạch nợ trên sổ cái kế toán; báo cáo trực quan cho UBND xã trước ngày 25 hàng tháng.',
    noveltyPoints: 'Xóa bỏ việc thu tiền mặt trực tiếp; công khai minh bạch số tiền thu được theo từng thôn trên bảng tin điện tử xã.',
    applicationCapacity: 'Có thể áp dụng ngay cho các khoản thu quỹ nhân đạo, an ninh quốc phòng tại tất cả các xã, phường trong thành phố Bắc Ninh.',
    economicBenefit: 'Tiết kiệm 8 triệu đồng tiền in ấn biên lai giấy; tiết kiệm 120 ngày công thu gom đối chiếu của trưởng thôn; tỷ lệ thu đạt 96% (tăng 28% so với năm 2024).',
    economicDataVerified: true,
    socialBenefit: 'Tránh thất thoát quỹ công, tăng tính minh bạch tài chính của chính quyền xã, thúc đẩy thói quen không dùng tiền mặt ở nông thôn.',
    attachments: [
      {
        id: 'att-06',
        name: 'Ho_so_giai_phap_thu_phi_rac_thai_QR.docx',
        fileType: 'docx',
        fileSize: '950 KB',
        uploadDate: '12/01/2026',
        category: 'report'
      }
    ],
    status: 'recommended',
    assignedEvaluatorIds: ['usr-president', 'usr-secretary', 'usr-eval1', 'usr-eval3'],
    createdAt: '2026-01-12T09:15:00Z',
    updatedAt: '2026-01-28T11:00:00Z'
  }
];

export const INITIAL_SIMILARITY_REPORTS: Record<string, SimilarityReport> = {
  'init-01': {
    id: 'sim-01',
    initiativeId: 'init-01',
    overallPercent: 18.5,
    lexicalPercent: 12.0,
    semanticPercent: 22.4,
    solutionPercent: 14.2,
    processPercent: 16.0,
    highestSourceTitle: 'Đề tài Ứng dụng Zalo trong cải cách TTHC tại UBND thành phố Bắc Ninh (2024)',
    highestSourceMatchRate: 14.5,
    aiAnalysisSummary: 'Sáng kiến có mức độ tương đồng tổng thể 18.5%, chủ yếu nằm ở các căn cứ pháp lý quy định về Đề án 06 và thuật ngữ hành chính công chuẩn hóa ("bộ phận một cửa", "cổng dịch vụ công quốc gia", "xác thực định danh điện tử VNeID"). Phần giải pháp tạo mã QR động kết hợp Mini App phục vụ đặc thù địa bàn thôn nông thôn và người dân làng nghề xã Văn Môn thể hiện rõ tính độc lập, sáng tạo, không trùng lặp giải pháp.',
    confidenceScore: 94,
    analyzedAt: '2026-01-17T09:20:00Z',
    segments: [
      {
        id: 'seg-101',
        similarityType: 'legal_quote',
        similarityPercent: 92,
        suspectExcerpt: 'Căn cứ Quyết định số 06/QĐ-TTg ngày 06/01/2022 của Thủ tướng Chính phủ phê duyệt Đề án phát triển ứng dụng dữ liệu về dân cư, định danh và xác thực điện tử phục vụ chuyển đổi số quốc gia giai đoạn 2022 - 2025...',
        matchedSourceExcerpt: 'Thực hiện Quyết định số 06/QĐ-TTg ngày 06/01/2022 của Thủ tướng Chính phủ phê duyệt Đề án phát triển ứng dụng dữ liệu về dân cư, định danh và xác thực điện tử...',
        sourceDocName: 'Kế hoạch Chuyển đổi số tỉnh Bắc Ninh năm 2024',
        sourceAuthorOrOrg: 'UBND tỉnh Bắc Ninh',
        sourceType: 'legal_normative',
        isJustifiedOrLegal: true,
        councilNote: 'Trích dẫn căn cứ pháp lý Nhà nước theo đúng thể thức văn bản hành chính, không tính vào tỷ lệ sao chép trái phép.'
      },
      {
        id: 'seg-102',
        similarityType: 'semantic',
        similarityPercent: 34,
        suspectExcerpt: 'Xây dựng mã QR dán tại bàn tiếp nhận giúp người dân mở nhanh mẫu biểu nộp hồ sơ trực tuyến chỉ bằng điện thoại thông minh...',
        matchedSourceExcerpt: 'Niêm yết mã QR tại trụ sở ủy ban để người dân quét link truy cập trang dịch vụ công trực tuyến của thành phố...',
        sourceDocName: 'Sáng kiến SK-2024-BN08: Niêm yết mã QR hướng dẫn thủ tục tại thành phố Bắc Ninh',
        sourceAuthorOrOrg: 'Văn phòng HĐND & UBND thành phố Bắc Ninh',
        sourceType: 'district_province_database',
        isJustifiedOrLegal: false,
        councilNote: 'Có sự kế thừa ý tưởng dùng mã QR của thành phố, nhưng tác giả xã Văn Môn đã cải tiến thành QR động điền tự động dữ liệu và tích hợp Zalo Mini App riêng biệt.'
      }
    ]
  },
  'init-02': {
    id: 'sim-02',
    initiativeId: 'init-02',
    overallPercent: 21.0,
    lexicalPercent: 14.5,
    semanticPercent: 26.0,
    solutionPercent: 19.0,
    processPercent: 20.0,
    highestSourceTitle: 'Báo cáo kiểm soát ô nhiễm môi trường làng nghề nhôm Mẫn Xá - Sở TN&MT Bắc Ninh (2024)',
    highestSourceMatchRate: 17.0,
    aiAnalysisSummary: 'Tương đồng tập trung ở phần trích dẫn số liệu quan trắc không khí, thành phần hóa học bụi xỉ nhôm và các điều khoản xử phạt vi phạm hành chính theo Nghị định 45/2022/NĐ-CP. Giải pháp thành lập nhóm Zalo phản ứng nhanh 30 phút và bản đồ nhiệt định vị lò đốt ban đêm mang tính sáng tạo thực tiễn cao tại địa bàn Văn Môn.',
    confidenceScore: 91,
    analyzedAt: '2026-01-20T11:45:00Z',
    segments: [
      {
        id: 'seg-201',
        similarityType: 'legal_quote',
        similarityPercent: 88,
        suspectExcerpt: 'Căn cứ Nghị định số 45/2022/NĐ-CP ngày 07/7/2022 của Chính phủ quy định về xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường...',
        matchedSourceExcerpt: 'Áp dụng các chế tài xử phạt theo Nghị định số 45/2022/NĐ-CP của Chính phủ về bảo vệ môi trường...',
        sourceDocName: 'Tài liệu hướng dẫn thanh tra môi trường - Sở TNMT Bắc Ninh',
        sourceAuthorOrOrg: 'Sở TN&MT Bắc Ninh',
        sourceType: 'legal_normative',
        isJustifiedOrLegal: true,
        councilNote: 'Trích dẫn điều khoản luật quy định thẩm quyền xử phạt của Chủ tịch UBND cấp xã.'
      }
    ]
  }
};

export const INITIAL_SCORE_SHEETS: Record<string, EvaluatorScoreSheet[]> = {
  'init-01': [
    {
      id: 'sc-01-pres',
      initiativeId: 'init-01',
      evaluatorId: 'usr-president',
      evaluatorName: 'Mẫn Văn Tuấn',
      evaluatorTitle: 'Phó Chủ tịch UBND xã - Chủ tịch Hội đồng',
      scores: {
        'crit-a1': { criterionId: 'crit-a1', score: 18, comment: 'Sáng kiến có tính mới cao, giải quyết trúng điểm nghẽn chuyển đổi số tại xã.' },
        'crit-a2': { criterionId: 'crit-a2', score: 18, comment: 'Cải tiến quy trình thông minh, thân thiện với bà con nông dân và thợ đúc nhôm.' },
        'crit-b1': { criterionId: 'crit-b1', score: 14, comment: 'Đã triển khai thực tế 10 tháng, kết quả tăng tỷ lệ hồ sơ rõ rệt.' },
        'crit-b2': { criterionId: 'crit-b2', score: 9, comment: 'Hoàn toàn nhân rộng được cho các xã bạn trong thành phố Bắc Ninh.' },
        'crit-c1': { criterionId: 'crit-c1', score: 13, comment: 'Có số liệu tiết kiệm thời gian và kinh phí in ấn cụ thể, hợp lý.' },
        'crit-d1': { criterionId: 'crit-d1', score: 9, comment: 'Hiệu quả CCHC rất rõ, đứng top đầu thành phố Bắc Ninh.' },
        'crit-d2': { criterionId: 'crit-d2', score: 8, comment: 'Tác động xã hội tích cực, được nhân dân đồng tình.' }
      },
      totalScore: 89,
      noveltyScore: 36,
      applicabilityScore: 23,
      economicScore: 13,
      socialScore: 17,
      generalComment: 'Sáng kiến xuất sắc, áp dụng thực tế mang lại giá trị cao cho chính quyền xã Văn Môn. Đề nghị công nhận phạm vi cấp cơ sở và giới thiệu dự thi cấp huyện.',
      recommendation: 'recommended',
      isCompleted: true,
      submittedAt: '2026-01-22T10:15:00Z'
    },
    {
      id: 'sc-01-sec',
      initiativeId: 'init-01',
      evaluatorId: 'usr-secretary',
      evaluatorName: 'Nguyễn Đình Hùng',
      evaluatorTitle: 'Thư ký Hội đồng',
      scores: {
        'crit-a1': { criterionId: 'crit-a1', score: 17, comment: 'Không trùng lặp với các sáng kiến đã lưu trữ của huyện.' },
        'crit-a2': { criterionId: 'crit-a2', score: 17, comment: 'Ứng dụng Zalo Mini App rất sáng tạo và gần gũi.' },
        'crit-b1': { criterionId: 'crit-b1', score: 13, comment: 'Bảo đảm hồ sơ minh chứng đủ 32 TTHC áp dụng.' },
        'crit-b2': { criterionId: 'crit-b2', score: 8, comment: 'Dễ chuyển giao công nghệ.' },
        'crit-c1': { criterionId: 'crit-c1', score: 12, comment: 'Số liệu tiết kiệm thời gian đáng tin cậy.' },
        'crit-d1': { criterionId: 'crit-d1', score: 10, comment: 'Nâng cao sự hài lòng của công dân khi đến một cửa.' },
        'crit-d2': { criterionId: 'crit-d2', score: 8, comment: 'Phù hợp mục tiêu chính quyền số cấp xã.' }
      },
      totalScore: 85,
      noveltyScore: 34,
      applicabilityScore: 21,
      economicScore: 12,
      socialScore: 18,
      generalComment: 'Hồ sơ đầy đủ, minh chứng rõ ràng, đảm bảo quy định Điều lệ Sáng kiến.',
      recommendation: 'recommended',
      isCompleted: true,
      submittedAt: '2026-01-23T14:30:00Z'
    },
    {
      id: 'sc-01-ev1',
      initiativeId: 'init-01',
      evaluatorId: 'usr-eval1',
      evaluatorName: 'Trương Thị Nga',
      evaluatorTitle: 'Công chức Địa chính - Môi trường',
      scores: {
        'crit-a1': { criterionId: 'crit-a1', score: 16, comment: 'Tính mới tốt.' },
        'crit-a2': { criterionId: 'crit-a2', score: 17, comment: 'Giải pháp hay.' },
        'crit-b1': { criterionId: 'crit-b1', score: 14, comment: 'Đã triển khai đạt hiệu quả cao.' },
        'crit-b2': { criterionId: 'crit-b2', score: 9, comment: 'Khả thi cao.' },
        'crit-c1': { criterionId: 'crit-c1', score: 13, comment: 'Tiết kiệm chi phí rõ rệt.' },
        'crit-d1': { criterionId: 'crit-d1', score: 9, comment: 'Tốt.' },
        'crit-d2': { criterionId: 'crit-d2', score: 9, comment: 'Nâng cao hình ảnh chính quyền xã.' }
      },
      totalScore: 87,
      noveltyScore: 33,
      applicabilityScore: 23,
      economicScore: 13,
      socialScore: 18,
      generalComment: 'Đồng ý đề nghị công nhận sáng kiến cấp cơ sở.',
      recommendation: 'recommended',
      isCompleted: true,
      submittedAt: '2026-01-24T09:00:00Z'
    }
  ]
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-01-15T08:30:00Z',
    userId: 'usr-reception',
    userName: 'Trần Thị Thu Trang',
    userRole: 'Cán bộ tiếp nhận',
    action: 'TIẾP_NHẬN_HỒ_SƠ',
    targetId: 'init-01',
    targetType: 'Initiative',
    details: 'Tiếp nhận hồ sơ sáng kiến SK-2026-VM01, cấp mã hồ sơ điện tử tự động.'
  },
  {
    id: 'log-02',
    timestamp: '2026-01-17T09:25:00Z',
    userId: 'usr-secretary',
    userName: 'Nguyễn Đình Hùng',
    userRole: 'Thư ký Hội đồng',
    action: 'CHẠY_KIỂM_TRA_TRÙNG_LẶP_AI',
    targetId: 'init-01',
    targetType: 'SimilarityReport',
    details: 'Chạy phân tích tương đồng đa tầng NLP/Semantic. Kết quả: Tương đồng tổng thể 18.5%, không phát hiện sao chép giải pháp.'
  },
  {
    id: 'log-03',
    timestamp: '2026-01-18T10:00:00Z',
    userId: 'usr-president',
    userName: 'Mẫn Văn Tuấn',
    userRole: 'Chủ tịch Hội đồng',
    action: 'PHÂN_CÔNG_CHẤM_ĐỘC_LẬP',
    targetId: 'init-01',
    targetType: 'CouncilAssignment',
    details: 'Phân công 04 giám khảo chấm độc lập: Mẫn Văn Tuấn, Nguyễn Đình Hùng, Trương Thị Nga, Nguyễn Khắc Lâm.'
  },
  {
    id: 'log-04',
    timestamp: '2026-01-22T10:15:00Z',
    userId: 'usr-president',
    userName: 'Mẫn Văn Tuấn',
    userRole: 'Người chấm',
    action: 'HOÀN_TẤT_PHIẾU_CHẤM',
    targetId: 'init-01',
    targetType: 'EvaluatorScoreSheet',
    details: 'Đã hoàn thành phiếu chấm điểm độc lập cho sáng kiến SK-2026-VM01. Điểm tổng: 89/100.',
    newValue: '89.0'
  }
];
