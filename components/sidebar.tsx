"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  Tag,
  PiggyBank,
  Target,
  LogOut,
  Wallet,
  Menu,
  X,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ViewContextSwitcher } from "@/components/groups/view-context-switcher";
import { useState } from "react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Transações",
    icon: Receipt,
    href: "/dashboard/transactions",
  },
  {
    label: "Contas",
    icon: CreditCard,
    href: "/dashboard/accounts",
  },
  {
    label: "Categorias",
    icon: Tag,
    href: "/dashboard/categories",
  },
  {
    label: "Orçamentos",
    icon: PiggyBank,
    href: "/dashboard/budgets",
  },
  {
    label: "Metas",
    icon: Target,
    href: "/dashboard/goals",
  },
  {
    label: "Grupos",
    icon: Users,
    href: "/dashboard/groups",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">FinanceApp</h1>
            <p className="text-xs text-muted-foreground">Gestão Financeira</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-indigo-500 text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-4">
        <ViewContextSwitcher />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <Avatar>
            <AvatarFallback className="bg-indigo-100 text-indigo-700">
              {user ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b z-40 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
        <div className="flex items-center gap-2 ml-4">
          <div className="p-1.5 bg-indigo-500 rounded-lg">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-bold">FinanceApp</h1>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-card border-r z-50 flex flex-col">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
