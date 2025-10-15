'use client'
import {
  AlertProps,
  Button,
  CheckBox,
  InputSearch,
  InputSearchResultItem,
  Separator,
  Switch,
} from '@/components/ui'
import { ALL_AGREEMENTS } from '@/constants'
import { useEffect, useState } from 'react'

const OrganizationAccessTab = ({
  onAlert,
}: {
  onAlert?: (alert: AlertProps | null) => void
}) => {
  const [showInactive, setShowInactive] = useState(true)
  const [showInactiveReporting, setShowInactiveReporting] = useState(false)
  const [IsCheck, setIsCheck] = useState(true)
  const [IsCheckPermit, setIsCheckPermit] = useState(true)
  const [selectedAgreements, setSelectedAgreements] = useState<
    InputSearchResultItem[]
  >([])
  const [query, setQuery] = useState('')
  const [searchError, setSearchError] = useState<string | undefined>(undefined)
  // page-level alert lifted via onAlert

  const [results, setResults] =
    useState<InputSearchResultItem[]>(ALL_AGREEMENTS)

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length === 0) {
      setResults(ALL_AGREEMENTS)
      return
    }
    setResults(
      ALL_AGREEMENTS.filter(item => item.title.toLowerCase().includes(q))
    )
  }, [query])

  const handleSelectAgreement = (item: InputSearchResultItem) => {
    setSelectedAgreements(prev => {
      if (prev.some(x => x.id === item.id)) return prev
      return [...prev, item]
    })
    setQuery('')
    setSearchError(undefined)
    onAlert?.(null)
  }

  const handleRemoveAgreement = (id: string) => {
    setSelectedAgreements(prev => prev.filter(x => x.id !== id))
  }

  const handleSubmit = () => {
    if (showInactiveReporting && selectedAgreements.length === 0) {
      setSearchError('Please add at least one Vendor Agreement for reporting')
      onAlert?.({
        variant: 'destructive',
        title: 'Missing required information',
        description:
          'Some required fields are incomplete or invalid. Review the details below to continue.',
        validationErrors: [
          'Please add at least one Vendor Agreement for reporting',
        ],
      })
      return
    }

    onAlert?.(null)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-so-color-neutral-950">
        <h2 className="heading-h2-base font-bold">Organization access</h2>
        <p className="text-xl">
          Manage an organization&apos;s access to Supply Ontario tools
        </p>
      </div>
      <div
        className={
          showInactive
            ? 'bg-so-color-persona-general-50 flex flex-col gap-6 rounded-2xl p-6'
            : 'bg-so-color-neutral-100 rounded-2xl p-6'
        }
      >
        <div className="flex w-full items-center justify-between">
          <div className="text-so-color-neutral-950">
            <h2 className="heading-h3-base font-bold">Second Stage Selector</h2>
            <p className="body-base">
              Users in organization can access and use the second stage selector
            </p>
          </div>
          <Switch enabled={showInactive} onChange={setShowInactive} />
        </div>
        {showInactive && (
          <>
            <hr className="text-so-color-neutral-950 h-[2px]" />
            <div className="flex w-full items-center justify-between">
              <div className="text-so-color-neutral-950">
                <h2 className="body-base font-bold">App specific permission</h2>
                <p className="body-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <CheckBox checked={IsCheck} onChange={setIsCheck} />
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="text-so-color-neutral-950">
                <h2 className="body-base font-bold">App specific permission</h2>
                <p className="body-base">
                  Integer suscipit auctor libero, sit amet tristique est
                  molestie id. 
                </p>
              </div>{' '}
              <CheckBox checked={IsCheckPermit} onChange={setIsCheckPermit} />
            </div>
          </>
        )}
      </div>
      <div
        className={
          showInactiveReporting
            ? 'bg-so-color-persona-general-50 flex flex-col gap-6 rounded-2xl p-6'
            : 'bg-so-color-neutral-100 rounded-2xl p-6'
        }
      >
        <div className="flex w-full items-center justify-between">
          <div className="text-so-color-neutral-950">
            <h2 className="heading-h3-base font-suse-mono font-bold">
              Vendor reporting
            </h2>
            <p className="body-base">
              Users in organization can access vendor reporting
            </p>
          </div>
          <Switch
            enabled={showInactiveReporting}
            onChange={val => {
              setShowInactiveReporting(val)
              if (!val) {
                onAlert?.(null)
                setSearchError(undefined)
              }
            }}
          />
        </div>
        {showInactiveReporting && (
          <>
            <hr className="text-so-color-neutral-950 h-[2px]" />

            <InputSearch
              label="Search agreements"
              iconLeading={
                <i className="material-symbols-outlined !leading-none">
                  search
                </i>
              }
              value={query}
              onSearch={setQuery}
              onSelect={handleSelectAgreement}
              results={results}
              error={searchError}
              className="w-full max-w-[520px]"
            />

            {selectedAgreements.length > 0 && (
              <div className="flex flex-col gap-4">
                {selectedAgreements.map((item, idx) => (
                  <>
                    <div
                      key={item.id}
                      className="flex items-start justify-between"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="text-so-color-neutral-950">
                          <p className="body-base font-open-sans font-bold">
                            {item.title}
                          </p>
                          {item.showAddress && (
                            <p className="text-so-color-neutral-700 font-open-sans text-sm">
                              {item.address}
                            </p>
                          )}
                        </div>
                        <p className="body-base text-so-color-neutral-600">
                          {item?.desc}
                        </p>
                      </div>
                      <Button
                        label="Remove from reporting"
                        appearance="destructive-ghost"
                        className=""
                        onClick={() => handleRemoveAgreement(item.id)}
                      />
                    </div>
                    {idx !== selectedAgreements.length - 1 && (
                      <Separator className="!px-0" />
                    )}
                  </>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Button
        label="Update Access"
        appearance="primary"
        className="w-fit px-6 font-bold text-nowrap"
        onClick={handleSubmit}
      />
    </div>
  )
}

export default OrganizationAccessTab
