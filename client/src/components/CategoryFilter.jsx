import { LayoutGrid, Dumbbell, Trees, Trophy, ShoppingBag } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All', icon: LayoutGrid },
  { value: 'gym', label: 'Gyms', icon: Dumbbell },
  { value: 'park', label: 'Parks', icon: Trees },
  { value: 'court', label: 'Courts', icon: Trophy },
  { value: 'store', label: 'Nutrition', icon: ShoppingBag },
];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {CATEGORIES.map(({ value, label, icon: Icon }) => {
        const active = selected === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150"
            style={{
              background: active ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${active ? 'rgba(34,197,94,0.30)' : 'rgba(255,255,255,0.08)'}`,
              color: active ? 'rgba(74,222,128,0.95)' : 'rgba(255,255,255,0.50)',
              fontWeight: active ? 500 : 400,
            }}
          >
            <Icon size={13} strokeWidth={active ? 2.2 : 1.8} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
