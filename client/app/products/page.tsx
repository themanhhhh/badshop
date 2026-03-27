'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, SlidersHorizontal, ChevronDown, Loader2, AlertCircle, X, Check } from 'lucide-react';
import { Header } from '@/components/shop/Header';
import { Footer } from '@/components/shop/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProductsWithFilters, useCategories, useBrands, useCollections, useProductsByCollection } from '@/hooks/useApi';
import { mapProductsForDisplay, type DisplayProduct } from '@/lib/productMapper';

// Category name mapping for display (supports both API Vietnamese slugs and legacy English slugs)
const categoryNameMapping: Record<string, string> = {
  // Vietnamese slugs from API
  'vot-cau-long': 'Vợt cầu lông',
  'giay-cau-long': 'Giày cầu lông',
  'phu-kien': 'Phụ kiện',
  'tui-dung-vot': 'Túi đựng vợt',
  'cau-long': 'Cầu lông',
  'quan-ao-cau-long': 'Quần áo cầu lông',
  // Legacy English slugs
  'racket': 'Vợt cầu lông',
  'rackets': 'Vợt cầu lông',
  'shoes': 'Giày cầu lông',
  'footwear': 'Giày cầu lông',
  'accessories': 'Phụ kiện',
  'shuttlecock': 'Cầu lông',
  'bags': 'Túi đựng vợt',
  'clothing': 'Quần áo cầu lông',
};

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

const sortLabels: Record<SortOption, string> = {
  'newest': 'Mới nhất',
  'price-asc': 'Giá: Thấp → Cao',
  'price-desc': 'Giá: Cao → Thấp',
  'name-asc': 'Tên A-Z',
};

function sortProducts(products: DisplayProduct[], sort: SortOption): DisplayProduct[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'newest':
    default:
      return sorted;
  }
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = searchParams.get('category');
  const brandSlug = searchParams.get('brand');
  const collectionSlug = searchParams.get('collection');
  
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Fetch categories and brands to get actual IDs
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: collections } = useCollections();
  
  // Find real category ID from slug
  const categoryId = useMemo(() => {
    if (!categorySlug || !categories) return undefined;
    
    const targetName = categoryNameMapping[categorySlug.toLowerCase()];
    if (targetName) {
      const category = categories.find((c: any) => 
        c.name?.toLowerCase().includes(targetName.toLowerCase()) ||
        c.slug?.toLowerCase() === categorySlug.toLowerCase()
      );
      return category?.id;
    }
    
    // Try direct slug match
    const category = categories.find((c: any) => 
      c.slug?.toLowerCase() === categorySlug.toLowerCase() ||
      c.name?.toLowerCase() === categorySlug.toLowerCase()
    );
    return category?.id;
  }, [categorySlug, categories]);
  
  // Find real brand ID from slug
  const brandId = useMemo(() => {
    if (!brandSlug || !brands) return undefined;
    
    const brand = brands.find((b: any) => 
      b.name?.toLowerCase() === brandSlug.toLowerCase() ||
      b.slug?.toLowerCase() === brandSlug.toLowerCase()
    );
    return brand?.id;
  }, [brandSlug, brands]);

  const collectionId = useMemo(() => {
    if (!collectionSlug || !collections) return undefined;

    const collection = collections.find((c: any) =>
      c.slug?.toLowerCase() === collectionSlug.toLowerCase() ||
      c.name?.toLowerCase() === collectionSlug.toLowerCase()
    );

    return collection?.id;
  }, [collectionSlug, collections]);
  
  // Build filters for API call
  const filters = useMemo(() => ({
    category: categoryId,
    brand: brandId,
    _pending: (categorySlug && !categoryId) || (brandSlug && !brandId) || (collectionSlug && !collectionId) ? true : undefined,
  }), [categoryId, brandId, categorySlug, brandSlug, collectionSlug, collectionId]);
  
  // Use hook that calls API with filters
  const { data: apiProducts, loading: productsLoading, error, refetch } = useProductsWithFilters(filters);
  const {
    data: collectionProducts,
    loading: collectionProductsLoading,
    error: collectionProductsError,
    refetch: refetchCollectionProducts,
  } = useProductsByCollection(collectionId || '');
  
  // Show loading while categories are still resolving
  const loading = collectionSlug
    ? collectionProductsLoading || (collectionSlug && !collections)
    : productsLoading || (categorySlug && !categories) || (brandSlug && !brands);

  // Map API products to display format and sort
  const displayProducts = useMemo(() => {
    const sourceProducts = collectionSlug ? collectionProducts : apiProducts;
    const mapped = sourceProducts ? mapProductsForDisplay(sourceProducts) : [];
    return sortProducts(mapped, sortBy);
  }, [apiProducts, collectionProducts, collectionSlug, sortBy]);

  const errorState = collectionSlug ? collectionProductsError : error;
  const refetchProducts = collectionSlug ? refetchCollectionProducts : refetch;

  // Navigate with filter params
  const applyFilter = (type: 'category' | 'brand' | 'collection', value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  const activeFilterCount = (categorySlug ? 1 : 0) + (brandSlug ? 1 : 0) + (collectionSlug ? 1 : 0);

  // Get page title based on filter
  const getPageTitle = () => {
    if (categorySlug) {
      return categoryNameMapping[categorySlug.toLowerCase()] || categorySlug;
    }
    if (brandSlug) {
      const brand = brands?.find((b: any) => b.slug === brandSlug || b.name?.toLowerCase() === brandSlug.toLowerCase());
      return brand?.name || brandSlug.toUpperCase();
    }
    if (collectionSlug) {
      const collection = collections?.find((c: any) => c.slug === collectionSlug || c.name?.toLowerCase() === collectionSlug.toLowerCase());
      return collection?.name || collectionSlug;
    }
    return 'Tất cả sản phẩm';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-foreground transition-colors">Sản phẩm</Link>
              {categorySlug && (
                <>
                  <span>/</span>
                  <span className="text-foreground">{categoryNameMapping[categorySlug.toLowerCase()] || categorySlug}</span>
                </>
              )}
              {brandSlug && (
                <>
                  <span>/</span>
                  <span className="text-foreground">{brandSlug.toUpperCase()}</span>
                </>
              )}
              {collectionSlug && (
                <>
                  <span>/</span>
                  <span className="text-foreground">{getPageTitle()}</span>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-center mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            {loading ? 'Đang tải...' : `${displayProducts.length} sản phẩm`}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="border-y border-gray-100 sticky top-[130px] bg-white z-30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <Button 
                variant={showFilters ? "default" : "ghost"} 
                className="text-xs uppercase tracking-widest font-medium"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Bộ lọc
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-black text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-xs uppercase tracking-widest font-medium">
                    {sortLabels[sortBy]}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                    <DropdownMenuItem 
                      key={key}
                      onClick={() => setSortBy(key)}
                      className="flex items-center justify-between"
                    >
                      {label}
                      {sortBy === key && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Filter Panel + Products */}
        <div className="container mx-auto px-4 py-10">
          <div className="flex gap-8">
            {/* Filter Sidebar */}
            {showFilters && (
              <aside className="w-64 shrink-0 space-y-8">
                {/* Active Filters */}
                {activeFilterCount > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold uppercase tracking-widest">Đang lọc</h3>
                      <button 
                        onClick={clearFilters}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categorySlug && (
                        <button
                          onClick={() => applyFilter('category', null)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          {categoryNameMapping[categorySlug.toLowerCase()] || categorySlug}
                          <X className="h-3 w-3" />
                        </button>
                      )}
                      {brandSlug && (
                        <button
                          onClick={() => applyFilter('brand', null)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          {brandSlug.toUpperCase()}
                          <X className="h-3 w-3" />
                        </button>
                      )}
                      {collectionSlug && (
                        <button
                          onClick={() => applyFilter('collection', null)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          {getPageTitle()}
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {categories && categories.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest mb-3">Danh mục</h3>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => applyFilter('category', null)}
                          className={`text-sm transition-colors w-full text-left py-1 ${
                            !categorySlug 
                              ? 'text-foreground font-medium' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Tất cả danh mục
                        </button>
                      </li>
                      {categories.map((cat: any) => (
                        <li key={cat.id}>
                          <button
                            onClick={() => applyFilter('category', cat.slug)}
                            className={`text-sm transition-colors w-full text-left py-1 ${
                              categorySlug === cat.slug 
                                ? 'text-foreground font-medium' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {cat.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Brands */}
                {brands && brands.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest mb-3">Thương hiệu</h3>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => applyFilter('brand', null)}
                          className={`text-sm transition-colors w-full text-left py-1 ${
                            !brandSlug 
                              ? 'text-foreground font-medium' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Tất cả thương hiệu
                        </button>
                      </li>
                      {brands.map((brand: any) => (
                        <li key={brand.id}>
                          <button
                            onClick={() => applyFilter('brand', brand.slug || brand.name?.toLowerCase())}
                            className={`text-sm transition-colors w-full text-left py-1 ${
                              brandSlug === (brand.slug || brand.name?.toLowerCase())
                                ? 'text-foreground font-medium' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {brand.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">Đang tải sản phẩm...</span>
                </div>
              ) : errorState ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                  <p className="text-red-500 mb-4">Không thể tải sản phẩm. Vui lòng thử lại.</p>
                  <Button onClick={() => refetchProducts()} variant="outline">
                    Thử lại
                  </Button>
                </div>
              ) : displayProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground mb-4">Không tìm thấy sản phẩm nào.</p>
                  {activeFilterCount > 0 && (
                    <Button onClick={clearFilters} variant="outline">
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              ) : (
                <div className={`grid gap-6 lg:gap-8 ${
                  showFilters 
                    ? 'grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {displayProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white">
          <Header />
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Dang tai bo loc san pham...
            </div>
          </div>
          <Footer />
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
