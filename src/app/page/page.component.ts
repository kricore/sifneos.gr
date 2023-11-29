import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

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
    private sanitizer: DomSanitizer,
    private meta : Meta,
    private titleSrv : Title
  ) { }

  public isLoading : boolean = true;
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
          this.addOrUpdateMeta(page.content.rendered);
          this.setPageTitle();
          this.isLoading = false;
        }
      });
  }

  /**
   * Add a custom suffix
   */
  get pageTitle() : string {
    return `${this.title} - Pavlos Sifneos Pianist`;
  }

  /**
   * Basic SEO
   * Add or update basic meta-tags
   */
  addOrUpdateMeta(c: string): void {
    // Function to strip HTML tags
    const stripHtmlTags = (html: string): SafeHtml => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return this.sanitizer.bypassSecurityTrustHtml(doc.body.textContent || '');
    };

    const description = stripHtmlTags(c).toString().substring(0, 140);

    if(this.meta.getTag('description')){
      this.meta.updateTag({ name: "description", content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'title', content: this.pageTitle });
      this.meta.updateTag({ property: 'og:title', content: this.pageTitle});
      this.meta.updateTag({ property: 'og:type', content: 'website' });
    }
    else {
      this.meta.addTags([
        { name: "description", content: description },
        { property: 'og:description', content: description },
        { name: 'title', content: this.pageTitle },
        { property: 'og:title', content: this.pageTitle },
        { property: 'og:type', content: 'website' },
        { name: 'author', content: 'Pavlos Sifneos Pianist' },
        { property: 'og:author', content: 'Pavlos Sifneos Pianist' }
      ]);
    }
  }

  setPageTitle() : void {
    this.titleSrv.setTitle(this.pageTitle);
  }

  ngOnDestroy(): void {
      this.dataSubscription.unsubscribe();
  }
}
