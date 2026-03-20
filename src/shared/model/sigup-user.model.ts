
import { SignUpInput } from "@generated";

export class SignUpUser{
  
  public data!: SignUpInput;

  constructor(data: SignUpInput){
    this.data = data;
  }

}