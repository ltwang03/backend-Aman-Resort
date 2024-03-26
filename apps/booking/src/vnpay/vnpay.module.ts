import { DynamicModule, Module } from '@nestjs/common';
import { VNPay, VNPayConfig } from 'vnpay';

@Module({})
export class VNpayModule {
  static forRoot(options: VNPayConfig): DynamicModule {
    const vnpayProvider = {
      provide: VNPay,
      useValue: new VNPay(options),
    };
    return {
      module: VNpayModule,
      providers: [vnpayProvider],
      exports: [vnpayProvider],
    };
  }
}
