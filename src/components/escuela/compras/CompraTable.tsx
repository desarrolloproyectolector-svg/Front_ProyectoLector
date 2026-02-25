import { Compra } from '@/types/escuela/compras';
import CompraRow from './CompraRow';

interface Props {
  compras: Compra[];
}

export default function CompraTable({ compras }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-[#e3dac9]">
            <th className="text-left py-4 px-4 font-playfair font-bold text-[#2b1b17] text-sm uppercase tracking-wider">
              Producto
            </th>
            <th className="text-left py-4 px-4 font-playfair font-bold text-[#2b1b17] text-sm uppercase tracking-wider">
              Tipo
            </th>
            <th className="text-left py-4 px-4 font-playfair font-bold text-[#2b1b17] text-sm uppercase tracking-wider">
              Cantidad
            </th>
            <th className="text-left py-4 px-4 font-playfair font-bold text-[#2b1b17] text-sm uppercase tracking-wider">
              Total
            </th>
            <th className="text-left py-4 px-4 font-playfair font-bold text-[#2b1b17] text-sm uppercase tracking-wider">
              Estado
            </th>
            <th className="text-right py-4 px-4 font-playfair font-bold text-[#2b1b17] text-sm uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {compras.map((c) => (
            <CompraRow key={c.id} compra={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
}