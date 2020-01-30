basic.forever(function () {
    basic.showNumber(SI02.readMag(SI02.axis.X))
    basic.showNumber(SI02.readMag(SI02.axis.Y))
    basic.showNumber(SI02.readMag(SI02.axis.Z))
    basic.showNumber(SI02.getX(SI02.axis.X))
    basic.showNumber(SI02.getX(SI02.axis.Y))
    basic.showNumber(SI02.getX(SI02.axis.Z))
    basic.pause(100)
})
