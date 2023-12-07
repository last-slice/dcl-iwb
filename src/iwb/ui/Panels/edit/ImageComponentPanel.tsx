
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { COMPONENT_TYPES } from '../../../helpers/types'

export function ImageComponentPanel() {
    return (
        <UiEntity
            key={"editimagecomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.IMAGE_COMPONENT ? 'flex' : 'none',
            }}
        >

        {/* url label */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"2%"}
            }}
        uiText={{value:"URL", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        {/* url input info */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"2%"}
            }}
        >

        <Input
        onSubmit={(value) => {
            console.log('submitted value: ' + value)
        }}
        fontSize={sizeFont(25,15)}
        placeholder={'type something'}
        placeholderColor={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        ></Input>

                <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            uiBackground={{color:Color4.Green()}}
            uiText={{value:"Save", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-center'}}
            />


        </UiEntity>


            

        </UiEntity>
    )
}