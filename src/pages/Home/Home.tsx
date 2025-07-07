import React from "react";
import { BiSearch } from "react-icons/bi";
import { CiMapPin } from "react-icons/ci";
import Navbar from "../../components/Navbar";
import { PropertyCard } from "../../components/PropertyCard";
import { useAuth } from "../../context/AuthContext";

const featuredProperties = [
  {
    id: 1,
    title: "Apartamento Moderno no Centro",
    address: "Rua Augusta, 456 - Centro, São Paulo - SP",
    bedrooms: 2,
    bathrooms: 2,
    size: 75,
    price: 2200,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 2,
    title: "Cobertura com Vista Panorâmica",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    bedrooms: 3,
    bathrooms: 3,
    size: 120,
    price: 4500,
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 3,
    title: "Loft Industrial Reformado",
    address: "Rua da Consolação, 789 - Vila Buarque, São Paulo - SP",
    bedrooms: 1,
    bathrooms: 1,
    size: 60,
    price: 1800,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 4,
    title: "Casa com Jardim Privativo",
    address: "Rua das Flores, 123 - Vila Madalena, São Paulo - SP",
    bedrooms: 3,
    bathrooms: 2,
    size: 140,
    price: 3200,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 5,
    title: "Apartamento Familiar Completo",
    address: "Rua Vergueiro, 890 - Liberdade, São Paulo - SP",
    bedrooms: 3,
    bathrooms: 2,
    size: 95,
    price: 2800,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 6,
    title: "Studio Compacto e Moderno",
    address: "Rua Oscar Freire, 567 - Jardins, São Paulo - SP",
    bedrooms: 1,
    bathrooms: 1,
    size: 45,
    price: 2100,
    image: "https://images.unsplash.com/photo-1524230572899-a752b3835840",
    isAvailable: false,
    isFeatured: false,
  },
  {
    id: 7,
    title: "Apartamento com Varanda Gourmet",
    address: "Rua Estados Unidos, 234 - Jardim América, São Paulo - SP",
    bedrooms: 2,
    bathrooms: 2,
    size: 85,
    price: 3500,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 8,
    title: "Duplex com Home Office",
    address: "Rua Bela Cintra, 345 - Consolação, São Paulo - SP",
    bedrooms: 2,
    bathrooms: 3,
    size: 110,
    price: 3800,
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    isAvailable: true,
    isFeatured: false,
  },
];

const Home: React.FC = () => {
  const featuredProps = featuredProperties.filter((p) => p.isFeatured);
  const regularProps = featuredProperties.filter((p) => !p.isFeatured);
  const { user } = useAuth();
  const [searched, setSearched] = React.useState<string>("");
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
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Propriedades em Destaque
                </h2>
                <p className="text-gray-600">
                  Os melhores imóveis selecionados especialmente para você
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProps.map((property) => (
                <PropertyCard key={property.id} property={property} featured />
              ))}
            </div>
          </section>

          {/* All Properties */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Todas as Propriedades
                </h2>
                <p className="text-gray-600">
                  {regularProps.length} imóveis disponíveis
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProps.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>

          <div className="text-center mt-12">
            <button className="px-8 py-3 text-lg btn bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300">
              Carregar Mais Propriedades
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
