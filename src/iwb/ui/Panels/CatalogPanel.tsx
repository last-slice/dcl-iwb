import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { items } from '../../components/catalog'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../helpers'
import { log } from '../../helpers/functions'
import resources from '../../helpers/resources'
import { selectCatalogItem, useSelectedItem } from '../../components/modes/build'

export let showCatalogPanel =  false

export function displayCatalogPanel(value: boolean) {
    showCatalogPanel = value
}

export let itemSelect = false
export let customSelect = false
export let itemCode = 0
export let objName = ''

const columns = 2;
const rows = 3;

let currentPage = 0;
const itemsPerPage = 9;

export function createCatalogPanel() {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = [...items.values()].slice(startIndex, endIndex);
    const totalPages = Math.ceil(itemsToShow.length / (columns * rows));

    return (
        <UiEntity
            key={"catalogpanel"}
            uiTransform={{
                display: showCatalogPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(25, 345 / 511).width,
                height: calculateImageDimensions(25, 345 / 511).height,
                positionType: 'absolute',
                position: { right: '3%', bottom: '3%' }
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: 'assets/atlas1.png',
                },
                uvs:getImageAtlasMapping({
                    atlasHeight:1024,
                    atlasWidth:1024,
                    sourceTop:514,
                    sourceLeft:384,
                    sourceWidth:345,
                    sourceHeight:511
                })
            }}
        >

        <UiEntity
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                width: '90%',
                height: '10%',
            }}
            uiText={{value:"Asset Catalog", fontSize:sizeFont(30,20)}}
            // uiBackground={{color:Color4.Blue()}}
        />


            {/* placeholder for search bar */}
        <UiEntity
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                justifyContent:'center',
                alignContent:'center',
                width: '90%',
                height: '8%',
            }}
            // uiBackground={{color:Color4.Blue()}}
        >

        <UiEntity
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                width: '10%',
                height: '20%',
            }}
            uiText={{value:"Page " + (currentPage + 1) + " / " + totalPages}}
        />

            </UiEntity>

            {generateCatalogRows(itemsToShow)}


            {/* paginate container */}
            <UiEntity
            uiTransform={{
                display: totalPages > 1 ? 'flex' : 'none',
                flexDirection: 'row',
                justifyContent:'flex-end',
                alignContent:'center',
                alignItems:'center',
                width: '90%',
                height: '8%',
            }}
            // uiBackground={{color:Color4.Blue()}}
        >

            <UiEntity
            uiTransform={{
                display:'flex',
                justifyContent:'center',
                alignContent:'center',
                flexDirection: 'row',
                width: '25%',
                height: '90%',
                margin:{right:'2%'}
            }}
            uiBackground={{color:Color4.Purple()}}
            uiText={{value: "<", fontSize:sizeFont(20,12)}}
            onMouseUp={()=>{
                if(currentPage - 1 >=0){
                    currentPage--
                }
            }}
                />  

                <UiEntity
            uiTransform={{
                display:'flex',
                justifyContent:'center',
                alignContent:'center',
                flexDirection: 'row',
                width: '25%',
                height: '90%',
                margin:{left:'2%'}
            }}
            uiBackground={{color:Color4.Purple()}}
            uiText={{value: ">", fontSize:sizeFont(20,12)}}
            onMouseUp={()=>{
                if((currentPage + 1) * itemsPerPage + itemsPerPage <= items.size)
                currentPage++
            }}
                />  

            </UiEntity>



        </UiEntity>
    )
}

function generateCatalogRows(itemsToShow:any){
    let arr:any[] = []

    let start = 0
    let end = 3
    for(let i = 0; i < Math.ceil(itemsToShow.length / 3); i++){
        arr.push(<CatalogRow row={start} items={itemsToShow.slice(start, end)}/>)
        start += 3
        end += 3
    }
    return arr
}

function generateRowItems(data:any){
    let arr:any[] = []
    let count = 0
    for(let i = 0; i < data.items.length; i++){
        arr.push(<CatalogItem row={data.row + "-" + count} item={data.items[count]}/>)
        count++
    }
    return arr//
}

function CatalogRow(data:any){
    // log('row is', data)
    return(
        <UiEntity
            key={"catalog-row" + data.row}
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                height: '23%',
                margin:{top:'1%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

                {generateRowItems(data)}

            </UiEntity>
    )
}

function CatalogItem(data:any){
        return(
            <UiEntity
            key={"catalog-item-row" + data.row}
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '33%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Teal()}}//
            >

                {/* item image */}
                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(8).width,
                        height:calculateSquareImageDimensions(8).width,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                        src: resources.endpoints.proxy + data.item.im
                        },
                        uvs:getImageAtlasMapping({
                            atlasHeight:256,
                            atlasWidth:256,
                            sourceTop:0,
                            sourceLeft:0,
                            sourceWidth:256,
                            sourceHeight:256
                        })
                    }}
                    onMouseDown={()=>{
                        selectCatalogItem(data.item.id)
                        useSelectedItem()
                    }}
                    />

            <UiEntity
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                width: '90%',
                height: '20%',
            }}
            uiText={{value: addLineBreak(data.item.n, undefined, 15), fontSize:sizeFont(20,12)}}
            // uiBackground={{color:Color4.Blue()}}
                />    


            <UiEntity
            uiTransform={{
                display:'flex',
                justifyContent:'center',
                alignContent:'center',
                flexDirection: 'row',
                width: '90%',
                height: '15%',
                margin:{top:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

            <UiEntity
            uiTransform={{
                display:'flex',
                justifyContent:'center',
                alignContent:'center',
                flexDirection: 'row',
                width: '50%',
                height: '100%',
                margin:{right:'1%'}
            }}
            uiBackground={{color:Color4.Purple()}}
            uiText={{value: "Use", fontSize:sizeFont(20,12)}}
                />  

                <UiEntity
            uiTransform={{
                display:'flex',
                justifyContent:'center',
                alignContent:'center',
                flexDirection: 'row',
                width: '50%',
                height: '100%',
                margin:{left:'1%'}
            }}
            uiBackground={{color:Color4.Purple()}}
            uiText={{value: "Info", fontSize:sizeFont(20,12)}}
                />  


            </UiEntity>       




            </UiEntity>
)
}
