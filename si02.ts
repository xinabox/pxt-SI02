/**
 * SI02 Accelerometer and Gyroscope
 */
//% color=#444444 icon="\uf2c7"
//% groups=['On start', 'Variables', 'Optional']
namespace SI02 {

    let _MMA_8653_FACTOR = 0;
    let _MMA_8653_PORTRAIT_LANDSCAPE = 0;
    const I2C_ADDR = 0x1D;

    const MMA_8653_CTRL_REG1 = 0x2A
    const MMA_8653_CTRL_REG1_VALUE_ACTIVE = 0x01
    const MMA_8653_CTRL_REG1_VALUE_F_READ = 0x02

    const MMA_8653_CTRL_REG2 = 0x2B
    const MMA_8653_CTRL_REG2_RESET = 0x40

    const MMA_8653_CTRL_REG3 = 0x2C
    const MMA_8653_CTRL_REG3_VALUE_OD = 0x01

    const MMA_8653_CTRL_REG4 = 0x2D
    const MMA_8653_CTRL_REG4_VALUE_INT_ASLP = 0x80
    const MMA_8653_CTRL_REG4_VALUE_INT_ENLP = 0x10
    const MMA_8653_CTRL_REG4_VALUE_INT_FFMT = 0x04
    const MMA_8653_CTRL_REG4_VALUE_INT_DRDY = 0x01

    const MMA_8653_CTRL_REG5 = 0x2E // 1: routed to INT1

    const MMA_8653_PL_STATUS = 0x10
    const MMA_8653_PL_CFG = 0x11
    const MMA_8653_PL_EN = 0x40


    const MMA_8653_XYZ_DATA_CFG = 0x0E
    const MMA_8653_2G_MODE = 0x00 //Set Sensitivity to 2g
    const MMA_8653_4G_MODE = 0x01 //Set Sensitivity to 4g
    const MMA_8653_8G_MODE = 0x02 //Set Sensitivity to 8g


    const MMA_8653_FF_MT_CFG = 0x15
    const MMA_8653_FF_MT_CFG_ELE = 0x80
    const MMA_8653_FF_MT_CFG_OAE = 0x40
    const MMA_8653_FF_MT_CFG_XYZ = 0x38


    const MMA_8653_FF_MT_SRC = 0x16
    const MMA_8653_FF_MT_SRC_EA = 0x80

    const MMA_8653_FF_MT_THS = 0x17

    const MMA_8653_FF_MT_COUNT = 0x18

    const MMA_8653_PULSE_CFG = 0x21
    const MMA_8653_PULSE_CFG_ELE = 0x80


    const MMA_8653_PULSE_SRC = 0x22
    const MMA_8653_PULSE_SRC_EA = 0x80

    // Sample rate
    const MMA_8653_ODR_800 = 0x00
    const MMA_8653_ODR_400 = 0x08
    const MMA_8653_ODR_200 = 0x10
    const MMA_8653_ODR_100 = 0x18 // default ratio 100 samples per second
    const MMA_8653_ODR_50 = 0x20
    const MMA_8653_ODR_12_5 = 0x28
    const MMA_8653_ODR_6_25 = 0x30
    const MMA_8653_ODR_1_56 = 0x38

    let _stat = 0;
    let _scale = 0;
    let _x = 0;
    let _y = 0;
    let _z = 0;
    let _step_factor = 0;
    let _highres = false;
    let _xg = 0;
    let _yg = 0
    let _zg = 0;
    let _rad2deg = 0;

    function setreg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(I2C_ADDR, buf);
    }

    function getreg(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt8BE);
    }

    function getInt8LE(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.Int8LE);
    }

    function getUInt16LE(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt16LE);
    }

    function getInt16LE(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.Int16LE);
    }

    function readBlock(reg: number, count: number): number[] {
        let buf: Buffer = pins.createBuffer(count);
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        buf = pins.i2cReadBuffer(I2C_ADDR, count);

        let tempbuf: number[] = [];
        for (let i: number = 0; i < count; i++) {
            tempbuf[i] = buf[i];
        }
        return tempbuf;
    }

    function initMotion(): void {
        standby();
        setreg(MMA_8653_FF_MT_CFG, MMA_8653_FF_MT_CFG_XYZ);
        setreg(MMA_8653_FF_MT_THS, 0x04);
        setreg(MMA_8653_FF_MT_COUNT, 0x00);
        setreg(MMA_8653_CTRL_REG3, MMA_8653_CTRL_REG3_VALUE_OD);
        setreg(MMA_8653_CTRL_REG4, MMA_8653_CTRL_REG4_VALUE_INT_FFMT);
        setreg(MMA_8653_CTRL_REG5, MMA_8653_CTRL_REG4_VALUE_INT_FFMT);
        active();
        // return (_read_register(MMA_8653_PULSE_SRC) & MMA_8653_PULSE_SRC_EA);
    }

    function standby(): void {
        let reg1 = 0x00;
        reg1 = getreg(MMA_8653_CTRL_REG1);
        setreg(MMA_8653_CTRL_REG1, reg1 & ~MMA_8653_CTRL_REG1_VALUE_ACTIVE); // reset
    }

    function active(): void {
        let reg1 = 0x00;

        reg1 = getreg(MMA_8653_CTRL_REG1)
        setreg(MMA_8653_CTRL_REG2, 0x09)//reset
        setreg(MMA_8653_CTRL_REG1, reg1 | MMA_8653_CTRL_REG1_VALUE_ACTIVE | (_highres ? 0 : MMA_8653_CTRL_REG1_VALUE_F_READ) | MMA_8653_ODR_6_25)
    }

    function geta2d(gx: number, gy: number): number {
        let a = 0;
        a = gx * gx;
        a = fma(gy, gy, a);
        return Math.sqrt(a);
    }

    //gets the magnitude of the 3d vector
    //the formula is a^2 = x^2 + y^2 + z^2
    function geta3d(gx: number, gy: number, gz: number): number {
        let a = 0;

        //use floating point multiply-add cpu func
        //sometimes we get better precision
        a = gx * gx;
        a = fma(gy, gy, a);
        a = fma(gz, gz, a);

        return Math.sqrt(a);
    }

    function _getRho(gx: number, gy: number, gz: number) {
        return geta3d(_xg, _yg, _zg);
    }


    function _getPhi(ax: number, ay: number, gaz: number) {
        return Math.atan2(ay, ax) * _rad2deg;
    }


    function _getTheta(ax: number, ay: number, az: number) {
        let rho = _getRho(ax, ay, az);

        if (rho == 0.0)
            return NaN;
        else
            return Math.acos(az / rho) * _rad2deg;
    }

    function begin(highres: boolean, scale: number) {
        _highres = highres;

        _scale = scale;
        if (_MMA_8653_FACTOR) {
            _step_factor = (_highres ? 0.0039 : 0.0156); // Base value at 2g setting
            if (_scale == 4)
                _step_factor *= 2;
            else if (_scale == 8)
                _step_factor *= 4;
        }

        let wai = getreg(0x0D); // Get Who Am I from the device.
        // return value for MMA8543Q is 0x3A

        setreg(MMA_8653_CTRL_REG2, MMA_8653_CTRL_REG2_RESET)
        pause(10); // Give it time to do the reset
        standby();

        if (_MMA_8653_PORTRAIT_LANDSCAPE) {
            setreg(MMA_8653_PL_CFG, 0x80 | MMA_8653_PL_EN)
        }

        setreg(MMA_8653_XYZ_DATA_CFG, MMA_8653_2G_MODE)
        if (_scale == 4 || _scale == 8) setreg(MMA_8653_XYZ_DATA_CFG, (_scale == 4) ? MMA_8653_4G_MODE : MMA_8653_8G_MODE);
        else setreg(MMA_8653_XYZ_DATA_CFG, MMA_8653_2G_MODE);
        active();
    }

    function getPLStatus(): number {
        return getreg(MMA_8653_PL_STATUS);
    }

    function getPulse(): number {
        setreg(MMA_8653_PULSE_CFG, MMA_8653_PULSE_CFG_ELE);
        return (getreg(MMA_8653_PULSE_SRC) & MMA_8653_PULSE_SRC_EA);
    }

    function getXG(): number {
        return _xg;
    }

    function getYG(): number {
        return _yg;
    }

    function getZG(): number {
        return _zg;
    }

    //% block="SI02 acceleration x axis"
    //% group="Variables"
    //% weight=74 blockGap=8
    export function getX(): number {
        update()
        return pos2neg(_x);
    }

    //% block="SI02 acceleration y axis"
    //% group="Variables"
    //% weight=74 blockGap=8
    export function getY(): number {
        update()
        return pos2neg(_y);
    }

    //% block="SI02 acceleration z axis"
    //% group="Variables"
    //% weight=74 blockGap=8
    export function getZ(): number {
        update()
        return pos2neg(_z);
    }

    function getRho(): number {
        return _getRho(_xg, _yg, _zg);
    }

    function getPhi(): number {
        return _getPhi(_xg, _yg, _zg);
    }

    function getTheta(): number {
        return _getTheta(_xg, _yg, _zg);
    }

    function update(): number {
        let res = readBlock(0x00, (_highres ? 7 : 4))
        _stat = res[0];
        if (_highres) {
            _x = ((res[1] << 8) + res[2]);
            _y = ((res[3] << 8) + res[4]);
            _z = ((res[5] << 8) + res[6]);
            if (_MMA_8653_FACTOR) {
                _xg = (_x / 64) * _step_factor;
                _yg = (_y / 64) * _step_factor;
                _zg = (_z / 64) * _step_factor;
            }
        }
        else {
            _x = res[1];
            _y = res[2];
            _z = res[3];
            if (_MMA_8653_FACTOR) {
                _xg = _x * _step_factor;
                _yg = _y * _step_factor;
                _zg = _z * _step_factor;
            }
        }
        return -1;
    }

    function setInterrupt(type_: number, pin: number, on: boolean) {
        let current_value = getreg(0x2D);

        if (on)
            current_value |= type_;
        else
            current_value &= ~(type_);

        setreg(0x2D, current_value);

        let current_routing_value = getreg(0x2E);

        if (pin == 1) {
            current_routing_value &= ~(type_);
        }
        else if (pin == 2) {
            current_routing_value |= type_;
        }

        setreg(0x2E, current_routing_value);
    }

    function disableAllInterrupts(): boolean {
        setreg(0x2D, 0);
        return true;
    }

    function fma(a: number, b: number, c: number) {
        return a * b + c;
    }

    function pos2neg(val: number): number {
        if (val <= 255) {
            if (((val >> 7) & 0x01) == 0x01) {
                val = -(256 - val)
            }
        } else if (val <= 65535 && val >= 255) {
            if (((val >> 15) & 0x01) == 0x01) {
                val = -(65536 - val)
            }
        }
        return val
    }

    begin(false, 2)
}

