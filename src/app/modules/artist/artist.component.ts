import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ArtistApiService } from '../../services/api/artist-api.service';
import { StyleApiService } from '../../services/api/style-api.service';
import { MemberApiService } from '../../services/api/member-api.service';
import { ArtistRQ } from 'src/app/models/artist/artist-rq.model';
import { Artists } from 'src/app/models/artist/artists.model';
import { Artist } from 'src/app/models/artist/artist.model';
import { Styles } from 'src/app/models/style/styles.model';
import { Style } from 'src/app/models/style/style.model';
import { Members } from 'src/app/models/member/members.model';
import { Member } from 'src/app/models/member/member.model';

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
  styleList: Styles;
  memberList: Members;
  
  artistRelated: Map<number, Artist[]> = new Map<number, Artist[]>();
  artistStyles: Map<number, Style[]> = new Map<number, Style[]>();
  artistMembers: Map<number, Member[]> = new Map<number, Member[]>();

  constructor(
    private formBuilder: FormBuilder,
    private artistApi: ArtistApiService,
    private styleApi: StyleApiService,
    private memberApi: MemberApiService,
    public dialog: MatDialog
  ) {
    this.artistForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^\\d{4}$')]]
    });
  }

  ngOnInit() {
    this.isSubmitted = false;
    this.isSuccess = false;

    this.searchArtists();

    // Get all styles available for dropdown options
    this.styleApi.getAllStyles().subscribe(data => {
      this.styleList = data;
    });

    // Get all members available for dropdown options
    this.memberApi.getAllMembers().subscribe(data => {
      this.memberList = data;
    });
  }

  // Submit event create or update an artist
  onSubmit() {
    this.isSubmitted = true;

    if (this.artistForm.invalid) {
      return;
    }

    this.isSuccess = this.saveArtist(this.artistForm);
  }

  // Search artist from database (overload control on jpa)
  searchArtists() {
    this.artistApi.getAllArtists().subscribe(data => {
      this.artistList = data;

      // Get all relations per artist
      this.artistList.content.forEach(artist => {
        this.setRelatedInfo(artist.id);
      });
    });
  }

  // Create or update an artist
  saveArtist(form: FormGroup) {
    let artistRq: ArtistRQ = {
      id: form.controls.id.value,
      name: form.controls.name.value,
      year: form.controls.year.value
    };

    this.artistApi.saveArtist(artistRq).subscribe(data => {
      if (data != null && data.id != null) {
        this.searchArtists();
        this.resetForm();

        return true;
      }
    });

    return false;
  }

  // Edit artist just load his info back to the form
  editArtist(artist: Artist) {
    this.artistForm.get('id').setValue(artist.id);
    this.artistForm.get('name').setValue(artist.name);
    this.artistForm.get('year').setValue(artist.year);    
  }

  // Delete an artist
  deleteArtist(artist: Artist) {
    this.artistApi.deleteArtist(artist.id).subscribe(data => {
      this.searchArtists();

      return true;
    }, error => {
      return false;
    });
  }

  // Obtain data relations for an artist and save it into arrays
  setRelatedInfo(artistId: number) {
    this.clear();

    this.getArtistRelatedArtists(artistId);
    this.getArtistRelatedStyles(artistId);
    this.getArtistRelatedMembers(artistId);
  }

  // Add new artist association to artist
  addRelatedArtist(artistId: number) {
    this.openDialog(artistId, 'artist', this.artistList);
  }

  // Add new style association to artist
  addRelatedStyle(artistId: number) {
    this.openDialog(artistId, 'style', this.styleList);
  }

  // Add new member association to artist
  addRelatedMember(artistId: number) {
    this.openDialog(artistId, 'member', this.memberList);
  }

  // Delete artist association to artist
  deleteRelatedArtist(artistId: number, relatedArtistId: number) {
    this.artistApi.deleteRelatedArtist(artistId, relatedArtistId).subscribe(data => {
      this.getArtistRelatedArtists(artistId);
    });
  }

  // Delete style association to artist
  deleteRelatedStyle(artistId: number, styleId: number) {
    this.artistApi.deleteRelatedStyle(artistId, styleId).subscribe(data => {
      this.getArtistRelatedStyles(artistId);
    });
  }

  // Delete member association to artist
  deleteRelatedMember(artistId: number, memberId: number) {
    this.artistApi.deleteRelatedMember(artistId, memberId).subscribe(data => {
      this.getArtistRelatedMembers(artistId);
    });
  }

  // Get artist retaled artists
  getArtistRelatedArtists(artistId: number) {
    this.artistApi.getRelatedArtists(artistId).subscribe(x => {
      this.artistRelated.set(artistId, x.content);
    });
  }

  // Get artist related styles
  getArtistRelatedStyles(artistId: number) {
    this.artistApi.getRelatedStyles(artistId).subscribe(x => {
      this.artistStyles.set(artistId, x.content);
    });
  }

  // Get artist related members
  getArtistRelatedMembers(artistId: number) {
    this.artistApi.getRelatedMembers(artistId).subscribe(x => {
      this.artistMembers.set(artistId, x.content);
    });
  }

  // Clear form and controls after any succeeded process
  resetForm() {
    this.isSubmitted = false;
    this.isSuccess = false;

    let control: AbstractControl = null;

    this.artistForm.reset();
    this.artistForm.markAsUntouched();
    Object.keys(this.artistForm.controls).forEach((name) => {
      control = this.artistForm.controls[name];
      control.setErrors(null);
    });
  }

  // Clean all maps with relations per artists
  clear() {
    this.artistRelated = new Map<number, Artist[]>();
    this.artistStyles = new Map<number, Style[]>();
    this.artistMembers = new Map<number, Member[]>();
  }

  // Modal used to present any association option
  openDialog(artistId: number, option: string, info: any) {
    let dialogRef = this.dialog.open(DialogComponent, {data: info});

    dialogRef.afterClosed().subscribe(id => {
      if (id != null && option == 'artist') {
        this.artistApi.addRelatedArtist(artistId, id).subscribe(() => {
          this.getArtistRelatedArtists(artistId);
        });
      }

      if (id != null && option == 'style') {
        this.artistApi.addRelatedStyle(artistId, id).subscribe(() => {
          this.getArtistRelatedStyles(artistId);
        });
      }

      if (id != null && option == 'member') {
        this.artistApi.addRelatedMember(artistId, id).subscribe(() => {
          this.getArtistRelatedMembers(artistId);
        });
      }
    });
  }

}
