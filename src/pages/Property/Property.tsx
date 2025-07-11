import React, { useEffect, useRef, useState } from "react";
import { BiPlus, BiSearch } from "react-icons/bi";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { MdBathtub, MdBed, MdSquareFoot } from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../hooks/useAuth";
import DeleteModal from "./DeleteModal";
import EditAdvertisementModal from "./EditAdvertisementModal";

export interface Property {
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

export interface Advertisement {
  id: number;
  description: string;
  condominiumValue: number;
  value: number;
  iptuValue: number;
  property: Property;
  images: string[];
  active: boolean;
}

const PropertyPage: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [show, setShow] = useState<"advertisements" | "properties">(
    "properties"
  );
  const [selectedAdvertisement, setSelectedAdvertisement] =
    useState<Advertisement | null>(null);
  const [selectedToDelete, setSelectedToDelete] = useState<
    Advertisement | Property | null
  >(null);
  const editRef = useRef<HTMLDialogElement>(null);
  const deleteRef = useRef<HTMLDialogElement>(null);

  const fetchLandlordProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/landlords/${user?.id}/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error("Erro ao buscar propriedades:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLandlordAdvertisements = async () => {
    try {
      const response = await api.get(
        `/api/landlords/${user?.id}/advertisements`
      );
      setAdvertisements(response.data);
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);
    }
  };
  useEffect(() => {
    if (user?.type === "LANDLORD") {
      fetchLandlordProperties();
      fetchLandlordAdvertisements();
    }
  }, [user?.id, user?.type]);

  const onUpdate = () => {
    setAdvertisements([]);
    setProperties([]);
    fetchLandlordProperties();
    fetchLandlordAdvertisements();
  };

 

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const filteredAdvertisements = advertisements.filter((ad) => {
    const matchesSearch =
      ad.property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.property.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (user?.type !== "LANDLORD") {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Acesso Negado
            </h1>
            <p className="text-gray-600">
              Esta página é apenas para proprietários.
            </p>
            <Link to="/" className="btn bg-primary-600 mt-4">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DeleteModal ref={deleteRef} selected={selectedToDelete} type={show} onUpdate={onUpdate} />
      <EditAdvertisementModal
        advertisement={selectedAdvertisement}
        ref={editRef}
        onUpdate={() => {
          onUpdate();
        }}
      />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {show === "properties"
                  ? "Minhas Propriedades"
                  : "Meus Anúncios"}
              </h1>
              <p className="text-gray-600 mt-2">
                {show === "properties"
                  ? "Gerencie suas propriedades e anúncios"
                  : "Visualize e gerencie seus anúncios ativos"}
              </p>
            </div>
            <Link
              to={
                show == "properties" ? "/propriedades/cadastrar" : "/anunciar"
              }
              className="btn bg-primary-500 flex text-white items-center gap-2"
            >
              <BiPlus className="w-5 h-5" />
              {show == "properties" ? "Nova Propriedade" : "Novo Anúncio"}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, endereço ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setShow("properties")}
              className={`bg-white p-6 rounded-lg shadow-md border-l-4 transition-all duration-200 hover:shadow-lg text-left ${
                show === "properties"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-blue-500 hover:border-blue-600"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-700">
                Total de Propriedades
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {properties.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Clique para visualizar propriedades
              </p>
            </button>
            <button
              onClick={() => setShow("advertisements")}
              className={`bg-white p-6 rounded-lg shadow-md border-l-4 transition-all duration-200 hover:shadow-lg text-left ${
                show === "advertisements"
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-orange-500 hover:border-orange-600"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-700">Anúncios</h3>
              <p className="text-3xl font-bold text-orange-600">
                {advertisements.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Clique para visualizar anúncios
              </p>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : show === "properties" ? (
          filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <BiSearch className="w-16 h-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm
                  ? "Nenhuma propriedade encontrada"
                  : "Nenhuma propriedade cadastrada"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Tente ajustar os filtros de busca"
                  : "Comece cadastrando sua primeira propriedade"}
              </p>
              {!searchTerm && (
                <Link to="/create-property" className="btn btn-primary">
                  Cadastrar Primeira Propriedade
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const advertisement = advertisements.find(
                  (ad) => ad.property.id === property.id
                );
                return (
                  <div
                    key={property.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {property.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {property.street}, {property.number} - {property.city}
                          , {property.state}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MdBed className="w-4 h-4 mr-1" />
                            <span>{property.roomQuantity}</span>
                          </div>
                          <div className="flex items-center">
                            <MdBathtub className="w-4 h-4 mr-1" />
                            <span>{property.bathroomQuantity}</span>
                          </div>
                          <div className="flex items-center">
                            <MdSquareFoot className="w-4 h-4 mr-1" />
                            <span>{property.size}m²</span>
                          </div>
                        </div>
                      </div>

                      {advertisement && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            R$ {advertisement.value.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">por mês</div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Link
                            to={`/property/edit/${property.id}`}
                            className="btn btn-sm btn-outline btn-primary"
                            title="Editar propriedade"
                          >
                            <FaEdit className="w-4 h-4" />
                          </Link>

                          {advertisement ? (
                            <Link
                              to={`/anuncios/${advertisement.id}`}
                              className="btn btn-sm btn-outline btn-info"
                              title="Ver anúncio"
                            >
                              <FaEye className="w-4 h-4" />
                            </Link>
                          ) : (
                            <Link
                              to={`/create-advertisement?propertyId=${property.id}`}
                              className="btn btn-sm btn-outline btn-success"
                              title="Criar anúncio"
                            >
                              <BiPlus className="w-4 h-4" />
                            </Link>
                          )}

                          <button
                            onClick={() => setSelectedToDelete(property)}
                            className="btn btn-sm btn-outline btn-error"
                            title="Excluir propriedade"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : // Renderização de Anúncios
        filteredAdvertisements.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <BiSearch className="w-16 h-16 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm
                ? "Nenhum anúncio encontrado"
                : "Nenhum anúncio criado"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Tente ajustar os filtros de busca"
                : "Comece criando anúncios para suas propriedades"}
            </p>
            {!searchTerm && (
              <Link to="/create-advertisement" className="btn btn-primary">
                Criar Primeiro Anúncio
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAdvertisements.map((advertisement) => (
              <div
                key={advertisement.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {advertisement.property.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {advertisement.property.street},{" "}
                      {advertisement.property.number} -{" "}
                      {advertisement.property.city},{" "}
                      {advertisement.property.state}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MdBed className="w-4 h-4 mr-1" />
                        <span>{advertisement.property.roomQuantity}</span>
                      </div>
                      <div className="flex items-center">
                        <MdBathtub className="w-4 h-4 mr-1" />
                        <span>{advertisement.property.bathroomQuantity}</span>
                      </div>
                      <div className="flex items-center">
                        <MdSquareFoot className="w-4 h-4 mr-1" />
                        <span>{advertisement.property.size}m²</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      R$ {advertisement.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">por mês</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Condomínio: R${" "}
                      {advertisement.condominiumValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      IPTU: R$ {advertisement.iptuValue.toLocaleString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {advertisement.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Link
                        to={`/anuncios/${advertisement.id}`}
                        className="btn btn-sm btn-outline btn-primary"
                        title="Ver anúncio"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => {
                          if (advertisement) {
                            setSelectedAdvertisement(advertisement);
                            editRef.current?.showModal();
                          }
                        }}
                        className="btn btn-sm btn-outline btn-warning"
                        title="Editar anúncio"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (advertisement) {
                            setSelectedToDelete(advertisement);
                            deleteRef.current?.showModal();
                          }
                        }}
                        className="btn btn-sm btn-outline btn-error"
                        title="Editar anúncio"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyPage;
