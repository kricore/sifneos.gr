import { Directive,
        HostListener,
        ElementRef,
        ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[appPopup]'
})
export class PopupDirective {

  constructor(
    private elem: ElementRef,
    public viewContainerRef: ViewContainerRef
  ) { }

  @HostListener('document:click', ['$event'])
  DocumentClick(event: Event) {
    if (!this.elem.nativeElement.contains(event.target)){
      // debugger;
      // this.viewContainerRef.clear();
    }
  }

}
