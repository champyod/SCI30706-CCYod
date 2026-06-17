import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} BasicApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
