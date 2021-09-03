import { VerifyDataType } from "../functions/verifyData";
import { DataType } from "../type";
import { UtilsDataFiles } from "./df_tools";


export interface Model{
    type: DataType // Data type
    required?: boolean // This data is required? 
    default?: any // Default value if not have a value send by user(or server)
    defaultMoney?: any // If the value is money Type, use this
}
export class Schema extends UtilsDataFiles{
    constructor(nameData: string, data: {[x: string]: Model}){
        super()
        this.model = {}
        this.nameData = nameData
        let keys = Object.keys(data)
        for(let item of keys){
            if(data[item].default){
                VerifyDataType(data[item].default, data[item].type)?
                (
                    ()=>{
                        if(data[item].type == "Money"){
                            let verify = `${data[item].default}`.split(".")
                            data[item].default = `${verify[1]?
                                data[item].default:
                                parseFloat(data[item].default).toFixed(2)
                            }` 

                            
                            data[item].default = `${data[item].defaultMoney? data[item].defaultMoney: "R$"}:${data[item].default}`
                            
                        }
                        this.#SaveData(item, data)
                    }
                )()
                :(
                    ()=>{
                        console.log(`O tipo ${data[item].type} não coincide com o valor ${data[item].default} que é um/a ${typeof data[item].default}`)
                    }        
                )(); 
                continue
            }else{
                this.#SaveData(item, data)
            }
            
        }

    }
    #SaveData(key: string, obj: {[x:string]: Model}){
        this.model[key] = obj[key]
    }
    public SetDF(df: {name: string, path: string}){
        this.df = df
    }
}
