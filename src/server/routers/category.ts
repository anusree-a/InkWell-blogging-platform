import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';


function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const categoryRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(categories);
  }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const slug = generateSlug(input.name);
      const [category] = await db.insert(categories).values({
        name: input.name,
        description: input.description,
        slug,
      }).returning();
      return category;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      
      
      if (updateData.name) {
        (updateData as any).slug = generateSlug(updateData.name);
      }
      
      const [updated] = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning();
      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});