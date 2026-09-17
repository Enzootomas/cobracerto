"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  askFinancialAssistant,
} from "../../lib/api";


interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}


export default function AssistentePage() {
  const [question, setQuestion] = useState("");

  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        role: "assistant",
        content:
          "Olá! Sou o Assistente Financeiro do CobraCerto. Posso responder perguntas sobre cobranças, valores recebidos, inadimplência e pendências financeiras.",
      },
    ]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const suggestedQuestions = [
    "Quanto tenho em atraso?",
    "Quanto eu já recebi?",
    "Quantas cobranças foram pagas?",
    "Qual é minha taxa de inadimplência?",
    "Quais cobranças precisam de mais atenção?",
  ];


  async function sendQuestion(
    questionText: string
  ) {
    const cleanQuestion =
      questionText.trim();

    if (!cleanQuestion || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: cleanQuestion,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const response =
        await askFinancialAssistant(
          cleanQuestion
        );

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.answer,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Erro ao consultar o assistente."
        );
      }
    } finally {
      setLoading(false);
    }
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    await sendQuestion(question);
  }


  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8">

      <div className="mx-auto max-w-5xl">

        <div className="mb-8">

          <p className="text-sm font-semibold text-blue-400">
            CobraCerto
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Assistente Financeiro
          </h1>

          <p className="mt-2 text-slate-400">
            Converse com a IA usando os dados
            financeiros reais do CobraCerto.
          </p>

        </div>


        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">
            {error}
          </div>
        )}


        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
                IA
              </div>

              <div>
                <p className="font-semibold">
                  CobraCerto IA
                </p>

                <p className="text-xs text-emerald-400">
                  Assistente financeiro
                </p>
              </div>

            </div>

          </div>


          <div className="min-h-[420px] space-y-5 p-6">

            {messages.map(
              (message, index) => (

                <div
                  key={index}
                  className={
                    message.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >

                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-md bg-blue-600 px-5 py-4 text-white"
                        : "max-w-[80%] rounded-2xl rounded-bl-md border border-slate-700 bg-slate-950 px-5 py-4 text-slate-200"
                    }
                  >

                    <p className="whitespace-pre-wrap leading-7">
                      {message.content}
                    </p>

                  </div>

                </div>

              )
            )}


            {loading && (
              <div className="flex justify-start">

                <div className="rounded-2xl rounded-bl-md border border-slate-700 bg-slate-950 px-5 py-4 text-slate-400">
                  Analisando seus dados financeiros...
                </div>

              </div>
            )}

          </div>


          <div className="border-t border-slate-800 p-5">

            <form
              onSubmit={handleSubmit}
              className="flex gap-3"
            >

              <input
                type="text"
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                placeholder="Pergunte sobre sua situação financeira..."
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-blue-500 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !question.trim()
                }
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Enviar
              </button>

            </form>

          </div>

        </section>


        <section className="mt-6">

          <p className="mb-3 text-sm font-medium text-slate-400">
            Perguntas sugeridas
          </p>

          <div className="flex flex-wrap gap-3">

            {suggestedQuestions.map(
              (suggestion) => (

                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    sendQuestion(
                      suggestion
                    )
                  }
                  disabled={loading}
                  className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500 hover:text-white disabled:opacity-50"
                >
                  {suggestion}
                </button>

              )
            )}

          </div>

        </section>


        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4">

          <p className="text-sm text-slate-500">
            O assistente utiliza os dados cadastrados
            no CobraCerto para responder às perguntas.
            As respostas não alteram os dados financeiros.
          </p>

        </div>

      </div>

    </main>
  );
}