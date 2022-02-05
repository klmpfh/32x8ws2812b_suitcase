const setting = {
  ledout: {
    USBPort: process.platform == 'linux' ? '/dev/ttyUSB0' : 'COM5',
    leds_x: 32,
    leds_y: 8,
    colors_per_leds: 3,
    max_color_value: 256, // "under"
    intern_listen_port: 7001,
  },
};

module.exports = Object.freeze(setting);
