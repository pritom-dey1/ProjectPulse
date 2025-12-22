import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import User from '../models/User.js';
import Project from '../models/Project.js';
import Risk from '../models/Risk.js';
import CheckIn from '../models/CheckIn.js';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear existing data
  await User.deleteMany();
  await Project.deleteMany();
  await Risk.deleteMany();
  await CheckIn.deleteMany();

  // Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const employeePassword = await bcrypt.hash('employee123', 10);
  const clientPassword = await bcrypt.hash('client123', 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@projectpulse.com',
    password: adminPassword,
    role: 'ADMIN'
  });

  const employee = await User.create({
    name: 'Employee User',
    email: 'employee@projectpulse.com',
    password: employeePassword,
    role: 'EMPLOYEE'
  });

  const client = await User.create({
    name: 'Client User',
    email: 'client@projectpulse.com',
    password: clientPassword,
    role: 'CLIENT'
  });

  // Dummy projects
  const projects = [];
  for (let i = 1; i <= 3; i++) {
    const project = await Project.create({
      name: `Demo Project ${i}`,
      description: `This is demo project number ${i}`,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      status: ['ON_TRACK', 'AT_RISK', 'CRITICAL'][Math.floor(Math.random() * 3)],
      healthScore: 100,
      clientId: client._id,
      employeeIds: [employee._id]
    });
    projects.push(project);

    // Add some risks
    const numRisks = Math.floor(Math.random() * 3); // 0-2 risks
    for (let r = 1; r <= numRisks; r++) {
      await Risk.create({
        projectId: project._id,
        title: `Risk ${r} for Project ${i}`,
        severity: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
        status: ['OPEN', 'RESOLVED'][Math.floor(Math.random() * 2)],
        mitigationPlan: `Mitigation plan for risk ${r}`
      });
    }

    // Add some check-ins
    const numCheckIns = Math.floor(Math.random() * 4) + 1; // 1-4 check-ins
    for (let c = 1; c <= numCheckIns; c++) {
      // Employee check-in
      await CheckIn.create({
        projectId: project._id,
        employeeId: employee._id,
        progressSummary: `Week ${c} progress for Project ${i}`,
        confidenceLevel: Math.floor(Math.random() * 5) + 1, // 1-5
        date: new Date(new Date().setDate(new Date().getDate() - c * 7))
      });

      // Client feedback
      await CheckIn.create({
        projectId: project._id,
        clientId: client._id,
        feedbackSummary: `Week ${c} feedback for Project ${i}`,
        satisfaction: Math.floor(Math.random() * 5) + 1, // 1-5
        date: new Date(new Date().setDate(new Date().getDate() - c * 7))
      });
    }
  }

  console.log('Seed completed with projects, risks, and check-ins');
  process.exit();
}

seed();
