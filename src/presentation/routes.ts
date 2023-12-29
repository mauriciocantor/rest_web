import {Router} from "express";
import {TodoRoutes} from "./todo/route";


export class Routes {

    static get routes(): Router {
        const router = Router();

        router.use('/api/todo', TodoRoutes.routes);



        return router;
    }
}