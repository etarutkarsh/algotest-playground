interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-4 w-8 items-center rounded-full transition ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
          checked ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
}
