import {Request, Response} from "express";
import {prisma} from "../../data/postgres";
import {CreateTodoDto} from "../../domain/dtos";
import {UpdateTodoDto} from "../../domain/dtos/todos/updateTodo.dto";

/*const todos = [
    {id: 1, text: 'Buy Milk', completedAt: new Date()},
    {id: 2, text: 'Buy Bread', completedAt: null},
    {id: 3, text: 'Buy Honey', completedAt: new Date()},
];*/
export class TodoController {
    constructor() {
    }

    public getTodo = async (req: Request, res: Response)=>{
        const todos = await prisma.todo.findMany();
        res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response)=>{
        const id = +req.params.id;

        if(isNaN(id)) {
            return res.status(400).json({error: `Param is not number`});
        }

        const todo = await prisma.todo.findFirst({
            where: {id: id},
        });

        (todo)
            ?res.json({todo})
            :res.status(404).json({error: `TODO with id ${id} not found`});

    }

    public createTodo = async (req: Request, res: Response) =>{
        const [error,createTodoDto] = CreateTodoDto.create(req.body)

        if(error) return res.status(400).json({error});

        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        res.json({todo});
    }

    public updateTodo = async (req: Request, res: Response) =>{
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});

        if(error) return res.status(404).json({error});

        try {
            const todo = await prisma.todo.update({
                where: {id: id},
                data: updateTodoDto!.values
            });
            res.json({todo});
        }catch (e) {
            return res.status(404).json({error: `TODO with id ${id} not found`});
        }

    }

    public deleteTodo = async (req: Request, res: Response) =>{
        const id = +req.params.id;

        if(isNaN(id)) {
            res.status(400).json({error: `Param is not number`});
            return;
        }

        try {
            const todo  = await prisma.todo.delete({
                where:{id:id}
            });

            res.json({todo});
        }catch (e) {
            return res.status(404).json({error: `TODO with id ${id} not found`});
        }

    }
}