import { db } from '@/db';
import { posts, categories } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { category?: string };
}

export default async function PostsPage({ searchParams }: PageProps) {
  const categorySlug = searchParams.category;

  // Fetch all posts and categories
  const [allPosts, allCategories] = await Promise.all([
    db.query.posts.findMany({
      where: eq(posts.published, true),
      orderBy: [desc(posts.createdAt)],
      with: {
        postCategories: {
          with: {
            category: true,
          },
        },
      },
    }),
    db.select().from(categories),
  ]);

  // Filter posts by category if selected
  const filteredPosts = categorySlug
    ? allPosts.filter(post =>
        post.postCategories.some(pc => pc.category?.slug === categorySlug)
      )
    : allPosts;

  const selectedCategory = allCategories.find(cat => cat.slug === categorySlug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Blog Posts</h1>
            {selectedCategory && (
              <p className="text-gray-600 mt-2">
                Showing posts in: <span className="font-semibold">{selectedCategory.name}</span>
              </p>
            )}
          </div>
          <Link
            href="/dashboard/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + New Post
          </Link>
        </div>
        
        {/* Category Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <Link
            href="/posts"
            className={`px-4 py-2 rounded-lg transition ${
              !categorySlug
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Posts ({allPosts.length})
          </Link>
          {allCategories.map(cat => {
            const count = allPosts.filter(post =>
              post.postCategories.some(pc => pc.categoryId === cat.id)
            ).length;
            return (
              <Link
                key={cat.id}
                href={`/posts?category=${cat.slug}`}
                className={`px-4 py-2 rounded-lg transition ${
                  categorySlug === cat.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>

        {/* Posts Grid */}
        {filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
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
                <div className="flex gap-2 flex-wrap mb-3">
                  {post.postCategories?.map(pc => (
                    <span 
                      key={pc.categoryId} 
                      className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                    >
                      {pc.category?.name || 'Uncategorized'}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(post.createdAt!).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {categorySlug 
                ? `No posts found in "${selectedCategory?.name}" category.`
                : 'No posts found. Create your first post!'}
            </p>
            <Link
              href="/dashboard/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}