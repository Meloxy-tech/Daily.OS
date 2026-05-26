import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@dailyos.app" },
    update: {},
    create: {
      email: "demo@dailyos.app",
      name: "Demo User",
      avatar: "🚀",
    },
  });

  await prisma.note.createMany({
    data: [
      {
        userId: user.id,
        title: "Welcome to DailyOS",
        content: "## Getting started\n\nCustomize your dashboard and start a pomodoro!",
        folder: "Inbox",
        tags: ["welcome"],
        color: "#22d3ee",
        isPinned: true,
      },
      {
        userId: user.id,
        title: "Weekly goals",
        content: "- Ship features\n- Exercise 3x\n- Read daily",
        folder: "Goals",
        tags: ["goals"],
        color: "#a78bfa",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.task.createMany({
    data: [
      { userId: user.id, title: "Explore dashboard", status: "DONE", priority: "HIGH" },
      { userId: user.id, title: "Set up Supabase", status: "TODO", priority: "MEDIUM" },
    ],
    skipDuplicates: true,
  });

  await prisma.habit.create({
    data: {
      userId: user.id,
      name: "Morning routine",
      icon: "☀️",
      streak: 7,
      bestStreak: 14,
      xp: 200,
    },
  });

  console.log("Seed complete:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
