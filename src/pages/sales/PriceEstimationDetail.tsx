import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Edit, Printer, ImageIcon, FileText, X, History, User, Clock, CheckCircle2, CircleDot, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import sampleArtwork from "@/assets/sample-artwork.png";
import { salesApi } from "@/services/salesApi";

// Interface for design file with upload history
interface DesignFileUpload {
  fileName: string;
  uploadDate: string;
  uploadTime: string;
  uploadedBy: string;
}

export default function PriceEstimationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock artwork images - replace with actual data
  const artworkImages = [sampleArtwork];
  const [selectedArtwork, setSelectedArtwork] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isUploadHistoryOpen, setIsUploadHistoryOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Data state
  const [estimation, setEstimation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await salesApi.getPriceEstimationDetail(id);
        setEstimation(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถดึงข้อมูลรายละเอียดการประเมินราคาได้");
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDelete = () => {
    // Perform delete action
    toast.success("ลบรายการประเมินราคาเรียบร้อยแล้ว");
    setIsDeleteDialogOpen(false);
    navigate("/sales/price-estimation");
  };
  
  // Mock design files upload history - replace with actual data
  const designFileHistory: DesignFileUpload[] = [
    { fileName: "artwork_final_v3.ai", uploadDate: "2024-01-18", uploadTime: "14:32:15", uploadedBy: "สมชาย กราฟิก" },
    { fileName: "artwork_v2.ai", uploadDate: "2024-01-16", uploadTime: "10:15:42", uploadedBy: "สมหญิง ดีไซน์" },
    { fileName: "artwork_draft.ai", uploadDate: "2024-01-14", uploadTime: "09:20:30", uploadedBy: "สมชาย กราฟิก" },
  ];
  
  // Get the latest uploaded file (first item in history)
  const latestDesignFile = designFileHistory.length > 0 ? designFileHistory[0] : null;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (error || !estimation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/sales/price-estimation")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{error || "ไม่พบข้อมูลการประเมินราคา"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "อนุมัติแล้ว":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "อยู่ระหว่างการประเมินราคา":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "รอจัดซื้อส่งประเมิน":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "ยกเลิก":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Check if product is medal type
  const isMedal = estimation.productType === "เหรียญสั่งผลิต";
  const isAward = estimation.productType === "โล่สั่งผลิต";
  const isLanyard = estimation.productCategory === "หมวดสายคล้อง";

  // Calculate Unit Price placeholder (e.g. Total Budget / Quantity) just for display if needed
  // Note: Real calculation logic resides in backend or specific business logic
  const unitPrice = estimation.quantity > 0 && estimation.budget > 0
    ? Math.round(estimation.budget / estimation.quantity)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/sales/price-estimation")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold">รายละเอียดการประเมินราคา</h1>
            <p className="text-muted-foreground">
              รหัส: {estimation.customerLineId || '-'} | วันที่: {estimation.estimateDate ? new Date(estimation.estimateDate).toLocaleDateString('th-TH') : '-'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            พิมพ์
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/sales/price-estimation/edit/${id}`)}
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            แก้ไข
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            ลบ
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบรายการ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบรายการประเมินราคานี้? ข้อมูลทั้งหมดจะถูกลบอย่างถาวรและไม่สามารถกู้คืนได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700">
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              ยืนยัน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Badge */}
      <div>
        <Badge className={getStatusColor(estimation.status)} variant="secondary">
          {estimation.status}
        </Badge>
      </div>

      {/* ข้อมูลทั่วไปลูกค้า */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลทั่วไปลูกค้า</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ชื่อลูกค้า</p>
              <p className="text-base">{estimation.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">เบอร์โทร (key หลัก)</p>
              <p className="text-base">{estimation.customerPhone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ชื่อไลน์ (key รอง)</p>
              <p className="text-base">{estimation.customerLineId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">อีเมล</p>
              <p className="text-base">{estimation.customerEmail}</p>
            </div>
            {estimation.customerTags && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">ประเภทลูกค้า / แท็ก</p>
                <p className="text-base">{estimation.customerTags}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ข้อมูล Artwork */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูล Artwork</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Artwork Preview Section */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">รูป Artwork</p>
            {artworkImages.length > 0 ? (
              <>
                {/* Main Preview - Clickable */}
                <button
                  onClick={() => setIsFullscreenOpen(true)}
                  className="w-full bg-muted rounded-lg p-4 flex items-center justify-center min-h-[300px] max-h-[500px] cursor-zoom-in hover:bg-muted/80 transition-colors"
                >
                  <img
                    src={artworkImages[selectedArtwork]}
                    alt={`Artwork preview ${selectedArtwork + 1}`}
                    className="max-w-full max-h-[460px] object-contain"
                  />
                </button>
                <p className="text-xs text-muted-foreground text-center mt-2">คลิกที่รูปเพื่อขยายเต็มจอ</p>
                
                {/* Thumbnails */}
                {artworkImages.length > 1 && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {artworkImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedArtwork(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all bg-muted p-1 ${
                          selectedArtwork === index
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Placeholder when no images */
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] bg-muted/30">
                <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">อัปโหลดรูป Artwork</p>
              </div>
            )}
          </div>

          {/* Design Files Section */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">ไฟล์งานออกแบบ</p>
            {latestDesignFile ? (
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{latestDesignFile.fileName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{new Date(latestDesignFile.uploadDate).toLocaleDateString('th-TH')} {latestDesignFile.uploadTime}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {latestDesignFile.uploadedBy}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsUploadHistoryOpen(true)}
                    className="gap-1.5"
                  >
                    <History className="h-4 w-4" />
                    ประวัติการอัพโหลด
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30">
                <FileText className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground text-sm">ยังไม่มีไฟล์งานออกแบบ</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ข้อมูลการจัดงานเบื้องต้น */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลการจัดงานเบื้องต้น</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">วันที่ประเมินราคา</p>
              <p className="text-base">{new Date(estimation.estimateDate).toLocaleDateString('th-TH')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">เซลล์ผู้รับผิดชอบ</p>
              <p className="text-base">{estimation.salesOwner}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ชื่องาน</p>
              <p className="text-base">{estimation.jobName}</p>
            </div>
            {estimation.eventDate && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">วันที่ใช้งาน</p>
                <p className="text-base">{new Date(estimation.eventDate).toLocaleDateString('th-TH')}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">ประเภทสินค้า / สินค้า</p>
              <p className="text-base">{estimation.productCategory} &gt; {estimation.productType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ลูกค้ามีแบบแล้วหรือไม่</p>
              <p className="text-base">{estimation.hasDesign}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">วัสดุ</p>
              <p className="text-base">{estimation.material}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">จำนวน</p>
              <p className="text-base">{estimation.quantity.toLocaleString()} ชิ้น</p>
            </div>
            {estimation.budget && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">งบประมาณของลูกค้า</p>
                <p className="text-base">{estimation.budget.toLocaleString()} บาท</p>
              </div>
            )}
          </div>

          {/* ไฟล์แนบจากลูกค้า */}
          {estimation.attachedFiles && estimation.attachedFiles.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-3">ไฟล์แนบจากลูกค้า</p>
              <div className="flex flex-wrap gap-3">
                {estimation.attachedFiles.map((file: string, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 bg-muted/50 hover:bg-muted rounded-lg px-4 py-2.5 border cursor-pointer transition-colors group"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* รายละเอียดสำหรับประเมินราคา */}
      <Card>
        <CardHeader>
          <CardTitle>รายละเอียดสำหรับประเมินราคา</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isMedal && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {estimation.medalSize && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ขนาด</p>
                    <p className="text-base">{estimation.medalSize}</p>
                  </div>
                )}
                {estimation.medalThickness && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ความหนา</p>
                    <p className="text-base">{estimation.medalThickness}</p>
                  </div>
                )}
              </div>

              {estimation.selectedColors && estimation.selectedColors.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">สี (เลือกได้หลายรายการ)</p>
                  <div className="flex flex-wrap gap-2">
                    {estimation.selectedColors.map((color: string, index: number) => (
                      <Badge key={index} variant="outline">{color}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {estimation.frontDetails && estimation.frontDetails.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">รายละเอียดด้านหน้า (เลือกได้หลายรายการ)</p>
                  <div className="flex flex-wrap gap-2">
                    {estimation.frontDetails.map((detail: string, index: number) => (
                      <Badge key={index} variant="secondary">{detail}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {estimation.backDetails && estimation.backDetails.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">รายละเอียดด้านหลัง (เลือกได้หลายรายการ)</p>
                  <div className="flex flex-wrap gap-2">
                    {estimation.backDetails.map((detail: string, index: number) => (
                      <Badge key={index} variant="secondary">{detail}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {estimation.lanyardSize && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ขนาดสายคล้องคอ</p>
                    <p className="text-base">{estimation.lanyardSize}</p>
                  </div>
                  {estimation.lanyardPatterns && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">จำนวนลาย</p>
                      <p className="text-base">{estimation.lanyardPatterns} ลาย</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {isAward && (
            <>
              {estimation.awardDesignDetails && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">รายละเอียดงานเพิ่มเติม</p>
                  <p className="text-base">{estimation.awardDesignDetails}</p>
                </div>
              )}
              {estimation.plaqueOption && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ป้ายสลัก</p>
                    <p className="text-base">{estimation.plaqueOption}</p>
                  </div>
                  {estimation.plaqueText && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ข้อความป้ายสลัก</p>
                      <p className="text-base">{estimation.plaqueText}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {isLanyard && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {estimation.lanyardSize && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ขนาดสายคล้อง</p>
                    <p className="text-base">{estimation.lanyardSize}</p>
                  </div>
                )}
                {estimation.lanyardPatterns && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">จำนวนลาย</p>
                    <p className="text-base">{estimation.lanyardPatterns} ลาย</p>
                  </div>
                )}
              </div>
              {estimation.genericDesignDetails && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">รายละเอียดงาน</p>
                  <p className="text-base">{estimation.genericDesignDetails}</p>
                </div>
              )}
            </>
          )}

          {estimation.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">หมายเหตุ</p>
              <p className="text-base">{estimation.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* สถานะการประเมินราคา - Read-only */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDot className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">สถานะการประเมินราคา</CardTitle>
            </div>
            {/* Status Badge - Based on estimation status */}
            {estimation.status === "อนุมัติแล้ว" ? (
              <Badge 
                variant="outline" 
                className="bg-green-500/10 text-green-600 border-green-500/30 px-3 py-1 gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                อนุมัติราคา
              </Badge>
            ) : estimation.status === "อยู่ระหว่างการประเมินราคา" ? (
              <Badge 
                variant="outline" 
                className="bg-blue-500/10 text-blue-600 border-blue-500/30 px-3 py-1 gap-1.5"
              >
                <Clock className="h-3.5 w-3.5" />
                อยู่ระหว่างการประเมินราคา
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className="bg-orange-500/10 text-orange-600 border-orange-500/30 px-3 py-1 gap-1.5"
              >
                <Clock className="h-3.5 w-3.5" />
                รอจัดซื้อส่งประเมิน
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* แสดงราคาเมื่อสถานะ = อนุมัติราคา */}
          {estimation.status === "อนุมัติแล้ว" ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border border-green-200 dark:border-green-800">
              {/* ราคาต่อหน่วย - เด่นที่สุด */}
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-1">ราคาต่อหน่วย</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {unitPrice.toLocaleString()} <span className="text-lg font-medium">บาท / {estimation.productType === "เหรียญสั่งผลิต" ? "เหรียญ" : "ชิ้น"}</span>
                </p>
              </div>
              
              <Separator className="my-4" />
              
              {/* บริบทของราคา */}
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-muted-foreground">จำนวน</span>
                <span className="font-medium">{estimation.quantity.toLocaleString()} {estimation.productType === "เหรียญสั่งผลิต" ? "เหรียญ" : "ชิ้น"}</span>
              </div>
              
              {/* ราคารวม - รองจากราคาต่อหน่วย */}
              <div className="flex justify-between items-center bg-white/50 dark:bg-black/20 rounded-lg p-3">
                <span className="font-medium">ราคารวม</span>
                <span className="text-2xl font-bold text-primary">
                  {estimation.budget.toLocaleString()} <span className="text-base font-medium">บาท</span>
                </span>
              </div>
            </div>
          ) : (
            /* ยังไม่ได้ราคา */
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Clock className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-muted-foreground font-medium">ยังไม่มีผลการประเมินราคา</p>
                <p className="text-sm text-muted-foreground/80">อยู่ระหว่างรอราคาจากฝ่ายที่เกี่ยวข้อง</p>
              </div>
            </div>
          )}

          {/* ข้อมูลกำกับ */}
          <p className="text-xs text-muted-foreground text-right">
            อัปเดตสถานะล่าสุด: {new Date(estimation.estimateDate).toLocaleDateString('th-TH')} โดย {estimation.salesOwner}
          </p>
        </CardContent>
      </Card>

      {/* Fullscreen Image Dialog */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95">
          <button
            onClick={() => setIsFullscreenOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={artworkImages[selectedArtwork]}
              alt={`Artwork fullscreen ${selectedArtwork + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload History Dialog */}
      <Dialog open={isUploadHistoryOpen} onOpenChange={setIsUploadHistoryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              ประวัติการอัพโหลดไฟล์งานออกแบบ
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ชื่อไฟล์</TableHead>
                  <TableHead className="font-semibold">วันที่อัพโหลด</TableHead>
                  <TableHead className="font-semibold">เวลา</TableHead>
                  <TableHead className="font-semibold">ผู้อัพโหลด</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {designFileHistory.map((file, index) => (
                  <TableRow key={index} className={index === 0 ? "bg-primary/5" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>{file.fileName}</span>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs ml-1">ล่าสุด</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(file.uploadDate).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell>{file.uploadTime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {file.uploadedBy}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              แสดงประวัติการอัพโหลดทั้งหมด {designFileHistory.length} รายการ
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
