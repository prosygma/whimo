import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import type { IconProps } from 'react-toastify';

type RenderToastIcon = (iconProps: IconProps) => React.ReactElement | null;

const renderToastIcon: RenderToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="size-6 text-success" />;
    case 'info':
      return <InformationCircleIcon className="size-6 text-primary" />;
    case 'warning':
      return <ExclamationTriangleIcon className="size-6 text-warning" />;
    case 'error':
      return <ExclamationCircleIcon className="size-6 text-error" />;
    default:
      return null;
  }
};

export default renderToastIcon;
