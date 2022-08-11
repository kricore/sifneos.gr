import { Component, EventEmitter,
  HostBinding, Input, Output, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  private _image: string = '';
  private _alt: string = '';
  protected defaultTouch = { x: 0, y: 0, time: 0 };

  // @HostBinding('@state')
  // state: 'opened' | 'closed' = 'closed';

  @Input()
  get image(): string {
    return this._image;
  }
  set image(image: string){
    this._image = image;
    // this.state = 'opened';
  }
  set alt(alt: string){
    this._alt = alt;
  }

  @Output()
  close = new EventEmitter<void>();

  @Output()
  next = new EventEmitter<void>();

  @Output()
  previous = new EventEmitter<void>();

  /**
   * Bind Keypress to events
   * @param event
   */
  @HostListener('document:keydown', ['$event'])
  handleNavigation(event: KeyboardEvent){
    if(event['key'] === 'ArrowRight'){
      this.next.next();
    }
    if(event['key'] === 'ArrowLeft'){
      this.previous.next();
    }
    if(event['key'] === 'Escape'){
      this.close.next();
    }
  }

  /**
   * Bind swipe vents
   * @param event
   */
  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  handleTouch(event: any) : void {
      let touch = event.touches[0] || event.changedTouches[0];
      // check the events
      if (event.type === 'touchstart') {
          this.defaultTouch.x = touch.pageX;
          this.defaultTouch.y = touch.pageY;
          this.defaultTouch.time = event.timeStamp;
      } else if (event.type === 'touchend') {
          let deltaX = touch.pageX - this.defaultTouch.x;
          let deltaY = touch.pageY - this.defaultTouch.y;
          let deltaTime = event.timeStamp - this.defaultTouch.time;

          // simulte a swipe -> less than 500 ms and more than 60 px
          if (deltaTime < 500) {
              // touch movement lasted less than 500 ms
              if (Math.abs(deltaX) > 60) {
                  // delta x is at least 60 pixels
                  if (deltaX > 0) {
                    this.next.next();
                  }
                  else {
                    this.previous.next();
                  }
              }

              if (Math.abs(deltaY) > 60) {
                  // delta y is at least 60 pixels
                  if (deltaY > 0) {
                      // down
                      this.close.next();
                  }
                  else {
                     // up
                     this.close.next();
                  }
              }
          }
      }
  }

  ngOnInit(): void {
    console.log('popup opened');
  }

}
