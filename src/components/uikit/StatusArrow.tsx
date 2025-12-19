import React from 'react';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

interface Props {
  status: 'buying' | 'selling';
}

const StatusArrow: React.FC<Props> = ({status}) => {
  if (status === 'buying') {
    return <ArrowDownCircleIcon className="size-7 text-gray-50" />;
  }

  return <ArrowUpCircleIcon className="size-7 text-gray-50" />;
};

export default StatusArrow;
