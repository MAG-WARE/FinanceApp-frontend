"use client";

import { useState } from "react";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category, CategoryType } from "@/lib/types";
import { Plus, Tag, Pencil, Trash2 } from "lucide-react";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const deleteMutation = useDeleteCategory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryType, setCategoryType] = useState<CategoryType>(CategoryType.Expense);

  const incomeCategories = categories?.filter(c => c.type === CategoryType.Income) || [];
  const expenseCategories = categories?.filter(c => c.type === CategoryType.Expense) || [];

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      await deleteMutation.mutateAsync(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const handleNew = (type: CategoryType) => {
    setCategoryType(type);
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const CategoryCard = ({ category }: { category: Category }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: category.color || "#6366f1", opacity: 0.1 }}>
              <Tag className="h-5 w-5" style={{ color: category.color || "#6366f1" }} />
            </div>
            <div>
              <p className="font-medium">{category.name}</p>
              <Badge variant={category.type === CategoryType.Income ? "default" : "secondary"} className="mt-1">
                {category.type === CategoryType.Income ? "Receita" : "Despesa"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCategoryToDelete(category.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
        <p className="text-muted-foreground">Organize suas transações em categorias</p>
      </div>

      <Tabs defaultValue="expense">
        <TabsList>
          <TabsTrigger value="expense">Despesas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
        </TabsList>
        <TabsContent value="expense" className="space-y-4">
          <Button onClick={() => handleNew(CategoryType.Expense)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria de Despesa
          </Button>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expenseCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="income" className="space-y-4">
          <Button onClick={() => handleNew(CategoryType.Income)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria de Receita
          </Button>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {incomeCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingCategory(null); }}
        category={editingCategory}
        defaultType={categoryType}
      />

      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente a categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
