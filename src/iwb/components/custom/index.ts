
import { createBuildCompetitionSignup } from "./competitions/BuildCompetition";
import { createCustomUI } from "./ui";


export function createCustomCode(room:any){
    createCustomUI()
    createBuildCompetitionSignup(room)
}
