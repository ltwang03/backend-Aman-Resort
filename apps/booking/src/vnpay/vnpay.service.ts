import { Injectable } from '@nestjs/common';
import {
  BuildPaymentUrl,
  ReturnQueryFromVNPay,
  VerifyIpnCall,
  VNPay,
} from 'vnpay';
import * as moment from 'moment';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
dotenv.config();
@Injectable()
export class VnpayService {
  constructor(private readonly vnpay: VNPay) {}

  async CreatePaymentUrl(
    params: BuildPaymentUrl,
    bookingId: any,
  ): Promise<any> {
    const { vnp_Amount, vnp_OrderInfo } = params;
    const date = new Date();
    const urlString = this.vnpay.buildPaymentUrl({
      vnp_Amount,
      vnp_IpAddr: '1.1.1.1',
      vnp_TxnRef: moment(date).format('HHmmss'),
      vnp_OrderInfo: `TEST-${bookingId}-${vnp_OrderInfo}`,
      vnp_OrderType: `other`,
      vnp_ReturnUrl: `${process.env.FE_ENDPOINT}/payment/success`,
    });
    return urlString;
  }
  async verifyIPN(params: ReturnQueryFromVNPay): Promise<any> {
    return this.vnpay.verifyIpnCall(params);
  }
}
