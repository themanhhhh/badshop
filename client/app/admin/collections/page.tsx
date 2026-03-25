'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Loader2,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Trophy,
  Package,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCollections, useProducts } from '@/hooks/useApi';
import { api } from '@/lib/api';
import type { Collection } from '@/lib/types';

export default function AdminCollectionsPage() {
  const { data: collections, loading, refetch } = useCollections();
  const { data: products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    thumbnail: string;
    country: string;
    sport: string;
    achievement: string;
    is_active: boolean;
    productIds: string[];
  }>({
    name: '',
    slug: '',
    description: '',
    thumbnail: '',
    country: '',
    sport: '',
    achievement: '',
    is_active: true,
    productIds: [],
  });
  
  const [productSearch, setProductSearch] = useState('');

  // Selected products for UI
  const selectedProducts = products?.filter((p: any) => formData.productIds.includes(p.id)) || [];
  const searchResults = productSearch 
    ? products?.filter((p: any) => 
        !formData.productIds.includes(p.id) && 
        p.name.toLowerCase().includes(productSearch.toLowerCase())
      ).slice(0, 10) || []
    : [];

  // Filter collections by search
  const filterCollections = (items: Collection[], query: string): Collection[] => {
    if (!query) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.slug.toLowerCase().includes(query.toLowerCase()) ||
      (item.country && item.country.toLowerCase().includes(query.toLowerCase())) ||
      (item.sport && item.sport.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filteredCollections = filterCollections(collections || [], searchQuery);

  const handleOpenCreate = () => {
    setEditingCollection(null);
    setProductSearch('');
    setFormData({ 
      name: '', 
      slug: '', 
      description: '', 
      thumbnail: '', 
      country: '', 
      sport: '', 
      achievement: '',
      is_active: true,
      productIds: [],
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setProductSearch('');
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || '',
      thumbnail: collection.thumbnail || '',
      country: collection.country || '',
      sport: collection.sport || '',
      achievement: collection.achievement || '',
      is_active: collection.is_active !== undefined ? collection.is_active : true,
      productIds: collection.products?.map((p: any) => p.id) || [],
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (collection: Collection) => {
    setDeletingCollection(collection);
    setIsDeleteDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || undefined,
        thumbnail: formData.thumbnail || undefined,
        country: formData.country || undefined,
        sport: formData.sport || undefined,
        achievement: formData.achievement || undefined,
        is_active: formData.is_active,
        productIds: formData.productIds,
      };

      if (editingCollection) {
        await api.collections.update(editingCollection.id, data);
      } else {
        await api.collections.create(data);
      }

      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error saving collection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCollection) return;
    
    try {
      await api.collections.delete(deletingCollection.id);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const renderCollectionRow = (collection: Collection) => {
    return (
      <div key={collection.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b transition-colors relative">
        {/* Avatar/Thumbnail */}
        {collection.thumbnail ? (
          <img
            src={collection.thumbnail}
            alt={collection.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 border shadow-sm flex items-center justify-center text-blue-500 font-bold text-lg">
            {collection.name.charAt(0)}
          </div>
        )}
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 truncate text-base">{collection.name}</h3>
            {collection.is_active ? (
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">Đang hiển thị</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">Đã ẩn</span>
            )}
            {collection.products && collection.products.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium flex items-center gap-1">
                <Package className="h-3 w-3" />
                {collection.products.length} SP
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
            <span className="truncate">{collection.country || 'Chưa cập nhật quốc gia'}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="truncate">{collection.sport || 'Chưa cập nhật môn thể thao'}</span>
          </div>
        </div>

        {/* Achievement Badge */}
        {collection.achievement && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100 mr-4">
            <Trophy className="h-4 w-4" />
            <span className="truncate max-w-[200px]">{collection.achievement}</span>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEdit(collection)}
            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDelete(collection)}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Danh sách Bộ sưu tập (Tuyển thủ)</h1>
          <p className="text-muted-foreground">Quản lý các bộ sưu tập, tuyển thủ nổi bật trên trang chủ</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm bộ sưu tập
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, quốc gia, thể thao..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Collections List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Tất cả bộ sưu tập ({collections?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            </div>
          ) : searchQuery && filteredCollections.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Không tìm thấy bộ sưu tập nào phù hợp
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <Trophy className="h-12 w-12 text-gray-300 mb-4" />
              <p>Chưa có bộ sưu tập nào. Nhấn "Thêm bộ sưu tập" để tạo mới.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredCollections.map(renderCollectionRow)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCollection ? 'Chỉnh sửa bộ sưu tập' : 'Thêm bộ sưu tập mới'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên tuyển thủ / Bộ sưu tập *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="VD: Viktor Axelsen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Đường dẫn tĩnh (Slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="viktor-axelsen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Quốc gia</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="VD: Denmark"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sport">Môn thể thao / Hạng mục</Label>
                <Input
                  id="sport"
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                  placeholder="VD: Men's Singles"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievement">Thành tích nổi bật</Label>
              <Input
                id="achievement"
                value={formData.achievement}
                onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                placeholder="VD: Olympic Gold Medalist"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả tóm tắt</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Thông tin ngắn về tuyển thủ/bộ sưu tập"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">URL Hình đại diện (Thumbnail)</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://..."
              />
              {formData.thumbnail && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Xem trước:</p>
                  <img src={formData.thumbnail} alt="Preview" className="h-16 w-16 rounded-full object-cover border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t">
              <input
                id="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 cursor-pointer accent-blue-600 rounded"
              />
              <Label htmlFor="is_active" className="cursor-pointer font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Hiển thị trên trang chủ
              </Label>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Label>Sản phẩm thuộc Bộ sưu tập (Tùy chọn)</Label>
              
              {/* Đã chọn */}
              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedProducts.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 text-sm">
                      <span className="truncate max-w-[150px] font-medium" title={p.name}>{p.name}</span>
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          productIds: prev.productIds.filter(id => id !== p.id)
                        }))}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Ô tìm kiếm */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Gõ tên sản phẩm để tìm và thêm..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Kết quả tìm kiếm */}
              {productSearch && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md bg-gray-50/50 mt-2">
                  {searchResults.map((p: any) => (
                    <div 
                      key={p.id} 
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          productIds: [...prev.productIds, p.id]
                        }));
                        setProductSearch(''); // Reset search after pick
                      }}
                      className="flex items-center gap-3 p-2 bg-white rounded border shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {p.images && p.images[0] ? (
                        <img src={p.images[0].url} className="w-8 h-8 rounded object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
                          <Package className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <span className="text-sm font-medium truncate flex-1" title={p.name}>{p.name}</span>
                      <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="col-span-full text-center text-sm text-gray-500 py-4">
                      Không tìm thấy sản phẩm nào phù hợp
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  editingCollection ? 'Cập nhật' : 'Tạo mới'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bộ sưu tập</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa bộ sưu tập "{deletingCollection?.name}"? 
              Hành động này không thể hoàn tác nhưng các sản phẩm trong bộ sưu tập vẫn sẽ được giữ lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
