import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { AVATAR_ANCHOR_POINTS } from '../../../../helpers/types'

// Function to process enum keys
function processEnumKeys(enumObj: object): string[] {
    let obj = Object.keys(enumObj)
    .filter(key => isNaN(Number(key))) // Filter out reverse mappings
    .map(key => {
        // Remove text up to and including the first underscore
        let processedKey = key.substring(key.indexOf('_') + 1);
        // Replace underscores with spaces
        processedKey = processedKey.replace(/_/g, ' ');
        processedKey = processedKey.toLowerCase()
        // Capitalize the first letter of each word
        processedKey = processedKey.replace(/\b\w/g, char => char.toUpperCase());
        return processedKey;
    });
    return obj
}

export function AddAttachPlayerPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::attach::player::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Choose Anchor Type", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '12%',
            margin:{bottom:'5%'}
        }}
    >
        <Dropdown
        options={[...processEnumKeys(AVATAR_ANCHOR_POINTS)]}
        selectedIndex={0}
        onChange={selectAttachPoint}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>

    </UiEntity>
    )
}

function selectAttachPoint(index:number){
    let data = newActionData
    data.anchor = index
    updateActionData(data, true)
}
