import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { StyleApiService } from '../../services/api/style-api.service';
import { Styles } from 'src/app/models/style/styles.model';
import { Style } from 'src/app/models/style/style.model';
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
    private styleApi: StyleApiService,
    private title: Title
  ) { 
    this.styleForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required]
    });

    this.title.setTitle('Estilos | Musify');
  }

  ngOnInit() {
    this.isSubmitted = false;
    this.isSuccess = false;

    this.getAllStyles();
  }

  // Submit event create or update a style
  onSubmit() {
    this.isSubmitted = true;

    if (this.styleForm.invalid) {
      return;
    }

    this.isSuccess = this.saveStyle(this.styleForm);
  }

  // Search styles from database (overload control on jpa)
  getAllStyles() {
    this.styleApi.getAllStyles().subscribe(data => {
      this.styleList = data;
    });
  }

  // Create or update a style
  saveStyle(form: FormGroup) {
    let styleRq: StyleRQ = {
      id: form.controls.id.value,
      name: form.controls.name.value
    };

    this.styleApi.saveStyle(styleRq).subscribe(data => {
      if (data != null && data.id != null) {
        this.getAllStyles();
        this.resetForm();

        return true;
      }
    });

    return false;
  }

  // Edit style just load his info back to the form
  editStyle(style: Style) {
    this.styleForm.get('id').setValue(style.id);
    this.styleForm.get('name').setValue(style.name);   
  }

  // Delete a style
  deleteStyle(style: Style) {
    this.styleApi.deleteStyle(style.id).subscribe(() => {
      this.getAllStyles();
      return true;
    }, error => {
      return false;
    });
  }

  // Clear form and controls after any succeeded process
  resetForm() {
    let control: AbstractControl = null;

    this.styleForm.reset();
    this.styleForm.markAsUntouched();
    Object.keys(this.styleForm.controls).forEach((name) => {
      control = this.styleForm.controls[name];
      control.setErrors(null);
    });
  }

}
