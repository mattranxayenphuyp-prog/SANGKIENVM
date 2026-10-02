import React, { useState } from 'react';
import { LegalDocument, User } from '../types';
import { 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Scale, 
  Search,
  FileText,
  ShieldCheck,
  Building,
  Plus,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  X,
  Calendar,
  Layers,
  History,
  Info
} from 'lucide-react';

interface LegalDocsModalProps {
  legalDocs: LegalDocument[];
  onAddDoc?: (doc: LegalDocument) => void;
  onReplaceDoc?: (docId: string, replacedBy: string, replacementDocId?: string, replacedDate?: string, reason?: string) => void;
  currentUser?: User;
}

export const LegalDocsModal: React.FC<LegalDocsModalProps> = ({ 
  legalDocs,
  onAddDoc,
  onReplaceDoc,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'replaced'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'central' | 'provincial' | 'commune'>('all');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [replaceTargetDoc, setReplaceTargetDoc] = useState<LegalDocument | null>(null);

  // New Doc Form State
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newIssuer, setNewIssuer] = useState('Hội đồng Sáng kiến tỉnh Bắc Ninh');
  const [newIssuedDate, setNewIssuedDate] = useState(new Date().toLocaleDateString('vi-VN'));
  const [newEffectiveDate, setNewEffectiveDate] = useState(new Date().toLocaleDateString('vi-VN'));
  const [newStatus, setNewStatus] = useState<'active' | 'replaced'>('active');
  const [newAppliedClauses, setNewAppliedClauses] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newCategory, setNewCategory] = useState<'central' | 'provincial' | 'commune'>('provincial');

  // Replace Doc Form State
  const [replacementDocId, setReplacementDocId] = useState('');
  const [customReplacedBy, setCustomReplacedBy] = useState('');
  const [replaceDate, setReplaceDate] = useState(new Date().toLocaleDateString('vi-VN'));
  const [replaceReason, setReplaceReason] = useState('Ban hành văn bản mới thay thế theo quy định của cơ quan nhà nước có thẩm quyền.');

  // Filtering
  const filteredDocs = legalDocs.filter(d => {
    const matchesSearch = 
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.appliedClauses.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && d.status === 'active') ||
      (statusFilter === 'replaced' && (d.status === 'replaced' || d.status === 'expired'));

    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activeCount = legalDocs.filter(d => d.status === 'active').length;
  const replacedCount = legalDocs.filter(d => d.status === 'replaced' || d.status === 'expired').length;

  // Handle Add New Doc
  const handleAddNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocNumber.trim() || !newTitle.trim()) {
      alert('Vui lòng nhập số hiệu và tên văn bản.');
      return;
    }

    const newDoc: LegalDocument = {
      id: `leg-${Date.now()}`,
      docNumber: newDocNumber,
      title: newTitle,
      issuer: newIssuer,
      issuedDate: newIssuedDate,
      effectiveDate: newEffectiveDate,
      status: newStatus,
      appliedClauses: newAppliedClauses || 'Áp dụng đối với quy trình xét công nhận sáng kiến cấp cơ sở',
      summary: newSummary || newTitle,
      linkUrl: newLinkUrl || undefined,
      category: newCategory
    };

    if (onAddDoc) {
      onAddDoc(newDoc);
    }
    setIsAddModalOpen(false);
    // Reset form
    setNewDocNumber('');
    setNewTitle('');
    setNewAppliedClauses('');
    setNewSummary('');
    setNewLinkUrl('');
  };

  // Handle Execute Replacement
  const handleConfirmReplacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceTargetDoc) return;

    let targetReplacedByName = customReplacedBy;
    if (replacementDocId) {
      const found = legalDocs.find(d => d.id === replacementDocId);
      if (found) {
        targetReplacedByName = `${found.title} (${found.docNumber})`;
      }
    }

    if (!targetReplacedByName.trim()) {
      alert('Vui lòng chọn hoặc nhập tên văn bản thay thế.');
      return;
    }

    if (onReplaceDoc) {
      onReplaceDoc(
        replaceTargetDoc.id,
        targetReplacedByName,
        replacementDocId || undefined,
        replaceDate,
        replaceReason
      );
    }
    setReplaceTargetDoc(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-800">
            <Scale className="w-4 h-4" />
            <span>Kho Căn cứ Pháp lý & Biểu mẫu Chuẩn Có Thẩm Quyền</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Hệ thống Văn bản Quy phạm Pháp luật Quản lý Hoạt động Sáng kiến
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nguyên tắc bắt buộc: Mọi tiêu chí đánh giá phải truy xuất được về văn bản hoặc biểu mẫu đang có hiệu lực. Văn bản hết hiệu lực phải được thay thế kịp thời.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm văn bản căn cứ mới</span>
          </button>
        </div>
      </div>

      {/* KPI Stats & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            statusFilter === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Toàn bộ văn bản căn cứ</span>
            <BookOpen className="w-4 h-4 opacity-70" />
          </div>
          <div className="text-2xl font-bold font-mono mt-2">{legalDocs.length}</div>
          <p className={`text-[11px] mt-1 ${statusFilter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
            Bao gồm văn bản Trung ương, Tỉnh Bắc Ninh và Xã Văn Môn
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('active')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            statusFilter === 'active' ? 'bg-emerald-800 text-white border-emerald-900' : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 font-bold" style={{ color: statusFilter === 'active' ? '#fff' : undefined }}>
              Đang có hiệu lực áp dụng
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" style={{ color: statusFilter === 'active' ? '#fff' : undefined }} />
          </div>
          <div className="text-2xl font-bold font-mono mt-2 text-emerald-700" style={{ color: statusFilter === 'active' ? '#fff' : undefined }}>
            {activeCount}
          </div>
          <p className={`text-[11px] mt-1 ${statusFilter === 'active' ? 'text-emerald-100' : 'text-slate-500'}`}>
            Văn bản làm căn cứ trực tiếp để Hội đồng chấm điểm năm 2026
          </p>
        </div>

        <div 
          onClick={() => setStatusFilter('replaced')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            statusFilter === 'replaced' ? 'bg-amber-800 text-white border-amber-900' : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 font-bold" style={{ color: statusFilter === 'replaced' ? '#fff' : undefined }}>
              Đã hết hiệu lực / Đã thay thế
            </span>
            <RefreshCw className="w-4 h-4 text-amber-600" style={{ color: statusFilter === 'replaced' ? '#fff' : undefined }} />
          </div>
          <div className="text-2xl font-bold font-mono mt-2 text-amber-800" style={{ color: statusFilter === 'replaced' ? '#fff' : undefined }}>
            {replacedCount}
          </div>
          <p className={`text-[11px] mt-1 ${statusFilter === 'replaced' ? 'text-amber-100' : 'text-slate-500'}`}>
            Đã có văn bản mới thay thế - Lưu trữ để đối soát lịch sử các năm cũ
          </p>
        </div>
      </div>

      {/* Sơ đồ chuyển tiếp thay thế văn bản mới (Visual Replacement Notice) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <History className="w-4 h-4 text-amber-700" />
          <span>Thông báo chuyển tiếp & Thay thế văn bản quy định tại tỉnh Bắc Ninh:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
          <div className="bg-white/80 p-2.5 rounded border border-amber-200/70 space-y-1">
            <span className="font-bold text-red-900">1. Hướng dẫn nghiệp vụ:</span>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="line-through text-slate-400">HD 425/HD-SKHCN</span>
              <ArrowRight className="w-3 h-3 text-emerald-600" />
              <strong className="text-emerald-700">HD 1603/HD-HĐSK (2025)</strong>
            </div>
          </div>

          <div className="bg-white/80 p-2.5 rounded border border-amber-200/70 space-y-1">
            <span className="font-bold text-red-900">2. Quy chế Hội đồng sáng kiến:</span>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="line-through text-slate-400">QĐ 19/2020/QĐ-UBND</span>
              <ArrowRight className="w-3 h-3 text-emerald-600" />
              <strong className="text-emerald-700">QĐ 404/QĐ-HĐSK (2025)</strong>
            </div>
          </div>

          <div className="bg-white/80 p-2.5 rounded border border-amber-200/70 space-y-1">
            <span className="font-bold text-red-900">3. Thi đua khen thưởng & Cơ sở:</span>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="line-through text-slate-400">TT 01/2024/TT-BNV</span>
              <ArrowRight className="w-3 h-3 text-emerald-600" />
              <strong className="text-emerald-700">TT 15/2025/TT-BNV (2025)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo số hiệu (1603, 13/2012...), tên văn bản, cơ quan ban hành, điều khoản..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-600"
          >
            <option value="all">Tất cả cấp cơ quan</option>
            <option value="central">Cấp Trung ương (Chính phủ, Bộ)</option>
            <option value="provincial">Cấp Tỉnh & Thành phố Bắc Ninh</option>
            <option value="commune">Cấp Xã Văn Môn</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-600"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Chỉ văn bản Còn hiệu lực</option>
            <option value="replaced">Chỉ văn bản Đã hết hiệu lực / Được thay thế</option>
          </select>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-slate-500 text-xs">
            Không tìm thấy văn bản pháp lý phù hợp với điều kiện tìm kiếm.
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isReplaced = doc.status === 'replaced' || doc.status === 'expired';

            return (
              <div 
                key={doc.id} 
                className={`p-5 rounded-lg border transition-all ${
                  isReplaced 
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300' 
                    : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                
                {/* Header card */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                        isReplaced 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {doc.docNumber}
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs font-semibold text-slate-700">{doc.issuer}</span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-500">Ban hành: {doc.issuedDate}</span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-500">Hiệu lực từ: {doc.effectiveDate}</span>
                    </div>

                    <h3 className={`text-sm font-bold leading-snug ${isReplaced ? 'text-slate-700 line-through decoration-amber-600' : 'text-slate-900'}`}>
                      {doc.title}
                    </h3>
                  </div>

                  {/* Badges & Action Buttons */}
                  <div className="shrink-0 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {isReplaced ? (
                      <span className="text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>HẾT HIỆU LỰC (ĐÃ THAY THẾ)</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Còn hiệu lực</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setReplaceTargetDoc(doc);
                            setCustomReplacedBy('');
                            setReplacementDocId('');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-medium rounded border border-slate-300 hover:border-amber-300 transition-colors flex items-center gap-1"
                          title="Cập nhật khi văn bản này bị bãi bỏ hoặc thay thế bởi văn bản mới"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Thay thế bằng VB mới</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Replacement Notification Banner for replaced docs */}
                {isReplaced && (
                  <div className="my-3 p-3 bg-amber-100/70 border border-amber-300 rounded text-xs text-amber-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>CĂN CỨ THAY THẾ & KHUYẾN CÁO PHÁP LÝ:</span>
                    </div>
                    <p>
                      <strong>Văn bản thay thế:</strong> {doc.replacedBy || 'Đã có văn bản mới ban hành thay thế'}
                    </p>
                    {doc.replacedDate && (
                      <p>
                        <strong>Thời điểm hết hiệu lực:</strong> Kể từ ngày {doc.replacedDate}
                      </p>
                    )}
                    {doc.replacedReason && (
                      <p className="text-amber-900/90">
                        <strong>Lý do thay thế:</strong> {doc.replacedReason}
                      </p>
                    )}
                    <p className="text-[11px] text-red-800 pt-0.5 font-medium">
                      * Chú ý: Thành viên Hội đồng sáng kiến không áp dụng biểu mẫu hoặc thang điểm của văn bản này cho các hồ sơ sáng kiến xét từ năm 2026.
                    </p>
                  </div>
                )}

                {/* Content summary */}
                <div className="text-xs text-slate-700 leading-relaxed text-justify mt-2.5">
                  {doc.summary}
                </div>

                {/* Applied clauses in software */}
                <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-800" />
                    <span>Điều khoản trực tiếp áp dụng trong phần mềm:</span>
                  </span>
                  <p className="text-slate-600 pl-5">{doc.appliedClauses}</p>
                </div>

                {doc.linkUrl && (
                  <div className="text-right pt-2">
                    <a 
                      href={doc.linkUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-indigo-700 hover:text-indigo-900 font-medium inline-flex items-center gap-1"
                    >
                      <span>Xem toàn văn trên Cổng Thông tin điện tử</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: THÊM VĂN BẢN CĂN CỨ MỚI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Bổ Sung Văn Bản Căn Cứ Pháp Lý Mới
                </h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewDoc} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Số, ký hiệu văn bản *:</label>
                  <input
                    type="text"
                    value={newDocNumber}
                    onChange={(e) => setNewDocNumber(e.target.value)}
                    placeholder="Ví dụ: 1603/HD-HĐSK, 28/KH-UBND..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Cơ quan ban hành *:</label>
                  <input
                    type="text"
                    value={newIssuer}
                    onChange={(e) => setNewIssuer(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Tên văn bản / Trích yếu nội dung *:</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ví dụ: Hướng dẫn về Hoạt động sáng kiến trên địa bàn tỉnh Bắc Ninh..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none font-medium text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Cấp cơ quan:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="central">Cấp Trung ương (Chính phủ, Bộ)</option>
                    <option value="provincial">Cấp Tỉnh & Thành phố Bắc Ninh</option>
                    <option value="commune">Cấp Xã Văn Môn</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Trạng thái hiệu lực:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="active">Còn hiệu lực áp dụng</option>
                    <option value="replaced">Đã hết hiệu lực / Đã thay thế</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Ngày ban hành:</label>
                  <input
                    type="text"
                    value={newIssuedDate}
                    onChange={(e) => setNewIssuedDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Ngày có hiệu lực:</label>
                  <input
                    type="text"
                    value={newEffectiveDate}
                    onChange={(e) => setNewEffectiveDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Điều khoản trực tiếp áp dụng trong phần mềm:</label>
                  <input
                    type="text"
                    value={newAppliedClauses}
                    onChange={(e) => setNewAppliedClauses(e.target.value)}
                    placeholder="Ví dụ: Điều 3, Điều 4 về tính mới; Biểu mẫu số 01/SK và 02/SK..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Tóm tắt nội dung quy định:</label>
                  <textarea
                    rows={3}
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Tóm tắt các điểm chính quy định về điều kiện công nhận, quy trình xét và thẩm quyền của Hội đồng..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Đường dẫn tra cứu / tải tệp toàn văn:</label>
                  <input
                    type="text"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded shadow-xs"
                >
                  Lưu & Bổ sung văn bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: THAY THẾ VĂN BẢN ĐÃ HẾT HIỆU LỰC */}
      {replaceTargetDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Thay Thế Văn Bản Hết Hiệu Lực
                </h3>
              </div>
              <button 
                onClick={() => setReplaceTargetDoc(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-red-800">Văn bản cần đánh dấu hết hiệu lực:</span>
              <p className="font-semibold text-slate-900">{replaceTargetDoc.title}</p>
              <p className="text-slate-500 font-mono">Số hiệu: {replaceTargetDoc.docNumber} · Ban hành: {replaceTargetDoc.issuedDate}</p>
            </div>

            <form onSubmit={handleConfirmReplacement} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Chọn văn bản mới thay thế từ kho:</label>
                <select
                  value={replacementDocId}
                  onChange={(e) => {
                    setReplacementDocId(e.target.value);
                    const found = legalDocs.find(d => d.id === e.target.value);
                    if (found) {
                      setCustomReplacedBy(`${found.title} (${found.docNumber})`);
                    }
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                >
                  <option value="">-- Chọn văn bản có sẵn hoặc nhập bên dưới --</option>
                  {legalDocs
                    .filter(d => d.id !== replaceTargetDoc.id && d.status === 'active')
                    .map(d => (
                      <option key={d.id} value={d.id}>
                        {d.docNumber} - {d.title.substring(0, 50)}...
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Hoặc ghi rõ tên/số hiệu văn bản mới thay thế:</label>
                <input
                  type="text"
                  value={customReplacedBy}
                  onChange={(e) => setCustomReplacedBy(e.target.value)}
                  placeholder="Ví dụ: Hướng dẫn số 1603/HD-HĐSK ngày 19/8/2025 của Hội đồng Sáng kiến tỉnh Bắc Ninh..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Thời điểm văn bản mới có hiệu lực thay thế:</label>
                <input
                  type="text"
                  value={replaceDate}
                  onChange={(e) => setReplaceDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Lý do thay thế & Căn cứ bãi bỏ:</label>
                <textarea
                  rows={2}
                  value={replaceReason}
                  onChange={(e) => setReplaceReason(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900">
                <strong>Hậu quả pháp lý:</strong> Sau khi xác nhận, văn bản này sẽ được đánh dấu <em>"Đã hết hiệu lực"</em> và cảnh báo Hội đồng không được áp dụng làm căn cứ biểu mẫu cho các sáng kiến mới.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplaceTargetDoc(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded shadow-xs"
                >
                  Xác nhận thay thế văn bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
