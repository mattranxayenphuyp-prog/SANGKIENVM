import React, { useState } from 'react';
import { Initiative, User, EvaluatorScoreSheet, SimilarityReport, EvaluationCriterion } from '../types';
import { 
  X, 
  FileText, 
  Sparkles, 
  CheckSquare, 
  AlertTriangle, 
  Paperclip, 
  Download, 
  Printer, 
  Scale, 
  UserCheck,
  Send,
  Loader2,
  Calendar,
  Building,
  CheckCircle2
} from 'lucide-react';

interface InitiativeDetailModalProps {
  initiative: Initiative | null;
  onClose: () => void;
  currentUser: User;
  criteria: EvaluationCriterion[];
  scoreSheets: EvaluatorScoreSheet[];
  similarityReport?: SimilarityReport;
  onOpenScoreModal: (init: Initiative) => void;
  onOpenSimilarityModal: (init: Initiative) => void;
  onOpenReportModal: (init: Initiative) => void;
  onUpdateInitiativeStatus: (initId: string, newStatus: any) => void;
}

export const InitiativeDetailModal: React.FC<InitiativeDetailModalProps> = ({
  initiative,
  onClose,
  currentUser,
  criteria,
  scoreSheets,
  similarityReport,
  onOpenScoreModal,
  onOpenSimilarityModal,
  onOpenReportModal,
  onUpdateInitiativeStatus
}) => {
  if (!initiative) return null;

  const [activeTab, setActiveTab] = useState<'dossier' | 'ai_analysis' | 'scores' | 'evidence'>('dossier');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Trigger server-side AI Analysis
  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/ai/analyze-initiative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initiative })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiAnalysis(data.data);
      } else {
        setAnalysisError('Không thể thực hiện phân tích AI');
      }
    } catch (err: any) {
      setAnalysisError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const completedSheets = scoreSheets.filter(s => s.isCompleted);
  const mySheet = scoreSheets.find(s => s.evaluatorId === currentUser.id);
  const isAssigned = initiative.assignedEvaluatorIds?.includes(currentUser.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-red-800">
              <span>{initiative.code}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-sans font-normal">Năm xét duyệt {initiative.year}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-sans font-normal">Xã Văn Môn, TP. Bắc Ninh</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {initiative.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-0.5">
              <span>Tác giả chính: <strong className="text-slate-800">{initiative.author}</strong></span>
              {initiative.coAuthors.length > 0 && (
                <span>Đồng tác giả: {initiative.coAuthors.join(', ')}</span>
              )}
              <span>·</span>
              <span className="truncate">{initiative.authorTitle} ({initiative.authorUnit})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenReportModal(initiative)}
              className="p-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Xuất Báo cáo kết quả đánh giá"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (No pill slop, clean underline buttons) */}
        <div className="px-5 border-b border-slate-200 flex items-center gap-6 text-xs font-medium text-slate-600 bg-white">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'dossier' 
                ? 'border-red-700 text-red-800 font-semibold' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Toàn văn Hồ sơ (17 mục)
          </button>

          <button
            onClick={() => {
              setActiveTab('ai_analysis');
              if (!aiAnalysis) handleRunAiAnalysis();
            }}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai_analysis' 
                ? 'border-red-700 text-red-800 font-semibold' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Phân tích Chuyên môn AI
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'scores' 
                ? 'border-red-700 text-red-800 font-semibold' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Kết quả Chấm Hội đồng ({completedSheets.length})
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'evidence' 
                ? 'border-red-700 text-red-800 font-semibold' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            Tài liệu & Minh chứng ({initiative.attachments.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-800">
          
          {/* TAB 1: TOÀN VĂN HỒ SƠ */}
          {activeTab === 'dossier' && (
            <div className="space-y-6 max-w-4xl">
              
              {/* Nhóm thông tin áp dụng thực tế */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium">Thời gian thực hiện:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">{initiative.executionPeriod}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Thời điểm bắt đầu áp dụng:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">{initiative.applicationStartDate}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Địa bàn / Đơn vị áp dụng:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">{initiative.applicationScope}</div>
                </div>
              </div>

              {/* Tóm tắt */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  I. Tóm tắt nội dung sáng kiến
                </h4>
                <div className="p-3.5 bg-white rounded-lg border border-slate-200 leading-relaxed text-slate-700 text-justify">
                  {initiative.summary}
                </div>
              </div>

              {/* Thực trạng */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  II. Thực trạng trước khi áp dụng giải pháp
                </h4>
                <div className="p-3.5 bg-white rounded-lg border border-slate-200 leading-relaxed text-slate-700 text-justify">
                  {initiative.currentStatusBefore}
                </div>
              </div>

              {/* Nội dung giải pháp */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  III. Nội dung giải pháp đề nghị công nhận sáng kiến
                </h4>
                <div className="p-3.5 bg-white rounded-lg border border-slate-200 leading-relaxed text-slate-700 text-justify whitespace-pre-line">
                  {initiative.solutionContent}
                </div>
              </div>

              {/* Điểm mới */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  IV. Điểm mới của giải pháp so với giải pháp trước đây
                </h4>
                <div className="p-3.5 bg-white rounded-lg border border-slate-200 leading-relaxed text-slate-700 text-justify">
                  {initiative.noveltyPoints}
                </div>
              </div>

              {/* Khả năng áp dụng & nhân rộng */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  V. Khả năng áp dụng và điều kiện nhân rộng
                </h4>
                <div className="p-3.5 bg-white rounded-lg border border-slate-200 leading-relaxed text-slate-700 text-justify">
                  {initiative.applicationCapacity}
                </div>
              </div>

              {/* 2 cột: Hiệu quả kinh tế & Hiệu quả xã hội */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Hiệu quả kinh tế */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      VI. Hiệu quả kinh tế
                    </h4>
                    {initiative.economicDataVerified ? (
                      <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Có số liệu kiểm chứng
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        Chưa đủ dữ liệu định lượng
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 bg-white rounded-lg border border-slate-200 leading-relaxed text-slate-700">
                    {initiative.economicBenefit}
                    {!initiative.economicDataVerified && (
                      <p className="mt-2 text-[11px] text-amber-800 italic bg-amber-50 p-2 rounded border border-amber-200">
                        * Lưu ý Hội đồng: Hồ sơ chưa đủ dữ liệu định lượng để xác minh giá trị làm lợi về kinh tế. Đề nghị đánh giá định tính.
                      </p>
                    )}
                  </div>
                </div>

                {/* Hiệu quả xã hội */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    VII. Hiệu quả xã hội
                  </h4>
                  <div className="p-3.5 bg-white rounded-lg border border-slate-200 leading-relaxed text-slate-700">
                    {initiative.socialBenefit}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PHÂN TÍCH CHUYÊN MÔN AI (GEMINI 3.8 FLASH) */}
          {activeTab === 'ai_analysis' && (
            <div className="space-y-6 max-w-4xl">
              
              <div className="flex items-center justify-between bg-indigo-50/60 p-4 rounded-lg border border-indigo-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-indigo-950 text-xs">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Trợ lý Đánh giá Chuyên môn (Gemini 3.8 Flash)</span>
                  </div>
                  <p className="text-[11px] text-indigo-800">
                    Phân tích sơ bộ 04 nhóm tiêu chí theo Điều lệ Sáng kiến. Kết quả mang tính tham khảo chuyên môn, quyền quyết định thuộc Hội đồng.
                  </p>
                </div>

                <button
                  onClick={handleRunAiAnalysis}
                  disabled={isAnalyzing}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang phân tích...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Chạy lại phân tích</span>
                    </>
                  )}
                </button>
              </div>

              {isAnalyzing && (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                  <p className="text-xs">Đang đọc toàn văn hồ sơ, kiểm tra căn cứ pháp lý và phân tích 4 nhóm tiêu chí...</p>
                </div>
              )}

              {analysisError && (
                <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs">
                  {analysisError}
                </div>
              )}

              {aiAnalysis && !isAnalyzing && (
                <div className="space-y-5">
                  
                  {/* Tổng quan & Mức độ tin cậy */}
                  <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium">Đánh giá chung:</span>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {aiAnalysis.summaryAnalysis}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                      <div className="text-center">
                        <div className="text-[11px] text-slate-500">Điểm AI đề xuất</div>
                        <div className="text-xl font-bold font-mono text-red-800 tabular-nums">
                          {aiAnalysis.totalSuggestedScore}<span className="text-xs font-normal text-slate-400">/100</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[11px] text-slate-500">Độ tin cậy</div>
                        <div className="text-xl font-bold font-mono text-indigo-600 tabular-nums">
                          {aiAnalysis.confidenceScore}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Nhóm Tiêu chí */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Nhóm A: Tính mới */}
                    <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900">Nhóm A: Tính mới của giải pháp</span>
                        <span className="font-mono font-bold text-red-800">
                          {aiAnalysis.groupA.score}/{aiAnalysis.groupA.max} điểm
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {aiAnalysis.groupA.comment}
                      </p>
                      {aiAnalysis.groupA.noveltyHighlights && (
                        <div className="pt-1">
                          <span className="text-[11px] font-semibold text-slate-500">Điểm nổi bật:</span>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5 mt-0.5">
                            {aiAnalysis.groupA.noveltyHighlights.map((h: string, idx: number) => (
                              <li key={idx}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Nhóm B: Khả năng áp dụng */}
                    <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900">Nhóm B: Khả năng áp dụng</span>
                        <span className="font-mono font-bold text-red-800">
                          {aiAnalysis.groupB.score}/{aiAnalysis.groupB.max} điểm
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {aiAnalysis.groupB.comment}
                      </p>
                      <div className="text-[11px] text-slate-600 pt-1 space-y-1">
                        <div><strong>Áp dụng thực tế:</strong> {aiAnalysis.groupB.realApplicationStatus}</div>
                        <div><strong>Khả năng nhân rộng:</strong> {aiAnalysis.groupB.replicability}</div>
                      </div>
                    </div>

                    {/* Nhóm C: Hiệu quả kinh tế */}
                    <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900">Nhóm C: Hiệu quả kinh tế</span>
                        <span className="font-mono font-bold text-red-800">
                          {aiAnalysis.groupC.score}/{aiAnalysis.groupC.max} điểm
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {aiAnalysis.groupC.comment}
                      </p>
                      <div className="text-[11px] bg-slate-50 p-2 rounded text-slate-600">
                        {aiAnalysis.groupC.verifiedDataNote}
                      </div>
                    </div>

                    {/* Nhóm D: Hiệu quả xã hội */}
                    <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900">Nhóm D: Hiệu quả xã hội</span>
                        <span className="font-mono font-bold text-red-800">
                          {aiAnalysis.groupD.score}/{aiAnalysis.groupD.max} điểm
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {aiAnalysis.groupD.comment}
                      </p>
                      {aiAnalysis.groupD.socialImpacts && (
                        <div className="pt-1">
                          <span className="text-[11px] font-semibold text-slate-500">Tác động xã hội:</span>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5 mt-0.5">
                            {aiAnalysis.groupD.socialImpacts.map((s: string, idx: number) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Khuyến nghị cho Hội đồng */}
                  {aiAnalysis.keyAdviceForCouncil && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                      <span className="font-bold text-slate-900">Khuyến nghị chuyên môn cho Hội đồng xét:</span>
                      <ul className="list-disc list-inside text-slate-600 space-y-1">
                        {aiAnalysis.keyAdviceForCouncil.map((adv: string, idx: number) => (
                          <li key={idx}>{adv}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* TAB 3: BẢNG ĐIỂM HỘI ĐỒNG */}
          {activeTab === 'scores' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Phiếu Chấm Độc lập của các Thành viên Hội đồng
                  </h4>
                  <p className="text-slate-500 text-xs">
                    Theo quy định, mỗi thành viên chấm riêng biệt không xem điểm của nhau trước khi hoàn tất.
                  </p>
                </div>

                {(isAssigned || currentUser.role === 'admin' || currentUser.role === 'council_president') && (
                  <button
                    onClick={() => onOpenScoreModal(initiative)}
                    className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{mySheet?.isCompleted ? 'Chỉnh sửa phiếu chấm của bạn' : 'Tiến hành chấm điểm'}</span>
                  </button>
                )}
              </div>

              {scoreSheets.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-lg border border-slate-200">
                  Chưa có thành viên nào hoàn thành phiếu chấm cho sáng kiến này.
                </div>
              ) : (
                <div className="space-y-3">
                  {scoreSheets.map((sheet) => (
                    <div key={sheet.id} className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-red-700" />
                          <span className="font-bold text-slate-900">{sheet.evaluatorName}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{sheet.evaluatorTitle}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs">
                            Tổng điểm: <strong className="text-red-800 text-sm">{sheet.totalScore}</strong>/100
                          </span>
                          <span className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                            sheet.recommendation === 'recommended' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {sheet.recommendation === 'recommended' ? 'Đề nghị công nhận' : 'Cần bổ sung'}
                          </span>
                        </div>
                      </div>

                      {/* Phân rã điểm 4 nhóm */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-50 p-2.5 rounded font-mono">
                        <div>Tính mới (A): <strong>{sheet.noveltyScore}</strong>/40</div>
                        <div>Áp dụng (B): <strong>{sheet.applicabilityScore}</strong>/25</div>
                        <div>Kinh tế (C): <strong>{sheet.economicScore}</strong>/15</div>
                        <div>Xã hội (D): <strong>{sheet.socialScore}</strong>/20</div>
                      </div>

                      {/* Nhận xét chung */}
                      <div className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-100">
                        <span className="font-semibold text-slate-900">Nhận xét của người chấm: </span>
                        {sheet.generalComment || 'Đạt yêu cầu tiêu chí sáng kiến cấp cơ sở.'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TÀI LIỆU MINH CHỨNG */}
          {activeTab === 'evidence' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Hồ sơ Điện tử & Văn bản Minh chứng đính kèm</h4>
                  <p className="text-slate-500 text-xs">Hệ thống tự động trích xuất nội dung văn bản phục vụ phân tích</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {initiative.attachments.map((att) => (
                  <div key={att.id} className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 hover:border-slate-300 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-700 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 truncate max-w-[240px]">{att.name}</p>
                          <p className="text-[11px] text-slate-500">{att.fileType.toUpperCase()} · {att.fileSize} · Tải lên ngày {att.uploadDate}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-mono">
                        {att.category}
                      </span>
                    </div>

                    {att.extractedSnippet && (
                      <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic line-clamp-3">
                        "{att.extractedSnippet}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Modal Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenSimilarityModal(initiative)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đối soát Trùng lặp 4 cấp độ</span>
            </button>

            <button
              onClick={() => onOpenReportModal(initiative)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Xem Báo cáo đánh giá chính thức</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-medium transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
