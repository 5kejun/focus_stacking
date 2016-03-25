/*
  The MIT License (MIT)

  Copyright (c) 2016 Ivor Wanders

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
#ifndef FIRMWARE_CONFIG_H_
#define FIRMWARE_CONFIG_H_

// direction pin of stepper motor driver board
#define MOTOR_DIRECTION_PIN 15
// steps pin of stepper motor driver board.
#define MOTOR_STEPS_PIN 16

// if this is defined the motor stepper is ran in an isr using IntervalTimer.
#define USE_MOTOR_STEPPER_BACKGROUND

// Interval by which the interval timer is ran, in microseconds.
#define MOTOR_STEPPER_BACKGROUND_INTERVAL 200

// The MotorStepper speed is expressed as delay between the pulses. It
// starts at the MAX_WIDTH  and ramps up to MIN_WIDTH which is the fastest the
// stepper motor will move. Both are in milliseconds.

#define MOTOR_DEFAULT_MIN_WIDTH 1000
#define MOTOR_DEFAULT_MAX_WIDTH 4000

// The ramp up happens over the following number of steps:
#define MOTOR_DEFAULT_RAMP_LENGTH 100


// Focus pin of the camera, it is high when the focus is 'pressed'.
#define CAMERA_FOCUS_PIN 13

// shutter pin of the camera, high when 'pressed'.
#define CAMERA_SHUTTER_PIN 14

// Default parameters, delay & durations are in milliseconds

// Sets the duration to press the focus pin before the shutter is pressed
#define CAMERA_DEFAULT_FOCUS_DURATION 1000
// Sets the duration the shutter pin is held down after the focus duration.
#define CAMERA_DEFAULT_SHUTTER_DURATION 1000

// The delay before the photo in milliseconds
#define STACK_DEFAULT_DELAY_BEFORE_PHOTO 1000

// The delay after the photo in milliseconds
#define STACK_DEFAULT_DELAY_AFTER_PHOTO 200

// The direction and amount of steps to move per stack, negative is other way.
#define STACK_DEFAULT_MOVE_STEPS 200

// The number of stack steps to take (the number of movements and photos)
#define STACK_DEFAULT_STACK_COUNT 5

#define INTERFACE_DEFAULT_STATUS_INTERVAL 100


#endif  // FIRMWARE_CONFIG_H_