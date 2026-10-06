"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Bot,
  CircleDollarSign,
  FileCheck2,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Users,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    name: "Contas a receber",
    href: "/contas-receber",
    icon: ReceiptText,
  },
  {
    name: "Inadimplentes",
    href: "/inadimplentes",
    icon: CircleDollarSign,
  },
  {
    name: "Assistente IA",
    href: "/assistente",
    icon: Bot,
  },
  {
    name: "Conciliação",
    href: "/conciliacao",
    icon: FileCheck2,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* BARRA MOBILE */}

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur lg:hidden">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center"
        >
          <Image
            src="/assets/logo-cobracerto.png"
            alt="Logo CobraCerto"
            width={145}
            height={48}
            priority
            className="h-auto w-[145px] object-contain"
          />
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-white transition hover:bg-slate-800"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* FUNDO ESCURO NO MOBILE */}

      {open && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-dvh
          w-[85vw] max-w-72 flex-col
          border-r border-slate-800 bg-slate-950
          p-5 text-white shadow-2xl
          transition-transform duration-300
          lg:h-screen lg:w-64 lg:max-w-none lg:translate-x-0 lg:shadow-none
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* LOGO */}

        <div className="mb-8">
          <div className="flex items-start justify-between gap-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block"
            >
              <Image
                src="/assets/logo-cobracerto.png"
                alt="Logo CobraCerto"
                width={190}
                height={64}
                priority
                className="h-auto w-full max-w-[190px] object-contain"
              />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:bg-slate-900 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Receba melhor. Cobre menos.
          </p>
        </div>

        {/* MENU */}

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Menu principal
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(
                    item.href
                  );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setOpen(false)
                }
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-3
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className={
                    active
                      ? "text-white"
                      : "text-slate-500 transition group-hover:text-blue-400"
                  }
                />

                <span className="truncate">
                  {item.name}
                </span>

                {active && (
                  <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RODAPÉ */}

        <div className="mt-5 border-t border-slate-800 pt-4">
          <div className="rounded-xl bg-slate-900/70 p-3">
            <p className="text-sm font-medium text-slate-200">
              CobraCerto
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Sistema financeiro
            </p>
          </div>

          <p className="mt-3 text-center text-[10px] text-slate-700">
            MVP • 2026
          </p>
        </div>
      </aside>
    </>
  );
}