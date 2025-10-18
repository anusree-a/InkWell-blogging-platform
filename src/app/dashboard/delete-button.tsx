'use client';

import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/navigation';

export function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter();
  const deleteMutation = trpc.post.delete.useMutation();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteMutation.mutateAsync({ id: postId });
        router.refresh(); // Refresh server component
      } catch (error) {
        alert('Failed to delete post');
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
      className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition disabled:opacity-50"
    >
      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}