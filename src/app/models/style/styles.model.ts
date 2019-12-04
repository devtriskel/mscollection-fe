import { Link } from '../link.model';
import { Style } from './style.model';
import { Page } from '../page.model';

export interface Styles {
  links: Link[];
  content: Style[];
  page: Page;
}