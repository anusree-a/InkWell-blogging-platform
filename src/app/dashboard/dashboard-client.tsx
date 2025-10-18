'use client';

import { trpc } from '@/lib/trpc';
import Link from 'next/link';

interface DashboardClientProps {
  initialPosts: any[];
}

export function DashboardClient({ initialPosts }: DashboardClientProps) {
  const { data: posts = initialPosts } = trpc.post.getAll.useQuery(undefined, {
    initialData: initialPosts,
    refetchOnMount: false,
  });
  
  const deleteMutation = trpc.post.delete.useMutation();
  const utils = trpc.useContext();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        utils.post.getAll.invalidate();
      } catch (error) {
        alert('Failed to delete post');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <Link
            href="/dashboard/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-medium">Total Posts</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {posts?.length || 0}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-medium">Published</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {posts?.filter(p => p.published).length || 0}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-medium">Drafts</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">
              {posts?.filter(p => !p.published).length || 0}
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">All Posts</h2>
          </div>
          
          {posts && posts.length > 0 ? (
            <div className="divide-y">
              {posts.map(post => (
                <div key={post.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      <span>
                        {new Date(post.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/edit/${post.id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deleteMutation.isPending}
                      className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              No posts yet. Create your first post!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}