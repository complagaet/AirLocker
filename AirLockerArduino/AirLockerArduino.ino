#include <Servo.h>

#define LED_PIN 13
#define SERVO_PIN 10

char inChar;
Servo servo;


void setup() {
  pinMode(LED_PIN, OUTPUT); // Инициализация светодиода
  Serial.begin(115200); // Инициализация Serial - порта
  servo.attach(SERVO_PIN);
}

void loop() {
  if (Serial.available() > 0) {
    inChar = Serial.read();

    if (inChar == 'e') { 
      digitalWrite(LED_PIN,HIGH);
    }
  } else if (inChar == 'd') {
    digitalWrite(LED_PIN,LOW);
  } else if (inChar == 'b') {
    digitalWrite(LED_PIN,HIGH);
    delay(1000);

    digitalWrite(LED_PIN,LOW);
    delay(1000);
  } else if (inChar == 'z') {
    servo.write(0); 
  } else if (inChar == 'h') {
    servo.write(90);
  }
}