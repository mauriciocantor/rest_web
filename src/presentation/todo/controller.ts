import {Request, Response} from "express";
import {
    CreateTodo,
    CreateTodoDto,
    DeleteTodo,
    GetAllTodo,
    GetTodo,
    UpdateTodo,
    UpdateTodoDto,
    TodoRepository,
    CustomError
} from "../../domain";

/*const todos = [
    {id: 1, text: 'Buy Milk', completedAt: new Date()},
    {id: 2, text: 'Buy Bread', completedAt: null},
    {id: 3, text: 'Buy Honey', completedAt: new Date()},
];*/
export class TodoController {
    constructor(
        private readonly todoRepository: TodoRepository
    ) {}

    private handlerError=(res:Response, error:unknown)=>{
        if (error instanceof CustomError){
            return res.status(error.statusCode). json({error: error.message});
        }

        res.status(500).json({error:'Internal server error - check logs'});

    }

    public getTodo = (req: Request, res: Response)=>{
        new GetAllTodo(this.todoRepository)
            .execute()
            .then(todos=> res.json({todos}))
            .catch(error=>res.status(400).json({error}))
    }

    public getTodoById = (req: Request, res: Response)=>{
        const id = +req.params.id;

        if(isNaN(id)) {
            return res.status(400).json({error: `Param is not number`});
        }

        new GetTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.json({todo}))
            .catch(error => this.handlerError(res,error));
    }

    public createTodo = (req: Request, res: Response) =>{
        const [error,createTodoDto] = CreateTodoDto.create(req.body)

        if(error) return res.status(400).json({error});

        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!)
            .then(todo => res.status(201).json({todo}))
            .catch(error => this.handlerError(res,error));
    }

    public updateTodo = (req: Request, res: Response) =>{
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});

        if(error) return res.status(404).json({error});

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then(todo => res.json({todo}))
            .catch(error => this.handlerError(res,error));

    }

    public deleteTodo = (req: Request, res: Response) =>{
        const id = +req.params.id;

        if(isNaN(id)) {
            return res.status(400).json({error: `Param is not number`});
        }

        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.json({todo}))
            .catch(error => this.handlerError(res,error));

    }
}