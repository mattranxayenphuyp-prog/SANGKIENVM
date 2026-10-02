import React, { useState } from 'react';
import { EvaluationCriterion } from '../types';
import { 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Save,
  Lock
} from 'lucide-react';

interface CriteriaConfigModalProps {
  criteria: EvaluationCriterion[];
  onUpdateCriteria: (newCriteria: EvaluationCriterion[]) => void;
  isAdmin: boolean;
}

export const CriteriaConfigModal: React.FC<CriteriaConfigModalProps> = ({
  criteria,
  onUpdateCriteria,
  isAdmin
}) => {
  const [items, setItems] = useState<EvaluationCriterion[]>(criteria);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Group by A, B, C, D
  const totalMaxScore = items.reduce((acc, c) => acc + c.maxScore, 0);

  const handleScoreChange = (id: string, newMax: number) => {
    setItems(prev => prev.map(c => c.id === id ? { ...c, maxScore: newMax } : c));
  };

  const handleSaveAll = () => {
    onUpdateCriteria(items);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-800">
            <Sliders className="w-4 h-4" />
            <span>Cấu hình Động Bộ Tiêu chí & Thang điểm Đánh giá</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Bộ Tiêu chí Chấm Sáng kiến Cấp cơ sở Xã Văn Môn (Chuẩn 100 Điểm)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình linh hoạt theo văn bản QPPL mới mà không cần sửa mã nguồn; bảo toàn lịch sử chấm các kỳ đã khóa.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right font-mono text-xs">
            <span className="text-slate-500 block text-[11px]">Tổng thang điểm:</span>
            <span className={`text-base font-bold tabular-nums ${totalMaxScore === 100 ? 'text-emerald-700' : 'text-amber-600'}`}>
              {totalMaxScore} / 100 điểm
            </span>
          </div>

          {isAdmin && (
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Lưu cấu hình</span>
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu thành công phiên bản bộ tiêu chí mới vào cơ sở dữ liệu hệ thống!</span>
        </div>
      )}

      {/* Danh sách các nhóm tiêu chí */}
      <div className="space-y-4">
        {['A', 'B', 'C', 'D'].map(groupKey => {
          const groupItems = items.filter(c => c.group === groupKey);
          const groupNames: Record<string, string> = {
            A: 'Nhóm A: Tính mới của giải pháp (Tối đa 40 điểm)',
            B: 'Nhóm B: Phạm vi áp dụng & Khả năng nhân rộng (Tối đa 25 điểm)',
            C: 'Nhóm C: Hiệu quả kinh tế (Tối đa 15 điểm)',
            D: 'Nhóm D: Hiệu quả xã hội (Tối đa 20 điểm)'
          };

          const subTotal = groupItems.reduce((acc, c) => acc + c.maxScore, 0);

          return (
            <div key={groupKey} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  {groupNames[groupKey]}
                </span>
                <span className="font-mono text-xs font-bold text-red-900 tabular-nums">
                  Tiểu kết nhóm: {subTotal} điểm
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {groupItems.map(criterion => (
                  <div key={criterion.id} className="p-4 space-y-2 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-red-800">{criterion.code}</span>
                          <span className="font-bold text-slate-900 text-sm">{criterion.name}</span>
                          {criterion.isDisqualifyingIfFail && (
                            <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-medium">
                              Điều kiện loại nếu không đạt
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed text-justify">
                          {criterion.description}
                        </p>
                      </div>

                      {/* Điểm tối đa có thể cấu hình */}
                      <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-slate-500 font-medium">Điểm tối đa:</span>
                        <input
                          type="number"
                          disabled={!isAdmin}
                          min={1}
                          max={50}
                          value={criterion.maxScore}
                          onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-center text-red-800 disabled:bg-slate-100"
                        />
                        <span className="text-slate-400 font-mono">điểm</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded text-slate-600 border border-slate-100">
                      <div>
                        <strong>Căn cứ pháp lý:</strong> {criterion.legalRef}
                      </div>
                      <div>
                        <strong>Tài liệu minh chứng bắt buộc:</strong> {criterion.requiredEvidence}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
