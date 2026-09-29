import React, { type PropsWithChildren } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface Props extends React.InputHTMLAttributes<HTMLInputElement>, PropsWithChildren {}

const Checkbox: React.FC<Props> = ({ children, ...props }) => {
  return (
    <label className="w-full flex gap-3 items-center select-none">
      <input className="peer hidden" type="checkbox" {...props} />
      <div
        role="checkbox"
        className="flex items-center justify-center cursor-pointer size-6 border border-gray-10 rounded-sm hover:border-sea-blue-hover peer-checked:border-none peer-checked:bg-sea-blue peer-checked:hover:bg-sea-blue-hover"
      >
        {props.checked && <CheckIcon className="size-5 text-white" />}
      </div>
      {children}
    </label>
  );
};

export default Checkbox;
