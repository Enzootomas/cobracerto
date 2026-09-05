"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import {
  Client,
  Receivable,
  createReceivable,
  getClients,
  getReceivables,
  markReceivableAsPaid,
} from "@/lib/api";


export default function ReceivablesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [receivables, setReceivables] =
    useState<Receivable[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    client_id: "",
    description: "",
    amount: "",
    due_date: "",
  });


  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [clientsData, receivablesData] =
        await Promise.all([
          getClients(),
          getReceivables(),
        ]);

      setClients(clientsData);
      setReceivables(receivablesData);

    } catch {
      setError(
        "Não foi possível carregar os dados."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadData();
  }, []);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.client_id) {
      setError("Selecione um cliente.");
      return;
    }

    try {
      setSaving(true);

      await createReceivable({
        client_id: Number(form.client_id),
        description: form.description,
        amount: Number(form.amount),
        due_date: form.due_date,
      });

      setSuccess(
        "Cobrança criada com sucesso."
      );

      setForm({
        client_id: "",
        description: "",
        amount: "",
        due_date: "",
      });

      await loadData();

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao criar cobrança.");
      }
    } finally {
      setSaving(false);
    }
  }


  async function handlePaid(id: number) {
    const confirmed = window.confirm(
      "Deseja realmente marcar esta cobrança como paga?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await markReceivableAsPaid(id);

      setSuccess(
        "Cobrança marcada como paga."
      );

      await loadData();

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  }


  function formatCurrency(value: string) {
    return Number(value).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }


  function formatDate(value: string) {
    const [year, month, day] =
      value.split("-");

    return `${day}/${month}/${year}`;
  }


  function getStatus(status: string) {
    if (status === "paid") {
      return {
        label: "Pago",
        classes:
          "bg-emerald-950 text-emerald-400 border-emerald-800",
      };
    }

    if (status === "overdue") {
      return {
        label: "Atrasado",
        classes:
          "bg-red-950 text-red-400 border-red-800",
      };
    }

    return {
      label: "Pendente",
      classes:
        "bg-amber-950 text-amber-400 border-amber-800",
    };
  }


  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">
            CobraCerto
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Contas a receber
          </h1>

          <p className="mt-2 text-slate-400">
            Cadastre e acompanhe as cobranças da empresa.
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


        <div className="grid gap-8 xl:grid-cols-[380px_1fr]">

          {/* NOVA COBRANÇA */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="mb-6 text-xl font-semibold">
              Nova cobrança
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Cliente
                </label>

                <select
                  required
                  value={form.client_id}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      client_id:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">
                    Selecione um cliente
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>


              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Descrição
                </label>

                <input
                  required
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description:
                        event.target.value,
                    })
                  }
                  placeholder="Mensalidade de setembro"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Valor
                </label>

                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      amount:
                        event.target.value,
                    })
                  }
                  placeholder="1500.00"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Vencimento
                </label>

                <input
                  required
                  type="date"
                  value={form.due_date}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      due_date:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>


              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
              >
                {saving
                  ? "Criando..."
                  : "Criar cobrança"}
              </button>

            </form>

          </section>


          {/* LISTAGEM */}

          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">

              <h2 className="text-xl font-semibold">
                Cobranças
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {receivables.length} cobrança(s)
              </p>

            </div>


            {loading ? (

              <div className="p-8 text-slate-400">
                Carregando cobranças...
              </div>

            ) : receivables.length === 0 ? (

              <div className="p-8 text-slate-400">
                Nenhuma cobrança cadastrada.
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4">
                        Cliente
                      </th>

                      <th className="px-6 py-4">
                        Descrição
                      </th>

                      <th className="px-6 py-4">
                        Valor
                      </th>

                      <th className="px-6 py-4">
                        Vencimento
                      </th>

                      <th className="px-6 py-4">
                        Status
                      </th>

                      <th className="px-6 py-4">
                        Ações
                      </th>
                    </tr>
                  </thead>


                  <tbody>

                    {receivables.map(
                      (receivable) => {

                        const status =
                          getStatus(
                            receivable.status
                          );

                        return (
                          <tr
                            key={
                              receivable.id
                            }
                            className="border-t border-slate-800"
                          >

                            <td className="px-6 py-4 font-medium">
                              {
                                receivable.client_name
                              }
                            </td>

                            <td className="px-6 py-4 text-slate-400">
                              {
                                receivable.description
                              }
                            </td>

                            <td className="px-6 py-4">
                              {formatCurrency(
                                receivable.amount
                              )}
                            </td>

                            <td className="px-6 py-4 text-slate-400">
                              {formatDate(
                                receivable.due_date
                              )}
                            </td>

                            <td className="px-6 py-4">

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-medium ${status.classes}`}
                              >
                                {
                                  status.label
                                }
                              </span>

                              {receivable.status ===
                                "overdue" && (
                                <p className="mt-2 text-xs text-red-400">
                                  {
                                    receivable.days_overdue
                                  }{" "}
                                  dia(s) em atraso
                                </p>
                              )}

                            </td>

                            <td className="px-6 py-4">

                              {receivable.status !==
                              "paid" ? (

                                <button
                                  onClick={() =>
                                    handlePaid(
                                      receivable.id
                                    )
                                  }
                                  className="rounded-lg border border-emerald-800 px-3 py-2 text-xs text-emerald-400 transition hover:bg-emerald-950"
                                >
                                  Marcar como pago
                                </button>

                              ) : (

                                <span className="text-sm text-slate-500">
                                  Finalizado
                                </span>

                              )}

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </div>

      </div>

    </main>
  );
}