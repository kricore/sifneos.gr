import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuDirective } from './menu.directive';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ContactComponent } from './contact/contact.component';
import { NavigationComponent } from './navigation/navigation.component';
import { QuoteComponent } from './quote/quote.component';
import { FooterComponent } from './footer/footer.component';
import { SocialComponent } from './social/social.component';
import { PopupDirective } from './popup.directive';
import { PopupComponent } from './popup/popup.component';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { PageComponent } from './page/page.component';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { LoaderComponent } from './shared/loader/loader.component';
import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: 'sifneos.gr' // or 'your.domain.com' 
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#f1d600'
    }
  },
  theme: 'edgeless',
  type: 'opt-out'
};

@NgModule({
  declarations: [
    AppComponent,
    MenuDirective,
    HomeComponent,
    GalleryComponent,
    ContactComponent,
    NavigationComponent,
    QuoteComponent,
    FooterComponent,
    SocialComponent,
    PopupDirective,
    PopupComponent,
    PageComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxGoogleAnalyticsModule.forRoot('MEASUREMENT-ID'),
    NgxGoogleAnalyticsRouterModule,
    ReactiveFormsModule,
    NgcCookieConsentModule.forRoot(cookieConfig),

  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
