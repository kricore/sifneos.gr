import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: {id: '9'} },
  { path: 'bio', component: PageComponent, data: {id: '7'} },
  { path: 'gallery', component: PageComponent, data: {id: '20'} },
  { path: 'videos', component: PageComponent, data: {id: '28'} },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
