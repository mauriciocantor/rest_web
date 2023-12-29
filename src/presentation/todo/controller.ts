import {Request, Response} from "express";

const todos = [
    {id: 1, text: 'Buy Milk', completedAt: new Date()},
    {id: 2, text: 'Buy Bread', completedAt: null},
    {id: 3, text: 'Buy Honey', completedAt: new Date()},
];
export class TodoController {
    constructor() {
    }

    public getTodo = (req: Request, res: Response)=>{
        res.json(todos);
    }

    public getTodoById = (req: Request, res: Response)=>{
        const id = +req.params.id;

        if(isNaN(id)) {
            res.status(400).json({error: `Param is not number`});
            return;
        }

        const todo  = todos.find((register)=> register.id === id);

        (todo)
            ?res.json({todo})
            :res.status(404).json({error: `TODO with id ${id} not found`});

    }

    public createTodo = (req: Request, res: Response) =>{
        const body = req.body;
        const { text }=body;
        if(!text) return res.status(400).json({error: 'Text property is required'});

        const newTodo = {
            id: todos.length +1,
            text,
            completedAt: null
        }

        todos.push(newTodo);

        res.json({todo:newTodo});
    }

    public updateTodo = (req: Request, res: Response) =>{
        const id = +req.params.id;

        if(isNaN(id)) {
            res.status(400).json({error: `Param is not number`});
            return;
        }

        const todo  = todos.find((register)=> register.id === id);

        if(!todo) return res.status(404).json({error: `TODO with id ${id} not found`});

        const {text, completedAt} = req.body;

        todo.text = text||todo.text;
        (completedAt === 'null')
            ? todo.completedAt = null
            : todo.completedAt = new Date(completedAt || todo.completedAt);

        //! OJO, se pasa por referencia

        res.json({todo});

    }

    public deleteTodo = (req: Request, res: Response) =>{
        const id = +req.params.id;

        if(isNaN(id)) {
            res.status(400).json({error: `Param is not number`});
            return;
        }

        const todo  = todos.find((register)=> register.id === id);

        if(!todo) return res.status(404).json({error: `TODO with id ${id} not found`});

        todos.splice(todos.indexOf(todo), 1)

        res.json({todo});
    }
}