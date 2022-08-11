import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends PageComponent implements OnInit {

  /**
   * Make the path configurable so it can be overriden
   */
  override get requestPath() : string{
    const { domain } = environment;
    return `${domain}/wp-json/wp/v2/pages/9?_embed`;
  }


}
