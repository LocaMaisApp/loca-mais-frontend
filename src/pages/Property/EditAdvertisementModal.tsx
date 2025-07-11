import React, { useEffect, useState } from "react";
import { BiUpload } from "react-icons/bi";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import api from "../../api/axiosConfig";
import { handleApiError } from "../../utils/errorHandler";

interface Advertisement {
  id: number;
  description: string;
  condominiumValue: number;
  value: number;
  iptuValue: number;
  property: {
    id: number;
    name: string;
    street: string;
    city: string;
    state: string;
    complement?: string;
    number: number;
    size: number;
    bathroomQuantity: number;
    suites: number;
    car_space: number;
    roomQuantity: number;
  };
  images: string[];
}

interface EditAdvertisementModalProps {
  advertisement: Advertisement | null;
  onUpdate: () => void;
  ref: React.RefObject<HTMLDialogElement | null>;
}

const EditAdvertisementModal: React.FC<EditAdvertisementModalProps> = ({
  advertisement,
  onUpdate,
  ref,
}) => {
  const [formData, setFormData] = useState({
    description: "",
    value: "",
    condominiumValue: "",
    iptuValue: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (advertisement) {
      setFormData({
        description: advertisement.description,
        value: advertisement.value.toString(),
        condominiumValue: advertisement.condominiumValue.toString(),
        iptuValue: advertisement.iptuValue.toString(),
      });
      setExistingImages(advertisement.images || []);
      setImages([]);
      setImagePreviewUrls([]);
      setImagesToDelete([]);
      setError(null);
      setShowSuccess(false);
    }
  }, [advertisement]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviewUrls((prev) => [
          ...prev,
          event.target?.result as string,
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    setImagesToDelete((prev) => [...prev, imageUrl]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advertisement) return;

    if (!formData.description.trim() || !formData.value) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updateFormData = new FormData();
      updateFormData.append("description", formData.description);
      updateFormData.append("value", formData.value);
      updateFormData.append(
        "condominiumValue",
        formData.condominiumValue || "0"
      );
      updateFormData.append("iptuValue", formData.iptuValue || "0");

      images.forEach((image) => {
        updateFormData.append(`images`, image);
      });

      await api.patch(
        `/api/advertisement/${advertisement.id}`,
        updateFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (imagesToDelete.length > 0) {
        for (const imageUrl of imagesToDelete) {
          try {
            await api.delete(`/api/advertisement/${advertisement.id}/images`, {
              params: { imageUrl },
            });
          } catch (error) {
            console.error("Erro ao deletar imagem:", error);
          }
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onUpdate();
      }, 2000);
      ref.current?.close();
    } catch (error) {
      setError(handleApiError(error, "Erro ao atualizar anúncio"));
    } finally {
      setLoading(false);
    }
  };

  const totalValue =
    parseFloat(formData.value || "0") +
    parseFloat(formData.condominiumValue || "0") +
    parseFloat(formData.iptuValue || "0");

  if (!advertisement) return null;

  return (
    <dialog className="modal " ref={ref}>
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Editar Anúncio</h3>
        </div>

        {showSuccess && (
          <div className="alert alert-success mb-4">
            <FaCheckCircle className="w-6 h-6" />
            <span>Anúncio atualizado com sucesso!</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-4">
            <FaTimes className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-base-200 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold mb-2">Propriedade</h4>
          <div className="text-sm text-gray-600">
            <p>
              <strong>Nome:</strong> {advertisement.property.name}
            </p>
            <p>
              <strong>Endereço:</strong> {advertisement.property.street},{" "}
              {advertisement.property.number} - {advertisement.property.city}/
              {advertisement.property.state}
            </p>
            <p>
              <strong>Características:</strong> {advertisement.property.size}m²
              | {advertisement.property.roomQuantity} quartos |{" "}
              {advertisement.property.bathroomQuantity} banheiros
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control flex flex-col w-full">
            <label className="label">
              <span className="label-text font-medium">
                Descrição do Anúncio *
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 w-full "
              placeholder="Descreva sua propriedade, destacando os principais atrativos..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Valor do Aluguel (R$) *
                </span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input input-bordered"
                placeholder="2200.00"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Valor do Condomínio (R$)
                </span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input input-bordered"
                placeholder="350.00"
                value={formData.condominiumValue}
                onChange={(e) =>
                  handleInputChange("condominiumValue", e.target.value)
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Valor do IPTU (R$)
                </span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input input-bordered"
                placeholder="150.00"
                value={formData.iptuValue}
                onChange={(e) => handleInputChange("iptuValue", e.target.value)}
              />
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Valor Total Mensal:</span>
              <span className="text-2xl font-bold text-primary">
                R${" "}
                {totalValue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {existingImages.length > 0 && (
            <div>
              <label className="label">
                <span className="label-text font-medium">Imagens Atuais</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${imageUrl}`}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(imageUrl)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="label">
              <span className="label-text font-medium">
                Adicionar Novas Imagens
              </span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <BiUpload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Clique para fazer upload</span>{" "}
                ou arraste as imagens
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG ou JPEG (MAX. 10MB cada)
              </p>
            </label>

            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviewUrls.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Nova imagem ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Atualizando...
                </>
              ) : (
                "Atualizar Anúncio"
              )}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={() => ref.current?.close()}>close</button>
      </form>
    </dialog>
  );
};

export default EditAdvertisementModal;
