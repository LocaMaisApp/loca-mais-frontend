import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import FinishTicketModal from "../../components/FinishTicketModal";
import Navbar from "../../components/Navbar";

interface Ticket {
  id: number;
  description: string;
  urgent: boolean;
  status: "PENDENT" | "PROGRESS" | "FINISHED";
  createdAt: string;
  total_value?: number;
}

const TicketManagement: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);
  const [landlordId, setLandlordId] = useState<number | null>(null);
  const [landlordEmail, setLandlordEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setLandlordId(user?.id || null);
    setLandlordEmail(user?.email || null);
  }, []);

  const fetchTickets = async () => {
    if (!propertyId || !landlordId) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/tickets/property/${propertyId}/${landlordId}`);
      console.log('Response GET tickets:', response);
      const data = Array.isArray(response.data)
        ? response.data.map((t) => ({ ...t, createdAt: t.createdAt || t.created_at }))
        : [];
      setTickets(data);
    } catch {
      // erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId && landlordId) {
      fetchTickets();
    }
    // eslint-disable-next-line
  }, [propertyId, landlordId]);

  const handleStatusChange = async (ticket: Ticket, newStatus: "PROGRESS" | "FINISHED", totalValue?: number) => {
    try {
      setStatusLoadingId(ticket.id);
      if (newStatus === "FINISHED" && totalValue === undefined) {
        setSelectedTicket(ticket);
        setFinishModalOpen(true);
        setStatusLoadingId(null);
        return;
      }
      if (!landlordEmail) {
        alert('Não foi possível obter o e-mail do proprietário.');
        setStatusLoadingId(null);
        return;
      }
      const response = await api.put(`/api/tickets/${ticket.id}/status`, {
        status: newStatus,
        ...(newStatus === "FINISHED" ? { total_value: totalValue } : {}),
        email: landlordEmail,
      });
      console.log('Response PUT status:', response);
      await fetchTickets();
    } catch {
      // erro
    } finally {
      setStatusLoadingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tickets de Manutenção</h1>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Nenhum ticket encontrado para este imóvel.</div>
        ) : (
          <div className="space-y-4">
            {tickets
              .slice()
              .sort((a, b) => a.id - b.id)
              .map((ticket) => {
                let dataAbertura = "-";
                if (ticket.createdAt) {
                  const date = new Date(ticket.createdAt);
                  if (!isNaN(date.getTime())) {
                    dataAbertura = date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
                  }
                }
                return (
              <div key={ticket.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {ticket.urgent && <span className="badge bg-red-500 text-white">Urgente</span>}
                    <span className={`badge ${ticket.status === "PENDENT" ? "bg-yellow-200 text-yellow-800" : ticket.status === "PROGRESS" ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800"}`}>{ticket.status === "PENDENT" ? "Pendente" : ticket.status === "PROGRESS" ? "Em Progresso" : "Finalizado"}</span>
                  </div>
                  <div className="font-semibold text-gray-800 mb-1">{ticket.description}</div>
                  <div className="text-xs text-gray-500">Aberto em: {dataAbertura}</div>
                  {ticket.status === "FINISHED" && ticket.total_value !== undefined && (
                    <div className="mt-2 text-sm text-green-700">Custo total: R$ {ticket.total_value.toFixed(2)}</div>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  {ticket.status === "PENDENT" && (
                    <button
                      className="btn btn-info"
                      onClick={async () => {
                        await handleStatusChange(ticket, "PROGRESS");
                      }}
                      disabled={statusLoadingId === ticket.id}
                    >
                      {statusLoadingId === ticket.id ? "Atualizando..." : "Mover para Em Progresso"}
                    </button>
                  )}
                  {ticket.status === "PROGRESS" && (
                    <button
                      className="btn btn-success"
                      onClick={async () => {
                        await handleStatusChange(ticket, "FINISHED");
                      }}
                      disabled={statusLoadingId === ticket.id}
                    >
                      {statusLoadingId === ticket.id ? "Atualizando..." : "Finalizar Ticket"}
                    </button>
                  )}
                </div>
              </div>
               );
             })}
          </div>
        )}
      </div>
      {selectedTicket && (
        <FinishTicketModal
          isOpen={finishModalOpen}
          onClose={() => setFinishModalOpen(false)}
          onFinish={async (totalValue: number) => {
            setFinishModalOpen(false);
            await handleStatusChange(selectedTicket, "FINISHED", totalValue);
            await fetchTickets();
          }}
        />
      )}
    </>
  );
};

export default TicketManagement; 