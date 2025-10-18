'use client';

import { trpc } from '@/lib/trpc';
import { useState } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  createdAt: Date | null;
}

interface CategoryClientProps {
  initialCategories: Category[];
}

export function CategoryClient({ initialCategories }: CategoryClientProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null); // ✅ Track which one is deleting
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data: categories = initialCategories } = trpc.category.getAll.useQuery();
  const createMutation = trpc.category.create.useMutation();
  const updateMutation = trpc.category.update.useMutation();
  const deleteMutation = trpc.category.delete.useMutation();
  const utils = trpc.useContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          name,
          description: description || undefined,
        });
        alert('Category updated!');
      } else {
        await createMutation.mutateAsync({
          name,
          description: description || undefined,
        });
        alert('Category created!');
      }
      
      utils.category.getAll.invalidate();
      
      setName('');
      setDescription('');
      setIsCreating(false);
      setEditingId(null);
    } catch (error) {
      alert('Failed to save category');
      console.error(error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || '');
    setIsCreating(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure? This will remove the category from all posts.')) {
      setDeletingId(id); // ✅ Set which one is being deleted
      try {
        await deleteMutation.mutateAsync({ id });
        utils.category.getAll.invalidate();
        alert('Category deleted!');
      } catch (error) {
        alert('Failed to delete category');
      } finally {
        setDeletingId(null); // ✅ Clear after done
      }
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Categories</h1>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + New Category
            </button>
          )}
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Category' : 'Create New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Technology, Lifestyle"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Brief description of this category..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingId
                    ? 'Update Category'
                    : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              All Categories ({categories.length})
            </h2>
          </div>

          {categories && categories.length > 0 ? (
            <div className="divide-y">
              {categories.map((category: Category) => (
                <div key={category.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Slug: {category.slug}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/posts?category=${category.slug}`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition text-sm"
                      >
                        View Posts
                      </Link>
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingId === category.id} // ✅ Only disable THIS button
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition text-sm disabled:opacity-50"
                      >
                        {deletingId === category.id ? 'Deleting...' : 'Delete'} {/* ✅ Only show "Deleting..." for THIS button */}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              No categories yet. Create your first category!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}