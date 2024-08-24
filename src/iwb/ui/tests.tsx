
import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import resources from '../helpers/resources'
import { Color4 } from '@dcl/sdk/math'
import { sizeFont } from './helpers'

let show = true
let selectedIndex = 0

let options:any[] = [
    'select',
    'option 1',
    'option 2'
]

let option:any

export function displayTest(value:boolean){
    show = value

    console.log('index is now', selectedIndex)

    if(show){
        option = options[selectedIndex]
    }

    console.log('show is', show)

    console.log('option' , option)
}

export function createUITests() {
    return (
        <UiEntity
            key={resources.slug + "ui::tests::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '10%',
                height: '10%',
                positionType: 'absolute',
            }}
        uiBackground={{color:Color4.Green()}}
        onMouseDown={()=>{
            displayTest(!show)
        }}
        />

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '40%',
                height: '10%',
                positionType:'absolute',
                position:{right:'20%', bottom:'30%'}
            }}
            >
         <Dropdown
            options={options}
            selectedIndex={selectedIndex}
            onChange={(index:number)=>{
                selectedIndex = index
                console.log('index is now', index, selectedIndex)

                console.log("option is'", options[index])
            }}
            uiTransform={{
                width: '100%',
                height: '120%',
            }}
            // uiBackground={{color:Color4.Purple()}}//
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
        />
        </UiEntity>

            </UiEntity>
    )
}