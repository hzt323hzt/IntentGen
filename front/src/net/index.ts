import {get} from "./http"

export function getQuestions(url:string){
    return get('/url',{'url':url})
}