import {CreateTodoDto, TodoDatasource, TodoEntity} from "../../domain";
import {UpdateTodoDto} from "../../domain/dtos/todos/updateTodo.dto";
import {prisma} from "../../data/postgres";


export class TodoDatasourceImpl implements TodoDatasource {
    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        return TodoEntity.fromJson(todo);
    }

    async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany();
        return todos.map(TodoEntity.fromJson);
    }

    async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findFirst({
            where: {id: id},
        });

        if (!todo) throw `Todo with id ${ id } not found`;

        return TodoEntity.fromJson(todo);
    }

    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        try {
            const todo = await prisma.todo.update({
                where: {id: updateTodoDto.id},
                data: updateTodoDto!.values
            });

            return TodoEntity.fromJson(todo);
        }catch (e) {
            throw `Id ${ updateTodoDto.id } not found`;
        }
    }

    async deleteById(id: number): Promise<TodoEntity> {
        try {
            const todo  = await prisma.todo.delete({
                where:{id:id}
            });

            return TodoEntity.fromJson(todo);
        }catch (e) {
            throw `Id ${ id } not found`;
        }
    }
}