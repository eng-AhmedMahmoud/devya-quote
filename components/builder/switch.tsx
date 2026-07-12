'use client';

interface Props {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: string;
}

export function Switch({ checked, onChange, label }: Props) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <span className="relative inline-flex flex-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <span
          aria-hidden
          className={`relative inline-block w-[46px] h-[26px] rounded-full border transition-colors ${
            checked ? 'bg-white border-white' : 'bg-white/[0.04] border-white/10'
          }`}
        >
          <span
            className={`absolute top-[2px] w-[20px] h-[20px] rounded-full transition-all ${
              checked ? 'bg-zinc-950 left-[22px]' : 'bg-zinc-500 left-[2px]'
            }`}
          />
        </span>
      </span>
      <span className={`text-[15px] transition-colors ${checked ? 'text-white' : 'text-zinc-400'}`}>
        {label}
      </span>
    </label>
  );
}
