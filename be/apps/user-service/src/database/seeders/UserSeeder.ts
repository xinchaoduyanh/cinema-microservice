import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../../data-access/user/user.entity';
import { hashData, Role } from '@app/common';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const existingUser = await em.findOne(User, { email: 'admin@cinema.com' });
    if (existingUser) return;

    const hashedPassword = await hashData('Admin@123');

    const admin = em.create(User, {
      email: 'admin@cinema.com',
      password: hashedPassword,
      fullName: 'System Admin',
      isActive: true,
      emailVerified: true,
      role: Role.ADMIN,
      phoneNumber: '0123456789'
    });
    
    // Create a regular user for testing
    const userPass = await hashData('User@123');
    const user = em.create(User, {
      email: 'user@cinema.com',
      password: userPass,
      fullName: 'Regular User',
      isActive: true,
      emailVerified: true,
      role: Role.GUEST,
      phoneNumber: '0987654321'
    });

    await em.flush();
  }
}
