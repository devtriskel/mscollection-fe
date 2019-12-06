import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

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

  // Submit event create or update a member
  onSubmit() {
    this.isSubmitted = true;

    if (this.memberForm.invalid) {
      return;
    }

    this.isSuccess = this.saveMember(this.memberForm);
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
        this.getAllMembers();
        this.resetForm();

        return true;
      }
    });

    return false;
  }

  // Edit member just load his info back to the form
  editMember(member: Member) {
    this.memberForm.get('id').setValue(member.id);
    this.memberForm.get('name').setValue(member.name);
    this.memberForm.get('years').setValue(member.years);    
  }

  // Delete a member
  deleteMember(member: Member) {
    this.memberApi.deleteMember(member.id).subscribe(() => {
      this.getAllMembers();

      return true;
    }, error => {
      return false;
    });
  }

  // Clear form and controls after any succeeded process
  resetForm() {
    let control: AbstractControl = null;

    this.memberForm.reset();
    this.memberForm.markAsUntouched();
    Object.keys(this.memberForm.controls).forEach((name) => {
      control = this.memberForm.controls[name];
      control.setErrors(null);
    });
  }

}
