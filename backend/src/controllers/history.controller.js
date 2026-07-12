import { prisma } from "../config/prisma.js";

export default async function getHistory(req,res){
    try{
        const userId = req.user.id;
        const history = await prisma.generation.findMany({
            where: {
                userId,
            },
        });
        res.status(200).json(history);
    }catch(err){
        res.status(500).json({ error: true, message: "Internal server error" });
    }
}