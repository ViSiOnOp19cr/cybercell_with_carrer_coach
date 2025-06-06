import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { activityId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { isCompleted, pointsEarned } = body;

    if (typeof isCompleted !== "boolean" || typeof pointsEarned !== "number") {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get activity
    const activity = await db.activity.findUnique({
      where: { id: parseInt(params.activityId) },
      include: {
        level: true,
      },
    });

    if (!activity) {
      return new NextResponse("Activity not found", { status: 404 });
    }

    // Update or create activity progress
    const activityProgress = await db.activityProgress.upsert({
      where: {
        userId_activityId: {
          userId: user.id,
          activityId: activity.id,
        },
      },
      update: {
        isCompleted,
        pointsEarned,
        attempts: {
          increment: 1,
        },
      },
      create: {
        userId: user.id,
        activityId: activity.id,
        isCompleted,
        pointsEarned,
        attempts: 1,
      },
    });

    // Get level progress
    const levelProgress = await db.userProgress.findUnique({
      where: {
        userId_levelId: {
          userId: user.id,
          levelId: activity.levelId,
        },
      },
    });

    // Update level progress
    if (levelProgress) {
      await db.userProgress.update({
        where: {
          userId_levelId: {
            userId: user.id,
            levelId: activity.levelId,
          },
        },
        data: {
          pointsEarned: levelProgress.pointsEarned + pointsEarned,
          activitiesCompleted: isCompleted
            ? levelProgress.activitiesCompleted + 1
            : levelProgress.activitiesCompleted,
          isCompleted:
            levelProgress.pointsEarned + pointsEarned >=
            activity.level.minPointsToPass,
        },
      });
    } else {
      await db.userProgress.create({
        data: {
          userId: user.id,
          levelId: activity.levelId,
          pointsEarned,
          activitiesCompleted: isCompleted ? 1 : 0,
          isCompleted: pointsEarned >= activity.level.minPointsToPass,
        },
      });
    }

    return NextResponse.json(activityProgress);
  } catch (error) {
    console.error("[ACTIVITY_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
