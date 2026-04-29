import { IconProps as IconProperties } from "@chakra-ui/react";

export type IconName = 'visibilityOn' | 'visibilityOff' | 'search'


export interface IconProps extends IconProperties {
   name: IconName;
}