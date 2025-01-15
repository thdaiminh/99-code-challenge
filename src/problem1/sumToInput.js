// Approach 1: Using a for loop
function sum_to_n_loop(n) {
  let sum = 0;
  if (n > 0) {
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
  } else {
    for (let i = n; i <= -1; i++) {
      sum += i;
    }
  }
  return sum;
}

// Approach 2: Using recursion
function sum_to_n_recursive(n) {
  if (n === 0) return 0;
  if (n < 0) {
    return n + sum_to_n_recursive(n + 1);
  }
  return n + sum_to_n_recursive(n - 1);
}

// Approach 3: Using array methods
function sum_to_n_array_methods(n) {
  if (n < 0) {
    return -Array(Math.abs(n)).fill(1)
        .map((_, i) => i + 1)
        .reduce((a, b) => a + b, 0);
  }
  return Array(n).fill(1)
      .map((_, i) => i + 1)
      .reduce((a, b) => a + b, 0);
}