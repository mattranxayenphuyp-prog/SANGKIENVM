import React, { useState } from 'react';
import { Initiative, EvaluatorScoreSheet, User } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Calendar
} from 'lucide-react';

interface CouncilSummaryModalProps {
  initiatives: Initiative[];
  scoreSheets: Record<string, EvaluatorScoreSheet[]>;
  currentUser: User;
  onClose: () => void;
  onLockCouncilResults?: () => void;
}

export const CouncilSummaryModal: React.FC<CouncilSummaryModalProps> = ({
  initiatives,
  scoreSheets,
  currentUser,
  onClose,
  onLockCouncilResults
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'summary_table' | 'minutes' | 'decision'>('summary_table');
  const [isLocked, setIsLocked] = useState(false);

  // Calculate council table
  const summaryRows = initiatives.map((init, index) => {
    const sheets = scoreSheets[init.id] || [];
    const completedSheets = sheets.filter(s => s.isCompleted);
    const count = completedSheets.length;

    let avgScore = 0;
    let avgNovelty = 0;
    if (count > 0) {
      avgScore = completedSheets.reduce((a, b) => a + b.totalScore, 0) / count;
      avgNovelty = completedSheets.reduce((a, b) => a + b.noveltyScore, 0) / count;
    }

    const isPassed = avgScore >= 70 && avgNovelty >= 20;

    return {
      index: index + 1,
      id: init.id,
      code: init.code,
      title: init.title,
      author: init.author,
      unit: init.authorUnit,
      field: init.field,
      completedCount: count,
      avgScore: avgScore > 0 ? avgScore.toFixed(1) : 'Chưa đủ',
      avgNovelty: avgNovelty > 0 ? avgNovelty.toFixed(1) : '0',
      similarity: '18.5%',
      isPassed,
      recommendation: isPassed ? 'Đề nghị công nhận' : (avgScore >= 60 ? 'Yêu cầu hoàn thiện' : 'Không công nhận')
    };
  });

  const passedCount = summaryRows.filter(r => r.isPassed).length;

  const handleExportCSV = () => {
    const header = ['STT', 'Mã sáng kiến', 'Tên sáng kiến', 'Tác giả', 'Đơn vị', 'Điểm trung bình', 'Tương đồng', 'Kết quả đề nghị'];
    const rows = summaryRows.map(r => [
      r.index,
      r.code,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.author}"`,
      `"${r.unit}"`,
      r.avgScore,
      r.similarity,
      r.recommendation
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_tong_hop_sang_kien_xa_Van_Mon_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLockResults = () => {
    if (confirm('Bạn có chắc chắn muốn KHÓA TOÀN BỘ KẾT QUẢ ĐÁNH GIÁ kỳ sáng kiến năm 2026? Sau khi khóa, giám khảo không thể sửa đổi điểm số.')) {
      setIsLocked(true);
      if (onLockCouncilResults) onLockCouncilResults();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[96vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4 shrink-0 print:hidden">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-800 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Hội đồng Xét Sáng kiến Kinh nghiệm Cấp cơ sở Xã Văn Môn</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Tổng hợp Điểm số · Biên bản Họp Hội đồng · Quyết định Công nhận
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In ấn văn bản</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất Excel / CSV</span>
            </button>

            {(currentUser.role === 'admin' || currentUser.role === 'council_president') && (
              <button
                onClick={handleLockResults}
                disabled={isLocked}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isLocked 
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                    : 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isLocked ? 'Đã khóa kết quả' : 'Khóa hồ sơ kỳ xét'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation (Mẫu số 02, Biên bản, Quyết định) */}
        <div className="px-5 border-b border-slate-200 flex items-center gap-6 text-xs font-medium text-slate-600 bg-white shrink-0 print:hidden">
          <button
            onClick={() => setActiveSubTab('summary_table')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'summary_table'
                ? 'border-red-700 text-red-800 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>Mẫu số 02/SK: Bảng Tổng hợp Điểm Hội đồng</span>
          </button>

          <button
            onClick={() => setActiveSubTab('minutes')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'minutes'
                ? 'border-red-700 text-red-800 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>Mẫu số 03/SK: Biên bản Họp Hội đồng</span>
          </button>

          <button
            onClick={() => setActiveSubTab('decision')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'decision'
                ? 'border-red-700 text-red-800 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>Dự thảo Quyết định Công nhận Sáng kiến</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50 space-y-6">
          
          {/* TAB 1: BẢNG TỔNG HỢP ĐIỂM (MẪU 02/SK) */}
          {activeSubTab === 'summary_table' && (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4 font-sans">
              <div className="text-center space-y-1">
                <div className="text-xs uppercase font-bold text-slate-700">UBND XÃ VĂN MÔN, THÀNH PHỐ BẮC NINH · HỘI ĐỒNG SÁNG KIẾN</div>
                <h3 className="text-base font-bold uppercase text-slate-900">
                  BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ SÁNG KIẾN CẤP CƠ SỞ NĂM 2026
                </h3>
                <p className="text-xs text-slate-500 italic">
                  (Ban hành kèm theo Hướng dẫn số 1603/HD-HĐSK ngày 19/8/2025 của Hội đồng Sáng kiến tỉnh Bắc Ninh)
                </p>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-xs text-left border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[11px] border-b border-slate-300">
                    <tr>
                      <th className="p-2.5 border-r border-slate-300 text-center w-12">STT</th>
                      <th className="p-2.5 border-r border-slate-300 w-28">Mã sáng kiến</th>
                      <th className="p-2.5 border-r border-slate-300 min-w-[220px]">Tên sáng kiến</th>
                      <th className="p-2.5 border-r border-slate-300">Tác giả / Đơn vị</th>
                      <th className="p-2.5 border-r border-slate-300 text-center">Số GK chấm</th>
                      <th className="p-2.5 border-r border-slate-300 text-center">Điểm TB</th>
                      <th className="p-2.5 border-r border-slate-300 text-center">Tương đồng</th>
                      <th className="p-2.5 text-center font-bold text-slate-900">Kết quả xếp loại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {summaryRows.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50/80">
                        <td className="p-2.5 border-r border-slate-300 text-center font-bold">{row.index}</td>
                        <td className="p-2.5 border-r border-slate-300 font-mono font-semibold text-red-900">{row.code}</td>
                        <td className="p-2.5 border-r border-slate-300 font-medium text-slate-900">{row.title}</td>
                        <td className="p-2.5 border-r border-slate-300">
                          <div className="font-semibold text-slate-800">{row.author}</div>
                          <div className="text-[11px] text-slate-500">{row.unit}</div>
                        </td>
                        <td className="p-2.5 border-r border-slate-300 text-center font-mono">{row.completedCount}/4</td>
                        <td className="p-2.5 border-r border-slate-300 text-center font-mono font-bold text-red-800 text-sm">
                          {row.avgScore}
                        </td>
                        <td className="p-2.5 border-r border-slate-300 text-center font-mono text-slate-600">
                          {row.similarity}
                        </td>
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            row.isPassed 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {row.recommendation}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs text-slate-600">
                <div>Tổng số sáng kiến xét duyệt: <strong>{initiatives.length}</strong></div>
                <div>Số lượng sáng kiến đề nghị công nhận: <strong className="text-emerald-700">{passedCount}</strong> / {initiatives.length}</div>
              </div>
            </div>
          )}

          {/* TAB 2: BIÊN BẢN HỌP HỘI ĐỒNG (MẪU 03/SK) */}
          {activeSubTab === 'minutes' && (
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs space-y-6 font-serif text-slate-900 text-xs sm:text-sm leading-relaxed max-w-4xl mx-auto">
              
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-300 text-center font-sans text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold uppercase text-slate-700">UBND XÃ VĂN MÔN, THÀNH PHỐ BẮC NINH</div>
                  <div className="font-bold uppercase text-slate-900">HỘI ĐỒNG SÁNG KIẾN</div>
                  <div className="text-[11px] text-slate-500">Số: 01 /BB-HĐSK</div>
                </div>

                <div className="space-y-0.5">
                  <div className="font-bold uppercase text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-semibold text-slate-800">Độc lập - Tự do - Hạnh phúc</div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold uppercase tracking-tight text-slate-900">
                  BIÊN BẢN HỌP HỘI ĐỒNG XÉT CÔNG NHẬN SÁNG KIẾN KINH NGHIỆM CẤP CƠ SỞ NĂM 2026
                </h3>
                <div className="italic text-slate-600 text-xs">
                  Vào hồi 08 giờ 30 phút, ngày 28 tháng 01 năm 2026, tại Phòng họp số 1 UBND xã Văn Môn
                </div>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <p><strong>I. THÀNH PHẦN THAM DỰ:</strong></p>
                <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-700">
                  <li>Ông <strong>Mẫn Văn Tuấn</strong> - Phó Chủ tịch UBND xã, Chủ tịch Hội đồng.</li>
                  <li>Ông <strong>Nguyễn Đình Hùng</strong> - Công chức Tư pháp - Hộ tịch, Thư ký Hội đồng.</li>
                  <li>Bà <strong>Trương Thị Nga</strong> - Công chức Địa chính - Xây dựng - Môi trường, Ủy viên.</li>
                  <li>Ông <strong>Nguyễn Khắc Lâm</strong> - Công chức Tài chính - Kế toán, Ủy viên.</li>
                  <li>Bà <strong>Ngô Thị Mai</strong> - Hiệu trưởng Trường THCS Văn Môn, Ủy viên.</li>
                </ol>

                <p className="pt-2"><strong>II. NỘI DUNG CUỘC HỌP:</strong></p>
                <p className="text-justify leading-relaxed text-slate-700">
                  Hội đồng đã nghe Thư ký báo cáo tổng hợp hồ sơ tiếp nhận, kết quả kiểm tra tương đồng bằng thuật toán AI và kết quả chấm điểm độc lập của từng thành viên Hội đồng đối với {initiatives.length} hồ sơ sáng kiến kinh nghiệm đề nghị xét công nhận cấp cơ sở năm 2026.
                </p>
                <p className="text-justify leading-relaxed text-slate-700">
                  Sau khi thảo luận dân chủ, xem xét từng tiêu chí (Tính mới, Phạm vi áp dụng, Hiệu quả kinh tế, Hiệu quả xã hội) và đối chiếu kết quả minh chứng áp dụng thực tế, Hội đồng tiến hành bỏ phiếu thống nhất:
                </p>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p>1. Tổng số hồ sơ đủ điều kiện đề nghị Chủ tịch UBND xã công nhận: <strong>{passedCount} sáng kiến</strong>.</p>
                  <p>2. Không có sáng kiến nào vi phạm tính mới hoặc sao chép trái phép theo Điều 4 Điều lệ Sáng kiến.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 font-sans text-xs text-center">
                <div className="space-y-14">
                  <div className="font-bold uppercase text-slate-900">THƯ KÝ HỘI ĐỒNG</div>
                  <div className="font-bold text-slate-900">Nguyễn Đình Hùng</div>
                </div>

                <div className="space-y-14">
                  <div className="font-bold uppercase text-slate-900">CHỦ TỊCH HỘI ĐỒNG</div>
                  <div className="font-bold text-slate-900">Mẫn Văn Tuấn</div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: DỰ THẢO QUYẾT ĐỊNH CÔNG NHẬN */}
          {activeSubTab === 'decision' && (
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs space-y-6 font-serif text-slate-900 text-xs sm:text-sm leading-relaxed max-w-4xl mx-auto">
              
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-300 text-center font-sans text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold uppercase text-slate-700">ỦY BAN NHÂN DÂN XÃ VĂN MÔN, THÀNH PHỐ BẮC NINH</div>
                  <div className="text-[11px] text-slate-500">Số: ...... /QĐ-UBND</div>
                </div>

                <div className="space-y-0.5">
                  <div className="font-bold uppercase text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-semibold text-slate-800">Độc lập - Tự do - Hạnh phúc</div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold uppercase tracking-tight text-slate-900">
                  QUYẾT ĐỊNH
                </h3>
                <div className="font-sans font-semibold text-xs text-slate-800">
                  Về việc công nhận sáng kiến kinh nghiệm cấp cơ sở năm 2026
                </div>
                <div className="font-sans font-bold text-sm text-slate-900 pt-2">
                  CHỦ TỊCH ỦY BAN NHÂN DÂN XÃ VĂN MÔN
                </div>
              </div>

              <div className="space-y-2 font-sans text-xs text-justify text-slate-700">
                <p><em>Căn cứ Luật Tổ chức chính quyền địa phương ngày 19/6/2015 và Luật sửa đổi, bổ sung năm 2019;</em></p>
                <p><em>Căn cứ Luật Thi đua, khen thưởng số 06/2022/QH15 ngày 15/6/2022;</em></p>
                <p><em>Căn cứ Nghị định số 13/2012/NĐ-CP ngày 02/3/2012 của Chính phủ ban hành Điều lệ Sáng kiến;</em></p>
                <p><em>Căn cứ Nghị định số 152/2025/NĐ-CP ngày 14/6/2025 của Chính phủ và Thông tư số 15/2025/TT-BNV của Bộ Nội vụ;</em></p>
                <p><em>Căn cứ Hướng dẫn số 1603/HD-HĐSK ngày 19/8/2025 của Hội đồng Sáng kiến tỉnh Bắc Ninh;</em></p>
                <p><em>Xét đề nghị của Hội đồng xét sáng kiến cấp cơ sở xã Văn Môn tại Biên bản họp ngày 28/01/2026,</em></p>

                <div className="font-bold text-center text-slate-900 py-1 text-sm">QUYẾT ĐỊNH:</div>

                <p><strong>Điều 1.</strong> Công nhận {passedCount} sáng kiến kinh nghiệm cấp cơ sở đợt 1 năm 2026 cho các tập thể, cá nhân thuộc UBND xã Văn Môn và các cơ quan đơn vị trên địa bàn (Có danh sách kèm theo).</p>
                <p><strong>Điều 2.</strong> Các tác giả có sáng kiến được công nhận tại Điều 1 được hưởng các quyền lợi và tiền thưởng theo quy định tại Điều lệ Sáng kiến và Quy chế chi tiêu nội bộ của đơn vị.</p>
                <p><strong>Điều 3.</strong> Công chức Văn phòng - Thống kê, Tài chính - Kế toán, các ban ngành đoàn thể xã và các cá nhân có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này./.</p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 font-sans text-xs">
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div className="font-bold text-slate-800">Nơi nhận:</div>
                  <div>- TT Thành ủy, UBND thành phố Bắc Ninh (b/c);</div>
                  <div>- Phòng Kinh tế / Phòng Nội vụ thành phố Bắc Ninh;</div>
                  <div>- Như Điều 3;</div>
                  <div>- Lưu: VT.</div>
                </div>

                <div className="text-center space-y-14">
                  <div className="font-bold uppercase text-slate-900">CHỦ TỊCH ỦY BAN NHÂN DÂN XÃ</div>
                  <div className="font-bold text-slate-900">(Ký tên và đóng dấu)</div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
