import {Request, Response} from "express";
import {prisma} from "../../data/postgres";
import {CreateTodoDto} from "../../domain/dtos";
import {UpdateTodoDto} from "../../domain/dtos/todos/updateTodo.dto";
import {TodoRepository} from "../../domain";

/*const todos = [
    {id: 1, text: 'Buy Milk', completedAt: new Date()},
    {id: 2, text: 'Buy Bread', completedAt: null},
    {id: 3, text: 'Buy Honey', completedAt: new Date()},
];*/
export class TodoController {
    constructor(
        private readonly todoRepository: TodoRepository
    ) {
    }

    public getTodo = async (req: Request, res: Response)=>{
        const todos = await this.todoRepository.getAll();
        return res.json({todos});
    }

    public getTodoById = async (req: Request, res: Response)=>{
        const id = +req.params.id;

        if(isNaN(id)) {
            return res.status(400).json({error: `Param is not number`});
        }

        try{
            const todo = await this.todoRepository.findById(id);
            res.json({todo});
        }catch (error) {
            res.status(400).json({error});
        }
    }

    public createTodo = async (req: Request, res: Response) =>{
        const [error,createTodoDto] = CreateTodoDto.create(req.body)

        if(error) return res.status(400).json({error});

        const todo = await this.todoRepository.create(createTodoDto!);

        res.json({todo});
    }

    public updateTodo = async (req: Request, res: Response) =>{
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});

        if(error) return res.status(404).json({error});

        const todo = this.todoRepository.updateById(updateTodoDto!);
        return res.json({todo});

    }

    public deleteTodo = async (req: Request, res: Response) =>{
        const id = +req.params.id;

        if(isNaN(id)) {
            return res.status(400).json({error: `Param is not number`});
        }

        const todo = this.todoRepository.deleteById(id);

        return res.json({todo});

    }
}