import React, { useState } from 'react';
import { Initiative, SimilarityReport, SimilaritySegment } from '../types';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Scale, 
  Sliders, 
  Loader2,
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SimilarityCheckerModalProps {
  initiative: Initiative | null;
  report?: SimilarityReport;
  onClose: () => void;
  onSaveReport: (report: SimilarityReport) => void;
}

export const SimilarityCheckerModal: React.FC<SimilarityCheckerModalProps> = ({
  initiative,
  report,
  onClose,
  onSaveReport
}) => {
  if (!initiative) return null;

  const [currentReport, setCurrentReport] = useState<SimilarityReport | undefined>(report);
  const [isScanning, setIsScanning] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [showAdjustPanel, setShowAdjustPanel] = useState(false);
  const [adjustedPercent, setAdjustedPercent] = useState<number>(report?.overallPercent || 18.5);
  const [adjustReason, setAdjustReason] = useState<string>('');

  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/ai/check-similarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initiative })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const newReport: SimilarityReport = {
          id: `sim-${Date.now()}`,
          initiativeId: initiative.id,
          ...data.data,
          analyzedAt: new Date().toISOString()
        };
        setCurrentReport(newReport);
        onSaveReport(newReport);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveAdjustment = () => {
    if (!currentReport) return;
    const updated: SimilarityReport = {
      ...currentReport,
      overallPercent: adjustedPercent,
      manualAdjustment: {
        isAdjusted: true,
        adjustedPercent,
        reason: adjustReason || 'Hội đồng thẩm định bóc tách các đoạn trích dẫn luật và thuật ngữ hành chính quy định.',
        adjustedBy: 'Hội đồng xét sáng kiến cấp cơ sở xã Văn Môn',
        adjustedAt: new Date().toISOString()
      }
    };
    setCurrentReport(updated);
    onSaveReport(updated);
    setShowAdjustPanel(false);
  };

  const segments = currentReport?.segments || [];
  const filteredSegments = segments.filter(seg => {
    if (filterType === 'all') return true;
    if (filterType === 'legal_quote') return seg.similarityType === 'legal_quote';
    if (filterType === 'semantic') return seg.similarityType === 'semantic';
    if (filterType === 'exact') return seg.similarityType === 'exact';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Phân tích Tương đồng & Trùng lặp Đa tầng (4 Cấp độ · 5 Chỉ số)</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 truncate">
              {initiative.code} · {initiative.title}
            </h3>
            <p className="text-xs text-slate-500">
              Đối chiếu với kho sáng kiến xã Văn Môn, thành phố Bắc Ninh và quy phạm pháp luật
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nguyên tắc cảnh báo theo Non-negotiables */}
        <div className="bg-amber-50/70 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Nguyên tắc bất biến:</strong> Tỷ lệ tương đồng là công cụ hỗ trợ kỹ thuật, không tự động suy luận sáng kiến "không có tính mới" hoặc "vi phạm sao chép". Quyết định cuối cùng thuộc Hội đồng.
            </span>
          </div>
          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium flex items-center gap-1 shrink-0 ml-3"
          >
            {isScanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            <span>Quét lại toàn diện</span>
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-800">
          
          {/* 5 Chỉ số Tương đồng (Tabular Grid) */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Bảng Phân tách 05 Chỉ số Mức độ Tương đồng</span>
              {currentReport?.manualAdjustment?.isAdjusted && (
                <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Đã được Hội đồng điều chỉnh bóc tách
                </span>
              )}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
              <div className="bg-white p-3 rounded border border-slate-200 text-center">
                <span className="text-slate-500 text-[10px] block font-sans">TỔNG THỂ</span>
                <span className={`text-xl font-bold tabular-nums ${
                  (currentReport?.overallPercent || 0) > 30 ? 'text-amber-700' : 'text-slate-900'
                }`}>
                  {currentReport?.overallPercent?.toFixed(1) || '0.0'}%
                </span>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200 text-center">
                <span className="text-slate-500 text-[10px] block font-sans">CÂU CHỮ (LEXICAL)</span>
                <span className="text-base font-bold tabular-nums text-slate-700">
                  {currentReport?.lexicalPercent?.toFixed(1) || '0.0'}%
                </span>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200 text-center">
                <span className="text-slate-500 text-[10px] block font-sans">NGỮ NGHĨA (SEMANTIC)</span>
                <span className="text-base font-bold tabular-nums text-slate-700">
                  {currentReport?.semanticPercent?.toFixed(1) || '0.0'}%
                </span>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200 text-center">
                <span className="text-slate-500 text-[10px] block font-sans">GIẢI PHÁP</span>
                <span className="text-base font-bold tabular-nums text-slate-700">
                  {currentReport?.solutionPercent?.toFixed(1) || '0.0'}%
                </span>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200 text-center">
                <span className="text-slate-500 text-[10px] block font-sans">QUY TRÌNH</span>
                <span className="text-base font-bold tabular-nums text-slate-700">
                  {currentReport?.processPercent?.toFixed(1) || '0.0'}%
                </span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
              <div>Nguồn có tỷ lệ trùng cao nhất: <strong>{currentReport?.highestSourceTitle || 'Không phát hiện'}</strong> ({currentReport?.highestSourceMatchRate || 0}%)</div>
              <div>Độ tin cậy thuật toán: <strong className="font-mono text-indigo-700">{currentReport?.confidenceScore || 90}%</strong></div>
            </div>
          </div>

          {/* Nhận xét phân tích của hệ thống */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-1.5">
            <span className="font-bold text-slate-900">Phân tích Tổng hợp Chuyên môn:</span>
            <p className="text-slate-700 leading-relaxed text-justify">
              {currentReport?.aiAnalysisSummary || 'Hệ thống đang tiến hành đối chiếu cơ sở dữ liệu.'}
            </p>
          </div>

          {/* Bảng so sánh các đoạn tương đồng (Side-by-side Snippets) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="font-bold text-slate-900">
                Chi tiết các Đoạn Tương đồng phát hiện được ({segments.length} đoạn)
              </h4>

              {/* Bộ lọc loại trùng */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-[11px]">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded font-medium ${filterType === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
                >
                  Tất cả ({segments.length})
                </button>
                <button
                  onClick={() => setFilterType('legal_quote')}
                  className={`px-2 py-0.5 rounded font-medium ${filterType === 'legal_quote' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
                >
                  Trích dẫn luật / Quy chuẩn
                </button>
                <button
                  onClick={() => setFilterType('semantic')}
                  className={`px-2 py-0.5 rounded font-medium ${filterType === 'semantic' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
                >
                  Tương đồng ngữ nghĩa
                </button>
              </div>
            </div>

            {filteredSegments.length === 0 ? (
              <div className="py-8 text-center text-slate-400 bg-slate-50 rounded border border-slate-200">
                Không có đoạn tương đồng nào thuộc nhóm lọc này.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSegments.map((seg, idx) => (
                  <div key={seg.id || idx} className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
                    <div className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-400">#{idx + 1}</span>
                        <span className="font-semibold text-slate-800">
                          {seg.similarityType === 'legal_quote' ? 'Trích dẫn văn bản QPPL hợp pháp' : 'Tương đồng nội dung'}
                        </span>
                        {seg.isJustifiedOrLegal && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Loại trừ (Không tính sao chép)
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-red-800 tabular-nums">
                        Trùng khớp {seg.similarityPercent}%
                      </span>
                    </div>

                    {/* So sánh 2 cột song song */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Đoạn trong hồ sơ */}
                      <div className="bg-red-50/50 p-3 rounded border border-red-100 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-red-900 block">
                          Đoạn trích trong hồ sơ sáng kiến:
                        </span>
                        <p className="text-slate-800 leading-relaxed font-sans text-justify">
                          "{seg.suspectExcerpt}"
                        </p>
                      </div>

                      {/* Đoạn trong tài liệu nguồn */}
                      <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-600 block">
                          Đoạn đối chiếu trong tài liệu nguồn:
                        </span>
                        <p className="text-slate-700 leading-relaxed font-sans text-justify">
                          "{seg.matchedSourceExcerpt}"
                        </p>
                        <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 mt-2">
                          Nguồn: <strong>{seg.sourceDocName}</strong> ({seg.sourceAuthorOrOrg})
                        </div>
                      </div>
                    </div>

                    {/* Nhận xét ghi nhận của Hội đồng */}
                    {seg.councilNote && (
                      <div className="text-[11px] bg-slate-50 p-2 rounded text-slate-600 border border-slate-100">
                        <strong className="text-slate-800">Ghi chú của Hội đồng:</strong> {seg.councilNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bảng điều chỉnh kết luận thủ công của Hội đồng */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">
                  Điều chỉnh Kết quả Thẩm định Thủ công (Quyền hạn Hội đồng)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dành cho Thư ký và Chủ tịch Hội đồng loại trừ các đoạn trích dẫn luật định và giải trình hợp pháp.
                </p>
              </div>

              <button
                onClick={() => setShowAdjustPanel(!showAdjustPanel)}
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-medium text-xs text-slate-700 transition-colors"
              >
                {showAdjustPanel ? 'Thu gọn' : 'Mở biểu mẫu điều chỉnh'}
              </button>
            </div>

            {showAdjustPanel && (
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Tỷ lệ tương đồng sau điều chỉnh (%):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={adjustedPercent}
                      onChange={(e) => setAdjustedPercent(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Lý do điều chỉnh (Căn cứ giải trình của tác giả / loại trừ văn bản QPPL):
                    </label>
                    <input
                      type="text"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      placeholder="Ghi rõ lý do điều chỉnh..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveAdjustment}
                    className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-xs shadow-xs"
                  >
                    Lưu ghi nhận điều chỉnh của Hội đồng
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Hệ thống đối soát theo Nghị định số 13/2012/NĐ-CP và Quyết định 19/2020/QĐ-UBND tỉnh Bắc Ninh
          </span>
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
