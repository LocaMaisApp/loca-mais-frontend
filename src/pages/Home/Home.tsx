import React, { useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { CiMapPin } from "react-icons/ci";
import api from "../../api/axiosConfig";
import Navbar from "../../components/Navbar";
import { PropertyCard } from "../../components/PropertyCard";

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
}

const Home: React.FC = () => {
  const [advertisements, setAdvertisements] = React.useState<Advertisement[]>(
    []
  );
  const [searched, setSearched] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/advertisement`);
        setAdvertisements(response.data);
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-r from-primary-500 to-primary-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Encontre seu próximo lar
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Descubra propriedades incríveis para alugar em toda a cidade.
                Seu novo lar está a apenas um clique de distância.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <CiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      value={searched}
                      onChange={(e) => setSearched(e.target.value)}
                      type="text"
                      placeholder="Onde você quer morar? (Ex: Copacabana, Rio de Janeiro)"
                      className="w-full pl-12 pr-4 py-4 text-gray-800 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button className="px-8 py-4 bg-primary-400 rounded-xl text-white hover:bg-primary-600 transition-colors duration-300 flex items-center">
                      <BiSearch className="inline-block mr-2" />
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Propriedades Disponíveis
                </h2>
                {!loading && <p className="text-gray-600">
                  {advertisements.length} imóveis disponíveis
                </p>}
              </div>
            </div>

            {loading ?
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner"></span>

            </div>
            :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advertisements.map((advertisement) => (
                <PropertyCard key={advertisement.id} advertisement={advertisement} />
              ))}
            </div>}
          </section>

          {advertisements.length > 0  && <div className="text-center mt-12">
            <button className="px-8 py-3 text-lg btn bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300">
              Carregar Mais Propriedades
            </button>
          </div>}
        </div>
      </main>
    </>
  );
};

export default Home;
