import React, { useState } from 'react';
import { Initiative, User, EvaluationCriterion, EvaluatorScoreSheet, CriterionScoreInput } from '../types';
import { 
  X, 
  CheckSquare, 
  Sparkles, 
  AlertCircle, 
  Save, 
  Send, 
  ShieldCheck, 
  Loader2,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface EvaluationScoringModalProps {
  initiative: Initiative | null;
  currentUser: User;
  criteria: EvaluationCriterion[];
  existingScoreSheet?: EvaluatorScoreSheet;
  onClose: () => void;
  onSaveScoreSheet: (sheet: EvaluatorScoreSheet) => void;
}

export const EvaluationScoringModal: React.FC<EvaluationScoringModalProps> = ({
  initiative,
  currentUser,
  criteria,
  existingScoreSheet,
  onClose,
  onSaveScoreSheet
}) => {
  if (!initiative) return null;

  // Initialize scores state
  const [scores, setScores] = useState<Record<string, CriterionScoreInput>>(() => {
    if (existingScoreSheet?.scores) {
      return existingScoreSheet.scores;
    }
    const initial: Record<string, CriterionScoreInput> = {};
    criteria.forEach(c => {
      // Default to roughly 80% of max score for smooth initial UX
      const defaultScore = Math.round(c.maxScore * 0.85);
      initial[c.id] = {
        criterionId: c.id,
        score: defaultScore,
        comment: ''
      };
    });
    return initial;
  });

  const [generalComment, setGeneralComment] = useState(
    existingScoreSheet?.generalComment || 'Giải pháp đạt tiêu chuẩn sáng kiến cấp cơ sở theo quy định; có tính mới và khả năng áp dụng thực tiễn tại xã Văn Môn.'
  );

  const [recommendation, setRecommendation] = useState<'recommended' | 'request_changes' | 'rejected'>(
    existingScoreSheet?.recommendation || 'recommended'
  );

  const [suggestingId, setSuggestingId] = useState<string | null>(null);

  // Calculate totals
  let totalScore = 0;
  let noveltyScore = 0;
  let applicabilityScore = 0;
  let economicScore = 0;
  let socialScore = 0;

  criteria.forEach(c => {
    const item = scores[c.id];
    const s = item ? item.score : 0;
    totalScore += s;
    if (c.group === 'A') noveltyScore += s;
    if (c.group === 'B') applicabilityScore += s;
    if (c.group === 'C') economicScore += s;
    if (c.group === 'D') socialScore += s;
  });

  // Check conditions
  const isNoveltyPass = noveltyScore >= 20; // 50% of 40
  const isOverallPass = totalScore >= 70;

  const handleScoreChange = (criterionId: string, value: number, maxScore: number) => {
    const clamped = Math.max(0, Math.min(maxScore, value));
    setScores(prev => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        criterionId,
        score: clamped
      }
    }));
  };

  const handleCommentChange = (criterionId: string, comment: string) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        criterionId,
        comment
      }
    }));
  };

  const handleAiSuggestComment = async (criterion: EvaluationCriterion) => {
    setSuggestingId(criterion.id);
    try {
      const currentScore = scores[criterion.id]?.score || criterion.maxScore;
      const res = await fetch('/api/ai/suggest-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initiative, criterion, currentScore })
      });
      const data = await res.json();
      if (data.success && data.comment) {
        handleCommentChange(criterion.id, data.comment);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSuggestingId(null);
    }
  };

  const handleSave = (isCompleted: boolean) => {
    const sheet: EvaluatorScoreSheet = {
      id: existingScoreSheet?.id || `sc-${initiative.id}-${currentUser.id}`,
      initiativeId: initiative.id,
      evaluatorId: currentUser.id,
      evaluatorName: currentUser.name,
      evaluatorTitle: currentUser.title,
      scores,
      totalScore,
      noveltyScore,
      applicabilityScore,
      economicScore,
      socialScore,
      generalComment,
      recommendation,
      isCompleted,
      submittedAt: new Date().toISOString()
    };

    onSaveScoreSheet(sheet);
    onClose();
  };

  // Group criteria by Group A, B, C, D
  const groupedCriteria = {
    A: criteria.filter(c => c.group === 'A'),
    B: criteria.filter(c => c.group === 'B'),
    C: criteria.filter(c => c.group === 'C'),
    D: criteria.filter(c => c.group === 'D'),
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-800 uppercase tracking-wider">
              <CheckSquare className="w-4 h-4" />
              <span>Phiếu Chấm Điểm Sáng kiến Điện tử (Mẫu số 01/SK)</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 truncate">
              {initiative.code} · {initiative.title}
            </h3>
            <p className="text-xs text-slate-500">
              Giám khảo: <strong className="text-slate-700">{currentUser.name}</strong> ({currentUser.title}) · Quy trình chấm độc lập
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tổng quan thanh điểm nổi (Sticky Summary Bar) */}
        <div className="bg-red-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
          <div className="flex items-center gap-4 sm:gap-6 font-mono">
            <div>
              <span className="text-red-200 text-[10px] block">TỔNG ĐIỂM</span>
              <span className="text-lg font-bold tabular-nums">{totalScore}</span>
              <span className="text-red-300 text-xs">/100</span>
            </div>
            <div className="border-l border-red-700/60 pl-3">
              <span className="text-red-200 text-[10px] block">TÍNH MỚI (A)</span>
              <span className={`text-sm font-bold tabular-nums ${!isNoveltyPass ? 'text-amber-300' : 'text-white'}`}>
                {noveltyScore}
              </span>
              <span className="text-red-300 text-xs">/40</span>
            </div>
            <div className="border-l border-red-700/60 pl-3">
              <span className="text-red-200 text-[10px] block">ÁP DỤNG (B)</span>
              <span className="text-sm font-bold tabular-nums">{applicabilityScore}</span>
              <span className="text-red-300 text-xs">/25</span>
            </div>
            <div className="border-l border-red-700/60 pl-3">
              <span className="text-red-200 text-[10px] block">KINH TẾ (C)</span>
              <span className="text-sm font-bold tabular-nums">{economicScore}</span>
              <span className="text-red-300 text-xs">/15</span>
            </div>
            <div className="border-l border-red-700/60 pl-3">
              <span className="text-red-200 text-[10px] block">XÃ HỘI (D)</span>
              <span className="text-sm font-bold tabular-nums">{socialScore}</span>
              <span className="text-red-300 text-xs">/20</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isNoveltyPass && (
              <span className="bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded text-[11px] font-semibold">
                Tính mới chưa đạt 20 điểm
              </span>
            )}
            <span className={`px-2.5 py-1 rounded text-xs font-bold ${
              isOverallPass && isNoveltyPass 
                ? 'bg-emerald-500 text-white' 
                : 'bg-amber-500 text-slate-950'
            }`}>
              {isOverallPass && isNoveltyPass ? 'ĐỦ ĐIỀU KIỆN ĐẠT' : 'CHƯA ĐỦ ĐIỀU KIỆN'}
            </span>
          </div>
        </div>

        {/* Nội dung các tiêu chí chấm điểm */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-800">
          
          {Object.entries(groupedCriteria).map(([groupKey, groupItems]) => {
            const groupNames: Record<string, string> = {
              A: 'Nhóm A: Tính mới của giải pháp (Tối đa 40 điểm)',
              B: 'Nhóm B: Phạm vi áp dụng & Khả năng nhân rộng (Tối đa 25 điểm)',
              C: 'Nhóm C: Hiệu quả kinh tế (Tối đa 15 điểm)',
              D: 'Nhóm D: Hiệu quả xã hội (Tối đa 20 điểm)'
            };

            return (
              <div key={groupKey} className="space-y-3">
                <div className="bg-slate-100 px-3 py-2 rounded font-bold text-slate-900 border-l-4 border-red-700 flex items-center justify-between">
                  <span>{groupNames[groupKey]}</span>
                </div>

                <div className="space-y-4">
                  {groupItems.map(criterion => {
                    const currentScore = scores[criterion.id]?.score ?? 0;
                    const currentComment = scores[criterion.id]?.comment ?? '';

                    return (
                      <div key={criterion.id} className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-red-800">{criterion.code}</span>
                              <span className="font-bold text-slate-900">{criterion.name}</span>
                              {criterion.isDisqualifyingIfFail && (
                                <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                                  Tiêu chí loại
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 text-justify leading-relaxed">
                              {criterion.description}
                            </p>
                            <div className="text-[11px] text-slate-400">
                              Căn cứ: {criterion.legalRef} · Minh chứng bắt buộc: {criterion.requiredEvidence}
                            </div>
                          </div>

                          {/* Ô nhập điểm */}
                          <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <span className="text-slate-500 font-medium">Điểm chấm:</span>
                            <input
                              type="number"
                              min={0}
                              max={criterion.maxScore}
                              step={0.5}
                              value={currentScore}
                              onChange={(e) => handleScoreChange(criterion.id, parseFloat(e.target.value) || 0, criterion.maxScore)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-center text-sm text-red-800 focus:outline-none focus:ring-1 focus:ring-red-600"
                            />
                            <span className="text-slate-400 font-mono">/ {criterion.maxScore}</span>
                          </div>
                        </div>

                        {/* Slider điều chỉnh nhanh */}
                        <div className="flex items-center gap-3 pt-1">
                          <input
                            type="range"
                            min={0}
                            max={criterion.maxScore}
                            step={0.5}
                            value={currentScore}
                            onChange={(e) => handleScoreChange(criterion.id, parseFloat(e.target.value) || 0, criterion.maxScore)}
                            className="w-full accent-red-700 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Nhận xét tiêu chí & Nút gợi ý AI */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 font-medium">Nhận xét chuyên môn cho tiêu chí này:</span>
                            <button
                              type="button"
                              onClick={() => handleAiSuggestComment(criterion)}
                              disabled={suggestingId === criterion.id}
                              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium transition-colors"
                            >
                              {suggestingId === criterion.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              <span>Gợi ý nhận xét AI</span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={currentComment}
                            onChange={(e) => handleCommentChange(criterion.id, e.target.value)}
                            placeholder="Nhập nhận xét cụ thể căn cứ vào hồ sơ và thực tiễn..."
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600 text-slate-800"
                          />
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Đánh giá chung & Kết luận của thành viên */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">
              Ý kiến Đánh giá Chung và Đề xuất của Thành viên Hội đồng
            </h4>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">
                Nhận xét tổng thể về ưu điểm, hạn chế và nội dung cần khắc phục:
              </label>
              <textarea
                rows={3}
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-red-600 text-slate-800 leading-relaxed"
                placeholder="Ghi nhận xét cụ thể..."
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="font-medium text-slate-700">Đề xuất của người chấm:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRecommendation('recommended')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    recommendation === 'recommended'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Đề nghị công nhận
                </button>

                <button
                  type="button"
                  onClick={() => setRecommendation('request_changes')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    recommendation === 'request_changes'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Yêu cầu hoàn thiện
                </button>

                <button
                  type="button"
                  onClick={() => setRecommendation('rejected')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    recommendation === 'rejected'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Không công nhận
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Modal Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
          >
            Hủy bỏ
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu nháp</span>
            </button>

            <button
              onClick={() => handleSave(true)}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Hoàn tất & Ký nộp phiếu</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
