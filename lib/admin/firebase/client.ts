import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
} from "firebase/app-check";
import { getFunctions } from "firebase/functions";

const REGION = "asia-northeast3";
let initializedAppCheck = false;

function requiredEnvironment(name: string, value: string | undefined): string {
  if (!value) throw new Error(`관리자 환경변수 ${name}가 설정되지 않았습니다.`);
  return value;
}

export function getAdminFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({
    apiKey: requiredEnvironment("NEXT_PUBLIC_SLIME_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_SLIME_FIREBASE_API_KEY),
    authDomain: requiredEnvironment("NEXT_PUBLIC_SLIME_FIREBASE_AUTH_DOMAIN", process.env.NEXT_PUBLIC_SLIME_FIREBASE_AUTH_DOMAIN),
    projectId: requiredEnvironment("NEXT_PUBLIC_SLIME_FIREBASE_PROJECT_ID", process.env.NEXT_PUBLIC_SLIME_FIREBASE_PROJECT_ID),
    appId: requiredEnvironment("NEXT_PUBLIC_SLIME_FIREBASE_APP_ID", process.env.NEXT_PUBLIC_SLIME_FIREBASE_APP_ID),
  });
}

export function initializeAdminAppCheck(app: FirebaseApp): void {
  if (initializedAppCheck || typeof window === "undefined") return;
  const siteKey = requiredEnvironment(
    "NEXT_PUBLIC_SLIME_APPCHECK_SITE_KEY",
    process.env.NEXT_PUBLIC_SLIME_APPCHECK_SITE_KEY,
  );
  const debugToken = process.env.NEXT_PUBLIC_SLIME_APPCHECK_DEBUG_TOKEN;
  if (debugToken) {
    (globalThis as typeof globalThis & { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean })
      .FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken === "true" ? true : debugToken;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
  initializedAppCheck = true;
}

export function getAdminFirebaseServices() {
  const app = getAdminFirebaseApp();
  initializeAdminAppCheck(app);
  return {
    app,
    auth: getAuth(app),
    functions: getFunctions(app, REGION),
  };
}
