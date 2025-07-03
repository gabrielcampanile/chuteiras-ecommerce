"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, User, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartSidebar from "@/components/cart/cart-sidebar";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/providers/auth-provider";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { favorites } = useFavorites();
  const { user, userProfile, logout, loading } = useAuth();

  const categories = [
    { name: "Futsal", href: "/produtos?categoria=futsal" },
    { name: "Society", href: "/produtos?categoria=society" },
    { name: "Campo", href: "/produtos?categoria=campo" },
  ];

  const brands = [
    { name: "Nike", href: "/produtos?marca=nike" },
    { name: "Adidas", href: "/produtos?marca=adidas" },
    { name: "Puma", href: "/produtos?marca=puma" },
    { name: "Mizuno", href: "/produtos?marca=mizuno" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produtos?busca=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      {/*<div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          🚚 Frete grátis para compras acima de R$ 299 | 📱 WhatsApp: (15)
          99747-0049
        </div>
      </div> */}

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={scrollToTop}
          >
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                CP
              </span>
            </div>
            <span className="font-bold text-xl hidden sm:block">
              ChuteirasPro
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar chuteiras..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="pl-10"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/favoritos" onClick={scrollToTop}>
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {favorites.length}
                  </Badge>
                )}
                <span className="sr-only">Favoritos</span>
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Conta</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <span className="text-sm text-gray-700 mr-2">
                        {user.email}
                      </span>
                    </DropdownMenuItem>
                    {userProfile?.role === "admin" ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/produtos">Admin Produtos</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/usuarios">Admin Usuários</Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link href="/minha-conta">Minha Conta</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        disabled={loading}
                      >
                        Sair
                      </Button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" onClick={scrollToTop}>
                        Entrar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/login" onClick={scrollToTop}>
                        Cadastrar
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Sidebar */}
            <CartSidebar />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Buscar chuteiras..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="pl-10"
                    />
                  </form>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Categorias</h3>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block py-2 text-sm hover:text-gray-200"
                        onClick={scrollToTop}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Marcas</h3>
                    {brands.map((brand) => (
                      <Link
                        key={brand.name}
                        href={brand.href}
                        className="block py-2 text-sm hover:text-gray-200"
                        onClick={scrollToTop}
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground border-t hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 py-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium hover:text-gray-200">
                <span>Categorias</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link href={category.href} onClick={scrollToTop}>
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium hover:text-gray-200">
                <span>Marcas</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {brands.map((brand) => (
                  <DropdownMenuItem key={brand.name} asChild>
                    <Link href={brand.href} onClick={scrollToTop}>
                      {brand.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/promocoes"
              className="text-sm font-medium hover:text-gray-200"
              onClick={scrollToTop}
            >
              Promoções
            </Link>
            <Link
              href="/lancamentos"
              className="text-sm font-medium hover:text-gray-200"
              onClick={scrollToTop}
            >
              Lançamentos
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
