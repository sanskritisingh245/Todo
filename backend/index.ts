import express, {type Request, type Response}from "express";
import { SigninSchema, SignupSchema, TodoSchema } from "./zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./db";
import { authMiddleware } from "./helper/authMiddleware";


const app = express();
app.use(express.json());

const cors=require("cors");
app.use(cors());


const JWT_SECRET = process.env.JWT_SECRET;

app.post("/signup", async (req: Request, res:Response)=> {
    try{
        const {success, data} = SignupSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                success:false,
                error:"INVALID_REQUEST"
            })
        }

        const exsistingUser = await prisma.user.findUnique({
            where:{
                email:data.email
            }
        })

        if (exsistingUser){
            return res.status(400).json({
                success:false,
                error:'USER_ALREADY_EXSIST_PLEASE_SIGNUP'
            })
        }

        const hash = await bcrypt.hash(data.password, 10);
        await prisma.user.create({
            data:{
                username:data.username,
                email:data.email,
                password:hash
            }
        })

        return res.status(200).json({
            success:true,
            msg:"USER_SUCCESSFULLY_CREATED"
        })


    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
})

app.post("/signin", async (req:Request, res:Response) => {
    try{
        const {success, data } = SigninSchema.safeParse(req.body);
        if(!success) {
            return res.status(400).json({
                success:false,
                error:"INVALID_REQUEST"
            })
        }

        const existingUser = await prisma.user.findUnique({
            where:{
                email:data.email
            }
        })

        if(!existingUser) {
            return res.status(400).json({
                success:false,
                error:"USER_NOT_FOUND_PLEASE_SIGNIN"
            })
        }

        const password = await bcrypt.compare(data.password, existingUser.password);
        if(!password){
            return res.status(400).json({
                success:false,
                error:"INCORRECT_PASSWORD"
            })
        }

        const token = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
                username:existingUser.username,
            },
            JWT_SECRET!,
        );

        return res.status(200).json({
            success:true,
            msg:"SUCCESSFULLY_SIGNEDIN",
            data:token
        })

    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
})

app.post("/todo",authMiddleware, async (req:Request, res:Response)=> {
    try{
        const {success, data} = TodoSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                success:false,
                error:"INVALID_REQUEST"
            })
        }

        const userId= req.id;

        const todo =await prisma.todo.create({
            data:{
                title:data.title,
                description:data.description,
                userId:userId,
            }
        })

        return res.status(200).json({
            success:true,
            data:todo
        })

    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
})

app.put("/todo/:todoId", authMiddleware, async (req:Request, res:Response) => {
    try{
        const { success, data } = TodoSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                success:false,
                error:"INVALID_REQUEST"
            })
        }
        const todoId= req.params.todoId as string;
        const userId = req.id;

        const todo = await prisma.todo.findUnique({
            where:{
                id:todoId,
                userId:userId
            }
        })

        if( !todo){
            return res.status(400).json({
                success:false,
                error:"NOT_AUTHORIZED"
            })
        }

        const updatedTodo= await prisma.todo.update({
            where:{
                id:todo.id
            },data:{
                title:data.title,
                status:data.Status,
                description:data.description
            }
        })

        return res.status(200).json({
            success:true,
            msg:"TODO_UPDATED_SUCCESSFULLY",
            data:updatedTodo,
        })

    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
})

app.get("/todo", authMiddleware, async (req:Request, res: Response) => {
    try{
        const userId = req.id;
        const todos = await prisma.todo.findMany({
            where:{
                userId
            }
        })

        return res.status(200).json({
            success:true,
            todos
        })

    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
})
app.delete("/todo/:todoId", authMiddleware, async(req:Request, res:Response)=> {
    try{
        const todoId= req.params.todoId as string;
        const userId = req.id;
        const todo = await prisma.todo.findUnique({
            where:{
                id:todoId,
                userId:userId
            }
        })

        if(!todo){
            return res.status(404).json({
                success:false,
                error:"TODO_NOT_FOUND"
            })
        }

        await prisma.todo.update({
            where:{
                id:todoId,
            },data:{
                status:"DELETED"
            }
        })

        return res.status(200).json({
            success:true,
            msg:"TODO_SUCCESSFULLY_DELETED"
        })

    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
})


app.listen(3000, () => {
  console.log("running on port 3000");
});

