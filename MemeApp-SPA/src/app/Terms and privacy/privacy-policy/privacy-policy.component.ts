import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document,
  private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.setStyle(this.document.body, 'background-color', 'black');
  }

}
