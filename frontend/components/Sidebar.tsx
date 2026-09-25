"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Bot,
  CircleDollarSign,
  FileCheck2,
  LayoutDashboard,
  ReceiptText,
  Users,
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

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 p-5 text-white">
      {/* LOGO */}

      <div className="mb-8 px-2">
        <Link
          href="/"
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

        <p className="mt-2 text-[11px] text-slate-500">
          Receba melhor. Cobre menos.
        </p>
      </div>

      {/* MENU */}

      <nav className="flex flex-1 flex-col gap-1">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          Menu principal
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
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

              <span>
                {item.name}
              </span>

              {active && (
                <span className="ml-auto h-2 w-2 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* RODAPÉ */}

      <div className="border-t border-slate-800 pt-5">
        <div className="rounded-xl bg-slate-900/70 p-3">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logo-cobracerto.png"
              alt="CobraCerto"
              width={90}
              height={30}
              className="h-auto w-[90px] object-contain"
            />

            <div>
              <p className="text-[11px] text-slate-500">
                Sistema financeiro
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-slate-700">
          MVP • 2026
        </p>
      </div>
    </aside>
  );
}