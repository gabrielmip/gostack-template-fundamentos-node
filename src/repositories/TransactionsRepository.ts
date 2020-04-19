import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const signalByType = {
  income: 1,
  outcome: -1,
};

const increaseTypeAmount = (
  balance: Balance,
  transaction: Transaction,
): number => balance[transaction.type] + transaction.value;

const increaseTotal = (balance: Balance, transaction: Transaction): number =>
  balance.total + signalByType[transaction.type] * transaction.value;

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const initialBalance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    return this.transactions.reduce(
      (balance: Balance, transaction): Balance => ({
        ...balance,
        total: increaseTotal(balance, transaction),
        [transaction.type]: increaseTypeAmount(balance, transaction),
      }),
      initialBalance,
    );
  }

  public create({ title, type, value }: TransactionDTO): Transaction {
    const createdTransaction = new Transaction({ title, type, value });
    this.transactions.push(createdTransaction);

    return createdTransaction;
  }
}

export default TransactionsRepository;
