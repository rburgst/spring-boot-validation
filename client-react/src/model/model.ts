import { z } from 'zod'

export const ClubSchema = z.object({
  clubName: z.string().min(2).max(150),
  managerEmail: z.string().email().max(200),
  id: z.string().optional(),
})

export type Club = z.infer<typeof ClubSchema>
