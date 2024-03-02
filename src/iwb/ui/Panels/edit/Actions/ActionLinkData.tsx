import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { Color4 } from '@dcl/sdk/math'

export let url:string = ""

export function ActionLinkComponent(){
    return(
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:'flex'
        }}
    >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'5%'}
        }}
    uiText={{value:"Url", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '40%',
        }}
    >
    <Input
        onChange={(value)=>{
            url = value
        }}
        fontSize={sizeFont(20,12)}
        value={url}
        placeholder={'link'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        ></Input>


    </UiEntity>
</UiEntity>
                  
    )
}