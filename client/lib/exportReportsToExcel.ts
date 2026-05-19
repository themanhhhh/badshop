import { styleWorksheet } from './excelExportUtils';
import { formatPrice } from './productMapper';

type ReportStats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
};

type ChartRow = {
  label: string;
  revenue: number;
  orders: number;
};

type CategoryRow = {
  name: string;
  sales: number;
};

type ProductRow = {
  id?: string;
  name?: string;
  price?: number | string;
  rating?: number | string;
  brand?: { name?: string } | string;
  category?: { name?: string } | string;
};

type OrderRow = {
  id?: string;
  order_number?: string;
  orderNumber?: string;
  total?: number | string;
  status?: string;
  payment_status?: string;
  paymentStatus?: string;
  created_at?: string | Date;
  createdAt?: string | Date;
  user?: { name?: string; email?: string };
};

type ExportReportInput = {
  periodLabel: string;
  stats: ReportStats;
  chartData: ChartRow[];
  categorySales: CategoryRow[];
  products: ProductRow[];
  orders: OrderRow[];
  fileName: string;
};

function getObjectName(value: ProductRow['brand'] | ProductRow['category']): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.name || '';
}

function getOrderDate(order: OrderRow): string {
  const rawDate = order.created_at || order.createdAt;
  return rawDate ? new Date(rawDate).toLocaleString('vi-VN') : '';
}

export async function exportReportsToExcel({
  periodLabel,
  stats,
  chartData,
  categorySales,
  products,
  orders,
  fileName,
}: ExportReportInput) {
  const XLSX = await import('xlsx');

  const overviewRows = [
    { 'Chi so': 'Ky bao cao', 'Gia tri': periodLabel, 'Gia tri hien thi': periodLabel },
    { 'Chi so': 'Doanh thu', 'Gia tri': stats.totalRevenue, 'Gia tri hien thi': formatPrice(stats.totalRevenue) },
    { 'Chi so': 'Don hang', 'Gia tri': stats.totalOrders, 'Gia tri hien thi': stats.totalOrders.toLocaleString('vi-VN') },
    { 'Chi so': 'Khach hang', 'Gia tri': stats.totalCustomers, 'Gia tri hien thi': stats.totalCustomers.toLocaleString('vi-VN') },
    { 'Chi so': 'San pham', 'Gia tri': stats.totalProducts, 'Gia tri hien thi': stats.totalProducts.toLocaleString('vi-VN') },
    { 'Chi so': 'Tang truong doanh thu (%)', 'Gia tri': stats.revenueGrowth, 'Gia tri hien thi': `${stats.revenueGrowth}%` },
    { 'Chi so': 'Tang truong don hang (%)', 'Gia tri': stats.ordersGrowth, 'Gia tri hien thi': `${stats.ordersGrowth}%` },
  ];

  const revenueRows = chartData.map((item) => ({
    'Moc thoi gian': item.label,
    'Doanh thu': item.revenue,
    'Doanh thu hien thi': formatPrice(item.revenue),
    'So don': item.orders,
  }));

  const categoryRows = categorySales.map((category, index) => ({
    STT: index + 1,
    'Danh muc': category.name,
    'Ty trong (%)': category.sales,
  }));

  const productRows = products.slice(0, 20).map((product, index) => ({
    STT: index + 1,
    'Ma san pham': product.id || '',
    'Ten san pham': product.name || '',
    'Thuong hieu': getObjectName(product.brand),
    'Danh muc': getObjectName(product.category),
    'Gia': Number(product.price || 0),
    'Gia hien thi': formatPrice(Number(product.price || 0)),
    Rating: product.rating || 0,
  }));

  const orderRows = orders.map((order, index) => ({
    STT: index + 1,
    'Ma don': order.order_number || order.orderNumber || order.id || '',
    'Khach hang': order.user?.name || 'Khach hang',
    Email: order.user?.email || '',
    'Tong tien': Number(order.total || 0),
    'Tong tien hien thi': formatPrice(Number(order.total || 0)),
    'Trang thai': order.status || '',
    'Thanh toan': order.payment_status || order.paymentStatus || '',
    'Ngay dat': getOrderDate(order),
  }));

  const overviewSheet = XLSX.utils.json_to_sheet(overviewRows);
  const revenueSheet = XLSX.utils.json_to_sheet(revenueRows);
  const categorySheet = XLSX.utils.json_to_sheet(categoryRows.length ? categoryRows : [{ STT: '', 'Danh muc': '', 'Ty trong (%)': '' }]);
  const productSheet = XLSX.utils.json_to_sheet(productRows.length ? productRows : [{ STT: '', 'Ma san pham': '', 'Ten san pham': '', 'Thuong hieu': '', 'Danh muc': '', Gia: '', 'Gia hien thi': '', Rating: '' }]);
  const orderSheet = XLSX.utils.json_to_sheet(orderRows.length ? orderRows : [{ STT: '', 'Ma don': '', 'Khach hang': '', Email: '', 'Tong tien': '', 'Tong tien hien thi': '', 'Trang thai': '', 'Thanh toan': '', 'Ngay dat': '' }]);

  styleWorksheet(overviewSheet, [{ wch: 28 }, { wch: 18 }, { wch: 24 }]);
  styleWorksheet(revenueSheet, [{ wch: 16 }, { wch: 18 }, { wch: 20 }, { wch: 12 }]);
  styleWorksheet(categorySheet, [{ wch: 8 }, { wch: 28 }, { wch: 14 }]);
  styleWorksheet(productSheet, [{ wch: 8 }, { wch: 38 }, { wch: 34 }, { wch: 20 }, { wch: 20 }, { wch: 16 }, { wch: 18 }, { wch: 10 }]);
  styleWorksheet(orderSheet, [{ wch: 8 }, { wch: 28 }, { wch: 24 }, { wch: 30 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 22 }]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Tong quan');
  XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Doanh thu');
  XLSX.utils.book_append_sheet(workbook, categorySheet, 'Danh muc');
  XLSX.utils.book_append_sheet(workbook, productSheet, 'San pham');
  XLSX.utils.book_append_sheet(workbook, orderSheet, 'Don hang');
  XLSX.writeFile(workbook, fileName);
}
