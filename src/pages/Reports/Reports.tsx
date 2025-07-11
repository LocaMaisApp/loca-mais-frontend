import React, { useCallback, useEffect, useState } from "react";
import {
    BiDollarCircle,
    BiFile,
    BiTrendingDown,
    BiTrendingUp,
    BiWrench,
} from "react-icons/bi";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../hooks/useAuth";
import type { Contract, Maintenance } from "./types.ts";

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchContracts = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get(`/api/landlords/${user.id}/contracts`);
      setContracts(response.data);
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
    }
  }, [user]);

  const fetchMaintenances = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get(`/api/landlords/${user.id}/maintenances`);
      setMaintenances(response.data);
    } catch (error) {
      console.warn(
        "Erro ao buscar manutenções (endpoint pode não existir):",
        error
      );
      setMaintenances([]); 
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchContracts(), fetchMaintenances()]);
      setLoading(false);
    };
    fetchData();
  }, [fetchContracts, fetchMaintenances]);

  const totalEarnings = contracts.reduce(
    (acc, contract) => {
      const contractPayments = contract.payments.reduce((paymentAcc, payment) => paymentAcc + payment.value, 0);
      return acc + contractPayments;
    },
    0
  );
  const totalExpenses = maintenances.reduce(
    (acc, maintenance) => acc + maintenance.total_value,
    0
  );
  const netBalance = totalEarnings - totalExpenses;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatórios</h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center gap-4">
                  <BiTrendingUp className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Ganhos Totais
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {totalEarnings.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <div className="flex items-center gap-4">
                  <BiTrendingDown className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Despesas Totais
                    </h3>
                    <p className="text-2xl font-bold text-red-600">
                      R$ {totalExpenses.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex items-center gap-4">
                  <BiDollarCircle className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Saldo Líquido
                    </h3>
                    <p
                      className={`text-2xl font-bold ${
                        netBalance >= 0 ? "text-blue-600" : "text-red-600"
                      }`}
                    >
                      R$ {netBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BiFile className="w-6 h-6" /> Detalhes dos Contratos
                </h2>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>ID Contrato</th>
                        <th>Imóvel</th>
                        <th>Valor Mensal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract) => (
                        <tr key={contract.id}>
                          <td>{contract?.id}</td>
                          <td>{contract.propertyEntity?.name}</td>
                          <td>R$ {contract.monthly_value?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BiWrench className="w-6 h-6" /> Detalhes das Manutenções
                </h2>
                {maintenances.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>ID Manutenção</th>
                          <th>Imóvel</th>
                          <th>Custo Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenances.map((maintenance) => (
                          <tr key={maintenance.id}>
                            <td>{maintenance.id}</td>
                            <td>{maintenance.property.name}</td>
                            <td>R$ {maintenance.total_value.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Nenhuma manutenção registrada.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportsPage;
