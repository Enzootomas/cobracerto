"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  Client,
  createClient,
  getClients,
} from "@/lib/api";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
  });

  async function loadClients() {
    try {
      setLoading(true);
      const data = await getClients();
      setClients(data);
    } catch {
      setError(
        "Não foi possível carregar os clientes."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSaving(true);

      await createClient(form);

      setSuccess(
        "Cliente cadastrado com sucesso."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        document: "",
      });

      await loadClients();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Erro ao cadastrar cliente."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <main className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:p-10">
        <div className="mx-auto w-full max-w-7xl">
          {/* CABEÇALHO */}

          <div className="mb-8 sm:mb-10">
            <p className="text-sm text-blue-400">
              Clientes
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Gerenciar clientes
            </h2>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Cadastre e acompanhe seus clientes.
            </p>
          </div>

          <div className="grid min-w-0 gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:gap-8">
            {/* FORMULÁRIO */}

            <section
              id="novo-cliente"
              className="min-w-0 scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900 p-4 transition target:border-blue-600 target:ring-2 target:ring-blue-600/20 sm:p-6"
            >
              <h3 className="mb-6 text-lg font-semibold">
                Novo cliente
              </h3>

              <form
                onSubmit={handleSubmit}
                className="min-w-0 space-y-4"
              >
                <div className="min-w-0">
                  <label className="mb-2 block text-sm text-slate-400">
                    Nome
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    required
                    className="min-w-0 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-blue-500 sm:px-4"
                    placeholder="Clínica Sorriso"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-2 block text-sm text-slate-400">
                    E-mail
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        email: event.target.value,
                      })
                    }
                    required
                    className="min-w-0 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-blue-500 sm:px-4"
                    placeholder="financeiro@empresa.com"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-2 block text-sm text-slate-400">
                    WhatsApp
                  </label>

                  <input
                    value={form.phone}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        phone: event.target.value,
                      })
                    }
                    required
                    className="min-w-0 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-blue-500 sm:px-4"
                    placeholder="15999999999"
                  />
                </div>

                <div className="min-w-0">
                  <label className="mb-2 block text-sm text-slate-400">
                    CPF / CNPJ
                  </label>

                  <input
                    value={form.document}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        document: event.target.value,
                      })
                    }
                    required
                    className="min-w-0 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-blue-500 sm:px-4"
                    placeholder="12345678000100"
                  />
                </div>

                {error && (
                  <div className="break-words rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="break-words rounded-lg border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full whitespace-normal rounded-lg bg-blue-600 px-3 py-3 text-sm font-medium transition hover:bg-blue-500 disabled:opacity-50 sm:text-base"
                >
                  {saving
                    ? "Salvando..."
                    : "Cadastrar cliente"}
                </button>
              </form>
            </section>

            {/* LISTA */}

            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="border-b border-slate-800 p-4 sm:p-6">
                <h3 className="text-lg font-semibold">
                  Clientes cadastrados
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {clients.length} cliente(s)
                </p>
              </div>

              {loading ? (
                <div className="p-6 text-slate-400 sm:p-8">
                  Carregando clientes...
                </div>
              ) : clients.length === 0 ? (
                <div className="p-6 text-slate-400 sm:p-8">
                  Nenhum cliente cadastrado.
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="min-w-[720px] text-left">
                    <thead className="text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-4 sm:px-6">
                          Nome
                        </th>

                        <th className="px-4 py-4 sm:px-6">
                          E-mail
                        </th>

                        <th className="px-4 py-4 sm:px-6">
                          WhatsApp
                        </th>

                        <th className="px-4 py-4 sm:px-6">
                          Documento
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {clients.map((client) => (
                        <tr
                          key={client.id}
                          className="border-t border-slate-800"
                        >
                          <td className="px-4 py-4 font-medium sm:px-6">
                            {client.name}
                          </td>

                          <td className="px-4 py-4 text-slate-400 sm:px-6">
                            {client.email}
                          </td>

                          <td className="px-4 py-4 text-slate-400 sm:px-6">
                            {client.phone}
                          </td>

                          <td className="px-4 py-4 text-slate-400 sm:px-6">
                            {client.document}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}