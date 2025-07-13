import React, { useEffect, useState } from "react";
import { BiDollarCircle, BiMoney } from "react-icons/bi";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import api from "../api/axiosConfig";
import { handleApiError } from "../utils/errorHandler";

interface Contract {
  id: number;
  payment_day: number;
  monthly_value: number;
  propertyEntity: {
    name: string;
    street: string;
    number: number;
    city: string;
    state: string;
  };
}

interface AddPaymentModalProps {
  contract: Contract | null;
  onUpdate: () => void;
  ref: React.RefObject<HTMLDialogElement | null>;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  contract,
  onUpdate,
  ref,
}) => {
  const [formData, setFormData] = useState({
    value: "",
    tax: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contract) {
      setFormData({
        value: contract.monthly_value.toString(),
        tax: "0",
      });
      setError(null);
      setShowSuccess(false);
    }
  }, [contract]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    if (!formData.value || parseFloat(formData.value) <= 0) {
      setError("Por favor, insira um valor válido para o pagamento.");
      return;
    }

    if (parseFloat(formData.tax) < 0) {
      setError("A taxa não pode ser negativa.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const paymentData = {
        value: parseFloat(formData.value),
        tax: parseFloat(formData.tax) || 0,
        contractId: contract.id,
      };

      await api.post("/api/payment", paymentData);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onUpdate();
        ref.current?.close();
      }, 2000);
    } catch (error) {
      setError(handleApiError(error, "Erro ao registrar pagamento"));
    } finally {
      setLoading(false);
    }
  };

  const totalValue = parseFloat(formData.value || "0") + parseFloat(formData.tax || "0");

  if (!contract) return null;

  return (
    <dialog className="modal" ref={ref}>
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Registrar Pagamento</h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => ref.current?.close()}
            type="button"
          >
            ✕
          </button>
        </div>

        {showSuccess && (
          <div className="alert alert-success mb-4">
            <FaCheckCircle className="w-6 h-6" />
            <span>Pagamento registrado com sucesso!</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-4">
            <FaTimes className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-base-200 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <BiDollarCircle className="w-5 h-5 text-green-600" />
            Contrato #{contract.id}
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Propriedade:</strong> {contract.propertyEntity.name}</p>
            <p><strong>Endereço:</strong> {contract.propertyEntity.street}, {contract.propertyEntity.number}</p>
            <p><strong>Cidade:</strong> {contract.propertyEntity.city}, {contract.propertyEntity.state}</p>
            <p><strong>Valor Mensal:</strong> R$ {contract.monthly_value.toFixed(2)}</p>
            <p><strong>Dia de Pagamento:</strong> {contract.payment_day}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <BiMoney className="w-4 h-4 text-green-600" />
                Valor do Pagamento *
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              className="input input-bordered"
              value={formData.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              required
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Valor padrão baseado no aluguel mensal
              </span>
            </label>
          </div>

          {/* Taxa Adicional */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <BiDollarCircle className="w-4 h-4 text-orange-600" />
                Taxa Adicional
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              className="input input-bordered"
              value={formData.tax}
              onChange={(e) => handleInputChange("tax", e.target.value)}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Taxas extras, multas ou juros (opcional)
              </span>
            </label>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-800">Valor Total:</span>
              <span className="text-xl font-bold text-green-600">
                R$ {totalValue.toFixed(2)}
              </span>
            </div>
            {parseFloat(formData.tax) > 0 && (
              <div className="mt-2 text-xs text-green-700">
                <div className="flex justify-between">
                  <span>Valor base:</span>
                  <span>R$ {parseFloat(formData.value || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa adicional:</span>
                  <span>R$ {parseFloat(formData.tax).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-primary-500 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Registrando...
                </>
              ) : (
                "Registrar Pagamento"
              )}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={() => ref.current?.close()}>close</button>
      </form>
    </dialog>
  );
};

export default AddPaymentModal;
