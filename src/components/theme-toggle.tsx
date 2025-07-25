"use client"

import { useTheme } from "./theme-provider"
import { SunIcon, MoonIcon } from "@/icons"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-component-secondary transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunIcon size={20} />
      ) : (
        <MoonIcon size={20} />
      )}
    </button>
  )
}