const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

// ======================================================
// CLIENTES
// ======================================================

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  created_at: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
  document: string;
}

export async function getClients(): Promise<Client[]> {
  const response = await fetch(`${API_URL}/clients`);

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao carregar clientes."
      )
    );
  }

  return response.json();
}

export async function createClient(
  data: CreateClientData
): Promise<Client> {
  const response = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao cadastrar cliente."
      )
    );
  }

  return response.json();
}

// ======================================================
// CONTAS A RECEBER
// ======================================================

export type ReceivableStatus =
  | "pending"
  | "overdue"
  | "paid";

export interface Receivable {
  id: number;
  client_id: number;
  client_name: string;
  client_phone: string;
  description: string;
  amount: string;
  due_date: string;
  status: ReceivableStatus;
  days_overdue: number;
  created_at: string;
  paid_at: string | null;
}

export interface CreateReceivableData {
  client_id: number;
  description: string;
  amount: number | string;
  due_date: string;
}

export async function getReceivables(): Promise<
  Receivable[]
> {
  const response = await fetch(
    `${API_URL}/receivables`
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao carregar contas a receber."
      )
    );
  }

  return response.json();
}

export async function createReceivable(
  data: CreateReceivableData
): Promise<Receivable> {
  const response = await fetch(
    `${API_URL}/receivables`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao cadastrar conta a receber."
      )
    );
  }

  return response.json();
}

export async function markReceivableAsPaid(
  id: number
): Promise<Receivable> {
  const response = await fetch(
    `${API_URL}/receivables/${id}/paid`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao marcar cobrança como paga."
      )
    );
  }

  return response.json();
}

export async function getOverdueReceivables(): Promise<
  Receivable[]
> {
  const response = await fetch(
    `${API_URL}/receivables/overdue`
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao carregar inadimplentes."
      )
    );
  }

  return response.json();
}

// ======================================================
// COBRANÇA / IA
// ======================================================

export type CollectionTone =
  | "friendly"
  | "professional"
  | "formal"
  | "direct";

export interface CollectionMessage {
  id?: number;
  receivable_id: number;
  tone: CollectionTone;
  message: string;
  created_at?: string;
  fallback_used?: boolean;
}

export async function generateCollectionMessage(
  receivableId: number,
  tone: CollectionTone
): Promise<CollectionMessage> {
  const response = await fetch(
    `${API_URL}/collections/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receivable_id: receivableId,
        tone,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao gerar mensagem de cobrança."
      )
    );
  }

  return response.json();
}

export async function getCollectionMessages(
  receivableId: number
): Promise<CollectionMessage[]> {
  const response = await fetch(
    `${API_URL}/collections/receivable/${receivableId}`
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao carregar mensagens de cobrança."
      )
    );
  }

  return response.json();
}

// ======================================================
// DASHBOARD
// ======================================================

export interface DashboardSummary {
  total_receivable: string;
  total_paid: string;
  total_overdue: string;
  overdue_count: number;
}

export async function getDashboardSummary(): Promise<
  DashboardSummary
> {
  const response = await fetch(
    `${API_URL}/dashboard/summary`
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao carregar resumo do dashboard."
      )
    );
  }

  return response.json();
}

export interface DashboardAnalytics {
  total_count: number;
  paid_count: number;
  pending_count: number;
  overdue_count: number;
  paid_amount: string;
  pending_amount: string;
  overdue_amount: string;
  delinquency_rate: number;
}

export async function getDashboardAnalytics(): Promise<
  DashboardAnalytics
> {
  const response = await fetch(
    `${API_URL}/dashboard/analytics`
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao carregar indicadores financeiros."
      )
    );
  }

  return response.json();
}

// ======================================================
// CONCILIAÇÃO
// ======================================================

export interface ReconciliationMatch {
  transaction_date: string;
  transaction_description: string;
  transaction_amount: string;
  receivable_id: number;
  client_name: string;
  receivable_description: string;
  due_date: string;
}

export interface ReconciliationUnmatched {
  transaction_date: string;
  transaction_description: string;
  transaction_amount: string;
}

export interface ReconciliationPreview {
  total_transactions: number;
  matched_count: number;
  unmatched_count: number;
  matched: ReconciliationMatch[];
  unmatched: ReconciliationUnmatched[];
}

export interface ReconciliationConfirmResponse {
  confirmed_count: number;
  receivable_ids: number[];
}

export async function previewReconciliation(
  file: File
): Promise<ReconciliationPreview> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/reconciliation/csv/preview`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao analisar arquivo de conciliação."
      )
    );
  }

  return response.json();
}

export async function confirmReconciliation(
  receivableIds: number[]
): Promise<ReconciliationConfirmResponse> {
  const response = await fetch(
    `${API_URL}/reconciliation/confirm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receivable_ids: receivableIds,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao confirmar conciliação."
      )
    );
  }

  return response.json();
}

// ======================================================
// ASSISTENTE FINANCEIRO IA
// ======================================================

export interface AssistantResponse {
  answer: string;
}

export async function askFinancialAssistant(
  question: string
): Promise<AssistantResponse> {
  const response = await fetch(
    `${API_URL}/assistant/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erro ao consultar o assistente financeiro."
      )
    );
  }

  return response.json();
}