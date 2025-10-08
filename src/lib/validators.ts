import { z } from "zod";

export const zPlan = z.enum(["monthly", "yearly"]);
export const zUUID = z.string().uuid();

export const zCouponCode = z
  .string()
  .min(3)
  .max(24)
  .regex(/^[A-Z0-9-]+$/);

export const zCreateSessionBody = z.object({
  plan: zPlan,
  code: z.string().optional(), // se ignora en PASO 3 (apply-code es aparte)
});

export const zApplyCodeBody = z.object({
  sessionId: zUUID,
  code: zCouponCode,
});

export const zConfirmOffchainBody = z.object({
  sessionId: zUUID,
});
