import AmazonIcon from "../../assets/icons/AmazonIcon.svg";
import AzureIcon from "../../assets/icons/AzureIcon.svg";
import GcloudIcon from "../../assets/icons/GcloudIcon.svg";
import OciClodIcon from "../../assets/icons/OciClodIcon.svg";
import { CloudConstantType } from "../../redux/@types/cloud-types/CommenCloudTypes";

export const CloudConstant = Object.freeze({
    CLOUD: {
        PLATFORM_CARD_DETAILS: [
            {
                _cls: 'ec2', //** AWS CARD KEY */
                image: AmazonIcon,
                name: 'AWS',
                constanttype: CloudConstantType.AWS_CL0UD_CONSTANT,
            },
            {
                _cls: 'azure_arm',  //** Azure CARD KEY */
                image: AzureIcon,
                name: 'Azure',
                constanttype: CloudConstantType.AZURE_CL0UD_CONSTANT,
            },
            {
                _cls: '',
                image: GcloudIcon,
                name: 'GCP',
                constanttype: CloudConstantType.GCP_CL0UD_CONSTANT,
            },
            {
                _cls: '',
                image: OciClodIcon,
                name: 'OCI',
                constanttype: CloudConstantType.OCI_CL0UD_CONSTANT,
            }
        ],
    },
})