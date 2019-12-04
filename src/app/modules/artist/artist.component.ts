import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ArtistApiService } from '../../services/api/artist-api.service';
import { Artists } from 'src/app/models/artist/artists.model';
import { ArtistRQ } from 'src/app/models/artist/artist-rq.model';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  artistForm: FormGroup;
  isSubmitted: boolean;
  isSuccess: boolean;
  artistList: Artists;

  constructor(
    private formBuilder: FormBuilder,
    private artistApi: ArtistApiService
  ) { 
    this.artistForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^\\d{4}$')]]
    })
  }

  ngOnInit() {
    this.isSubmitted = false;
    this.isSuccess = false;

    this.getAllArtists();
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.artistForm.invalid) {
      return;
    }

    this.isSuccess = this.saveArtist(this.artistForm);
  }

  getAllArtists() {
    this.artistApi.getAllArtists().subscribe(data => {
      this.artistList = data;
    });
  }

  saveArtist(form: FormGroup) {
    let artistRq: ArtistRQ = {
      id: form.controls.id.value,
      name: form.controls.name.value,
      year: form.controls.year.value
    };

    this.artistApi.saveArtist(artistRq).subscribe(data => {
      if (data != null && data.id != null) {
        this.getAllArtists();
        this.clearForm();

        return true;
      }
    });

    return false;
  }

  editArtist(e) {
    this.artistForm.get('id').setValue(e.id);
    this.artistForm.get('name').setValue(e.name);
    this.artistForm.get('year').setValue(e.year);    
  }

  deleteArtist(e) {
    this.artistApi.deleteArtist(e.id).subscribe(data => {
      this.getAllArtists();
        return true;
      }, error => {
        return false;
      });

    return false;
  }

  clearForm() {
    let control: AbstractControl = null;

    this.artistForm.reset();
    this.artistForm.markAsUntouched();
    Object.keys(this.artistForm.controls).forEach((name) => {
      control = this.artistForm.controls[name];
      control.setErrors(null);
    });
  }

}
