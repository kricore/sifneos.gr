import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMenu]'
})
export class MenuDirective {

  constructor(private elem: ElementRef){}

  isOpen : boolean = false;

  @HostListener('click') toggleClass() : void {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  DocumentClick(event: Event) {
    if (!this.elem.nativeElement.contains(event.target)){
      // remove the popup
    }
  }
}
