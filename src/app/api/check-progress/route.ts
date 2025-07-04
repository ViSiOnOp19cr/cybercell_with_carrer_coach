import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Get the user with all progress data
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        progress: {
          include: {
            level: true,
            activityProgress: {
              include: {
                activity: true
              }
            }
          }
        }
      }
    });
    
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    
    const fixedIssues: any[] = [];
    let levelProgressUpdated = false;
    
    // Process each level
    for (const progress of user.progress) {
      let levelPoints = 0;
      let completedActivities = 0;
      
      // Calculate points earned from activities in this level
      for (const activityProgress of progress.activityProgress) {
        if (activityProgress.isCompleted) {
          // If activity is completed but has 0 points, fix it
          if (activityProgress.pointsEarned === 0 && activityProgress.activity) {
            // For reading activities, award full points; for others use 70% (passing score)
            const fixedPoints = activityProgress.activity.type === "READING" 
              ? activityProgress.activity.points 
              : Math.round(0.7 * activityProgress.activity.points);
              
            // Update the activity progress with fixed points
            await db.activityProgress.update({
              where: { id: activityProgress.id },
              data: { pointsEarned: fixedPoints }
            });
            
            // Use the fixed points in our calculation
            levelPoints += fixedPoints;
            
            fixedIssues.push({
              activityId: activityProgress.activityId,
              oldPoints: activityProgress.pointsEarned,
              newPoints: fixedPoints
            });
          } else {
            levelPoints += activityProgress.pointsEarned;
          }
          completedActivities++;
        }
      }
      
      // Check if level should be marked as completed
      const shouldBeCompleted = levelPoints >= progress.level.minPointsToPass;
      
      if (shouldBeCompleted && !progress.isCompleted) {
        // Update the level progress to completed
        await db.userProgress.update({
          where: { id: progress.id },
          data: {
            pointsEarned: levelPoints,
            activitiesCompleted: completedActivities,
            isCompleted: true,
            completedAt: new Date()
          }
        });
        
        levelProgressUpdated = true;
        
        fixedIssues.push({
          levelId: progress.levelId,
          levelName: progress.level.name,
          pointsEarned: levelPoints,
          minPointsToPass: progress.level.minPointsToPass,
          wasCompleted: false,
          nowCompleted: true
        });
        
        // Update user's current level if this was their current level
        if (user.currentLevel === progress.level.order) {
          await db.user.update({
            where: { id: user.id },
            data: {
              currentLevel: progress.level.order + 1
            }
          });
          
          fixedIssues.push({
            userCurrentLevel: `Updated from ${user.currentLevel} to ${progress.level.order + 1}`
          });
        }
      } else if (levelPoints !== progress.pointsEarned || completedActivities !== progress.activitiesCompleted) {
        // Update the points and activities count even if not completed
        await db.userProgress.update({
          where: { id: progress.id },
          data: {
            pointsEarned: levelPoints,
            activitiesCompleted: completedActivities
          }
        });
        
        fixedIssues.push({
          levelId: progress.levelId,
          levelName: progress.level.name,
          oldPoints: progress.pointsEarned,
          newPoints: levelPoints,
          oldActivities: progress.activitiesCompleted,
          newActivities: completedActivities
        });
      }
    }
    
    // Recalculate user's total points
    const allCompletedActivities = await db.activityProgress.findMany({
      where: {
        userId: user.id,
        isCompleted: true
      }
    });
    
    const totalPoints = allCompletedActivities.reduce((sum, activity) => sum + activity.pointsEarned, 0);
    
    if (totalPoints !== user.totalPoints) {
      await db.user.update({
        where: { id: user.id },
        data: { totalPoints }
      });
      
      fixedIssues.push({
        userTotalPoints: `Updated from ${user.totalPoints} to ${totalPoints}`
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedIssues.length} issues`,
      fixedIssues,
      levelProgressUpdated
    });
  } catch (error: any) {
    console.error("Error checking progress:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
} 