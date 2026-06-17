export type DetectedBrowser = "Chrome" | "Safari" | "Firefox" | "Edge" | "Brave" | "Opera" | "Other";

export type DetectedOS = "Windows" | "macOS" | "Linux" | "Android" | "iOS" | "Other";

export type VisitorClientInfo = {
  browser: DetectedBrowser;
  os: DetectedOS;
  screenWidth: number;
};

type UAData = Navigator & {
  userAgentData?: {
    brands?: { brand: string; version: string }[];
    mobile?: boolean;
    platform?: string;
    getHighEntropyValues?: (hints: string[]) => Promise<Record<string, unknown>>;
  };
};

function normalizePlatformString(value: string): DetectedOS {
  const lower = value.toLowerCase();
  if (lower.includes("win")) return "Windows";
  if (lower.includes("mac")) return "macOS";
  if (lower.includes("linux") || lower === "x11") return "Linux";
  if (lower.includes("android")) return "Android";
  if (lower.includes("iphone") || lower.includes("ipad") || lower.includes("ios")) return "iOS";
  return "Other";
}

function detectOsFromUa(ua: string): DetectedOS {
  if (/windows phone/i.test(ua)) return "Windows";
  if (/windows|win32|win64|wow64/i.test(ua)) return "Windows";
  if (/iphone|ipod/i.test(ua)) return "iOS";
  if (/ipad/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/linux|x11|ubuntu|fedora|debian/i.test(ua)) return "Linux";
  return "Other";
}

async function maybeBrave(): Promise<boolean> {
  const brave = (navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } }).brave;
  if (!brave?.isBrave) return false;
  try {
    return await brave.isBrave();
  } catch {
    return false;
  }
}

function detectBrowserFromBrands(brands: { brand: string; version: string }[] | undefined): DetectedBrowser | null {
  if (!brands?.length) return null;
  const names = brands.map((b) => b.brand.toLowerCase()).join(" ");
  if (names.includes("microsoft edge")) return "Edge";
  if (names.includes("opera")) return "Opera";
  if (names.includes("google chrome") || names.includes("chromium")) {
    return null;
  }
  if (names.includes("firefox")) return "Firefox";
  if (names.includes("safari") && !names.includes("chrome")) return "Safari";
  return null;
}

function detectBrowserFromUa(ua: string): DetectedBrowser {
  if (/edg\//i.test(ua) || /edgios/i.test(ua)) return "Edge";
  if (/opr\/|opios|opera/i.test(ua)) return "Opera";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/crios/i.test(ua)) return "Chrome";
  if (/chrome|chromium/i.test(ua) && !/edg/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua) && !/chrome|crios|chromium/i.test(ua)) return "Safari";
  return "Other";
}

/**
 * Client-only: reads navigator / User-Agent Client Hints when available.
 */
export async function detectVisitorClient(): Promise<VisitorClientInfo> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { browser: "Other", os: "Other", screenWidth: 0 };
  }

  const ua = navigator.userAgent || "";
  const screenWidth = typeof window.screen?.width === "number" ? window.screen.width : 0;

  const isLikelyIpadDesktopUa =
    /macintosh/i.test(ua) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1;

  let os: DetectedOS = "Other";
  const nav = navigator as UAData;
  const uaData = nav.userAgentData;

  if (uaData?.getHighEntropyValues) {
    try {
      const hints = await uaData.getHighEntropyValues(["platform", "platformVersion"]);
      const platform = typeof hints.platform === "string" ? hints.platform : uaData.platform;
      if (platform) {
        os = normalizePlatformString(platform);
      }
    } catch {
      /* fall through */
    }
  }

  if (os === "Other" && uaData?.platform) {
    os = normalizePlatformString(uaData.platform);
  }
  if (os === "Other") {
    os = detectOsFromUa(ua);
  }
  if (isLikelyIpadDesktopUa && os === "macOS") {
    os = "iOS";
  }

  let browser: DetectedBrowser = "Other";

  if (await maybeBrave()) {
    browser = "Brave";
  } else if (uaData?.brands?.length) {
    const fromBrands = detectBrowserFromBrands(uaData.brands);
    browser = fromBrands ?? detectBrowserFromUa(ua);
  } else {
    browser = detectBrowserFromUa(ua);
  }

  if (browser === "Other" && /safari/i.test(ua) && !/chrome|crios|chromium/i.test(ua)) {
    browser = "Safari";
  }

  return { browser, os, screenWidth };
}
