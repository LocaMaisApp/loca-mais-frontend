import React from "react";
import { AiOutlineWarning } from "react-icons/ai";
import api from "../../api/axiosConfig";
import type { Advertisement, Property } from "./Property";

interface DeleteModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  selected: Property | Advertisement | null;
  type: "properties" | "advertisements";
  hasAd?: boolean;
  onUpdate: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  ref,
  selected,
  type,
  hasAd = false,
  onUpdate,
}) => {
  const [loading, setLoading] = React.useState(false);

  const confirmDelete = async () => {
    try {
      setLoading(true);

      if (type === "properties") {
        // api.delete(`/properties/${selected?.id}`)
      } else {
        await api.delete(`/api/advertisement/${selected?.id}`);
        onUpdate();
      }
      ref.current?.close();
    } catch {
      console.error("Erro ao excluir:");
    } finally {
      setLoading(false);
    }
  };

  const getMessage = () => {
    if (type === "properties") {
      if (hasAd) {
        return (
          <div className="text-center">
            <p className="text-lg mb-4">
              Tem certeza que deseja excluir a propriedade?
            </p>
            <div className="alert alert-warning">
              <AiOutlineWarning className="text-lg" />
              <span>Isso também irá excluir o anúncio vinculado.</span>
            </div>
          </div>
        );
      }
      return (
        <p className="text-lg text-center">
          Tem certeza que deseja excluir a propriedade?
        </p>
      );
    }
    return (
      <p className="text-lg text-center">
        Tem certeza que deseja excluir o anúncio?
      </p>
    );
  };

  if (!open) return null;

  return (
    <dialog className="modal" ref={ref}>
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-center mb-4">
          <AiOutlineWarning className="text-4xl text-warning mr-2" />
          <h3 className="font-bold text-lg">Confirmar Exclusão</h3>
        </div>

        <div className="py-4">{getMessage()}</div>

        <div className="modal-action">
          <button
            className="btn btn-outline"
            onClick={() => {
              ref.current?.close();
            }}
          >
            Cancelar
          </button>
          <button
            className="btn btn-error"
            onClick={confirmDelete}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Excluir"
            )}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={() => {
          ref.current?.close();
        }}
      ></div>
    </dialog>
  );
};

export default DeleteModal;
