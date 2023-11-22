import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async validateUser(payload: any): Promise<any> {
    // Logic to validate the user (e.g., query the database)
    // This method should return the user if it exists, or null if not
    // You might want to check the user's ID in the payload against your database
    // and return the corresponding user if found.
    return { userId: payload.sub, username: payload.username };
  }
}
