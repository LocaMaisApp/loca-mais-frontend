import React, { useCallback, useEffect, useState } from "react";
import {
    BiCalendar,
    BiCreditCard,
    BiDollarCircle,
    BiFile,
    BiHome,
} from "react-icons/bi";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../hooks/useAuth";
import type { Contract } from "../Reports/types";

const TenantReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const totalPaid = contracts.reduce(
    (acc, contract) => {
      const contractPayments = contract.payments.reduce((paymentAcc, payment) => paymentAcc + payment.value, 0);
      return acc + contractPayments;
    },
    0
  );

  const activeContracts = contracts.filter(contract => contract.active);
  const totalMonthlyValue = activeContracts.reduce((acc, contract) => acc + contract.monthly_value, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPaymentStatus = (contract: Contract) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthlyPayments = contract.payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });

    return monthlyPayments.length > 0 ? 'Pago' : 'Pendente';
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Meus Contratos e Pagamentos</h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : (
          <div>
            {/* Cards de Resumo */}
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

            {/* Lista de Contratos */}
            <div className="space-y-6">
              {contracts.length > 0 ? (
                contracts.map((contract) => (
                  <div key={contract.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Informações do Contrato */}
                      <div className="lg:w-1/2">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <BiHome className="w-6 h-6" /> {contract.propertyEntity?.name}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">ID do Contrato:</p>
                            <p className="font-semibold">{contract.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status:</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              contract.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {contract.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-600">Valor Mensal:</p>
                            <p className="font-semibold text-lg text-green-600">R$ {contract.monthly_value?.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Dia do Pagamento:</p>
                            <p className="font-semibold">{contract.payment_day}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Duração:</p>
                            <p className="font-semibold">{contract.duration} meses</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Depósito:</p>
                            <p className="font-semibold">R$ {contract.deposit?.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Criado em:</p>
                            <p className="font-semibold">{formatDate(contract.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status do Pagamento:</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              getPaymentStatus(contract) === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {getPaymentStatus(contract)}
                            </span>
                          </div>
                        </div>

                        {/* Informações do Imóvel */}
                        {contract.propertyEntity && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Detalhes do Imóvel</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <p><span className="text-gray-600">Endereço:</span> {contract.propertyEntity.street}, {contract.propertyEntity.number}</p>
                              <p><span className="text-gray-600">Cidade:</span> {contract.propertyEntity.city}, {contract.propertyEntity.state}</p>
                              <p><span className="text-gray-600">Tamanho:</span> {contract.propertyEntity.size}m²</p>
                              <p><span className="text-gray-600">Quartos:</span> {contract.propertyEntity.roomQuantity}</p>
                              <p><span className="text-gray-600">Banheiros:</span> {contract.propertyEntity.bathroomQuantity}</p>
                              <p><span className="text-gray-600">Vagas:</span> {contract.propertyEntity.car_space}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Histórico de Pagamentos */}
                      <div className="lg:w-1/2">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <BiCalendar className="w-5 h-5" /> Histórico de Pagamentos
                        </h3>
                        
                        {contract.payments && contract.payments.length > 0 ? (
                          <div className="max-h-64 overflow-y-auto">
                            <div className="space-y-2">
                              {contract.payments
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map((payment) => (
                                <div key={payment.id} className="p-3 bg-gray-50 rounded border-l-4 border-green-400">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-semibold text-green-600">R$ {payment.value.toFixed(2)}</p>
                                      <p className="text-xs text-gray-600">{formatDate(payment.createdAt)}</p>
                                      {payment.tax > 0 && (
                                        <p className="text-xs text-red-600">Taxa: R$ {payment.tax.toFixed(2)}</p>
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
                ))
              ) : (
                <div className="text-center py-12">
                  <BiFile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum contrato encontrado</h3>
                  <p className="text-gray-500">Você ainda não possui contratos de aluguel.</p>
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
