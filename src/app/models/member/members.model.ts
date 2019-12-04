import { Link } from '../link.model';
import { Member } from './member.model';
import { Page } from '../page.model';

export interface Members {
  links: Link[];
  content: Member[];
  page: Page;
}