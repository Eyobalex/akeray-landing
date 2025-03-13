import { Filter, Order } from "./collection.model"

export type entityViewMode = "list" | "detail"
export type optionType = "none" | "activity-audit" | "correspondence" | "Help"

export interface EntityConfig<T = void> {
  aggregate?: string
  key?: string
  identity: string | string[]
  name: string
  isTitleTranslate?: boolean
  rootUrl: string
  detailUrl?: string
  actions?: ActionMenu[]
  filter?: Filter[][]
  order?: Order[]
  group?: string[]
  favorite?: string[]
  otherView?: boolean
  primaryColumn: Column<T>
  showDetail?: boolean
  listTemplate?: any
  detailTemplate?: any
  visibleColumn: Column<T>[]

  enableAffix?: boolean
  showFullScreen?: boolean
  showClose?: boolean
  hasActions?: boolean
  hasBackLink?: boolean
  routing?(data: any): void
  newAction?(data: any): void
}

export interface EntityData {
  info: {
    currentPage: number
    count: number
  }
  results: any[]
}
export interface ActionMenu {
  name: string
  icon?: string
  action: any
}

export interface Column<T> {
  name?: string
  key: string | string[]
  hasLocale?: boolean
  hasTranslate?: boolean
  isDate?: boolean
  hide?: boolean
  print?: boolean
  isNumber?: boolean
  isBoolean?: boolean
  booleanValue?: {
    true: string
    false: string
  }
  onChild?: boolean
  precision?: any
  hideSort?: boolean
  prefix?: Column<T>
  suffix?: Column<T>
  // style
  tdClass?: string
  render?: (value: T) => any
}

export interface Filtertest {
  field: string
  value: any
  operator?: string
  name: string
}
