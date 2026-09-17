import React from 'react';
import 'react-phone-number-input/style.css';
import PhoneNumberInput from 'react-phone-number-input';

interface Props {
  label: string;
  value: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
  error?: string;
  readOnly?: boolean;
  TrailingIcon?: React.ElementType;
  trailingIconAction?: () => void;
}

const PhoneInput: React.FC<Props> = ({ label, value, onChange, disabled, error, TrailingIcon, trailingIconAction, readOnly = false }) => {
  return (
    <label className="w-full flex flex-col gap-1 relative">
      <p className={`text-body-m ${disabled && 'text-gray-30'}`}>{label}</p>
      <PhoneNumberInput
        international
        defaultCountry={'CM'}
        value={value}
        onChange={onChange}
        className={`flex flex-1 gap-1.5 items-center w-full h-12 max-h-12 outline-0 px-4 py-3.5 rounded-lg bg-gray-5 border ${disabled && 'text-gray-30 border-gray-10!'} ${error ? 'border-error' : 'border-gray-10 focus-within:border-primary hover:border-primary-hover'} [&>*]:outline-0 text-body-s [&_.PhoneInputCountry]:mr-0! [&_.PhoneInputCountryIcon]:shadow-none! ${disabled && '[&_.PhoneInputCountryIcon]:opacity-50!'} [&_.PhoneInputCountrySelectArrow]:hidden! ${readOnly && '[&_.PhoneInputInput]:cursor-default'}`}
        disabled={disabled}
        readOnly={readOnly}
      />
      {TrailingIcon && (
        <TrailingIcon
          className={`absolute bottom-3.5 right-4.25 size-5 text-gray-50 ${trailingIconAction && 'cursor-pointer'}`}
          {...(trailingIconAction && { onClick: trailingIconAction })}
        />
      )}
      {error && <p className="text-error">{error}</p>}
    </label>
  );
};

export default PhoneInput;
