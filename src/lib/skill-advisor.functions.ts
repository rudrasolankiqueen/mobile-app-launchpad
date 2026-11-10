import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { advisorInputSchema, type AdvisorResult } from "./skill-advisor";

/**
 * Public on purpose: students can fill in a listing before signing up.
 * Signed-in callers are limited per account, everyone else per network address;
 * a daily app-wide credit cap applies to all calls.
 */
export const suggestSkills = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => advisorInputSchema.parse(v))
  .handler(async ({ data }): Promise<AdvisorResult> => {
    const { resolveCaller, runSkillAdvisor } = await import("./skill-advisor.server");
    const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ?? getRequestHeader("x-real-ip") ?? "unknown";
    const caller = await resolveCaller(getRequestHeader("authorization"), ip);
    return runSkillAdvisor(data, caller);
  });
