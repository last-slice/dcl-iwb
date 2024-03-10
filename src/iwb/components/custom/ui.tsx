import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'

export let customViews:any[] = []

export function addCustomView(view:any){
    customViews.push(view)
    redrawCustomUI()
}

export function updateCustomView(index:number, view:any){
    customViews[index].view =view
    redrawCustomUI()
}

export function redrawCustomUI(){
    let arr:any[] = [] 
    customViews.forEach((view:any, i:number)=>{
        arr.push(view.view)
    })
    return arr
}

export function createCustomUI() {
    return (
        <UiEntity
            key={"customUIHolder"}
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
            }}
        >
            {redrawCustomUI()}
        </UiEntity>
    )
}
