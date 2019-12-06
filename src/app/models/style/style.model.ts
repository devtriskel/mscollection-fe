import { Link } from '../link.model';

export interface Style {
  id: number;
  name: string;
  content: any[];
  links: Link[];
}