import React, { useState } from "react";
import api from "../api/axiosConfig";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  tenantEmail: string;
  onSuccess?: () => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  tenantEmail,
  onSuccess,
}) => {
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!description.trim()) {
      setError("A descrição é obrigatória.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/tickets/", {
        urgent,
        description,
        property_id: propertyId,
        tenantEmail,
      });
      setSuccess(true);
      setDescription("");
      setUrgent(false);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch {
      setError("Erro ao criar ticket. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Abrir Ticket de Manutenção</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Descrição <span className="text-red-500">*</span></label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 min-h-[80px] focus:ring-2 focus:ring-primary-500"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="urgent"
              checked={urgent}
              onChange={e => setUrgent(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="urgent" className="text-gray-700">Solicitação urgente</label>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Ticket criado com sucesso!</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-primary-500 text-white hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Abrir Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal; 