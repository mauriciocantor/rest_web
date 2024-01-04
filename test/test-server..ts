import { Server } from '../src/presentation/server';
import {envs} from "../src/config/envs";
import {AppRoutes} from "../src/presentation/appRoutes";

export const testServer = new Server({
    port:envs.PORT,
    routes: AppRoutes.routes
});