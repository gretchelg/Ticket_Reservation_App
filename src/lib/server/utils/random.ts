import { customAlphabet } from 'nanoid/non-secure'
const nanoid = customAlphabet('23456789ABCDEFGHJKLMNPRSTUVWXYZ', 10)

export function GenerateRandomIDWithSize(size: number): string {
    return nanoid(size)
}
