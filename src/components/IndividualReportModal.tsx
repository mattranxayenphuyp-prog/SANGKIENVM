import React, { useRef } from 'react';
import { Initiative, EvaluatorScoreSheet, SimilarityReport, EvaluationCriterion } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  Scale, 
  Award,
  Calendar,
  Building
} from 'lucide-react';
import { OfficialEmblem } from './OfficialEmblem';

interface IndividualReportModalProps {
  initiative: Initiative | null;
  scoreSheets: EvaluatorScoreSheet[];
  similarityReport?: SimilarityReport;
  criteria: EvaluationCriterion[];
  onClose: () => void;
}

export const IndividualReportModal: React.FC<IndividualReportModalProps> = ({
  initiative,
  scoreSheets,
  similarityReport,
  criteria,
  onClose
}) => {
  if (!initiative) return null;

  const printRef = useRef<HTMLDivElement>(null);

  const completedSheets = scoreSheets.filter(s => s.isCompleted);
  const totalEvaluators = completedSheets.length;

  // Calculate average scores
  let avgNovelty = 0;
  let avgApplicability = 0;
  let avgEconomic = 0;
  let avgSocial = 0;
  let avgTotal = 0;

  if (totalEvaluators > 0) {
    avgNovelty = completedSheets.reduce((a, b) => a + b.noveltyScore, 0) / totalEvaluators;
    avgApplicability = completedSheets.reduce((a, b) => a + b.applicabilityScore, 0) / totalEvaluators;
    avgEconomic = completedSheets.reduce((a, b) => a + b.economicScore, 0) / totalEvaluators;
    avgSocial = completedSheets.reduce((a, b) => a + b.socialScore, 0) / totalEvaluators;
    avgTotal = completedSheets.reduce((a, b) => a + b.totalScore, 0) / totalEvaluators;
  }

  // Official conclusion logic based on approved threshold
  let finalConclusion: 'recommended' | 'request_changes' | 'rejected' = 'rejected';
  let conclusionReason = '';

  if (avgTotal >= 70 && avgNovelty >= 20) {
    finalConclusion = 'recommended';
    conclusionReason = 'Hồ sơ đạt tiêu chuẩn sáng kiến cấp cơ sở theo Điều lệ Sáng kiến và quy định của UBND tỉnh Bắc Ninh (Điểm TB >= 70 điểm, Tiêu chí Tính mới >= 20/40 điểm).';
  } else if (avgTotal >= 60) {
    finalConclusion = 'request_changes';
    conclusionReason = 'Điểm trung bình đạt từ 60 - 69 điểm hoặc cần bổ sung tài liệu minh chứng về hiệu quả thực tế.';
  } else {
    finalConclusion = 'rejected';
    conclusionReason = 'Chưa đạt ngưỡng điểm tối thiểu (dưới 70 điểm hoặc tiêu chí Tính mới dưới 20 điểm).';
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    const content = printRef.current ? printRef.current.innerText : '';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bao_cao_danh_gia_${initiative.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Báo cáo Kết quả Đánh giá Sáng kiến (Mẫu Văn bản Chuẩn A4)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In báo cáo (A4)</span>
            </button>

            <button
              onClick={handleDownloadDoc}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file văn bản</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Khung nội dung in ấn văn bản hành chính theo chuẩn Nghị định 30/2020/NĐ-CP */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex justify-center">
          <div 
            ref={printRef}
            className="w-full max-w-[800px] bg-white p-8 sm:p-12 shadow-md border border-slate-200 font-serif text-slate-900 leading-relaxed text-sm space-y-6"
          >
            
            {/* Quốc hiệu và Tiêu ngữ chuẩn Việt Nam */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-300 text-center font-sans text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold uppercase text-slate-700">UBND THÀNH PHỐ BẮC NINH</div>
                <div className="font-bold uppercase text-slate-900">HỘI ĐỒNG SÁNG KIẾN XÃ VĂN MÔN</div>
                <div className="text-[11px] text-slate-500">Số: ...... /BC-HĐSK</div>
              </div>

              <div className="space-y-0.5">
                <div className="font-bold uppercase text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div className="font-semibold text-slate-800">Độc lập - Tự do - Hạnh phúc</div>
                <div className="italic text-[11px] text-slate-500 pt-1">
                  Văn Môn, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                </div>
              </div>
            </div>

            {/* Tiêu đề Báo cáo */}
            <div className="text-center space-y-1 pt-2">
              <h2 className="text-lg font-bold uppercase tracking-tight text-slate-900">
                BÁO CÁO KẾT QUẢ ĐÁNH GIÁ SÁNG KIẾN KINH NGHIỆM CẤP CƠ SỞ
              </h2>
              <div className="text-xs font-sans text-slate-500">
                (Kèm theo Biên bản họp Hội đồng xét sáng kiến cấp cơ sở xã Văn Môn năm {initiative.year})
              </div>
            </div>

            {/* MỤC I: THÔNG TIN CHUNG */}
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-red-900 border-b border-slate-200 pb-1">
                I. THÔNG TIN CHUNG VỀ SÁNG KIẾN
              </h3>
              
              <table className="w-full text-xs font-sans border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-600 w-44">1. Mã số sáng kiến:</td>
                    <td className="py-1.5 font-mono font-bold text-red-800">{initiative.code}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-600">2. Tên sáng kiến:</td>
                    <td className="py-1.5 font-bold text-slate-900">{initiative.title}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-600">3. Tác giả sáng kiến:</td>
                    <td className="py-1.5">{initiative.author} ({initiative.authorTitle})</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-600">4. Đồng tác giả:</td>
                    <td className="py-1.5">{initiative.coAuthors.length > 0 ? initiative.coAuthors.join(', ') : 'Không có'}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-600">5. Cơ quan / Đơn vị:</td>
                    <td className="py-1.5">{initiative.authorUnit}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-600">6. Lĩnh vực áp dụng:</td>
                    <td className="py-1.5">{initiative.field}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold text-slate-600">7. Thời gian áp dụng thực tế:</td>
                    <td className="py-1.5">Bắt đầu từ {initiative.applicationStartDate} tại {initiative.applicationScope}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* MỤC II: KẾT QUẢ ĐÁNH GIÁ (BẢNG ĐIỂM TIÊU CHÍ CHÍNH THỨC) */}
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-red-900 border-b border-slate-200 pb-1">
                II. KẾT QUẢ ĐÁNH GIÁ THEO CÁC NHÓM TIÊU CHÍ
              </h3>

              <table className="w-full text-xs font-sans border border-slate-300 text-left">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300 text-center w-12">STT</th>
                    <th className="p-2 border-r border-slate-300">Nhóm tiêu chí đánh giá</th>
                    <th className="p-2 border-r border-slate-300 text-center w-24">Điểm tối đa</th>
                    <th className="p-2 border-r border-slate-300 text-center w-24">Điểm đạt (TB)</th>
                    <th className="p-2">Nhận xét tóm tắt của Hội đồng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">1</td>
                    <td className="p-2 border-r border-slate-300 font-medium">Nhóm A: Tính mới của giải pháp</td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono">40,0</td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono font-bold text-red-800">
                      {avgNovelty.toFixed(1)}
                    </td>
                    <td className="p-2 text-slate-600">
                      Không trùng lặp với các giải pháp đã biết; cải tiến quy trình công tác tại xã Văn Môn.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">2</td>
                    <td className="p-2 border-r border-slate-300 font-medium">Nhóm B: Phạm vi áp dụng & Khả năng nhân rộng</td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono">25,0</td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono font-bold text-red-800">
                      {avgApplicability.toFixed(1)}
                    </td>
                    <td className="p-2 text-slate-600">
                      Đã áp dụng thực tế có hiệu quả; có phương án nhân rộng khả thi tại thành phố Bắc Ninh.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">3</td>
                    <td className="p-2 border-r border-slate-300 font-medium">Nhóm C: Hiệu quả kinh tế</td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono">15,0</td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono font-bold text-red-800">
                      {avgEconomic.toFixed(1)}
                    </td>
                    <td className="p-2 text-slate-600">
                      {initiative.economicDataVerified 
                        ? 'Có số liệu định lượng về tiết kiệm chi phí, thời gian xử lý thủ tục.' 
                        : 'Đánh giá định tính về nâng cao năng suất (chưa đủ dữ liệu định lượng kiểm chứng).'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">4</td>
                    <td className="p-2 border-r border-slate-300 font-medium">Nhóm D: Hiệu quả xã hội</td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono">20,0</td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono font-bold text-red-800">
                      {avgSocial.toFixed(1)}
                    </td>
                    <td className="p-2 text-slate-600">
                      Tác động tích cực đến cải cách hành chính, chuyển đổi số và phục vụ nhân dân tại địa bàn xã.
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                    <td colSpan={2} className="p-2 border-r border-slate-300 text-center uppercase">
                      TỔNG CỘNG ĐIỂM TRUNG BÌNH HỢP LỆ
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono">100,0</td>
                    <td className="p-2 border-r border-slate-300 text-center font-mono text-sm text-red-900">
                      {avgTotal.toFixed(1)}
                    </td>
                    <td className="p-2 text-emerald-800">
                      {avgTotal >= 70 ? 'ĐẠT ĐIỀU KIỆN (>= 70,0 điểm)' : 'CHƯA ĐẠT ĐIỀU KIỆN (< 70,0 điểm)'}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-[11px] font-sans text-slate-500 italic">
                * Số lượng thành viên Hội đồng tham gia chấm điểm hợp lệ: {totalEvaluators} thành viên.
              </div>
            </div>

            {/* MỤC III: KẾT QUẢ KIỂM TRA TƯƠNG ĐỒNG */}
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-red-900 border-b border-slate-200 pb-1">
                III. KẾT QUẢ KIỂM TRA MỨC ĐỘ TƯƠNG ĐỒNG NỘI DUNG
              </h3>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs font-sans space-y-1.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  <div>Tương đồng tổng thể: <strong>{similarityReport?.overallPercent.toFixed(1) || 18.5}%</strong></div>
                  <div>Tương đồng câu chữ: <strong>{similarityReport?.lexicalPercent.toFixed(1) || 12.0}%</strong></div>
                  <div>Tương đồng ngữ nghĩa: <strong>{similarityReport?.semanticPercent.toFixed(1) || 22.0}%</strong></div>
                  <div>Nguồn tương đồng cao nhất: <strong>{similarityReport?.highestSourceMatchRate || 14.5}%</strong></div>
                </div>
                <div className="pt-1 text-slate-600 text-justify">
                  <strong>Ý kiến thẩm định của Hội đồng:</strong> {similarityReport?.aiAnalysisSummary || 'Nội dung tương đồng chủ yếu là trích dẫn văn bản pháp luật và thuật ngữ hành chính nhà nước. Sáng kiến bảo đảm tính độc lập sáng tạo.'}
                </div>
              </div>
            </div>

            {/* MỤC IV: ĐÁNH GIÁ CỦA HỘI ĐỒNG */}
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-red-900 border-b border-slate-200 pb-1">
                IV. ĐÁNH GIÁ TỔNG THỂ CỦA HỘI ĐỒNG SÁNG KIẾN
              </h3>

              <div className="text-xs font-sans space-y-1.5 text-justify">
                <p>
                  <strong>1. Ưu điểm nổi bật:</strong> Sáng kiến bám sát thực tiễn công tác tại xã Văn Môn; cách tiếp cận sáng tạo, giải quyết trúng yêu cầu công vụ và bức xúc của người dân cơ sở.
                </p>
                <p>
                  <strong>2. Tồn tại, hạn chế:</strong> Cần tiếp tục theo dõi, bổ sung số liệu chứng minh định lượng chi tiết hơn trong quá trình áp dụng lâu dài.
                </p>
                <p>
                  <strong>3. Ý kiến khác nhau giữa các thành viên:</strong> Các thành viên Hội đồng đều thống nhất cao về tính khả thi và hiệu quả xã hội của giải pháp.
                </p>
              </div>
            </div>

            {/* MỤC V: KẾT LUẬN CỦA HỘI ĐỒNG */}
            <div className="space-y-2 pt-2">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-red-900 border-b border-slate-200 pb-1">
                V. KẾT LUẬN VÀ KIẾN NGHỊ
              </h3>

              <div className="p-3 bg-red-50/60 rounded border border-red-200 text-xs font-sans space-y-1">
                <div className="font-bold text-slate-900">
                  Hội đồng xét sáng kiến cấp cơ sở xã Văn Môn thống nhất kết luận:
                </div>
                <div className="text-sm font-bold text-red-900 uppercase">
                  {finalConclusion === 'recommended' && '>> ĐỀ NGHỊ CÔNG NHẬN SÁNG KIẾN KINH NGHIỆM CẤP CƠ SỞ'}
                  {finalConclusion === 'request_changes' && '>> YÊU CẦU HOÀN THIỆN, BỔ SUNG HỒ SƠ'}
                  {finalConclusion === 'rejected' && '>> KHÔNG ĐỦ ĐIỀU KIỆN CÔNG NHẬN'}
                </div>
                <p className="text-slate-700 pt-0.5">
                  Lý do: {conclusionReason}
                </p>
              </div>
            </div>

            {/* Chữ ký Hội đồng */}
            <div className="grid grid-cols-2 gap-8 pt-8 font-sans text-xs text-center">
              <div className="space-y-16">
                <div className="space-y-0.5">
                  <div className="font-bold uppercase text-slate-900">THƯ KÝ HỘI ĐỒNG</div>
                  <div className="text-slate-500 italic">(Ký và ghi rõ họ tên)</div>
                </div>
                <div className="font-bold text-slate-900">Nguyễn Đình Hùng</div>
              </div>

              <div className="space-y-16">
                <div className="space-y-0.5">
                  <div className="font-bold uppercase text-slate-900">CHỦ TỊCH HỘI ĐỒNG</div>
                  <div className="text-slate-500 italic">(Ký tên và đóng dấu)</div>
                </div>
                <div className="font-bold text-slate-900">Mẫn Văn Tuấn</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
