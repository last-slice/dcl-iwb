import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { ACCESS_TYPE, CHAIN_TYPE, NFT_TYPES } from '../../../../helpers/types'

let accessType:ACCESS_TYPE | undefined
let chain:CHAIN_TYPE | undefined
let type:number | undefined

export function resetVerify(){
    accessType = undefined
    chain = undefined
    type = undefined
}

export function AddVerifyAccessPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::verify::access::panel"}
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
        uiText={{value:"Choose Access Type", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '12%',
            margin:{bottom:'1%'}
        }}
    >
        <Dropdown
        options={[...["Select Access Type"],...Object.values(ACCESS_TYPE).map(str => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())).sort((a,b)=> a.localeCompare(b))]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index !== 0){
                accessType = [...Object.values(ACCESS_TYPE)].sort((a,b)=> a.localeCompare(b))[index-1]
                updateActionData({label:accessType})
            }
        }}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>

        <NFTAccess/>
        {/* <AddressAccess/>
        <HasWearablesAccess/>
        <HasWearablesOnAccess/> */}


    </UiEntity>
    )
}

function NFTAccess(){
    return(
        <UiEntity
        key={resources.slug + "action::verify::nft::access"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '90%',
            display: accessType && accessType === ACCESS_TYPE.NFT ? "flex" : "none"
        }}
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
            uiText={{value:"Choose Chain && Protocol", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
            />

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '12%',
                margin:{bottom:'1%'}
            }}
            >
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
                margin:{right:'1%'}
            }}
            >
                <Dropdown
                    options={[...["Select Chain"],...Object.keys(CHAIN_TYPE).filter(key => isNaN(Number(key)))]}
                    selectedIndex={0}
                    onChange={(index:number)=>{
                        if(index !== 0){
                            chain = index-1
                            updateActionData({value:chain})
                        }
                    }}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                        />
            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
                margin:{left:'1%'}
            }}
            >
                <Dropdown
                    options={[...["Select Protocol"],...Object.keys(NFT_TYPES).filter(key => isNaN(Number(key)))]}
                    selectedIndex={0}
                    onChange={(index:number)=>{
                        if(index !== 0){
                            type = index-1
                            updateActionData({ttype:type})
                        }
                    }}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                        />
            </UiEntity>

            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{bottom:'2%'}
            }}
        >

        <Input
            onChange={(value) => {
                updateActionData({message:value.trim()})
            }}
            onSubmit={(value) => {
                updateActionData({message:value.trim()})
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Enter Contract Address'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>

        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{bottom:'2%'}
            }}
        >

        <Input
            onChange={(value) => {
                updateActionData({variableText:value.trim()})
            }}
            onSubmit={(value) => {
                updateActionData({variableText:value.trim()})
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Enter token id (leave blank for any)'}
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

// function AddressAccess(){
//     return(
//         <UiEntity
//         key={resources.slug + "action::verify::address::access"}
//         uiTransform={{
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '100%',
//             height: '90%',
//             display: accessType && accessType === ACCESS_TYPE.ADDRESS ? "flex" : "none"
//         }}
//         >
//         </UiEntity>
//     )
// }

// function HasWearablesAccess(){
//     return(
//         <UiEntity
//         key={resources.slug + "action::verify::has::wearables::access"}
//         uiTransform={{
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '100%',
//             height: '90%',
//             display: accessType && accessType === ACCESS_TYPE.HASWEARABLES ? "flex" : "none"
//         }}
//         >
//         </UiEntity>
//     )
// }

// function HasWearablesOnAccess(){
//     return(
//         <UiEntity
//         key={resources.slug + "action::verify::has::wearables::on::access"}
//         uiTransform={{
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '100%',
//             height: '90%',
//             display: accessType && accessType === ACCESS_TYPE.WEARABLESON ? "flex" : "none"
//         }}
//         >
//         </UiEntity>
//     )
// }