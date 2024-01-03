

export class TodoEntity {
    constructor(
        public id: number,
        public text: string,
        public completedAt?: Date
    ) {
    }

    get isCompleted(){
        return !!this.completedAt;
    }

    public static fromJson(object: {[key:string]: any}){
        const {id, text, completedAt} = object;
        if( !id) throw  'Id is required';
        if( !text) throw  'Text is required';

        let newDate;
        if(completedAt){
            newDate = new Date(completedAt);
            if(isNaN(newDate.getDate())){
                throw 'CompletedAt is not a valid date';
            }
        }

        return new TodoEntity(id, text, completedAt);
    }
}