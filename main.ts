/**
* Functions to UVA by FLY-SHARK
*/
//% color=#FF0000  icon="\uf072" block="drone" blockId="drone"
//% groups='["Basic"]'
namespace drone {
    let isInit = 0
    export enum DirectionOptions {
        //% block="forward" 
        Forward = 0x12,
        //% block="backward"
        Backward = 0x13,
        //% block="left" 
        Left = 0x14,
        //% block="right"
        Right = 0x15
    }
    export enum AngleOptions {
        //% block="left" 
        Left = 0x16,
        //% block="right"
        Right = 0x17
    }
    export enum RollOptions {
        //% block="roll forward" 
        Roll_forward = 0x20,
        //% block="roll back"
        Roll_back = 0x21,
        //% block="roll left" 
        Roll_left = 0x22,
        //% block="roll right"
        Roll_right = 0x23
    }
    function waitCallback(): boolean {
        while(true){
            let comRxErrorCnt = 0
            let txBuff = pins.createBuffer(8)
            txBuff[0] = 0xa5
            txBuff[1] = 0x5a
            serial.setRxBufferSize(8)
            serial.writeBuffer(txBuff)
            basic.pause(500)
            let rowData = serial.readBuffer(0)
            if(rowData.length < 8){
                //basic.showNumber(rowData.length)
                comRxErrorCnt += 1
                if(comRxErrorCnt > 3){
                    basic.showIcon(IconNames.No)
                    return false
                }
            }else{
                if (rowData[0] == 0x5a && rowData[1] == 0xff){
                    // basic.showIcon(IconNames.Yes)
                    // music.startMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
                    return true
                }
            }
        }
        return false
    }
    
    function initModule(): void {
        if (isInit == 0){
            isInit = 1
            //basic.showIcon(IconNames.Target)
            serial.redirect(
                SerialPin.P14,
                SerialPin.P13,
                BaudRate.BaudRate115200
            )
            music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
        }
    }
    /**
     * Set the drone to a given height
     * @param height The height at which the drone will fly, measured in centimeters, with a maximum value of 100 and a minimum value of 0
     */
    //% block="set drone height $height cm"
    //% height.min=0 height.max=100
    //% weight=90 group="Basic"
    export function setDroneHeight(height: number): void {
        initModule()
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[1] = 0x01
        txBuff[2] = height&0xff
        txBuff[3] = (height>>8)&0xff
        serial.writeBuffer(txBuff)
        waitCallback()
    }
    /**
     * Drone takeoff action
     */
    //% block="take off action"
    //% weight=89 group="Basic"
    export function takeOffAction(): void {
        initModule()
        for (let index = 3; index >= 0; index--) {
            basic.showNumber(index)
            if (index == 0) {
                music.playTone(523, music.beat(BeatFraction.Double))
            } else {
                music.playTone(262, music.beat(BeatFraction.Whole))
            }
        }
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[1] = 0x06
        txBuff[2] = basicState
        serial.writeBuffer(txBuff)
        waitCallback()
    }
    /**
     * Drone landing action
     */
    //% block="landing action"
    //% weight=89 group="Basic"
    export function landingAction(): void {
        initModule()
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[1] = 0x06
        txBuff[2] = basicState
        serial.writeBuffer(txBuff)
        waitCallback()
    }
    /**
     * The drone moves a certain distance in the specified direction
     * @param directionState The direction in which the drone moves, which can be left, right, forward, or backward
     * @param distance Drone moving distance
     */
    //% block="move action %directionState by %distance cm"
    //% weight=70 group="Basic"
    export function moveAction(directionState: DirectionOptions, distance: number): void {
        initModule()
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[1] = 0x02
        txBuff[2] = directionState

        txBuff[3] = distance&0xff
        txBuff[4] = (distance>>8)&0xff

        serial.writeBuffer(txBuff)
        waitCallback()
    }
    /**
     * The drone moves in a certain direction for a specific duration
     * @param directionState The direction in which the drone moves, which can be left, right, forward, or backward
     * @param second Drone movement time
     */
    //% block="move action %directionState by %second s"
    //% sec.min=0 sec.max=100
    //% weight=70 group="Basic"
    export function moveActionTime(directionState: DirectionOptions, second: number): void {
        initModule()
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[1] = 0x08
        txBuff[2] = directionState

        txBuff[3] = second&0xff
        txBuff[4] = (second>>8)&0xff
        
        serial.writeBuffer(txBuff)

        basic.pause(second*1000)
    }
    /**
     * The drone rotates a specific angle in a certain direction
     * @param rotationState The rotation direction of the drone, which can be left or right
     * @param angle Drone rotation angle
     */
    //% block="rotation action %rotationState by %angle °"
    //% weight=65 group="Basic"
    export function rotationAction(rotationState: AngleOptions, angle: number): void {
        initModule()
        let txBuff = pins.createBuffer(8)
        txBuff[0] = 0xa5
        txBuff[1] = 0x03
        txBuff[2] = rotationState

        txBuff[3] = angle&0xff
        txBuff[4] = (angle>>8)&0xff
        
        serial.writeBuffe r(txBuff)
        waitCallback()
    }
    /**
     * Get the drone voltage value
     */
    //% block="drone voltage"
    //% weight=50 group="Basic"
    export function droneVoltage(): number {
        initModule()
        while (true) {
            let txBuff = pins.createBuffer(8)
            txBuff[0] = 0xa5
            txBuff[1] = 0x81
            serial.writeBuffer(txBuff)
            serial.setRxBufferSize(8)
            basic.pause(500)
            let rowData = serial.readBuffer(0)
            if (rowData.length < 8) {
                basic.showIcon(IconNames.No)
                return 0
            } else {
                if (rowData[0] == 0x5a && rowData[1] == 0x81) {
                    return (rowData[2]) * 0.1
                }
            }
        }
        return 0;
    }
    /**
     * Get the drone height value
     */
    //% block="drone height"
    //% weight=50 group="Basic"
    export function droneHeight(): number {
        initModule()
        while (true) {
            let txBuff = pins.createBuffer(8)
            txBuff[0] = 0xa5
            txBuff[1] = 0x81
            serial.writeBuffer(txBuff)
            serial.setRxBufferSize(8)
            basic.pause(500)
            let rowData = serial.readBuffer(0)
            if (rowData.length < 8) {
                basic.showIcon(IconNames.No)
                return 0
            } else {
                if (rowData[0] == 0x5a && rowData[1] == 0x81) {
                    return 0
                }
            }
        }
        return 0;
    }
}
