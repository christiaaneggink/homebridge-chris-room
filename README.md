# homebridge-chris-room
Chris Room Accessory Plugin for HomeBridge

Installation
--------------------
    sudo npm install -g homebridge-chris-room


Sample HomeBridge Configuration
--------------------
    {
      "bridge": {
        "name": "HomeBridge",
        "username": "AA:11:BB:22:CC:33",
        "port": 51826,
        "pin": "123-45-678"
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
              "topic_tvoc": "home/livingroom/tvoc",
              "topic_co2": "home/livingroom/co2",
              "topic_batt_chg": "home/livingroom/batt_charging",
              "topic_batt_lvl": "home/livingroom/batt_level",
              "topic_batt_low": "home/livingroom/batt_low",
              "mysql_prefix": "livingroom",
              "mysql_host": "localhost",
              "mysql_user": "********",
              "mysql_pwd": "********",
              "mysql_db": "********",
              "serial": "CR001-001"
          }
      ],

      "platforms": []
    }

#### Credits

[homebridge-mqtt-humidity](https://github.com/mcchots/homebridge-mqtt-humidity)