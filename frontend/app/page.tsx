"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Bot,
  CircleDollarSign,
  FileCheck2,
  Plus,
  ReceiptText,
  UserPlus,
} from "lucide-react";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  DashboardAnalytics,
  DashboardSummary,
  getDashboardAnalytics,
  getDashboardSummary,
} from "../lib/api";

const quickActions = [
  {
    title: "Novo cliente",
    description: "Cadastre um novo cliente",
    href: "/clientes#novo-cliente",
    icon: UserPlus,
  },
  {
    title: "Nova cobrança",
    description: "Cadastre uma conta a receber",
    href: "/contas-receber#nova-cobranca",
    icon: Plus,
  },
  {
    title: "Ver inadimplentes",
    description: "Acompanhe cobranças em atraso",
    href: "/inadimplentes",
    icon: CircleDollarSign,
  },
  {
    title: "Assistente IA",
    description: "Consulte seus dados financeiros",
    href: "/assistente",
    icon: Bot,
  },
  {
    title: "Conciliação",
    description: "Importe e concilie pagamentos",
    href: "/conciliacao",
    icon: FileCheck2,
  },
];

export default function DashboardPage() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [analytics, setAnalytics] =
    useState<DashboardAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [summaryData, analyticsData] =
          await Promise.all([
            getDashboardSummary(),
            getDashboardAnalytics(),
          ]);

        setSummary(summaryData);
        setAnalytics(analyticsData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Erro ao carregar dashboard.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function formatCurrency(value: string) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const chartData = analytics
    ? [
        {
          name: "Pagas",
          value: analytics.paid_count,
        },
        {
          name: "Pendentes",
          value: analytics.pending_count,
        },
        {
          name: "Atrasadas",
          value: analytics.overdue_count,
        },
      ]
    : [];

  const chartColors = [
    "#10b981",
    "#f59e0b",
    "#ef4444",
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        {/* CABEÇALHO */}

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

        {/* AÇÕES RÁPIDAS */}

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Ações rápidas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Acesse rapidamente as principais funções do CobraCerto.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-blue-700"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                    />
                  </div>

                  <h3 className="font-semibold text-slate-100">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ERRO */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* DASHBOARD */}

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
            Carregando dashboard...
          </div>
        ) : summary && analytics ? (
          <>
            {/* CARDS */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                  <ReceiptText size={20} />
                </div>

                <p className="text-sm text-slate-400">
                  Total a receber
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {formatCurrency(
                    summary.total_receivable
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400">
                  <FileCheck2 size={20} />
                </div>

                <p className="text-sm text-slate-400">
                  Total pago
                </p>

                <p className="mt-3 text-3xl font-bold text-emerald-400">
                  {formatCurrency(
                    summary.total_paid
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-400">
                  <CircleDollarSign size={20} />
                </div>

                <p className="text-sm text-slate-400">
                  Total em atraso
                </p>

                <p className="mt-3 text-3xl font-bold text-red-400">
                  {formatCurrency(
                    summary.total_overdue
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/10 text-amber-400">
                  <CircleDollarSign size={20} />
                </div>

                <p className="text-sm text-slate-400">
                  Taxa de inadimplência
                </p>

                <p className="mt-3 text-3xl font-bold text-amber-400">
                  {analytics.delinquency_rate.toLocaleString(
                    "pt-BR"
                  )}
                  %
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {analytics.overdue_count} de{" "}
                  {analytics.total_count} cobranças
                </p>
              </div>
            </div>

            {/* GRÁFICO E SITUAÇÃO */}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* GRÁFICO */}

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">
                  Distribuição das cobranças
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Quantidade por situação financeira
                </p>

                <div className="mt-6 h-80">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                      >
                        {chartData.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                chartColors[
                                  index %
                                    chartColors.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* INDICADORES */}

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">
                  Situação das cobranças
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Visão detalhada por status
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <div>
                      <p className="font-medium text-emerald-400">
                        Pagas
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatCurrency(
                          analytics.paid_amount
                        )}
                      </p>
                    </div>

                    <p className="text-3xl font-bold">
                      {analytics.paid_count}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <div>
                      <p className="font-medium text-amber-400">
                        Pendentes
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatCurrency(
                          analytics.pending_amount
                        )}
                      </p>
                    </div>

                    <p className="text-3xl font-bold">
                      {analytics.pending_count}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <div>
                      <p className="font-medium text-red-400">
                        Atrasadas
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatCurrency(
                          analytics.overdue_amount
                        )}
                      </p>
                    </div>

                    <p className="text-3xl font-bold">
                      {analytics.overdue_count}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}