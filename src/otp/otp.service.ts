import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as Mailgun from 'mailgun-js';
import { handleError } from 'src/utils/error-handler.util';
import { Repository } from 'typeorm';
import { SendOtpDto } from './dto/otp.dto';
import { OTP } from './entity/otp.entity';

@Injectable()
export class OtpService {
  private mailgun: Mailgun.Mailgun;

  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    private configService: ConfigService,
  ) {
    this.mailgun = Mailgun({
      apiKey: this.configService.get<string>('MAILGUN_API_KEY'),
      domain: this.configService.get<string>('MAILGUN_DOMAIN'),
    });
  }

  async getOTP(): Promise<any> {
    return await this.otpRepository.find();
  }

  async generateAndSendOTP(dataRequest: SendOtpDto): Promise<any> {
    try {
      const { email } = dataRequest;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const data = {
        from: 'nguyen.khac.cong.19988@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      };

      await this.mailgun
        .messages()
        .send(data)
        .catch((error) => {
          throw new Error('Error sending OTP');
        });
      let existingOTP = await this.otpRepository.findOne({ where: { email } });

      if (!existingOTP) {
        existingOTP = this.otpRepository.create({ email, otp });
      } else {
        existingOTP.otp = otp;
        existingOTP.createdAt = new Date();
      }
      await this.otpRepository.save(existingOTP);
      return {
        code: 201,
        message: 'OTP sent successfully, please check your email',
      };
    } catch (error) {
      handleError(error); // Use handleError to handle any errors
    }
  }

  async validateOTP(email: string, otp: string): Promise<boolean> {
    const otpEntity = await this.otpRepository.findOne({
      where: { email, otp },
    });
    if (!otpEntity) {
      return false;
    }

    const otpAge =
      (new Date().getTime() - new Date(otpEntity.createdAt).getTime()) /
      1000 /
      60;
    if (otpAge > 10) {
      // OTP hết hạn sau 10 phút
      return false;
    }
    return true;
  }

  async deleteOTP(email: string): Promise<any> {
    await this.otpRepository.delete({ email });
    return {
      code: 200,
      message: 'OTP deleted successfully',
    };
  }
}
