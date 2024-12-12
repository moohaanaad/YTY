import { unlink } from 'fs/promises'

export const deleteFile = async (fullPath: string) => {
    await unlink(fullPath)
}