import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { User } from './models/user.interface';

@Injectable()
export class AuthApiService {
  constructor() {
    this._checkSetup();
  }
  async verifyBearerToken(bearer: string): Promise<boolean> {
    try {
      return this.callAuthAPI({
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
      return this.callAuthAPI({
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

  async callAuthAPI(options: {
    endpoint: string;
    headers: Record<string, string>;
    body?: Record<string, any>;
  }) {
    this._checkSetup();
    return (
      await fetch(`${process.env.AUTH_API_URL}${options.endpoint}`, {
        method: 'post',
        body: JSON.stringify(options.body),
        ...options.headers,
      })
    ).json();
  }

  private _checkSetup() {
    if (!process.env.AUTH_API_URL || process.env.AUTH_API_URL.trim() === '') {
      throw new Error('Auth API URL is missing. Check platform setup');
    }
  }
}
