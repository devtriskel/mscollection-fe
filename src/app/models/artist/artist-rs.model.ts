import { Link } from '../link.model';

export interface ArtistRS {
  id: number;
  name: string;
  year: number;
  content: any[];
  links: Link[];
}
