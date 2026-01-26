import path from "path" // safely builds file paths (works on Windows, Linux, Docker)
import fs from "node:fs/promises" // lets us read/write files using async/await



const DB_PATH = path.resolve(process.cwd(), "database.json")


export type DbShape = {
    users: Array<{
        id: number
        name: string
        username: string
      }>
    userPosts: Array<{
        id: number
        userId: number
        title: string
        content: string
    }>
    userLikes: Array<{
        id: number
        userId: number
        postId: number
    }>
}

type DbApi = {
    readDB: () => Promise<DbShape>
    writeDB: (data: DbShape) => Promise<void>
    nextId: (items: Array<{ id: number }>) => number
}

const db:DbApi = {
   readDB: async ():  Promise <DbShape>  => {
        const file = await fs.readFile(DB_PATH, "utf-8")
        return JSON.parse(file) as DbShape
    },
    
    
    writeDB: async (db: DbShape): Promise<void> => {
        await fs.writeFile(DB_PATH, JSON.stringify(db, null, "utf-8"))
    },
    
    nextId: (items: Array<{id:number}>): number => {
        return items.length ? Math.max(...items.map(i=>i.id)) + 1 : 1
    }
}


export default db