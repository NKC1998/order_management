import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleError } from 'src/utils/error-handler.util';
import { Repository } from 'typeorm';
import { OtpService } from '../otp/otp.service';
import { CreateOrderDto } from './dto/orders.dto';
import { Order } from './entity/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private otpService: OtpService,
  ) {}

  async getOrder(): Promise<any> {
    return await this.ordersRepository.find();
  }

  async createOrder(data: CreateOrderDto): Promise<any> {
    try {
      const { email, otp, ...orderData } = data;
      const isValidOTP = await this.otpService.validateOTP(email, otp);
      if (!isValidOTP) {
        throw new Error('Invalid OTP');
      }
      await this.otpService.deleteOTP(email);
      const totalPrice = orderData.unitPrice * orderData.quantity;
      const order = this.ordersRepository.create({
        ...orderData,
        email,
        totalPrice,
      });
      await this.ordersRepository.save(order);
      return {
        code: 201,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      handleError(error); // Use handleError to handle any errors
    }
  }
}
