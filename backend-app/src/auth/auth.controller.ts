import {
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PayloadDto } from './dto/payload.dto';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async signIn(@Body() payloadDto: PayloadDto) {
    const isValid = this.authService.isValid(payloadDto);

    if (!isValid) {
      throw new UnauthorizedException('Signature is not valid');
    }

    return this.authService.sigIn(payloadDto.address);
  }
}
