import React, { useRef, useState } from "react";
import { BiCalendar, BiCheckCircle, BiMoney, BiPlus, BiXCircle } from "react-icons/bi";
import { FaHome, FaMoneyBillWave } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import AddPaymentModal from "./AddPaymentModal";
import api from "../api/axiosConfig";

export interface Payment {
  id: number;
  value: number;
  tax: number;
  createdAt: string;
}

export interface ContractProperty {
  id: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  name: string;
  street: string;
  city: string;
  state: string;
  complement: string;
  number: number;
  size: number;
  bathroomQuantity: number;
  suites: number;
  car_space: number;
  roomQuantity: number;
  landlord_id: number;
}

export interface Contract {
  id: number;
  created_at: string;
  updated_at: string;
  payment_day: number;
  monthly_value: number;
  duration: number;
  deposit: number;
  tenant_id: number;
  active: boolean;
  propertyEntity: ContractProperty;
  payments: Payment[];
}

interface ContractListProps {
  contracts: Contract[];
  loading: boolean;
  searchTerm: string;
  onUpdate?: () => void;
}

const ContractList: React.FC<ContractListProps> = ({
  contracts,
  loading,
  searchTerm,
  onUpdate,
}) => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [deactivatingContracts, setDeactivatingContracts] = useState<Set<number>>(new Set());
  const modalRef = useRef<HTMLDialogElement>(null);
  
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.propertyEntity.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.propertyEntity.street
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.propertyEntity.city
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.id.toString().includes(searchTerm);

    return matchesSearch;
  });

  const handleOpenPaymentModal = (contract: Contract) => {
    setSelectedContract(contract);
    modalRef.current?.showModal();
  };

  const handlePaymentUpdate = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDeactivateContract = async (contractId: number) => {
    if (!confirm("Tem certeza que deseja desativar este contrato?")) {
      return;
    }

    setDeactivatingContracts(prev => new Set(prev).add(contractId));

    try {
      await api.delete(`/api/contract/${contractId}`);
      
      // Atualiza a lista de contratos
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Erro ao desativar contrato:", error);
      alert("Erro ao desativar contrato. Tente novamente.");
    } finally {
      setDeactivatingContracts(prev => {
        const newSet = new Set(prev);
        newSet.delete(contractId);
        return newSet;
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (filteredContracts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <MdPayment className="w-16 h-16 text-gray-400 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {searchTerm ? "Nenhum contrato encontrado" : "Nenhum contrato ativo"}
        </h3>
        <p className="text-gray-500 mb-6">
          {searchTerm
            ? "Tente ajustar os filtros de busca"
            : "Os contratos aparecerão aqui quando forem criados"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredContracts.map((contract) => (
        <div
          key={contract.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-6">
            {/* Header do Contrato */}
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Contrato #{contract.id}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge text-xs ${
                        contract.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {contract.active ? (
                        <>
                          <BiCheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <BiXCircle className="w-3 h-3 mr-1" />
                          Inativo
                        </>
                      )}
                    </span>
                  </div>
                </div>
                
                {/* Botão de Desativar Contrato */}
                {contract.active && (
                  <button
                    onClick={() => handleDeactivateContract(contract.id)}
                    disabled={deactivatingContracts.has(contract.id)}
                    className="btn btn-sm btn-outline btn-error flex items-center gap-1"
                    title="Desativar contrato"
                  >
                    {deactivatingContracts.has(contract.id) ? (
                      <div className="loading loading-spinner loading-xs"></div>
                    ) : (
                      <FaPowerOff className="w-3 h-3" />
                    )}
                    {deactivatingContracts.has(contract.id) ? "Desativando..." : "Desativar"}
                  </button>
                )}
              </div>
            </div>

            {/* Informações da Propriedade */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <FaHome className="w-4 h-4 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Propriedade</span>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">
                {contract.propertyEntity.name}
              </h4>
              <p className="text-sm text-gray-600">
                {contract.propertyEntity.street},{" "}
                {contract.propertyEntity.number}
                {contract.propertyEntity.complement &&
                  ` - ${contract.propertyEntity.complement}`}
              </p>
              <p className="text-sm text-gray-600">
                {contract.propertyEntity.city}, {contract.propertyEntity.state}
              </p>
            </div>

            {/* Valores do Contrato */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaMoneyBillWave className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Valor Mensal:</span>
                </div>
                <span className="font-semibold text-green-600">
                  {formatCurrency(contract.monthly_value)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BiMoney className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Depósito:</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(contract.deposit)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BiCalendar className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    Dia do Pagamento:
                  </span>
                </div>
                <span className="font-semibold text-purple-600">
                  {contract.payment_day}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BiCalendar className="w-4 h-4 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-600">Duração:</span>
                </div>
                <span className="font-semibold text-orange-600">
                  {contract.duration} {contract.duration === 1 ? "Ano" : "Anos"}
                </span>
              </div>
            </div>

            {/* Informações de Pagamentos */}
            {contract.payments && contract.payments.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <MdPayment className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="font-semibold text-gray-700">
                    Pagamentos ({contract.payments.length})
                  </span>
                </div>
                <div className="space-y-1">
                  {contract.payments.slice(0, 2).map((payment) => (
                    <div
                      key={payment.id}
                      className="text-xs text-gray-600 flex justify-between"
                    >
                      <span>{formatDate(payment.createdAt)}</span>
                      <span className="font-medium">
                        {formatCurrency(payment.value)}
                        {payment.tax > 0 &&
                          ` (+${formatCurrency(payment.tax)} taxa)`}
                      </span>
                    </div>
                  ))}
                  {contract.payments.length > 2 && (
                    <div className="text-xs text-blue-600 font-medium">
                      +{contract.payments.length - 2} pagamentos...
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-gray-200">
              {/* Botão para Adicionar Pagamento */}
              <button
                onClick={() => handleOpenPaymentModal(contract)}
                className="btn bg-primary-500 text-white btn-sm w-full mb-3 flex items-center justify-center gap-2"
              >
                <BiPlus className="w-4 h-4" />
                Registrar Pagamento
              </button>
              
              <div className="text-xs text-gray-500 mt-1">
                Criado em: {formatDate(contract.created_at)}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Modal de Adicionar Pagamento */}
      <AddPaymentModal
        contract={selectedContract}
        onUpdate={handlePaymentUpdate}
        ref={modalRef}
      />
    </div>
  );
};

export default ContractList;
