import React from 'react';
import { User } from '../types';
import { OfficialEmblem } from './OfficialEmblem';
import { 
  ShieldCheck, 
  FileText, 
  Award, 
  BookOpen, 
  History, 
  Sliders, 
  Code2, 
  UserCheck, 
  FilePlus,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenCreateModal
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = React.useState(false);

  const getRoleBadgeLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị hệ thống';
      case 'receptionist': return 'Cán bộ Tiếp nhận';
      case 'council_president': return 'Chủ tịch Hội đồng';
      case 'council_secretary': return 'Thư ký Hội đồng';
      case 'evaluator': return 'Ủy viên chấm độc lập';
      case 'author': return 'Tác giả sáng kiến';
      case 'viewer': return 'Người xem báo cáo';
      default: return role;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Cờ đỏ / Banner trang trọng tối giản */}
      <div className="h-1 bg-gradient-to-r from-red-700 via-red-600 to-amber-500" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand & Logo Lockup */}
          <div className="flex items-center gap-3 shrink-0">
            <OfficialEmblem size={40} />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-red-700 uppercase">
                  ỦY BAN NHÂN DÂN XÃ VĂN MÔN, THÀNH PHỐ BẮC NINH
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                Hệ thống Đánh giá Sáng kiến Kinh nghiệm Cấp cơ sở
              </h1>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Clean Text, No Pills) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'dashboard' 
                  ? 'text-red-800 bg-red-50/80 font-semibold' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4" />
              Tổng quan
            </button>

            <button
              onClick={() => setActiveTab('initiatives')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'initiatives' 
                  ? 'text-red-800 bg-red-50/80 font-semibold' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Hồ sơ Sáng kiến
            </button>

            <button
              onClick={() => setActiveTab('council')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'council' 
                  ? 'text-red-800 bg-red-50/80 font-semibold' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Hội đồng & Biểu mẫu
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'legal' 
                  ? 'text-red-800 bg-red-50/80 font-semibold' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Căn cứ Pháp lý
            </button>

            <button
              onClick={() => setActiveTab('criteria')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'criteria' 
                  ? 'text-red-800 bg-red-50/80 font-semibold' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Bộ tiêu chí
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'audit' 
                  ? 'text-red-800 bg-red-50/80 font-semibold' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              Nhật ký kiểm toán
            </button>

            <button
              onClick={() => setActiveTab('tech_docs')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'tech_docs' 
                  ? 'text-red-800 bg-red-50/80 font-semibold' 
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="Tài liệu kỹ thuật & ERD CSDL"
            >
              <Code2 className="w-4 h-4" />
              Kỹ thuật & ERD
            </button>
          </nav>

          {/* Zone 3: Actions & Active User Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenCreateModal}
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-md shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap border border-red-800"
              title="Tải nộp hồ sơ sáng kiến trực tuyến theo Hướng dẫn 1603/HD-HĐSK"
            >
              <FilePlus className="w-3.5 h-3.5 text-amber-300" />
              <span>Tải nộp sáng kiến mới</span>
            </button>

            {/* Role switch interactive dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                title="Chuyển đổi vai trò để thử nghiệm mọi góc độ bảo mật"
              >
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-xs font-bold shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col text-xs leading-tight">
                  <span className="font-semibold text-slate-800 truncate max-w-[130px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate max-w-[130px]">
                    {getRoleBadgeLabel(currentUser.role)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setShowRoleDropdown(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Phân quyền & Chuyển vai người dùng
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Trải nghiệm kiểm tra bảo mật và quy trình chấm độc lập
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                          user.id === currentUser.id ? 'bg-red-50/70 text-red-900 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <UserCheck className={`w-4 h-4 mt-0.5 shrink-0 ${user.id === currentUser.id ? 'text-red-700' : 'text-slate-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user.title}</p>
                          <span className="inline-block mt-0.5 text-[10px] text-slate-400">
                            {getRoleBadgeLabel(user.role)} · {user.department}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
