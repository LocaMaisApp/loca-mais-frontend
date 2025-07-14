import React, { useEffect, useState } from "react";
import { BiCalendar, BiDollarCircle, BiHome, BiMoney, BiUser } from "react-icons/bi";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import api from "../api/axiosConfig";
import { handleApiError } from "../utils/errorHandler";
import { useAuth } from "../hooks/useAuth";

interface Property {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  number: number;
  complement: string;
}

interface CreateContractModalProps {
  onUpdate: () => void;
  ref: React.RefObject<HTMLDialogElement | null>;
  isOpen: boolean;
  onClose?: () => void;
}

const CreateContractModal: React.FC<CreateContractModalProps> = ({
  onUpdate,
  ref,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProperties, setLoadingProperties] = useState(false);

  const [formData, setFormData] = useState({
    property_id: "",
    tenantEmail: "",
    monthly_value: "",
    deposit: "",
    duration: "",
    payment_day: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchProperties();
      resetForm();
    }
  }, [isOpen]);

  const fetchProperties = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingProperties(true);
      const response = await api.get(`/api/landlords/${user.id}/properties`);
      setProperties(response.data);
    } catch (error) {
      setError(handleApiError(error, "Erro ao carregar propriedades"));
    } finally {
      setLoadingProperties(false);
    }
  };

  const resetForm = () => {
    setFormData({
      property_id: "",
      tenantEmail: "",
      monthly_value: "",
      deposit: "",
      duration: "",
      payment_day: "",
    });
    setError(null);
    setShowSuccess(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.property_id) {
      setError("Por favor, selecione uma propriedade.");
      return false;
    }
    if (!formData.tenantEmail) {
      setError("Por favor, insira o e-mail do inquilino.");
      return false;
    }
    if (!formData.monthly_value || parseFloat(formData.monthly_value) <= 0) {
      setError("Por favor, insira um valor mensal válido.");
      return false;
    }
    if (!formData.deposit || parseFloat(formData.deposit) < 0) {
      setError("Por favor, insira um valor de depósito válido.");
      return false;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setError("Por favor, insira uma duração válida.");
      return false;
    }
    if (!formData.payment_day || parseInt(formData.payment_day) < 1 || parseInt(formData.payment_day) > 28) {
      setError("Por favor, selecione um dia de pagamento válido (1-28).");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const contractData = {
        property_id: parseInt(formData.property_id),
        tenantEmail: formData.tenantEmail,
        monthly_value: parseFloat(formData.monthly_value),
        deposit: parseFloat(formData.deposit),
        duration: parseInt(formData.duration),
        payment_day: parseInt(formData.payment_day),
      };

      await api.post("/api/contract/", contractData);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onUpdate();
        handleClose();
      }, 2000);
    } catch (error) {
      setError(handleApiError(error, "Erro ao criar contrato"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      ref.current?.close();
    }
  };

  const selectedProperty = properties.find(p => p.id === parseInt(formData.property_id));

  return (
    <dialog className="modal" ref={ref}>
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BiCalendar className="w-6 h-6 text-blue-600" />
            Novo Contrato
          </h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {showSuccess && (
          <div className="alert alert-success mb-4">
            <FaCheckCircle className="w-6 h-6" />
            <span>Contrato criado com sucesso!</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-4">
            <FaTimes className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <BiHome className="w-4 h-4 text-blue-600" />
                Propriedade *
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.property_id}
              onChange={(e) => handleInputChange("property_id", e.target.value)}
              disabled={loadingProperties}
              required
            >
              <option value="">Selecione uma propriedade</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} - {property.street}, {property.number} - {property.city}, {property.state}
                </option>
              ))}
            </select>
            {loadingProperties && (
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Carregando propriedades...
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <BiUser className="w-4 h-4 text-green-600" />
                E-mail do Inquilino *
              </span>
            </label>
            <input
              type="email"
              placeholder="inquilino@email.com"
              className="input input-bordered"
              value={formData.tenantEmail}
              onChange={(e) => handleInputChange("tenantEmail", e.target.value)}
              required
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                O inquilino será notificado por e-mail sobre o novo contrato
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <BiMoney className="w-4 h-4 text-green-600" />
                  Valor Mensal (R$) *
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                className="input input-bordered"
                value={formData.monthly_value}
                onChange={(e) => handleInputChange("monthly_value", e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <BiDollarCircle className="w-4 h-4 text-orange-600" />
                  Depósito/Caução (R$) *
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                className="input input-bordered"
                value={formData.deposit}
                onChange={(e) => handleInputChange("deposit", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <BiCalendar className="w-4 h-4 text-purple-600" />
                  Duração (meses) *
                </span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                placeholder="12"
                className="input input-bordered"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                required
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Duração do contrato em meses
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <BiCalendar className="w-4 h-4 text-red-600" />
                  Dia do Pagamento *
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.payment_day}
                onChange={(e) => handleInputChange("payment_day", e.target.value)}
                required
              >
                <option value="">Selecione o dia</option>
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}º dia do mês
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedProperty && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-800">
                <BiHome className="w-5 h-5" />
                Resumo do Contrato
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Propriedade:</strong> {selectedProperty.name}</p>
                  <p><strong>Endereço:</strong> {selectedProperty.street}, {selectedProperty.number}</p>
                  <p><strong>Cidade:</strong> {selectedProperty.city}, {selectedProperty.state}</p>
                </div>
                <div>
                  <p><strong>Valor Mensal:</strong> R$ {parseFloat(formData.monthly_value || "0").toFixed(2)}</p>
                  <p><strong>Depósito:</strong> R$ {parseFloat(formData.deposit || "0").toFixed(2)}</p>
                  <p><strong>Duração:</strong> {formData.duration || "0"} meses</p>
                  <p><strong>Dia de Pagamento:</strong> {formData.payment_day || "0"}º do mês</p>
                </div>
              </div>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              onClick={handleClose}
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
                  Criando Contrato...
                </>
              ) : (
                "Criar Contrato"
              )}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
};

export default CreateContractModal; 