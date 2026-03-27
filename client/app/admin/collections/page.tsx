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
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  
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
    setIsSlugManuallyEdited(false);
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
    setIsSlugManuallyEdited(true);
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
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isSlugManuallyEdited ? prev.slug : generateSlug(name),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setIsSlugManuallyEdited(slug.trim().length > 0);
    setFormData((prev) => ({
      ...prev,
      slug: generateSlug(slug),
    }));
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
      <div key={collection.id} className="relative flex items-center gap-4 border-b p-4 transition-colors hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-900/60">
        {/* Avatar/Thumbnail */}
        {collection.thumbnail ? (
          <img
            src={collection.thumbnail}
            alt={collection.name}
            className="h-12 w-12 rounded-full border-2 border-gray-100 object-cover shadow-sm dark:border-slate-700"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-gradient-to-br from-indigo-100 to-blue-50 text-lg font-bold text-blue-500 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-700 dark:text-sky-300">
            {collection.name.charAt(0)}
          </div>
        )}
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">{collection.name}</h3>
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
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-slate-300">
            <span className="truncate">{collection.country || 'Chưa cập nhật quốc gia'}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-slate-500"></span>
            <span className="truncate">{collection.sport || 'Chưa cập nhật môn thể thao'}</span>
          </div>
        </div>

        {/* Achievement Badge */}
        {collection.achievement && (
          <div className="mr-4 hidden items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 md:flex">
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
            className="text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-300"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDelete(collection)}
            className="text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-300"
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
          <p className="text-muted-foreground dark:text-slate-300">Quản lý các bộ sưu tập, tuyển thủ nổi bật trên trang chủ</p>
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
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400 dark:text-slate-400" />
            </div>
          ) : searchQuery && filteredCollections.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground dark:text-slate-300">
              Không tìm thấy bộ sưu tập nào phù hợp
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="flex flex-col items-center p-12 text-center text-muted-foreground dark:text-slate-300">
              <Trophy className="mb-4 h-12 w-12 text-gray-300 dark:text-slate-500" />
              <p>Chưa có bộ sưu tập nào. Nhấn "Thêm bộ sưu tập" để tạo mới.</p>
            </div>
          ) : (
            <div className="divide-y dark:divide-slate-800">
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
                  onChange={(e) => handleSlugChange(e.target.value)}
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
                   <img src={formData.thumbnail} alt="Preview" className="h-16 w-16 rounded-full border object-cover dark:border-slate-700" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 border-t pt-2 dark:border-slate-800">
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

            <div className="space-y-4 border-t pt-4 dark:border-slate-800">
              <Label>Sản phẩm thuộc Bộ sưu tập (Tùy chọn)</Label>
              
              {/* Đã chọn */}
              {selectedProducts.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedProducts.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                      <span className="truncate max-w-[150px] font-medium" title={p.name}>{p.name}</span>
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          productIds: prev.productIds.filter(id => id !== p.id)
                        }))}
                        className="rounded-full p-0.5 transition-colors hover:bg-blue-200 dark:hover:bg-sky-500/20"
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
                <div className="mt-2 grid max-h-48 grid-cols-1 gap-2 overflow-y-auto rounded-md border bg-gray-50/50 p-2 dark:border-slate-800 dark:bg-slate-900/40 sm:grid-cols-2">
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
                      className="flex cursor-pointer items-center gap-3 rounded border bg-white p-2 shadow-sm transition-colors hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                      {p.images && p.images[0] ? (
                        <img src={p.images[0].url} className="h-8 w-8 shrink-0 rounded object-cover" />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-100 dark:bg-slate-800">
                          <Package className="h-4 w-4 text-gray-400 dark:text-slate-400" />
                        </div>
                      )}
                      <span className="flex-1 truncate text-sm font-medium dark:text-white" title={p.name}>{p.name}</span>
                      <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="col-span-full py-4 text-center text-sm text-gray-500 dark:text-slate-400">
                      Không tìm thấy sản phẩm nào phù hợp
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="border-t pt-4 dark:border-slate-800">
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
