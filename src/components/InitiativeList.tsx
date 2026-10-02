import React, { useState } from 'react';
import { Initiative, User, EvaluatorScoreSheet, SimilarityReport } from '../types';
import { 
  Search, 
  Filter, 
  FileText, 
  CheckSquare, 
  Sparkles, 
  Printer, 
  ChevronRight,
  FilePlus,
  Scale
} from 'lucide-react';

interface InitiativeListProps {
  initiatives: Initiative[];
  currentUser: User;
  scoreSheets: Record<string, EvaluatorScoreSheet[]>;
  similarityReports: Record<string, SimilarityReport>;
  onSelectInitiative: (init: Initiative) => void;
  onOpenScoreModal: (init: Initiative) => void;
  onOpenSimilarityModal: (init: Initiative) => void;
  onOpenReportModal: (init: Initiative) => void;
  onOpenCreateModal: () => void;
}

export const InitiativeList: React.FC<InitiativeListProps> = ({
  initiatives,
  currentUser,
  scoreSheets,
  similarityReports,
  onSelectInitiative,
  onOpenScoreModal,
  onOpenSimilarityModal,
  onOpenReportModal,
  onOpenCreateModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldFilter, setFieldFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2026');

  const filteredInitiatives = initiatives.filter(init => {
    const matchesSearch = 
      init.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      init.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      init.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      init.authorUnit.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesField = fieldFilter === 'all' || init.field === fieldFilter;
    const matchesStatus = statusFilter === 'all' || init.status === statusFilter;
    const matchesYear = yearFilter === 'all' || init.year.toString() === yearFilter;

    return matchesSearch && matchesField && matchesStatus && matchesYear;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Mới tạo';
      case 'submitted': return 'Đã nộp';
      case 'under_review': return 'Đang kiểm tra';
      case 'eligible': return 'Đủ điều kiện';
      case 'evaluating': return 'Đang chấm độc lập';
      case 'synthesizing': return 'Đang tổng hợp';
      case 'recommended': return 'Đề nghị công nhận';
      case 'approved': return 'Đã công nhận';
      case 'rejected': return 'Không công nhận';
      case 'archived': return 'Đã lưu trữ';
      default: return status;
    }
  };

  const getFieldName = (field: string) => {
    switch (field) {
      case 'administrative_reform': return 'Cải cách hành chính & Chuyển đổi số';
      case 'environment_craft_village': return 'Môi trường làng nghề Mẫn Xá';
      case 'education_training': return 'Giáo dục và Đào tạo';
      case 'health_social': return 'Y tế & An sinh xã hội';
      case 'agriculture_rural': return 'Nông nghiệp & NTM';
      default: return 'Khác';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Thanh tiêu đề và chức năng tiếp nhận */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Danh mục Hồ sơ Sáng kiến Kinh nghiệm Cấp cơ sở
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý tiếp nhận, thẩm định điều kiện, chấm điểm độc lập và đối soát trùng lặp
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap self-start sm:self-auto border border-red-800"
          title="Tải nộp hồ sơ sáng kiến trực tuyến theo Hướng dẫn 1603/HD-HĐSK"
        >
          <FilePlus className="w-4 h-4 text-amber-300" />
          <span>Tải nộp sáng kiến mới</span>
        </button>
      </div>

      {/* Bộ lọc tìm kiếm & dropdowns */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Tìm kiếm từ khóa */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã, tên, tác giả, đơn vị..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Lĩnh vực */}
        <div>
          <select
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-800"
          >
            <option value="all">Tất cả lĩnh vực áp dụng</option>
            <option value="administrative_reform">Cải cách hành chính & CĐS</option>
            <option value="environment_craft_village">Môi trường làng nghề Mẫn Xá</option>
            <option value="education_training">Giáo dục và Đào tạo</option>
            <option value="health_social">Y tế & An sinh xã hội</option>
            <option value="agriculture_rural">Nông nghiệp & NTM</option>
          </select>
        </div>

        {/* Trạng thái quy trình */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-800"
          >
            <option value="all">Tất cả trạng thái hồ sơ</option>
            <option value="evaluating">Đang chấm độc lập</option>
            <option value="synthesizing">Đang tổng hợp điểm</option>
            <option value="recommended">Đề nghị công nhận</option>
            <option value="approved">Đã công nhận</option>
            <option value="under_review">Đang kiểm tra</option>
          </select>
        </div>

        {/* Năm xét */}
        <div>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-800 font-mono"
          >
            <option value="all">Tất cả các năm</option>
            <option value="2026">Năm 2026 (Hiện tại)</option>
            <option value="2025">Năm 2025</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách chuẩn hành chính (Dense Table with Tabular Figures) */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-28">Mã hồ sơ</th>
                <th className="py-3 px-4 min-w-[280px]">Tên sáng kiến / Tác giả</th>
                <th className="py-3 px-4 hidden md:table-cell">Lĩnh vực áp dụng</th>
                <th className="py-3 px-4 text-center">Tiến độ chấm</th>
                <th className="py-3 px-4 text-center">Tương đồng AI</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right min-w-[220px]">Thao tác chuyên môn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredInitiatives.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy hồ sơ sáng kiến nào phù hợp điều kiện lọc.
                  </td>
                </tr>
              ) : (
                filteredInitiatives.map((init) => {
                  const sheets = scoreSheets[init.id] || [];
                  const completedSheets = sheets.filter(s => s.isCompleted);
                  const simReport = similarityReports[init.id];
                  const isAssigned = init.assignedEvaluatorIds?.includes(currentUser.id);
                  const mySheet = sheets.find(s => s.evaluatorId === currentUser.id);

                  // Calculate average score if any completed
                  const avgScore = completedSheets.length > 0
                    ? (completedSheets.reduce((a, b) => a + b.totalScore, 0) / completedSheets.length).toFixed(1)
                    : null;

                  return (
                    <tr key={init.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Mã hồ sơ */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-red-900 whitespace-nowrap">
                        {init.code}
                      </td>

                      {/* Tên sáng kiến & Tác giả */}
                      <td className="py-3.5 px-4">
                        <div 
                          onClick={() => onSelectInitiative(init)}
                          className="font-semibold text-slate-900 hover:text-red-800 cursor-pointer line-clamp-2 leading-snug"
                        >
                          {init.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <span className="font-medium text-slate-700">{init.author}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-[200px]">{init.authorTitle}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-[220px] text-slate-400">{init.authorUnit}</span>
                        </div>
                      </td>

                      {/* Lĩnh vực */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 text-xs">
                        {getFieldName(init.field)}
                      </td>

                      {/* Tiến độ chấm */}
                      <td className="py-3.5 px-4 text-center tabular-nums">
                        <div className="font-medium text-slate-900">
                          {completedSheets.length}/{init.assignedEvaluatorIds?.length || 4}
                        </div>
                        {avgScore ? (
                          <div className="text-[11px] text-slate-500 font-mono">
                            TB: <strong className="text-red-700">{avgScore}</strong>/100
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400">Chưa đủ điểm</div>
                        )}
                      </td>

                      {/* Tương đồng AI */}
                      <td className="py-3.5 px-4 text-center tabular-nums">
                        {simReport ? (
                          <button
                            onClick={() => onOpenSimilarityModal(init)}
                            className="inline-flex flex-col items-center hover:opacity-80 transition-opacity"
                            title="Bấm để xem chi tiết đối chiếu tương đồng 4 cấp độ"
                          >
                            <span className={`font-mono font-bold ${simReport.overallPercent > 30 ? 'text-amber-600' : 'text-slate-800'}`}>
                              {simReport.overallPercent.toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                              Chi tiết
                            </span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Chưa quét</span>
                        )}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="text-xs text-slate-700 font-medium">
                          {getStatusLabel(init.status)}
                        </span>
                      </td>

                      {/* Thao tác chuyên môn */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Nút chấm điểm cho giám khảo được phân công */}
                          {(isAssigned || currentUser.role === 'admin' || currentUser.role === 'council_president') && (
                            <button
                              onClick={() => onOpenScoreModal(init)}
                              className={`px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                                mySheet?.isCompleted
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  : 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                              }`}
                              title="Mở phiếu chấm điểm điện tử độc lập"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>{mySheet?.isCompleted ? 'Sửa điểm' : 'Chấm điểm'}</span>
                            </button>
                          )}

                          {/* Nút kiểm tra tương đồng */}
                          <button
                            onClick={() => onOpenSimilarityModal(init)}
                            className="p-1.5 rounded text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                            title="Phân tích tương đồng / trùng lặp AI"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          {/* Nút xuất báo cáo riêng */}
                          <button
                            onClick={() => onOpenReportModal(init)}
                            className="p-1.5 rounded text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Xem Báo cáo kết quả đánh giá sáng kiến (Mẫu in)"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Nút xem chi tiết */}
                          <button
                            onClick={() => onSelectInitiative(init)}
                            className="p-1.5 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Xem toàn văn hồ sơ và minh chứng"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
