import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, JwtService],
  imports: [UserModule, PassportModule, AuthModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    // signOptions: { expiresIn: '60s' },
  }),],
})
export class TransactionModule { }
