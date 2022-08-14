import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    public apiSrv : ApiService,   
    private meta : Meta,
    private titleSrv : Title
  ) { }

  public isLoading : boolean = true;
  protected title : string = '';
  protected content : string = '';
  protected image! : string | null;

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

    this.apiSrv.getData(this.requestPath)
      .subscribe(response => {
        console.warn(response);
        if(response){
          const page = {...response};
          this.title = page.title.rendered;
          this.content = page.content.rendered;
          this.image = page._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
          this.addOrUpdateMeta();
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
  addOrUpdateMeta(): void {
    const description = this.content.substring(0, 140);

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

  }
}
