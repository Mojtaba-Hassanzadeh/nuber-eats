import got from 'got/dist/source/core';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import { HttpService } from '@nestjs/axios';
import { from } from 'rxjs';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
    private readonly httpService: HttpService,
  ) {}

  private async sendEmail(
    subject: string,
    // to: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append('from', `Mojtaba from Plaza <mailgun@${this.options.domain}>`);
    form.append('to', `m91.hassanzadeh@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));
    try {
      await this.httpService.axiosRef.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        form,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
