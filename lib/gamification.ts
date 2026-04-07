import { prisma } from './prisma';

/**
 * GRANT_XP: Core Hacker Identity & XP System.
 * Ensures atomic integrity during concurrent XP gains.
 */
export async function grantXP(profileId: string, amount: number, type: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. LOG_EXTRACTION: Record the XP gain event
    await tx.xPLog.create({
      data: {
        profileId,
        type,
        amount,
      },
    });

    // 2. ATOMIC_INCREMENT: Update total XP in profile
    const updatedProfile = await tx.profile.update({
      where: { id: profileId },
      data: {
        xp: {
          increment: amount,
        },
      },
    });

    // 3. CLEARANCE_CALCULATION: Logic: 1 level per 200 XP
    const calculatedLevel = Math.floor(updatedProfile.xp / 200) + 1;

    // 4. LEVEL_PROMOTION: Update if clearance rank increased
    if (calculatedLevel > updatedProfile.clearanceLevel) {
      return await tx.profile.update({
        where: { id: profileId },
        data: {
          clearanceLevel: calculatedLevel,
        },
      });
    }

    return updatedProfile;
  });
}
