import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SendOtpDto } from './dto/otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Get('')
  async getOTP(): Promise<string> {
    return this.otpService.getOTP();
  }

  @Post('send')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendOTP(@Body() data: SendOtpDto): Promise<void> {
    return await this.otpService.generateAndSendOTP(data);
  }
}
