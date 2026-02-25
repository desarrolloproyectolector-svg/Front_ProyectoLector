type Tab = 'todas' | 'licencias' | 'libros';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export default function CompraTabs({ active, onChange }: Props) {
  const tabs: Tab[] = ['todas', 'licencias', 'libros'];

  return (
    <div className="flex gap-2 border-b border-[#e3dac9] pb-px">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-6 py-3 font-bold text-sm rounded-t-lg transition-all duration-300 capitalize ${
            active === tab
              ? 'bg-gradient-to-b from-[#d4af37]/10 to-transparent text-[#2b1b17] border-b-2 border-[#d4af37]'
              : 'text-[#a1887f] hover:text-[#2b1b17] hover:bg-[#fbf8f1]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}