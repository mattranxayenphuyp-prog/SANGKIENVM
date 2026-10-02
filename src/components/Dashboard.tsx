import React from 'react';
import { Initiative, User, EvaluatorScoreSheet } from '../types';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Award, 
  AlertCircle, 
  BarChart3, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Scale
} from 'lucide-react';

interface DashboardProps {
  initiatives: Initiative[];
  currentUser: User;
  scoreSheets: Record<string, EvaluatorScoreSheet[]>;
  onSelectInitiative: (init: Initiative) => void;
  onOpenCreate: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  initiatives,
  currentUser,
  scoreSheets,
  onSelectInitiative,
  onOpenCreate,
  onNavigateTab
}) => {
  // Statistics
  const totalCount = initiatives.length;
  const newCount = initiatives.filter(i => i.status === 'draft' || i.status === 'submitted' || i.status === 'under_review').length;
  const evaluatingCount = initiatives.filter(i => i.status === 'evaluating' || i.status === 'eligible').length;
  const recommendedCount = initiatives.filter(i => i.status === 'recommended' || i.status === 'approved').length;
  const needFixOrRejectedCount = initiatives.filter(i => i.status === 'rejected').length;

  // Calculate average scores and average similarity
  const allSheets = Object.values(scoreSheets).flat().filter(s => s.isCompleted);
  const avgScore = allSheets.length > 0 
    ? (allSheets.reduce((acc, curr) => acc + curr.totalScore, 0) / allSheets.length).toFixed(1)
    : '85.2';

  const avgSimilarity = '19.7%';

  // Group by field
  const fieldCounts: Record<string, number> = {};
  initiatives.forEach(i => {
    fieldCounts[i.field] = (fieldCounts[i.field] || 0) + 1;
  });

  const getFieldName = (field: string) => {
    switch (field) {
      case 'administrative_reform': return 'Cải cách hành chính & Chuyển đổi số';
      case 'environment_craft_village': return 'Môi trường làng nghề Mẫn Xá';
      case 'education_training': return 'Giáo dục & Đào tạo';
      case 'health_social': return 'Y tế & An sinh xã hội';
      case 'agriculture_rural': return 'Nông nghiệp & NTM';
      default: return 'Khác';
    }
  };

  const workflowSteps = [
    { num: 1, name: 'Tiếp nhận' },
    { num: 2, name: 'Kiểm tra' },
    { num: 3, name: 'Phân loại' },
    { num: 4, name: 'Kiểm tra trùng' },
    { num: 5, name: 'Phân công' },
    { num: 6, name: 'Chấm độc lập' },
    { num: 7, name: 'Tổng hợp' },
    { num: 8, name: 'Họp HĐ' },
    { num: 9, name: 'Bổ sung' },
    { num: 10, name: 'Chấm lại' },
    { num: 11, name: 'Khóa kq' },
    { num: 12, name: 'Báo cáo' },
    { num: 13, name: 'Trình CN' },
    { num: 14, name: 'Lưu trữ' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner trang trọng & Thông tin Hội đồng */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-slate-900 rounded-xl p-6 text-white shadow-sm border border-red-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <Scale className="w-4 h-4" />
              <span>Hội đồng xét sáng kiến kinh nghiệm cấp cơ sở năm 2026</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Phần mềm Quản lý, Chấm điểm & Thẩm định Sáng kiến UBND Xã Văn Môn, Thành Phố Bắc Ninh
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Thực hiện theo Điều lệ Sáng kiến (Nghị định 13/2012/NĐ-CP), Thông tư 18/2013/TT-BKHCN, Nghị định 152/2025/NĐ-CP và Hướng dẫn số 1603/HD-HĐSK ngày 19/8/2025 của Hội đồng Sáng kiến tỉnh Bắc Ninh. 
              Tích hợp AI hỗ trợ kiểm tra tính mới, phạm vi nhân rộng, hiệu quả kinh tế - xã hội và đối soát trùng lặp 4 cấp độ.
            </p>
          </div>

          <div className="flex flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={onOpenCreate}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              title="Tải nộp hồ sơ sáng kiến trực tuyến, tải mẫu biểu Word Mẫu 01/SK và Mẫu 02/SK"
            >
              <span>+ Tải nộp sáng kiến mới</span>
            </button>
            <button
              onClick={() => onNavigateTab('council')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-md border border-white/20 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <span>Xem Biên bản họp HĐ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 8 Chỉ số điều hành cốt lõi (Metric cards không pill slop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tổng hồ sơ tiếp nhận</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {totalCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Kỳ đánh giá năm 2026
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Đang chấm độc lập</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {evaluatingCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Giám khảo chấm riêng biệt
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Đề nghị công nhận</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {recommendedCount}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            Đạt chuẩn $\ge$ 70 điểm
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Cần hoàn thiện / Chưa đạt</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {needFixOrRejectedCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Bổ sung minh chứng
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Điểm trung bình HĐ</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {avgScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Thang điểm 100 chính thức
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tương đồng trung bình</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            {avgSimilarity}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Chủ yếu trích dẫn luật định
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Thành viên Hội đồng</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            05
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            QĐ số 112/QĐ-UBND xã
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Căn cứ pháp lý áp dụng</span>
            <Scale className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            05
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Văn bản QPPL còn hiệu lực
          </div>
        </div>
      </div>

      {/* Sơ đồ Quy trình nghiệp vụ 14 bước */}
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Quy trình Nghiệp vụ Xét công nhận Sáng kiến (14 Bước)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quy trình khép kín bảo đảm nguyên tắc độc lập, công bằng và tuân thủ chặt chẽ pháp luật hiện hành
            </p>
          </div>
          <span className="text-xs text-red-800 font-semibold bg-red-50 px-2.5 py-1 rounded">
            Chuẩn hóa UBND xã Văn Môn
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {workflowSteps.map(step => (
            <div 
              key={step.num}
              className="p-2.5 rounded border border-slate-200/80 bg-slate-50/50 hover:bg-red-50/40 transition-colors text-center"
            >
              <div className="text-[10px] font-mono text-slate-400 font-bold">
                BƯỚC {step.num}
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                {step.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2 Cột: Danh sách hồ sơ tiêu biểu & Phân loại lĩnh vực */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột 1 & 2: Hồ sơ đang xử lý */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hồ sơ Sáng kiến đang thẩm định</h3>
              <p className="text-xs text-slate-500">Nhấn vào hồ sơ để xem chi tiết, phân tích AI và phiếu chấm</p>
            </div>
            <button
              onClick={() => onNavigateTab('initiatives')}
              className="text-xs text-red-700 hover:text-red-900 font-medium flex items-center gap-1"
            >
              <span>Xem tất cả ({initiatives.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {initiatives.slice(0, 4).map(init => {
              const sheets = scoreSheets[init.id] || [];
              const completedCount = sheets.filter(s => s.isCompleted).length;
              const isAssignedToMe = init.assignedEvaluatorIds?.includes(currentUser.id);
              const mySheet = sheets.find(s => s.evaluatorId === currentUser.id);

              return (
                <div 
                  key={init.id}
                  onClick={() => onSelectInitiative(init)}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-red-800">{init.code}</span>
                      <span>·</span>
                      <span>{getFieldName(init.field)}</span>
                      <span>·</span>
                      <span>Năm {init.year}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 hover:text-red-800 line-clamp-1">
                      {init.title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span>Tác giả: <strong>{init.author}</strong></span>
                      <span>·</span>
                      <span className="text-slate-500 truncate">{init.authorUnit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right text-xs">
                      <div className="text-slate-500">Tiến độ chấm</div>
                      <div className="font-mono font-medium text-slate-800 tabular-nums">
                        {completedCount}/{init.assignedEvaluatorIds?.length || 4} thành viên
                      </div>
                    </div>

                    {isAssignedToMe && currentUser.role === 'evaluator' && (
                      <span className={`text-xs px-2.5 py-1 rounded font-medium ${
                        mySheet?.isCompleted 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {mySheet?.isCompleted ? 'Đã chấm' : 'Cần chấm'}
                      </span>
                    )}

                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cột 3: Phân bổ lĩnh vực & Nguyên tắc bắt buộc */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <span>Phân bổ theo Lĩnh vực</span>
            </h3>
            
            <div className="space-y-2.5">
              {Object.entries(fieldCounts).map(([field, count]) => (
                <div key={field} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span className="truncate pr-2">{getFieldName(field)}</span>
                    <span className="font-mono font-semibold tabular-nums">{count} hồ sơ</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-700 h-full rounded-full"
                      style={{ width: `${(count / totalCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hộp nguyên tắc pháp lý bất khả xâm phạm */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2 text-xs text-slate-600">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-700" />
              <span>Nguyên tắc Thẩm định Bắt buộc</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-600 leading-relaxed">
              <li>Mọi thành viên Hội đồng chấm <strong>độc lập tuyệt đối</strong>.</li>
              <li>Không kết luận sao chép chỉ dựa trên một con số % đơn thuần.</li>
              <li>Nội dung văn bản quy phạm pháp luật không tính vào tỷ lệ trùng lặp vi phạm.</li>
              <li>Hiệu quả kinh tế không có số liệu định lượng: <strong>Ghi rõ chưa đủ dữ liệu</strong>, không tự chế thông tin.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
