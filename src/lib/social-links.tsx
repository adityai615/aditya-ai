import { Mail } from "lucide-react";
import type { ReactNode } from "react";
import { GITHUB_USERNAME } from "@/lib/github";

export type SocialLink = {
  label: string;
  icon: ReactNode;
  href: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    href: `https://github.com/${GITHUB_USERNAME}`,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9 19C4 20.5 4 16.5 2 16M16 22V18.13C16.0375 17.6532 15.9731 17.1739 15.811 16.7238C15.6489 16.2738 15.3929 15.8634 15.06 15.52C18.2 15.17 21.5 13.98 21.5 8.52C21.4997 7.12383 20.9627 5.7812 20 4.77C20.4559 3.54851 20.4236 2.19784 19.91 1C19.91 1 18.73 0.65 16 2.48C13.708 1.85982 11.292 1.85982 9 2.48C6.27 0.65 5.09 1 5.09 1C4.57638 2.19784 4.54414 3.54851 5 4.77C4.03013 5.7887 3.49252 7.14146 3.5 8.55C3.5 13.97 6.8 15.16 9.94 15.55C9.611 15.8909 9.35726 16.2974 9.19531 16.7438C9.03335 17.1902 8.96679 17.6658 9 18.14V22"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/adityajain-ai",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16 8C18.2091 8 20 9.79086 20 12V20H16V12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12V20H10V8H14V9.5C14.734 8.57998 15.828 8 17 8H16ZM6 9H3V20H6V9ZM4.5 4C5.32843 4 6 4.67157 6 5.5C6 6.32843 5.32843 7 4.5 7C3.67157 7 3 6.32843 3 5.5C3 4.67157 3.67157 4 4.5 4Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:adityajain.dev.ai11@gmail.com",
    icon: <Mail size={16} strokeWidth={1.75} />,
  },
];
