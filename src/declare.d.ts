declare module "*.gif";
declare module "*.jpg";
declare module "*.mp4";
declare module "*.png";
declare module "*.gif";
declare module "*.svg";

import "react";

declare module "react" {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        xmlns?: string;
    }
}
