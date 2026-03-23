'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, Eye, ArrowLeft, Loader2, FileText, User } from 'lucide-react';
import { usePostBySlug } from '@/hooks/useApi';
import { AdminLoading } from '@/components/admin/AdminLoading';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: post, loading, error } = usePostBySlug(slug);

  if (loading) {
    return <AdminLoading fullPage text="Đang tải bài viết..." />;
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy bài viết</h2>
        <p className="text-muted-foreground mb-6">
          Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
        </p>
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại blog
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8">
      {/* Back Link */}
      <Link 
        href="/blog"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại blog
      </Link>

      {/* Post Header */}
      <header className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
          {post.author && (
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author.name || 'Admin'}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : ''}
          </span>
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {post.view_count || 0} lượt xem
          </span>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mt-8 rounded-2xl overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}
      </header>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto">
        <div 
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
            prose-p:mb-4 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:mb-2
            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-white prose-pre:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </div>

      {/* Post Footer */}
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-border">
        {post.excerpt && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold mb-2">Tóm tắt</h3>
            <p className="text-muted-foreground">{post.excerpt}</p>
          </div>
        )}
      </footer>
    </article>
  );
}
