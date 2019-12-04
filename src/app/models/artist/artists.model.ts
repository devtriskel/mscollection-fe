import { Link } from '../link.model';
import { Artist } from './artist.model';
import { Page } from '../page.model';

export interface Artists {
  links: Link[];
  content: Artist[];
  page: Page;
}