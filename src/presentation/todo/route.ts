import {Router} from "express";
import {TodoController} from "./controller";
import {TodoDatasourceImpl} from "../../infrastructure/datasource/todo.datasource.impl";
import {TodoRepositoryImpl} from "../../infrastructure/repositories/todo.repository.impl";


export class TodoRoutes {
    static get routes(): Router {
        const router = Router();
        const dataSource = new TodoDatasourceImpl();
        const todoRepository = new TodoRepositoryImpl(dataSource);
        const todoController = new TodoController(todoRepository);

        router.get("/",todoController.getTodo);
        router.get("/:id",todoController.getTodoById);
        router.post("/", todoController.createTodo);
        router.put("/:id", todoController.updateTodo);
        router.delete("/:id", todoController.deleteTodo);

        return router;
    }
}