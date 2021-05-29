import { HttpService, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, Method as HttpMethod } from 'axios';
import { User } from './models/user.interface';

@Injectable()
export class AuthApiService {
  constructor(private readonly httpClient: HttpService) {
    this._checkSetup();
  }
  async verifyBearerToken(bearer: string): Promise<boolean> {
    try {
      return this.callAuthAPI<boolean>({
        endpoint: '/authorize',
        body: { bearer },
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      throw new Error(`${e.name} : ${e.message}`);
    }
  }
  async getUserFromBearerToken(bearer: string): Promise<User> {
    try {
      return this.callAuthAPI<User>({
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
    this._checkSetup();
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

  private _checkSetup() {
    if (!process.env.AUTH_API_URL || process.env.AUTH_API_URL.trim() === '') {
      throw new Error('Auth API URL is missing. Check platform setup');
    }
  }
}
