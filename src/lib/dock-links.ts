import { Code2 } from "lucide-react";
import type { AppIconComponent } from "./app-icons";

export type DockExternalLink = {
  id: string;
  title: string;
  href: string;
  icon: AppIconComponent;
};

export const DOCK_EXTERNAL_LINKS: DockExternalLink[] = [
  {
    id: "dsa",
    title: "DSA",
    href: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
    icon: Code2,
  },
];
