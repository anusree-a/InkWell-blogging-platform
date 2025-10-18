import { db } from '@/db';
import { categories } from '@/db/schema';
import { CategoryClient } from './category-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CategoriesPage() {
  const allCategories = await db.select().from(categories);

  
  const formattedCategories = allCategories.map((cat) => ({
    ...cat,
    createdAt: cat.createdAt ? cat.createdAt.toISOString() : null,
  }));

  return <CategoryClient initialCategories={formattedCategories} />;
}
