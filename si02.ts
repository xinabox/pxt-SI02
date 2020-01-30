/**
 * SI02 Accelerometer and Gyroscope
 */
//% color=#444444 icon="\uf2c7"
//% groups=['On start', 'Variables', 'Optional']
namespace SI02 {
    export enum axis {
        //% block="x"
        X = 0,
        //% block="y"
        Y = 1,
        //% block="z"
        Z = 2
    }

    function setreg(addr: number, reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(addr, buf);
    }

    function getreg(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
    }

    function getInt8LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int8LE);
    }

    function getUInt16LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt16LE);
    }

    function getInt16LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int16LE);
    }

    function readBlock(addr: number, reg: number, count: number): number[] {
        let buf: Buffer = pins.createBuffer(count);
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        buf = pins.i2cReadBuffer(addr, count);

        let tempbuf: number[] = [];
        for (let i: number = 0; i < count; i++) {
            tempbuf[i] = buf[i];
        }
        return tempbuf;


    }

    const MAG3110_I2C_ADDRESS = 0x0E
    const MAG3110_DR_STATUS = 0x00
    const MAG3110_OUT_X_MSB = 0x01
    const MAG3110_OUT_X_LSB = 0x02
    const MAG3110_OUT_Y_MSB = 0x03
    const MAG3110_OUT_Y_LSB = 0x04
    const MAG3110_OUT_Z_MSB = 0x05
    const MAG3110_OUT_Z_LSB = 0x06
    const MAG3110_WHO_AM_I = 0x07
    const MAG3110_SYSMOD = 0x08
    const MAG3110_OFF_X_MSB = 0x09
    const MAG3110_OFF_X_LSB = 0x0A
    const MAG3110_OFF_Y_MSB = 0x0B
    const MAG3110_OFF_Y_LSB = 0x0C
    const MAG3110_OFF_Z_MSB = 0x0D
    const MAG3110_OFF_Z_LSB = 0x0E
    const MAG3110_DIE_TEMP = 0x0F
    const MAG3110_CTRL_REG1 = 0x10
    const MAG3110_CTRL_REG2 = 0x11
    const MAG3110_WHO_AM_I_RSP = 0xC4
    const MAG3110_DR_OS_80_16 = 0x00
    const MAG3110_DR_OS_40_32 = 0x08
    const MAG3110_DR_OS_20_64 = 0x10
    const MAG3110_DR_OS_10_128 = 0x18
    const MAG3110_DR_OS_40_16 = 0x20
    const MAG3110_DR_OS_20_32 = 0x28
    const MAG3110_DR_OS_10_64 = 0x30
    const MAG3110_DR_OS_5_128 = 0x38
    const MAG3110_DR_OS_20_16 = 0x40
    const MAG3110_DR_OS_10_32 = 0x48
    const MAG3110_DR_OS_5_64 = 0x50
    const MAG3110_DR_OS_2_5_128 = 0x58
    const MAG3110_DR_OS_10_16 = 0x60
    const MAG3110_DR_OS_5_32 = 0x68
    const MAG3110_DR_OS_2_5_64 = 0x70
    const MAG3110_DR_OS_1_25_128 = 0x78
    const MAG3110_DR_OS_5_16 = 0x80
    const MAG3110_DR_OS_2_5_32 = 0x88
    const MAG3110_DR_OS_1_25_64 = 0x90
    const MAG3110_DR_OS_0_63_128 = 0x98
    const MAG3110_DR_OS_2_5_16 = 0xA0
    const MAG3110_DR_OS_1_25_32 = 0xA8
    const MAG3110_DR_OS_0_63_64 = 0xB0
    const MAG3110_DR_OS_0_31_128 = 0xB8
    const MAG3110_DR_OS_1_25_16 = 0xC0
    const MAG3110_DR_OS_0_63_32 = 0xC8
    const MAG3110_DR_OS_0_31_64 = 0xD0
    const MAG3110_DR_OS_0_16_128 = 0xD8
    const MAG3110_DR_OS_0_63_16 = 0xE0
    const MAG3110_DR_OS_0_31_32 = 0xE8
    const MAG3110_DR_OS_0_16_64 = 0xF0
    const MAG3110_DR_OS_0_08_128 = 0xF8
    const MAG3110_FAST_READ = 0x04
    const MAG3110_TRIGGER_MEASUREMENT = 0x02
    const MAG3110_ACTIVE_MODE = 0x01
    const MAG3110_STANDBY_MODE = 0x00
    const MAG3110_AUTO_MRST_EN = 0x80
    const MAG3110_RAW_MODE = 0x20
    const MAG3110_NORMAL_MODE = 0x00
    const MAG3110_MAG_RST = 0x10
    const MAG3110_SYSMOD_STANDBY = 0x00
    const MAG3110_SYSMOD_ACTIVE_RAW = 0x01
    const MAG3110_SYSMOD_ACTIVE = 0x02
    const MAG3110_X_AXIS = 1
    const MAG3110_Y_AXIS = 3
    const MAG3110_Z_AXIS = 5

    const CALIBRATION_TIMEOUT = 5000 //timeout in milliseconds
    const DEG_PER_RAD = (180.0 / 3.14159265358979)


    let error = false;
    let x_scale = 0;
    let y_scale = 0;
    let calibrated = false;
    let x_offset = 0;
    let y_offset = 0;
    let x_min = 0;
    let x_max = 0;
    let y_min = 0;
    let y_max = 0;
    let timeLastChange = 0;
    let calibrationMode = false;
    let activeMode = false;
    let rawMode = false;

    function initialize(): boolean {
        reset();
        return true;
    }

    function dataReady(): number {
        return ((getreg(MAG3110_I2C_ADDRESS, MAG3110_DR_STATUS) & 0x8) >> 3);
    }

    let x = 0;
    let y = 0;
    let z = 0;

    //% block="SI02 magnetometer %u"    
    //% group="Variables"
    //% weight=74 blockGap=8
    export function readMag(u: axis): number {
        let val = 0;
        if (dataReady()) {
            let res = readBlock(MAG3110_I2C_ADDRESS, MAG3110_OUT_X_MSB, 6)
            basic.pause(2 / 1000);
            x = res[0] << 8 | res[1];
            y = res[2] << 8 | res[3];
            z = res[4] << 8 | res[5]

            if (u == axis.X) val = x * 0.1;
            if (u == axis.Y) val = y * 0.1;
            if (u == axis.Z) val = z * 0.1;
        } else val =NaN
        return val;
    }

    let x_u = 0;
    let y_u = 0;
    let z_u = 0;
    // function readMicroTeslas(): void {
    //     readMag();

    //     //Read each axis and scale to Teslas
    //     x_u = x * 0.1;
    //     y_u = y * 0.1;
    //     z_u = z * 0.1;
    // }

    // function readHeading(): number {
    //     readMag();
    //     let xf = x * 1.0;
    //     let yf = y * 1.0;
    //     //Calculate the heading
    //     return (Math.atan2(-y * y_scale, x * x_scale) * DEG_PER_RAD);
    // }
    function setDR_OS(DROS: number): void {
        let wasActive = activeMode;

        if (activeMode) enterStandby(); //Must be in standby to modify CTRL_REG1

        //If we attempt to write to CTRL_REG1 right after going into standby
        //It might fail to modify the other bits
        basic.pause(100);

        //Get the current control register
        let current = getreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG1) & 0x07; //And chop off the 5 MSB
        setreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG1, (current | DROS)); //Write back the register with new DR_OS set

        basic.pause(100);

        //Start sampling again if we were before
        if (wasActive) exitStandby();
    }

    function triggerMeasurement(): void {

        let current = getreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG1);
        setreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG1, (current | 0x02));
    }
    //Note that AUTO_MRST_EN will always read back as 0
    //Therefore we must explicitly set this bit every time we modify CTRL_REG2
    function rawData(raw: boolean): void {
        if (raw) //Turn on raw (non-user corrected) mode
        {
            rawMode = true;
            setreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG2, MAG3110_AUTO_MRST_EN | (0x01 << 5));
        }
        else //Turn off raw mode
        {
            rawMode = false;
            setreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG2, MAG3110_AUTO_MRST_EN & ~(0x01 << 5));
        }
    }
    //If you look at the datasheet, the offset registers are kind of strange
    //The offset is stored in the most significant 15 bits.
    //Bit 0 of the LSB register is always 0 for some reason...
    //So we have to left shift the values by 1
    //Ask me how confused I was...
    function setOffset(axis: number, offset: number): void {

        offset = offset << 1;

        let msbAddress = axis + 8;
        let lsbAddress = msbAddress + 1;

        setreg(MAG3110_I2C_ADDRESS, msbAddress, ((offset >> 8) & 0xFF));

        basic.pause(15);

        setreg(MAG3110_I2C_ADDRESS, lsbAddress, offset & 0xFF);
    }

    //See above
    function readOffset(axis: number): number {
        return (readAxis(axis + 8)) >> 1;
    }

    function start(): void {
        exitStandby();
    }

    function enterStandby(): void {
        activeMode = false;
        let current = getreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG1);
        //Clear bits 0 and 1 to enter low power standby mode
        setreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG1, (current & ~(0x3)));
    }

    function exitStandby(): void {
        activeMode = true;
        let current = getreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG1);
        setreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG1, (current | MAG3110_ACTIVE_MODE));

    }

    function isActive(): boolean {
        return activeMode;
    }

    function isRaw(): boolean {
        return rawMode;
    }

    function isCalibrated(): boolean {
        return calibrated;
    }

    function isCalibrating(): boolean {
        return calibrationMode;
    }

    function getSysMode(): number {
        return getreg(MAG3110_I2C_ADDRESS, MAG3110_SYSMOD);
    }
    function enterCalMode(): void {
        calibrationMode = true;
        //Starting values for calibration
        x_min = 32767;
        x_max = 0x8000;

        y_min = 32767;
        y_max = 0x8000;

        //Read raw readings for calibration
        rawData(true);

        calibrated = false;

        //Set to active mode, highest DROS for continous readings
        setDR_OS(MAG3110_DR_OS_80_16);
        if (!activeMode)
            start();
    }

    function reset(): void {
        enterStandby();
        setreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG1, 0x00); //Set everything to 0
        setreg(MAG3110_I2C_ADDRESS, MAG3110_CTRL_REG2, 0x80); //Enable Auto Mag Reset, non-raw mode

        calibrationMode = false;
        activeMode = false;
        rawMode = false;
        calibrated = false;

        setOffset(MAG3110_X_AXIS, 0);
        setOffset(MAG3110_Y_AXIS, 0);
        setOffset(MAG3110_Z_AXIS, 0);
    }

    //This is private because you must read each axis for the data ready bit to be cleared
    //It may be confusing for casual users
    function readAxis(axis: number): number {
        let lsbAddress = 0;
        let msbAddress = 0;
        let lsb = 0;
        let msb = 0;

        msbAddress = axis;
        lsbAddress = axis + 1;

        msb = getreg(MAG3110_I2C_ADDRESS, msbAddress);

        basic.pause(2); //needs at least 1.3us free time between start and stop

        lsb = getreg(MAG3110_I2C_ADDRESS, lsbAddress);

        let out = (lsb | (msb << 8)); //concatenate the MSB and LSB;
        return out;
    }



    /*************MMA8653***************/
    let _MMA_8653_FACTOR = 0;
    let _MMA_8653_PORTRAIT_LANDSCAPE = 0;
    const MMA_I2C_ADDR = 0x1D;

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

    function initMotion(): void {
        standby();
        setreg(MMA_I2C_ADDR, MMA_8653_FF_MT_CFG, MMA_8653_FF_MT_CFG_XYZ);
        setreg(MMA_I2C_ADDR, MMA_8653_FF_MT_THS, 0x04);
        setreg(MMA_I2C_ADDR, MMA_8653_FF_MT_COUNT, 0x00);
        setreg(MMA_I2C_ADDR, MMA_8653_CTRL_REG3, MMA_8653_CTRL_REG3_VALUE_OD);
        setreg(MMA_I2C_ADDR, MMA_8653_CTRL_REG4, MMA_8653_CTRL_REG4_VALUE_INT_FFMT);
        setreg(MMA_I2C_ADDR, MMA_8653_CTRL_REG5, MMA_8653_CTRL_REG4_VALUE_INT_FFMT);
        active();
        // return (_read_register(MMA_8653_PULSE_SRC) & MMA_8653_PULSE_SRC_EA);
    }

    function standby(): void {
        let reg1 = 0x00;
        reg1 = getreg(MMA_I2C_ADDR, MMA_8653_CTRL_REG1);
        setreg(MMA_I2C_ADDR, MMA_8653_CTRL_REG1, reg1 & ~MMA_8653_CTRL_REG1_VALUE_ACTIVE); // reset
    }

    function active(): void {
        let reg1 = 0x00;

        reg1 = getreg(MMA_I2C_ADDR, MMA_8653_CTRL_REG1)
        setreg(MMA_I2C_ADDR, MMA_8653_CTRL_REG2, 0x09)//reset
        setreg(MMA_I2C_ADDR, MMA_8653_CTRL_REG1, reg1 | MMA_8653_CTRL_REG1_VALUE_ACTIVE | (_highres ? 0 : MMA_8653_CTRL_REG1_VALUE_F_READ) | MMA_8653_ODR_6_25)
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

        let wai = getreg(MMA_I2C_ADDR, 0x0D); // Get Who Am I from the device.
        // return value for MMA8543Q is 0x3A

        setreg(MMA_I2C_ADDR, MMA_8653_CTRL_REG2, MMA_8653_CTRL_REG2_RESET)
        basic.pause(10); // Give it time to do the reset
        standby();

        if (_MMA_8653_PORTRAIT_LANDSCAPE) {
            setreg(MMA_I2C_ADDR, MMA_8653_PL_CFG, 0x80 | MMA_8653_PL_EN)
        }

        setreg(MMA_I2C_ADDR, MMA_8653_XYZ_DATA_CFG, MMA_8653_2G_MODE)
        if (_scale == 4 || _scale == 8) setreg(MMA_I2C_ADDR, MMA_8653_XYZ_DATA_CFG, (_scale == 4) ? MMA_8653_4G_MODE : MMA_8653_8G_MODE);
        else setreg(MMA_I2C_ADDR, MMA_8653_XYZ_DATA_CFG, MMA_8653_2G_MODE);
        active();
    }

    function getPLStatus(): number {
        return getreg(MMA_I2C_ADDR, MMA_8653_PL_STATUS);
    }

    function getPulse(): number {
        setreg(MMA_I2C_ADDR, MMA_8653_PULSE_CFG, MMA_8653_PULSE_CFG_ELE);
        return (getreg(MMA_I2C_ADDR, MMA_8653_PULSE_SRC) & MMA_8653_PULSE_SRC_EA);
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
    
    //% block="SI02 accelerometer %u"
    //% group="Variables"
    //% weight=74 blockGap=8
    export function getX(u: axis): number {
        let val=0;
        update()
        if (u==axis.X) val=_x;
        if (u==axis.Y) val=_y;
        if (u==axis.Z) val=_z;
        return pos2neg(val);
    }
    
//     //% block="SI02 acceleration x axis"
//     //% group="Variables"
//     //% weight=74 blockGap=8
//     export function getX(): number {
//         update()
//         return pos2neg(_x);
//     }

//     //% block="SI02 acceleration y axis"
//     //% group="Variables"
//     //% weight=74 blockGap=8
//     export function getY(): number {
//         update()
//         return pos2neg(_y);
//     }

//     //% block="SI02 acceleration z axis"
//     //% group="Variables"
//     //% weight=74 blockGap=8
//     export function getZ(): number {
//         update()
//         return pos2neg(_z);
//     }

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
        let res = readBlock(MMA_I2C_ADDR, 0x00, (_highres ? 7 : 4))
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
        let current_value = getreg(MMA_I2C_ADDR, 0x2D);

        if (on)
            current_value |= type_;
        else
            current_value &= ~(type_);

        setreg(MMA_I2C_ADDR, 0x2D, current_value);

        let current_routing_value = getreg(MMA_I2C_ADDR, 0x2E);

        if (pin == 1) {
            current_routing_value &= ~(type_);
        }
        else if (pin == 2) {
            current_routing_value |= type_;
        }

        setreg(MMA_I2C_ADDR, 0x2E, current_routing_value);
    }

    function disableAllInterrupts(): boolean {
        setreg(MMA_I2C_ADDR, 0x2D, 0);
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

    begin(false, 2);
    initialize();
    start();
}
