import { db } from './index';
import { posts, categories, postCategories } from './schema';

async function seed() {
  console.log('Seeding database...');

  // Create categories
  const [tech] = await db.insert(categories).values({
    name: 'Technology',
    description: 'Tech related posts',
    slug: 'technology',
  }).returning();

  const [lifestyle] = await db.insert(categories).values({
    name: 'Lifestyle',
    description: 'Lifestyle posts',
    slug: 'lifestyle',
  }).returning();

  // Create posts
  const [post1] = await db.insert(posts).values({
    title: 'Getting Started with Next.js 15',
    content: 'Next.js 15 brings many exciting features including improved performance and better developer experience...',
    slug: 'getting-started-with-nextjs-15',
    published: true,
  }).returning();

  const [post2] = await db.insert(posts).values({
    title: 'Building Modern Web Apps',
    content: 'Learn how to build modern web applications using the latest tools and frameworks...',
    slug: 'building-modern-web-apps',
    published: true,
  }).returning();

  // Link posts to categories
  await db.insert(postCategories).values([
    { postId: post1.id, categoryId: tech.id },
    { postId: post2.id, categoryId: tech.id },
    { postId: post2.id, categoryId: lifestyle.id },
  ]);

  console.log('✅Seeding completed!');
  process.exit(0);
}

seed().catch((error) => {
  console.error(' Seeding failed:', error);
  process.exit(1);
});