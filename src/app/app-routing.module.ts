import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtistComponent } from './modules/artist/artist.component';
import { MemberComponent } from './modules/member/member.component';

const routes: Routes = [
  {path: '', component: ArtistComponent},
  {path: 'artist', component: ArtistComponent},
  {path: 'people', component: MemberComponent},
  {path: '**', component: ArtistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
