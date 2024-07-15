import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/orders.dto';
import { Orders } from './entity/orders.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('')
  async getOrder(): Promise<string> {
    return this.ordersService.getOrder();
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrder(@Body() data: CreateOrderDto): Promise<Orders> {
    return this.ordersService.createOrder(data);
  }
}
