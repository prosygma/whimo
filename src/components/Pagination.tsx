import React from 'react';
import type { PaginationResponse } from '../api/types/common.ts';
import Button from './uikit/Button.tsx';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface Props {
  paginationData: PaginationResponse;
  switchPage: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ paginationData, switchPage }) => {
  const { t } = useTranslation('common');

  if (paginationData.total_pages === 1) return null;

  const previousPageHandler = () => {
    if (!paginationData.previous_page) return;

    switchPage(paginationData.previous_page);
  };

  const nextPageHandler = () => {
    if (!paginationData.next_page) return;

    switchPage(paginationData.next_page);
  };

  return (
    <div className="flex-1 flex items-end">
      <div className="w-full flex justify-between items-center px-10 py-5">
        <Button
          className="flex [&]:gap-1.5"
          ghost
          disabled={!paginationData.previous_page}
          onClick={previousPageHandler}
        >
          <ArrowLeftIcon className="size-5" />
          {t('previous')}
        </Button>
        <div className="flex gap-2">
          {Array.from(Array(paginationData.total_pages)).map((_, index) => (
            <div
              key={index}
              className={`cursor-pointer size-10 rounded-md flex items-center justify-center text-body-medium-s hover:bg-gray-5 ${paginationData.page === index + 1 && '[&&]:bg-light-blue [&]:text-sea-blue'}`}
              onClick={() => switchPage(index + 1)}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <Button className="flex [&]:gap-1.5" ghost disabled={!paginationData.next_page} onClick={nextPageHandler}>
          {t('next')}
          <ArrowRightIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
