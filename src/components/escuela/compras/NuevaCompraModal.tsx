'use client';

import { Modal } from '../../ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NuevaCompraModal({ open, onClose }: Props) {
  return (
    <Modal isOpen={open} onClose={onClose} title="Nueva Compra" size="md">
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#2b1b17] mb-2">
            Tipo de Compra
          </label>
          <select className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 font-lora text-sm transition-all duration-300">
            <option value="">Seleccionar tipo...</option>
            <option value="licencia">Licencia</option>
            <option value="libro">Libro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#2b1b17] mb-2">
            Nombre del Producto
          </label>
          <input
            type="text"
            placeholder="Ej: Licencia Premium, Cien Años de Soledad"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 font-lora text-sm transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#2b1b17] mb-2">
              Cantidad
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 font-lora text-sm transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#2b1b17] mb-2">
              Precio Unitario
            </label>
            <input
              type="number"
              placeholder="$0.00"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#e3dac9] bg-white focus:outline-none focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 font-lora text-sm transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border-2 border-[#e3dac9] hover:border-[#d4af37] hover:bg-[#fbf8f1] text-[#2b1b17] rounded-xl font-bold transition-all duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2b1b17] to-[#3e2723] text-[#f0e6d2] rounded-xl font-bold hover:from-[#3e2723] hover:to-[#4e342e] shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Guardar Compra
          </button>
        </div>
      </form>
    </Modal>
  );
}