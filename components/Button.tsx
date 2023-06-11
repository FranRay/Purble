import React, { ReactNode } from "react";

interface ButtonProps {
  label: ReactNode;
  secondary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick: () => void;
  disabled?: boolean;
  outline?: boolean;
  notRounded?: boolean;
  transform?: boolean;
  noBorder?: boolean;
}

// button template
const Button: React.FC<ButtonProps> = ({
  label,
  secondary,
  fullWidth,
  large,
  onClick,
  disabled,
  outline,
  notRounded,
  transform,
  noBorder,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        disabled:opacity-70
        disabled:cursor-not-allowed
        font-semibold
        hover:opacity-80
        transition
        ${noBorder ? "" : "border-2"}
        ${transform ? "" : "transition-transform duration-300 ease-in-out"}
        ${notRounded ? "rounded-md" : "rounded-full"}
        ${fullWidth ? "w-full" : "w-fit"}
        ${secondary ? "bg-[#7680E5]" : "bg-[#7680E5]"}
        ${secondary ? "text-[#EEF5FF]" : "text-[#7680E5]"}
        ${secondary ? "border-[#EEF5FF]" : "border-[#7680E5]"}
        ${large ? "text-xl" : "text-md"}
        ${large ? "px-5" : "px-4"}
        ${large ? "py-3" : "py-2"}
        ${outline ? "bg-transparent" : ""}
        ${outline ? "border-[#475885]" : ""}
        ${outline ? "text-[#475885]" : ""}
      `}
    >
      {label}
    </button>
  );
};

export default Button;
