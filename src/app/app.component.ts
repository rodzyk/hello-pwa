import { Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

const MANIFESTS = {
  en: "manifest.webmanifest",
  uk: "manifest-uk.webmanifest"
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  lang: string = localStorage.getItem("lang") ?? "en"

  linkElement: WritableSignal<HTMLElement | null> = signal(document.querySelector('link[rel="manifest"]'))

  constructor() {
    this.changeManifest();
  }

  toggleLang() {
    this.lang = this.lang == 'en' ? 'uk' : 'en';

    localStorage.setItem("lang", this.lang)

    this.changeManifest()
  }

  changeManifest() {
    this.linkElement()?.setAttribute('href', MANIFESTS[this.lang as keyof { en: string; uk: string; }]);
  }

  registerProtocolHandler() {
    (navigator as any).registerProtocolHandler("web+hellopwa", "/%s")
  }
}
