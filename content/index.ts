import { en } from "./en"
import { ru } from "./ru"

export type { Dict, IconKey } from "./types"

const dicts = { ru, en }

export type Locale = keyof typeof dicts
export const locales = Object.keys(dicts) as Locale[]

export const hasLocale = (value: string): value is Locale => Object.hasOwn(dicts, value)
export const getDict = (locale: Locale) => dicts[locale]
