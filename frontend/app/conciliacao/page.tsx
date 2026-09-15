"use client";

import { ChangeEvent, useState } from "react";

import {
  ReconciliationPreview,
  confirmReconciliation,
  previewReconciliation,
} from "../../lib/api";

export default function ConciliacaoPage() {
  const [file, setFile] = useState<File | null>(null);

  const [preview, setPreview] =
    useState<ReconciliationPreview | null>(null);

  const [selectedIds, setSelectedIds] =
    useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setPreview(null);
    setSelectedIds([]);
    setError("");
    setSuccess("");
  }

  async function handlePreview() {
    if (!file) {
      setError("Selecione um arquivo CSV.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await previewReconciliation(file);

      setPreview(data);

      setSelectedIds(
        data.matched.map(
          (item) => item.receivable_id
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao processar o CSV.");
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleReceivable(
    receivableId: number
  ) {
    setSelectedIds((current) => {
      if (current.includes(receivableId)) {
        return current.filter(
          (id) => id !== receivableId
        );
      }

      return [...current, receivableId];
    });
  }

  async function handleConfirm() {
    if (selectedIds.length === 0) {
      setError(
        "Selecione pelo menos uma correspondência."
      );

      return;
    }

    try {
      setConfirming(true);
      setError("");
      setSuccess("");

      const result =
        await confirmReconciliation(
          selectedIds
        );

      setSuccess(
        `${result.confirmed_count} cobrança(s) conciliada(s) com sucesso.`
      );

      if (preview) {
        const confirmedSet = new Set(
          result.receivable_ids
        );

        const remainingMatched =
          preview.matched.filter(
            (item) =>
              !confirmedSet.has(
                item.receivable_id
              )
          );

        setPreview({
          ...preview,
          matched: remainingMatched,
          matched_count:
            remainingMatched.length,
        });
      }

      setSelectedIds([]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Erro ao confirmar conciliação."
        );
      }
    } finally {
      setConfirming(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-400">
            CobraCerto
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Conciliação bancária
          </h1>

          <p className="mt-2 text-slate-400">
            Importe um extrato CSV e encontre pagamentos
            correspondentes às cobranças cadastradas.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-900 bg-emerald-950/40 p-4 text-emerald-300">
            {success}
          </div>
        )}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Importar extrato
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            O CSV deve possuir as colunas:
            date, description e amount.
          </p>

          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="mt-6 block w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-300"
          />

          {file && (
            <p className="mt-3 text-sm text-slate-400">
              Arquivo selecionado:{" "}
              <span className="text-white">
                {file.name}
              </span>
            </p>
          )}

          <button
            onClick={handlePreview}
            disabled={!file || loading}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Processando..."
              : "Analisar CSV"}
          </button>
        </section>

        {preview && (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Transações
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {preview.total_transactions}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-900 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Correspondências
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-400">
                  {preview.matched_count}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-900 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Não identificadas
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-400">
                  {preview.unmatched_count}
                </p>
              </div>

            </div>

            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

              <div className="border-b border-slate-800 p-6">
                <h2 className="text-xl font-semibold">
                  Correspondências encontradas
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Revise antes de confirmar os pagamentos.
                </p>
              </div>

              {preview.matched.length === 0 ? (
                <div className="p-6 text-slate-400">
                  Nenhuma correspondência disponível
                  para conciliar.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">

                    <thead className="border-b border-slate-800 text-left text-sm text-slate-500">
                      <tr>
                        <th className="p-4">
                          Confirmar
                        </th>

                        <th className="p-4">
                          Cliente
                        </th>

                        <th className="p-4">
                          Cobrança
                        </th>

                        <th className="p-4">
                          Transação
                        </th>

                        <th className="p-4">
                          Valor
                        </th>

                        <th className="p-4">
                          Vencimento
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {preview.matched.map(
                        (item) => (
                          <tr
                            key={
                              item.receivable_id
                            }
                            className="border-b border-slate-800 last:border-none"
                          >
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={
                                  selectedIds.includes(
                                    item.receivable_id
                                  )
                                }
                                onChange={() =>
                                  toggleReceivable(
                                    item.receivable_id
                                  )
                                }
                                className="h-5 w-5"
                              />
                            </td>

                            <td className="p-4 font-medium">
                              {item.client_name}
                            </td>

                            <td className="p-4 text-slate-300">
                              {
                                item.receivable_description
                              }
                            </td>

                            <td className="p-4 text-slate-400">
                              {
                                item.transaction_description
                              }
                            </td>

                            <td className="p-4 font-semibold text-emerald-400">
                              {formatCurrency(
                                item.transaction_amount
                              )}
                            </td>

                            <td className="p-4 text-slate-300">
                              {formatDate(
                                item.due_date
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                  </table>
                </div>
              )}

              {preview.matched.length > 0 && (
                <div className="border-t border-slate-800 p-6">
                  <button
                    onClick={handleConfirm}
                    disabled={
                      confirming ||
                      selectedIds.length === 0
                    }
                    className="w-full rounded-lg bg-emerald-600 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {confirming
                      ? "Confirmando..."
                      : `Confirmar conciliação (${selectedIds.length})`}
                  </button>
                </div>
              )}

            </section>

            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

              <div className="border-b border-slate-800 p-6">
                <h2 className="text-xl font-semibold">
                  Transações não identificadas
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Transações sem cobrança correspondente.
                </p>
              </div>

              {preview.unmatched.length === 0 ? (
                <div className="p-6 text-emerald-400">
                  Todas as transações foram identificadas.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">

                    <thead className="border-b border-slate-800 text-left text-sm text-slate-500">
                      <tr>
                        <th className="p-4">
                          Data
                        </th>

                        <th className="p-4">
                          Descrição
                        </th>

                        <th className="p-4">
                          Valor
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {preview.unmatched.map(
                        (item, index) => (
                          <tr
                            key={index}
                            className="border-b border-slate-800 last:border-none"
                          >
                            <td className="p-4">
                              {formatDate(
                                item.transaction_date
                              )}
                            </td>

                            <td className="p-4 text-slate-300">
                              {
                                item.transaction_description
                              }
                            </td>

                            <td className="p-4 font-semibold text-amber-400">
                              {formatCurrency(
                                item.transaction_amount
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                  </table>
                </div>
              )}

            </section>
          </>
        )}

      </div>
    </main>
  );
}