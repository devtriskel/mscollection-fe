import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { StyleApiService } from '../../services/api/style-api.service';
import { Styles } from 'src/app/models/style/styles.model';
import { StyleRQ } from 'src/app/models/style/style-rq.model';

@Component({
  selector: 'app-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.css']
})
export class StyleComponent implements OnInit {

  styleForm: FormGroup;
  isSubmitted: boolean;
  isSuccess: boolean;
  styleList: Styles;

  constructor(
    private formBuilder: FormBuilder,
    private styleApi: StyleApiService
  ) { 
    this.styleForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.isSubmitted = false;
    this.isSuccess = false;

    this.getAllStyles();
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.styleForm.invalid) {
      return;
    }

    this.isSuccess = this.saveStyle(this.styleForm);
  }

  getAllStyles() {
    this.styleApi.getAllStyles().subscribe(data => {
      this.styleList = data;
    });
  }

  saveStyle(form: FormGroup) {
    let styleRq: StyleRQ = {
      id: form.controls.id.value,
      name: form.controls.name.value
    };

    this.styleApi.saveStyle(styleRq).subscribe(data => {
      if (data != null && data.id != null) {
        this.getAllStyles();
        this.clearForm();

        return true;
      }
    });

    return false;
  }

  editStyle(e) {
    this.styleForm.get('id').setValue(e.id);
    this.styleForm.get('name').setValue(e.name);   
  }

  deleteStyle(e) {
    this.styleApi.deleteStyle(e.id).subscribe(data => {
      this.getAllStyles();
        return true;
      }, error => {
        return false;
      });

    return false;
  }

  clearForm() {
    let control: AbstractControl = null;

    this.styleForm.reset();
    this.styleForm.markAsUntouched();
    Object.keys(this.styleForm.controls).forEach((name) => {
      control = this.styleForm.controls[name];
      control.setErrors(null);
    });
  }

}
