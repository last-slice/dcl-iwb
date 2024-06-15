import ReactEcs, { EntityPropTypes, JustifyType, PositionUnit, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from "@dcl/sdk/math"
import resources from '../iwb/helpers/resources'

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
            >
                {props.customText.generateCounterDigitsUI()}
            </UiEntity>
        // </UiEntity>
    )
}

export class CustomUIText {
    spriteSheet: string = "images/customCounter/alpha_sheet.png"
    rows: number
    cols: number
    currentText: string = "a"
    digits: DigitSprite[]
    size: number = 64
    justifyCounter: JustifyType = "center"
    visible: boolean = false
    letters:string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y","z"] 
    position:any

    constructor(_rows: number, _cols: number, _size: number, _justifyType: CounterJustifyType, _imgPath: string,) {
        this.digits = []
        this.rows = _rows
        this.cols = _cols
        this.spriteSheet = _imgPath
        this.size = _size

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

    setText(_string: string){
        this.digits = []
        this.currentText = _string

        let digits = _string.toLowerCase().split('');
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
