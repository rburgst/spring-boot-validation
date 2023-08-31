import { z } from 'zod'

export const ClubSchema = z.object({
  clubName: z.string().min(2).max(150),
  managerEmail: z.string().email().max(200),
  id: z.string().optional(),
})

export type Club = z.infer<typeof ClubSchema>

export const ClubInfoSchema = z.object({
  clubName: z.string().min(2).max(150),
  city: z.string().max(200).optional(),
  id: z.string().optional(),
})

export type ClubInfo = z.infer<typeof ClubInfoSchema>

export type ClubSort = keyof Club

export type SortDirection = 'asc' | 'desc'
export type SortCriterium<T> = { column: T; dir: SortDirection }
