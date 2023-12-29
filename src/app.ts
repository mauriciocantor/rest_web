import {Server} from "./presentation/server";
import {envs} from './config/envs';
import {Routes} from "./presentation/routes";

(()=>{
    main();
})();


function main() {
    const server = new Server({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH,
        routes: Routes.routes
    });
    server.start();
}