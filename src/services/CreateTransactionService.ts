import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import InsufficientBalance from '../exceptions/InsufficientBalance';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute(transaction: TransactionDTO): Transaction {
    const [allows, futureBalance] = this.doesBalanceAllow(transaction);

    if (!allows) {
      throw new InsufficientBalance(
        `Insufficient balance. Future balance would be ${futureBalance}`,
      );
    }

    return this.transactionsRepository.create(transaction);
  }

  private doesBalanceAllow({ type, value }: TransactionDTO): [boolean, number] {
    const balance = this.transactionsRepository.getBalance();
    const aggregationSign = type === 'income' ? 1 : -1;
    const futureBalance = balance.total + aggregationSign * value;

    if (type === 'income') {
      return [true, futureBalance];
    }

    return [futureBalance >= 0, futureBalance];
  }
}

export default CreateTransactionService;
