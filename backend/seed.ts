// backend/src/seed.ts
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import User from './models/User';

// Extended location data for more variety
const LOCATIONS = [
  'New York, USA', 
  'London, UK',
  'Tokyo, Japan',
  'Sydney, Australia',
  'Berlin, Germany',
  'Paris, France',
  'Toronto, Canada',
  'Singapore',
  'Dubai, UAE',
  'Mumbai, India'
];

// Profile photo placeholders
const PROFILE_PHOTOS = [
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/women/1.jpg',
  // Add more as needed
];

export const seedUsers = async () => {
  // First seed admin if not exists
  await seedAdmin();

  // Check if users already exist
  const userCount = await User.countDocuments();
  if (userCount > 10) {
    console.log('Users already seeded');
    return;
  }

  console.log('Seeding 150 mock users...');

  const users = [];

  // Create 10 admins
  for (let i = 0; i < 10; i++) {
    users.push({
      name: `Admin ${i+1}`,
      email: `admin${i+1}@example.com`,
      password: await bcrypt.hash(`admin${i+1}123`, 10),
      role: 'ADMIN',
      status: Math.random() > 0.2 ? 'ACTIVE' : 'INACTIVE',
      location: faker.helpers.arrayElement(LOCATIONS),
      profilePhoto: PROFILE_PHOTOS[i % PROFILE_PHOTOS.length],
      joined: faker.date.past({ years: 2 }) // Updated API usage
    });
  }

  // Create 140 regular users
  for (let i = 0; i < 140; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    users.push({
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }),
      password: await bcrypt.hash(faker.internet.password(), 10),
      role: 'USER',
      status: Math.random() > 0.3 ? 'ACTIVE' : 'INACTIVE',
      location: faker.helpers.arrayElement(LOCATIONS),
      profilePhoto: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${i % 50}.jpg`,
      joined: faker.date.past({ years: 2 }) // Updated API usage
    });
  }

  // Insert all users in batches
  const batchSize = 25;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    await User.insertMany(batch);
    console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(users.length / batchSize)}`);
  }

  console.log('Successfully seeded 150 users');
};

export const seedAdmin = async () => {
  const adminExists = await User.findOne({ email: 'admin@example.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      status: 'ACTIVE',
      location: 'Headquarters',
      profilePhoto: 'https://randomuser.me/api/portraits/men/75.jpg',
      joined: new Date()
    });
    console.log('Admin user created');
  }
};