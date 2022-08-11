import { Component,
         OnInit,
         OnDestroy,
         ComponentFactoryResolver,
         ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupComponent } from '../popup/popup.component';
import { PopupDirective } from '../popup.directive';
import { ApiService } from '../api/api.service';
import { Image } from './image.interface';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {

  constructor(
    public apiSrv: ApiService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  @ViewChild(PopupDirective, { static: false }) alertHost!: PopupDirective;

  images: Image[] = [];
  private closeSub!: Subscription;
  private nextSub!: Subscription;
  private previousSub!: Subscription;
  public isloading : boolean = true;
  private mediaSub!: Subscription;

  /**
   * Make the api call and construct the gallery
   */
  ngOnInit(): void {
    this.isloading = true;
    this.apiSrv.getMedia();
    this.mediaSub = this.apiSrv
      .getMediaListener()
      .subscribe(response => {
        this.isloading = false;
        this.images = response.media;
      });
  }

  /**
   * Remove the subscription on unmounting
   */
  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }

  /**
   * Load The popup on click
   * @param image
   */
  loadPopup(image : Image) {
    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      PopupComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.image = image['url_b'];
    componentRef.instance.alt = image['alt'];

    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      this.nextSub.unsubscribe();
      this.previousSub.unsubscribe();
      hostViewContainerRef.clear();
    });

    this.nextSub = componentRef.instance.next.subscribe(() => {
      this.loadNextImage(image['id']);
    });

    this.previousSub = componentRef.instance.previous.subscribe(() => {
      this.loadPreviousImage(image['id']);
    });
  }

  /**
   * Image Navigation
   * @param id
   */
  loadNextImage(id: number){
    const imageToLoad = this.images.find(i => i['id'] === id);
    if(imageToLoad){
      const index = this.images.indexOf(imageToLoad);
      if(index === this.images.length - 1){
        this.loadPopup(this.images[0]);
      }
      else {
        this.loadPopup(this.images[index + 1]);
      }
    }
  }

  loadPreviousImage(id: number){
    const imageToLoad = this.images.find(i => i['id'] === id);
    if(imageToLoad){
      const index = this.images.indexOf(imageToLoad);
      if(index === 0){
        this.loadPopup(this.images[this.images.length - 1]);
      }
      else {
        this.loadPopup(this.images[index - 1]);
      }
    }
  }

}
