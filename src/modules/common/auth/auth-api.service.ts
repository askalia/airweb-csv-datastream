import { HttpService, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, Method as HttpMethod } from 'axios';
import { User } from './models/user.interface';

@Injectable()
export class AuthApiService {
  constructor(private readonly httpClient: HttpService) {}
  async verifyBearerToken(bearer: string): Promise<boolean> {
    try {
      return this._validateSetup() === false
        ? true
        : this.callAuthAPI<boolean>({
            endpoint: process.env.AUTH_API_BEARER_CHECK_URL,
            body: { bearer },
            headers: { 'Content-Type': 'application/json' },
          });
    } catch (e) {
      throw new Error(`${e.name} : ${e.message}`);
    }
  }
  async getUserFromBearerToken(bearer: string): Promise<User> {
    try {
      return !this._validateSetup()
        ? null
        : this.callAuthAPI<User>({
            endpoint: '/user',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${bearer}`,
            },
          });
    } catch (e) {
      throw new Error(`${e.name} : ${e.message}`);
    }
  }

  async callAuthAPI<T>(options: {
    endpoint: string;
    headers: AxiosRequestConfig['headers'];
    body?: AxiosRequestConfig['data'];
    method?: HttpMethod;
  }): Promise<T> {
    return this.httpClient
      .request<T>({
        method: options?.method || 'POST',
        url: `${process.env.AUTH_API_URL}${options.endpoint}`,
        data: options?.body ? JSON.stringify(options.body) : undefined,
        headers: options?.headers,
      })
      .toPromise()
      .then(({ data }) => data);
  }

  private _validateSetup() {
    return (
      (process.env?.AUTH_API_URL || '').trim() !== '' &&
      (process.env?.AUTH_API_BEARER_CHECK_URL).trim() !== ''
    );
  }
}
