"use client";

import { FormEvent, useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";

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
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="ml-64 p-10">

        <div className="mb-10">

          <p className="text-sm text-blue-400">
            Clientes
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Gerenciar clientes
          </h2>

          <p className="mt-2 text-slate-400">
            Cadastre e acompanhe seus clientes.
          </p>

        </div>


        <div className="grid gap-8 xl:grid-cols-[380px_1fr]">

          {/* FORMULÁRIO */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="mb-6 text-lg font-semibold">
              Novo cliente
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>

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
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Clínica Sorriso"
                />

              </div>


              <div>

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
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="financeiro@empresa.com"
                />

              </div>


              <div>

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
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="15999999999"
                />

              </div>


              <div>

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
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="12345678000100"
                />

              </div>


              {error && (

                <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
                  {error}
                </div>

              )}


              {success && (

                <div className="rounded-lg border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
                  {success}
                </div>

              )}


              <button
                disabled={saving}
                className="w-full rounded-lg bg-blue-600 py-3 font-medium transition hover:bg-blue-500 disabled:opacity-50"
              >

                {saving
                  ? "Salvando..."
                  : "Cadastrar cliente"}

              </button>

            </form>

          </section>


          {/* LISTA */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 p-6">

              <h3 className="text-lg font-semibold">
                Clientes cadastrados
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {clients.length} cliente(s)
              </p>

            </div>


            {loading ? (

              <div className="p-8 text-slate-400">
                Carregando clientes...
              </div>

            ) : clients.length === 0 ? (

              <div className="p-8 text-slate-400">
                Nenhum cliente cadastrado.
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="text-xs uppercase text-slate-500">

                    <tr>

                      <th className="px-6 py-4">
                        Nome
                      </th>

                      <th className="px-6 py-4">
                        E-mail
                      </th>

                      <th className="px-6 py-4">
                        WhatsApp
                      </th>

                      <th className="px-6 py-4">
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

                        <td className="px-6 py-4 font-medium">
                          {client.name}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {client.email}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {client.phone}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
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

      </main>

    </div>
  );
}