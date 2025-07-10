import { useEffect, useState } from "react";
import { BiUpload } from "react-icons/bi";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

interface Property{
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



const Advertisement = () => {
  const {user}=useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [useExistingProperty, setUseExistingProperty] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [existingProperties,setExistingProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchLandlordProperties = async () => {
      try {
        const response = await api.get(`/api/landlords/${user?.id}/properties`); // Substitua 1 pelo ID do proprietário real
        setExistingProperties(response.data);
      } catch (error) {
        console.error("Erro ao carregar propriedades do proprietário:", error);
      }
    };
    fetchLandlordProperties();
  }, []);

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
    landlord_id: "",
  });

  const [advertisementData, setAdvertisementData] = useState({
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
      propertyData.roomQuantity &&
      propertyData.landlord_id
    );
  };

  const isAdvertisementDataComplete = () => {
    return advertisementData.description && advertisementData.rentValue;
  };

  const handlePropertyChange = (field: string, value: string) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdvertisementChange = (field: string, value: string) => {
    setAdvertisementData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let propertyId;

      if (useExistingProperty) {
        // Usar propriedade existente selecionada
        propertyId = parseInt(selectedPropertyId);
        console.log("Usando propriedade existente com ID:", propertyId);
      } else {
        // Criar nova propriedade
        const propertyPayload = {
          name: propertyData.name,
          street: propertyData.street,
          city: propertyData.city,
          state: propertyData.state,
          complement: propertyData.complement || undefined,
          number: parseInt(propertyData.number),
          size: parseInt(propertyData.size),
          bathroomQuantity: parseInt(propertyData.bathroomQuantity),
          suites: parseInt(propertyData.suites),
          car_space: parseInt(propertyData.car_space),
          roomQuantity: parseInt(propertyData.roomQuantity),
          landlord_id: parseInt(propertyData.landlord_id),
        };

        console.log("Dados da propriedade para envio:", propertyPayload);

        // Aqui você faria a chamada para a API para criar a propriedade
        // const propertyResponse = await api.post('/properties', propertyPayload);
        // propertyId = propertyResponse.data.id;

        // Para demonstração, vamos usar um ID mock
        propertyId = Math.floor(Math.random() * 1000) + 1;
      }

      // Criar o anúncio com os dados financeiros
      const advertisementPayload = {
        property_id: propertyId,
        condominiumValue: parseFloat(advertisementData.condominiumValue) || 0,
        iptuValue: parseFloat(advertisementData.iptuValue) || 0,
        rentValue: parseFloat(advertisementData.rentValue),
        description: advertisementData.description,
      };

      console.log("Dados do anúncio para envio:", advertisementPayload);

      // Aqui você faria a chamada para criar o anúncio
      // const advertisementResponse = await api.post('/advertisements', advertisementPayload);

      const message = useExistingProperty
        ? "Anúncio criado com sucesso usando propriedade existente!"
        : "Propriedade e anúncio cadastrados com sucesso!";

      alert(message);
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar propriedade e anúncio");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
            {/* Escolha do Tipo de Propriedade */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-500 pb-2">
                  Escolha uma Opção
                </h2>
              </div>
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
                          {property.name} - {property.street}, {property.number}{" "}
                          - {property.city}/{property.state}
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
                  <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-500 pb-2">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        placeholder="1"
                        value={propertyData.car_space}
                        onChange={(e) =>
                          handlePropertyChange("car_space", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="landlord_id"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        ID do Proprietário *
                      </label>
                      <input
                        id="landlord_id"
                        type="number"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        placeholder="1"
                        value={propertyData.landlord_id}
                        onChange={(e) =>
                          handlePropertyChange("landlord_id", e.target.value)
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
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-green-500 pb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-vertical"
                    placeholder="Descreva sua propriedade, destacando os principais atrativos..."
                    rows={4}
                    value={advertisementData.description}
                    onChange={(e) =>
                      handleAdvertisementChange("description", e.target.value)
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="2200.00"
                      value={advertisementData.rentValue}
                      onChange={(e) =>
                        handleAdvertisementChange("rentValue", e.target.value)
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="350.00"
                      value={advertisementData.condominiumValue}
                      onChange={(e) =>
                        handleAdvertisementChange(
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="150.00"
                      value={advertisementData.iptuValue}
                      onChange={(e) =>
                        handleAdvertisementChange("iptuValue", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Fotos da Propriedade */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-orange-500 pb-2 flex items-center gap-2">
                  <BiUpload className="w-6 h-6 text-orange-500" />
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
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:border-orange-400"
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

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
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
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg 
                hover:shadow-xl"
              >
                {useExistingProperty
                  ? "Criar Anúncio"
                  : "Cadastrar Propriedade e Anúncio"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Advertisement;
