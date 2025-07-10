import React from 'react';

const AdvertisementErrorModal = React.forwardRef<
  HTMLDialogElement,
  {
    error: string | null;
  }
>(({ error }, ref) => {
  return (
    <dialog ref={ref} id="advertisementErrorModal" className="modal">
      <div className="modal-box max-w-md">
        {/* Header mais amigável */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">😅</span>
          </div>
          <h3 className="font-semibold text-xl text-gray-800">Ops! Algo deu errado</h3>
        </div>

        {/* Mensagem de erro mais humana */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-lg">ℹ️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800 leading-relaxed">{error}</p>
            </div>
          </div>
        </div>

        {/* Mensagem de encorajamento */}
        <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
          <div className="flex items-start">
            <span className="text-lg mr-2">🤗</span>
            <div>
              <p className="text-sm text-green-800 mb-1">
                <strong>Não se preocupe!</strong> Isso acontece às vezes.
              </p>
              <p className="text-sm text-green-700">
                Dê uma olhada nos dados que você preencheu e tente novamente. Se precisar de ajuda, estamos aqui! 💪
              </p>
            </div>
          </div>
        </div>

        {/* Ações mais amigáveis */}
        <div className="modal-action mt-6">
          <button
            className="btn bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 rounded-lg border-none"
            onClick={() => {
              if (ref && typeof ref !== 'function' && ref.current) {
                ref.current.close();
              }
            }}
          >
            Entendi! 👍
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            if (ref && typeof ref !== 'function' && ref.current) {
              ref.current.close();
            }
          }}
        >
          ✕
        </button>
      </form>
    </dialog>
  );
});

AdvertisementErrorModal.displayName = 'AdvertisementErrorModal';

export default AdvertisementErrorModal;
