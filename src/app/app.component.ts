import { Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  paused: boolean = true;
  recognition!: any;
  recognizedText: any[] = [];
  recLogs: any[] = [];

  constructor() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      try {
        this.initRecognition()
      } catch (error) {
        this.recLogs.push({
          type: "error",
          title: "Помилка ініціалізації розпізнавання мовлення",
          data: error
        })
      }
    } else {
      this.recLogs.push({
        type: "error",
        title: "Браузер не підтримує Web Speech API",
        data: null
      })
    }
  }

  initRecognition() {
    this.recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
    this.recognition.lang = 'en-US'; // Встановлюємо мову розпізнавання
    this.recognition.continuous = true; // Розпізнавання продовжується постійно

    // Функція, що викликається при успішному розпізнаванні мовлення
    this.recognition.onresult = function (event: any) {
      // var transcript = event.results[event.results.length - 1][0].transcript;
      const transcript = event.results[0][0].transcript;

      this.recognizedText.push({
        text: transcript,
        date: Date.now()
      })
      // Тут можна реалізувати логіку обробки розпізнаного тексту
    };

    // Функція, що викликається при помилці розпізнавання
    this.recognition.onerror = function (event: any) {
      this.recLogs.push({
        type: "error",
        title: "Помилка розпізнавання мовлення",
        data: event
      })
    };

    // Функція, що викликається при паузі у мовленні
    this.recognition.onpause = function (event: any) {
      this.recLogs.push({
        type: "log",
        title: "Розпізнавання призупинено. Запускаємо знову.",
        data: null
      })
      try {
        if (!this.paused())
          this.start(); // Поновлюємо розпізнавання
      } catch (error) {
        this.recLogs.push({
          type: "error",
          title: "Помилка при поновленні розпізнавання",
          data: error
        })
      }
    };
  }

  toggle() {
    if (this.paused) {
      this.start()
    } else {
      this.stop()
     
    }
  }

  start() {
    this.paused = false;
      this.recognition.start();
  }
  stop() {
    this.recognition.stop();
    this.paused = true;
  }
}
