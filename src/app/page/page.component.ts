import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiSrv : ApiService,
    private sanitizer: DomSanitizer
  ) { }

  public isLoading : boolean = false;
  protected title : string = '';
  protected content : SafeHtml = '';
  protected image! : string | null;
  private dataSubscription!: Subscription;

  id: string = '';

  /**
   * Make the path configurable so it can be overriden
   */
  get requestPath() : string{
    const { domain } = environment;
    return `${domain}/wp-json/wp/v2/pages/${this.id}`;
  }

  /**
   * Construct the URL and fecth the data
   */
  ngOnInit(): void {
    this.id = this.route.snapshot.data['id'];

    this.dataSubscription = this.apiSrv.getData(this.requestPath)
      .subscribe(response => {
        if(response){
          const page = {...response};
          this.title = page.title.rendered;
          this.content = this.sanitizer.bypassSecurityTrustHtml(page.content.rendered);
          this.image = page._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
        }
      });
  }

  ngOnDestroy(): void {
      this.dataSubscription.unsubscribe();
  }
}
