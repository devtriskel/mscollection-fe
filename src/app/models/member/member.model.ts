import { Link } from '../link.model';

export interface Member {
  id: number;
  name: string;
  years: number;
  content: any[];
  links: Link[];
}