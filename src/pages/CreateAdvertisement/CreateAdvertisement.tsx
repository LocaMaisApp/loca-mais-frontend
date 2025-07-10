import { useEffect, useRef, useState } from "react";
import { BiUpload } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../hooks/useAuth";
import { handleApiError } from "../../utils/errorHandler";
import CreateAdvertisementErrorModal from "./CreateAdvertisementErrorModal";
import CreateAdvertisementSuccessModal from "./CreateAdvertisementSucessModal";

interface Property {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  complement?: string;
  number: number;
  size: number;
  bathroomQuantity: number;
  suites: number;
  car_space: number;
  roomQuantity: number;
}

const CreateAdvertisement = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [useExistingProperty, setUseExistingProperty] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [existingProperties, setExistingProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDialogElement>(null);
  const successRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLandlordProperties = async () => {
      try {
        const response = await api.get(`/api/landlords/${user?.id}/properties`); // Substitua 1 pelo ID do proprietário real
        setExistingProperties(response.data);
      } catch (error) {
        console.error("Erro ao carregar propriedades do proprietário:", error);
      }
    };
    if (user) fetchLandlordProperties();
  }, [user]);

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

  const [CreateAdvertisementData, setCreateAdvertisementData] = useState({
    condominiumValue: "",
    iptuValue: "",
    rentValue: "",
    description: "",
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

  const isCreateAdvertisementDataComplete = () => {
    return (
      CreateAdvertisementData.description && CreateAdvertisementData.rentValue
    );
  };

  const [loading, setLoading] = useState(false);

  const handlePropertyChange = (field: string, value: string) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAdvertisementChange = (field: string, value: string) => {
    setCreateAdvertisementData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Adicionar os arquivos ao estado
    setImages((prev) => [...prev, ...files]);

    // Criar URLs de preview para exibição
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviewUrls((prev) => [
          ...prev,
          event.target?.result as string,
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) {
      navigate("/auth/sign-in");
      return;
    }
    const landlordId = user.id;
    if (!isPropertyDataComplete() && !useExistingProperty) {
      alert("Por favor, preencha todos os campos obrigatórios da propriedade.");
      return;
    }

    if (!isCreateAdvertisementDataComplete()) {
      alert("Por favor, preencha todos os campos obrigatórios do anúncio.");
      return;
    }

    try {
      setLoading(true);
      let propertyId;

      if (useExistingProperty) {
        propertyId = parseInt(selectedPropertyId);
      } else {
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

        // Chamada para a API para criar a propriedade
        const propertyResponse = await api.post(
          "/api/property",
          propertyFormData,
          {
            headers: {
              "Content-Type": "application/json", // minúsculo
            },
          }
        );
        propertyId = propertyResponse.data.id;
      }

      // Criar o anúncio com FormData
      const CreateAdvertisementFormData = new FormData();
      CreateAdvertisementFormData.append(
        "description",
        CreateAdvertisementData.description
      );
      CreateAdvertisementFormData.append(
        "condominiumValue",
        CreateAdvertisementData.condominiumValue || "0"
      );
      CreateAdvertisementFormData.append(
        "iptuValue",
        CreateAdvertisementData.iptuValue || "0"
      );
      CreateAdvertisementFormData.append(
        "value",
        CreateAdvertisementData.rentValue
      );
      CreateAdvertisementFormData.append("propertyId", propertyId.toString());

      images.forEach((image) => {
        CreateAdvertisementFormData.append(`images`, image);
      });
      console.log("called");

      await api.post("/api/advertisement", CreateAdvertisementFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImages([]);
      setImagePreviewUrls([]);
      setPropertyData({
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
      setCreateAdvertisementData({
        condominiumValue: "",
        iptuValue: "",
        rentValue: "",
        description: "",
      });
      successRef.current?.showModal();
    } catch (error) {
      setError(handleApiError(error, "Erro ao criar anúncio"));
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
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="propertyChoice"
                        value="new"
                        checked={!useExistingProperty}
                        onChange={() => setUseExistingProperty(false)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Criar Nova Propriedade
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="propertyChoice"
                        value="existing"
                        checked={useExistingProperty}
                        onChange={() => setUseExistingProperty(true)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Selecionar Propriedade Existente
                      </span>
                    </label>
                  </div>

                  {useExistingProperty && (
                    <div className="mt-4">
                      <label
                        htmlFor="existingProperty"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Selecione uma Propriedade *
                      </label>
                      <select
                        id="existingProperty"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={selectedPropertyId}
                        onChange={(e) => setSelectedPropertyId(e.target.value)}
                        required={useExistingProperty}
                      >
                        <option value="">Selecione uma propriedade</option>
                        {existingProperties.map((property) => (
                          <option key={property.id} value={property.id}>
                            {property.name} - {property.street},{" "}
                            {property.number} - {property.city}/{property.state}
                          </option>
                        ))}
                      </select>

                      {selectedPropertyId && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          {(() => {
                            const selected = existingProperties.find(
                              (p) => p.id === parseInt(selectedPropertyId)
                            );
                            return selected ? (
                              <div className="text-sm text-gray-600">
                                <p>
                                  <strong>Propriedade:</strong> {selected.name}
                                </p>
                                <p>
                                  <strong>Endereço:</strong> {selected.street},{" "}
                                  {selected.number} - {selected.city}/
                                  {selected.state}
                                </p>
                                <p>
                                  <strong>Tamanho:</strong> {selected.size}m² |{" "}
                                  <strong>Quartos:</strong>{" "}
                                  {selected.roomQuantity} |{" "}
                                  <strong>Banheiros:</strong>{" "}
                                  {selected.bathroomQuantity}
                                </p>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Informações da Propriedade */}
              {!useExistingProperty && (
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
              )}

              {/* Características da Propriedade */}
              {!useExistingProperty && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
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
              )}

              {/* Dados do Anúncio */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
                    Dados do Anúncio
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Descrição do Anúncio *
                    </label>
                    <textarea
                      id="description"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                      placeholder="Descreva sua propriedade, destacando os principais atrativos..."
                      rows={4}
                      value={CreateAdvertisementData.description}
                      onChange={(e) =>
                        handleCreateAdvertisementChange(
                          "description",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="rentValue"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Valor do Aluguel (R$) *
                      </label>
                      <input
                        id="rentValue"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="2200.00"
                        value={CreateAdvertisementData.rentValue}
                        onChange={(e) =>
                          handleCreateAdvertisementChange(
                            "rentValue",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="condominiumValue"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Valor do Condomínio (R$)
                      </label>
                      <input
                        id="condominiumValue"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="350.00"
                        value={CreateAdvertisementData.condominiumValue}
                        onChange={(e) =>
                          handleCreateAdvertisementChange(
                            "condominiumValue",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="iptuValue"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Valor do IPTU (R$)
                      </label>
                      <input
                        id="iptuValue"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="150.00"
                        value={CreateAdvertisementData.iptuValue}
                        onChange={(e) =>
                          handleCreateAdvertisementChange(
                            "iptuValue",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fotos da Propriedade */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 flex items-center gap-2">
                    <BiUpload className="w-6 h-6 text-blue-500" />
                    Fotos da Propriedade
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:border-blue-400"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <BiUpload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Clique para fazer upload
                          </span>{" "}
                          ou arraste as imagens
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG ou JPEG (MAX. 10MB cada)
                        </p>
                      </div>
                    </label>
                  </div>

                  {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviewUrls.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
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
                  ) : useExistingProperty ? (
                    "Criar Anúncio"
                  ) : (
                    "Cadastrar Propriedade e Anúncio"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <CreateAdvertisementErrorModal error={error} ref={errorRef} />
      <CreateAdvertisementSuccessModal ref={successRef} />
    </>
  );
};

export default CreateAdvertisement;
