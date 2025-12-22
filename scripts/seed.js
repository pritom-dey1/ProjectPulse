import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Project from '../models/Project.js'
import dotenv from 'dotenv'

dotenv.config()

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)

  await User.deleteMany()
  await Project.deleteMany()

  const adminPassword = await bcrypt.hash('admin123', 10)
  const employeePassword = await bcrypt.hash('employee123', 10)
  const clientPassword = await bcrypt.hash('client123', 10)

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@projectpulse.com',
    password: adminPassword,
    role: 'ADMIN'
  })

  const employee = await User.create({
    name: 'Employee User',
    email: 'employee@projectpulse.com',
    password: employeePassword,
    role: 'EMPLOYEE'
  })

  const client = await User.create({
    name: 'Client User',
    email: 'client@projectpulse.com',
    password: clientPassword,
    role: 'CLIENT'
  })

  await Project.create({
    name: 'Project Pulse Demo',
    description: 'Internal project health tracking system',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    status: 'ON_TRACK',
    healthScore: 100,
    clientId: client._id,
    employeeIds: [employee._id]
  })

  console.log('Seed completed')
  process.exit()
}

seed()
