import {TodoEntity} from "../entities/todo.entity";
import {CreateTodoDto} from "../dtos";
import {UpdateTodoDto} from "../dtos/todos/updateTodo.dto";


export abstract class TodoDatasource {
    abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>;
    abstract getAll(): Promise<TodoEntity[]>;
    abstract findById(id: number): Promise<TodoEntity>;
    abstract updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
    abstract deleteById(id: number): Promise<TodoEntity>;
}