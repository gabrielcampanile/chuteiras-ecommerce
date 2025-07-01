"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  CP
                </span>
              </div>
              <span className="font-bold text-xl">ChuteirasPro</span>
            </div>
            <p className="text-gray-400 mb-4">
              Especialistas em chuteiras profissionais de primeira linha.
              Qualidade, variedade e atendimento excepcional.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/produtos"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/promocoes"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Promoções
                </Link>
              </li>
              <li>
                <Link
                  href="/lancamentos"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Lançamentos
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/sobre"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Contato
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/produtos?categoria=futsal"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Futsal
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos?categoria=society"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Society
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos?categoria=campo"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Campo
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/produtos?marca=nike"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Nike
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos?marca=adidas"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Adidas
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 ChuteirasPro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
