import { Link } from '../link.model';
import { RelatedArtist } from './related-artist';

export interface Member {
  id: number;
  name: string;
  years: number;
  relatedArtist: RelatedArtist;
  content: any[];
  links: Link[];
}