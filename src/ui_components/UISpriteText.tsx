import ReactEcs, { EntityPropTypes, JustifyType, PositionUnit, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from "@dcl/sdk/math"
import resources from '../iwb/helpers/resources'
import { sizeFont } from '../iwb/ui/helpers'
import { getRandomString } from '../iwb/helpers/functions'
import { getEntity } from '../iwb/components/IWB'
import { States } from '../iwb/components/States'

type DigitSprite = {
    letter: string,
    uvs: number[]
    spriteSheet: string
    size: number,
    margin: number,
    color?: Color4
}

export type CounterJustifyType = 'left' | 'center' | 'right'


export type CustomTextProps = EntityPropTypes & {
    children?: ReactEcs.JSX.Component
    customText: CustomUIText
    margin?: any
}
export function UISpriteText(props: CustomTextProps) {
    return (
        // <UiEntity
        //     // uiTransform={props.uiTransform}
        //     uiTransform={{height:'auto'}}
        //     // uiBackground={props.uiBackground}
        //     uiBackground={{color:Color4.Green()}}
        // >
            <UiEntity
                uiTransform={{
                    width: "auto",
                    height: "auto",
                    positionType: 'absolute',
                    position: props.customText.position ? props.customText.position : undefined,
                    // flexBasis: props.customText.size,
                    // flexDirection: 'row-reverse',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: props.customText.justifyCounter,
                    display: props.customText.visible ? 'flex' : 'none',
                }}
                // uiBackground={{color:Color4.Green()}}
            >

                {
                props.customText.style === 0 ? 
                    props.customText.generateSDKText()                
                :
                    props.customText.generateCounterDigitsUI()
                }
      
            </UiEntity>
        // </UiEntity>
    )
}

export class CustomUIText {
    spriteSheet: string = "images/customCounter/alpha_sheet.png"
    rows: number
    cols: number
    currentText: string = "text"
    currentTextData: string = " "
    digits: DigitSprite[]
    size: number = 64
    justifyCounter: JustifyType = "center"
    visible: boolean = false
    letters:string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y","z", " "] 
    position:any
    style:number = 0
    id:string
    type:number = -500
    aid:string = ""
    sceneId:string = ""

    constructor(_rows: number, _cols: number, _uiTextInfo:any, _justifyType: CounterJustifyType, _imgPath: string,) {
        this.digits = []
        this.rows = _rows
        this.cols = _cols
        this.spriteSheet = _imgPath

        this.size = _uiTextInfo.size
        this.type = _uiTextInfo.type
        this.style = _uiTextInfo.style
        if(_uiTextInfo.pt){
            if(!this.position){
                this.position = {}   
            }
            this.position.top =  `${_uiTextInfo.pt}%`
        }
        if(_uiTextInfo.pl){
            if(!this.position){
                this.position = {}   
            }
            this.position.left =  `${_uiTextInfo.pl}%`
        }

        if(_uiTextInfo.pr){
            if(!this.position){
                this.position = {}   
            }
            this.position.right =  `${_uiTextInfo.pr}%`
        }

        if(_uiTextInfo.pb){
            if(!this.position){
                this.position = {}   
            }
            this.position.bottom =  `${_uiTextInfo.pb}%`
        }
        this.id = getRandomString(5)

        switch (_justifyType) {
            case 'left':
                this.justifyCounter = 'flex-end'
                break;
            case 'right':
                this.justifyCounter = 'flex-start'
                break;
            case 'center':
                this.justifyCounter = 'center'
                break;
            default:
                this.justifyCounter = 'flex-end'
                break;
        }

        this.digits.push({
            letter: "a",
            uvs: this.getUVSingleNumber("a"),
            spriteSheet: this.spriteSheet,
            size: this.size,
            margin: this.size * 0.33
        })

        // console.log('this digits are ', this.digits)
        console.log('ui sprite text', this)
    }

    getUVSingleNumber(digit: string): number[] {
        let index = this.letters.findIndex(letter => letter === digit)
        let currentSpriteV = Math.floor(index / this.rows)
        let currentSpriteU = index % this.cols
        let stepU = 1 / this.rows
        let stepV = 1 / this.cols


        let left = currentSpriteU * stepU
        let right = (currentSpriteU + 1) * stepU
        let top = 1 - (currentSpriteV * stepV)
        let bottom = 1 - ((currentSpriteV + 1) * stepV)

        return [
            left, bottom,
            left, top,
            right, top,
            right, bottom
        ]
    }

    setText(_string: string, _data?:string){
        this.digits = []
        this.currentText = _string
        if(_data){
            this.currentTextData = _data
        }

        if(this.style === 1){
            this.resetDigits()
        }
    }

    resetDigits(){
        this.digits.length = 0
        console.log('string is', (this.currentText + this.currentTextData).toLowerCase().split(''))
        let digits = (this.currentText + this.currentTextData).toLowerCase().split('');
        let realDigits = digits.map(String)

        // realDigits.reverse()
        let margin = this.size * 0.33

        for (let i = 0; i < realDigits.length; i++) {

            if ((i % 3) == 2) {
                margin = this.size * 0.1
            }
            else {
                margin = this.size * 0.33
            }

            this.digits.push({
                letter: realDigits[i],
                uvs: this.getUVSingleNumber(realDigits[i]),
                spriteSheet: this.spriteSheet,
                size: this.size,
                margin: margin,
            })
        }
    }

    generateCounterDigitsUI() {
        return Array.from(this.digits).map((digit) => <this.DigitComponent value={digit} key={this.digits.indexOf(digit)} />)
    }

    generateSDKText(){
        return(
            <UiEntity
            key={resources.slug + "ui::text::" + this.id}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height:"100%"
            }}
            uiText={{value: "" + this.currentText + this.currentTextData, fontSize: sizeFont(this.size, this.size), color: Color4.White(), textAlign: 'middle-center'}}
        />
        )
    }

    DigitComponent(props: { value: DigitSprite; key: string | number }) {

        return (<UiEntity
            key={"" + resources.slug + "custom-text-" +  props.key}
            uiTransform={{
                width: props.value.size,
                height: props.value.size,
                maxHeight: props.value.size,
                maxWidth: props.value.size,
                minWidth: props.value.size,
                minHeight: props.value.size,
                margin: { left: -1 * props.value.margin },

            }}
            uiBackground={{
                textureMode: 'stretch',
                uvs: props.value.uvs,
                texture: {
                    src: props.value.spriteSheet,
                },
            }}
        >
        </UiEntity>
        )
    }

    show() {
        this.visible = true
    }
    hide() {
        this.visible = false
    }

    toggle() {
        this.visible = !this.visible
    }
}
