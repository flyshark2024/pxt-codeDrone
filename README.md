# CodeDrone
![](https://raw.githubusercontent.com/flyshark2024/MicrbitDrone/master/image.jpg)

CodeDrone is a DIY STEAM drone that uses the micro:bit for programming and flight control.

The micro:bit can be used to implement basic flight control functions for drone, including altitude hold, waypoint navigation, speed control, turning, and rotation.

This extension is designed to programme and drive the drone, You can [get CodeDrone from the GigoToys store](https://www.gigotoys.com/products/1413-en.html)

## Basic usage
* To initialize the drone
```JavaScript
drone.initModule()
```
* Basic command of drone, take off
```JavaScript
drone.takeOffAction()
```
* Basic command of drone, landing
```JavaScript
drone.landingAction()
```
* Move command, up and down, left and right, front and back
```JavaScript
drone.moveAction(drone.DirectionOptions.Forward, 100)
```
* Rotation command, left to right
```JavaScript
drone.rotationAction(drone.AngleOptions.Left, 0)
```
* Get the height of the drone
```JavaScript
drone.droneHeight()
```
* Get the voltage of the drone
```JavaScript
drone.droneVoltage()
```

## Code Example
```JavaScript
drone.initModule()
drone.takeOffAction()
drone.moveAction(drone.DirectionOptions.Forward, 100)
basic.forever(function () {
    if (drone.droneVoltage() > 3.5) {
        drone.moveAction(drone.DirectionOptions.Forward, 100)
    } else {
        drone.landingAction()
    }
})

```
## Supported targets

* for PXT/microbit

(The metadata above is needed for package search.)

## License
MIT

