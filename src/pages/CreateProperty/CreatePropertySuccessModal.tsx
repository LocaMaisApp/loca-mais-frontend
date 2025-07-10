import React from "react";
import { useNavigate } from "react-router-dom";

const PropertySuccessModal = React.forwardRef<HTMLDialogElement>((_, ref) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (ref && typeof ref !== "function" && ref.current) {
      ref.current.close();
    }
    navigate('/');
  };

  const handleCreateAdvertisement = () => {
    if (ref && typeof ref !== "function" && ref.current) {
      ref.current.close();
    }
    navigate('/anunciar');
  };

  return (
    <dialog ref={ref} id="propertySuccessModal" className="modal">
      <div className="modal-box max-w-md ">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="font-semibold text-xl text-gray-800">
            Propriedade criado com sucesso!
          </h3>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-lg">✓</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800 leading-relaxed">
                Sua propriedade foi criada e está pronta para ser anunciada!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <div className="flex items-start">
            <div>
              <p className="text-sm text-blue-800 mb-1">
                <strong>Parabéns!</strong> Agora é só anunciar sua propriedade.
              </p>
              <p className="text-sm text-blue-700">
                Você pode gerenciar suas propriedades a qualquer momento.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-action mt-6 flex flex-col gap-3">
          <button
            className="btn bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 rounded-lg border-none w-full"
            onClick={handleCreateAdvertisement}
          >
            Criar Anúncio
          </button>
          <div className="flex gap-3">
            <button
              className="btn bg-green-500 hover:bg-green-600 text-white font-medium px-6 rounded-lg border-none flex-1"
              onClick={handleGoHome}
            >
              Ir para Home
            </button>
            <button
              className="btn bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 rounded-lg border-none flex-1"
              onClick={() => {
                if (ref && typeof ref !== "function" && ref.current) {
                  ref.current.close();
                }
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            if (ref && typeof ref !== "function" && ref.current) {
              ref.current.close();
            }
          }}
        >
          ×
        </button>
      </form>
    </dialog>
  );
});


export default PropertySuccessModal;
