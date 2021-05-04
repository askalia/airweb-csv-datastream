import { DatasetType } from './models';

const validateDatasetType = (datasetType: string): boolean => {
  return Object.values(DatasetType).map(String).includes(datasetType);
};

export default {
  validateDatasetType,
};
