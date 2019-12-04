import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { MemberApiService } from '../../services/api/member-api.service';
import { Members } from 'src/app/models/member/members.model';
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

  constructor(
    private formBuilder: FormBuilder,
    private memberApi: MemberApiService
  ) { 
    this.memberForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      years: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    })
  }

  ngOnInit() {
    this.isSubmitted = false;
    this.isSuccess = false;

    this.getAllMembers();
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.memberForm.invalid) {
      return;
    }

    this.isSuccess = this.saveMember(this.memberForm);
  }

  getAllMembers() {
    this.memberApi.getAllMembers().subscribe(data => {
      this.memberList = data;
    });
  }

  saveMember(form: FormGroup) {
    let memberRq: MemberRQ = {
      id: form.controls.id.value,
      name: form.controls.name.value,
      years: form.controls.years.value
    };

    this.memberApi.saveMember(memberRq).subscribe(data => {
      if (data != null && data.id != null) {
        this.getAllMembers();
        this.clearForm();

        return true;
      }
    });

    return false;
  }

  editMember(e) {
    this.memberForm.get('id').setValue(e.id);
    this.memberForm.get('name').setValue(e.name);
    this.memberForm.get('years').setValue(e.years);    
  }

  deleteMember(e) {
    this.memberApi.deleteMember(e.id).subscribe(data => {
      this.getAllMembers();
        return true;
      }, error => {
        return false;
      });

    return false;
  }

  clearForm() {
    let control: AbstractControl = null;

    this.memberForm.reset();
    this.memberForm.markAsUntouched();
    Object.keys(this.memberForm.controls).forEach((name) => {
      control = this.memberForm.controls[name];
      control.setErrors(null);
    });
  }

}
