import fs from 'fs'
import { unlink } from 'fs/promises'
import path from 'path'

export const deleteFile = async(fullPath: string) => {
    await unlink(fullPath)
}