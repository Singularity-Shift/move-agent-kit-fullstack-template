import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validateSignature } from 'helpers';
import { PayloadDto } from './dto/payload.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  isValid(payload: PayloadDto): boolean {
    return validateSignature(payload);
  }

  async sigIn(address: string): Promise<LoginDto> {
    const authToken = await this.jwtService.signAsync({
      address,
    });

    return {
      authToken,
    };
  }
}
