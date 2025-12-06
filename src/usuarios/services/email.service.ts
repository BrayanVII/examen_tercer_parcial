import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private config: ConfigService) {
    // Se mantiene para que no falle la inyección del servicio
    this.transporter = nodemailer.createTransport({
      service: this.config.get<string>('SERVICIO'),
      auth: {
        user: this.config.get<string>('EMAIL_USUARIO'),
        pass: this.config.get<string>('EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
}
