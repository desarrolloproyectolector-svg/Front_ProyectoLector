interface Props {
  text: string;
}

export default function EmptyState({ text }: Props) {
  return (
    <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-[#e3dac9]/50">
      <div className="w-20 h-20 bg-[#fbf8f1] rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg className="w-10 h-10 text-[#a1887f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
      </div>
      <h3 className="font-playfair text-xl font-bold text-[#2b1b17] mb-2">
        {text}
      </h3>
      <p className="text-[#8d6e3f]">
        Intenta con otros términos de búsqueda
      </p>
    </div>
  );
}