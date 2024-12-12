export class CreateTransactionDTO {
    amount: number;
    senderId: string;
    recieverId?: string;
}