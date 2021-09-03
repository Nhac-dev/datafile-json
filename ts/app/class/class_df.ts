import { execSync } from "child_process"
import {promises as fs} from "fs"
import { Schema } from "./model"


export class DataFile{
    #dataName!:string
    #collectionsName!: string[]
    #path!: string
    #id!: string

    constructor(dataName: string, path: string){
        this.#id = (Math.random() * (100 - 58) + 50).toString(18)
        this.#dataName = dataName
        this.#collectionsName = new Array()
        this.SetPath(path)


        const settings = {
            id: this.GetId,
            name: this.GetName,
            genBy: "Jefferson"
        }

        fs.mkdir(`${this.GetPath}/${this.GetName}`).catch((e)=>{})
        
        
        fs.mkdir(`${this.GetPath}/${this.GetName}/collections/`).catch((e)=>{})
        
        
        fs.readFile(`${this.GetPath}/${this.GetName}/${this.GetName}-settings.json`, "utf8").then((data)=>{
            settings.id = dataName
        }).catch((e)=>{
            fs.writeFile(`${this.GetPath}/${this.GetName}/${this.GetName}-settings.json`, JSON.stringify(settings, undefined, 3), "utf8")
        })
    }

    // GET
    
    get GetName() : string {
        return this.#dataName
    }
    get GetPath() : string {
        return this.#path
    }
    get GetId() : string {
        return this.#id
    }
    get GetCollections(): string[] {
        return this.#collectionsName
    }

    // SET
    SetPath(dir: string){
        this.#path = dir
    }
    NewCollection(nameCollection: string, model: Schema){
        fs.readFile(`${this.GetPath}/${this.GetName}/collections/${nameCollection}.json`, "utf8").then((data)=>{
            let datamodel:any = model.model
            let dataRecibe = JSON.parse(data)

            dataRecibe[0] = datamodel

            fs.writeFile(`${this.GetPath}/${this.GetName}/collections/${nameCollection}.json`, JSON.stringify(dataRecibe, undefined, 3)).catch((e)=>{
            })
        }).catch((e)=>{
            console.log(e);
            
            fs.writeFile(`${this.GetPath}/${this.GetName}/collections/${nameCollection}.json`, JSON.stringify([model.model], undefined, 3)).then(()=>{
            }).catch((e)=>{
            })
        })

        model.SetDF({name: this.GetName, path: this.GetPath})

        this.#collectionsName.push(nameCollection)
    }

}