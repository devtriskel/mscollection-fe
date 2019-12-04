import { Link } from '../link.model';

export interface MemberRS {
  id: number;
  name: string;
  years: number;
  content: any[];
  links: Link[];
}
