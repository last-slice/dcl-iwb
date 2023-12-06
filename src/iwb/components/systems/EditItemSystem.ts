import {engine, Material} from "@dcl/sdk/ecs";
import {EditableItemC, UpdateItemC} from "../../catalog/2d/EditableItem";
import {EditableImageC} from "../../catalog/2d/image";
import {log} from "../../helpers/functions";


function EditItemSystem(dt:number){
    for (const [entity, update] of engine.getEntitiesWith(UpdateItemC, EditableItemC, EditableImageC)) {

        log("update image", update)

        const editableImage = EditableImageC.getMutable(entity)
        editableImage.src = update.value

        Material.setBasicMaterial(entity, {
            texture: Material.Texture.Common({
                src: update.value,
            }),
        })

        UpdateItemC.deleteFrom(entity)

    }
}

export default EditItemSystem