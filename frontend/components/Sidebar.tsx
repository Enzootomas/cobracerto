import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 p-6 text-white">

      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          Cobra<span className="text-blue-500">Certo</span>
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Receba melhor. Cobre menos.
        </p>
      </div>

      <nav className="flex flex-col gap-2">

        <Link
          href="/"
          className="rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
        >
          Dashboard
        </Link>

        <Link
          href="/clientes"
          className="rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
        >
          Clientes
        </Link>

        <button
          className="rounded-lg px-4 py-3 text-left text-sm text-slate-500"
          disabled
        >
          Contas a receber
        </button>

        <button
          className="rounded-lg px-4 py-3 text-left text-sm text-slate-500"
          disabled
        >
          Inadimplentes
        </button>

        <button
          className="rounded-lg px-4 py-3 text-left text-sm text-slate-500"
          disabled
        >
          Conciliação
        </button>

      </nav>

      <div className="mt-auto border-t border-slate-800 pt-5">

        <p className="text-sm font-medium">
          CobraCerto
        </p>

        <p className="text-xs text-slate-500">
          MVP em desenvolvimento
        </p>

      </div>

    </aside>
  );
}