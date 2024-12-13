import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTransactionDTO } from './dto/createTransaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }


  @UseGuards(AuthGuard)
  @Post()
  createTransaction(@Request() req, @Body() createTransactionDto: CreateTransactionDTO) {
    return this.transactionService.createTransaction(createTransactionDto.amount, req.userId, createTransactionDto.recieverId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findHistoryByUserId(@Request() req) {
    return this.transactionService.findHistoryByUserId(req.userId);
  }
}
