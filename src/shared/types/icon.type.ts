import { IconProps as IconProperties } from "@chakra-ui/react";

export type IconName = 'visibilityOn' | 'visibilityOff'


export interface IconProps extends IconProperties {
   name: IconName;
}