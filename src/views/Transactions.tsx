import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader/PageHeader.tsx';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../components/Transactions/TransactionsTable.tsx';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../api/transactions.ts';
import { useSearchParams } from 'react-router';
import type { TransactionItem, TransactionsResponse } from '../api/types/transactionTypes.ts';
import RangePicker from '../components/Transactions/RangePicker.tsx';
import type { DateRange } from 'react-day-picker';
import {
  ArrowDownCircleIcon,
  ArrowDownTrayIcon,
  ArrowUpCircleIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { PAGE_SIZE } from '../contanst.ts';
import Button from '../components/uikit/Button.tsx';
import DownloadAllModal from '../components/Transactions/Modals/DownloadAllModal.tsx';

type Action = TransactionItem['action'];

const Transactions: React.FC = () => {
  const { t } = useTranslation(['transactions', 'common']);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [transactionActionTab, setTransactionActionTab] = useState<Action | null>(null);
  const [downloadAllModalOpen, setDownloadAllModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const {
    data: transactionsData,
    isFetching,
    isSuccess,
    isError,
  } = useQuery<TransactionsResponse>({
    queryKey: ['transactions', searchParams.toString()],
    queryFn: () => fetchTransactions(searchParams),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const params: Record<string, string> = { page_size: PAGE_SIZE, page: page.toString() };

    if (dateRange?.from && dateRange?.to) {
      params.created_at_from = dateRange.from.toISOString();
      params.created_at_to = dateRange.to.toISOString();
    } else {
      delete params.created_at_from;
      delete params.created_at_to;
    }

    if (transactionActionTab) {
      params.action = transactionActionTab;
    } else {
      delete params.action;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    } else {
      delete params.search;
    }

    setSearchParams(params);
  }, [setSearchParams, page, dateRange, transactionActionTab, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [dateRange, transactionActionTab, debouncedSearch]);

  const pageSwitchHandler = (page: number) => {
    setPage(page);
  };

  const entriesCount = transactionsData?.pagination?.count || 0;

  return (
    <>
      <PageHeader title={t('transactions_page_header')}>
        <RangePicker dateRange={dateRange} setDateRange={setDateRange} />
        <Button className="capitalize" Icon={ArrowDownTrayIcon} primary onClick={() => setDownloadAllModalOpen(true)}>
          {t('download_all')}
        </Button>
      </PageHeader>
      <div className="flex px-10 border-b-2 border-gray-5">
        <div className="flex-1 flex gap-10">
          <button
            className={`flex gap-1 items-center text-center text-body-medium-m border-b-2 ${!transactionActionTab ? 'text-sea-blue border-sea-blue' : 'text-gray-50 border-transparent'}`}
            onClick={() => setTransactionActionTab(null)}
          >
            <Squares2X2Icon className="size-6" />
            {t('action_tab_all')}
          </button>
          <button
            className={`flex gap-1 items-center text-center text-body-medium-m border-b-2 ${transactionActionTab === 'buying' ? 'text-sea-blue  border-sea-blue' : 'text-gray-50 border-transparent'}`}
            onClick={() => setTransactionActionTab('buying')}
          >
            <ArrowDownCircleIcon className="size-6" />
            {t('action_tab_buying')}
          </button>
          <button
            className={`flex gap-1 items-center text-center text-body-medium-m border-b-2 ${transactionActionTab === 'selling' ? 'text-sea-blue border-sea-blue' : 'text-gray-50 border-transparent'}`}
            onClick={() => setTransactionActionTab('selling')}
          >
            <ArrowUpCircleIcon className="size-6" />
            {t('action_tab_selling')}
          </button>
        </div>
        <div className="flex items-center px-4 py-4.5 gap-1.5 border-l-2 border-gray-5">
          <MagnifyingGlassIcon className="size-5 text-gray-50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transaction"
            className="placeholder:text-gray-40 outline-none"
          />
        </div>
      </div>
      <TransactionsTable
        transactionsList={transactionsData?.data}
        pagination={transactionsData?.pagination}
        pageSwitchHandler={pageSwitchHandler}
        isFetching={isFetching}
        isSuccess={isSuccess}
        isError={isError}
      />
      <DownloadAllModal
        isOpen={downloadAllModalOpen}
        onClose={() => setDownloadAllModalOpen(false)}
        params={searchParams}
        count={entriesCount}
      />
    </>
  );
};

export default Transactions;
