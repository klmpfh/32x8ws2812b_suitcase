#include <FastLED.h>

#define DATA_PIN 6
#define CLOCK_PIN 13

const int NUM_LEDS = 32 * 8;

const int BUFFER_SIZE = NUM_LEDS * 3;
char buf[BUFFER_SIZE];

CRGB leds[NUM_LEDS];

void setup() {

  // initial Serial com
  Serial.begin(115200);

  // setup FastLED
  FastLED.addLeds<WS2812B, DATA_PIN, GRB>(leds, NUM_LEDS);

  // waiting 4 Serial is ready
  while(!Serial) delay(1);
  
}

void loop() { 

  // if a full LED-package is available ...
  if(Serial.available() == BUFFER_SIZE){
    // ... read ...
    int rlen = Serial.readBytes(buf, BUFFER_SIZE);

    for(int i = 0; i < rlen; i++){
      const int led = i / 3;
      const int color = i % 3;
      leds[led][color] = buf[i];
    }
  }

  FastLED.show();
  FastLED.delay(5);

}
