import {engine, Schemas} from "@dcl/sdk/ecs";

export const EditableItemC = engine.defineComponent(
    "EditableItemComponent",
    {
        init: Schemas.Boolean
    },
    {init: false})
export const UpdateItemC = engine.defineComponent("UpdateItemComponent", {
    property: Schemas.String,
    value: Schemas.String
})
