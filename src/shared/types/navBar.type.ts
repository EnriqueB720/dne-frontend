export interface NavBarLink {
  label: string;
  href: string;
}

export interface NavBarProps {
  logoSrc?: string;
  logoAlt?: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}
