import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, Subject, map } from "rxjs";
import { catchError, retry } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { Image } from "../gallery/image.interface";


@Injectable({
  providedIn: "root"
})
export class ApiService {

  constructor(protected http: HttpClient){}

  private media: Array<Image> = [];;
  private mediaUpdated = new Subject<{ media: Image[]}>;

  getData(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
        catchError( (err: any, caught: Observable<any> ) => {
            return throwError(this.handleError(err, caught))
          }
        )
      );
    }

  public handleError(error: HttpErrorResponse, caught: any) : Observable<any>{
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /**
   * Submit the form to the WordPress backend
   * @param payload
   * @returns
   */
  submitContactForm(payload: { [key: string]: any }) : Observable<any> {
    const postData = new FormData;
    const {domain} = environment;

    for(let dataKey in payload) {
      postData.append(dataKey, payload[dataKey]);
    }

    return this.http
      .post<{message: string;}>(`${domain}/wp-json/contact-form-7/v1/contact-forms/22/feedback`, postData)
        .pipe(
          catchError(
              (error, caught: Observable<any>) => this.handleError(error, caught)
            )
        );
  }

  /**
   * Get all posts and format them
   * to our internal model
   *
   * @param page
   */
     getMedia(): void {
      const { domain } = environment;
      this.http.get<{ message: string, posts: any }>(`${domain}/wp-json/wp/v2/media_gallery?_embed`)
        .pipe(
          map((response : {[key : string]: any}) => {
            return {
              media: response["map"]((post : { [key: string] : any }) => {
                  return this.getMediaImageURL(post);
              })
            }
          })
        )
        .subscribe((posts : any) => {
          this.media = posts['media'];
          this.mediaUpdated.next({
            media: [
              ...this.media
            ]
          })
        });
    }

  /**
   * Transform the image into out model
   * @param post
   * @returns
   */
  getMediaImageURL(post: { [key: string] : any }): Image {
    const p = <any>{};

    post["_embedded"]["wp:featuredmedia"]['forEach']((media : { [key: string] : any }) => {
        p.url =  media['media_details']['sizes']['medium']['source_url'];
        p.url_b = media['media_details']['sizes']['large']['source_url'] ?? p.url;
        p.alt = media['title']['rendered'];
        p.id = media['id'];
        p.title =  media['title']['rendered'];
    });

    return p;
  }

  /**
   * Return the clone of the subject as an Observable
   * @returns
   */
  getMediaListener() : Observable<{ media: Image[]}> {
    return this.mediaUpdated && this.mediaUpdated.asObservable();
  }
}
