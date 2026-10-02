import React, { useState } from 'react';
import { Initiative, InitiativeField, DocumentAttachment, User } from '../types';
import { 
  X, 
  FilePlus, 
  Paperclip, 
  Upload, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  User as UserIcon,
  Calendar,
  Sparkles,
  Download,
  FileText,
  FileSpreadsheet,
  Check,
  RefreshCw,
  Printer,
  ShieldCheck,
  Info
} from 'lucide-react';

interface InitiativeCreateModalProps {
  onClose: () => void;
  onCreate: (init: Initiative) => void;
  existingCount: number;
  currentUser?: User;
}

export const InitiativeCreateModal: React.FC<InitiativeCreateModalProps> = ({
  onClose,
  onCreate,
  existingCount,
  currentUser
}) => {
  const nextNum = (existingCount + 1).toString().padStart(2, '0');
  const [code, setCode] = useState(`SK-2026-VM${nextNum}`);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(currentUser?.role === 'author' ? currentUser.name : '');
  const [authorTitle, setAuthorTitle] = useState(currentUser?.role === 'author' ? currentUser.title : 'Công chức Văn hóa - Xã hội');
  const [authorUnit, setAuthorUnit] = useState(currentUser?.role === 'author' ? currentUser.department : 'UBND xã Văn Môn, thành phố Bắc Ninh');
  const [authorDob, setAuthorDob] = useState('1988');
  const [coAuthorsInput, setCoAuthorsInput] = useState('');
  const [field, setField] = useState<InitiativeField>('administrative_reform');
  const [executionPeriod, setExecutionPeriod] = useState('01/2025 - 12/2025');
  const [applicationStartDate, setApplicationStartDate] = useState('01/03/2025');
  const [applicationScope, setApplicationScope] = useState('Địa bàn xã Văn Môn, thành phố Bắc Ninh');
  const [summary, setSummary] = useState('');
  const [currentStatusBefore, setCurrentStatusBefore] = useState('');
  const [solutionContent, setSolutionContent] = useState('');
  const [noveltyPoints, setNoveltyPoints] = useState('');
  const [applicationCapacity, setApplicationCapacity] = useState('');
  const [economicBenefit, setEconomicBenefit] = useState('');
  const [economicDataVerified, setEconomicDataVerified] = useState(false);
  const [socialBenefit, setSocialBenefit] = useState('');
  const [pledgeChecked, setPledgeChecked] = useState(true);

  // AI Extraction state
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractSuccess, setExtractSuccess] = useState(false);

  // Electronic Receipt state after submission
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    receiptCode: string;
    submittedAt: string;
    initTitle: string;
    initAuthor: string;
    initUnit: string;
  } | null>(null);

  // Attachments list
  const [attachments, setAttachments] = useState<DocumentAttachment[]>([
    {
      id: `att-new-1`,
      name: `Mau_01_Don_yeu_cau_cong_nhan_${code}.docx`,
      fileType: 'docx',
      fileSize: '1.2 MB',
      uploadDate: new Date().toLocaleDateString('vi-VN'),
      category: 'report',
      extractedSnippet: 'Trích xuất tự động: Đơn yêu cầu công nhận sáng kiến cấp cơ sở theo Mẫu 01/SK Hướng dẫn 1603/HD-HĐSK tỉnh Bắc Ninh...'
    }
  ]);

  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'docx' | 'pdf' | 'xlsx' | 'image'>('docx');

  // Handle fake file addition or simulated real file selection
  const handleAddAttachment = () => {
    if (!newFileName.trim()) return;
    const extension = newFileName.split('.').pop()?.toLowerCase();
    const type: 'docx' | 'pdf' | 'xlsx' | 'image' = 
      extension === 'pdf' ? 'pdf' : 
      (extension === 'xlsx' || extension === 'xls' ? 'xlsx' : 
      (extension === 'jpg' || extension === 'png' ? 'image' : 'docx'));

    const newAtt: DocumentAttachment = {
      id: `att-new-${Date.now()}`,
      name: newFileName,
      fileType: type,
      fileSize: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      uploadDate: new Date().toLocaleDateString('vi-VN'),
      category: type === 'image' ? 'evidence' : 'report',
      extractedSnippet: `Trích xuất văn bản từ tệp ${newFileName}: Nội dung hồ sơ minh chứng, số liệu đo lường thực tế tại xã Văn Môn.`
    };
    setAttachments(prev => [...prev, newAtt]);
    setNewFileName('');
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      const type: 'docx' | 'pdf' | 'xlsx' | 'image' = 
        extension === 'pdf' ? 'pdf' : 
        (extension === 'xlsx' || extension === 'xls' ? 'xlsx' : 
        (extension === 'jpg' || extension === 'png' ? 'image' : 'docx'));

      const newAtt: DocumentAttachment = {
        id: `att-upload-${Date.now()}`,
        name: file.name,
        fileType: type,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toLocaleDateString('vi-VN'),
        category: 'evidence',
        extractedSnippet: `Đã nạp file ${file.name}. Sẵn sàng cho việc phân tích trích xuất dữ liệu tự động.`
      };
      setAttachments(prev => [...prev, newAtt]);
    }
  };

  // Helper to trigger download of official Word template
  const handleDownloadTemplate = (templateType: 'mau01' | 'mau02' | 'mau01_hqad') => {
    let content = '';
    let fileName = '';

    if (templateType === 'mau01') {
      fileName = 'Mau_01_SK_Don_yeu_cau_cong_nhan_sang_kien.doc';
      content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-------------------------
ĐƠN YÊU CẦU CÔNG NHẬN SÁNG KIẾN
(Ban hành kèm theo Hướng dẫn số 1603/HD-HĐSK ngày 19/8/2025 của Hội đồng Sáng kiến tỉnh Bắc Ninh)

Kính gửi: Hội đồng xét sáng kiến kinh nghiệm cấp cơ sở UBND xã Văn Môn, thành phố Bắc Ninh

1. Tác giả sáng kiến:
- Họ và tên: .....................................................................
- Ngày tháng năm sinh: ...........................................................
- Chức vụ, đơn vị công tác: .....................................................
- Tỷ lệ đóng góp tạo ra sáng kiến: 100%

2. Tên sáng kiến đề nghị công nhận:
.................................................................................

3. Lĩnh vực áp dụng:
[ ] Cải cách hành chính & Chuyển đổi số
[ ] Môi trường làng nghề & Xử lý chất thải
[ ] Giáo dục & Đào tạo
[ ] Y tế & An sinh xã hội
[ ] Nông nghiệp & Nông thôn mới

4. Thời gian bắt đầu áp dụng sáng kiến: ...........................................
5. Địa bàn áp dụng: Xã Văn Môn, thành phố Bắc Ninh.

Tôi xin cam đoan những thông tin kê khai trong đơn này là hoàn toàn đúng sự thật và sáng kiến không trùng lặp với bất kỳ giải pháp nào đã được công nhận trước đây.

                                    Văn Môn, ngày ..... tháng ..... năm 2026
                                                NGƯỜI NỘP ĐƠN
                                             (Ký và ghi rõ họ tên)`;
    } else if (templateType === 'mau02') {
      fileName = 'Mau_02_SK_Bao_cao_mo_ta_giai_phap_sang_kien.doc';
      content = `UBND XÃ VĂN MÔN, THÀNH PHỐ BẮC NINH
HỘI ĐỒNG XÉT SÁNG KIẾN CẤP CƠ SỞ
----------------------------------
BÁO CÁO MÔ TẢ GIẢI PHÁP SÁNG KIẾN
(Theo Hướng dẫn số 1603/HD-HĐSK tỉnh Bắc Ninh)

1. Tên sáng kiến: ...............................................................
2. Tác giả: .....................................................................
3. Tình trạng giải pháp đã biết (Thực trạng trước khi áp dụng):
- Ưu điểm: ......................................................................
- Nhược điểm, hạn chế cần khắc phục: ...........................................
4. Mục đích của giải pháp sáng kiến: ............................................
5. Bản chất của giải pháp mới:
- Nội dung chi tiết các bước thực hiện: .........................................
- Điểm mới, tính sáng tạo so với giải pháp trước đây: ...........................
6. Khả năng áp dụng và phạm vi nhân rộng: .......................................
7. Hiệu quả kinh tế, hiệu quả xã hội mang lại:
- Hiệu quả kinh tế: .............................................................
- Hiệu quả xã hội (cải cách hành chính, môi trường, phục vụ nhân dân): .........
8. Danh mục tài liệu, minh chứng kèm theo: ......................................`;
    } else {
      fileName = 'Mau_01_HQAD_Giay_xac_nhan_hieu_qua_ap_dung.doc';
      content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-------------------------
GIẤY XÁC NHẬN HIỆU QUẢ ÁP DỤNG SÁNG KIẾN
(Ban hành kèm theo Nghị định số 152/2025/NĐ-CP và Hướng dẫn 1603/HD-HĐSK)

Cơ quan/Đơn vị xác nhận: UBND XÃ VĂN MÔN, THÀNH PHỐ BẮC NINH

Xác nhận sáng kiến: .............................................................
Tác giả: .......................................................................
Đã được áp dụng chính thức tại: .................................................
Từ ngày: ....../....../...... đến nay.

KẾT QUẢ ÁP DỤNG THỰC TẾ:
1. Đã nâng cao chất lượng công tác chuyên môn, rút ngắn thời gian xử lý thủ tục.
2. Được cán bộ và nhân dân địa phương đánh giá cao.
3. Đủ điều kiện đề nghị Hội đồng xét sáng kiến cấp cơ sở nghiệm thu, công nhận.

                                    Văn Môn, ngày ..... tháng ..... năm 2026
                                      THỦ TRƯỞNG ĐƠN VỊ THỤ HƯỞNG
                                            (Ký tên, đóng dấu)`;
    }

    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Sample quick preset selection
  const loadPreset = (presetKey: 'cchc' | 'moitruong' | 'giaoduc') => {
    if (presetKey === 'cchc') {
      setTitle('Ứng dụng Trợ lý số Zalo OA hướng dẫn TTHC và số hóa hồ sơ chứng thực bản sao điện tử tại Bộ phận Một cửa xã Văn Môn');
      setAuthor('Trần Thị Thu Trang');
      setAuthorTitle('Công chức Văn phòng - Thống kê');
      setAuthorUnit('UBND xã Văn Môn, thành phố Bắc Ninh');
      setField('administrative_reform');
      setSummary('Giải pháp tích hợp mini-app trên Zalo OA của xã Văn Môn giúp người dân tra cứu thành phần hồ sơ, đặt lịch hẹn và hướng dẫn tạo tài khoản VNeID cấp độ 2 phục vụ nộp dịch vụ công trực tuyến.');
      setCurrentStatusBefore('Trước năm 2025, người dân xã Văn Môn (đặc biệt lao động sản xuất kim loại tại làng nghề Mẫn Xá) ít quen thuộc với Cổng DVC quốc gia; hồ sơ chứng thực giấy chiếm trên 85%, gây quá tải và kéo dài thời gian chờ đợi tại Một cửa.');
      setSolutionContent('Xây dựng kênh Zalo OA hành chính công xã Văn Môn, cung cấp mã QR hướng dẫn mẫu tờ khai tự động; lập tổ hỗ trợ thanh niên tình nguyện trực tiếp tại bộ phận Một cửa để số hóa hồ sơ chứng thực và trả kết quả bản sao điện tử có ký số chuyên dùng.');
      setNoveltyPoints('Lần đầu tiên tại cấp xã triển khai tra cứu trạng thái giải quyết hồ sơ qua tin nhắn Zalo ZNS tự động; chuyển đổi 100% việc cấp bản sao trích lục hộ tịch và chứng thực sang định dạng điện tử có mã QR xác thực.');
      setApplicationCapacity('Đã áp dụng thành công tại xã Văn Môn trong 8 tháng; có khả năng nhân rộng 100% cho 18 phường, xã thuộc địa bàn thành phố Bắc Ninh.');
      setEconomicBenefit('Tiết kiệm trung bình 45 triệu đồng tiền in ấn phôi giấy tờ và mực in mỗi năm; giảm 60% thời gian luân chuyển hồ sơ giữa các bộ phận chuyên môn.');
      setEconomicDataVerified(true);
      setSocialBenefit('Tỷ lệ hồ sơ trực tuyến tăng từ 24% lên 88%; 98.5% công dân và đại diện hộ kinh doanh tại Văn Môn bày tỏ mức độ rất hài lòng.');
    } else if (presetKey === 'moitruong') {
      setTitle('Mô hình Giám sát cộng đồng kết hợp camera cảm biến cảnh báo xả khói và phân loại xỉ nhôm tại làng nghề đúc Mẫn Xá, xã Văn Môn');
      setAuthor('Nguyễn Văn Tuấn');
      setAuthorTitle('Công chức Địa chính - Nông nghiệp - Xây dựng & Môi trường');
      setAuthorUnit('UBND xã Văn Môn, thành phố Bắc Ninh');
      setField('environment_craft_village');
      setSummary('Giải pháp kết hợp hệ thống camera giao thông - môi trường với đội phản ứng nhanh cơ sở tại thôn Mẫn Xá để kiểm soát việc tập kết xỉ thải nhôm không đúng nơi quy định.');
      setCurrentStatusBefore('Làng nghề Mẫn Xá có hàng trăm lò đúc nhôm thủ công phát sinh bụi khí và xỉ thải kim loại; việc kiểm tra của xã trước đây chủ yếu đi tuần thủ công không bao quát hết các khung giờ đêm.');
      setSolutionContent('Lắp đặt 06 cụm camera giám sát tại các nút giao huyết mạch ra vào bãi tập kết xỉ Mẫn Xá; thành lập nhóm công tác phản ứng nhanh trên không gian số tiếp nhận tin báo kèm tọa độ hình ảnh.');
      setNoveltyPoints('Áp dụng công nghệ giám sát hình ảnh kết hợp cơ chế huy động nhân dân tham gia tố giác hành vi đổ trộm xỉ thải qua ứng dụng phản ánh hiện trường.');
      setApplicationCapacity('Đã triển khai thử nghiệm hiệu quả tại thôn Mẫn Xá và cụm tiểu thủ công nghiệp làng nghề xã Văn Môn.');
      setEconomicBenefit('Giảm chi phí thuê phương tiện dọn dẹp điểm đổ trộm xỉ khoảng 80 triệu đồng/năm; nâng cao hiệu lực thu gom xử lý rác thải theo quy chuẩn.');
      setEconomicDataVerified(true);
      setSocialBenefit('Giảm 75% các vụ việc đổ trộm phế thải nhôm ban đêm; cải thiện rõ rệt chất lượng không khí khu dân cư và niềm tin của cử tri địa phương.');
    } else {
      setTitle('Phương pháp tổ chức dạy học STEM tích hợp công nghệ trí tuệ nhân tạo và giáo dục di sản quan họ tại Trường THCS Văn Môn');
      setAuthor('Nguyễn Thị Hoa');
      setAuthorTitle('Giáo viên môn Tin học - Khoa học tự nhiên');
      setAuthorUnit('Trường THCS Văn Môn, thành phố Bắc Ninh');
      setField('education_training');
      setSummary('Mô hình câu lạc bộ STEM ứng dụng công cụ AI tạo lập mô hình di sản văn hóa Kinh Bắc - Bắc Ninh và cảm biến đo lường nồng độ bụi không khí học đường.');
      setCurrentStatusBefore('Học sinh chủ yếu tiếp cận kiến thức lý thuyết trong sách giáo khoa, thiếu trải nghiệm thực hành chế tạo thiết bị gắn liền với đời sống thực tiễn làng nghề quê hương.');
      setSolutionContent('Biên soạn giáo án mở chuyên đề STEM cho học sinh lớp 8, 9; hướng dẫn các em lập trình mạch Arduino đo nhiệt độ và chất lượng không khí, ứng dụng AI hỗ trợ dựng infographic giới thiệu làng nghề và văn hóa Kinh Bắc.');
      setNoveltyPoints('Tích hợp liên môn Tin học - Hóa học - Lịch sử địa phương; đưa công nghệ số và cảm biến giá thành thấp vào thực hành học đường vùng nông thôn.');
      setApplicationCapacity('Đã áp dụng cho toàn bộ 480 học sinh khối 8, 9 tại Trường THCS Văn Môn; có thể chuyển giao rộng rãi cho các trường THCS trên toàn thành phố Bắc Ninh.');
      setEconomicBenefit('Tận dụng linh kiện điện tử tái sử dụng, tiết kiệm hàng chục triệu đồng mua thiết bị thí nghiệm nhập ngoại.');
      setEconomicDataVerified(false);
      setSocialBenefit('Kích thích tinh thần say mê sáng tạo của thanh thiếu niên Văn Môn; đạt 01 giải Nhì cuộc thi KHKT cấp thành phố năm học 2025 - 2026.');
    }
  };

  // Simulate AI text extraction from attached files
  const handleAIExtract = () => {
    setIsExtracting(true);
    setExtractSuccess(false);

    setTimeout(() => {
      if (!title) {
        setTitle('Giải pháp nâng cao hiệu quả giải quyết TTHC và quản lý môi trường tại UBND xã Văn Môn, thành phố Bắc Ninh');
      }
      if (!summary) {
        setSummary('Hồ sơ đã được trích xuất tự động qua công nghệ NLP và OCR: Tổng hợp quy trình cải tiến, minh chứng áp dụng thực tế và bảng đối chiếu hiệu quả tại xã Văn Môn.');
      }
      if (!noveltyPoints) {
        setNoveltyPoints('Trích xuất từ tệp đính kèm: Điểm mới gồm 3 nội dung chính: Tối ưu hóa chu trình phối hợp liên thông; Ứng dụng giải pháp số hóa dữ liệu cơ sở; Thiết lập cơ chế kiểm chứng độc lập.');
      }
      if (!applicationCapacity) {
        setApplicationCapacity('Giải pháp đã kiểm chứng áp dụng tại xã Văn Môn, hoàn toàn khả thi để nhân rộng cho các đơn vị sự nghiệp và cơ quan hành chính trên địa bàn thành phố Bắc Ninh.');
      }
      if (!socialBenefit) {
        setSocialBenefit('Rút ngắn thời gian xử lý thủ tục cho công dân, giảm chi phí văn phòng phẩm và tạo sự đồng thuận cao trong cộng đồng cư dân.');
      }
      setIsExtracting(false);
      setExtractSuccess(true);
    }, 900);
  };

  // Validate form
  const validateChecklist = [
    { label: 'Tên sáng kiến', valid: title.trim().length > 10 },
    { label: 'Tác giả & Đơn vị', valid: author.trim().length > 2 && authorUnit.trim().length > 3 },
    { label: 'Lĩnh vực & Phạm vi áp dụng', valid: !!field && applicationScope.trim().length > 5 },
    { label: 'Thực trạng trước áp dụng', valid: currentStatusBefore.trim().length > 20 || summary.trim().length > 20 },
    { label: 'Nội dung giải pháp & Điểm mới', valid: solutionContent.trim().length > 20 || noveltyPoints.trim().length > 20 },
    { label: 'Hiệu quả (Kinh tế / Xã hội)', valid: economicBenefit.trim().length > 10 || socialBenefit.trim().length > 10 },
    { label: 'Tài liệu đính kèm (Tối thiểu 1 tệp)', valid: attachments.length > 0 },
    { label: 'Cam kết tính trung thực', valid: pledgeChecked }
  ];

  const validCount = validateChecklist.filter(c => c.valid).length;
  const isFormFullyValid = validCount >= 7; // At least 7/8 key areas

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      alert('Vui lòng nhập tên sáng kiến và tác giả.');
      return;
    }

    const coAuthors = coAuthorsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newInitiative: Initiative = {
      id: `init-${Date.now()}`,
      code,
      title,
      author,
      authorTitle,
      authorUnit,
      authorDob,
      coAuthors,
      field,
      year: 2026,
      executionPeriod,
      applicationStartDate,
      applicationScope,
      summary: summary || title,
      currentStatusBefore: currentStatusBefore || 'Đang rà soát và thực hiện công tác quản lý chuyên môn theo quy trình hiện hành.',
      solutionContent: solutionContent || 'Nội dung giải pháp đổi mới, ứng dụng khoa học kỹ thuật và cải tiến quy trình nghiệp vụ.',
      noveltyPoints: noveltyPoints || 'Giải pháp chưa từng được công bố hoặc áp dụng tại địa phương trước thời điểm nộp đơn.',
      applicationCapacity: applicationCapacity || 'Có khả năng áp dụng và nhân rộng trong toàn thành phố Bắc Ninh.',
      economicBenefit: economicBenefit || 'Chưa đủ dữ liệu định lượng để xác minh giá trị làm lợi bằng tiền. Đánh giá theo hiệu quả định tính.',
      economicDataVerified,
      socialBenefit: socialBenefit || 'Góp phần nâng cao năng lực phục vụ, cải cách hành chính và tạo hiệu ứng xã hội tích cực.',
      attachments,
      status: 'submitted', // Trạng thái 'Đã nộp'
      assignedEvaluatorIds: ['usr-president', 'usr-secretary', 'usr-eval1', 'usr-eval2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Set submitted receipt
    const receipt = {
      receiptCode: `BN-2026-VM-${nextNum}`,
      submittedAt: new Date().toLocaleString('vi-VN'),
      initTitle: title,
      initAuthor: author,
      initUnit: authorUnit
    };

    onCreate(newInitiative);
    setSubmittedReceipt(receipt);
  };

  // If already submitted and showing receipt
  if (submittedReceipt) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Nộp Hồ Sơ Sáng Kiến Thành Công!
                </h3>
                <p className="text-xs text-slate-500">
                  Hồ sơ đã được tiếp nhận vào Hệ thống Hội đồng xét sáng kiến cấp cơ sở
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Official Electronic Receipt Card */}
          <div className="p-5 bg-gradient-to-b from-amber-50/50 to-slate-50 rounded-lg border border-amber-200/80 space-y-3 font-sans">
            <div className="text-center space-y-0.5 border-b border-amber-200 pb-3">
              <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider">
                UBND XÃ VĂN MÔN, THÀNH PHỐ BẮC NINH
              </span>
              <h4 className="text-sm font-bold text-slate-900 uppercase">
                GIẤY BIÊN NHẬN HỒ SƠ ĐIỆN TỬ
              </h4>
              <p className="text-[11px] text-slate-500">
                (Bộ phận Tiếp nhận và Trả kết quả - Một cửa xã Văn Môn)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-500">Mã tiếp nhận hồ sơ:</span>
                <p className="font-mono font-bold text-red-800 text-sm">{submittedReceipt.receiptCode}</p>
              </div>
              <div>
                <span className="text-slate-500">Thời gian tiếp nhận:</span>
                <p className="font-semibold text-slate-800">{submittedReceipt.submittedAt}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Tên sáng kiến:</span>
                <p className="font-bold text-slate-900">{submittedReceipt.initTitle}</p>
              </div>
              <div>
                <span className="text-slate-500">Tác giả nộp:</span>
                <p className="font-semibold text-slate-800">{submittedReceipt.initAuthor}</p>
              </div>
              <div>
                <span className="text-slate-500">Đơn vị công tác:</span>
                <p className="font-semibold text-slate-800">{submittedReceipt.initUnit}</p>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Trạng thái: ĐÃ NỘP & CHỜ KIỂM TRA ĐIỀU KIỆN</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Thư ký Hội đồng và Cán bộ Một cửa sẽ kiểm tra tính hợp thức của các thành phần hồ sơ trong vòng 03 ngày làm việc.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>In Giấy biên nhận</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              Hoàn tất & Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full my-6 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-900 via-red-800 to-slate-900 text-white shrink-0 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/20">
                UBND XÃ VĂN MÔN, THÀNH PHỐ BẮC NINH
              </span>
              <span className="text-xs text-white/70">· Mẫu 01/SK & 02/SK</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Tải Nộp Hồ Sơ Sáng Kiến Mới (Trực Tuyến)
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
              Nộp hồ sơ trực tuyến theo Hướng dẫn số 1603/HD-HĐSK tỉnh Bắc Ninh. 
              Hệ thống tự động trích xuất thông tin, kiểm tra tính đầy đủ của 17 trường quy định và cấp mã biên nhận điện tử.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: Download Official Form Templates & Test Presets */}
        <div className="bg-amber-50/70 border-b border-amber-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Download Official Forms */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-red-700" />
              <span>Tải biểu mẫu chuẩn (Word):</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleDownloadTemplate('mau01')}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-medium shadow-2xs hover:border-red-500 transition-colors flex items-center gap-1"
                title="Tải Mẫu 01/SK: Đơn yêu cầu công nhận sáng kiến"
              >
                <FileText className="w-3 h-3 text-red-600" />
                <span>Mẫu 01/SK (Đơn)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadTemplate('mau02')}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-medium shadow-2xs hover:border-red-500 transition-colors flex items-center gap-1"
                title="Tải Mẫu 02/SK: Báo cáo mô tả sáng kiến"
              >
                <FileText className="w-3 h-3 text-red-600" />
                <span>Mẫu 02/SK (Báo cáo)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadTemplate('mau01_hqad')}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-medium shadow-2xs hover:border-red-500 transition-colors flex items-center gap-1"
                title="Tải Mẫu 01/HQAD: Giấy xác nhận hiệu quả áp dụng"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Mẫu 01/HQAD</span>
              </button>
            </div>
          </div>

          {/* Quick preset selector for fast realistic test */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 hidden sm:inline">Điền mẫu nhanh:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => loadPreset('cchc')}
                className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-800 rounded font-medium text-[11px] transition-colors"
                title="Nạp dữ liệu mẫu Sáng kiến CCHC & Một cửa"
              >
                Mẫu CCHC xã
              </button>
              <button
                type="button"
                onClick={() => loadPreset('moitruong')}
                className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-medium text-[11px] transition-colors"
                title="Nạp dữ liệu mẫu Môi trường làng nghề Mẫn Xá"
              >
                Mẫu Làng nghề
              </button>
              <button
                type="button"
                onClick={() => loadPreset('giaoduc')}
                className="px-2 py-0.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded font-medium text-[11px] transition-colors"
                title="Nạp dữ liệu mẫu Đổi mới GD STEM Trường THCS"
              >
                Mẫu THCS
              </button>
            </div>
          </div>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* UPLOAD & AI EXTRACT ZONE */}
          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-red-700" />
                  <span>Khu vực Tải Lên Hồ Sơ (Word, PDF, Excel, Ảnh Minh Chứng)</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Kéo thả hoặc bấm chọn tệp để tải hồ sơ. Hệ thống hỗ trợ trích xuất thông tin tự động để điền vào các mục bên dưới.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors">
                  <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                  <span>Chọn tệp tải lên</span>
                  <input
                    type="file"
                    multiple
                    accept=".doc,.docx,.pdf,.xls,.xlsx,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleSimulatedFileUpload}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleAIExtract}
                  disabled={isExtracting}
                  className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Tự động phân tích các tệp đính kèm và điền dữ liệu"
                >
                  {isExtracting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>{isExtracting ? 'Đang trích xuất...' : 'Trích xuất bằng AI'}</span>
                </button>
              </div>
            </div>

            {extractSuccess && (
              <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Trích xuất hoàn tất! Hệ thống đã tự động phân loại và điền thông tin tóm tắt, điểm mới và khả năng áp dụng.</span>
              </div>
            )}

            {/* Attachments List */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-600">
                Danh sách tài liệu đã đính kèm ({attachments.length} tệp):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attachments.map((att) => (
                  <div key={att.id} className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {att.fileType === 'docx' ? (
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : att.fileType === 'pdf' ? (
                        <FileText className="w-4 h-4 text-red-600 shrink-0" />
                      ) : (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <div className="truncate">
                        <p className="font-medium text-slate-800 truncate">{att.name}</p>
                        <p className="text-[10px] text-slate-400">{att.fileSize} · {att.uploadDate}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Xóa tệp"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add manual attachment name */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Hoặc nhập tên tệp bổ sung (VD: Bien_ban_hop_hoi_dong_co_so.pdf)..."
                  className="flex-1 px-3 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAttachment(); } }}
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded transition-colors"
                >
                  Thêm tệp
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 1: HÀNH CHÍNH & TÁC GIẢ */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-xs font-bold">1</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Thông Tin Hành Chính, Tác Giả & Đơn Vị Đề Nghị
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Mã sáng kiến (Tự động cấp):</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-red-800"
                  required
                />
              </div>

              <div className="space-y-1 lg:col-span-2">
                <label className="font-semibold text-slate-700 flex items-center gap-1">
                  <span>Tên sáng kiến:</span>
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Đổi mới quy trình tiếp nhận hồ sơ trực tuyến..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-medium focus:ring-1 focus:ring-red-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1">
                  <span>Tác giả chính:</span>
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Họ và tên tác giả"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Chức vụ tác giả:</label>
                <input
                  type="text"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Năm sinh tác giả:</label>
                <input
                  type="text"
                  value={authorDob}
                  onChange={(e) => setAuthorDob(e.target.value)}
                  placeholder="1990"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-700">Cơ quan / Đơn vị công tác:</label>
                <input
                  type="text"
                  value={authorUnit}
                  onChange={(e) => setAuthorUnit(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Đồng tác giả (ngăn cách bằng dấu phẩy):</label>
                <input
                  type="text"
                  value={coAuthorsInput}
                  onChange={(e) => setCoAuthorsInput(e.target.value)}
                  placeholder="Nguyễn Văn A, Trần Thị B..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Lĩnh vực áp dụng:</label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value as InitiativeField)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                >
                  <option value="administrative_reform">Cải cách hành chính & Chuyển đổi số</option>
                  <option value="environment_craft_village">Môi trường làng nghề Mẫn Xá</option>
                  <option value="education_training">Giáo dục và Đào tạo</option>
                  <option value="health_social">Y tế & An sinh xã hội</option>
                  <option value="agriculture_rural">Nông nghiệp & Xây dựng NTM</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Thời gian thực hiện:</label>
                <input
                  type="text"
                  value={executionPeriod}
                  onChange={(e) => setExecutionPeriod(e.target.value)}
                  placeholder="01/2025 - 12/2025"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Thời điểm bắt đầu áp dụng:</label>
                <input
                  type="text"
                  value={applicationStartDate}
                  onChange={(e) => setApplicationStartDate(e.target.value)}
                  placeholder="01/03/2025"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <label className="font-semibold text-slate-700">Địa bàn / Đơn vị áp dụng:</label>
                <input
                  type="text"
                  value={applicationScope}
                  onChange={(e) => setApplicationScope(e.target.value)}
                  placeholder="Địa bàn xã Văn Môn, thành phố Bắc Ninh..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: THUYẾT MINH NỘI DUNG & TÍNH MỚI */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Bản Chất Giải Pháp & Tính Mới (Mẫu 02/SK)
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tóm tắt sáng kiến (150 - 250 từ):</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn mục tiêu, nội dung chính và kết quả nổi bật của sáng kiến..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Thực trạng trước khi áp dụng giải pháp (Ưu & Nhược điểm):</label>
                <textarea
                  rows={2}
                  value={currentStatusBefore}
                  onChange={(e) => setCurrentStatusBefore(e.target.value)}
                  placeholder="Mô tả khó khăn, bất cập, hạn chế của cách làm truyền thống trước khi có sáng kiến..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Nội dung giải pháp đề nghị công nhận:</label>
                <textarea
                  rows={3}
                  value={solutionContent}
                  onChange={(e) => setSolutionContent(e.target.value)}
                  placeholder="Mô tả cụ thể các bước thực hiện, quy trình, mô hình, giải pháp công nghệ hoặc biện pháp quản lý mới..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 text-red-800 flex items-center gap-1">
                  <span>Điểm mới của giải pháp (Yếu tố cốt lõi để Hội đồng đánh giá tính mới):</span>
                  <span className="text-red-600 font-bold">*</span>
                </label>
                <textarea
                  rows={2}
                  value={noveltyPoints}
                  onChange={(e) => setNoveltyPoints(e.target.value)}
                  placeholder="Chỉ rõ điểm cải tiến, điểm khác biệt đột phá so với các giải pháp đã biết trong toàn thành phố Bắc Ninh..."
                  className="w-full px-3 py-1.5 bg-white border border-red-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: KHẢ NĂNG ÁP DỤNG & HIỆU QUẢ */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-xs font-bold">3</span>
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Khả Năng Áp Dụng, Nhân Rộng & Hiệu Quả Mang Lại
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Khả năng áp dụng và nhân rộng:</label>
                <textarea
                  rows={2}
                  value={applicationCapacity}
                  onChange={(e) => setApplicationCapacity(e.target.value)}
                  placeholder="Minh chứng sáng kiến đã áp dụng thực tế và điều kiện cần thiết để nhân rộng sang các thôn, trường học hoặc xã bạn..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800">Hiệu quả kinh tế (Tiết kiệm chi phí, thời gian):</label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={economicDataVerified}
                      onChange={(e) => setEconomicDataVerified(e.target.checked)}
                      className="rounded text-red-700 focus:ring-red-600"
                    />
                    <span>Đã có số liệu định lượng xác minh bằng chứng từ</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={economicBenefit}
                  onChange={(e) => setEconomicBenefit(e.target.value)}
                  placeholder="Số tiền làm lợi, số giờ công tiết kiệm (Nếu chưa đủ dữ liệu định lượng phải ghi rõ 'Chưa đủ dữ liệu định lượng để xác minh')..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Hiệu quả xã hội (Cải cách hành chính, môi trường, an sinh):</label>
                <textarea
                  rows={2}
                  value={socialBenefit}
                  onChange={(e) => setSocialBenefit(e.target.value)}
                  placeholder="Tác động đến sự hài lòng của công dân, bảo vệ môi trường, giảm thiểu khiếu nại, nâng cao chất lượng đời sống..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: CAM KẾT & KIỂM TRA ĐIỀU KIỆN */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Kiểm Tra Điều Kiện & Tính Hợp Lệ Của Hồ Sơ ({validCount}/8 Tiêu Chí)</span>
            </span>

            {/* Checklist items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              {validateChecklist.map((c, idx) => (
                <div 
                  key={idx} 
                  className={`p-2 rounded border flex items-center gap-1.5 ${
                    c.valid ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                >
                  {c.valid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  )}
                  <span className="truncate">{c.label}</span>
                </div>
              ))}
            </div>

            {/* Pledge Checkbox */}
            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={pledgeChecked}
                  onChange={(e) => setPledgeChecked(e.target.checked)}
                  className="mt-0.5 rounded text-red-700 focus:ring-red-600"
                />
                <span className="leading-snug">
                  <strong>Cam kết tính trung thực:</strong> Tôi/Chúng tôi xin cam đoan giải pháp mô tả trong hồ sơ này là do tôi/chúng tôi tự nghiên cứu, cải tiến và sáng tạo ra; không sao chép trái phép bất kỳ công trình, giải pháp nào đã được cấp thẩm quyền công nhận trước đó; sẵn sàng chịu trách nhiệm trước pháp luật và Hội đồng sáng kiến cấp cơ sở.
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              Cơ quan tiếp nhận: <strong>UBND xã Văn Môn, thành phố Bắc Ninh</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={!isFormFullyValid}
                className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-md shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <FilePlus className="w-4 h-4" />
                <span>Nộp Hồ Sơ Sáng Kiến Chính Thức</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
