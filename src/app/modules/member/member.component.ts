import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

import { MemberApiService } from '../../services/api/member-api.service';
import { Members } from 'src/app/models/member/members.model';
import { Member } from 'src/app/models/member/member.model';
import { MemberRQ } from 'src/app/models/member/member-rq.model';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  memberForm: FormGroup;
  isSubmitted: boolean;
  isSuccess: boolean;
  memberList: Members;

  saveLabel: string = 'Guardar';
  savedLabel: string[] = ['Error al guardar', 'Guardado con éxito'];
  deletedLabel: string[] = ['Error al eliminar', 'Eliminado con éxito'];

  constructor(
    private formBuilder: FormBuilder,
    private memberApi: MemberApiService,
    private title: Title,
    private toastr: ToastrService
  ) { 
    this.memberForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      years: ['', Validators.pattern('^[0-9]*$')]
    });

    this.title.setTitle('Miembros | Musify');
  }

  ngOnInit() {
    this.isSubmitted = false;
    this.isSuccess = false;

    this.getAllMembers();
  }

  // Submit event create or update a member
  onSubmit() {
    this.isSubmitted = true;

    if (this.memberForm.invalid) {
      return;
    }

    this.saveMember(this.memberForm);
  }

  // Search members from database (overload control on jpa)
  getAllMembers() {
    this.memberApi.getAllMembers().subscribe(data => {
      this.memberList = data;
    });
  }

  // Create or update a member
  saveMember(form: FormGroup) {
    let memberRq: MemberRQ = {
      id: form.controls.id.value,
      name: form.controls.name.value,
      years: form.controls.years.value
    };

    this.memberApi.saveMember(memberRq).subscribe(data => {
      if (data != null && data.id != null) {
        this.toastr.success(this.savedLabel[1]);
        this.getAllMembers();
        this.resetForm();
      } else{
        this.toastr.error(this.savedLabel[0]);
        this.isSuccess = false;
      }
    });
  }

  // Edit member just load his info back to the form
  editMember(member: Member) {
    this.saveLabel = 'Actualizar';
    this.memberForm.get('id').setValue(member.id);
    this.memberForm.get('name').setValue(member.name);
    this.memberForm.get('years').setValue(member.years);
  }

  // Delete a member
  deleteMember(member: Member) {
    this.memberApi.deleteMember(member.id).subscribe(() => {
      this.toastr.success(this.deletedLabel[1]);
      this.getAllMembers();
    }, error => {
      this.toastr.error(this.deletedLabel[0]);
    });
  }

  // Clear form and controls after any succeeded process
  resetForm() {
    this.saveLabel = 'Guardar';
    this.isSubmitted = false;
    this.isSuccess = false;
    this.memberForm.reset();
  }

}
