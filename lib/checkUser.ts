
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { PLANS } from "./constants";
import type { Plan } from "@/Types/plans";

const getCurrentPlan = async (): Promise<Plan> => {
  const { has } = await auth();

  if (has({ plan: "pro" })) return "pro";
  if (has({ plan: "starter" })) return "starter";

  return "free";
};

export const checkUser = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  try {
    const currentPlan = await getCurrentPlan();

    // Check whether the user already exists
    const existingUser = await db.orm.public.User
      .whereUnique({ id: userId })
      .first();

    if (existingUser) {
      // Check whether the subscription plan changed
      if (existingUser.plan !== currentPlan) {
        const oldCredits =
          PLANS[existingUser.plan as Plan]?.credits ?? 0;

        const newCredits = PLANS[currentPlan].credits;

        const creditDelta = newCredits - oldCredits;

        // Update plan and credits
        await db.orm.public.User
          .whereUnique({ id: userId })
          .update({
            plan: currentPlan,
            credits:
              creditDelta > 0
                ? existingUser.credits + creditDelta
                : existingUser.credits,
          });

        // Return updated user
        return await db.orm.public.User
          .whereUnique({ id: userId })
          .first();
      }

      return existingUser;
    }

    // Get user information from Clerk
    const user = await currentUser();

    if (!user) return null;

    const email =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error("User email not found");
    }

    // Create a new user
    const newUser = await db.orm.public.User.create({
      clerkId: userId,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      email,
      imageUrl: user.imageUrl ?? "",
      credits: PLANS[currentPlan].credits,
      plan: currentPlan,
    });

    return newUser;

  } catch (error) {
    console.error("Error in checkUser:", error);
    return null;
  }
};
