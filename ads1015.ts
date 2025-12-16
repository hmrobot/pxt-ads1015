/**
 * ADS1015 I2C ADC Driver
 */
//% color=#00A2E8 icon="\uf1ec" block="ADS1015"
namespace ads1015 {
    let i2cAddr = 0x48
    let gain = 0x0200
    let currentMode = Mode.SingleShot
    let currentRate = SampleRate.SPS1600

    export enum Channel {
        A0 = 0,
        A1 = 1,
        A2 = 2,
        A3 = 3
    }

    export enum Differential {
        A0_A1 = 0,
        A0_A3 = 1,
        A1_A3 = 2,
        A2_A3 = 3
    }

    export enum Gain {
        GAIN_TWOTHIRDS = 0x0000,
        GAIN_ONE = 0x0200,
        GAIN_TWO = 0x0400,
        GAIN_FOUR = 0x0600,
        GAIN_EIGHT = 0x0800,
        GAIN_SIXTEEN = 0x0A00
    }

    export enum Address {
        ADDR_0x48 = 0x48,
        ADDR_0x49 = 0x49,
        ADDR_0x4A = 0x4A,
        ADDR_0x4B = 0x4B
    }

    export enum Mode {
        SingleShot = 0x0100,
        Continuous = 0x0000
    }

    export enum SampleRate {
        SPS128 = 0x0000,
        SPS250 = 0x0020,
        SPS490 = 0x0040,
        SPS920 = 0x0060,
        SPS1600 = 0x0080,
        SPS2400 = 0x00A0,
        SPS3300 = 0x00C0
    }

    /**
     * Initialize ADS1015 with address and gain
     */
    //% block="initialize ADS1015 at address %addr|with gain %g"
    export function init(addr: Address, g: Gain): void {
        i2cAddr = addr
        gain = g
    }

    /**
     * Set I2C address
     */
    //% block="set address %addr"
    export function setAddress(addr: Address): void {
        i2cAddr = addr
    }

    /**
     * Set gain
     */
    //% block="set gain %g"
    export function setGain(g: Gain): void {
        gain = g
    }

    /**
     * Set conversion mode
     */
    //% block="set mode %m"
    export function setMode(m: Mode): void {
        currentMode = m
    }

    /**
     * Set sample rate
     */
    //% block="set sample rate %rate"
    export function setSampleRate(rate: SampleRate): void {
        currentRate = rate
    }

    /**
     * Read ADC value from channel
     */
    //% block="read ADC value from channel %ch"
    export function readADC(ch: Channel): number {
        let config = 0x8000
        config |= (0x4000 | (ch << 12))
        config |= gain
        config |= currentRate
        config |= 0x0003
        config |= currentMode

        let buf = pins.createBuffer(3)
        buf[0] = 0x01
        buf[1] = (config >> 8) & 0xFF
        buf[2] = config & 0xFF
        pins.i2cWriteBuffer(i2cAddr, buf)

        basic.pause(2)

        pins.i2cWriteNumber(i2cAddr, 0x00, NumberFormat.UInt8BE)
        let raw = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt16BE)

        return raw >> 4
    }

    /**
     * Read differential ADC value
     */
    //% block="read differential ADC value %d"
    export function readDifferential(d: Differential): number {
        let config = 0x8000
        config |= (d << 12)
        config |= gain
        config |= currentRate
        config |= 0x0003
        config |= currentMode

        let buf = pins.createBuffer(3)
        buf[0] = 0x01
        buf[1] = (config >> 8) & 0xFF
        buf[2] = config & 0xFF
        pins.i2cWriteBuffer(i2cAddr, buf)

        basic.pause(2)

        pins.i2cWriteNumber(i2cAddr, 0x00, NumberFormat.UInt8BE)
        let raw = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt16BE)

        return raw >> 4
    }

    /**
     * Convert raw ADC value to voltage
     */
    //% block="convert raw value %val to voltage"
    export function toVoltage(val: number): number {
        let multiplier = 0.0
        switch (gain) {
            case Gain.GAIN_TWOTHIRDS: multiplier = 6.144 / 2048; break
            case Gain.GAIN_ONE:        multiplier = 4.096 / 2048; break
            case Gain.GAIN_TWO:        multiplier = 2.048 / 2048; break
            case Gain.GAIN_FOUR:       multiplier = 1.024 / 2048; break
            case Gain.GAIN_EIGHT:      multiplier = 0.512 / 2048; break
            case Gain.GAIN_SIXTEEN:    multiplier = 0.256 / 2048; break
        }
        return val * multiplier
    }

    /**
     * Read raw values from all channels
     */
    //% block="read raw values from all channels"
    export function readAllChannels(): number[] {
        let results: number[] = []
        for (let ch = 0; ch < 4; ch++) {
            let config = 0x8000
            config |= (0x4000 | (ch << 12))
            config |= gain
            config |= currentRate
            config |= 0x0003
            config |= currentMode

            let buf = pins.createBuffer(3)
            buf[0] = 0x01
            buf[1] = (config >> 8) & 0xFF
            buf[2] = config & 0xFF
            pins.i2cWriteBuffer(i2cAddr, buf)

            basic.pause(2)

            pins.i2cWriteNumber(i2cAddr, 0x00, NumberFormat.UInt8BE)
            let raw = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt16BE)
            results.push(raw >> 4)
        }
        return results
    }
}

