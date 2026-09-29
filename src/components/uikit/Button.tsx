import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

type Button = {
  children: React.ReactNode;
  Icon?: React.ElementType;
  overrideIconStyle?: string;
};

type IconButton = {
  iconButton: true;
  Icon: React.ElementType;
};

type ButtonProps = Button | IconButton;

type Props = ButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    primary?: boolean;
    ghost?: boolean;
    className?: string;
  };

const buttonVariants = cva('flex gap-2 items-center justify-center text-button-m', {
  variants: {
    primary: {
      true: 'text-white bg-primary hover:bg-primary-hover disabled:bg-primary-disabled active:bg-primary-active',
      false:
        'border border-gray-10 hover:border-primary-hover active:border-primary disabled:text-gray-30 disabled:border-gray-10 shadow-[0_1px_2px_0_#1018280D] disabled:shadow-none active:shadow-none',
    },
    ghost: {
      true: 'bg-transparent hover:bg-transparent disabled:bg-transparent active:bg-transparent border-none',
      false: 'rounded-lg py-[13px] px-6',
    },
    iconButton: {
      true: '[&]:p-3',
    },
    destroy: {
      true: '',
    }
  },
  compoundVariants: [
    {
      primary: true,
      ghost: true,
      class:
        '[&]:text-primary [&]:hover:text-primary-hover [&]:disabled:text-primary-disabled [&]:active:text-primary-active',
    },
    {
      primary: false,
      ghost: true,
      class: '[&]:hover:text-primary-hover [&]:disabled:text-gray-30 [&]:active:text-primary',
    },
    {
      iconButton: true,
      class: 'rounded-lg',
    },
    {
      primary: [true, false],
      destroy: true,
      class: '[&]:bg-error [&]:hover:bg-[#E04747] [&]:disabled:bg-[#E19494] [&]:active:bg-[#641200]'
    }
  ],
  defaultVariants: {},
});

const Button: React.FC<Props> = ({ primary = false, ghost = false, destroy = false, Icon, className = '', ...props }) => {
  let children = null;
  if ('children' in props) {
    children = props.children;
  }

  let iconButton;
  if ('iconButton' in props) {
    iconButton = props.iconButton;
    delete props.iconButton;
  }

  let overrideIconStyle = '';
  if ('overrideIconStyle' in props && props.overrideIconStyle) {
    overrideIconStyle = props.overrideIconStyle;
    delete props.overrideIconStyle;
  }

  return (
    <button className={buttonVariants({ className, primary, destroy, ...(!iconButton && { ghost }), iconButton })} {...props}>
      {Icon && <Icon className={`${overrideIconStyle} ${iconButton ? 'size-6' : 'size-5'}`} strokeWidth={1.5} />}
      {children}
    </button>
  );
};

export default Button;
