import {CreateTodoDto, TodoDatasource, TodoEntity} from "../../domain";
import {UpdateTodoDto} from "../../domain";
import {prisma} from "../../data/postgres";
import {CustomError} from "../../domain";


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

        if (!todo) throw new CustomError(`Todo with id ${ id } not found`, 404);

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
            throw new CustomError(`Id ${ updateTodoDto.id } not found`, 404);
        }
    }

    async deleteById(id: number): Promise<TodoEntity> {
        try {
            const todo  = await prisma.todo.delete({
                where:{id:id}
            });

            return TodoEntity.fromJson(todo);
        }catch (e) {
            throw new CustomError(`Id ${ id } not found`, 404);
        }
    }
}