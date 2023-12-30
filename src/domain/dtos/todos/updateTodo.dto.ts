



export class UpdateTodoDto {
    private static newCompletedAt: Date | undefined;

    private constructor(
        public readonly id: number,
        public readonly text?: string,
        public readonly completedAt?: Date,
    ) {}

    get values(){
        const returnObj: {[key: string]: any} = {};

        if(this.text) returnObj.text = this.text;
        if(this.completedAt) returnObj.completedAt = this.completedAt;

        return returnObj;
    }

    static create(props: {[key:string]: any}): [string?, UpdateTodoDto?]{
        const {id, text, completedAt} = props;
        if(!id || isNaN(Number(id))){
            return ['id must be a valid number'];
        }

        if(completedAt){
            this.newCompletedAt = new Date(completedAt);
            if(this.newCompletedAt.toString()=== 'Invalid Date'){
                return ['CompletedAt must be a valid date', undefined];
            }
        }

        return [undefined, new UpdateTodoDto(id, text, this.newCompletedAt)];
    }
}