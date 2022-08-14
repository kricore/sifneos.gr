import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NgcCookieConsentService
} from "ngx-cookieconsent";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  constructor(    
    private ccService: NgcCookieConsentService,
  ){}

  title = 'sifneos';

  ngOnInit() : void {
  }
  ngOnDestroy() :void {
  }
}
