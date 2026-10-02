import React, { useState } from 'react';
import { 
  Initiative, 
  User, 
  EvaluationCriterion, 
  EvaluatorScoreSheet, 
  SimilarityReport, 
  LegalDocument, 
  AuditLog 
} from './types';
import { 
  INITIAL_CRITERIA, 
  INITIAL_LEGAL_DOCS, 
  INITIAL_USERS, 
  INITIAL_INITIATIVES, 
  INITIAL_SIMILARITY_REPORTS, 
  INITIAL_SCORE_SHEETS, 
  INITIAL_AUDIT_LOGS 
} from './data/initialData';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { InitiativeList } from './components/InitiativeList';
import { InitiativeDetailModal } from './components/InitiativeDetailModal';
import { InitiativeCreateModal } from './components/InitiativeCreateModal';
import { EvaluationScoringModal } from './components/EvaluationScoringModal';
import { SimilarityCheckerModal } from './components/SimilarityCheckerModal';
import { IndividualReportModal } from './components/IndividualReportModal';
import { CouncilSummaryModal } from './components/CouncilSummaryModal';
import { CriteriaConfigModal } from './components/CriteriaConfigModal';
import { LegalDocsModal } from './components/LegalDocsModal';
import { AuditLogModal } from './components/AuditLogModal';
import { TechDocsModal } from './components/TechDocsModal';

export default function App() {
  // Primary States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [allUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[2]); // Default: Mẫn Văn Tuấn - Chủ tịch HĐ
  const [initiatives, setInitiatives] = useState<Initiative[]>(INITIAL_INITIATIVES);
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>(INITIAL_CRITERIA);
  const [scoreSheets, setScoreSheets] = useState<Record<string, EvaluatorScoreSheet[]>>(INITIAL_SCORE_SHEETS);
  const [similarityReports, setSimilarityReports] = useState<Record<string, SimilarityReport>>(INITIAL_SIMILARITY_REPORTS);
  const [legalDocs, setLegalDocs] = useState<LegalDocument[]>(INITIAL_LEGAL_DOCS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modal Control States
  const [detailModalInit, setDetailModalInit] = useState<Initiative | null>(null);
  const [scoreModalInit, setScoreModalInit] = useState<Initiative | null>(null);
  const [similarityModalInit, setSimilarityModalInit] = useState<Initiative | null>(null);
  const [reportModalInit, setReportModalInit] = useState<Initiative | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Helper: Append Audit Log
  const addAuditLog = (action: string, details: string, targetId?: string, targetType?: string, newValue?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.title,
      action,
      targetId,
      targetType,
      details,
      newValue
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler: Add New Legal Document
  const handleAddLegalDoc = (newDoc: LegalDocument) => {
    setLegalDocs(prev => [newDoc, ...prev]);
    addAuditLog(
      'BỔ SUNG VĂN BẢN CĂN CỨ PHÁP LÝ',
      `Thêm mới văn bản số hiệu ${newDoc.docNumber}: ${newDoc.title} do ${newDoc.issuer} ban hành.`,
      newDoc.id,
      'LegalDocument',
      newDoc.title
    );
  };

  // Handler: Replace Expired Legal Document
  const handleReplaceLegalDoc = (
    docId: string, 
    replacedBy: string, 
    replacementDocId?: string, 
    replacedDate?: string, 
    reason?: string
  ) => {
    setLegalDocs(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'replaced',
          replacedBy,
          replacementDocId,
          replacedDate: replacedDate || new Date().toLocaleDateString('vi-VN'),
          replacedReason: reason || 'Đã có văn bản mới ban hành thay thế'
        };
      }
      return d;
    }));

    const target = legalDocs.find(d => d.id === docId);
    addAuditLog(
      'THAY THẾ VĂN BẢN HẾT HIỆU LỰC',
      `Đánh dấu hết hiệu lực văn bản ${target?.docNumber || docId}. Được thay thế bởi: ${replacedBy}. Lý do: ${reason}`,
      docId,
      'LegalDocument',
      `Replaced by ${replacedBy}`
    );
  };

  // Switch User
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    addAuditLog('CHUYỂN_VAI_NGƯỜI_DÙNG', `Đổi phiên làm việc sang tài khoản ${user.name} (${user.title})`);
  };

  // Create Initiative
  const handleCreateInitiative = (newInit: Initiative) => {
    setInitiatives(prev => [newInit, ...prev]);
    addAuditLog('TIẾP_NHẬN_SÁNG_KIẾN', `Cán bộ tiếp nhận đã tạo hồ sơ mới mã số ${newInit.code} - ${newInit.title}`, newInit.id, 'Initiative');
  };

  // Save Evaluator Score Sheet
  const handleSaveScoreSheet = (sheet: EvaluatorScoreSheet) => {
    setScoreSheets(prev => {
      const currentList = prev[sheet.initiativeId] || [];
      const filtered = currentList.filter(s => s.evaluatorId !== sheet.evaluatorId);
      return {
        ...prev,
        [sheet.initiativeId]: [...filtered, sheet]
      };
    });

    addAuditLog(
      sheet.isCompleted ? 'HOÀN_TẤT_PHIẾU_CHẤM' : 'LƯU_NHÁP_PHIẾU_CHẤM',
      `Giám khảo ${sheet.evaluatorName} đã ${sheet.isCompleted ? 'hoàn tất và nộp' : 'lưu nháp'} phiếu chấm điểm cho sáng kiến ${sheet.initiativeId}. Điểm: ${sheet.totalScore}/100.`,
      sheet.id,
      'EvaluatorScoreSheet',
      sheet.totalScore.toString()
    );
  };

  // Save Similarity Report
  const handleSaveSimilarityReport = (report: SimilarityReport) => {
    setSimilarityReports(prev => ({
      ...prev,
      [report.initiativeId]: report
    }));

    addAuditLog(
      'CẬP_NHẬT_TƯƠNG_ĐỒNG',
      `Cập nhật báo cáo đối soát tương đồng cho sáng kiến ${report.initiativeId}. Tỷ lệ tổng thể: ${report.overallPercent}%.`,
      report.id,
      'SimilarityReport'
    );
  };

  // Update Criteria Dynamic Config
  const handleUpdateCriteria = (newCriteria: EvaluationCriterion[]) => {
    setCriteria(newCriteria);
    addAuditLog(
      'CẤU_HÌNH_BỘ_TIÊU_CHÍ',
      `Quản trị viên đã lưu phiên bản cập nhật bộ tiêu chí đánh giá sáng kiến năm 2026.`,
      'rubric-2026',
      'EvaluationCriterion'
    );
  };

  // Lock Council Results
  const handleLockCouncilResults = () => {
    addAuditLog(
      'KHÓA_KẾT_QUẢ_HỘI_ĐỒNG',
      `Chủ tịch Hội đồng đã thực hiện khóa toàn bộ kết quả đánh giá sáng kiến năm 2026. Ngăn chặn chỉnh sửa điểm số.`,
      'council-2026',
      'CouncilMeeting'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* 1. Header (Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* 2. Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <Dashboard
            initiatives={initiatives}
            currentUser={currentUser}
            scoreSheets={scoreSheets}
            onSelectInitiative={(init) => setDetailModalInit(init)}
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* TAB: DANH MỤC SÁNG KIẾN */}
        {activeTab === 'initiatives' && (
          <InitiativeList
            initiatives={initiatives}
            currentUser={currentUser}
            scoreSheets={scoreSheets}
            similarityReports={similarityReports}
            onSelectInitiative={(init) => setDetailModalInit(init)}
            onOpenScoreModal={(init) => setScoreModalInit(init)}
            onOpenSimilarityModal={(init) => setSimilarityModalInit(init)}
            onOpenReportModal={(init) => setReportModalInit(init)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {/* TAB: HỘI ĐỒNG & BIỂU MẪU */}
        {activeTab === 'council' && (
          <CouncilSummaryModal
            initiatives={initiatives}
            scoreSheets={scoreSheets}
            currentUser={currentUser}
            onClose={() => setActiveTab('dashboard')}
            onLockCouncilResults={handleLockCouncilResults}
          />
        )}

        {/* TAB: CĂN CỨ PHÁP LÝ */}
        {activeTab === 'legal' && (
          <LegalDocsModal 
            legalDocs={legalDocs} 
            onAddDoc={handleAddLegalDoc}
            onReplaceDoc={handleReplaceLegalDoc}
            currentUser={currentUser}
          />
        )}

        {/* TAB: BỘ TIÊU CHÍ */}
        {activeTab === 'criteria' && (
          <CriteriaConfigModal
            criteria={criteria}
            onUpdateCriteria={handleUpdateCriteria}
            isAdmin={currentUser.role === 'admin' || currentUser.role === 'council_president'}
          />
        )}

        {/* TAB: NHẬT KÝ KIỂM TOÁN */}
        {activeTab === 'audit' && (
          <AuditLogModal logs={auditLogs} />
        )}

        {/* TAB: KỸ THUẬT & ERD */}
        {activeTab === 'tech_docs' && (
          <TechDocsModal />
        )}

      </main>

      {/* Footer Trang trọng */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ỦY BAN NHÂN DÂN XÃ VĂN MÔN</span>
            <span>·</span>
            <span>Thành phố Bắc Ninh</span>
          </div>
          <div>
            Hệ thống Quản lý và Đánh giá Sáng kiến Kinh nghiệm Cấp cơ sở tích hợp AI © 2026
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* Modal 1: Chi tiết hồ sơ 17 mục & phân tích */}
      {detailModalInit && (
        <InitiativeDetailModal
          initiative={detailModalInit}
          onClose={() => setDetailModalInit(null)}
          currentUser={currentUser}
          criteria={criteria}
          scoreSheets={scoreSheets[detailModalInit.id] || []}
          similarityReport={similarityReports[detailModalInit.id]}
          onOpenScoreModal={(init) => {
            setDetailModalInit(null);
            setScoreModalInit(init);
          }}
          onOpenSimilarityModal={(init) => {
            setDetailModalInit(null);
            setSimilarityModalInit(init);
          }}
          onOpenReportModal={(init) => {
            setDetailModalInit(null);
            setReportModalInit(init);
          }}
          onUpdateInitiativeStatus={(id, status) => {
            setInitiatives(prev => prev.map(i => i.id === id ? { ...i, status } : i));
          }}
        />
      )}

      {/* Modal 2: Phiếu chấm điểm độc lập */}
      {scoreModalInit && (
        <EvaluationScoringModal
          initiative={scoreModalInit}
          currentUser={currentUser}
          criteria={criteria}
          existingScoreSheet={scoreSheets[scoreModalInit.id]?.find(s => s.evaluatorId === currentUser.id)}
          onClose={() => setScoreModalInit(null)}
          onSaveScoreSheet={handleSaveScoreSheet}
        />
      )}

      {/* Modal 3: Kiểm tra tương đồng 4 cấp độ */}
      {similarityModalInit && (
        <SimilarityCheckerModal
          initiative={similarityModalInit}
          report={similarityReports[similarityModalInit.id]}
          onClose={() => setSimilarityModalInit(null)}
          onSaveReport={handleSaveSimilarityReport}
        />
      )}

      {/* Modal 4: Báo cáo kết quả riêng cho từng sáng kiến (Mẫu in A4) */}
      {reportModalInit && (
        <IndividualReportModal
          initiative={reportModalInit}
          scoreSheets={scoreSheets[reportModalInit.id] || []}
          similarityReport={similarityReports[reportModalInit.id]}
          criteria={criteria}
          onClose={() => setReportModalInit(null)}
        />
      )}

      {/* Modal 5: Tiếp nhận sáng kiến mới */}
      {isCreateModalOpen && (
        <InitiativeCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateInitiative}
          existingCount={initiatives.length}
          currentUser={currentUser}
        />
      )}

    </div>
  );
}
