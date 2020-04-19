import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();
const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, type, value } = request.body;
    const creationService = new CreateTransactionService(
      transactionsRepository,
    );

    let created;
    try {
      created = creationService.execute({ title, type, value });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }

    return response.json(created);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
