'use client'

import { cn } from '@/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'

export type DateLikeString = string // expected format: MM-DD-YYYY

export type DatePickerProps = {
  value?: DateLikeString
  onChange?: (value: DateLikeString) => void
  className?: string
  disablePastDates?: boolean
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function parse(value?: DateLikeString): Date | undefined {
  if (!value) return undefined
  const [m, d, y] = value.split('-').map(v => Number(v))
  if (!y || !m || !d) return undefined
  const dt = new Date(y, m - 1, d)
  return isNaN(dt.getTime()) ? undefined : dt
}

function toValueString(date: Date): DateLikeString {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${m}-${d}-${y}`
}

function getStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export default function DatePicker({
  value,
  onChange,
  className,
  disablePastDates = false,
}: DatePickerProps) {
  const initial = parse(value) ?? new Date()
  const [viewDate, setViewDate] = useState<Date>(getStartOfMonth(initial))
  const [showMonthDropdown, setShowMonthDropdown] = useState(false)
  const [showYearDropdown, setShowYearDropdown] = useState(false)

  const monthDropdownRef = useRef<HTMLDivElement>(null)
  const yearDropdownRef = useRef<HTMLDivElement>(null)

  const today = useMemo(() => new Date(), [])
  const selected = parse(value)

  const weeks = useMemo(() => {
    const firstOfMonth = getStartOfMonth(viewDate)
    const startDay = new Date(firstOfMonth)
    // Start from Sunday of the first week row
    startDay.setDate(firstOfMonth.getDate() - firstOfMonth.getDay())

    const days: Date[][] = []
    const cursor = new Date(startDay)
    for (let w = 0; w < 6; w++) {
      const week: Date[] = []
      for (let i = 0; i < 7; i++) {
        week.push(new Date(cursor))
        cursor.setDate(cursor.getDate() + 1)
      }
      days.push(week)
    }
    return days
  }, [viewDate])

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    // Only show current year and future years for agreement expiry dates
    for (let i = currentYear; i <= currentYear + 20; i++) {
      years.push(i)
    }
    return years
  }, [])

  const handleSelect = (day: Date) => {
    // Don't allow selection of dates before today if disablePastDates is true
    if (disablePastDates) {
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
      const dayStart = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      )

      if (dayStart < todayStart) {
        return // Don't select past dates
      }
    }

    onChange?.(toValueString(day))
  }

  const handleMonthSelect = (monthIndex: number) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1))
    setShowMonthDropdown(false)
  }

  const handleYearSelect = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1))
    setShowYearDropdown(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMonthDropdown(false)
      }
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setShowYearDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      className={cn(
        'border-so-color-neutral-300 w-full rounded-lg border bg-white p-4 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="hover:bg-so-color-neutral-100 flex h-10 w-10 items-center justify-center rounded-lg focus:outline-none"
          onClick={() => setViewDate(d => addMonths(d, -1))}
          aria-label="Previous month"
        >
          <i className="material-symbols-outlined">keyboard_arrow_left</i>
        </button>
        <div className="flex items-center gap-3">
          <div className="relative" ref={monthDropdownRef}>
            <button
              type="button"
              className="border-so-color-neutral-950 hover:bg-so-color-neutral-50 flex min-w-[72px] items-center gap-1 rounded-lg border-2 px-3 py-2 focus:outline-none"
              onClick={() => {
                setShowMonthDropdown(!showMonthDropdown)
                setShowYearDropdown(false)
              }}
            >
              <span className="font-bold">{MONTHS[viewDate.getMonth()]}</span>
              <i className="material-symbols-outlined !text-xl !leading-none">
                keyboard_arrow_down
              </i>
            </button>
            {showMonthDropdown && (
              <div className="border-so-color-neutral-300 absolute top-full left-0 z-10 mt-1 w-48 rounded-lg border bg-white shadow-lg">
                <div className="max-h-60 overflow-y-auto p-1">
                  {MONTHS.map((month, index) => (
                    <button
                      key={month}
                      type="button"
                      className={cn(
                        'hover:bg-so-color-neutral-100 w-full rounded-md px-3 py-2 text-left text-sm',
                        index === viewDate.getMonth() &&
                          'bg-[#e6efff] text-[#0052eb]'
                      )}
                      onClick={() => handleMonthSelect(index)}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={yearDropdownRef}>
            <button
              type="button"
              className="border-so-color-neutral-950 hover:bg-so-color-neutral-50 flex min-w-[72px] items-center gap-1 rounded-lg border-2 px-3 py-2 focus:outline-none"
              onClick={() => {
                setShowYearDropdown(!showYearDropdown)
                setShowMonthDropdown(false)
              }}
            >
              <span className="font-bold">{viewDate.getFullYear()}</span>
              <i className="material-symbols-outlined !text-xl !leading-none">
                keyboard_arrow_down
              </i>
            </button>
            {showYearDropdown && (
              <div className="border-so-color-neutral-300 absolute top-full left-0 z-10 mt-1 w-24 rounded-lg border bg-white shadow-lg">
                <div className="max-h-60 overflow-y-auto p-1">
                  {yearOptions.map(year => (
                    <button
                      key={year}
                      type="button"
                      className={cn(
                        'hover:bg-so-color-neutral-100 w-full rounded-md px-3 py-2 text-left text-sm',
                        year === viewDate.getFullYear() &&
                          'bg-[#e6efff] text-[#0052eb]'
                      )}
                      onClick={() => handleYearSelect(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          className="hover:bg-so-color-neutral-100 flex h-10 w-10 items-center justify-center rounded-lg focus:outline-none"
          onClick={() => setViewDate(d => addMonths(d, 1))}
          aria-label="Next month"
        >
          <i className="material-symbols-outlined">keyboard_arrow_right</i>
        </button>
      </div>

      <div className="text-so-color-neutral-600 mt-2 grid h-10 grid-cols-7 place-items-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-1 space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map(day => {
              const inMonth = isSameMonth(day, viewDate)
              const isSelected = selected ? isSameDay(day, selected) : false
              const isToday = isSameDay(day, today)

              // Check if date is in the past
              const todayStart = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              )
              const dayStart = new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate()
              )
              const isPast = disablePastDates && dayStart < todayStart

              const base =
                'h-10 w-10 rounded-lg flex items-center justify-center'
              const selectedCls = isSelected
                ? 'bg-[#e6efff] text-[#0052eb]'
                : inMonth
                  ? 'text-so-color-neutral-950'
                  : 'text-so-color-neutral-400'

              const todayRing =
                isToday && !isSelected ? 'ring-1 ring-so-color-neutral-300' : ''

              const disabledCls = isPast
                ? 'opacity-40 cursor-not-allowed hover:bg-transparent'
                : 'hover:bg-so-color-neutral-100 cursor-pointer'

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  className={cn(base, selectedCls, todayRing, disabledCls)}
                  onClick={() => handleSelect(day)}
                  disabled={isPast}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
