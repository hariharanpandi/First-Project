import aws from "../../assets/icons/AmazonIcon.svg";
import azure from "../../assets/icons/AzureIcon.svg";
import gcp from "../../assets/icons/GcloudIcon.svg";
import oci from "../../assets/icons/OciClodIcon.svg";
export const CommonTable = Object.freeze({
  USER_MANAGEMENT_LIST: {
    COLUMNS: [
      {
        field: "user_template",
        header: "Users",
        isDefault: true,
        type: "lock",
      },
      {
        field: "role_name",
        header: "Project role",
        isDefault: true,
        type: "checkbox",
      },
      {
        field: "created_at",
        header: "Added date",
        isDefault: true,
        type: "checkbox",
      },
      {
        field: "last_login_at",
        header: "Last active",
        isDefault: true,
        type: "checkbox",
      },
      {
        field: "user_status",
        header: "Status",
        isDefault: true,
        type: "checkbox",
      },
      { field: "action_bar", header: "Action", isDefault: true, type: "checkbox" },
      { field: "FILTER_GATE", header: "", isDefault: true, type: "default" },
    ],
  },
});

export const CloudCommonTable = Object.freeze({
  CLOUD_LIST: {
    COLUMNS: [
      { field: "user_template", header: "ACCOUNT", isDefault: true,
      type: "lock" },
      { field: "account_type", header: "ACCOUNT TYPE", isDefault: true,
      type: "lock" },
      { field: "onboarded_by", header: "ONBOARDED BY", isDefault: true,
      type: "checkbox" },
      { field: "last_login_at", header: "ONBOARDED ON", isDefault: true,
      type: "checkbox" },
      { field: "user_status", header: "STATUS", isDefault: true,
      type: "checkbox" },
      { field: "discovery_progress_percentage", header: "DISCOVERY STATUS", isDefault: true,
      type: "checkbox" },
      { field: "action_bar", header: "ACTION", isDefault: true,
      type: "checkbox" },
      { field: "FILTER_GATE", header: "", isDefault: true, type: "default" },
    ],
  },
});

export const CLOUDS = [
  { name: "AWS", code: "ec2", cloudImg: aws },
  { name: "AZURE", code: "azure_arm", cloudImg: azure },
  { name: "GCP", code: "gcp", cloudImg: gcp },
  { name: "OCI", code: "oci", cloudImg: oci },
];
