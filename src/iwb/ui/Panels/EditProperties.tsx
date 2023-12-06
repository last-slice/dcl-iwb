import ReactEcs, {Button, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {sizeFont} from '../helpers'
import {selectedItem} from '../../components/modes/build'
import {EDIT_MODES} from '../../helpers/types'
import {EditableItemC, UpdateItemC} from "../../catalog/2d/EditableItem";
import {Color4} from "@dcl/sdk/math";
import {log} from "../../helpers/functions";
import {items} from "../../components/catalog";
import {EditableImageC} from "../../catalog/2d/image";

function shouldDisplay() {
    return selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT && EditableItemC.has(selectedItem.entity)

}

let curSettings:ReactEcs.JSX.Element

export function EditProperties() {
    return (
        <UiEntity
            key={"editPropertiesPanel"}
            uiTransform={{
                display: shouldDisplay() ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                height: '300px',
                margin: {top: '2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
        >


            {/* Settings header */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '90%',
                    height: '10%',
                    margin: {top: '1%'}
                }}

                uiText={{value: "Edit Settings", fontSize: sizeFont(17, 12), textAlign: 'middle-left'}}
            />


            {/* Settings row(s) */}
            {curSettings}
        </UiEntity>
    )
}//

export function generateSettingsInputs() {
    if(!shouldDisplay()) return <UiEntity />

    log("generateSettingsInputs()")
    let itemCatalogData = items.get(selectedItem.catalogId)


    if(itemCatalogData && itemCatalogData.n === "Image"){

        const imageSettings = EditableImageC.get(selectedItem.entity)

        curSettings =
                    <UiEntity>
                        <Input
                            onSubmit={(value) => {
                                console.log('submitted value: ' + value)

                                UpdateItemC.create(selectedItem.entity, {property:'src', value:value})

                            }}
                            onChange={(value) => {
                                console.log('changed value: ' + value)
                            }}
                            fontSize={16}
                            //placeholder={imageSettings.src}
                            value={imageSettings.src}
                            placeholderColor={Color4.White()}
                            color={Color4.White()}
                            uiBackground={{color:Color4.Gray()}}
                            uiTransform={{
                                width: '400px',
                                height: '60px',
                            }}
                        ></Input>
                        <Button
                            value="Save"
                            variant="primary"
                            uiTransform={{alignSelf: 'center', padding: '25px'}}
                            onMouseDown={() => {
                                // handleSubmitText(currentValue)
                            }}
                        />
                    </UiEntity>

    }

    // const curItem = editableItemsFromEntities.get(selectedItem.entity)
    // if (!curItem) return

    //
    // const allSettings: ReactEcs.JSX.Element[] = []
    // curItem.properties.forEach((prop, propName) => {
    //
    //     log(propName + " : " + prop)
    //
    //     allSettings.push(
    //         <UiEntity>
    //             <Input
    //                 onSubmit={(value) => {
    //                     console.log('submitted value: ' + value)
    //                 }}
    //                 fontSize={16}
    //                 placeholder={'type something'}
    //
    //                 placeholderColor={Color4.White()}
    //                 color={Color4.White()}
    //                 uiTransform={{
    //                     width: '400px',
    //                     height: '60px',
    //                 }}
    //             ></Input>
    //             <Button
    //                 value="Save"
    //                 variant="primary"
    //                 uiTransform={{alignSelf: 'center', padding: '25px'}}
    //                 onMouseDown={() => {
    //                     // handleSubmitText(currentValue)
    //                 }}
    //             />
    //         </UiEntity>
    //     )
    // })
    //
    // curSettings =
    //     <UiEntity
    //         uiTransform={{
    //             flexDirection: 'row',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             width: '90%',
    //             height: '90%',
    //             margin: {top: '1%'}
    //         }}
    //     >
    //
    //
    //         ...allSettings
    //
    //
    //     </UiEntity>




}