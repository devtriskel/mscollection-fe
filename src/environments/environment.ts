// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  timeout: 10000,
  apiArtists: 'http://localhost:8080/mscollection-api/artists',
  apiArtistsRelatedMembers: 'http://localhost:8080/mscollection-api/artists/{artistId}/members',
  apiArtistsRelatedStyles: 'http://localhost:8080/mscollection-api/artists/{artistId}/styles',
  apiArtistsRelatedArtists: 'http://localhost:8080/mscollection-api/artists/{artistId}/relatedToArtists',
  apiArtistsDeleteRelatedStyle: 'http://localhost:8080/mscollection-api/artists/{artistId}/styles/{styleId}',
  apiArtistsDeleteRelatedArtist: 'http://localhost:8080/mscollection-api/artists/{artistId}/relatedToArtists/{relatedToArtistsId}',
  apiMembers: 'http://localhost:8080/mscollection-api/members',
  apiStyles: 'http://localhost:8080/mscollection-api/styles',
  apiStylesRelatedArtists: 'http://localhost:8080/mscollection-api/styles/{styleId}/artists',
  apiMembersToArtist: 'http://localhost:8080/mscollection-api/members/{memberId}/artist'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
