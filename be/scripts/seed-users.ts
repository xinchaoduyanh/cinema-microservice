
import { faker } from '@faker-js/faker';

async function seedUsers() {
  const APISIX_GATEWAY_URL = 'http://localhost:9080/auth-service/api/auth/sign-up';
  
  console.log(`Starting to seed 10 users to ${APISIX_GATEWAY_URL}...`);

  for (let i = 0; i < 10; i++) {
    const password = 'Password@123';
    const user = {
      email: faker.internet.email().toLowerCase(),
      password: password,
      fullName: faker.person.fullName(),
      role: faker.helpers.arrayElement(['ADMIN', 'RECEPTIONIST', 'GUEST']),
    };

    try {
      const response = await fetch(APISIX_GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Created User ${i + 1}: ${user.email} / ${user.password}`);
      } else {
        const errorText = await response.text();
        console.error(`❌ Failed to create user ${user.email}: ${response.status} ${response.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error);
    }
  }
  
  console.log('Seeding complete!');
}

seedUsers();
