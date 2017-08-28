/* 

Chris Room Accessory Plugin for HomeBridge (https://github.com/nfarina/homebridge)

Remember to add accessory to config.json. Example:

"accessories": [
    {
        "accessory": "chris-room",
        "name": "Living Room",
        "url": "mqtt://10.0.0.9",
        "topic_t": "home/livingroom/temperature",
        "topic_h": "home/livingroom/humidity",
        "topic_a": "home/livingroom/airquality",
        "username": "username",
        "password": "password",
        "serial": "HMH-54D3X"
	}
],

*/

var Service, Characteristic;
var mqtt = require('mqtt');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-chris-room", "chris-room", ChrisRoomAccessory);
}

function ChrisRoomAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.url = config['url'];
  this.topic_t = config['topic_t'];
  this.topic_h = config['topic_h'];
  this.topic_a = config['topic_a'];
  this.client_Id = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
  this.options = {
    keepalive: 10,
    clientId: this.client_Id,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    serialnumber: config["serial"] || this.client_Id,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false
    },
    username: config["username"],
    password: config["password"],
    rejectUnauthorized: false
  };

  this.service_t = new Service.TemperatureSensor(this.name);
  this.service_h = new Service.HumiditySensor(this.name);
  this.service_a = new Service.AirQualitySensor(this.name);
  
  this.client  = mqtt.connect(this.url, this.options);  
  this.client.subscribe(this.topic_t);
  this.client.subscribe(this.topic_h);
  this.client.subscribe(this.topic_a);

  var that = this;
  this.client.on('message', function (topic, message) {
  
    data = JSON.parse(message);
    if (data === null) {return null}
    
    // Temperature
    if (topic.indexOf('/temperature') !== -1) {
      that.temperature = parseFloat(data);
      that.log(that.name, "- MQTT (temperature): ", that.temperature);
      that.service_t
        .setCharacteristic(Characteristic.CurrentTemperature, that.temperature);    
    }

    // Humidity
    if (topic.indexOf('/humidity') !== -1) {
      that.humidity = parseFloat(data);
      that.log(that.name, "- MQTT (humidity): ", that.humidity);
      that.service_h
        .setCharacteristic(Characteristic.CurrentRelativeHumidity, that.humidity);    
    }

    // Air Quality
    if (topic.indexOf('/airquality') !== -1) {
      that.airquality = parseFloat(data);
      that.log(that.name, "- MQTT (air quality): ", that.airquality);
      that.service_a
        .setCharacteristic(Characteristic.AirQuality, that.airquality);    
    }
    
  });

  this.service_t
    .getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', this.getState_t.bind(this));

  this.service_h
    .getCharacteristic(Characteristic.CurrentRelativeHumidity)
    .on('get', this.getState_h.bind(this));

  this.service_a
    .getCharacteristic(Characteristic.AirQuality)
    .on('get', this.getState_a.bind(this));
}

ChrisRoomAccessory.prototype.getState_t = function(callback) {
  this.log(this.name, "- MQTT (temperature) : ", this.temperature);
  callback(null, this.temperature);
}

ChrisRoomAccessory.prototype.getState_h = function(callback) {
  this.log(this.name, "- MQTT (humidity) : ", this.humidity);
  callback(null, this.humidity);
}

ChrisRoomAccessory.prototype.getState_a = function(callback) {
  this.log(this.name, "- MQTT (air quality) : ", this.airquality);
  callback(null, this.airquality);
}

ChrisRoomAccessory.prototype.getServices = function() {
  var informationService = new Service.AccessoryInformation();
  informationService
    .setCharacteristic(Characteristic.Manufacturer, "Christiaan Eggink")
    .setCharacteristic(Characteristic.Model, "Chris Room")
    .setCharacteristic(Characteristic.SerialNumber, this.options["serialnumber"]);

  return [informationService, this.service_t, this.service_h, this.service_a];
}
