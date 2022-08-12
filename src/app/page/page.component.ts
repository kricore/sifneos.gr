import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiSrv : ApiService
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
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {

  }
}
