import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Upload, User, FileText, X, Search, XCircle, History, AlertCircle, Calendar, Package, Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { NestedProductSelect } from "@/components/sales/NestedProductSelect";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { salesApi } from "@/services/salesApi";

interface Customer {
  id: string;
  company_name: string;
  contact_name: string;
  phone_numbers: string[];
  line_id: string | null;
  emails: string[];
  customer_type: string;
  notes: string | null;
}

// Mock data for previous estimations (โมเดลเดิม)
interface PreviousEstimation {
  id: string;
  date: string;
  jobName: string;
  productCategory: string;
  productType: string;
  productTypeLabel: string;
  quantity: number;
  budget: number | null;
  customerId: string;
  customerName: string;
  // Details
  material: string;
  selectedColors: string[];
  lanyardSize: string;
  lanyardPatterns: string;
  medalSize: string;
  medalThickness: string;
  awardDesignDetails: string;
  plaqueOption: string;
  plaqueText: string;
  genericDesignDetails: string;
  designDescription: string;
  hasDesign: string;
  // เพิ่มสำหรับเหรียญสั่งผลิต
  frontDetails: string[];
  backDetails: string[];
}

const mockPreviousEstimations: PreviousEstimation[] = [
  {
    id: "est-001",
    date: "2024-01-10",
    jobName: "งานวิ่งมาราธอน 2024",
    productCategory: "สินค้าสั่งผลิต",
    productType: "medal",
    productTypeLabel: "เหรียญสั่งผลิต",
    quantity: 500,
    budget: 25000,
    customerId: "cust-001",
    customerName: "นันทกานต์",
    material: "zinc-alloy",
    selectedColors: ["shinny-gold", "shinny-silver"],
    lanyardSize: "2x90",
    lanyardPatterns: "3",
    medalSize: "6cm",
    medalThickness: "5mm",
    awardDesignDetails: "",
    plaqueOption: "no-plaque",
    plaqueText: "",
    genericDesignDetails: "",
    designDescription: "",
    hasDesign: "has-design",
    frontDetails: ["พิมพ์โลโก้", "แกะสลักข้อความ"],
    backDetails: ["ลงน้ำยาป้องกันสนิม"]
  },
  {
    id: "est-002",
    date: "2024-02-15",
    jobName: "งานกีฬาสี",
    productCategory: "สินค้าสั่งผลิต",
    productType: "medal",
    productTypeLabel: "เหรียญสั่งผลิต",
    quantity: 300,
    budget: 15000,
    customerId: "cust-001",
    customerName: "นันทกานต์",
    material: "acrylic",
    selectedColors: ["antique-gold"],
    lanyardSize: "1.5x90",
    lanyardPatterns: "1",
    medalSize: "5.5cm",
    medalThickness: "4mm",
    awardDesignDetails: "",
    plaqueOption: "no-plaque",
    plaqueText: "",
    genericDesignDetails: "",
    designDescription: "",
    hasDesign: "has-design",
    frontDetails: ["ลงสีสเปรย์", "ขัดเงา"],
    backDetails: ["แกะลึก"]
  },
  {
    id: "est-003",
    date: "2024-03-20",
    jobName: "งานประกาศเกียรติคุณ",
    productCategory: "สินค้าสั่งผลิต",
    productType: "medal",
    productTypeLabel: "เหรียญสั่งผลิต",
    quantity: 100,
    budget: null,
    customerId: "cust-001",
    customerName: "นันทกานต์",
    material: "crystal",
    selectedColors: ["shinny-silver"],
    lanyardSize: "no-lanyard",
    lanyardPatterns: "0",
    medalSize: "7cm",
    medalThickness: "6mm",
    awardDesignDetails: "",
    plaqueOption: "no-plaque",
    plaqueText: "",
    genericDesignDetails: "",
    designDescription: "",
    hasDesign: "has-design",
    frontDetails: ["พิมพ์ซิลค์สกรีน"],
    backDetails: []
  },
  {
    id: "est-004",
    date: "2024-01-25",
    jobName: "โล่ผู้บริหารดีเด่น",
    productCategory: "สินค้าสั่งผลิต",
    productType: "award",
    productTypeLabel: "โล่สั่งผลิต",
    quantity: 50,
    budget: 35000,
    customerId: "cust-001",
    customerName: "นันทกานต์",
    material: "crystal",
    selectedColors: [],
    lanyardSize: "",
    lanyardPatterns: "",
    medalSize: "",
    medalThickness: "",
    awardDesignDetails: "โล่คริสตัลทรงสี่เหลี่ยม ขนาด 8 นิ้ว พิมพ์ UV สีเต็มใบ",
    plaqueOption: "has-plaque",
    plaqueText: "ผู้บริหารดีเด่น ประจำปี 2567",
    genericDesignDetails: "",
    designDescription: "",
    hasDesign: "has-design",
    frontDetails: [],
    backDetails: []
  },
  {
    id: "est-005",
    date: "2024-04-10",
    jobName: "สายคล้องบัตรพนักงาน",
    productCategory: "หมวดสายคล้อง",
    productType: "lanyard",
    productTypeLabel: "สายคล้อง",
    quantity: 1000,
    budget: 8000,
    customerId: "cust-002",
    customerName: "บริษัท ABC จำกัด",
    material: "polyscreen",
    selectedColors: [],
    lanyardSize: "2x90",
    lanyardPatterns: "2",
    medalSize: "",
    medalThickness: "",
    awardDesignDetails: "",
    plaqueOption: "",
    plaqueText: "",
    genericDesignDetails: "สายคล้องโพลีสกรีน พิมพ์โลโก้บริษัท 2 สี ติดตัวล็อคพลาสติก",
    designDescription: "",
    hasDesign: "has-design",
    frontDetails: [],
    backDetails: []
  }
];

export default function AddPriceEstimation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = Boolean(id);
  
  // Customer search state
  const [customerSearch, setCustomerSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Section A: Customer Profile State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLineId, setCustomerLineId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [customerTags, setCustomerTags] = useState("");

  // Section B: Price Estimation State
  const [estimateDate, setEstimateDate] = useState(new Date().toISOString().split('T')[0]);
  const [salesOwnerId, setSalesOwnerId] = useState("");
  const [jobName, setJobName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [status] = useState("รอประเมินราคา"); // Default status - not shown in UI
  const [estimateNote, setEstimateNote] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [material, setMaterial] = useState("");
  const [hasDesign, setHasDesign] = useState<string>("");

  // โมเดลเดิม State
  const [usePreviousModel, setUsePreviousModel] = useState(false);
  const [previousEstimations, setPreviousEstimations] = useState<PreviousEstimation[]>([]);
  const [selectedPreviousEstimation, setSelectedPreviousEstimation] = useState<PreviousEstimation | null>(null);
  const [showPreviousOrderModal, setShowPreviousOrderModal] = useState(false);
  const [modalEditColors, setModalEditColors] = useState<string[]>([]);
  const [modalEditLanyardSize, setModalEditLanyardSize] = useState("");
  const [modalEditLanyardPatterns, setModalEditLanyardPatterns] = useState("");
  
  // Summary popup state
  const [showSummaryPopup, setShowSummaryPopup] = useState(false);
  const [showAwardSummaryPopup, setShowAwardSummaryPopup] = useState(false);
  const [selectedFromPreviousModel, setSelectedFromPreviousModel] = useState(false);
  const [originalOrderReference, setOriginalOrderReference] = useState<string>("");

  // Medal specific state
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [frontDetails, setFrontDetails] = useState<string[]>([]);
  const [backDetails, setBackDetails] = useState<string[]>([]);
  const [lanyardSize, setLanyardSize] = useState("");
  const [lanyardPatterns, setLanyardPatterns] = useState("");
  const [medalSize, setMedalSize] = useState("");
  const [medalThickness, setMedalThickness] = useState("");

  // Lanyard specific state (หมวดสายคล้อง > สายคล้อง)
  const [strapSize, setStrapSize] = useState("");
  const [strapPatternCount, setStrapPatternCount] = useState("");
  const [sewingOption, setSewingOption] = useState("");
  const [showLanyardSummaryPopup, setShowLanyardSummaryPopup] = useState(false);

  // Award specific state
  const [awardModel, setAwardModel] = useState("");
  const [inscriptionPlate, setInscriptionPlate] = useState("");
  const [inscriptionDetails, setInscriptionDetails] = useState("");
  
  // โล่สั่งผลิต dynamic form state
  const [awardDesignDetails, setAwardDesignDetails] = useState("");
  const [plaqueOption, setPlaqueOption] = useState("no-plaque");
  const [plaqueText, setPlaqueText] = useState("");
  
  // Generic design details for ของใช้, หมวดสายคล้อง, ของพรีเมียม (มีแบบ)
  const [genericDesignDetails, setGenericDesignDetails] = useState("");
  
  // Custom material input
  const [customMaterial, setCustomMaterial] = useState("");

  // Dimensions (สำหรับสินค้าอื่นๆ ที่ไม่ใช่เหรียญ)
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [thickness, setThickness] = useState("");

  // No-design form state
  const [designDescription, setDesignDescription] = useState("");

  // File attachments
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]); // For Edit Mode

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoadingCustomers(true);
      try {
        const data = await salesApi.getCustomers();
        setCustomers(data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลลูกค้าได้",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCustomers(false);
      }
    };
    
    fetchCustomers();
  }, [toast]);

  // Fetch estimation data for Edit Mode
  useEffect(() => {
    if (!isEditMode || !id || customers.length === 0) return;

    const fetchEstimation = async () => {
      try {
        const data = await salesApi.getPriceEstimationDetail(id);

        // Populate fields
        setSelectedCustomerId(data.customerId);
        setSalesOwnerId(data.salesOwnerId || "");
        setEstimateDate(data.estimateDate || new Date().toISOString().split('T')[0]);
        setJobName(data.jobName || "");
        setProductCategory(data.productCategory || "");
        setSelectedProductType(data.productType || "");
        setQuantity(data.quantity?.toString() || "");
        setPrice(data.budget?.toString() || "");
        setEstimateNote(data.notes || "");
        setEventDate(data.eventDate || "");
        setMaterial(data.material || "");
        setHasDesign(data.hasDesign || "");
        setDesignDescription(data.genericDesignDetails || ""); // Map generic details to description if needed, or specific field

        // Files
        if (data.attachedFiles && Array.isArray(data.attachedFiles)) {
          setExistingFiles(data.attachedFiles);
        }

        // Medal specific
        setMedalSize(data.medalSize || "");
        setMedalThickness(data.medalThickness || "");
        setSelectedColors(data.selectedColors || []);
        setFrontDetails(data.frontDetails || []);
        setBackDetails(data.backDetails || []);
        setLanyardSize(data.lanyardSize || "");
        setLanyardPatterns(data.lanyardPatterns || "");

        // Lanyard
        // Note: Check backend response fields mapping for strapSize, etc. if different

        // Award
        setAwardDesignDetails(data.awardDesignDetails || "");
        setPlaqueOption(data.plaqueOption || "no-plaque");
        setPlaqueText(data.plaqueText || "");

        // Generic
        setGenericDesignDetails(data.genericDesignDetails || "");

        // Find and set customer info based on ID
        const customer = customers.find(c => c.id === data.customerId);
        if (customer) {
          setCustomerName(customer.contact_name || customer.company_name);
          setCustomerPhone(customer.phone_numbers?.[0] || "");
          setCustomerLineId(customer.line_id || "");
          setCustomerEmail(customer.emails?.[0] || "");
          setCustomerTags(customer.customer_type || "");
          setCustomerNote(customer.notes || "");
        } else {
          // Fallback if customer not found in list (or legacy data)
          setCustomerName(data.customerName || "");
          setCustomerPhone(data.customerPhone || "");
          setCustomerLineId(data.customerLineId || "");
          setCustomerEmail(data.customerEmail || "");
        }

      } catch (error) {
        console.error("Error fetching estimation:", error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลการประเมินราคาได้",
          variant: "destructive",
        });
      }
    };

    fetchEstimation();
  }, [isEditMode, id, customers, toast]);

  // Filter customers based on search
  useEffect(() => {
    if (customerSearch.trim() === "") {
      setFilteredCustomers([]);
      return;
    }

    const searchLower = customerSearch.toLowerCase();
    const filtered = customers.filter(customer => {
      const nameMatch = customer.company_name?.toLowerCase().includes(searchLower) || 
                        customer.contact_name?.toLowerCase().includes(searchLower);
      const phoneMatch = customer.phone_numbers?.some(p => p.includes(customerSearch));
      const lineMatch = customer.line_id?.toLowerCase().includes(searchLower);
      return nameMatch || phoneMatch || lineMatch;
    });
    
    setFilteredCustomers(filtered);
  }, [customerSearch, customers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setCustomerName(customer.contact_name || customer.company_name);
    setCustomerPhone(customer.phone_numbers?.[0] || "");
    setCustomerLineId(customer.line_id || "");
    setCustomerEmail(customer.emails?.[0] || "");
    setCustomerTags(customer.customer_type || "");
    setCustomerNote(customer.notes || "");
    setCustomerSearch("");
    setShowCustomerDropdown(false);
    
    toast({
      title: "เลือกลูกค้าสำเร็จ",
      description: `ดึงข้อมูลของ "${customer.contact_name || customer.company_name}" แล้ว`,
    });
  };

  const handleClearCustomerSelection = () => {
    setSelectedCustomerId(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerLineId("");
    setCustomerEmail("");
    setCustomerTags("");
    setCustomerNote("");
    setCustomerSearch("");
    
    toast({
      title: "ล้างการเลือกลูกค้า",
      description: "กลับสู่โหมดกรอกลูกค้าใหม่",
    });
  };

  const productCategoryOptions = [
    { value: "สินค้าสั่งผลิต", label: "สินค้าสั่งผลิต" },
    { value: "ของใช้", label: "ของใช้" },
    { value: "หมวดสายคล้อง", label: "หมวดสายคล้อง" },
    { value: "ของพรีเมียม", label: "ของพรีเมียม" },
  ];

  // Mapping: product_category -> filtered products
  const productsByCategory: Record<string, { value: string; label: string }[]> = {
    "สินค้าสั่งผลิต": [
      { value: "medal", label: "เหรียญสั่งผลิต" },
      { value: "award", label: "โล่สั่งผลิต" },
    ],
    "ของใช้": [
      { value: "hat", label: "หมวก" },
      { value: "bag", label: "กระเป๋า" },
      { value: "glass", label: "แก้ว" },
      { value: "bottle", label: "ขวดน้ำ" },
      { value: "doll", label: "ตุ๊กตา" },
      { value: "notebook", label: "สมุด" },
      { value: "calendar", label: "ปฏิทิน" },
    ],
    "หมวดสายคล้อง": [
      { value: "wristband", label: "ลิสแบรนด์" },
      { value: "lanyard", label: "สายคล้อง" },
    ],
    "ของพรีเมียม": [
      { value: "magnet", label: "แม่เหล็ก" },
      { value: "bottle-opener", label: "ที่เปิดขวด" },
      { value: "keychain", label: "พวงกุญแจ" },
      { value: "paperweight", label: "ที่ทับกระดาษ" },
    ],
  };

  // Medal standard sizes
  const medalSizes = [
    { value: "5cm", label: "5 ซม." },
    { value: "5.5cm", label: "5.5 ซม." },
    { value: "6cm", label: "6 ซม." },
    { value: "6.5cm", label: "6.5 ซม." },
    { value: "7cm", label: "7 ซม." },
    { value: "7.5cm", label: "7.5 ซม." },
    { value: "8cm", label: "8 ซม." },
    { value: "custom", label: "กำหนดเอง" },
  ];

  // Medal thickness options
  const medalThicknessOptions = [
    { value: "4mm", label: "4 มิล" },
    { value: "5mm", label: "5 มิล" },
    { value: "6mm", label: "6 มิล" },
    { value: "7mm", label: "7 มิล" },
  ];

  const handleProductSelect = (category: string, product: string) => {
    setProductCategory(category);
    setSelectedProductType(product);
    setHasDesign(""); // Reset design status
    resetProductSpecificFields();
  };

  const handleCategoryChange = (category: string) => {
    setProductCategory(category);
    setSelectedProductType(""); // Reset product when category changes
    setHasDesign("");
    resetProductSpecificFields();
  };


  const resetProductSpecificFields = () => {
    setMaterial("");
    setCustomMaterial("");
    setSelectedColors([]);
    setFrontDetails([]);
    setBackDetails([]);
    setLanyardSize("");
    setLanyardPatterns("");
    setMedalSize("");
    setMedalThickness("");
    setAwardModel("");
    setInscriptionPlate("");
    setInscriptionDetails("");
    setWidth("");
    setLength("");
    setHeight("");
    setThickness("");
    setDesignDescription("");
    // Reset โล่สั่งผลิต fields
    setAwardDesignDetails("");
    setPlaqueOption("no-plaque");
    setPlaqueText("");
    // Reset generic design details
    setGenericDesignDetails("");
    // Reset โมเดลเดิม
    setUsePreviousModel(false);
    setSelectedPreviousEstimation(null);
    setPreviousEstimations([]);
    // Reset lanyard specific fields
    setStrapSize("");
    setStrapPatternCount("");
    setSewingOption("");
  };

  // Filter previous estimations based on customer and product
  const filterPreviousEstimations = () => {
    if (!customerName || !selectedProductType) {
      return [];
    }
    
    // Filter mock data by customer name and product type
    return mockPreviousEstimations.filter(est => 
      est.customerName.toLowerCase().includes(customerName.toLowerCase()) &&
      est.productType === selectedProductType
    );
  };

  // Handle "โมเดลเดิม" checkbox change
  const handleUsePreviousModelChange = (checked: boolean) => {
    setUsePreviousModel(checked);
    setSelectedPreviousEstimation(null);
    setShowPreviousOrderModal(false);
    
    if (checked) {
      const filtered = filterPreviousEstimations();
      setPreviousEstimations(filtered);
    } else {
      setPreviousEstimations([]);
    }
  };

  // Handle clicking on a previous order item - open modal
  const handleOpenPreviousOrderModal = (estimation: PreviousEstimation) => {
    setSelectedPreviousEstimation(estimation);
    setModalEditColors([...estimation.selectedColors]);
    setModalEditLanyardSize(estimation.lanyardSize);
    setModalEditLanyardPatterns(estimation.lanyardPatterns);
    setShowPreviousOrderModal(true);
  };

  // Toggle color in modal
  const toggleModalColor = (color: string) => {
    setModalEditColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  // Handle selecting the order from modal - lock fields and pre-fill from previous order
  const handleSelectOrderFromModal = () => {
    if (!selectedPreviousEstimation) return;

    // Pre-fill LOCKED fields from previous estimation (read-only)
    setMaterial(selectedPreviousEstimation.material);
    setMedalSize(selectedPreviousEstimation.medalSize);
    setMedalThickness(selectedPreviousEstimation.medalThickness || "");
    setHasDesign(selectedPreviousEstimation.hasDesign);
    setFrontDetails([...selectedPreviousEstimation.frontDetails]);
    setBackDetails([...selectedPreviousEstimation.backDetails]);
    
    // Apply EDITABLE fields from modal (can still be modified)
    setSelectedColors([...modalEditColors]);
    setLanyardSize(modalEditLanyardSize);
    setLanyardPatterns(modalEditLanyardPatterns);
    
    // Track that we used previous model (keep usePreviousModel = true for locking)
    setSelectedFromPreviousModel(true);
    setOriginalOrderReference(`${new Date(selectedPreviousEstimation.date).toLocaleDateString('th-TH')} — ${selectedPreviousEstimation.jobName}`);
    
    // Close modal but KEEP usePreviousModel = true to lock fields
    setShowPreviousOrderModal(false);
    // DO NOT reset these - keep the selection to show locked state
    // setUsePreviousModel(false);
    // setSelectedPreviousEstimation(null);
    // setPreviousEstimations([]);
    
    toast({
      title: "เลือกออเดอร์เดิมสำเร็จ",
      description: "ข้อมูลรายละเอียดสินค้าถูกล็อกจากโมเดลเดิม ยังแก้ไขได้เฉพาะ สี, สายคล้อง, จำนวน, งบประมาณ",
    });
  };

  // Cancel previous model selection - reset all locked fields
  const handleCancelPreviousModel = () => {
    setUsePreviousModel(false);
    setSelectedPreviousEstimation(null);
    setPreviousEstimations([]);
    setShowPreviousOrderModal(false);
    setSelectedFromPreviousModel(false);
    setOriginalOrderReference("");
    // Reset locked fields
    setMaterial("");
    setMedalSize("");
    setMedalThickness("");
    setFrontDetails([]);
    setBackDetails([]);
    setHasDesign("");
  };
  
  // Check if fields should be locked (previous model selected and order chosen)
  const isFieldLocked = usePreviousModel && selectedPreviousEstimation !== null;

  // Get color label by value
  const getColorLabel = (colorValue: string) => {
    const color = colors.find(c => c.value === colorValue);
    return color?.label || colorValue;
  };

  // Get material label by value  
  const getMaterialLabel = (materialValue: string) => {
    const allMaterials = [
      ...materialsByType.medal || [],
      ...materialsByType.award || [],
      ...materialsByType.lanyard || [],
      ...materialsByType.wristband || []
    ];
    const mat = allMaterials.find(m => m.value === materialValue);
    return mat?.label || materialValue;
  };

  // Get lanyard size label
  const getLanyardSizeLabel = (sizeValue: string) => {
    const size = lanyardSizes.find(s => s.value === sizeValue);
    return size?.label || sizeValue;
  };

  // Clear plaque text when switching to no-plaque
  const handlePlaqueOptionChange = (value: string) => {
    setPlaqueOption(value);
    if (value === "no-plaque") {
      setPlaqueText("");
    }
  };

  const materialsByType: Record<string, { value: string; label: string }[]> = {
    medal: [
      { value: "zinc-alloy", label: "ซิงค์อัลลอย" },
      { value: "acrylic", label: "อะคริลิค" },
      { value: "crystal", label: "คริสตัล" },
      { value: "pvc", label: "PVC" },
      { value: "wood", label: "ไม้" },
      { value: "other", label: "อื่นๆ (โปรดระบุ)" }
    ],
    award: [
      { value: "acrylic", label: "อะคริลิค" },
      { value: "crystal", label: "คริสตัล" },
      { value: "zinc-alloy", label: "ซิงค์อัลลอย" },
      { value: "other", label: "อื่นๆ (โปรดระบุ)" }
    ],
    lanyard: [
      { value: "polyscreen", label: "โพลีสกรีน" }
    ],
    wristband: [
      { value: "rubber", label: "ยาง (ริสแบรน)" },
      { value: "paper", label: "กระดาษ (ริสแบรน)" },
      { value: "microfiber", label: "ผ้าไมโครเรียบ" },
      { value: "star-fabric", label: "ผ้าดาวกระจาย" },
      { value: "rice-fabric", label: "ผ้าเม็ดข้าวสาร" },
      { value: "foam", label: "โฟม" },
      { value: "other", label: "อื่นๆ (โปรดระบุ)" }
    ]
  };

  const colors = [
    { value: "shinny-gold", label: "shinny gold (สีทองเงา)" },
    { value: "shinny-silver", label: "shinny silver (สีเงินเงา)" },
    { value: "shinny-copper", label: "shinny copper (สีทองแดงเงา)" },
    { value: "antique-gold", label: "antique gold (สีทองรมดำ)" },
    { value: "antique-silver", label: "antique silver (สีเงินรมดำ)" },
    { value: "antique-copper", label: "antique copper (สีทองแดงรมดำ)" },
    { value: "misty-gold", label: "misty gold (สีทองด้าน)" },
    { value: "misty-silver", label: "misty silver (สีเงินด้าน)" },
    { value: "misty-copper", label: "misty copper (สีทองแดงด้าน)" }
  ];

  const lanyardSizes = [
    { value: "1.5x90", label: "1.5 × 90 ซม" },
    { value: "2x90", label: "2 × 90 ซม" },
    { value: "2.5x90", label: "2.5 × 90 ซม" },
    { value: "3x90", label: "3 × 90 ซม" },
    { value: "3.5x90", label: "3.5 × 90 ซม" },
    { value: "no-lanyard", label: "ไม่รับสาย" }
  ];

  // Strap sizes for หมวดสายคล้อง > สายคล้อง
  const strapSizeOptions = [
    { value: "90x2.5", label: "90 x 2.5 ซม." },
    { value: "90x3", label: "90 x 3 ซม." },
  ];

  // Get strap size label
  const getStrapSizeLabel = (sizeValue: string) => {
    const size = strapSizeOptions.find(s => s.value === sizeValue);
    return size?.label || sizeValue;
  };

  const detailOptions = [
    "พิมพ์โลโก้",
    "แกะสลักข้อความ",
    "ลงสีสเปรย์",
    "ขัดเงา",
    "ลงน้ำยาป้องกันสนิม",
    "แกะลึก",
    "พิมพ์ซิลค์สกรีน",
    "ปั๊มลาย"
  ];

  const salesOptions = [
    { value: "sales1", label: "พนักงานขาย 1" },
    { value: "sales2", label: "พนักงานขาย 2" },
    { value: "sales3", label: "พนักงานขาย 3" }
  ];

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const toggleDetail = (detail: string, type: 'front' | 'back') => {
    if (type === 'front') {
      setFrontDetails(prev => 
        prev.includes(detail) 
          ? prev.filter(d => d !== detail)
          : [...prev, detail]
      );
    } else {
      setBackDetails(prev => 
        prev.includes(detail) 
          ? prev.filter(d => d !== detail)
          : [...prev, detail]
      );
    }
  };

  const getCurrentMaterials = () => {
    return materialsByType[selectedProductType] || [];
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index: number) => {
    setExistingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Validate customer key (phone or line_id required) - skip if existing customer selected
    if (!selectedCustomerId && !customerPhone && !customerLineId) {
      toast({
        title: "ไม่สามารถบันทึกได้",
        description: "กรุณากรอกเบอร์โทรหรือ LINE ID อย่างน้อย 1 อย่าง",
        variant: "destructive",
      });
      return;
    }

    if (!customerName) {
      toast({
        title: "ไม่สามารถบันทึกได้",
        description: "กรุณากรอกชื่อลูกค้า",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProductType) {
      toast({
        title: "ไม่สามารถบันทึกได้",
        description: "กรุณาเลือกสินค้า",
        variant: "destructive",
      });
      return;
    }

    // Show summary popup for เหรียญสั่งผลิต
    if (selectedProductType === 'medal') {
      setShowSummaryPopup(true);
      return;
    }

    // Show summary popup for โล่สั่งผลิต
    if (selectedProductType === 'award') {
      setShowAwardSummaryPopup(true);
      return;
    }

    // Show summary popup for สายคล้อง
    if (selectedProductType === 'lanyard') {
      setShowLanyardSummaryPopup(true);
      return;
    }

    // For other products, save directly
    handleConfirmSave();
  };

  const handleConfirmSave = async () => {
    setShowSummaryPopup(false);
    setShowAwardSummaryPopup(false);
    setShowLanyardSummaryPopup(false);
    
    try {
      // Upload new files first
      const uploadedFilePaths: string[] = [];

      if (attachedFiles.length > 0) {
        // Show loading toast if there are files to upload
        toast({
          title: "กำลังบันทึก...",
          description: `กำลังอัปโหลด ${attachedFiles.length} ไฟล์`,
        });

        try {
          for (const file of attachedFiles) {
            const path = await salesApi.uploadFile(file);
            uploadedFilePaths.push(path);
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast({
            title: "อัปโหลดไฟล์ล้มเหลว",
            description: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์ กรุณาลองใหม่",
            variant: "destructive",
          });
          return; // Stop saving if upload fails
        }
      }

      // Combine with existing files
      const finalAttachedFiles = [...existingFiles, ...uploadedFilePaths];

      // Prepare payload for API
      const payload = {
        id: isEditMode ? id : undefined, // Include ID for update
        customerId: selectedCustomerId || "", // Note: If new customer, logic needs improvement to create customer first
        salesOwnerId,
        estimateDate,
        jobName,
        productCategory,
        productType: selectedProductType,
        quantity,
        budget: price,
        status,
        estimateNote,
        eventDate,
        material,
        customMaterial,
        hasDesign,
        designDescription,

        // Medal
        medalSize,
        medalThickness,
        selectedColors,
        frontDetails,
        backDetails,
        lanyardSize,
        lanyardPatterns,

        // Lanyard
        strapSize,
        strapPatternCount,
        sewingOption,

        // Award
        awardDesignDetails,
        plaqueOption,
        plaqueText,
        inscriptionPlate,
        inscriptionDetails,

        // Generic
        genericDesignDetails,

        // Dimensions
        width,
        length,
        height,
        thickness,

        // Files (send paths)
        attachedFiles: finalAttachedFiles,
      };

      await salesApi.savePriceEstimation(payload);

      toast({
        title: "สำเร็จ",
        description: "บันทึกประเมินราคาเรียบร้อยแล้ว",
      });
      
      // Reset previous model tracking
      setSelectedFromPreviousModel(false);
      setOriginalOrderReference("");
      
      navigate("/sales/price-estimation");
    } catch (error) {
      console.error("Error saving estimation:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  // Copy functions for summary popups
  const copyMedalSummary = () => {
    const productName = `${productCategory} > ${productsByCategory[productCategory]?.find(p => p.value === selectedProductType)?.label}`;
    let text = `สินค้า:${productName}`;
    if (material) text += `\n\nวัสดุ:${getMaterialLabel(material)}`;
    if (jobName) text += `\n\nชื่องาน:${jobName}`;
    if (selectedColors.length > 0) text += `\n\nสี:${selectedColors.map(c => getColorLabel(c)).join(", ")}`;
    if (frontDetails.length > 0) text += `\n\nรายละเอียดด้านหน้า:${frontDetails.join(", ")}`;
    if (backDetails.length > 0) text += `\n\nรายละเอียดด้านหลัง:${backDetails.join(", ")}`;
    if (medalSize) text += `\n\nSize:${medalSizes.find(s => s.value === medalSize)?.label || medalSize}`;
    if (medalThickness) text += `\n\nความหนา:${medalThicknessOptions.find(t => t.value === medalThickness)?.label || medalThickness}`;
    if (lanyardSize) text += `\n\nขนาดสายคล้อง:${getLanyardSizeLabel(lanyardSize)}`;
    if (lanyardPatterns) text += `\n\nจำนวนแบบสายคล้อง:${lanyardPatterns}`;
    if (quantity) text += `\n\nจำนวน:${parseInt(quantity).toLocaleString()}`;
    
    navigator.clipboard.writeText(text);
    toast({ title: "คัดลอกแล้ว", description: "คัดลอกข้อมูลสรุปเรียบร้อย" });
  };

  const copyAwardSummary = () => {
    let text = `สินค้า:สินค้าสั่งผลิต > โล่สั่งผลิต`;
    if (material) text += `\n\nวัสดุ:${getMaterialLabel(material)}`;
    if (quantity) text += `\n\nจำนวน:${parseInt(quantity).toLocaleString()}`;
    if (awardDesignDetails) text += `\n\nรายละเอียดงานเพิ่มเติม:${awardDesignDetails}`;
    
    navigator.clipboard.writeText(text);
    toast({ title: "คัดลอกแล้ว", description: "คัดลอกข้อมูลสรุปเรียบร้อย" });
  };

  const copyLanyardSummary = () => {
    let text = `สินค้า:สายคล้อง`;
    if (customerLineId) text += `\n\nLINE:${customerLineId}`;
    if (sewingOption) text += `\n\nรูปแบบการเย็บ:${sewingOption === 'sew' ? 'เย็บสาย' : 'ไม่เย็บสาย'}`;
    if (strapSize) text += `\n\nขนาดสาย:${getStrapSizeLabel(strapSize)}`;
    if (strapPatternCount) text += `\n\nจำนวนแบบ:${strapPatternCount}`;
    if (quantity) text += `\n\nจำนวน:${parseInt(quantity).toLocaleString()}`;
    
    navigator.clipboard.writeText(text);
    toast({ title: "คัดลอกแล้ว", description: "คัดลอกข้อมูลสรุปเรียบร้อย" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/sales/price-estimation")}>
          <ArrowLeft className="h-4 w-4" />
          ย้อนกลับ
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditMode ? "แก้ไขประเมินราคา" : "เพิ่มประเมินราคา"}</h1>
          <p className="text-muted-foreground">
            {isEditMode ? "แก้ไขข้อมูลลูกค้าและรายละเอียดการประเมินราคา" : "กรอกข้อมูลลูกค้าและรายละเอียดการประเมินราคา"}
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Section A: Customer Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>ข้อมูลทั่วไปลูกค้า</CardTitle>
            </div>
            <CardDescription>ใช้ซ้ำทุกงาน ระบบจะจำให้</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ค้นหาลูกค้า - Search Autocomplete */}
            <div className="space-y-2" ref={searchRef}>
              <Label htmlFor="customer-search">ค้นหาลูกค้า</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="customer-search" 
                  placeholder="ค้นหาจาก ชื่อ / เบอร์โทร / LINE ID"
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerDropdown(true);
                  }}
                  onFocus={() => customerSearch && setShowCustomerDropdown(true)}
                  className="pl-9"
                />
                
                {/* Dropdown Results */}
                {showCustomerDropdown && customerSearch && (
                  <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {isLoadingCustomers ? (
                      <div className="p-3 text-center text-muted-foreground">กำลังโหลด...</div>
                    ) : filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <div className="font-semibold">{customer.contact_name || customer.company_name}</div>
                          <div className="text-sm text-muted-foreground flex gap-3">
                            {customer.phone_numbers?.[0] && (
                              <span>📞 {customer.phone_numbers[0]}</span>
                            )}
                            {customer.line_id && (
                              <span>LINE: {customer.line_id}</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-muted-foreground">
                        ไม่พบข้อมูลที่ตรงกัน
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Customer Indicator */}
              {selectedCustomerId && (
                <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md border border-primary/30">
                  <span className="text-sm text-primary">
                    ✓ เลือกลูกค้าเดิม: <span className="font-semibold">{customerName}</span>
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearCustomerSelection}
                    className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    ล้างการเลือก
                  </Button>
                </div>
              )}
            </div>

            {/* ชื่อลูกค้า - เต็มแถว */}
            <div className="space-y-2">
              <Label htmlFor="customer-name">ชื่อลูกค้า <span className="text-destructive">*</span></Label>
              <Input 
                id="customer-name" 
                placeholder="กรอกชื่อลูกค้า" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            {/* เบอร์โทร | LINE ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-phone">เบอร์โทร <span className="text-muted-foreground text-xs">(key หลัก)</span></Label>
                <Input 
                  id="customer-phone" 
                  placeholder="กรอกเบอร์โทร" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-line">ชื่อไลน์ <span className="text-muted-foreground text-xs">(key รอง)</span></Label>
                <Input 
                  id="customer-line" 
                  placeholder="กรอกชื่อไลน์" 
                  value={customerLineId}
                  onChange={(e) => setCustomerLineId(e.target.value)}
                />
              </div>
            </div>

            {/* อีเมล | ประเภทลูกค้า */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-email">อีเมล</Label>
                <Input 
                  id="customer-email" 
                  type="email"
                  placeholder="กรอกอีเมล" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-tags">ประเภทลูกค้า / แท็ก</Label>
                <Input 
                  id="customer-tags" 
                  placeholder="เช่น ลูกค้าประจำ, องค์กร" 
                  value={customerTags}
                  onChange={(e) => setCustomerTags(e.target.value)}
                />
              </div>
            </div>

            {/* หมายเหตุลูกค้า - เต็มแถว */}
            <div className="space-y-2">
              <Label htmlFor="customer-note">หมายเหตุลูกค้า</Label>
              <Textarea 
                id="customer-note" 
                placeholder="หมายเหตุเกี่ยวกับลูกค้า (ถ้ามี)" 
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
              />
            </div>

            {!selectedCustomerId && !customerPhone && !customerLineId && (
              <p className="text-sm text-destructive">* ต้องกรอกเบอร์โทรหรือ LINE ID อย่างน้อย 1 อย่าง (หรือเลือกจากลูกค้าเดิม)</p>
            )}
          </CardContent>
        </Card>

        {/* Section B: Price Estimation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>ข้อมูลการตีราคา (งานนี้)</CardTitle>
            </div>
            <CardDescription>เฉพาะงาน/ดีลครั้งนี้</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* วันที่ประเมินราคา | เซลล์ผู้รับผิดชอบ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimate-date">วันที่ประเมินราคา</Label>
                <Input 
                  type="date" 
                  id="estimate-date" 
                  value={estimateDate}
                  onChange={(e) => setEstimateDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sales-owner">เซลล์ผู้รับผิดชอบ</Label>
                <Select value={salesOwnerId} onValueChange={setSalesOwnerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเซลล์" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ชื่องาน | วันที่ใช้งาน - อยู่บรรทัดเดียวกัน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-name">ชื่องาน</Label>
                <Input 
                  id="job-name" 
                  placeholder="กรอกชื่องาน" 
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-date">วันที่ใช้งาน</Label>
                <Input 
                  type="date" 
                  id="event-date" 
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>

            {/* เลือกสินค้าแบบ 2 คอลัมน์ */}
            <div className="space-y-2">
              <Label>เลือกประเภทสินค้า / สินค้า</Label>
              <NestedProductSelect
                productCategory={productCategory}
                selectedProduct={selectedProductType}
                onSelect={handleProductSelect}
                productsByCategory={productsByCategory}
                categoryOptions={productCategoryOptions}
              />
            </div>

            {/* จำนวน | งบประมาณของลูกค้า - แสดงต่อจากเลือกสินค้า */}
            {selectedProductType && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">จำนวน</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="กรอกจำนวน" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">งบประมาณของลูกค้า</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="กรอกงบประมาณที่ลูกค้าแจ้ง (ถ้ามี)" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* โมเดลเดิม Checkbox - แสดงเฉพาะ เหรียญสั่งผลิต เท่านั้น และไม่ใช่โหมดแก้ไข */}
            {selectedProductType === 'medal' && !isEditMode && (
              <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="use-previous-model"
                    checked={usePreviousModel}
                    onCheckedChange={(checked) => {
                      if (customerName) {
                        handleUsePreviousModelChange(checked === true);
                      }
                    }}
                    disabled={!customerName}
                  />
                  <Label 
                    htmlFor="use-previous-model" 
                    className={`cursor-pointer flex items-center gap-2 ${!customerName ? 'text-muted-foreground' : ''}`}
                  >
                    <History className="h-4 w-4" />
                    โมเดลเดิม
                  </Label>
                </div>
                
                {/* แสดงข้อความแนะนำถ้ายังไม่ได้เลือกลูกค้า */}
                {!customerName && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>กรุณาเลือกชื่อลูกค้าก่อน เพื่อใช้งานโมเดลเดิม</span>
                  </div>
                )}
                
                {/* Previous Estimations List - แสดงเป็น List บนหน้าเลย */}
                {usePreviousModel && customerName && (
                  <div className="mt-4 space-y-3">
                    {previousEstimations.length > 0 ? (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">รายการออเดอร์เดิม ({previousEstimations.length} รายการ)</Label>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {previousEstimations.map((est) => (
                            <div
                              key={est.id}
                              onClick={() => handleOpenPreviousOrderModal(est)}
                              className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                      {new Date(est.date).toLocaleDateString('th-TH')} — {est.jobName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Package className="h-4 w-4" />
                                    <span>
                                      {est.productCategory} &gt; {est.productTypeLabel} | จำนวน: {est.quantity.toLocaleString()}
                                      {est.budget ? ` | งบ: ${est.budget.toLocaleString()} บาท` : ""}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">คลิกที่รายการเพื่อดูรายละเอียดและเลือกใช้</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground p-3 bg-background rounded-md border border-border">
                        <AlertCircle className="h-4 w-4" />
                        <span>ไม่พบออเดอร์เดิมของลูกค้ารายนี้</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ลูกค้ามีแบบแล้วหรือไม่ - แสดงเมื่อเลือกสินค้าแล้ว และไม่ได้เลือกโมเดลเดิม */}
            {selectedProductType && !usePreviousModel && (
              <div className="space-y-3">
                <Label>ลูกค้ามีแบบแล้วหรือไม่</Label>
                <RadioGroup value={hasDesign} onValueChange={setHasDesign} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="has-design" id="has-design" />
                    <Label htmlFor="has-design" className="font-normal cursor-pointer">มีแบบ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-design" id="no-design" />
                    <Label htmlFor="no-design" className="font-normal cursor-pointer">ไม่มีแบบ</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Material - แสดงเมื่อเลือก "มีแบบ" หรือเลือกโมเดลเดิมแล้ว */}
            {selectedProductType && ((!usePreviousModel && hasDesign === "has-design") || isFieldLocked) && getCurrentMaterials().length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="material" className={isFieldLocked ? "text-muted-foreground" : ""}>
                  วัสดุ {isFieldLocked && <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded ml-2">ล็อก</span>}
                </Label>
                <Select 
                  value={material} 
                  onValueChange={(val) => {
                    if (!isFieldLocked) {
                      setMaterial(val);
                      if (val !== "other") setCustomMaterial("");
                    }
                  }}
                  disabled={isFieldLocked}
                >
                  <SelectTrigger className={isFieldLocked ? "bg-muted/50 cursor-not-allowed opacity-70" : ""}>
                    <SelectValue placeholder="เลือกวัสดุ" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentMaterials().map((mat) => (
                      <SelectItem key={mat.value} value={mat.value}>
                        {mat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {material === "other" && !isFieldLocked && (
                  <Input
                    placeholder="ระบุวัสดุ"
                    value={customMaterial}
                    onChange={(e) => setCustomMaterial(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            )}

            {/* ฟิลด์เฉพาะสายคล้อง - ขนาดสาย + จำนวนแบบ + การเย็บสาย */}
            {productCategory === "หมวดสายคล้อง" && selectedProductType === "lanyard" && hasDesign === "has-design" && !usePreviousModel && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ขนาดสาย <span className="text-destructive">*</span></Label>
                    <Select value={strapSize} onValueChange={setStrapSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกขนาดสาย" />
                      </SelectTrigger>
                      <SelectContent>
                        {strapSizeOptions.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="strap-pattern-count">จำนวนแบบ</Label>
                    <Input 
                      id="strap-pattern-count" 
                      type="number" 
                      placeholder="กรอกจำนวนแบบ" 
                      value={strapPatternCount}
                      onChange={(e) => setStrapPatternCount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>การเย็บสาย <span className="text-destructive">*</span></Label>
                  <RadioGroup 
                    value={sewingOption} 
                    onValueChange={setSewingOption}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sew" id="sew-strap" />
                      <Label htmlFor="sew-strap" className="cursor-pointer">เย็บสาย</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no-sew" id="no-sew-strap" />
                      <Label htmlFor="no-sew-strap" className="cursor-pointer">ไม่เย็บสาย</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* รายละเอียดงานเพิ่มเติม - เต็มแถว */}
            <div className="space-y-2">
              <Label htmlFor="estimate-note">รายละเอียดงานเพิ่มเติม</Label>
              <Textarea 
                id="estimate-note" 
                placeholder="กรอกรายละเอียดเพิ่มเติม" 
                value={estimateNote}
                onChange={(e) => setEstimateNote(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Previous Order Modal - แสดงเมื่อคลิกที่รายการออเดอร์เดิม */}
      <Dialog open={showPreviousOrderModal} onOpenChange={setShowPreviousOrderModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              รายละเอียดออเดอร์เดิม
            </DialogTitle>
            <DialogDescription>
              ตรวจสอบข้อมูล และแก้ไขได้เฉพาะ: สี, ขนาดสายคล้อง, จำนวนแบบสายคล้อง
            </DialogDescription>
          </DialogHeader>
          
          {selectedPreviousEstimation && (
            <div className="space-y-6 py-4">
              {/* Read-only Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">ชื่องาน</Label>
                  <p className="font-medium">{selectedPreviousEstimation.jobName}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">สินค้า</Label>
                  <p className="font-medium">{selectedPreviousEstimation.productCategory} &gt; {selectedPreviousEstimation.productTypeLabel}</p>
                </div>
                {selectedPreviousEstimation.material && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">วัสดุ</Label>
                    <p className="font-medium">{getMaterialLabel(selectedPreviousEstimation.material)}</p>
                  </div>
                )}
                {selectedPreviousEstimation.frontDetails && selectedPreviousEstimation.frontDetails.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">รายละเอียดด้านหน้า</Label>
                    <p className="font-medium">{selectedPreviousEstimation.frontDetails.join(", ")}</p>
                  </div>
                )}
                {selectedPreviousEstimation.backDetails && selectedPreviousEstimation.backDetails.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">รายละเอียดด้านหลัง</Label>
                    <p className="font-medium">{selectedPreviousEstimation.backDetails.join(", ")}</p>
                  </div>
                )}
                {selectedPreviousEstimation.medalSize && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">ขนาดเหรียญ</Label>
                    <p className="font-medium">{medalSizes.find(s => s.value === selectedPreviousEstimation.medalSize)?.label || selectedPreviousEstimation.medalSize}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">จำนวนเดิม</Label>
                  <p className="font-medium">{selectedPreviousEstimation.quantity.toLocaleString()} ชิ้น</p>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="border-t border-border pt-6 space-y-4">
                <h4 className="font-semibold text-sm text-primary">ฟิลด์ที่แก้ไขได้</h4>
                
                {/* สี - Editable */}
                <div className="space-y-2">
                  <Label>สี (เลือกได้หลายสี)</Label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <div
                        key={color.value}
                        className={`px-3 py-2 rounded-md border cursor-pointer transition-colors text-sm ${
                          modalEditColors.includes(color.value)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                        onClick={() => toggleModalColor(color.value)}
                      >
                        {color.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ขนาดสายคล้อง - Editable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ขนาดสายคล้อง</Label>
                    <Select value={modalEditLanyardSize} onValueChange={setModalEditLanyardSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกขนาดสายคล้อง" />
                      </SelectTrigger>
                      <SelectContent>
                        {lanyardSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>จำนวนแบบสายคล้อง</Label>
                    <Input 
                      type="number" 
                      placeholder="กรอกจำนวนแบบ" 
                      value={modalEditLanyardPatterns}
                      onChange={(e) => setModalEditLanyardPatterns(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreviousOrderModal(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSelectOrderFromModal}>
              <Check className="h-4 w-4 mr-2" />
              เลือกออเดอร์นี้
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Popup - แสดงก่อนยืนยันบันทึก */}
      <Dialog open={showSummaryPopup} onOpenChange={setShowSummaryPopup}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>สรุปข้อมูลการส่งตีราคา</DialogTitle>
            <DialogDescription>ตรวจสอบข้อมูลก่อนยืนยันบันทึก</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">สินค้า:</span>
                <span className="font-medium text-right">
                  {productCategory} &gt; {productsByCategory[productCategory]?.find(p => p.value === selectedProductType)?.label}
                </span>
              </div>
              
              {material && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">วัสดุ:</span>
                  <span className="font-medium">{getMaterialLabel(material)}</span>
                </div>
              )}
              
              {jobName && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">ชื่องาน:</span>
                  <span className="font-medium">{jobName}</span>
                </div>
              )}
              
              {selectedColors.length > 0 && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">สี:</span>
                  <span className="font-medium text-right">{selectedColors.map(c => getColorLabel(c)).join(", ")}</span>
                </div>
              )}
              
              {frontDetails.length > 0 && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">รายละเอียดด้านหน้า:</span>
                  <span className="font-medium text-right">{frontDetails.join(", ")}</span>
                </div>
              )}
              
              {backDetails.length > 0 && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">รายละเอียดด้านหลัง:</span>
                  <span className="font-medium text-right">{backDetails.join(", ")}</span>
                </div>
              )}
              
              {medalSize && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">{medalSizes.find(s => s.value === medalSize)?.label || medalSize}</span>
                </div>
              )}
              
              {medalThickness && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">ความหนา:</span>
                  <span className="font-medium">{medalThicknessOptions.find(t => t.value === medalThickness)?.label || medalThickness}</span>
                </div>
              )}
              
              {lanyardSize && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">ขนาดสายคล้อง:</span>
                  <span className="font-medium">{getLanyardSizeLabel(lanyardSize)}</span>
                </div>
              )}
              
              {lanyardPatterns && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">จำนวนแบบสายคล้อง:</span>
                  <span className="font-medium">{lanyardPatterns}</span>
                </div>
              )}
              
              {quantity && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">จำนวน:</span>
                  <span className="font-medium">{parseInt(quantity).toLocaleString()}</span>
                </div>
              )}
              
              {/* แสดงเมื่อใช้โมเดลเดิม */}
              {selectedFromPreviousModel && originalOrderReference && (
                <div className="flex justify-between border-b border-border pb-2 bg-primary/5 p-2 rounded-md -mx-2">
                  <span className="text-muted-foreground">(Original blog):</span>
                  <span className="font-medium text-right">{originalOrderReference}</span>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={copyMedalSummary} className="h-9 w-9 border border-border rounded-md hover:bg-muted">
              <Copy className="h-4 w-4 text-primary" />
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowSummaryPopup(false)}>
                กลับไปแก้ไข
              </Button>
              <Button onClick={handleConfirmSave}>
                ยืนยันบันทึกประเมินราคา
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Popup for โล่สั่งผลิต */}
      <Dialog open={showAwardSummaryPopup} onOpenChange={setShowAwardSummaryPopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">สรุปข้อมูลการส่งตีราคา</DialogTitle>
            <DialogDescription>กรุณาตรวจสอบข้อมูลก่อนยืนยันการบันทึก</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">สินค้า:</span>
                <span className="font-medium">สินค้าสั่งผลิต &gt; โล่สั่งผลิต</span>
              </div>
              
              {material && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">วัสดุ:</span>
                  <span className="font-medium">{getMaterialLabel(material)}</span>
                </div>
              )}
              
              {quantity && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">จำนวน:</span>
                  <span className="font-medium">{parseInt(quantity).toLocaleString()}</span>
                </div>
              )}
              
              {awardDesignDetails && (
                <div className="flex flex-col border-b border-border pb-2">
                  <span className="text-muted-foreground mb-1">รายละเอียดงานเพิ่มเติม:</span>
                  <span className="font-medium text-sm">{awardDesignDetails}</span>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={copyAwardSummary} className="h-9 w-9 border border-border rounded-md hover:bg-muted">
              <Copy className="h-4 w-4 text-primary" />
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAwardSummaryPopup(false)}>
                กลับไปแก้ไข
              </Button>
              <Button onClick={handleConfirmSave}>
                ยืนยันบันทึกประเมินราคา
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Popup for สายคล้อง */}
      <Dialog open={showLanyardSummaryPopup} onOpenChange={setShowLanyardSummaryPopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">สรุปข้อมูลการส่งตีราคา</DialogTitle>
            <DialogDescription>กรุณาตรวจสอบข้อมูลก่อนยืนยันการบันทึก</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">สินค้า:</span>
                <span className="font-medium">สายคล้อง</span>
              </div>
              
              {customerLineId && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">LINE:</span>
                  <span className="font-medium">{customerLineId}</span>
                </div>
              )}
              
              {sewingOption && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">รูปแบบการเย็บ:</span>
                  <span className="font-medium">{sewingOption === 'sew' ? 'เย็บสาย' : 'ไม่เย็บสาย'}</span>
                </div>
              )}
              
              {strapSize && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">ขนาดสาย:</span>
                  <span className="font-medium">{getStrapSizeLabel(strapSize)}</span>
                </div>
              )}
              
              {strapPatternCount && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">จำนวนแบบ:</span>
                  <span className="font-medium">{strapPatternCount}</span>
                </div>
              )}
              
              {quantity && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">จำนวน:</span>
                  <span className="font-medium">{parseInt(quantity).toLocaleString()}</span>
                </div>
              )}
              
              {eventDate && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">วันที่ใช้งาน:</span>
                  <span className="font-medium">{new Date(eventDate).toLocaleDateString('th-TH')}</span>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={copyLanyardSummary} className="h-9 w-9 border border-border rounded-md hover:bg-muted">
              <Copy className="h-4 w-4 text-primary" />
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowLanyardSummaryPopup(false)}>
                กลับไปแก้ไข
              </Button>
              <Button onClick={handleConfirmSave}>
                ยืนยันบันทึกประเมินราคา
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product-specific details - แสดงเมื่อเลือก "มีแบบ" หรือเมื่อเลือกโมเดลเดิมแล้ว */}
      {((!usePreviousModel && hasDesign === "has-design") || isFieldLocked) && (selectedProductType === 'medal' || selectedProductType === 'award') && (
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>รายละเอียดสำหรับประเมินราคา</CardTitle>
            <CardDescription>กรอกข้อมูลสำหรับการประเมินราคา</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ข้อความแจ้งเตือนเมื่อใช้โมเดลเดิม */}
            {isFieldLocked && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      ข้อมูลส่วนนี้อ้างอิงจากโมเดลเดิม ไม่สามารถแก้ไขได้
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      หากต้องการเปลี่ยนรายละเอียด กรุณาไม่เลือกโมเดลเดิม
                    </p>
                    {originalOrderReference && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                        อ้างอิงจาก: {originalOrderReference}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ขนาด และ ความหนา - เป็น Dropdown สำหรับเหรียญ */}
            {selectedProductType === 'medal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={isFieldLocked ? "text-muted-foreground" : ""}>ขนาด</Label>
                  <Select 
                    value={medalSize} 
                    onValueChange={setMedalSize}
                    disabled={isFieldLocked}
                  >
                    <SelectTrigger className={isFieldLocked ? "bg-muted/50 cursor-not-allowed opacity-70" : ""}>
                      <SelectValue placeholder="เลือกขนาดเหรียญ" />
                    </SelectTrigger>
                    <SelectContent>
                      {medalSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={isFieldLocked ? "text-muted-foreground" : ""}>ความหนา</Label>
                  <Select 
                    value={medalThickness} 
                    onValueChange={setMedalThickness}
                    disabled={isFieldLocked}
                  >
                    <SelectTrigger className={isFieldLocked ? "bg-muted/50 cursor-not-allowed opacity-70" : ""}>
                      <SelectValue placeholder="เลือกความหนา" />
                    </SelectTrigger>
                    <SelectContent>
                      {medalThicknessOptions.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {selectedProductType === 'medal' && medalSize === "custom" && !isFieldLocked && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="space-y-2">
                      <Label htmlFor="width">กว้าง (ซม.)</Label>
                      <Input 
                        id="width" 
                        type="number" 
                        placeholder="0" 
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="length">ยาว (ซม.)</Label>
                      <Input 
                        id="length" 
                        type="number" 
                        placeholder="0" 
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">สูง (ซม.)</Label>
                      <Input 
                        id="height" 
                        type="number" 
                        placeholder="0" 
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thickness">หนา (มม.)</Label>
                      <Input 
                        id="thickness" 
                        type="number" 
                        placeholder="0" 
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                      />
                    </div>
                  </div>
                )}


            {/* Medal Details */}
            {selectedProductType === 'medal' && (
              <>
                {/* สี - ยังแก้ไขได้ */}
                <div className="space-y-4">
                  <Label>สี (เลือกได้หลายรายการ)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {colors.map((color) => (
                      <div key={color.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={color.value}
                          checked={selectedColors.includes(color.value)}
                          onCheckedChange={() => toggleColor(color.value)}
                        />
                        <Label htmlFor={color.value} className="text-sm cursor-pointer">
                          {color.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* รายละเอียดสินค้า - ถูกล็อกเมื่อใช้โมเดลเดิม */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className={isFieldLocked ? "text-muted-foreground" : ""}>รายละเอียดสินค้า</Label>
                    {isFieldLocked && (
                      <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">ล็อก</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className={isFieldLocked ? "text-muted-foreground" : ""}>
                      รายละเอียดด้านหน้า (เลือกได้หลายรายการ)
                    </Label>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 ${isFieldLocked ? "opacity-70" : ""}`}>
                      {detailOptions.map((detail) => (
                        <div key={`front-${detail}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`front-${detail}`}
                            checked={frontDetails.includes(detail)}
                            onCheckedChange={() => !isFieldLocked && toggleDetail(detail, 'front')}
                            disabled={isFieldLocked}
                            className={isFieldLocked ? "cursor-not-allowed" : ""}
                          />
                          <Label 
                            htmlFor={`front-${detail}`} 
                            className={`text-sm ${isFieldLocked ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer"}`}
                          >
                            {detail}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className={isFieldLocked ? "text-muted-foreground" : ""}>
                      รายละเอียดด้านหลัง (เลือกได้หลายรายการ)
                    </Label>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 ${isFieldLocked ? "opacity-70" : ""}`}>
                      {detailOptions.map((detail) => (
                        <div key={`back-${detail}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`back-${detail}`}
                            checked={backDetails.includes(detail)}
                            onCheckedChange={() => !isFieldLocked && toggleDetail(detail, 'back')}
                            disabled={isFieldLocked}
                            className={isFieldLocked ? "cursor-not-allowed" : ""}
                          />
                          <Label 
                            htmlFor={`back-${detail}`} 
                            className={`text-sm ${isFieldLocked ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer"}`}
                          >
                            {detail}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* สายคล้อง - ยังแก้ไขได้ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lanyard-size">ขนาดสายคล้อง</Label>
                    <Select value={lanyardSize} onValueChange={setLanyardSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกขนาดสายคล้อง" />
                      </SelectTrigger>
                      <SelectContent>
                        {lanyardSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lanyard-patterns">จำนวนแบบสายคล้อง</Label>
                    <Input 
                      id="lanyard-patterns" 
                      type="number" 
                      placeholder="กรอกจำนวนแบบ" 
                      value={lanyardPatterns}
                      onChange={(e) => setLanyardPatterns(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Award Details - โล่สั่งผลิต */}
            {selectedProductType === 'award' && (
              <div className="space-y-6">
                {/* A) รายละเอียดการตีราคา */}
                <div className="space-y-2">
                  <Label htmlFor="award-design-details">
                    รายละเอียดการตีราคา <span className="text-destructive">*</span>
                  </Label>
                  <Textarea 
                    id="award-design-details" 
                    placeholder="พิมพ์รายละเอียดงานโล่สั่งผลิต เช่น ขนาด/ทรง, โทนสี, โลโก้, ข้อความ, วัสดุ, จุดที่ต้องการเน้น"
                    value={awardDesignDetails}
                    onChange={(e) => setAwardDesignDetails(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* B) ป้ายจารึก */}
                <div className="space-y-3">
                  <Label>
                    ป้ายจารึก <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup 
                    value={plaqueOption} 
                    onValueChange={handlePlaqueOptionChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="has-plaque" id="has-plaque" />
                      <Label htmlFor="has-plaque" className="cursor-pointer">รับป้าย</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no-plaque" id="no-plaque" />
                      <Label htmlFor="no-plaque" className="cursor-pointer">ไม่รับป้าย</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* C) รายละเอียดป้ายจารึก - แสดงเฉพาะเมื่อเลือก "รับป้าย" */}
                {plaqueOption === "has-plaque" && (
                  <div className="space-y-2">
                    <Label htmlFor="plaque-text">
                      รายละเอียดป้ายจารึก <span className="text-destructive">*</span>
                    </Label>
                    <Textarea 
                      id="plaque-text" 
                      placeholder="พิมพ์ข้อความบนป้าย เช่น ชื่อรายการ/ปี/อันดับ/ชื่อผู้รับ/ข้อความเพิ่มเติม"
                      value={plaqueText}
                      onChange={(e) => setPlaqueText(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}


      {/* Dynamic Form for ของใช้, ลิสแบรนด์, ของพรีเมียม - แสดงเมื่อเลือก "มีแบบ" และไม่ได้ใช้โมเดลเดิม (ยกเว้น lanyard) */}
      {!usePreviousModel && hasDesign === "has-design" && 
       (["ของใช้", "ของพรีเมียม"].includes(productCategory) || 
        (productCategory === "หมวดสายคล้อง" && selectedProductType !== "lanyard")) && 
       selectedProductType && (
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>รายละเอียดสำหรับประเมินราคา</CardTitle>
            <CardDescription>กรอกข้อมูลสำหรับการประเมินราคา</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="generic-design-details">
                รายละเอียดการประเมินราคา <span className="text-destructive">*</span>
              </Label>
              <Textarea 
                id="generic-design-details" 
                placeholder="พิมพ์รายละเอียด เช่น ขนาด/สี/โลโก้/ข้อความ/ตำแหน่งงาน/วัสดุ/ตัวอย่างที่ต้องการ"
                value={genericDesignDetails}
                onChange={(e) => setGenericDesignDetails(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Form for "ไม่มีแบบ" - แสดงเมื่อเลือก "ไม่มีแบบ" และไม่ได้ใช้โมเดลเดิม */}
      {!usePreviousModel && hasDesign === "no-design" && selectedProductType && (
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>รายละเอียดสั่งงาน (ลูกค้ายังไม่มีแบบ)</CardTitle>
            <CardDescription>
              หมวด: {productCategory} | สินค้า: {productsByCategory[productCategory]?.find(p => p.value === selectedProductType)?.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* รายละเอียดการออกแบบ - สำหรับทุกสินค้า */}
            <div className="space-y-2">
              <Label htmlFor="design-description">รายละเอียดการออกแบบ</Label>
              <Textarea 
                id="design-description" 
                placeholder="กรอกรายละเอียดการออกแบบที่ต้องการ เช่น แนวคิด สี รูปแบบ ฯลฯ" 
                value={designDescription}
                onChange={(e) => setDesignDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* เงื่อนไขเฉพาะ: โล่สั่งผลิต */}
            {selectedProductType === 'award' && (
              <>
                <div className="space-y-2">
                  <Label>ป้ายจารึก</Label>
                  <Select value={inscriptionPlate} onValueChange={setInscriptionPlate}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกตัวเลือกป้ายจารึก" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receive">รับป้าย</SelectItem>
                      <SelectItem value="no-receive">ไม่รับป้าย</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inscriptionPlate === "receive" && (
                  <div className="space-y-2">
                    <Label htmlFor="inscription-details-no-design">รายละเอียดป้ายจารึก</Label>
                    <Textarea 
                      id="inscription-details-no-design" 
                      placeholder="กรอกรายละเอียดป้ายจารึก" 
                      value={inscriptionDetails}
                      onChange={(e) => setInscriptionDetails(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* File Attachment - แสดงเมื่อเลือกสินค้าและเลือก มีแบบ/ไม่มีแบบ แล้ว หรือเลือกโมเดลเดิมแล้ว */}
      {((!usePreviousModel && selectedProductType && hasDesign) || isFieldLocked) && (
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>แนบไฟล์</CardTitle>
            <CardDescription>อัปโหลดไฟล์เอกสาร รูปภาพ หรือไฟล์อื่นๆ ที่เกี่ยวข้อง (รองรับหลายไฟล์)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">อัปโหลดไฟล์</p>
              <p className="text-xs text-muted-foreground mt-1">รองรับไฟล์ PDF, รูปภาพ, AI, และอื่นๆ</p>
              <Input 
                type="file" 
                className="hidden" 
                id="file-attachment" 
                accept="image/*,.pdf,.ai,.psd,.eps" 
                multiple 
                onChange={handleFileChange}
              />
              <Button variant="outline" className="mt-3" onClick={() => document.getElementById('file-attachment')?.click()}>
                เลือกไฟล์
              </Button>
            </div>

            {/* แสดงรายการไฟล์ที่แนบ */}
            {(attachedFiles.length > 0 || existingFiles.length > 0) && (
              <div className="space-y-2">
                <Label>ไฟล์ที่แนบ ({attachedFiles.length + existingFiles.length} ไฟล์)</Label>
                <div className="space-y-2">
                  {/* Existing Files (From Server) */}
                  {existingFiles.map((filePath, index) => {
                     // Extract filename from path (e.g. uploads/price_estimation/123_test.jpg -> 123_test.jpg)
                     const fileName = filePath.split('/').pop() || filePath;
                     // Clean up timestamp prefix for display if desired (optional, keeping it simple for now)
                     const displayName = fileName.replace(/^\d+_/, '');

                     return (
                      <div key={`existing-${index}`} className="flex items-center justify-between p-2 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <a href={`/${filePath}`} target="_blank" rel="noreferrer" className="text-sm truncate max-w-xs text-blue-600 hover:underline">
                            {displayName}
                          </a>
                          <Badge variant="secondary" className="text-[10px] h-5">เดิม</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExistingFile(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                     );
                  })}

                  {/* New Files (Pending Upload) */}
                  {attachedFiles.map((file, index) => (
                    <div key={`new-${index}`} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate max-w-xs">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <Badge variant="outline" className="text-[10px] h-5 bg-yellow-50 text-yellow-600 border-yellow-200">รออัปโหลด</Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons - แสดงเมื่อไม่ได้ใช้โมเดลเดิม หรือเมื่อเลือกออเดอร์เดิมแล้ว */}
      {(!usePreviousModel || isFieldLocked) && (
        <div className="flex gap-4 max-w-4xl">
          <Button size="lg" onClick={handleSave}>
            บันทึกประเมินราคา
          </Button>
          {isFieldLocked ? (
            <Button variant="outline" size="lg" onClick={handleCancelPreviousModel}>
              ยกเลิกโมเดลเดิม
            </Button>
          ) : (
            <Button variant="outline" size="lg" onClick={() => navigate("/sales/price-estimation")}>
              ยกเลิก
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
