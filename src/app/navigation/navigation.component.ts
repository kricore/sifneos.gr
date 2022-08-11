import { Component, OnInit, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewInit {

  private menuPosition: any;
  public sticky: boolean = false;
  public collapsed: boolean = false;

  @ViewChild('stickyMenu') menuElement!: ElementRef;

  @HostListener('window:scroll', ['$event'])
    handleScroll(){
      const windowScroll = window.pageYOffset;
      if(windowScroll > this.menuPosition){
          this.sticky = true;
      } else {
          this.sticky = false;
      }
  }

  @ViewChild('menu') menu!: ElementRef;
  @ViewChild('navButton') menuHandle!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Calculate the menu's initial position
   */
  ngAfterViewInit(){
    this.menuPosition = this.menuElement.nativeElement.offsetTop
  }

  /**
   * Smooth Scrolling
   * @param $element
   */
  scrollToElement($element : string): void {
    const element = document.getElementById($element);
    if(element){
      element.scrollIntoView(
        {
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        }
      );
    }
  }

  /**
   * Toggle Menu visibility
   * @param $event
   */
  toggleMenu($event: Event): void {
    $event.preventDefault();
    this.collapsed = !this.collapsed;
  }

}
