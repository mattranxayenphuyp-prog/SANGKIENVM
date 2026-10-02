import React, { useState } from 'react';
import { AuditLog } from '../types';
import { 
  History, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  FileText,
  Clock
} from 'lucide-react';

interface AuditLogModalProps {
  logs: AuditLog[];
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(l => 
    l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-800">
            <History className="w-4 h-4" />
            <span>Nhật ký Kiểm toán & Bảo mật Hệ thống (Audit Trail)</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Ghi nhận Lịch sử Thao tác, Chấm điểm và Thay đổi Dữ liệu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bảo đảm tính minh bạch: Mọi lượt tiếp nhận, phân công, chấm điểm, sửa đổi và khóa kết quả đều được lưu vết thời gian và định danh người thực hiện.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-right">
          <div>Tổng số bản ghi nhật ký: <strong className="font-mono text-slate-900">{logs.length}</strong></div>
          <div className="text-[11px] text-emerald-700 font-medium">Bảo mật bất biến (Append-only)</div>
        </div>
      </div>

      {/* Tìm kiếm */}
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên cán bộ, hành động hoặc nội dung..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Bảng nhật ký */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-44">Thời gian ghi nhận</th>
                <th className="py-3 px-4 w-52">Người thao tác</th>
                <th className="py-3 px-4 w-48">Hành động</th>
                <th className="py-3 px-4">Chi tiết nội dung thao tác</th>
                <th className="py-3 px-4 text-right w-28">Giá trị mới</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{log.userName}</div>
                    <div className="text-[11px] text-slate-500">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-red-800">
                    {log.newValue || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
