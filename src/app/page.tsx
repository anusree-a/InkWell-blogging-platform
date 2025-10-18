import Link from 'next/link';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export default async function HomePage() {
  const latestPosts = await db.query.posts.findMany({
    where: eq(posts.published, true),
    orderBy: [desc(posts.createdAt)],
    limit: 3,
    with: {
      postCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section - Stunning gradient */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
          
           
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Write. Publish.<br />
              <span className="text-blue-200">Inspire the World.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of writers sharing their stories. 
              Beautiful, distraction-free writing experience 
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/new"
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-semibold text-lg flex items-center justify-center gap-2 hover:-translate-y-1"
              >
                Start Writing
                <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/posts"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl hover:bg-white/20 transition-all font-semibold text-lg hover:-translate-y-1"
              >
                Explore Stories
              </Link>
            </div>

           
            {/* <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold mb-1">{latestPosts.length}+</div>
                <div className="text-blue-200 text-sm">Published Posts</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">100%</div>
                <div className="text-blue-200 text-sm">Free Forever</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">∞</div>
                <div className="text-blue-200 text-sm">Possibilities</div>
              </div>
            </div> */}
          </div>
        </div>

       
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      
      {latestPosts.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Stories
            </h2>
            <p className="text-gray-600 text-lg">
              Discover the latest articles from our community of writers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {latestPosts.map(post => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-2"
              >
                <div className="flex gap-2 mb-4">
                  {post.postCategories?.slice(0, 2).map(pc => (
                    <span 
                      key={pc.categoryId} 
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium"
                    >
                      {pc.category?.name}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                  {post.content}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(post.createdAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl"
            >
              View All Posts
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Write
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Powerful features designed specifically for writers who want to focus on their craft
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Distraction-Free Editor</h3>
              <p className="text-gray-600 leading-relaxed">
                Clean, minimalist interface that lets you focus on what matters most - your words.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Smart Categories</h3>
              <p className="text-gray-600 leading-relaxed">
                Organize your content effortlessly. Readers can discover your work by topic.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Instant Publishing</h3>
              <p className="text-gray-600 leading-relaxed">
                Your words go live immediately. No waiting, no approval process. Just publish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join our community of writers today. It's free, forever.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg hover:-translate-y-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Start Writing Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 text-2xl font-bold text-white mb-2">
                <svg className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Inkwell
              </div>
              <p className="text-gray-400 text-sm">Where stories come to life</p>
            </div>
            <div className="flex gap-8">
              <Link href="/posts" className="hover:text-white transition">
                Explore
              </Link>
              <Link href="/categories" className="hover:text-white transition">
                Categories
              </Link>
              <Link href="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© 2024 Inkwell.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}