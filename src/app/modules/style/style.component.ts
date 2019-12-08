import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

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

  saveLabel: string = 'Guardar';
  savedLabel: string[] = ['Error al guardar', 'Guardado con éxito'];
  deletedLabel: string[] = ['Error al eliminar', 'Eliminado con éxito'];

  constructor(
    private formBuilder: FormBuilder,
    private styleApi: StyleApiService,
    private title: Title,
    private toastr: ToastrService
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

    this.saveStyle(this.styleForm);
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
        this.toastr.success(this.savedLabel[1]);
        this.getAllStyles();
        this.resetForm();
      } else{
        this.toastr.error(this.savedLabel[0]);
        this.isSuccess = false;
      }
    });
  }

  // Edit style just load his info back to the form
  editStyle(style: Style) {
    this.saveLabel = 'Actualizar';
    this.styleForm.get('id').setValue(style.id);
    this.styleForm.get('name').setValue(style.name);
  }

  // Delete a style
  deleteStyle(style: Style) {
    this.styleApi.deleteStyle(style.id).subscribe(() => {
      this.toastr.success(this.deletedLabel[1]);
      this.getAllStyles();
    }, error => {
      this.toastr.error(this.deletedLabel[0]);
    });
  }

  // Clear form and controls after any succeeded process
  resetForm() {
    this.saveLabel = 'Guardar';
    this.isSubmitted = false;
    this.isSuccess = false;
    this.styleForm.reset();
  }

}
