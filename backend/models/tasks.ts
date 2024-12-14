import { Model, RelationMappings } from "objection";
import User from "./users";

class Tasks extends Model{
    id!:number;
    name!:string;
    description!:string;
    startDate!:Date;
    dueDate!:Date;
    userId!:number;
    status!:boolean;
    completionDate!:Date | null;
    adminId!:number;
    static get tableName():string{
        return 'tasks';
    }

    static get relationMappings():RelationMappings{
        return {
            user:{
                relation:Model.BelongsToOneRelation,
                modelClass:User,
                join:{
                    from:'tasks.userId',
                    to:'users.id'
                }
            }
        }
    }
    
}

export default Tasks;