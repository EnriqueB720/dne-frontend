import { User as UserRequestData} from "@generated"

export class User {

    public data: UserRequestData;
    constructor(data: UserRequestData){
        this.data = data;
    }
    //Example property getters, you can add more as needed
    get userId(){
        return this.data?.userId!;
    }

    get phone(){
        return this.data?.phone!;
    }

    get email(){
        return this.data?.email!;
    }

   //TODO: add more user properties as needed
}