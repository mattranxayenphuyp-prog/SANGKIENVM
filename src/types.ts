export type UserRole = 
  | 'admin'               // Quản trị hệ thống
  | 'receptionist'        // Cán bộ tiếp nhận hồ sơ
  | 'council_president'   // Lãnh đạo / Chủ tịch Hội đồng (Phê duyệt)
  | 'council_secretary'   // Thư ký Hội đồng
  | 'evaluator'           // Thành viên Hội đồng / Người chấm độc lập
  | 'author'              // Tác giả / Người nộp sáng kiến
  | 'viewer';             // Người xem báo cáo

export interface User {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  phone?: string;
  email?: string;
  assignedInitiativeIds?: string[];
}

export type InitiativeStatus = 
  | 'draft'               // Mới tạo
  | 'submitted'           // Đã nộp
  | 'under_review'        // Đang kiểm tra điều kiện
  | 'eligible'            // Đủ điều kiện xét
  | 'evaluating'          // Đang chấm độc lập
  | 'synthesizing'        // Đang tổng hợp kết quả
  | 'recommended'         // Đề nghị công nhận
  | 'approved'            // Đã công nhận
  | 'rejected'            // Không công nhận
  | 'archived';           // Lưu trữ

export type InitiativeField = 
  | 'administrative_reform'   // Cải cách hành chính & Chuyển đổi số
  | 'education_training'      // Giáo dục và Đào tạo
  | 'health_social'           // Y tế - Xã hội
  | 'environment_craft_village' // Môi trường & Làng nghề (Đặc thù Văn Môn)
  | 'agriculture_rural'       // Nông nghiệp & Nông thôn mới
  | 'security_order'          // An ninh trật tự & Quân sự địa phương
  | 'party_unions';           // Công tác Đảng, Đoàn thể

export interface DocumentAttachment {
  id: string;
  name: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'image';
  fileSize: string;
  uploadDate: string;
  category: 'report' | 'evidence' | 'decision' | 'minutes';
  url?: string;
  extractedSnippet?: string;
}

export interface Initiative {
  id: string;
  code: string;                       // Mã sáng kiến (ví dụ: SK-2026-VM01)
  title: string;                      // Tên sáng kiến
  author: string;                     // Tác giả chính
  authorTitle: string;                // Chức vụ tác giả
  authorUnit: string;                 // Cơ quan / Đơn vị
  authorDob?: string;                 // Năm sinh
  coAuthors: string[];                // Đồng tác giả
  field: InitiativeField;             // Lĩnh vực áp dụng
  year: number;                       // Năm xét sáng kiến
  executionPeriod: string;            // Thời gian thực hiện
  applicationStartDate: string;       // Thời điểm bắt đầu áp dụng
  applicationScope: string;           // Địa bàn / Đơn vị áp dụng thực tế
  summary: string;                    // Tóm tắt sáng kiến
  currentStatusBefore: string;        // Thực trạng trước khi áp dụng
  solutionContent: string;            // Nội dung giải pháp
  noveltyPoints: string;              // Điểm mới của giải pháp
  applicationCapacity: string;        // Khả năng áp dụng & nhân rộng
  economicBenefit: string;            // Hiệu quả kinh tế (định lượng / định tính)
  economicDataVerified: boolean;      // Có số liệu kiểm chứng hay chưa
  socialBenefit: string;              // Hiệu quả xã hội
  attachments: DocumentAttachment[];  // Hồ sơ, tài liệu minh chứng kèm theo
  status: InitiativeStatus;           // Trạng thái hồ sơ
  assignedEvaluatorIds: string[];     // Danh sách giám khảo được phân công
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationCriterion {
  id: string;
  code: string;                       // A1, A2, B1, B2, C1, D1, D2
  group: 'A' | 'B' | 'C' | 'D';        // A: Tính mới, B: Khả năng áp dụng, C: Hiệu quả kinh tế, D: Hiệu quả xã hội
  groupName: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
  passingScore: number;
  isDisqualifyingIfFail: boolean;     // Điều kiện loại nếu không đạt
  requiredEvidence: string;
  legalRef: string;                   // Căn cứ pháp lý theo Điều lệ sáng kiến
}

export interface CriterionScoreInput {
  criterionId: string;
  score: number;
  comment: string;
}

export interface EvaluatorScoreSheet {
  id: string;
  initiativeId: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorTitle: string;
  scores: Record<string, CriterionScoreInput>; // Key là criterionId
  totalScore: number;
  noveltyScore: number;
  applicabilityScore: number;
  economicScore: number;
  socialScore: number;
  generalComment: string;
  recommendation: 'recommended' | 'request_changes' | 'rejected';
  isCompleted: boolean;
  submittedAt?: string;
}

export interface SimilaritySegment {
  id: string;
  similarityType: 'exact' | 'semantic' | 'process' | 'legal_quote' | 'standard_term';
  similarityPercent: number;
  suspectExcerpt: string;
  matchedSourceExcerpt: string;
  sourceDocName: string;
  sourceAuthorOrOrg: string;
  sourceType: 'internal_archive' | 'district_province_database' | 'public_internet' | 'legal_normative';
  isJustifiedOrLegal: boolean;        // Là căn cứ pháp lý/thuật ngữ hợp pháp không coi là sao chép
  councilNote?: string;
}

export interface SimilarityReport {
  id: string;
  initiativeId: string;
  overallPercent: number;             // Tương đồng tổng thể
  lexicalPercent: number;             // Tương đồng câu chữ
  semanticPercent: number;            // Tương đồng ngữ nghĩa
  solutionPercent: number;            // Tương đồng giải pháp
  processPercent: number;             // Tương đồng quy trình
  highestSourceTitle: string;
  highestSourceMatchRate: number;
  segments: SimilaritySegment[];
  aiAnalysisSummary: string;
  confidenceScore: number;            // Mức độ tin cậy AI (0 - 100%)
  analyzedAt: string;
  manualAdjustment?: {
    isAdjusted: boolean;
    adjustedPercent: number;
    reason: string;
    adjustedBy: string;
    adjustedAt: string;
  };
}

export interface LegalDocument {
  id: string;
  docNumber: string;                  // Số, ký hiệu
  title: string;                      // Tên văn bản
  issuer: string;                     // Cơ quan ban hành
  issuedDate: string;                 // Ngày ban hành
  effectiveDate: string;              // Ngày hiệu lực
  status: 'active' | 'expired' | 'replaced';
  replacedBy?: string;                // Tên/Số văn bản thay thế (nếu đã hết hiệu lực)
  replacementDocId?: string;          // ID văn bản mới thay thế
  replacedDate?: string;              // Ngày văn bản mới thay thế có hiệu lực
  replacedReason?: string;            // Căn cứ lý do thay thế
  appliedClauses: string;             // Điều khoản áp dụng
  linkUrl?: string;
  summary: string;
  category?: 'central' | 'provincial' | 'commune';
}

export interface CouncilSummaryResult {
  initiativeId: string;
  code: string;
  title: string;
  author: string;
  authorUnit: string;
  field: string;
  totalEvaluators: number;
  completedEvaluators: number;
  evaluatorScores: {
    evaluatorId: string;
    evaluatorName: string;
    score: number;
    completed: boolean;
  }[];
  averageScore: number;
  averageNoveltyScore: number;
  similarityOverallPercent: number;
  finalConclusion: 'recommended' | 'request_changes' | 'rejected' | 'pending';
  councilRemarks: string;
  isLocked: boolean;
  lockedAt?: string;
  lockedBy?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}
