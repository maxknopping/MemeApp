import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

constructor(private title: Title, private meta: Meta) { }

  setTitle(title: string) {
    this.title.setTitle(title);
  }

  updateTag(name: string, content: string) {
    this.meta.updateTag({name, content});
  }

  addTag(name: string, content: string) {
    this.meta.addTag({name: name, property: name, content});
  }

  removeTags() {
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:image'");
  }

}
