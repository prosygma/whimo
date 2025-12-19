import React, { useEffect, useMemo, useState } from 'react';
import SideDrawer from '../../uikit/SideDrawer.tsx';
import type { TransactionItem, TransactionsResponse } from '../../../api/types/transactionTypes.ts';
import { useTranslation } from 'react-i18next';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchTransactions, requestGeodata } from '../../../api/transactions.ts';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import TransactionDetails from './TransactionDetails.tsx';
import TransactionsHistoryPreview from './TransactionsHistoryPreview.tsx';
import SupplierHistoryItem from './SupplierHistoryItem.tsx';
import Button from '../../uikit/Button.tsx';
import { PAGE_SIZE } from '../../../contanst.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionItem;
  transactionDataDownloadHandler: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

const HISTORY_PREVIEW_PAGE_SIZE = PAGE_SIZE;
const HISTORY_PAGE_SIZE = '20';

const TransactionSidebar: React.FC<Props> = ({ isOpen, onClose, transaction, transactionDataDownloadHandler }) => {
  const { t } = useTranslation(['transactions', 'common']);

  const [drawerDetailsView, setDrawerDetailsView] = useState(true);
  const [showViewAllHistoryButton, setShowViewAllHistoryButton] = useState(false);

  const [historyNestingLevel, setHistoryNestingLevel] = useState(0);
  const [buyer, setBuyer] = useState([transaction.seller?.id]);
  const [commodityGroup, setCommodityGroup] = useState([transaction.commodity.group.id]);

  const [observerRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  const canShowHistory =
    Boolean(isOpen && transaction && transaction.seller?.id && transaction.commodity.group.id) &&
    ['pending', 'accepted'].includes(transaction.status);

  const transactionsParams = useMemo(() => {
    const params = new URLSearchParams();

    if (!canShowHistory) return params;

    if (drawerDetailsView) {
      params.append('page_size', HISTORY_PREVIEW_PAGE_SIZE);
      params.append('commodity_group_id', transaction.commodity.group.id);
      params.append('buyer_id', transaction.seller?.id);
    } else {
      params.append('page_size', HISTORY_PAGE_SIZE);
      params.append('commodity_group_id', commodityGroup[historyNestingLevel]);
      params.append('buyer_id', buyer[historyNestingLevel] ?? '');
    }
    params.append('status', 'accepted');

    return params;
  }, [
    canShowHistory,
    drawerDetailsView,
    transaction.commodity.group.id,
    transaction.seller?.id,
    commodityGroup,
    historyNestingLevel,
    buyer,
  ]);

  const { data: historyPreview, isSuccess: historyPreviewFetched } = useQuery<TransactionsResponse>({
    queryKey: ['supplierHistoryPreview', transaction.seller?.id, transaction.commodity.group.id],
    queryFn: () => fetchTransactions(transactionsParams),
    enabled: canShowHistory,
  });

  const {
    data: supplierHistoryInfinite,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<TransactionsResponse>({
    queryKey: ['supplierHistoryInfinite', buyer[historyNestingLevel], commodityGroup[historyNestingLevel]],
    queryFn: ({ pageParam = 1 }) => {
      const params = new URLSearchParams(transactionsParams);
      params.set('page', String(pageParam));
      return fetchTransactions(params);
    },
    getNextPageParam: (lastPage) => lastPage.pagination.next_page ?? undefined,
    initialPageParam: 1,
    enabled: canShowHistory && !drawerDetailsView,
  });

  const { refetch, isSuccess } = useQuery({
    queryKey: ['refetchMissingLocation', transaction.id],
    queryFn: () => requestGeodata(transaction.id),
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const infiniteQueryList = useMemo(() => {
    return supplierHistoryInfinite?.pages.reduce<TransactionItem[]>((acc, current) => {
      return [...acc, ...current.data];
    }, []);
  }, [supplierHistoryInfinite?.pages]);

  const hasMissingLocations = useMemo(() => {
    if (isSuccess) {
      return false;
    }

    return infiniteQueryList?.some((transaction) => transaction.traceability === 'partial');
  }, [infiniteQueryList, isSuccess]);

  useEffect(() => {
    if (!isOpen) return;

    if (entry?.intersectionRatio === 0) setShowViewAllHistoryButton(true);
  }, [entry, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setDrawerDetailsView(true);
    }
  }, [isOpen]);

  const nestedList = useMemo(() => {
    return buyer.length > 1;
  }, [buyer.length]);

  const backToHistory = () => {
    setHistoryNestingLevel(0);
    setBuyer((prevState) => {
      const firstItem = [...prevState][0];
      return [firstItem];
    });
    setCommodityGroup((prevState) => {
      const firstItem = [...prevState][0];
      return [firstItem];
    });
  };

  const switchToSupplierHistory = () => {
    setDrawerDetailsView(false);
  };

  const onGoBack = () => {
    if (historyNestingLevel > 0) {
      setHistoryNestingLevel(historyNestingLevel - 1);
      setBuyer((prevState) => {
        const stateCopy = [...prevState];
        stateCopy.pop();
        return stateCopy;
      });
      setCommodityGroup((prevState) => {
        const stateCopy = [...prevState];
        stateCopy.pop();
        return stateCopy;
      });
    } else {
      setDrawerDetailsView(true);
    }
  };

  const fallThroughHandler = (buyerId: string, commodityGroupId: string) => {
    if (drawerDetailsView) {
      setDrawerDetailsView(false);
    }
    setHistoryNestingLevel(historyNestingLevel + 1);
    setBuyer((prevState) => [...prevState, buyerId]);
    setCommodityGroup((prevState) => [...prevState, commodityGroupId]);
  };

  const showDownloadIcon =
    drawerDetailsView &&
    transaction.status === 'accepted' &&
    'is_automatic' in transaction &&
    transaction.is_automatic === false;

  return (
    <>
      <SideDrawer isOpen={isOpen} onClose={onClose} {...(!drawerDetailsView && { scrollable: true })}>
        <SideDrawer.SideDrawerHeader
          title={
            drawerDetailsView
              ? t('purchase_transaction')
              : t('supplier_history_title', {
                context: nestedList ? 'with_id' : '',
                trader_id: buyer[buyer.length - 1],
              })
          }
          {...(!drawerDetailsView && { goBack: onGoBack })}
        >
          {showDownloadIcon && (
            <ArrowDownTrayIcon
              className="size-6 cursor-pointer text-gray-50 hover:text-gray-70"
              onClick={transactionDataDownloadHandler}
            />
          )}
          <XMarkIcon className="size-6 cursor-pointer hover:text-gray-70" onClick={onClose} />
        </SideDrawer.SideDrawerHeader>
        {drawerDetailsView ? (
          <>
            <TransactionDetails transaction={transaction} />
            {canShowHistory && historyPreviewFetched && historyPreview && (
              <>
                <TransactionsHistoryPreview
                  supplierHistory={historyPreview}
                  showViewAllHistoryButton={showViewAllHistoryButton}
                  switchToSupplierHistory={switchToSupplierHistory}
                  fallThrough={fallThroughHandler}
                />
                {historyPreviewFetched && <div className="p-0! border-b-0" ref={observerRef} />}
              </>
            )}
          </>
        ) : (
          infiniteQueryList && (
            <>
              {infiniteQueryList.map((historyTransaction) => {
                return (
                  <SupplierHistoryItem
                    key={historyTransaction.id}
                    traceability={historyTransaction.traceability}
                    traderId={historyTransaction.seller?.id}
                    createdAt={historyTransaction.created_at}
                    volume={historyTransaction.volume}
                    unit={historyTransaction.commodity.unit}
                    fallThrough={() =>
                      fallThroughHandler(historyTransaction.seller?.id, historyTransaction.commodity.group.id)
                    }
                  />
                );
              })}
              <div className="flex-1 flex items-start justify-center [&&]:bg-transparent mb-10">
                {hasNextPage ? (
                  <Button className="[&&]:bg-transparent" ghost primary onClick={() => fetchNextPage()}>
                    {t('load_more')}
                  </Button>
                ) : (
                  <p className="text-body-s text-gray-60 text-center">{t('end_of_history')}</p>
                )}
              </div>
              {nestedList ? (
                <Button
                  className="w-min text-nowrap [&&]:p-0 [&&]:mb-6 [&&]:mx-auto [&&]:bg-transparent"
                  ghost
                  primary
                  onClick={backToHistory}
                >
                  {t('back_to_suppliers_history')}
                </Button>
              ) : (
                hasMissingLocations && (
                  <div className="bottom-0 left-0 right-0 [&&]:bg-transparent [&&]:p-0 [&&]:m-6">
                    <Button primary onClick={() => refetch()} className="w-full" disabled={isSuccess}>
                      {t('request_missing_locations')}
                    </Button>
                  </div>
                )
              )}
            </>
          )
        )}
      </SideDrawer>
    </>
  );
};

export default TransactionSidebar;
