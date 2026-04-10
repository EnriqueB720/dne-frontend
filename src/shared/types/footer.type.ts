export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  logoSrc?: string;
  logoAlt?: string;
  copyrightText?: string;
  links?: FooterLink[];
}
