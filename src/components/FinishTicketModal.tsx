import React, { useState } from "react";

interface FinishTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: (totalValue: number) => void;
}

const FinishTicketModal: React.FC<FinishTicketModalProps> = ({ isOpen, onClose, onFinish }) => {
  const [totalValue, setTotalValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const value = parseFloat(totalValue.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      setError("Informe um valor válido maior que zero.");
      return;
    }
    setLoading(true);
    await onFinish(value);
    setLoading(false);
    setTotalValue("");
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Finalizar Ticket</h2>
        <p className="mb-4 text-gray-700">Informe o custo total da manutenção para finalizar o ticket:</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Custo Total (R$) <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500"
              value={totalValue}
              onChange={e => setTotalValue(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
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
              {loading ? "Finalizando..." : "Finalizar Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinishTicketModal; 