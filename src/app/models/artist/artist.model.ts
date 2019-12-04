import { Link } from '../link.model';

export interface Artist {
  id: number;
  name: string;
  year: number;
  content: any[];
  links: Link[];
}