import React, { useCallback, useEffect, useState } from "react";
import {
  BiCalendar,
  BiCheck,
  BiChevronDown,
  BiCreditCard,
  BiDollarCircle,
  BiFile,
  BiHome,
  BiTime,
  BiX,
} from "react-icons/bi";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../hooks/useAuth";
import type { Contract } from "../Reports/types";

const TenantReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openContracts, setOpenContracts] = useState<Set<number>>(new Set());

  const toggleContract = (contractId: number) => {
    setOpenContracts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contractId)) {
        newSet.delete(contractId);
      } else {
        newSet.add(contractId);
      }
      return newSet;
    });
  };

  const fetchTenantContracts = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get(`/api/tenant/${user.id}/contracts`);
      setContracts(response.data);
    } catch (error) {
      console.error("Erro ao buscar contratos do inquilino:", error);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchTenantContracts();
      setLoading(false);
    };
    fetchData();
  }, [fetchTenantContracts]);

  const totalPaid = contracts.reduce((acc, contract) => {
    const contractPayments = contract.payments.reduce(
      (paymentAcc, payment) => paymentAcc + payment.value,
      0
    );
    return acc + contractPayments;
  }, 0);

  const activeContracts = contracts.filter((contract) => contract.active);
  const totalMonthlyValue = activeContracts.reduce(
    (acc, contract) => acc + contract.monthly_value,
    0
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };


  const getNextPaymentStatus = (contract: Contract) => {
    const currentDate = new Date(); 
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const paymentDay = contract.payment_day;

    const monthlyPayments = contract.payments.filter((payment) => {
      const paymentDate = new Date(payment.createdAt);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      );
    });

    if (monthlyPayments.length > 0) {
      return {
        status: "Pago",
        daysRemaining: 0,
        message: "Pagamento do mês atual já realizado",
      };
    }

    const nextPaymentDate = new Date(currentYear, currentMonth, paymentDay);

    // Calcula a diferença em dias
    const diffTime = nextPaymentDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Determina o status baseado nos dias restantes
    if (diffDays < 0) {
      return {
        status: "Vencido",
        daysRemaining: Math.abs(diffDays),
        message: `Pagamento vencido há ${Math.abs(diffDays)} dia(s)`,
      };
    } else if (diffDays === 0) {
      return {
        status: "Vence Hoje",
        daysRemaining: 0,
        message: "Pagamento vence hoje",
      };
    } else if (diffDays <= 3) {
      return {
        status: "Próximo",
        daysRemaining: diffDays,
        message: `Pagamento vence em ${diffDays} dia(s)`,
      };
    } else if (diffDays <= 7) {
      return {
        status: "Em Breve",
        daysRemaining: diffDays,
        message: `Pagamento vence em ${diffDays} dia(s)`,
      };
    } else {
      return {
        status: "Distante",
        daysRemaining: diffDays,
        message: `Próximo pagamento em ${diffDays} dia(s)`,
      };
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Meus Contratos e Pagamentos
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex items-center gap-4">
                  <BiFile className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Contratos Ativos
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {activeContracts.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center gap-4">
                  <BiDollarCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Total Pago
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {totalPaid.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                <div className="flex items-center gap-4">
                  <BiCreditCard className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Aluguel Mensal Total
                    </h3>
                    <p className="text-2xl font-bold text-orange-600">
                      R$ {totalMonthlyValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {contracts.length > 0 ? (
                contracts.map((contract) => {
                  const isOpen = openContracts.has(contract.id);
                  const paymentStatus = getNextPaymentStatus(contract);
                  
                  return (
                    <div
                      key={contract.id}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl"
                    >
                      {/* Header do Card */}
                      <div 
                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => toggleContract(contract.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                              <BiHome className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-gray-800">
                                {contract.propertyEntity?.name}
                              </h2>
                              <p className="text-gray-600 text-sm">
                                {contract.propertyEntity?.street}, {contract.propertyEntity?.number} - {contract.propertyEntity?.city}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {/* Status Badge */}
                            <div className="flex flex-col items-end gap-2">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                                  contract.active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {contract.active ? <BiCheck className="w-4 h-4" /> : <BiX className="w-4 h-4" />}
                                {contract.active ? "Ativo" : "Inativo"}
                              </span>
                              
                              {/* Payment Status Badge */}
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${(() => {
                                  switch (paymentStatus.status) {
                                    case "Vencido":
                                      return "bg-red-100 text-red-800";
                                    case "Vence Hoje":
                                      return "bg-red-100 text-red-800";
                                    case "Próximo":
                                      return "bg-orange-100 text-orange-800";
                                    case "Em Breve":
                                      return "bg-yellow-100 text-yellow-800";
                                    case "Pago":
                                      return "bg-green-100 text-green-800";
                                    default:
                                      return "bg-blue-100 text-blue-800";
                                  }
                                })()}`}
                              >
                                <BiTime className="w-3 h-3" />
                                {paymentStatus.status}
                              </span>
                            </div>
                            
                            {/* Valor Mensal Destacado */}
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                R$ {contract.monthly_value?.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">mensais</p>
                            </div>
                            
                            {/* Chevron Icon */}
                            <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                              <BiChevronDown className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Conteúdo Expandível */}
                      <div className={`transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      } overflow-hidden`}>
                        <div className="px-6 pb-6 bg-gray-50">
                          <div className="flex flex-col lg:flex-row gap-6 pt-6">
                            <div className="lg:w-1/2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                
                                <div>
                                  <p className="text-gray-600">Status:</p>
                                  <span
                                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                      contract.active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {contract.active ? "Ativo" : "Inativo"}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-gray-600">Valor Mensal:</p>
                                  <p className="font-semibold text-lg text-green-600">
                                    R$ {contract.monthly_value?.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Dia do Pagamento:</p>
                                  <p className="font-semibold">
                                    {contract.payment_day}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Duração:</p>
                                  <p className="font-semibold">
                                    {contract.duration} meses
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Depósito:</p>
                                  <p className="font-semibold">
                                    R$ {contract.deposit?.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Criado em:</p>
                                  <p className="font-semibold">
                                    {formatDate(contract.created_at)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Próximo Pagamento:</p>
                                  <span
                                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${(() => {
                                      const paymentStatus =
                                        getNextPaymentStatus(contract);
                                      switch (paymentStatus.status) {
                                        case "Vencido":
                                          return "bg-red-100 text-red-800";
                                        case "Vence Hoje":
                                          return "bg-red-100 text-red-800";
                                        case "Próximo":
                                          return "bg-orange-100 text-orange-800";
                                        case "Em Breve":
                                          return "bg-yellow-100 text-yellow-800";
                                        case "Pago":
                                          return "bg-green-100 text-green-800";
                                        default:
                                          return "bg-blue-100 text-blue-800";
                                      }
                                    })()}`}
                                  >
                                    {getNextPaymentStatus(contract).status}
                                  </span>
                                </div>
                              </div>

                              {contract.propertyEntity && (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                  <h4 className="font-semibold text-gray-800 mb-2">
                                    Detalhes do Imóvel
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p>
                                      <span className="text-gray-600">Endereço:</span>{" "}
                                      {contract.propertyEntity.street},{" "}
                                      {contract.propertyEntity.number}
                                    </p>
                                    <p>
                                      <span className="text-gray-600">Cidade:</span>{" "}
                                      {contract.propertyEntity.city},{" "}
                                      {contract.propertyEntity.state}
                                    </p>
                                    <p>
                                      <span className="text-gray-600">Tamanho:</span>{" "}
                                      {contract.propertyEntity.size}m²
                                    </p>
                                    <p>
                                      <span className="text-gray-600">Quartos:</span>{" "}
                                      {contract.propertyEntity.roomQuantity}
                                    </p>
                                    <p>
                                      <span className="text-gray-600">
                                        Banheiros:
                                      </span>{" "}
                                      {contract.propertyEntity.bathroomQuantity}
                                    </p>
                                    <p>
                                      <span className="text-gray-600">Vagas:</span>{" "}
                                      {contract.propertyEntity.car_space}
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div
                                className={`card mt-5 ${(() => {
                                  const paymentStatus =
                                    getNextPaymentStatus(contract);
                                  switch (paymentStatus.status) {
                                    case "Vencido":
                                      return "bg-red-500";
                                    case "Vence Hoje":
                                      return "bg-red-400";
                                    case "Próximo":
                                      return "bg-orange-400";
                                    case "Em Breve":
                                      return "bg-yellow-400";
                                    case "Pago":
                                      return "bg-green-400";
                                    default:
                                      return "bg-blue-400";
                                  }
                                })()}`}
                              >
                                <div className="card-body">
                                  <h2 className="card-title text-white">
                                    {(() => {
                                      const paymentStatus =
                                        getNextPaymentStatus(contract);
                                      switch (paymentStatus.status) {
                                        case "Vencido":
                                          return "Pagamento Vencido!";
                                        case "Vence Hoje":
                                          return "Vence Hoje!";
                                        case "Próximo":
                                          return "Pagamento Próximo";
                                        case "Em Breve":
                                          return "Pagamento Em Breve";
                                        case "Pago":
                                          return "Pagamento em Dia";
                                        default:
                                          return "Próximo Pagamento";
                                      }
                                    })()}
                                  </h2>
                                  <p className="text-white">
                                    {getNextPaymentStatus(contract).message}
                                  </p>
                                  <p className="text-white font-semibold">
                                    Dia do pagamento: {contract.payment_day}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="lg:w-1/2">
                              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <BiCalendar className="w-5 h-5" /> Histórico de
                                Pagamentos
                              </h3>

                              {contract.payments && contract.payments.length > 0 ? (
                                <div className="max-h-64 overflow-y-auto">
                                  <div className="space-y-2">
                                    {contract.payments
                                      .sort(
                                        (a, b) =>
                                          new Date(b.createdAt).getTime() -
                                          new Date(a.createdAt).getTime()
                                      )
                                      .map((payment) => (
                                        <div
                                          key={payment.id}
                                          className="p-3 bg-white rounded border-l-4 border-green-400 shadow-sm"
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <p className="font-semibold text-green-600">
                                                R$ {payment.value.toFixed(2)}
                                              </p>
                                              <p className="text-xs text-gray-600">
                                                {formatDate(payment.createdAt)}
                                              </p>
                                              {payment.tax > 0 && (
                                                <p className="text-xs text-red-600">
                                                  Taxa: R$ {payment.tax.toFixed(2)}
                                                </p>
                                              )}
                                            </div>
                                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                              Pago
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-500 text-center py-4">
                                  Nenhum pagamento registrado.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <BiFile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhum contrato encontrado
                  </h3>
                  <p className="text-gray-500">
                    Você ainda não possui contratos de aluguel.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TenantReportsPage;
