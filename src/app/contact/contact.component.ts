import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  form: any = null;
  isValid: boolean = false;
  hasError: boolean = false;
  success: boolean = false;
  isSubmiting: boolean = false;

  constructor(public apiSrv: ApiService){}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
        ]
      }),
      message: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)],
      })
    });
  }

  /**
   * Wrap the payload into CF7's format
   * @returns
   */
  preparePayload() : {[key: string] : any }{
    return {
      "_wpcf7": 22,
      "_wpcf7_version": "5.6.2",
      "_wpcf7_locale": "en_US",
      "_wpcf7_unit_tag": "wpcf7-f22-p9-o1",
      "_wpcf7_container_post": 9,
      "_wpcf7_posted_data_hash": "",
      "your-name": this.form.get('name').value,
      "your-email": this.form.get('email').value,
      "your-message": this.form.get('message').value,
      "your-subject": 'Message from sifneos.gr'
    }
  }

  /**
   * Performs the actual HTTP post
   * @returns {}
   */
  onSendRequest(): void {

    if(this.form.invalid){
      return;
    }
    this.isSubmiting = true;
    this.success = false;
    this.hasError = false;

    const payload = this.preparePayload();
    this.apiSrv.submitContactForm(payload)
      .subscribe(
        {
          next: (v) => {
            this.form.reset();
            this.success = true;
            console.log(v)
          },
          error: (e) => {
            this.hasError = true;
            console.error(e)
          },
          complete: () => {
            console.info('complete');
            this.isSubmiting = false;
          }
        }
      )
  }
}
