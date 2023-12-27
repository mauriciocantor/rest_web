import express from 'express';
import path from "node:path";

interface Options {
    port: number;
    public_path?: string
}

export class Server{

    private app = express();
    private readonly port: number;
    private readonly public_path: string;

    constructor(options: Options) {
        const { port, public_path = 'public'}=options;
        this.port=port;
        this.public_path = public_path;
    }
    async start(){
        //middleware

        //Public folder
        this.app.use(express.static(this.public_path));

        this.app.get('*',(req,res)=>{
            const indexPath = path.join(__dirname,'../../public/index.html');
            res.sendFile(indexPath);
        });

        this.app.listen(this.port, ()=>{
            console.log('Server Running'+ this.port);
        });
    }




}