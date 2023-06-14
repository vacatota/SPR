import { HttpContext, HttpContextToken } from "@angular/common/http";

// Declare http context tokens here...
export const NO_API_KEY = new HttpContextToken<boolean>(() => false);

// Declare functions using context token to set them true
export function skipApiKey() {
    return new HttpContext().set(NO_API_KEY, true);
}