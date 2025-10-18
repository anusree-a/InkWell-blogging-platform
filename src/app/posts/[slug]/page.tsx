'use client';

import { trpc } from '@/lib/trpc';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: post, isLoading, error } = trpc.post.getBySlug.useQuery({
    slug: params.slug as string,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">Loading post...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link href="/posts" className="text-blue-600 hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/posts" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to posts
        </Link>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            {post.title}
          </h1>
          
          {/* Categories */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.postCategories?.map(pc => (
              <span 
                key={pc.categoryId} 
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {pc.category?.name || 'Uncategorized'}
              </span>
            ))}
          </div>

          {/* Metadata */}
          <div className="text-gray-600 text-sm">
            Published on {new Date(post.createdAt!).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </header>

        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}