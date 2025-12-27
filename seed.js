// seed.js
import mongoose from 'mongoose';
import { connectDB } from './lib/db.js';
import User from './models/User.js';
import Project from './models/Project.js';
import EmployeeCheckIn from './models/EmployeeCheckIn.js';
import Risk from './models/Risk.js';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await Project.deleteMany({});
  await EmployeeCheckIn.deleteMany({});
  await Risk.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@projectpulse.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'ADMIN'
  });

  const employee = await User.create({
    name: 'John Employee',
    email: 'employee@projectpulse.com',
    password: await bcrypt.hash('employee123', 10),
    role: 'EMPLOYEE'
  });

  const client = await User.create({
    name: 'Jane Client',
    email: 'client@projectpulse.com',
    password: await bcrypt.hash('client123', 10),
    role: 'CLIENT'
  });

  const project = await Project.create({
    name: 'E-commerce Platform Development',
    description: 'Building a full-stack online shopping platform',
    startDate: new Date('2025-11-01'),
    endDate: new Date('2026-03-01'),
    client: client._id,
    employees: [employee._id],
    healthScore: 85,
    status: 'ON_TRACK'
  });

  await EmployeeCheckIn.create({
    project: project._id,
    employee: employee._id,
    progressSummary: 'Completed user authentication module',
    blockers: 'Waiting for design approval',
    confidence: 4,
    completion: 45,
    createdAt: new Date('2025-12-20')
  });

  await Risk.create({
    project: project._id,
    reportedBy: employee._id,
    title: 'Third-party API rate limiting',
    severity: 'High',
    mitigationPlan: 'Implement caching and fallback mechanism',
    status: 'Open'
  });

  console.log('Seed data inserted successfully!');
  console.log('Login credentials:');
  console.log('Admin: admin@projectpulse.com / admin123');
  console.log('Employee: employee@projectpulse.com / employee123');
  console.log('Client: client@projectpulse.com / client123');

  mongoose.connection.close();
}

seed().catch(err => {
  console.error('Seed error:', err);
  mongoose.connection.close();
});