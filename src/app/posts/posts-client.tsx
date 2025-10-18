'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useState } from 'react';


interface PostsClientProps {
  initialPosts: any[];
  initialCategories: any[];
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PostsClient({ initialPosts, initialCategories }: PostsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  
  const { data: posts = initialPosts, isLoading } = trpc.post.getAll.useQuery({
    published: true,
    categoryId: selectedCategory,
  });
  
  const { data: categories = initialCategories } = trpc.category.getAll.useQuery();

  const filteredPosts = selectedCategory
    ? posts.filter((post: any) => 
        post.postCategories?.some((pc: any) => pc.categoryId === selectedCategory)
      )
    : posts;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Blog Posts</h1>
        
        {/* Category Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-4 py-2 rounded-lg transition ${
              !selectedCategory 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Posts
          </button>
          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === cat.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post: any) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-2xl font-semibold mb-3 text-gray-900">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.content}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {post.postCategories?.map((pc: any) => (
                    <span 
                      key={pc.categoryId} 
                      className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                    >
                      {pc.category?.name || 'Uncategorized'}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No posts found. Create your first post!
          </div>
        )}
      </div>
    </div>
  );
}