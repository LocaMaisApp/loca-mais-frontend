import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCar, FaMapMarkerAlt } from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";
import { MdBathtub, MdBed, MdSquareFoot } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import type { Advertisement as AdvertisementType } from "../Home/Home";

const Advertisement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [advertisement, setAdvertisement] = useState<AdvertisementType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api.get(`/api/advertisement/${id}`);
        setAdvertisement(response.data);
      } catch (error) {
        console.error("Erro ao buscar anúncio:", error);
        setError("Anúncio não encontrado");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisement();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    );
  }

  if (error || !advertisement) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Anúncio não encontrado
          </h1>
          <Link
            to={"/"}
            className="btn bg-primary-500 text-white hover:bg-primary-600"
          >
            Voltar para a Home
          </Link>
        </div>
      </>
    );
  }

  const totalValue =
    advertisement.value +
    advertisement.condominiumValue +
    advertisement.iptuValue;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header com botão voltar */}
        <div className="bg-white shadow-sm ">
          <div className="container mx-auto px-4 py-4 ">
            <Link
              to={"/"}
              className="flex items-center text-primary-600 cursor-pointer hover:text-primary-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Voltar
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div className="relative h-96">
                  {advertisement.images && advertisement.images.length > 0 ? (
                    <div className="carousel w-full h-96">
                      {advertisement.images.map((image, index) => (
                        <div
                          key={image}
                          id={"slide" + index}
                          className="carousel-item relative w-full h-96"
                        >
                          <img
                            src={import.meta.env.VITE_API_URL + image}
                            className="w-full h-full object-contain"
                          />
                          {advertisement.images.length > 1 && (
                            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                              <a
                                href={`#slide${
                                  index === 0
                                    ? advertisement.images.length - 1
                                    : index - 1
                                }`}
                                className="btn btn-circle"
                              >
                                ❮
                              </a>
                              <a
                                href={`#slide${
                                  index === advertisement.images.length - 1
                                    ? 0
                                    : index + 1
                                }`}
                                className="btn btn-circle"
                              >
                                ❯
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">
                        Sem imagens disponíveis
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Informações do imóvel */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {advertisement.property.name}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>
                      {advertisement.property.street},{" "}
                      {advertisement.property.number}
                      {advertisement.property.complement &&
                        `, ${advertisement.property.complement}`}{" "}
                      -{advertisement.property.city},{" "}
                      {advertisement.property.state}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <MdBed className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <div className="text-2xl font-bold text-gray-800">
                      {advertisement.property.roomQuantity}
                    </div>
                    <div className="text-sm text-gray-600">Quartos</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <MdBathtub className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <div className="text-2xl font-bold text-gray-800">
                      {advertisement.property.bathroomQuantity}
                    </div>
                    <div className="text-sm text-gray-600">Banheiros</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <MdSquareFoot className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <div className="text-2xl font-bold text-gray-800">
                      {advertisement.property.size}
                    </div>
                    <div className="text-sm text-gray-600">m²</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <FaCar className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <div className="text-2xl font-bold text-gray-800">
                      {advertisement.property.car_space}
                    </div>
                    <div className="text-sm text-gray-600">Vagas</div>
                  </div>
                </div>

                {/* Suítes */}
                {advertisement.property.suites > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center">
                      <MdBed className="w-5 h-5 mr-2 text-primary-600" />
                      <span className="text-gray-700">
                        {advertisement.property.suites} suíte
                        {advertisement.property.suites > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Descrição
                  </h3>
                  <p className="text-gray-700 ">{advertisement.description}</p>
                </div>
              </div>
            </div>

            {/* Sidebar - Valores e contato */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                {/* Valores */}
                <div className="mb-8">
                  <div className="text-3xl font-bold text-primary-600 mb-4">
                    R$ {advertisement.value.toLocaleString()}
                    <span className="text-lg text-gray-600 font-normal">
                      /mês
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aluguel:</span>
                      <span className="font-semibold">
                        R$ {advertisement.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condomínio:</span>
                      <span className="font-semibold">
                        R$ {advertisement.condominiumValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IPTU:</span>
                      <span className="font-semibold">
                        R$ {advertisement.iptuValue.toLocaleString()}
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">
                        R$ {totalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botões de contato */}
                <div className="space-y-3">
                  <button className="w-full btn bg-primary-500 text-white hover:bg-primary-600 border-none">
                    <GrDocumentText className="text-white" />
                    Fazer proposta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Advertisement;
