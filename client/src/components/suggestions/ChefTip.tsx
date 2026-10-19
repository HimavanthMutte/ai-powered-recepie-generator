export default function ChefTip({ tip }: { tip: string }) {
  return (
    <aside className="flex items-start justify-center gap-3 rounded-xl border border-[#C2410C] bg-[#FFF1EB] p-4 text-left">
      <span aria-hidden="true" className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-[#C2410C]">lightbulb</span>
      <p className="text-xs leading-relaxed text-[#44403C]">
        <strong className="font-semibold text-[#C2410C]">Cook's Tip: </strong>{tip}
      </p>
    </aside>
  );
}
