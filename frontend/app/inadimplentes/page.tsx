"use client";

import { useEffect, useState } from "react";

import {
  CollectionMessage,
  CollectionTone,
  Receivable,
  generateCollectionMessage,
  getOverdueReceivables,
} from "../../lib/api";

export default function InadimplentesPage() {
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedReceivable, setSelectedReceivable] =
    useState<Receivable | null>(null);

  const [tone, setTone] =
    useState<CollectionTone>("professional");

  const [generatedMessage, setGeneratedMessage] =
    useState<CollectionMessage | null>(null);

  const [generating, setGenerating] = useState(false);

  async function loadOverdue() {
    try {
      setLoading(true);
      setError("");

      const data = await getOverdueReceivables();

      setReceivables(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao carregar inadimplentes.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverdue();
  }, []);

  function formatCurrency(value: string) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatDate(value: string) {
    const [year, month, day] = value.split("-");

    return `${day}/${month}/${year}`;
  }

  async function handleGenerate() {
    if (!selectedReceivable) {
      return;
    }

    try {
      setGenerating(true);
      setError("");

      const message = await generateCollectionMessage(
        selectedReceivable.id,
        tone
      );

      setGeneratedMessage(message);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao gerar mensagem.");
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    if (!generatedMessage) {
      return;
    }

    await navigator.clipboard.writeText(
      generatedMessage.message
    );

    alert("Mensagem copiada!");
  }

  function closeModal() {
    setSelectedReceivable(null);
    setGeneratedMessage(null);
    setTone("professional");
  }

  const totalOverdue = receivables.reduce(
    (total, receivable) =>
      total + Number(receivable.amount),
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-400">
            CobraCerto
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Inadimplentes
          </h1>

          <p className="mt-2 text-slate-400">
            Acompanhe cobranças em atraso e gere mensagens
            personalizadas.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Cobranças em atraso
            </p>

            <p className="mt-2 text-3xl font-bold">
              {receivables.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Valor total em atraso
            </p>

            <p className="mt-2 text-3xl font-bold text-red-400">
              {totalOverdue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <p className="text-slate-400">
              Carregando cobranças...
            </p>
          </div>
        ) : receivables.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="text-xl font-semibold">
              Nenhuma cobrança em atraso
            </h2>

            <p className="mt-2 text-slate-400">
              Todos os pagamentos estão em dia.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {receivables.map((receivable) => (
              <div
                key={receivable.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {receivable.client_name}
                    </h2>

                    <p className="mt-1 text-slate-400">
                      {receivable.description}
                    </p>
                  </div>

                  <span className="rounded-full border border-red-800 bg-red-950 px-3 py-1 text-xs font-medium text-red-400">
                    Atrasado
                  </span>
                </div>

                <div className="mb-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Valor
                    </span>

                    <span className="font-semibold">
                      {formatCurrency(receivable.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Vencimento
                    </span>

                    <span>
                      {formatDate(receivable.due_date)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Dias em atraso
                    </span>

                    <span className="font-semibold text-red-400">
                      {receivable.days_overdue}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedReceivable(receivable);
                    setGeneratedMessage(null);
                    setTone("professional");
                  }}
                  className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500"
                >
                  Gerar cobrança
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedReceivable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Gerar cobrança
                  </h2>

                  <p className="mt-1 text-slate-400">
                    {selectedReceivable.client_name}
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="text-xl text-slate-400 transition hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-medium">
                  {selectedReceivable.description}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {formatCurrency(
                    selectedReceivable.amount
                  )}{" "}
                  • {selectedReceivable.days_overdue} dia(s)
                  em atraso
                </p>
              </div>

              <label className="mb-2 block text-sm text-slate-400">
                Tom da mensagem
              </label>

              <select
                value={tone}
                onChange={(event) =>
                  setTone(
                    event.target.value as CollectionTone
                  )
                }
                className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="friendly">
                  Amigável
                </option>

                <option value="professional">
                  Profissional
                </option>

                <option value="formal">
                  Formal
                </option>

                <option value="direct">
                  Direto
                </option>
              </select>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating
                  ? "Gerando..."
                  : "Gerar mensagem"}
              </button>

              {generatedMessage && (
                <div className="mt-6">
                  <p className="mb-2 text-sm font-medium text-slate-400">
                    Mensagem gerada
                  </p>

                  <div className="rounded-xl border border-slate-700 bg-slate-950 p-5 leading-7 text-slate-200">
                    {generatedMessage.message}
                  </div>

                  <button
                    onClick={handleCopy}
                    className="mt-4 w-full rounded-lg border border-slate-700 py-3 font-semibold transition hover:bg-slate-800"
                  >
                    Copiar mensagem
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}