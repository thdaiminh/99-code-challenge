# WalletPage Component Review

## Issues

### 1. Type Safety Issues
- `FormattedWalletBalance` is having the same interface with  `WalletBalance` interface and 1 addition property
- `getPriority` function is having `any` type for the parameter
- `lhsPriority` is used in the filter but isn't defined


### 2. Logic Problems
```typescript
balances.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  if (lhsPriority > -99) {
    if (balance.amount <= 0) {
      return true;
    }
  }
  return false;
})
```
Issues:
- Using undefined `lhsPriority` variable
- Func returns true for zero/negative balances only
- Simplified if condition for better reading

### 3. Sort Function Issues
```typescript
sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
})
```
Issues:
- Missing return value when priorities are equal
- Simplified if/else condition

### 4. Performance Issues
- useMemo dependency includes unused 'prices'
- Double array loop on sortedBalances
- Inefficient key usage in list rendering

## Fixed Implementation

### 1. Proper Interface Declare
```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}
```

### 2. Type-Safe for getPriority func
```typescript
const getPriority = (blockchain: string): number => {
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
};
```

### 3. Improved Filter and Sort Logic
```typescript
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    return balancePriority > -99 && balance.amount > 0;
  }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    return rightPriority - leftPriority;
  });
}, [balances]);
```

### 4. Optimized Rendering
```typescript
const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
const usdValue = prices[balance.currency] ? prices[balance.currency] * balance.amount : 0;
  return (
      <WalletRow
          className={classes.row}
          key={`${balance.currency}-${balance.blockchain}`}
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
```