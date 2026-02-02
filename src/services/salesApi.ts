import axios from 'axios';

const BASE_URL = 'https://finfinphone.com/api-lucky/admin/price_estimation';
const ADMIN_BASE_URL = 'https://finfinphone.com/api-lucky/admin';

export interface PriceEstimationData {
  id?: string;
  customerId: string;
  salesOwnerId: string;
  estimateDate: string;
  jobName: string;
  productCategory: string;
  productType: string;
  quantity: string; // Backend expects int/decimal, but frontend state is string
  budget: string;
  status: string;
  estimateNote: string;
  eventDate: string;
  material: string;
  customMaterial: string;
  hasDesign: string;
  designDescription: string;

  // Medal
  medalSize: string;
  medalThickness: string;
  selectedColors: string[];
  frontDetails: string[];
  backDetails: string[];
  lanyardSize: string;
  lanyardPatterns: string;

  // Lanyard
  strapSize: string;
  strapPatternCount: string;
  sewingOption: string;

  // Award
  awardDesignDetails: string;
  plaqueOption: string;
  plaqueText: string;
  inscriptionPlate: string;
  inscriptionDetails: string;

  // Generic
  genericDesignDetails: string;

  // Dimensions
  width: string;
  length: string;
  height: string;
  thickness: string;

  // Files
  attachedFiles: string[]; // URLs or paths
}

export const salesApi = {
  savePriceEstimation: async (data: PriceEstimationData) => {
    try {
      const response = await axios.post(`${BASE_URL}/save_price_estimation.php`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error saving price estimation:', error);
      throw error;
    }
  },

  getPriceEstimations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get_price_estimations.php`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price estimations:', error);
      throw error;
    }
  },

  getPriceEstimationDetail: async (id: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/get_price_estimation_detail.php?id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price estimation detail:', error);
      throw error;
    }
  },

  getCustomers: async () => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}/get_customers.php`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
};
