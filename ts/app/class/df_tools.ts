import {promises as fs, readFileSync} from "fs"
import { VerifyDataType } from "../functions/verifyData";
import { Model } from "./model";
export class UtilsDataFiles{
    df!: {name: string, path: string};
    nameData!: string
    model!: {[z: string]: Model}

    constructor(){
        
    }

    async Find(search?:{[name: string]: any}){
        try {
            let dataList:any = ""
            
            dataList = JSON.parse(await fs.readFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, "utf8"));
            
            dataList.shift()

            if(search){
                let key = Object.keys(search)[0]
                let val = Object.values(search)[0]
                dataList.map((value:any)=>{
                    if(value[key] == val){
                        dataList = value
                    }else if(val.includes("*") && !val.includes("/*/")){
                        if(value[key].includes(`${val.replace("*", "")}`)) dataList = value
                    }else if(val.includes("/*/")){
                        val = val.replace("/*/", "*")
                        if(value[key].includes(val)) dataList = value
                    }else{
                        dataList = undefined
                    }
                })
                
            }   

            return dataList 
        } catch (error) {
            return error
        }
    }

    async FindOne(search:{[name: string]: any}) {
        try {
            let dataList:any = ""
            let dataReturn:any = undefined
            
            dataList = JSON.parse(await fs.readFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, "utf8"));
            
            let key = Object.keys(search)[0]
            let val = Object.values(search)[0]
            dataList.map((value:any)=>{
                if(value[key] == val){
                    dataReturn = value
                }else if(val.includes("*") && !val.includes("/*/")){
                    if(value[key].includes(`${val.replace("*", "")}`)) dataReturn = value
                }else if(val.includes("/*/")){
                    val = val.replace("/*/", "*")
                    if(value[key].includes(val)) dataReturn = value
                }
            })
            return dataReturn
        } catch (error: any) {
            throw new Error(error);
            
        }
    }

    async UpdateData(search:{[name: string]: any}, newData:{[name: string]: any}){
        let allData = JSON.parse(await fs.readFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, "utf8"));
            
        let oldData:any = {}

        let key = Object.keys(search)[0]
        let val = Object.values(search)[0]
        allData.map((value:any, index: any)=>{
            if(value[key] == val){
                oldData = index
            }else if(val.includes("*") && !val.includes("/*/")){
                if(value[key].includes(`${val.replace("*", "")}`)) oldData = index
            }else if(val.includes("/*/")){
                val = val.replace("/*/", "*")
                if(value[key].includes(val)) oldData = index
            }
        })
        
       
        let keys = Object.keys(newData)
        let validValue = []
        
        for(let i of keys){
            if(newData[i]){
                allData[oldData][i] = newData[i]
                if(this.model[i].type == "Money"){
                    let verify = `${newData[i]}`.split(".")
                    allData[oldData][i]=`${verify[1] != undefined?
                        newData[i]:
                        parseFloat(newData[i]).toFixed(2)
                    }`
                    allData[oldData][i]=`${this.model[i]["defaultMoney"]? this.model[i]["defaultMoney"]:  "R$"}:${allData[oldData][i]}`
                }else if(this.model[i].type == "Number"){
                    allData[oldData][i]=parseFloat(newData[i])
                    validValue.push(VerifyDataType(newData[i], this.model[i].type))
                }else{
                    validValue.push(VerifyDataType(newData[i], this.model[i].type))
                }

            }else if(newData[i] == false){
                allData[oldData][i]= newData[i]
                validValue.push(VerifyDataType(newData[i], "Bool"))
            }           
            

        }

        

        fs.writeFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, JSON.stringify(allData, undefined, 3)).catch((e)=>{})

    }
    async AddData(data: {[x: string]: any}){
        try {
            let dataList:any = ""
            dataList = JSON.parse(await fs.readFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, "utf8"));
            
            let validValue: Array<boolean> = []
            let keys = Object.keys(dataList[0])
            
            for(let i of keys){
                let keyVerify = Object.keys(dataList[0][i])                    
                
                for(let kv of keyVerify){
                    if(data[i]){
                        if(kv === "type"){
                            if(dataList[0][i].type == "Money"){
                                let verify = `${data[i]}`.split(".")
                                validValue.push(VerifyDataType(data[i], dataList[0][i][kv]))

                                data[i] = `${verify[1]?
                                    data[i]:
                                    parseFloat(data[i]).toFixed(2)
                                }`

                                validValue[validValue.length - 1]? 
                                    data[i] = `${dataList[0][i]["defaultMoney"]?dataList[0][i]["defaultMoney"]:  "R$"}:${data[i]}`: data[i]

                            }else if(dataList[0][i].type == "Number"){
                                data[i] = parseFloat(data[i])
                                validValue.push(VerifyDataType(data[i], dataList[0][i][kv]))
                            }else{
                                validValue.push(VerifyDataType(data[i], dataList[0][i][kv]))
                            }
                        }
                    }else if(!data[i] && dataList[0][i]){
                        if(dataList[0][i].default){
                            data[i] = dataList[0][i].default
                            if(dataList[0][i].type == "Number"){
                                data[i] = parseFloat(data[i])
                            }
                            validValue.push(VerifyDataType(data[i], dataList[0][i]["type"]))
                        }else if(dataList[0][i]["required"] && !dataList[0][i].default){
                            throw new Error(`A chave ${i} requer um valor obrigatório!`);
                        }
                    }
                }
            }
            
            dataList.push(data)
            
            
            fs.writeFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, JSON.stringify(dataList, undefined, 3)).catch((e)=>{})

        } catch (error: any) {
            throw new Error(error)
        }
    }

    async DeleteOne(search:{[name: string]: any}){
        let dataList: any[] = JSON.parse(await fs.readFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, "utf8"));
        
        let key = Object.keys(search)[0]
        let val = Object.values(search)[0]
        dataList.map((value:any, index: number)=>{
            if(value[key] == val){
                dataList.splice(index, 1)
            }else if(val.includes("*") && !val.includes("/*/")){
                if(value[key].includes(`${val.replace("*", "")}`)) dataList.splice(index, 1)
            }else if(val.includes("/*/")){
                val = val.replace("/*/", "*")
                if(value[key].includes(val)) dataList.splice(index, 1)
            }
        })

        fs.writeFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, JSON.stringify(dataList, undefined, 3)).catch((e)=>{})
    
    }
}