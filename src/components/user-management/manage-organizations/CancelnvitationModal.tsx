import { Button, Modal } from '@/components/ui'
import { CancelnvitationModalProps } from '@/types/component'

const CancelnvitationModal = ({
  isOpen,
  onClose,
  handleCancelInvitation,
  handleContinueInviting,
}: CancelnvitationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-8">
        <h2 className="text-so-color-neutral-950 font-raleway text-2xl font-semibold">
          Cancel inviting user
        </h2>
        <p className="text-so-color-neutral-950 font-open-sans text-base font-normal">
          If you cancel now, any unsaved information will be lost and the user
          won&apos;t be invited.
        </p>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            label="Continue inviting"
            appearance="primary"
            onClick={handleContinueInviting}
            className="!px-6 text-center"
          />
          <Button
            type="button"
            label="Cancel invitation"
            appearance="secondary"
            semantic="general"
            onClick={handleCancelInvitation}
            className="px-6"
          />
        </div>
      </div>
    </Modal>
  )
}

export default CancelnvitationModal
