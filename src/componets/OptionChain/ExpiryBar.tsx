type Props = {
  expiries: string[];
  active: string;
  onChange: (expiry: string) => void;
};

export default function ExpiryBar({ expiries, active, onChange }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto mb-3 pb-2 border-b">
      {expiries.map((e) => (
        <button
          key={e}
          onClick={() => onChange(e)}
          className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
            e === active
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
