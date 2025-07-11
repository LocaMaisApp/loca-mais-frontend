import { FaMapMarkerAlt } from "react-icons/fa";
import { MdBathtub, MdBed, MdSquareFoot } from "react-icons/md";
import { Link } from "react-router-dom";
import type { Advertisement } from "../pages/Home/Home";

interface PropertyCardProps {
  advertisement: Advertisement;
}

export const PropertyCard = ({ advertisement }: PropertyCardProps) => {
  const prop = advertisement;

  return (
    <Link
      to={`/anuncios/${prop.id}`}
      className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <figure className="relative">
        {prop.images[0] ? (
          <img
            src={`${import.meta.env.VITE_API_URL}${prop.images[0]}`}
            alt="Imagem do imóvel"
            className={`w-full object-cover h-48`}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Imagem não disponível</span>
          </div>
        )}
      </figure>

      <div className="card-body p-4">
        <div className="mb-3">
          <h3 className="card-title text-base font-semibold text-base-content mb-1 line-clamp-1">
            {prop.property.name}
          </h3>
          <div className="flex items-center text-base-content/70 text-sm">
            <FaMapMarkerAlt className="w-3 h-3 mr-1" />
            <span className="line-clamp-1">{prop.property.street}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-3 text-sm text-base-content/70">
            <div className="flex items-center">
              <MdBed className="w-4 h-4 mr-1" />
              <span>{prop.property.roomQuantity}</span>
            </div>
            <div className="flex items-center">
              <MdBathtub className="w-4 h-4 mr-1" />
              <span>{prop.property.bathroomQuantity}</span>
            </div>
            <div className="flex items-center">
              <MdSquareFoot className="w-4 h-4 mr-1" />
              <span>{prop.property.size}m²</span>
            </div>
          </div>
        </div>

        <div className="card-actions justify-between items-center">
          <div>
            <div className="text-xl font-bold text-base-content">
              R$ {prop.value.toLocaleString()}
            </div>
            <div className="text-xs text-base-content/50">por mês</div>
          </div>
          <button
            className="btn btn-sm 
            "
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </Link>
  );
};
