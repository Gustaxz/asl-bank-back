import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { HistoryType } from './enums/historyType';

@Injectable()
export class TransactionService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async createTransaction(amount: number, senderId: string, recieverId?: string) {
        try {
            const [newHistory, userWithNewBalance] = await this.prismaService.$transaction([
                this.prismaService.history.create({
                    data: {
                        amount,
                        type: HistoryType.WITHDRAW,
                        userId: senderId,
                    }
                }),
                this.prismaService.user.update({
                    where: {
                        id: senderId,
                    },
                    data: {
                        balance: {
                            decrement: amount,
                        },
                    },
                }),
            ]);


            return {
                message: 'Transaction created successfully',
                statusCode: 201,
                history: newHistory,
                user: userWithNewBalance,
            }
        } catch (error) {
            console.log(error);
            return {
                message: 'Error creating transaction',
                statusCode: 500,
            };
        }
    }


    async findHistoryByUserId(userId: string) {
        try {
            const history = await this.prismaService.history.findMany({
                where: {
                    userId,
                },
            });

            return {
                message: 'History fetched successfully',
                statusCode: 200,
                history: history,
            }
        } catch (error) {
            console.log(error);
            return {
                message: 'Error fetching history',
                statusCode: 500,
            };
        }
    }
}
