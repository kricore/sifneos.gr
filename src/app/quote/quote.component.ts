import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit, OnDestroy {

  constructor(public apiSrv : ApiService) { }
  public isLoading : boolean = true;
  protected title : string = '';
  protected content : string = '';

  ngOnInit(): void {
    const { domain } = environment;
    this.apiSrv.getData(`${domain}/wp-json/wp/v2/quotes`)
      .subscribe(response => {
        if(response){
          const quote = response[0];
          this.title = quote.title.rendered;
          this.content = quote.content.rendered.replace(/(<([^>]+)>)/gi, "");
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {

  }
}
