import React from 'react';
import type { BalanceGroupCommodityItem } from '../../api/types/balanceTypes.ts';

interface Props {
  commodity: BalanceGroupCommodityItem;
}

const BalanceTableRow: React.FC<Props> = ({ commodity }) => {
  return (
    <tr>
      <td>{commodity.code}</td>
      <td>{commodity.name}</td>
      <td>{commodity.balance ? `${commodity.balance} ${commodity.unit}` : 'N/A'}</td>
    </tr>
  );
};

export default BalanceTableRow;
