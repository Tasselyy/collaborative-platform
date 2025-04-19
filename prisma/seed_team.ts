// prisma/seed.ts
import { PrismaClient, TeamRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting seed...');

    // Clean up existing data (optional - be careful in production!)
    await prisma.teamMember.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({});

    // Create users
    const user1 = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password_here', // In production, use a proper hashing function
        image: '/avatars/john.jpg'
        
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'hashed_password_here',
        image: '/avatars/jane.jpg'
      },
    });

    const user3 = await prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'hashed_password_here'
      },
    });

    console.log('Users created:', { user1, user2, user3 });

    // Create a team
    const team = await prisma.team.create({
      data: {
        name: 'Acme Inc',
        description: 'Main team for Acme Inc for data analysis and visualization',
      },
    });

    console.log('Team created:', team);

    // Add users to team with different roles
    const member1 = await prisma.teamMember.create({
      data: {
        team: { connect: { id: team.id } },
        user: { connect: { id: user1.id } },
        role: TeamRole.OWNER,
      },
    });

    const member2 = await prisma.teamMember.create({
      data: {
        team: { connect: { id: team.id } },
        user: { connect: { id: user2.id } },
        role: TeamRole.MEMBER,
      },
    });

    const member3 = await prisma.teamMember.create({
      data: {
        team: { connect: { id: team.id } },
        user: { connect: { id: user3.id } },
        role: TeamRole.MEMBER,
      },
    });

    console.log('Team members created:', { member1, member2, member3 });

    console.log('Seed completed successfully!');
    console.log(`Team ID for testing: ${team.id}`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });