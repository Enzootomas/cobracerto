"use client";

import { useEffect, useState } from "react";

import {
  DashboardSummary,
  getDashboardSummary,
} from "../lib/api";


export default function DashboardPage() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getDashboardSummary();

        setSummary(data);

      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(
            "Erro ao carregar dashboard."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);


  function formatCurrency(value: string) {
    return Number(value).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }


  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8">

          <p className="text-sm font-semibold text-blue-400">
            CobraCerto
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Visão geral da situação financeira da empresa.
          </p>

        </div>


        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}


        {loading ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <p className="text-slate-400">
              Carregando dashboard...
            </p>
          </div>

        ) : summary ? (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL A RECEBER */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-sm text-slate-400">
                Total a receber
              </p>

              <p className="mt-3 text-3xl font-bold">
                {formatCurrency(
                  summary.total_receivable
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Cobranças ainda não pagas
              </p>

            </div>


            {/* TOTAL PAGO */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-sm text-slate-400">
                Total pago
              </p>

              <p className="mt-3 text-3xl font-bold text-emerald-400">
                {formatCurrency(
                  summary.total_paid
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Valores já recebidos
              </p>

            </div>


            {/* TOTAL ATRASADO */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-sm text-slate-400">
                Total em atraso
              </p>

              <p className="mt-3 text-3xl font-bold text-red-400">
                {formatCurrency(
                  summary.total_overdue
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Valores vencidos e não pagos
              </p>

            </div>


            {/* INADIMPLENTES */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-sm text-slate-400">
                Cobranças atrasadas
              </p>

              <p className="mt-3 text-3xl font-bold text-amber-400">
                {summary.overdue_count}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Pendências que precisam de atenção
              </p>

            </div>

          </div>

        ) : null}


        {summary && (

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Resumo financeiro
            </h2>

            <p className="mt-2 text-slate-400">
              Os valores acima são calculados automaticamente
              com base nas cobranças cadastradas no CobraCerto.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}