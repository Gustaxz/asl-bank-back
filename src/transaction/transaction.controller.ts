import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionDTO } from './dto/createTransaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }


  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDTO) {
    return this.transactionService.createTransaction(createTransactionDto.amount, createTransactionDto.senderId, createTransactionDto.recieverId);
  }

  @Get(':userId')
  findHistoryByUserId(@Param("userId") userId: string) {
    return this.transactionService.findHistoryByUserId(userId);
  }
}
