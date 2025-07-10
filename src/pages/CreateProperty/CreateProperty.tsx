import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../hooks/useAuth";
import { handleApiError } from "../../utils/errorHandler";
import PropertyErrorModal from "./CreatePropertyErrorModal";
import PropertySuccessModal from "./CreatePropertySuccessModal";



const CreateProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const errorRef = useRef<HTMLDialogElement>(null);
  const successRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);

      successRef.current?.showModal();



  const [propertyData, setPropertyData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    complement: "",
    number: "",
    size: "",
    bathroomQuantity: "",
    suites: "",
    car_space: "",
    roomQuantity: "",
  });

  const isPropertyDataComplete = () => {
    return (
      propertyData.name &&
      propertyData.street &&
      propertyData.city &&
      propertyData.state &&
      propertyData.number &&
      propertyData.size &&
      propertyData.bathroomQuantity &&
      propertyData.suites &&
      propertyData.car_space &&
      propertyData.roomQuantity
    );
  };

  const [loading, setLoading] = useState(false);

  const handlePropertyChange = (field: string, value: string) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) {
      navigate("/auth/sign-in");
      return;
    }
    const landlordId = user.id;
    if (!isPropertyDataComplete()) {
      alert("Por favor, preencha todos os campos obrigatórios da propriedade.");
      return;
    }

    try {
      setLoading(true);
      const propertyFormData = new FormData();
      propertyFormData.append("name", propertyData.name);
      propertyFormData.append("street", propertyData.street);
      propertyFormData.append("city", propertyData.city);
      propertyFormData.append("state", propertyData.state);
      if (propertyData.complement) {
        propertyFormData.append("complement", propertyData.complement);
      }
      propertyFormData.append("number", propertyData.number);
      propertyFormData.append("size", propertyData.size);
      propertyFormData.append(
        "bathroomQuantity",
        propertyData.bathroomQuantity
      );
      propertyFormData.append("suites", propertyData.suites);
      propertyFormData.append("car_space", propertyData.car_space);
      propertyFormData.append("roomQuantity", propertyData.roomQuantity);
      propertyFormData.append("landlord_id", landlordId.toString());

      await api.post("/api/property", propertyFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      successRef.current?.showModal();
    } catch (error) {
      setError(handleApiError(error, "Erro ao criar propriedade"));
      errorRef.current?.showModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-3">
                Cadastrar Propriedade e Anúncio
              </h1>
              <p className="text-gray-600 text-lg">
                Primeiro cadastre a propriedade e depois crie o anúncio
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
                        Informações da Propriedade
                      </h2>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Nome da Propriedade *
                        </label>
                        <input
                          id="name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Ex: Apartamento Residencial Central"
                          value={propertyData.name}
                          onChange={(e) =>
                            handlePropertyChange("name", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="street"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Rua *
                          </label>
                          <input
                            id="street"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Rua das Flores"
                            value={propertyData.street}
                            onChange={(e) =>
                              handlePropertyChange("street", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="number"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Número *
                          </label>
                          <input
                            id="number"
                            type="number"
                            min="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="123"
                            value={propertyData.number}
                            onChange={(e) =>
                              handlePropertyChange("number", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="complement"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Complemento
                        </label>
                        <input
                          id="complement"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Apto 101, Bloco A"
                          value={propertyData.complement}
                          onChange={(e) =>
                            handlePropertyChange("complement", e.target.value)
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Cidade *
                          </label>
                          <input
                            id="city"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="São Paulo"
                            value={propertyData.city}
                            onChange={(e) =>
                              handlePropertyChange("city", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Estado *
                          </label>
                          <input
                            id="state"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="SP"
                            value={propertyData.state}
                            onChange={(e) =>
                              handlePropertyChange("state", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-5">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
                      Características da Propriedade
                    </h2>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="size"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Tamanho (m²) *
                        </label>
                        <input
                          id="size"
                          type="number"
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="75"
                          value={propertyData.size}
                          onChange={(e) =>
                            handlePropertyChange("size", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="roomQuantity"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Quantidade de Quartos *
                        </label>
                        <input
                          id="roomQuantity"
                          type="number"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="2"
                          value={propertyData.roomQuantity}
                          onChange={(e) =>
                            handlePropertyChange("roomQuantity", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="bathroomQuantity"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Quantidade de Banheiros *
                        </label>
                        <input
                          id="bathroomQuantity"
                          type="number"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="1"
                          value={propertyData.bathroomQuantity}
                          onChange={(e) =>
                            handlePropertyChange(
                              "bathroomQuantity",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="suites"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Quantidade de Suítes *
                        </label>
                        <input
                          id="suites"
                          type="number"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="0"
                          value={propertyData.suites}
                          onChange={(e) =>
                            handlePropertyChange("suites", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="car_space"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Vagas de Garagem *
                        </label>
                        <input
                          id="car_space"
                          type="number"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="1"
                          value={propertyData.car_space}
                          onChange={(e) =>
                            handlePropertyChange("car_space", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 text-white rounded-lg font-medium transform transition-all duration-200 shadow-lg 
                  hover:shadow-xl ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700 hover:scale-105"
                  }`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </div>
                    ) : (
                      "Cadastrar Propriedade"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
      <PropertyErrorModal error={error} ref={errorRef} />
      <PropertySuccessModal ref={successRef} />
    </>
  );
};

export default CreateProperty;
