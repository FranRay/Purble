interface InputProps {
  placeholder?: string;
  value?: string;
  type?: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  type,
  disabled,
  onChange,
}) => {
  return (
    <input
      disabled={disabled}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      type={type}
      className="
            w-full
            p-4
            text-lg
            bg-[#EEF5FF]
            rounded-md
            outline-none
            text-[#475885]
            focus:border-2
            transition
            disabled:bg-[#D2DBF2]
            disabled:opacity-70
            disabled:cursor-not-allowed
            "
    />
  );
};

export default Input;
