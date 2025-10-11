export interface DecommissionModel {
  aitNumber?: string;
  crqGroup?: string;
  requestorInfo?: string;
  middleware?: 'Yes'|'No'|'NA'|null;
  externalStorage?: 'Yes'|'No'|'NA'|null;
  removeDatabase?: 'Yes'|'No'|'NA'|null;
  removeMessaging?: 'Yes'|'No'|'NA'|null;
  removeBackup?: 'Yes'|'No'|'NA'|null;
  dataArchiving?: 'Yes'|'No'|'NA'|null;
}
