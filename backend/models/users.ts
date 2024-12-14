import { Model, RelationMappings } from "objection";
import Tasks from "./tasks";

class User extends Model {
    id!:number;
    username!:string;
    password!:string;
    isAdmin!:boolean;
    companyName!:string;

    static get tableName():string {
        return 'users';
    }

    static get relationMappings():RelationMappings {
        return {
            tasks: {
                relation: Model.HasManyRelation,
                modelClass: Tasks,
                join: {
                    from: 'users.id',
                    to: 'tasks.userId'
                }
            }
        }
    }
}

export default User;