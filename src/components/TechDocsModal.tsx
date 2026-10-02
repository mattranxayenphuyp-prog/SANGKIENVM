import React, { useState } from 'react';
import { 
  Code2, 
  Database, 
  Cpu, 
  Workflow, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  Layers,
  Sparkles,
  Server
} from 'lucide-react';

export const TechDocsModal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'erd' | 'architecture' | 'ai_algo' | 'user_guide'>('erd');

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-800">
            <Code2 className="w-4 h-4" />
            <span>Tài liệu Kỹ thuật · Thiết kế Hệ thống · Cơ sở Dữ liệu & ERD</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Hồ sơ Thiết kế Kỹ thuật Phần mềm Chấm Sáng kiến Xã Văn Môn
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cung cấp đầy đủ ERD quan hệ, Sơ đồ luồng dữ liệu, Thuật toán so khớp tiếng Việt và Hướng dẫn triển khai.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div>Phiên bản: <strong className="text-red-800">v2.4-PROD</strong></div>
          <div>Cập nhật: <strong>Tháng 10/2026</strong></div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-1 flex flex-wrap gap-1 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveSubTab('erd')}
          className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'erd' ? 'bg-red-700 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Thiết kế CSDL & ERD (18 Thực thể)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('architecture')}
          className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'architecture' ? 'bg-red-700 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Kiến trúc Hệ thống & Quy trình 14 Bước</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ai_algo')}
          className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'ai_algo' ? 'bg-red-700 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Thuật toán AI & Đối soát Trùng lặp</span>
        </button>

        <button
          onClick={() => setActiveSubTab('user_guide')}
          className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'user_guide' ? 'bg-red-700 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Sổ tay Hướng dẫn Sử dụng (UBND Xã)</span>
        </button>
      </div>

      {/* TAB 1: ERD & CSDL */}
      {activeSubTab === 'erd' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4 text-xs text-slate-800">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-red-700" />
              <span>Sơ đồ Quan hệ Thực thể (Entity Relationship Diagram - ERD)</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Cơ sở dữ liệu được thiết kế theo mô hình quan hệ chuẩn hóa 3NF, bảo đảm tính toàn vẹn tham chiếu, bảo vệ kết quả chấm điểm độc lập giữa các giám khảo và bảo toàn dữ liệu các kỳ đã hoàn thành.
            </p>

            {/* Sơ đồ trực quan các bảng chính */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px]">
              
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-red-800 border-b border-slate-200 pb-1">1. Users & Roles</div>
                <div className="text-slate-700">PK id: UUID</div>
                <div className="text-slate-600">username: VARCHAR(50) UNIQUE</div>
                <div className="text-slate-600">role_id: FK -&gt; Roles(id)</div>
                <div className="text-slate-600">full_name: VARCHAR(100)</div>
                <div className="text-slate-600">department: VARCHAR(100)</div>
                <div className="text-slate-600">digital_signature_hash: TEXT</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-red-800 border-b border-slate-200 pb-1">2. Initiatives (Sáng kiến)</div>
                <div className="text-slate-700">PK id: UUID</div>
                <div className="text-slate-600">code: VARCHAR(20) UNIQUE</div>
                <div className="text-slate-600">title: TEXT</div>
                <div className="text-slate-600">author_id: FK -&gt; Users(id)</div>
                <div className="text-slate-600">field_id: FK -&gt; Fields(id)</div>
                <div className="text-slate-600">year: INTEGER</div>
                <div className="text-slate-600">solution_content: TEXT</div>
                <div className="text-slate-600">status: VARCHAR(30)</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-red-800 border-b border-slate-200 pb-1">3. EvaluationCriteria</div>
                <div className="text-slate-700">PK id: UUID</div>
                <div className="text-slate-600">version_id: FK -&gt; RubricVersions(id)</div>
                <div className="text-slate-600">code: VARCHAR(10) (A1, A2...)</div>
                <div className="text-slate-600">group_code: CHAR(1) ('A'|'B'|'C'|'D')</div>
                <div className="text-slate-600">max_score: DECIMAL(4,1)</div>
                <div className="text-slate-600">legal_ref_id: FK -&gt; LegalDocs(id)</div>
                <div className="text-slate-600">is_disqualifying: BOOLEAN</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-red-800 border-b border-slate-200 pb-1">4. EvaluatorScoreSheets</div>
                <div className="text-slate-700">PK id: UUID</div>
                <div className="text-slate-600">initiative_id: FK -&gt; Initiatives(id)</div>
                <div className="text-slate-600">evaluator_id: FK -&gt; Users(id)</div>
                <div className="text-slate-600">total_score: DECIMAL(4,1)</div>
                <div className="text-slate-600">recommendation: VARCHAR(20)</div>
                <div className="text-slate-600">is_submitted: BOOLEAN</div>
                <div className="text-slate-600">submitted_at: TIMESTAMPTZ</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-red-800 border-b border-slate-200 pb-1">5. SimilarityAnalysis</div>
                <div className="text-slate-700">PK id: UUID</div>
                <div className="text-slate-600">initiative_id: FK -&gt; Initiatives(id)</div>
                <div className="text-slate-600">overall_pct: DECIMAL(4,1)</div>
                <div className="text-slate-600">lexical_pct: DECIMAL(4,1)</div>
                <div className="text-slate-600">semantic_pct: DECIMAL(4,1)</div>
                <div className="text-slate-600">legal_excluded_pct: DECIMAL(4,1)</div>
                <div className="text-slate-600">is_manually_adjusted: BOOLEAN</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-red-800 border-b border-slate-200 pb-1">6. AuditLogs</div>
                <div className="text-slate-700">PK id: UUID</div>
                <div className="text-slate-600">user_id: FK -&gt; Users(id)</div>
                <div className="text-slate-600">action: VARCHAR(50)</div>
                <div className="text-slate-600">entity_type: VARCHAR(50)</div>
                <div className="text-slate-600">previous_state: JSONB</div>
                <div className="text-slate-600">new_state: JSONB</div>
                <div className="text-slate-600">created_at: TIMESTAMPTZ</div>
              </div>

            </div>

            {/* DDL Schema mẫu */}
            <div className="space-y-2 pt-2">
              <span className="font-bold text-slate-900 block">Mã nguồn DDL Khởi tạo Cơ sở dữ liệu (PostgreSQL Schema):</span>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-[11px] leading-relaxed font-mono">
{`-- BẢNG SÁNG KIẾN KINH NGHIỆM CẤP CƠ SỞ XÃ VĂN MÔN
CREATE TABLE initiatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    field VARCHAR(50) NOT NULL,
    council_year INT NOT NULL,
    execution_period VARCHAR(100),
    application_scope TEXT NOT NULL,
    summary TEXT NOT NULL,
    current_status_before TEXT NOT NULL,
    solution_content TEXT NOT NULL,
    novelty_points TEXT NOT NULL,
    application_capacity TEXT NOT NULL,
    economic_benefit TEXT,
    economic_data_verified BOOLEAN DEFAULT FALSE,
    social_benefit TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'draft',
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG PHIẾU CHẤM ĐỘC LẬP CỦA THÀNH VIÊN HỘI ĐỒNG
CREATE TABLE evaluator_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID NOT NULL REFERENCES initiatives(id),
    evaluator_id UUID NOT NULL REFERENCES users(id),
    criterion_id VARCHAR(50) NOT NULL,
    score DECIMAL(4,1) NOT NULL CHECK (score >= 0),
    comment TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,
    UNIQUE(initiative_id, evaluator_id, criterion_id)
);`}
              </pre>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: KIẾN TRÚC & WORKFLOW 14 BƯỚC */}
      {activeSubTab === 'architecture' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-6 text-xs text-slate-800">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-red-700" />
              <span>Sơ đồ Kiến trúc & Luồng Nghiệp vụ 14 Bước Chuẩn</span>
            </h3>
            <p className="text-slate-600">
              Mô hình hệ thống phân tán hỗ trợ triển khai linh hoạt: Máy chủ nội bộ tại UBND xã (On-Premises LAN) hoặc Máy chủ Đám mây Chính quyền điện tử.
            </p>
          </div>

          {/* 14 Bước chi tiết */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">Mô tả 14 bước trong chu trình xét sáng kiến:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 1: Tiếp nhận sáng kiến</strong> - Cán bộ tiếp nhận nhập thông tin, tiếp nhận hồ sơ giấy/điện tử.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 2: Kiểm tra điều kiện hồ sơ</strong> - Thư ký Hội đồng rà soát tính hợp lệ theo Điều 5 Thông tư 18.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 3: Phân loại lĩnh vực</strong> - Tự động gắn tag chuyên ngành (CCHC, Môi trường Mẫn Xá, Giáo dục...).
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 4: Kiểm tra trùng / tương đồng</strong> - Quét đối chiếu 4 cấp độ, tách bạch trích dẫn luật định.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 5: Phân công chấm độc lập</strong> - Chủ tịch Hội đồng phê duyệt danh sách giám khảo thẩm định.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 6: Chấm độc lập</strong> - Mỗi giám khảo chấm riêng trên Mẫu số 01/SK, bảo mật điểm của nhau.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 7: Tổng hợp điểm</strong> - Hệ thống tự động tính điểm TB hợp lệ, phát hiện điểm lệch bất thường.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 8: Hội đồng xem xét</strong> - Họp biểu quyết thống nhất theo Mẫu số 03/SK.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 9: Tác giả bổ sung</strong> - Gửi thông báo hoàn thiện nếu rơi vào ngưỡng 60 - 69 điểm.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 10: Chấm / Đánh giá lại</strong> - Hội đồng thẩm định lại hồ sơ sau khi bổ sung minh chứng.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 11: Khóa kết quả</strong> - Đóng băng dữ liệu, ngăn chặn chỉnh sửa trái phép.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 12: Xuất báo cáo</strong> - Tự động sinh báo cáo kết quả riêng cho từng sáng kiến và bảng tổng hợp.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 13: Trình công nhận</strong> - Trình Chủ tịch UBND xã ký Quyết định công nhận cấp cơ sở.
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Bước 14: Lưu trữ & Chuyển giao</strong> - Đưa vào kho dữ liệu tham chiếu phục vụ các năm tiếp theo.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: THUẬT TOÁN AI */}
      {activeSubTab === 'ai_algo' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4 text-xs text-slate-800">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              <span>Thuật toán Đối soát Tương đồng & Bộ lọc Chống Ảo giác AI</span>
            </h3>
            <p className="text-slate-600">
              Kết hợp Exact Matching, N-gram, Cosine Similarity và Mô hình Ngôn ngữ Gemini 3.8 Flash xử lý ngôn ngữ tiếng Việt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900">Xử lý Ngôn ngữ Tiếng Việt Hành chính:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
                <li>Chuẩn hóa dấu thanh tiếng Việt (Bắc Ninh Unicode UTF-8).</li>
                <li>Tách từ ghép hành chính: "thủ tục hành chính", "chuyển đổi số", "dịch vụ công trực tuyến".</li>
                <li>Xử lý chữ viết tắt: TTHC, UBND, HĐND, CĐS, QĐ, NĐ, TT, KHKT.</li>
                <li>Tự động nhận diện và bóc tách các trích dẫn văn bản QPPL để loại khỏi tỷ lệ sao chép.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900">Nguyên tắc Chống Ảo giác (Anti-Hallucination):</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
                <li><strong>Không bịa số liệu:</strong> Nếu hồ sơ không có minh chứng định lượng về kinh tế, AI ghi rõ "Chưa đủ dữ liệu định lượng để xác minh".</li>
                <li><strong>Không tự quyết định:</strong> AI chỉ đóng vai trò phân tích kỹ thuật, không tự ý cấp trạng thái công nhận.</li>
                <li><strong>Tính toán độ tin cậy:</strong> Luôn kèm theo chỉ số Confidence Score (%) cho từng đề xuất.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HƯỚNG DẪN SỬ DỤNG */}
      {activeSubTab === 'user_guide' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4 text-xs text-slate-800 leading-relaxed">
          <h3 className="font-bold text-sm text-slate-900">
            Sổ tay Hướng dẫn Cán bộ UBND Xã Văn Môn
          </h3>
          <div className="space-y-3 text-justify">
            <p>
              <strong>1. Tiếp nhận hồ sơ:</strong> Cán bộ một cửa bấm <em>"Tiếp nhận sáng kiến"</em>, điền đủ 17 trường thông tin theo Thuyết minh của tác giả. Hệ thống tự động cấp mã chuẩn dạng <code>SK-2026-VM01</code>.
            </p>
            <p>
              <strong>2. Kiểm tra tương đồng:</strong> Vào danh sách hồ sơ, bấm nút <em>"Đối soát Tương đồng"</em>. Hệ thống sẽ so khớp nội dung và phân loại các đoạn trích dẫn luật định. Hội đồng có thể ghi nhận giải trình điều chỉnh tỷ lệ nếu cần.
            </p>
            <p>
              <strong>3. Chấm điểm độc lập:</strong> Thành viên Hội đồng đăng nhập tài khoản của mình, mở <em>"Chấm điểm"</em>. Nhập điểm từng tiêu chí (A1, A2, B1, B2, C1, D1, D2). Bấm <em>"Gợi ý nhận xét AI"</em> để nhận gợi ý chuẩn văn phong hành chính. Bấm <em>"Hoàn tất & Ký nộp phiếu"</em>.
            </p>
            <p>
              <strong>4. Tổng hợp & Xuất báo cáo:</strong> Thư ký Hội đồng vào mục <em>"Hội đồng & Biểu mẫu"</em> để xem Mẫu 02/SK, xuất biên bản họp Mẫu 03/SK và Quyết định công nhận. Mở từng hồ sơ để bấm <em>"In Báo cáo (A4)"</em> gửi cấp trên.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
