interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance { // Add extends
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => { // Covert any type to string type
    switch (blockchain) {
      case 'Osmosis':
        return 100
      case 'Ethereum':
        return 50
      case 'Arbitrum':
        return 30
      case 'Zilliqa':
        return 20
      case 'Neo':
        return 20
      default:
        return -99
    }
  }

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > -99 && balance.amount > 0;
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority;
    });
  }, [balances]);  // Removed prices from dependency array since it's not used

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map((balance: WalletBalance) => { // Declare type for FormattedBalances
    return {
      ...balance,
      formatted: balance.amount.toFixed(6) //Added precision for crypto amounts
    }
  })

  // Render rows based on formatted balances
  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] ? prices[balance.currency] * balance.amount : 0;
    return (
        <WalletRow
            className={classes.row}
            key={`${balance.currency}-${balance.blockchain}`} // Use a unique key based on currency and blockchain
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
        />
    );
  });

  return (
      <div {...rest}>
        {rows}
      </div>
  );
};

export default WalletPage;