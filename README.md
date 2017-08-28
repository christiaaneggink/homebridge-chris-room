# homebridge-chris-room
Chris Room Accessory Plugin for HomeBridge

Installation
--------------------
    sudo npm install -g homebridge-mqtt-humidity


Sample HomeBridge Configuration
--------------------
    {
      "bridge": {
        "name": "HomeBridge",
        "username": "CC:33:3B:D3:CE:32",
        "port": 51826,
        "pin": "321-45-123"
      },

      "description": "",

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

      "platforms": []
    }

#### Credits

[homebridge-mqtt-humidity](https://github.com/mcchots/homebridge-mqtt-humidity)
