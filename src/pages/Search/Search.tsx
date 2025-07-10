import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { CiMapPin } from "react-icons/ci";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import { PropertyCard } from "../../components/PropertyCard";
import type { Advertisement } from "../Home/Home";

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [searched, setSearched] = useState<string>(searchParams.get("q") || "");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearched(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await api.get(
        `/api/advertisement/search?query=${encodeURIComponent(query)}`
      );
      setAdvertisements(response.data);
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searched.trim()) {
      setSearchParams({ q: searched.trim() });
    }
  };

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value);
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-r from-primary-500 to-primary-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Resultados da Busca
              </h1>
              {searchParams.get("q") && (
                <p className="text-xl text-blue-100">
                  Buscando por: "{searchParams.get("q")}"
                </p>
              )}
            </div>

            <div className="max-w-4xl mx-auto">
              <form
                onSubmit={onSearchSubmit}
                className="bg-white rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <CiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      value={searched}
                      onChange={onSearchInputChange}
                      type="text"
                      placeholder="Onde você quer morar? (Ex: Copacabana, Rio de Janeiro)"
                      className="w-full pl-12 pr-4 py-4 text-gray-800 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-8 py-4 bg-primary-400 rounded-xl text-white hover:bg-primary-600 transition-colors duration-300 flex items-center"
                    >
                      <BiSearch className="inline-block mr-2" />
                      Buscar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-gray-600">Buscando propriedades...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {advertisements.length} propriedade(s) encontrada(s)
                  </h2>
                </div>

                {advertisements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {advertisements.map((advertisement) => (
                      <PropertyCard
                        key={advertisement.id}
                        advertisement={advertisement}
                      />
                    ))}
                  </div>
                ) : searchParams.get("q") ? (
                  <div className="text-center py-12">
                    <BiSearch className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Nenhuma propriedade encontrada
                    </h3>
                    <p className="text-gray-600">
                      Tente buscar por outros termos ou localidades.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BiSearch className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Faça uma busca
                    </h3>
                    <p className="text-gray-600">
                      Digite o que você está procurando no campo acima.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Search;
