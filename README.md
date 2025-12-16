# ADS1015 MakeCode Extension

This is a MakeCode extension for using the ADS1015 12-bit ADC with BBC micro:bit via I2C.

## Features

- Read single-ended ADC values (A0–A3)
- Select programmable gain
- Configure sample rate
- Convert raw ADC values to voltage

## Usage

1. Connect the ADS1015 to the micro:bit using I2C (SCL, SDA, GND, VCC)
2. Add this extension in MakeCode using the GitHub URL
3. Use the ADS1015 blocks from the Blocks toolbox

## Notes

- This extension uses I2C hardware.
- The MakeCode simulator does **not** support I2C devices.
- ADC reading blocks work **only on real hardware**.

## License

MIT License
