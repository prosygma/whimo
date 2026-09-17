import React from 'react';
import Button from './Button.tsx';

interface Props extends React.ComponentPropsWithRef<'input'> {
  label: string;
  link?: {
    label: string;
    action: () => void;
  };
  error?: string;
  hint?: string;
  StartIcon?: React.ElementType;
  TrailingIcon?: React.ElementType;
  trailingIconAction?: () => void;
}

const Input: React.FC<Props> = React.forwardRef(function Input(
  { label, link, value, onChange, error, disabled, hint, StartIcon, TrailingIcon, trailingIconAction, ...props },
  ref,
) {
  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex justify-between">
        <p className={`text-body-m select-none ${disabled && 'text-gray-30'}`}>{label}</p>
        {link && (
          <Button type="button" primary ghost onClick={link.action} disabled={disabled}>
            {link.label}
          </Button>
        )}
      </div>
      <div
        className={`flex gap-1.5 items-center w-full h-12 max-h-12 outline-0 px-4 py-3.5 rounded-lg bg-gray-5 border ${disabled && 'text-gray-30 border-gray-10!'} ${error ? 'border-error' : 'border-gray-10 focus-within:border-primary hover:border-primary-hover'}`}
      >
        {StartIcon && (
          <StartIcon
            className={`size-5 ${disabled ? 'text-gray-30' : 'text-gray-50'} ${!error && '[&:has(+input:focus)]:text-primary'}`}
          />
        )}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          className={`flex-1 outline-0 text-body-s caret-gray-40 ${props.readOnly && 'cursor-default'} ${disabled ? 'placeholder:text-gray-30' : 'placeholder:text-gray-40'}`}
          disabled={disabled}
          {...props}
        />
        {TrailingIcon && (
          <TrailingIcon
            className={`size-5 text-gray-50 ${trailingIconAction && 'cursor-pointer'}`}
            {...(trailingIconAction && { onClick: trailingIconAction })}
          />
        )}
      </div>
      {error && <p className="text-error">{error}</p>}
      {hint && !error && <p className="text-gray-60">{hint}</p>}
    </div>
  );
});

export default Input;
