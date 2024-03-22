import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import {join} from 'path';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async(config: ConfigService) => ({
        transport: {
          host: config.get("MAIL_HOST"),
          secure: false,
          auth: {
            user: config.get("MAIL_USER"),
            pass: config.get("MAIL_PASS")
          }
        },
        defaults: {
          from: `"No Reply" <${config.get("MAIL_FROM")}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    })
  ],
})
export class MailModule{}

