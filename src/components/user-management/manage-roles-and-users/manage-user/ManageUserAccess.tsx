'use client'
import {
  AlertProps,
  Button,
  CheckBox,
  Separator,
  Switch,
} from '@/components/ui'
import { useState } from 'react'

const ManageUserAccess = ({
  onAlert,
}: {
  onAlert?: (alert: AlertProps | null) => void
}) => {
  const [accountManagementEnabled, setAccountManagementEnabled] = useState(true)

  const [organizationManagementEnabled, setOrganizationManagementEnabled] =
    useState(false)
  const [organizationUsersEnabled, setOrganizationUsersEnabled] =
    useState(false)

  const [applicationManagementEnabled, setApplicationManagementEnabled] =
    useState(true)
  const [vendorOfRecordEnabled, setVendorOfRecordEnabled] = useState(false)
  const [vendorReportingEnabled, setVendorReportingEnabled] = useState(false)
  const [productComparisonEnabled, setProductComparisonEnabled] =
    useState(false)
  const [digitalProcurementEnabled, setDigitalProcurementEnabled] =
    useState(false)

  const handleSubmit = () => {
    onAlert?.(null)
  }

  return (
    <div className="flex flex-col gap-8 pt-8">
      <div className="text-so-color-neutral-950">
        <h2 className="heading-h2-base font-bold">User access</h2>
        <p className="font-open-sans text-so-color-neutral-600 text-xl font-normal">
          Review and manage this user&apos;s access
        </p>
      </div>

      <div
        className={
          accountManagementEnabled
            ? 'bg-so-color-persona-general-50 flex flex-col gap-6 rounded-2xl p-6'
            : 'bg-so-color-neutral-100 rounded-2xl p-6'
        }
      >
        <div className="flex w-full items-center justify-between">
          <div className="text-so-color-neutral-950">
            <h2 className="heading-h3-base font-bold">Account management</h2>
            <p className="body-base text-so-color-neutral-600">
              Provision access for this user to manage areas within the
              dashboard
            </p>
          </div>
          <Switch
            enabled={accountManagementEnabled}
            onChange={setAccountManagementEnabled}
          />
        </div>

        {accountManagementEnabled && (
          <>
            <Separator
              appearance="thick"
              className="!bg-so-color-neutral-950 !px-0 !py-0"
            />

            <div className="flex w-full items-center justify-between">
              <div className="text-so-color-neutral-950">
                <h2 className="body-base font-bold">Organization management</h2>
                <p className="body-base text-so-color-neutral-600">
                  This user can manage organization profiles and settings
                </p>
              </div>
              <CheckBox
                checked={organizationManagementEnabled}
                onChange={setOrganizationManagementEnabled}
              />
            </div>
            <Separator appearance="thick" className="!px-0 !py-0" />
            <div className="flex w-full items-center justify-between">
              <div className="text-so-color-neutral-950">
                <h2 className="body-base font-bold">Organization users</h2>
                <p className="body-base text-so-color-neutral-600">
                  This user can manage other users in their organization
                </p>
              </div>
              <CheckBox
                checked={organizationUsersEnabled}
                onChange={setOrganizationUsersEnabled}
              />
            </div>
          </>
        )}
      </div>

      <div
        className={
          applicationManagementEnabled
            ? 'bg-so-color-persona-general-50 flex flex-col gap-6 rounded-2xl p-6'
            : 'bg-so-color-neutral-100 rounded-2xl p-6'
        }
      >
        <div className="flex w-full items-center justify-between">
          <div className="text-so-color-neutral-950">
            <h2 className="heading-h3-base font-bold">
              Application management
            </h2>
            <p className="body-base text-so-color-neutral-600">
              Provision access for this user to manage applications within the
              dashboard
            </p>
          </div>
          <Switch
            enabled={applicationManagementEnabled}
            onChange={setApplicationManagementEnabled}
          />
        </div>

        {applicationManagementEnabled && (
          <>
            <Separator
              appearance="thick"
              className="!bg-so-color-neutral-950 !px-0 !py-0"
            />
            <div className="flex w-full items-center justify-between">
              <div className="text-so-color-neutral-950">
                <h2 className="body-base font-bold">Vendor of Record</h2>
                <p className="body-base text-so-color-neutral-600">
                  This user can manage the Vendor of Record application
                </p>
              </div>
              <CheckBox
                checked={vendorOfRecordEnabled}
                onChange={setVendorOfRecordEnabled}
              />
            </div>{' '}
            <Separator
              appearance="thick"
              className="!border-so-color-neutral-950 !px-0 !py-0"
            />
            <div className="flex w-full items-center justify-between">
              <div className="text-so-color-neutral-950">
                <h2 className="body-base font-bold">Vendor Reporting</h2>
                <p className="body-base text-so-color-neutral-600">
                  This user can manage the Vendor Reporting application
                </p>
              </div>
              <CheckBox
                checked={vendorReportingEnabled}
                onChange={setVendorReportingEnabled}
              />
            </div>{' '}
            <Separator
              appearance="thick"
              className="!border-so-color-neutral-950 !px-0 !py-0"
            />
            <div className="flex w-full items-center justify-between">
              <div className="text-so-color-neutral-950">
                <h2 className="body-base font-bold">Product Comparison</h2>
                <p className="body-base text-so-color-neutral-600">
                  This user can manage the Product Comparison application
                </p>
              </div>
              <CheckBox
                checked={productComparisonEnabled}
                onChange={setProductComparisonEnabled}
              />
            </div>{' '}
            <Separator
              appearance="thick"
              className="!border-so-color-neutral-950 !px-0 !py-0"
            />
            <div className="flex w-full items-center justify-between">
              <div className="text-so-color-neutral-950">
                <h2 className="body-base font-bold">
                  Digital Procurement System
                </h2>
                <p className="body-base text-so-color-neutral-600">
                  This user can manage the Digital Procurement System
                  application
                </p>
              </div>
              <CheckBox
                checked={digitalProcurementEnabled}
                onChange={setDigitalProcurementEnabled}
              />
            </div>
          </>
        )}
      </div>

      <Button
        label="Update access"
        appearance="primary"
        className="w-fit px-6 font-bold"
        onClick={handleSubmit}
      />
    </div>
  )
}

export default ManageUserAccess
