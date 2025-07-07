import { FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { MdBathtub, MdBed, MdSquareFoot } from 'react-icons/md';

interface Property {
  id: number;
  title: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  price: number;
  image: string;
  isAvailable: boolean;
  isFeatured?: boolean;
}

interface PropertyCardProps {
  property?: Property;
  featured?: boolean;
}

export const PropertyCard = ({
  property,
  featured = false,
}: PropertyCardProps) => {
  // Default property data if none provided (for backward compatibility)
  const defaultProperty: Property = {
    id: 0,
    title: "Apartamento Aconchegante no Centro",
    address: "Rua Augusta, 456 - Centro",
    bedrooms: 2,
    bathrooms: 1,
    size: 65,
    price: 1800,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    isAvailable: true,
  };

  const prop = property || defaultProperty;
  const cardSize = featured ? "md:col-span-1" : "";

  return (
    <div className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${cardSize}`}>
      <figure className="relative">
        <img
          src={prop.image}
          alt={prop.title}
          className={`w-full object-cover ${featured ? "h-64" : "h-48"}`}
        />
        <button className="btn btn-circle btn-sm absolute top-3 right-3 bg-white/80 backdrop-blur-sm border-none hover:bg-white/90">
          <FaHeart className="w-4 h-4" />
        </button>
        <div className={`badge absolute top-3 left-3 ${
          prop.isAvailable ? "badge-success" : "badge-error"
        }`}>
          {prop.isAvailable ? "Disponível" : "Alugado"}
        </div>
        {featured && (
          <div className="badge badge-warning absolute bottom-3 left-3">
            Destaque
          </div>
        )}
      </figure>

      <div className="card-body p-4">
        <div className="mb-3">
          <h3 className="card-title text-base font-semibold text-base-content mb-1 line-clamp-1">
            {prop.title}
          </h3>
          <div className="flex items-center text-base-content/70 text-sm">
            <FaMapMarkerAlt className="w-3 h-3 mr-1" />
            <span className="line-clamp-1">{prop.address}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-3 text-sm text-base-content/70">
            <div className="flex items-center">
              <MdBed className="w-4 h-4 mr-1" />
              <span>{prop.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <MdBathtub className="w-4 h-4 mr-1" />
              <span>{prop.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <MdSquareFoot className="w-4 h-4 mr-1" />
              <span>{prop.size}m²</span>
            </div>
          </div>
        </div>

        <div className="card-actions justify-between items-center">
          <div>
            <div className="text-xl font-bold text-base-content">
              R$ {prop.price.toLocaleString()}
            </div>
            <div className="text-xs text-base-content/50">por mês</div>
          </div>
          <button
            className={`btn btn-sm ${
              prop.isAvailable 
                ? "btn-primary bg-gradient-to-r from-blue-500 to-purple-600 border-none" 
                : "btn-disabled"
            }`}
            disabled={!prop.isAvailable}
          >
            {prop.isAvailable ? "Ver Detalhes" : "Indisponível"}
          </button>
        </div>
      </div>
    </div>
  );
};
