interface Props {
  message: string;
}

export default function EmptyState({ message }: Props) {
  return (
    <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-[#e3dac9]/50">
      <div className="w-20 h-20 bg-[#fbf8f1] rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg className="w-10 h-10 text-[#a1887f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
      </div>
      <h3 className="font-playfair text-xl font-bold text-[#2b1b17] mb-2">{message}</h3>
      <p className="text-[#8d6e3f]">Intenta con otros términos de búsqueda</p>
    </div>
  );
}