import React from "react";

type InputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder?: string;
};

export const inputStyles =
  "mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-600";

const Input = ({ label, value, onChange, placeHolder = "" }: InputProps) => {
  return (
    <div className="mt-6">
      <label className="mb-1 block text-base font-semibold text-gray-300">
        {label}:
        <input type="text" placeholder={placeHolder} value={value} onChange={onChange} className={inputStyles} />
      </label>
    </div>
  );
};

export default Input;
