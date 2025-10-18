import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { posts, postCategories, categories } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const postRouter = router({
  
  getAll: publicProcedure
    .input(z.object({
      published: z.boolean().optional(),
      categoryId: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      const allPosts = await db.query.posts.findMany({
        orderBy: [desc(posts.createdAt)],
        where: input?.published !== undefined 
          ? eq(posts.published, input.published) 
          : undefined,
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      // Filter by category if needed
      if (input?.categoryId) {
        return allPosts.filter(post => 
          post.postCategories.some(pc => pc.categoryId === input.categoryId)
        );
      }

      return allPosts;
    }),

  // Get single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });
    }),

  // Create post
  create: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      published: z.boolean().default(false),
      categoryIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ input }) => {
      const slug = generateSlug(input.title);
      
      const [post] = await db.insert(posts).values({
        title: input.title,
        content: input.content,
        slug,
        published: input.published,
      }).returning();

      if (input.categoryIds && input.categoryIds.length > 0) {
        await db.insert(postCategories).values(
          input.categoryIds.map(categoryId => ({
            postId: post.id,
            categoryId,
          }))
        );
      }

      return post;
    }),

  // Update post
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      published: z.boolean().optional(),
      categoryIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, categoryIds, ...updateData } = input;
      
      if (updateData.title) {
        (updateData as any).slug = generateSlug(updateData.title);
      }

      const [updated] = await db
        .update(posts)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(posts.id, id))
        .returning();

      if (categoryIds !== undefined) {
        await db.delete(postCategories).where(eq(postCategories.postId, id));
        if (categoryIds.length > 0) {
          await db.insert(postCategories).values(
            categoryIds.map(categoryId => ({
              postId: id,
              categoryId,
            }))
          );
        }
      }

      return updated;
    }),

  // Delete post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),
});