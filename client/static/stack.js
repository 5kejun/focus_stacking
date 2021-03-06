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

var Stack = function () {
    this.connected = false;
    this.dispatchers = {
        fallback: function(command, payload){
            console.log("Unhandled command: " + command + " payload:");
            console.log(payload);
        },
        
        onopen: function(){
            console.log("Websocket open");
        },
        onclose: function(){
            console.log("Websocket closed");
        },
        
    };
};

Stack.prototype.open = function(address){
    var self = this;
    this.address = address;
    try {
        this.socket = new WebSocket("ws://" + address);
        this.socket.onclose = function(){
            Stack.prototype.onclose.call(self);
        };
        this.socket.onopen = function(){
            Stack.prototype.onopen.call(self);
        };
        this.socket.onmessage = function(msg){
            Stack.prototype.onmessage.call(self, msg);
        };
    } catch(exception){
        console.log("Failure: " + exception);
    }
}

Stack.prototype.reconnect = function(){
    this.open(this.address);
}

Stack.prototype.send = function(msgtype, data) {
    if (this.connected == true) {
        console.log("Sending over websocket:" + JSON.stringify([msgtype, data]));
        this.socket.send(JSON.stringify([msgtype, data]));
    } else {
        console.log("Sending without websocket port.");
    }
};

Stack.prototype.onclose = function() {
    this.connected = false;
    var self = this;
    this.dispatchers.onclose();
    // try to reconnect.
    setTimeout(function() {
      self.reconnect();
    }, 1000)
};
Stack.prototype.onopen = function() {
    this.connected = true;
    this.dispatchers.onopen();
    Stack.prototype.getSerialStatus.call(this);
};
Stack.prototype.onmessage = function(msg) {
    decoded = $.parseJSON(msg.data);
    var commandtype = decoded[0];
    var payload = decoded[1];

    var command;
    if (commandtype == "serial"){
        // console.log("Serial command");
        // console.log(payload);
        command = "serial_" + payload["msg_type"]
    } else {
        command = commandtype
    }
    // try to dispatch registered functions
    if (command in this.dispatchers) {
        this.dispatchers[command](command, payload);
    } else {
        this.dispatchers.fallback(command, payload);
    }
};

Stack.prototype.connectSerial = function (device) {
    this.send("connect_serial", {device:device});
}

Stack.prototype.getSerialStatus = function(){
    this.send("get_serial_status", "");
}

Stack.prototype.attachCommandHandler = function (command, fun){
    this.dispatchers[command] = fun;
}

// commands starting with serial_ are in underscore naming convention
// so that they are clearly distinguishable.
Stack.prototype.serial_get_version = function(){
    this.send("serial", {"msg_type":"get_version"});
}

Stack.prototype.serial_get_config = function(){
    this.send("serial", {"msg_type":"get_config"});
}

Stack.prototype.serial_set_config = function(config){
    this.send("serial", {"msg_type":"set_config", "config":config});
}


Stack.prototype.serial_action_motor = function(steps){
    this.send("serial", {"msg_type":"action_motor", "action_motor":{"steps":steps}});
}

Stack.prototype.serial_action_stack = function(){
    this.send("serial", {"msg_type":"action_stack"});
}

Stack.prototype.serial_action_stop = function(){
    this.send("serial", {"msg_type":"action_stop"});
}

Stack.prototype.serial_action_photo = function(steps){
    this.send("serial", {"msg_type":"action_photo"});
}

Stack.prototype.flatten_config = function (cfg) {
    var flat_config = {};
    flat_config["motor_min_width"] = cfg.motor.min_width;
    flat_config["motor_max_width"] = cfg.motor.max_width;
    flat_config["motor_ramp_length"] = cfg.motor.ramp_length;

    flat_config["camera_shutter_duration"] = cfg.camera.shutter_duration;
    flat_config["camera_focus_duration"] = cfg.camera.focus_duration;

    flat_config["stack_stack_count"] = cfg.stack.stack_count;
    flat_config["stack_delay_after_photo"] = cfg.stack.delay_after_photo;
    flat_config["stack_delay_before_photo"] = cfg.stack.delay_before_photo;
    flat_config["stack_stack_count"] = cfg.stack.stack_count;
    flat_config["stack_move_steps"] = cfg.stack.move_steps;

    flat_config["interface_status_interval"] = cfg.interface.status_interval;
    flat_config["interface_buzzer_frequency"] = cfg.interface.buzzer_frequency;
    flat_config["interface_buzzer_duration"] = cfg.interface.buzzer_duration;
    flat_config["interface_ui_transmission_ratio"] = cfg.interface.ui_transmission_ratio;

    return flat_config;
}
Stack.prototype.unflatten_config = function (flat_config) {
    var cfg = {motor:{}, camera:{}, stack:{}, interface:{}};
    cfg.motor.min_width = flat_config["motor_min_width"];
    cfg.motor.max_width = flat_config["motor_max_width"];
    cfg.motor.ramp_length = flat_config["motor_ramp_length"];

    cfg.camera.shutter_duration = flat_config["camera_shutter_duration"];
    cfg.camera.focus_duration = flat_config["camera_focus_duration"];

    cfg.stack.stack_count = flat_config["stack_stack_count"];
    cfg.stack.delay_after_photo = flat_config["stack_delay_after_photo"];
    cfg.stack.delay_before_photo = flat_config["stack_delay_before_photo"];
    cfg.stack.stack_count = flat_config["stack_stack_count"];
    cfg.stack.move_steps = flat_config["stack_move_steps"];

    cfg.interface.status_interval = flat_config["interface_status_interval"];
    cfg.interface.ui_transmission_ratio = flat_config["interface_ui_transmission_ratio"];
    cfg.interface.buzzer_frequency = flat_config["interface_buzzer_frequency"];
    cfg.interface.buzzer_duration = flat_config["interface_buzzer_duration"];

    return cfg;
}
