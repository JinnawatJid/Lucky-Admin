import axios from 'axios';

const BASE_URL = 'https://finfinphone.com/api-lucky/admin/price_estimation';

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

  getPriceEstimationById: async (id: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/get_price_estimation_detail.php?id=${id}`);
      const data = response.data;

      // Transform snake_case to camelCase and flatten customer info
      return {
        id: data.id,
        customerId: data.customer_id,
        salesOwnerId: data.sales_owner_id,
        estimateDate: data.estimate_date,
        jobName: data.job_name,
        productCategory: data.product_category,
        productType: data.product_type,
        quantity: data.quantity,
        budget: data.budget,
        status: data.status,
        estimateNote: data.estimate_note,
        eventDate: data.event_date,
        material: data.material,
        customMaterial: data.custom_material,
        hasDesign: data.has_design,
        designDescription: data.design_description,

        medalSize: data.medal_size,
        medalThickness: data.medal_thickness,
        selectedColors: data.selected_colors,
        frontDetails: data.front_details,
        backDetails: data.back_details,
        lanyardSize: data.lanyard_size,
        lanyardPatterns: data.lanyard_patterns,
        strapSize: data.strap_size,
        strapPatternCount: data.strap_pattern_count,
        sewingOption: data.sewing_option,
        awardDesignDetails: data.award_design_details,
        plaqueOption: data.plaque_option,
        plaqueText: data.plaque_text,
        inscriptionPlate: data.inscription_plate,
        inscriptionDetails: data.inscription_details,
        genericDesignDetails: data.generic_design_details,
        width: data.width,
        length: data.length,
        height: data.height,
        thickness: data.thickness,
        attachedFiles: data.attached_files,

        // Customer Info
        customerName: data.company_name || data.contact_name,
        customerPhone: data.phone_numbers?.[0] || '',
        customerLineId: data.customer_line_id,
        customerEmail: data.emails?.[0] || '',
        customerTags: data.customer_type,

        salesOwner: data.sales_owner_id // Map to this field for UI compatibility
      };
    } catch (error) {
      console.error('Error fetching price estimation detail:', error);
      throw error;
    }
  },
};
