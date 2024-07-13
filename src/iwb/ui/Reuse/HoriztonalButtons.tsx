import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { generateButtons } from '../ui'
import resources from '../../helpers/resources'

export function HoriztonalButtons(data:any){
    return(
        <UiEntity
            key={resources.slug + "-horiztonal-buttons-" + data.slug}
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: data.width ? data.width : '100%',
                    height: data.height ? data.height : '10%',
                }}
                // uiBackground={{ color: Color4 .Teal() }}
            >
                {generateButtons({slug:"horizton-view", buttons:data.buttons})}

            </UiEntity>
    )
}