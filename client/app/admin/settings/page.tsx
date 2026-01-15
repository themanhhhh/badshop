'use client';

import { useState } from 'react';
import { 
  Store, 
  CreditCard, 
  Truck, 
  Bell, 
  Shield, 
  Save,
  Upload,
  Globe
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('store');

  const tabs = [
    { id: 'store', label: 'Cửa hàng', icon: Store },
    { id: 'payment', label: 'Thanh toán', icon: CreditCard },
    { id: 'shipping', label: 'Vận chuyển', icon: Truck },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý cài đặt cửa hàng của bạn</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-border p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'store' && (
            <div className="bg-white rounded-2xl border border-border p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Thông tin cửa hàng</h2>
                
                {/* Logo Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Logo cửa hàng</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                      BP
                    </div>
                    <button className="px-4 py-2 border border-input rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Tải lên
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tên cửa hàng</label>
                    <input
                      type="text"
                      defaultValue="BadmintonPro"
                      className="w-full h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="contact@badmintonpro.vn"
                        className="w-full h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        defaultValue="1900 1234"
                        className="w-full h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      defaultValue="123 Đường Nguyễn Huệ, Quận 1, TP.HCM"
                      className="w-full h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mô tả cửa hàng</label>
                    <textarea
                      rows={3}
                      defaultValue="Cửa hàng chuyên cung cấp vợt cầu lông chính hãng từ các thương hiệu hàng đầu thế giới."
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="bg-white rounded-2xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold">Phương thức thanh toán</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Thanh toán khi nhận hàng (COD)', enabled: true },
                  { name: 'Chuyển khoản ngân hàng', enabled: true },
                  { name: 'Ví MoMo', enabled: false },
                  { name: 'Ví ZaloPay', enabled: false },
                  { name: 'VNPAY', enabled: true },
                ].map((method) => (
                  <div key={method.name} className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <span className="font-medium">{method.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="bg-white rounded-2xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold">Cài đặt vận chuyển</h2>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phí vận chuyển mặc định</label>
                  <input
                    type="text"
                    defaultValue="30,000"
                    className="w-full h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Miễn phí vận chuyển cho đơn từ</label>
                  <input
                    type="text"
                    defaultValue="500,000"
                    className="w-full h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Đơn vị vận chuyển</label>
                  <div className="space-y-3">
                    {['Giao hàng nhanh (GHN)', 'Giao hàng tiết kiệm (GHTK)', 'Viettel Post', 'J&T Express'].map((carrier) => (
                      <label key={carrier} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>{carrier}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold">Cài đặt thông báo</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Thông báo đơn hàng mới', desc: 'Nhận thông báo khi có đơn hàng mới', enabled: true },
                  { name: 'Thông báo hủy đơn', desc: 'Nhận thông báo khi khách hủy đơn hàng', enabled: true },
                  { name: 'Thông báo hết hàng', desc: 'Nhận thông báo khi sản phẩm hết hàng', enabled: true },
                  { name: 'Thông báo đánh giá', desc: 'Nhận thông báo khi có đánh giá mới', enabled: false },
                  { name: 'Báo cáo hàng tuần', desc: 'Nhận báo cáo doanh thu hàng tuần qua email', enabled: true },
                ].map((notif) => (
                  <div key={notif.name} className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-medium">{notif.name}</p>
                      <p className="text-sm text-muted-foreground">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold">Bảo mật tài khoản</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="rounded" />
                    <div>
                      <p className="font-medium">Xác thực 2 bước (2FA)</p>
                      <p className="text-sm text-muted-foreground">Thêm lớp bảo mật cho tài khoản của bạn</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
