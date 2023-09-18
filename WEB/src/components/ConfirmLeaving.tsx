import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';

function ConfirmLeaving({
    isResource,
    leaveWorkloadScreen,
    stayOnWorkloadScreen,
}: {
    isResource: boolean;
    leaveWorkloadScreen: () => void;
    stayOnWorkloadScreen: () => void;
}) {
    return (
        <ConfirmDialog
            className="confirm-dialog-cloud-onboarding"
            visible={isResource}
            onHide={leaveWorkloadScreen}
            accept={leaveWorkloadScreen}
            reject={stayOnWorkloadScreen}
            acceptLabel={"No, Stay Here"}
            rejectLabel={"Yes, Leave"}
            position="top"
            message={
                <>
                    <span className="confirm-dialog-normal">
                        Leaving this screen will discard any recent
                        changes you've made to the network graph. Are
                        you sure you want to proceed?
                    </span>
                </>
            }
            header="Confirm Leaving?"
            icon="pi pi-exclamation-triangle"
        >
            <template>
                <div className="p-d-flex p-jc-between">
                    <Button className="p-button-text">No, Stay Here</Button>
                    <Button className="p-button-text">Yes, Leave</Button>
                </div>
            </template>
        </ConfirmDialog>
    )
}

export default ConfirmLeaving