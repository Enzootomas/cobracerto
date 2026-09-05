import Sidebar from "@/components/Sidebar";

const cards = [
  {
    title: "A receber",
    value: "R$ 18.450,00",
  },
  {
    title: "Recebido este mês",
    value: "R$ 42.300,00",
  },
  {
    title: "Em atraso",
    value: "R$ 6.800,00",
  },
  {
    title: "Inadimplência",
    value: "8,4%",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="ml-64 p-10">

        <div className="mb-10">

          <p className="text-sm text-blue-400">
            Dashboard
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Olá 👋
          </h2>

          <p className="mt-2 text-slate-400">
            Acompanhe a saúde financeira da sua empresa.
          </p>

        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {cards.map((card) => (

            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >

              <p className="text-sm text-slate-400">
                {card.title}
              </p>

              <p className="mt-3 text-2xl font-bold">
                {card.value}
              </p>

            </div>

          ))}

        </div>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-7">

          <h3 className="text-lg font-semibold">
            Visão geral
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Os indicadores financeiros reais serão conectados ao backend nas próximas etapas.
          </p>

        </section>

      </main>

    </div>
  );
}