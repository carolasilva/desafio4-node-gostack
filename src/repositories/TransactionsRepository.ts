import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface GetAllTransactionsDTO {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): GetAllTransactionsDTO {
    const response = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };
    return response;
  }

  private isIncome = (transaction: Transaction): boolean =>
    transaction.type === 'income';

  private isOutcome = (transaction: Transaction): boolean =>
    transaction.type === 'outcome';

  private sum = (a: number, b: number): number => a + b;

  public getBalance(): Balance {
    let income = 0;
    let outcome = 0;

    if (this.transactions.length > 0) {
      const incomeTransactions = this.transactions.filter(this.isIncome);
      const incomeTransactionsValues = incomeTransactions.map(
        transaction => transaction.value,
      );
      income = incomeTransactionsValues.reduce(this.sum, 0);

      const outcomeTransactions = this.transactions.filter(this.isOutcome);
      const outcomeTransactionsValues = outcomeTransactions.map(
        transaction => transaction.value,
      );
      outcome = outcomeTransactionsValues.reduce(this.sum, 0);
    }

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public isOutcomeAmmountValid(ammount: number): boolean {
    const { total } = this.getBalance();

    return ammount <= total;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
