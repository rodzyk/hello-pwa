import { ChangeDetectorRef, Component, HostListener, OnInit, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  paused: boolean = true;
  recognition!: any;
  recognizedText: any[] = [];
  recLogs: any[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }
  ngOnInit(): void {
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

  data: any;

  @HostListener('window:message', ['$event'])
  message(event: MessageEvent) {
    this.data = event.data
  }

  initRecognition() {

    const that = this;

    this.recLogs.push({
      type: "log",
      title: "Почалася ініціаліція розпізнавання мовлення",
      data: null
    })
    this.recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
    this.recognition.lang = 'en-US'; // Встановлюємо мову розпізнавання
    // this.recognition.continuous = true; // Розпізнавання продовжується постійно

    // Функція, що викликається при успішному розпізнаванні мовлення
    this.recognition.onresult = (event: any) => {
      var transcript = event.results[event.results.length - 1][0].transcript;
      console.log(transcript);

      that.recognizedText.push({
        text: transcript,
        date: Date.now()
      })
      this.changeDetectorRef.detectChanges();
      this.recognition.start();
      // Тут можна реалізувати логіку обробки розпізнаного тексту
    };

    // Функція, що викликається при помилці розпізнавання
    this.recognition.onerror = (event: any) =>{
      this.onRecError(event)
    }

    // Функція, що викликається при паузі у мовленні
    this.recognition.onpause = (event: any) => {
      that.recLogs.push({
        type: "log",
        title: "Розпізнавання призупинено. Запускаємо знову.",
        data: null
      })
      this.changeDetectorRef.detectChanges();
      try {
        this.start(); // Поновлюємо розпізнавання
      } catch (error) {
        console.error('Помилка  при поновленні розпізнавання', error);
        that.recLogs.push({
          type: "error",
          title: "Помилка при поновленні розпізнавання",
          data: error
        })
        this.changeDetectorRef.detectChanges();
      }
    };
    this.recLogs.push({
      type: "log",
      title: "Зікінчилася ініціаліція розпізнавання мовлення",
      data: null
    })
  }

  onRecError(event: any) {
    this.recLogs.push({
      type: "error",
      title: "Помилка розпізнавання мовлення",
      data: event?.error
    })
    this.changeDetectorRef.detectChanges();
    console.error('Помилка розпізнавання мовлення', event?.error);
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
    this.recLogs.push({
      type: "log",
      title: "Старт розпізнавання мовлення",
      data: null
    })
  }
  stop() {
    this.recognition.stop();
    this.paused = true;
    this.recLogs.push({
      type: "log",
      title: "Стоп розпізнавання мовлення",
      data: null
    })
  }
}
