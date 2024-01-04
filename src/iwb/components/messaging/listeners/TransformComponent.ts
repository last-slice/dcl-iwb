import { EDIT_MODIFIERS } from "../../../helpers/types";
import { transformObject } from "../../modes/build";


export function transformComponentListener(scene:any, asset:any){
    //position
    asset.p.listen("x", (currentValue:any, previousValue:any) => {
        if(previousValue !== undefined){
            transformObject(scene.id,asset.aid, EDIT_MODIFIERS.POSITION, "x", currentValue)
        }
    });
    asset.p.listen("y", (currentValue:any, previousValue:any) => {
        if(previousValue !== undefined){
            transformObject(scene.id,asset.aid, EDIT_MODIFIERS.POSITION, "y", currentValue)
        }
    });
    asset.p.listen("z", (currentValue:any, previousValue:any) => {
        if(previousValue !== undefined){
            transformObject(scene.id,asset.aid, EDIT_MODIFIERS.POSITION, "z", currentValue)
        }
    });

    //rotation
    asset.r.listen("x", (currentValue:any, previousValue:any) => {
        if(previousValue !== undefined){
            transformObject(scene.id,asset.aid, EDIT_MODIFIERS.ROTATION, "x", currentValue)
        }
    });
    asset.r.listen("y", (currentValue:any, previousValue:any) => {
        if(previousValue !== undefined){
            transformObject(scene.id,asset.aid, EDIT_MODIFIERS.ROTATION, "y", currentValue)
        }
    });
    asset.r.listen("z", (currentValue:any, previousValue:any) => {
        if(previousValue !== undefined){
            transformObject(scene.id,asset.aid, EDIT_MODIFIERS.ROTATION, "z", currentValue)
        }
    });

    //scale
    asset.s.listen("x", (currentValue:any, previousValue:any) => {
        if(previousValue !== undefined){
            transformObject(scene.id,asset.aid, EDIT_MODIFIERS.SCALE, "x", currentValue)
        }
    });
    asset.s.listen("y", (currentValue:any, previousValue:any) => {
        if(previousValue !== undefined){
            transformObject(scene.id,asset.aid, EDIT_MODIFIERS.SCALE, "y", currentValue)
        }
    });
    asset.s.listen("z", (currentValue:any, previousValue:any) => {
        if(previousValue !== undefined){
            transformObject(scene.id,asset.aid, EDIT_MODIFIERS.SCALE, "z", currentValue)
        }
    });
}