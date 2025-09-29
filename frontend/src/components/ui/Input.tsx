import React from "react";

interface Inputprops {
  placeholder: string;
  reference?: React.Ref<HTMLInputElement>;
  name?: string;
  value?: string | string[];
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent) => void;
  label: string;
  inputId: string;
  disabled?: boolean;
}

export const Input = (props: Inputprops) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={props.placeholder}
        onChange={props.onChange}
        id={props.inputId}
        value={props.value}
        required={props.required}
        disabled={props.disabled}
        onBlur={props.onBlur}
        className="peer w-96 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
      />
      <label
        htmlFor={props.inputId}
        className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
      >
        {props.label}
      </label>
    </div>
  );
};
