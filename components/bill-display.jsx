"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  Building2,
  Zap,
  Droplets,
  DollarSign,
  Home,
  Users,
  Share2,
  Printer,
} from "lucide-react";
import { useRef, useState } from "react";
import { createPDFContent } from "./ui/generatePDF";

export default function BillDisplay({ formData, calculatedBill, onBack }) {
  const billRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  const downloadPDF = async () => {
    try {
      setIsDownloading(true);
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      // Create PDF-optimized content
      const pdfContent = createPDFContent();

      // Create a temporary container for PDF content
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = pdfContent;
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "210mm"; // A4 width
      tempContainer.style.backgroundColor = "white";
      document.body.appendChild(tempContainer);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      let currentPage = 0;

      // Get all PDF pages
      const pdfPages = tempContainer.querySelectorAll(".pdf-page");

      for (let i = 0; i < pdfPages.length; i++) {
        const pageElement = pdfPages[i];

        if (currentPage > 0) {
          pdf.addPage();
        }

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: pageElement.scrollWidth,
          height: pageElement.scrollHeight,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png", 1.0);
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        // Center the content if it's smaller than page height
        const yPosition =
          imgHeight < pageHeight ? (pageHeight - imgHeight) / 2 : 0;

        pdf.addImage(
          imgData,
          "PNG",
          0,
          yPosition,
          imgWidth,
          Math.min(imgHeight, pageHeight)
        );
        currentPage++;
      }

      // Clean up
      document.body.removeChild(tempContainer);

      pdf.save(`ajmal-house-bill-${formData.month}-${formData.year}.pdf`);
      setIsDownloading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
      setIsDownloading(false);
    }
  };

  const createPDFContent = () => {
    const totalRooms = getTotalRooms();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    return `
  <div style="font-family: Arial, sans-serif; color: #000000; background: white;">
  <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 25mm; background: #ffffff; font-family: 'Segoe UI', sans-serif; color: #1f2937; page-break-after: always;">
  
  <!-- Branded Header -->
  <div style="text-align: center; margin-bottom: 40px; background: #f8fafc; padding: 30px; border-radius: 15px; border: 2px solid #e2e8f0;">
        <h1 style="font-size: 42px; font-weight: bold; color: #1f2937; margin: 0 0 10px 0;">🏠 AJMAL HOUSE</h1>
        <div style="font-size: 16px; color: #6b7280; font-weight: 600; margin-bottom: 15px;">UTILITY BILL MANAGEMENT</div>
        <h2 style="font-size: 28px; font-weight: bold; color: #3b82f6; margin: 0 0 15px 0;">MONTHLY UTILITY BILL</h2>
        <div style="font-size: 20px; color: #6b7280; font-weight: 600;">${
          formData.month
        } ${formData.year}</div>
        <div style="width: 100px; height: 4px; background: #3b82f6; margin: 15px auto;"></div>
        <p style="font-size: 15px; color: #64748b;">Reliable & Transparent Utility Billing</p>
      </div>

  <!-- Summary Section -->
 <!-- Grand Total Section -->
      <div style="background: #1f2937; color: white; padding: 40px; border-radius: 15px; text-align: center; margin-bottom: 40px;">
        <h3 style="font-size: 32px; font-weight: bold; color: white; margin: 0 0 25px 0;">💰 GRAND TOTAL</h3>
        <div style="font-size: 56px; font-weight: bold; margin-bottom: 20px; color: #fbbf24;">
          PKR ${formatCurrency(calculatedBill.totalCalculated)}
        </div>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
          <div style="color: white; font-size: 16px; font-weight: 600;">
            Total amount for ${totalRooms} rooms across ${
      formData.numberOfFloors
    } floors
          </div>
        </div>
         <!-- System Attribution Footer -->
    </div>
    <div style="text-align: center; background: #1f2937; color: white; padding: 25px; border-radius: 12px;">
    <p style="font-size: 13px; margin-bottom: 6px;">📅 Generated on: <strong>${new Date().toLocaleDateString()}</strong></p>
    <p style="font-size: 14px; font-weight: bold; color: #fbbf24; margin: 10px 0 4px;">Designed & Developed by Zaeem Khan</p>
    <p style="font-size: 13px; color: #e2e8f0; margin: 2px 0;">Full Stack Developer & Software Engineer</p>
    <p style="font-size: 13px; color: #e2e8f0; margin: 2px 0;">📧 zaeem2141@gmail.com &nbsp;|&nbsp; 📱 +92 307 1632603</p>
    <p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Providing Smart Digital Tools for Smart Living</p>
  </div>

</div>

    <!-- Grand Total Page -->
    <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 25mm; background: white; page-break-after: always;">
    
<div style="text-align: center; margin-bottom: 40px; background: #fff7ed; padding: 25px; border-radius: 15px; border: 2px solid #fed7aa;">
        <h2 style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">💳 Account Details and Guidlines</h2>
        <div style="font-size: 16px; color: #6b7280; font-weight: 600;">${
          formData.month
        } ${formData.year}</div>
      </div>
   <div style="background: #e0f2fe; border-left: 6px solid #0ea5e9; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
    <h2 style="margin: 0 0 10px; font-size: 22px;">📋 About This Bill</h2>
    <p style="margin: 0; font-size: 14px;">
      This document summarizes your monthly utility and/or rent expenses. All amounts are calculated using shared consumption metrics and room-wise allocations.
      Please review your charges carefully and submit payment via the bank details below.
    </p>
  </div>

  <!-- Payment Instructions -->
  <div style="background: #fef9c3; padding: 25px; border-left: 6px solid #facc15; border-radius: 10px; margin-bottom: 30px;">
    <h3 style="margin: 0 0 10px; font-size: 20px;">💳 Payment Instructions</h3>
    <ul style="font-size: 14px; margin: 0; padding-left: 20px; color: #92400e;">
      <li>Pay by the <strong>5th of every month</strong> to avoid penalties.</li>
      <li>Use online transfer or direct deposit only.</li>
      <li><strong>Send a screenshot of payment</strong> via WhatsApp to confirm.</li>
      <li>Late or incomplete payments will incur a fine.</li>
    </ul>
  </div>

  <!-- Bank Account Details -->
  <div style="background: #ecfdf5; padding: 25px; border-left: 6px solid #10b981; border-radius: 10px; margin-bottom: 30px;">
    <h3 style="margin: 0 0 10px; font-size: 20px;">🏦 Bank Account</h3>
    <p style="margin: 5px 0; font-size: 14px;"><strong>Account Title:</strong> Ajmal</p>
    <p style="margin: 5px 0; font-size: 14px;"><strong>Account Number:</strong> 0287 0105 9394 99</p>
    <p style="margin: 5px 0; font-size: 14px;"><strong>Bank:</strong> Meezan Bank</p>
    <p style="margin: 5px 0; font-size: 14px;"><strong>IBAN:</strong> PK89MEZN0002870105939499</p>
  </div>

  <!-- Help & Support -->
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 10px; text-align: center;">
    <h3 style="font-size: 18px; font-weight: bold; color: #0f172a; margin-bottom: 10px;"> Need Help?</h3>
    <p style="font-size: 14px; margin: 0;">If you find any issue in your bill or have a question, please reach out:</p>
    <p style="font-size: 14px; margin: 8px 0;"><strong>WhatsApp Only:</strong> <span style="color: #16a34a;">+92 307 4477301</span></p>
    <p style="font-size: 14px; margin: 0;">You can share payment proof or complaints through WhatsApp for quick resolution.</p>
    <p style="font-size: 12px; color: #94a3b8; margin-top: 10px;">This bill is system-generated. No manual changes are accepted.</p>
  </div>
      </div>


    <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 25mm; background: white; page-break-after: always;">

      <!-- Cost Breakdown -->
      <div style="margin-bottom: 40px;">
              <div style="text-align: center; margin-bottom: 40px; background: #fff7ed; padding: 25px; border-radius: 15px; border: 2px solid #fed7aa;">
        <h2 style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">💳 Cost Breakdown</h2>
        <div style="font-size: 16px; color: #6b7280; font-weight: 600;">${
          formData.month
        } ${formData.year}</div>
      </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: #eff6ff; padding: 25px; border-radius: 15px; border: 2px solid #bfdbfe; text-align: center;">
            <div style="font-size: 18px; color: #1e40af; font-weight: bold; margin-bottom: 10px;">⚡ Electricity Bill</div>
            <div style="font-size: 28px; font-weight: bold; color: #1e40af;">PKR ${formatCurrency(
              formData.totalElectricityBill
            )}</div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">${
              formData.totalUnits
            } units consumed</div>
          </div>
          <div style="background: #f0fdf4; padding: 25px; border-radius: 15px; border: 2px solid #bbf7d0; text-align: center;">
            <div style="font-size: 18px; color: #059669; font-weight: bold; margin-bottom: 10px;">💧 WASA Bill</div>
            <div style="font-size: 28px; font-weight: bold; color: #059669;">PKR ${formatCurrency(
              formData.totalWasaBill
            )}</div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">Water & sanitation charges</div>
          </div>
          <div style="background: #fff7ed; padding: 25px; border-radius: 15px; border: 2px solid #fed7aa; text-align: center;">
            <div style="font-size: 18px; color: #d97706; font-weight: bold; margin-bottom: 10px;">📊 Sub Meter Units</div>
            <div style="font-size: 28px; font-weight: bold; color: #d97706;">PKR ${formatCurrency(
              calculatedBill?.totalSubMeterUnits
            )}</div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">Sub meter units</div>
          </div>
          <div style="background: #faf5ff; padding: 25px; border-radius: 15px; border: 2px solid #ddd6fe; text-align: center;">
            <div style="font-size: 18px; color: #7c3aed; font-weight: bold; margin-bottom: 10px;">👥 Common Units</div>
            <div style="font-size: 28px; font-weight: bold; color: #7c3aed;">PKR ${formatCurrency(
              calculatedBill.totalCommonUnits
            )}</div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">Shared facility units</div>
          </div>
           <div style="background: #fdd7ed; padding: 25px; border-radius: 15px; border: 2px solid #fed7aa; text-align: center;">
            <div style="font-size: 18px; color: #d97706; font-weight: bold; margin-bottom: 10px;">📊 Sub Meter Cost</div>
            <div style="font-size: 28px; font-weight: bold; color: #d97706;">PKR ${formatCurrency(
              calculatedBill?.totalSubMeterCost
            )}</div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">Sub meter maintenance</div>
          </div>
          <div style="background: #fae5ff; padding: 25px; border-radius: 15px; border: 2px solid #ddd6fe; text-align: center;">
            <div style="font-size: 18px; color: #7c3aed; font-weight: bold; margin-bottom: 10px;">👥 Common Cost</div>
            <div style="font-size: 28px; font-weight: bold; color: #7c3aed;">PKR ${formatCurrency(
              calculatedBill?.totalCommonCost
            )}</div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">Shared facility costs</div>
          </div>
        </div>
      </div>

      <!-- Building Info -->
      <div style="background: #f0fdf4; padding: 30px; border-radius: 15px; border: 2px solid #bbf7d0;">
        <h4 style="font-size: 24px; font-weight: bold; color: #166534; margin-bottom: 25px; text-align: center;">🏢 Building Information</h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
          <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #bbf7d0;">
            <div style="font-size: 16px; color: #6b7280; margin-bottom: 5px; font-weight: 600;">Total Units</div>
            <div style="font-size: 24px; font-weight: bold; color: #166534;">${
              formData.totalUnits
            }</div>
          </div>
          <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #bbf7d0;">
            <div style="font-size: 16px; color: #6b7280; margin-bottom: 5px; font-weight: 600;">Total Rooms</div>
            <div style="font-size: 24px; font-weight: bold; color: #166534;">${totalRooms}</div>
          </div>
          <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #bbf7d0;">
            <div style="font-size: 16px; color: #6b7280; margin-bottom: 5px; font-weight: 600;">Building Floors</div>
            <div style="font-size: 24px; font-weight: bold; color: #166534;">${
              formData.numberOfFloors
            }</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rate Information Page -->
    <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 25mm; background: white; page-break-after: always;">
      <div style="text-align: center; margin-bottom: 40px; background: #fff7ed; padding: 25px; border-radius: 15px; border: 2px solid #fed7aa;">
        <h2 style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">📊 RATE INFORMATION</h2>
        <div style="font-size: 16px; color: #6b7280; font-weight: 600;">${
          formData.month
        } ${formData.year}</div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 40px;">
        <div style="background: #eff6ff; padding: 30px; border-radius: 15px; border: 2px solid #bfdbfe; text-align: center;">
          <div style="font-size: 18px; color: #1e40af; font-weight: bold; margin-bottom: 15px;">⚡ Electricity Per Unit</div>
          <div style="font-size: 32px; font-weight: bold; color: #1e40af; margin-bottom: 8px;">PKR ${calculatedBill.electricityPerUnit.toFixed(
            2
          )}</div>
          <div style="font-size: 12px; color: #6b7280;">Rate per unit consumed</div>
        </div>
        <div style="background: #f0fdf4; padding: 30px; border-radius: 15px; border: 2px solid #bbf7d0; text-align: center;">
          <div style="font-size: 18px; color: #059669; font-weight: bold; margin-bottom: 15px;">💧 WASA Per Room</div>
          <div style="font-size: 32px; font-weight: bold; color: #059669; margin-bottom: 8px;">PKR ${calculatedBill.wasaPerRoom.toFixed(
            2
          )}</div>
          <div style="font-size: 12px; color: #6b7280;">Equal distribution per room</div>
        </div>
        <div style="background: #fff7ed; padding: 30px; border-radius: 15px; border: 2px solid #fed7aa; text-align: center;">
          <div style="font-size: 18px; color: #d97706; font-weight: bold; margin-bottom: 15px;">📊 Sub Meter Per Floor</div>
          <div style="font-size: 32px; font-weight: bold; color: #d97706; margin-bottom: 8px;">PKR ${calculatedBill.subMeterCostPerFloor.toFixed(
            2
          )}</div>
          <div style="font-size: 12px; color: #6b7280;">Distributed per floor</div>
        </div>
        <div style="background: #faf5ff; padding: 30px; border-radius: 15px; border: 2px solid #ddd6fe; text-align: center;">
          <div style="font-size: 18px; color: #7c3aed; font-weight: bold; margin-bottom: 15px;">👥 Common Per Room</div>
          <div style="font-size: 32px; font-weight: bold; color: #7c3aed; margin-bottom: 8px;">PKR ${calculatedBill.commonCostPerRoom.toFixed(
            2
          )}</div>
          <div style="font-size: 12px; color: #6b7280;">Shared among all rooms</div>
        </div>
      </div>

      <div style="text-align: center; padding-top: 30px; border-top: 2px solid #e5e7eb;">
        <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #e5e7eb;">
          <div style="font-size: 14px; color: #6b7280; font-weight: 600;">
            Rate Information • Page 2 of ${formData.floors.length + 4} • ${
      formData.month
    } ${formData.year}
          </div>
        </div>
      </div>
    </div>

    ${formData.floors
      .map(
        (floor, floorIndex) => `
      <!-- Floor ${floorIndex + 1} Page -->
      <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 25mm; background: white; page-break-after: always;">
        <div style="margin-bottom: 40px; background: ${
          floorIndex === 0 ? "#eff6ff" : "#f0fdf4"
        }; padding: 25px; border-radius: 15px; text-align: center; border: 2px solid ${
          floorIndex === 0 ? "#bfdbfe" : "#bbf7d0"
        };">
          <h2 style="font-size: 32px; font-weight: bold; color: ${
            floorIndex === 0 ? "#1e40af" : "#166534"
          }; margin: 0 0 10px 0;">🏠 ${floor.name}</h2>
          <div style="font-size: 16px; color: #6b7280;">${
            floor.rooms.length
          } Room${floor.rooms.length !== 1 ? "s" : ""} • ${formData.month} ${
          formData.year
        }</div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-bottom: 40px;">
          ${floor.rooms
            .map((room, roomIndex) => {
              const roomBill = calculatedBill.roomBills.find(
                (bill) => bill.roomId === room.id
              );
              if (!roomBill) return "";

              return `
              <div style="background: white; border: 3px solid ${
                floorIndex === 0 ? "#bfdbfe" : "#bbf7d0"
              }; border-radius: 15px; padding: 25px;">
                <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
                  <h3 style="font-size: 20px; font-weight: bold; color: #1f2937; margin: 0 0 5px 0;">${
                    roomBill.roomName
                  }</h3>
                  <div style="font-size: 12px; color: #6b7280;">${
                    roomBill.floorName
                  }</div>
                </div>

                <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid #e2e8f0;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: center;">
                    <div>
                      <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">Current Reading</div>
                      <div style="font-size: 18px; font-weight: bold; color: #3b82f6;">${
                        roomBill.currentReading
                      }</div>
                    </div>
                    <div>
                      <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">Units Consumed</div>
                      <div style="font-size: 18px; font-weight: bold; color: #10b981;">${
                        roomBill.subMeterUnits
                      }</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 14px; color: #374151;">⚡ Electricity:</span>
                    <span style="font-size: 14px; font-weight: bold; color: #3b82f6;">PKR ${roomBill.electricityCost.toFixed(
                      0
                    )}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 14px; color: #374151;">💧 WASA:</span>
                    <span style="font-size: 14px; font-weight: bold; color: #10b981;">PKR ${roomBill.wasaCost.toFixed(
                      0
                    )}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-size: 14px; color: #374151;">📊 Sub Meter:</span>
                    <span style="font-size: 14px; font-weight: bold; color: #f59e0b;">PKR ${roomBill.subMeterCost.toFixed(
                      0
                    )}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 2px solid #d1d5db;">
                    <span style="font-size: 14px; color: #374151;">👥 Common:</span>
                    <span style="font-size: 14px; font-weight: bold; color: #8b5cf6;">PKR ${roomBill.commonCost.toFixed(
                      0
                    )}</span>
                  </div>
                  <div style="background: ${
                    floorIndex === 0 ? "#eff6ff" : "#f0fdf4"
                  }; padding: 12px; border-radius: 8px; margin-top: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 16px; font-weight: bold; color: #1f2937;">💰 TOTAL:</span>
                      <span style="font-size: 18px; font-weight: bold; color: #1f2937;">PKR ${roomBill.totalCost.toFixed(
                        0
                      )}</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>

        <div style="text-align: center; padding-top: 30px; border-top: 2px solid #e5e7eb;">
          <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #e5e7eb;">
            <div style="font-size: 14px; color: #6b7280; font-weight: 600;">
              ${floor.name} • Page ${floorIndex + 3} of ${
          formData.floors.length + 4
        } • ${formData.month} ${formData.year}
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("")}

    <!-- Electricity Bill Image Page -->
    <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 25mm; background: white; page-break-after: always;">
      <div style="text-align: center; margin-bottom: 40px; background: #eff6ff; padding: 25px; border-radius: 15px; border: 2px solid #bfdbfe;">
        <h2 style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">⚡ ELECTRICITY BILL</h2>
        <div style="font-size: 16px; color: #6b7280; font-weight: 600;">${
          formData.month
        } ${formData.year}</div>
      </div>

      ${
        formData.electricityBillImage
          ? `
        <div style="background: white; padding: 25px; border-radius: 15px; border: 2px solid #bfdbfe;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="font-size: 20px; font-weight: bold; color: #1e40af; margin-bottom: 8px;">📄 Original Electricity Bill Document</h3>
            <div style="font-size: 14px; color: #6b7280;">Official electricity bill for verification and record keeping</div>
          </div>
          <div style="text-align: center; border: 2px solid #e5e7eb; border-radius: 10px; padding: 20px; background: #f8fafc;">
            <img src="${URL.createObjectURL(
              formData.electricityBillImage
            )}" alt="Electricity Bill" style="max-width: 100%; max-height: 600px; border-radius: 8px;" />
          </div>
        </div>
      `
          : `
        <div style="background: #f9fafb; padding: 60px; border-radius: 15px; text-align: center; border: 2px dashed #d1d5db;">
          <div style="font-size: 24px; color: #6b7280; font-weight: 600; margin-bottom: 10px;">📄 No Electricity Bill Image Available</div>
          <div style="font-size: 14px; color: #9ca3af;">Please upload the electricity bill image for complete documentation</div>
        </div>
      `
      }

      <div style="text-align: center; padding-top: 40px; border-top: 2px solid #e5e7eb;">
        <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #e5e7eb;">
          <div style="font-size: 14px; color: #6b7280; font-weight: 600;">
            Electricity Bill • Page ${formData.floors.length + 3} of ${
      formData.floors.length + 4
    } • ${formData.month} ${formData.year}
          </div>
        </div>
      </div>
    </div>

    <!-- WASA Bill Image Page -->
    <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 25mm; background: white;">
      <div style="text-align: center; margin-bottom: 40px; background: #f0fdf4; padding: 25px; border-radius: 15px; border: 2px solid #bbf7d0;">
        <h2 style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">💧 WASA BILL</h2>
        <div style="font-size: 16px; color: #6b7280; font-weight: 600;">${
          formData.month
        } ${formData.year}</div>
      </div>

      ${
        formData.wasaBillImage
          ? `
        <div style="background: white; padding: 25px; border-radius: 15px; border: 2px solid #bbf7d0;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="font-size: 20px; font-weight: bold; color: #059669; margin-bottom: 8px;">📄 Original WASA Bill Document</h3>
            <div style="font-size: 14px; color: #6b7280;">Official water & sanitation bill for verification and record keeping</div>
          </div>
          <div style="text-align: center; border: 2px solid #e5e7eb; border-radius: 10px; padding: 20px; background: #f8fafc;">
            <img src="${URL.createObjectURL(
              formData.wasaBillImage
            )}" alt="WASA Bill" style="max-width: 100%; max-height: 600px; border-radius: 8px;" />
          </div>
        </div>
      `
          : `
        <div style="background: #f9fafb; padding: 60px; border-radius: 15px; text-align: center; border: 2px dashed #d1d5db;">
          <div style="font-size: 24px; color: #6b7280; font-weight: 600; margin-bottom: 10px;">📄 No WASA Bill Image Available</div>
          <div style="font-size: 14px; color: #9ca3af;">Please upload the WASA bill image for complete documentation</div>
        </div>
      `
      }

      <!-- Final System Attribution Footer -->
      <div style="text-align: center; background: #1f2937; color: white; padding: 25px; border-radius: 12px;">
    <p style="font-size: 13px; margin-bottom: 6px;">📅 Generated on: <strong>${new Date().toLocaleDateString()}</strong></p>
    <p style="font-size: 14px; font-weight: bold; color: #fbbf24; margin: 10px 0 4px;">Designed & Developed by Zaeem Khan</p>
    <p style="font-size: 13px; color: #e2e8f0; margin: 2px 0;">Full Stack Developer & Software Engineer</p>
    <p style="font-size: 13px; color: #e2e8f0; margin: 2px 0;">📧 zaeem2141@gmail.com &nbsp;|&nbsp; 📱 +92 307 1632603</p>
    <p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Providing Smart Digital Tools for Smart Living</p>
  </div>

    </div>
  </div>
  `;
  };

  const getTotalRooms = () => {
    return formData.floors.reduce(
      (total, floor) => total + floor.rooms.length,
      0
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("PKR", "")
      .trim();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Mobile Navigation Tabs */}
        <div className="md:hidden sticky top-0 z-10 bg-white shadow-md rounded-lg mb-4">
          <div className="flex justify-between items-center p-2 gap-1">
            <Button
              variant={activeTab === "summary" ? "default" : "outline"}
              onClick={() => setActiveTab("summary")}
              className="flex-1 text-xs py-1 h-auto"
            >
              <DollarSign className="h-3 w-3 mr-1" />
              Summary
            </Button>
            <Button
              variant={activeTab === "rooms" ? "default" : "outline"}
              onClick={() => setActiveTab("rooms")}
              className="flex-1 text-xs py-1 h-auto"
            >
              <Home className="h-3 w-3 mr-1" />
              Rooms
            </Button>
            <Button
              variant={activeTab === "images" ? "default" : "outline"}
              onClick={() => setActiveTab("images")}
              className="flex-1 text-xs py-1 h-auto"
            >
              <Zap className="h-3 w-3 mr-1" />
              Bills
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calculator
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={downloadPDF}
              disabled={isDownloading}
              variant="download"
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isDownloading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">Preparing...</span>
                </div>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div ref={billRef} className="max-w-7xl mx-auto">
          <Card className="shadow-lg border bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg p-6 sm:p-8">
              <div className="text-center">
                <Building2 className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
                <CardTitle className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">
                  AJMAL HOUSE
                </CardTitle>
                <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">
                  UTILITY BILL
                </h2>
                <p className="text-lg sm:text-xl opacity-90 mb-1 sm:mb-2">
                  {formData.month} {formData.year}
                </p>
                <p className="text-xs sm:text-sm opacity-75">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-10">
              {/* Grand Total - Always visible on mobile */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 sm:p-6 rounded-lg text-center shadow-lg transform transition-all duration-500 hover:scale-[1.01]">
                <div className="flex items-center justify-center mb-2 sm:mb-4">
                  <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3" />
                  <h3 className="text-2xl sm:text-3xl font-bold">
                    GRAND TOTAL
                  </h3>
                </div>
                <p className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">
                  {formatCurrency(calculatedBill.grandTotal)}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4 text-xs sm:text-sm opacity-90 bg-white/10 p-3 sm:p-4 rounded-lg">
                  <div className="text-center">
                    <Zap className="mx-auto h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                    <p className="font-medium">Electricity</p>
                    <p>{formatCurrency(formData.totalElectricityBill)}</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="mx-auto h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                    <p className="font-medium">WASA</p>
                    <p>{formatCurrency(formData.totalWasaBill)}</p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto h-4 w-4 sm:h-5 sm:w-5 bg-white rounded-full flex items-center justify-center mb-1">
                      <span className="text-black font-bold text-xs">📊</span>
                    </div>
                    <p className="font-medium">Sub Meter Units</p>
                    <p>{formatCurrency(calculatedBill?.totalSubMeterUnits)}</p>
                  </div>
                  <div className="text-center">
                    <Users className="mx-auto h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                    <p className="font-medium">Common Units</p>
                    <p>{formatCurrency(calculatedBill?.totalCommonUnits)}</p>
                  </div>
                </div>
              </div>

              {/* Summary Section - Visible on desktop or when summary tab is active */}
              {(activeTab === "summary" || !("ontouchstart" in window)) && (
                <div className="bg-gray-50 p-4 sm:p-8 rounded-lg border shadow-sm animate-fadeIn">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-800 text-center flex items-center justify-center">
                    <DollarSign className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    Bill Summary
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 items-center">
                    <div className="text-center bg-white p-3 sm:p-6 rounded-lg shadow border transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <Zap className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                        Total Electricity Bill
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-600">
                        {formatCurrency(formData.totalElectricityBill)}
                      </p>
                    </div>
                    <div className="text-center bg-white p-3 sm:p-6 rounded-lg shadow border transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <Droplets className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-green-600 mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                        Total WASA Bill
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-green-600">
                        {formatCurrency(formData.totalWasaBill)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-4 sm:mt-8">
                    <div className="text-center bg-white p-3 sm:p-6 rounded-lg shadow border transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                        Total Units Consumed
                      </p>
                      <p className="text-base sm:text-2xl font-semibold text-gray-800">
                        {formData.totalUnits} Units
                      </p>
                    </div>
                    <div className="text-center bg-white p-3 sm:p-6 rounded-lg shadow border transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                        Total Rooms
                      </p>
                      <p className="text-base sm:text-2xl font-semibold text-gray-800">
                        {getTotalRooms()} Rooms
                      </p>
                    </div>
                    <div className="text-center bg-white p-3 sm:p-6 rounded-lg shadow border transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                        Number of Floors
                      </p>
                      <p className="text-base sm:text-2xl font-semibold text-gray-800">
                        {formData.numberOfFloors} Floors
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-green-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">
                      Units Information
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                      <div className="text-center bg-white p-3 sm:p-6 rounded-lg shadow border transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div className="mx-auto h-6 w-6 sm:h-8 sm:w-8 bg-orange-600 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                          <span className="text-white font-bold text-sm">
                            📊
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                          Sub Meter Cost
                        </p>
                        <p className="text-lg sm:text-2xl font-bold text-orange-600">
                          {formatCurrency(calculatedBill?.totalSubMeterCost)}
                        </p>
                      </div>
                      <div className="text-center bg-white p-3 sm:p-6 rounded-lg shadow border transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <Users className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-purple-800 mb-2 sm:mb-3" />
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                          Common Cost
                        </p>
                        <p className="text-lg sm:text-2xl font-bold text-purple-600">
                          {formatCurrency(calculatedBill?.totalCommonCost)}
                        </p>
                      </div>
                      <div className="text-center bg-white p-3 sm:p-6 rounded-lg shadow border transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div className="mx-auto h-6 w-6 sm:h-8 sm:w-8 bg-blue-600 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                          <span className="text-white font-bold text-sm">
                            📊
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                          Sub Meter Units
                        </p>
                        <p className="text-lg sm:text-2xl font-bold text-blue-600">
                          {calculatedBill?.totalSubMeterUnits}
                        </p>
                      </div>
                      <div className="text-center bg-white p-3 sm:p-6 rounded-lg shadow border transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <Users className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mb-2 sm:mb-3" />
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                          Common Units
                        </p>
                        <p className="text-lg sm:text-2xl font-bold text-purple-600">
                          {calculatedBill?.totalCommonUnits}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Rate Information */}
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">
                      Rate Information
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                      <div className="bg-white p-2 sm:p-3 rounded border border-blue-100">
                        <p className="text-gray-500 mb-1">
                          Electricity Per Unit
                        </p>
                        <p className="font-bold text-blue-700">
                          PKR {calculatedBill.electricityPerUnit.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-white p-2 sm:p-3 rounded border border-green-100">
                        <p className="text-gray-500 mb-1">WASA Per Room</p>
                        <p className="font-bold text-green-700">
                          PKR {calculatedBill.wasaPerRoom.toFixed(2)}
                        </p>
                      </div>
                      {/* <div className="bg-white p-2 sm:p-3 rounded border border-orange-100">
                        <p className="text-gray-500 mb-1">
                          Sub Meter Per Floor
                        </p>
                        <p className="font-bold text-orange-700">
                          PKR {calculatedBill.subMeterCostPerFloor.toFixed(2)}
                        </p>
                      </div> */}
                      <div className="bg-white p-2 sm:p-3 rounded border border-purple-100">
                        <p className="text-gray-500 mb-1">Common Per Room</p>
                        <p className="font-bold text-purple-700">
                          PKR {calculatedBill.commonCostPerRoom.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Room Bills - Visible on desktop or when rooms tab is active */}
              {(activeTab === "rooms" || !("ontouchstart" in window)) && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center flex items-center justify-center">
                    <Home className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                    Individual Room Bills
                  </h3>

                  {formData.floors.map((floor, floorIndex) => (
                    <div key={floor.id} className="mb-6 sm:mb-10">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-6 flex items-center">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 ${
                            floorIndex === 0 ? "bg-blue-600" : "bg-green-600"
                          } rounded-lg flex items-center justify-center mr-2 sm:mr-3`}
                        >
                          <Home className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        {floor.name}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {floor.rooms.map((room) => {
                          const roomBill = calculatedBill.roomBills.find(
                            (bill) => bill.roomId === room.id
                          );
                          if (!roomBill) return null;

                          return (
                            <Card
                              key={room.id}
                              className={`border-2 ${
                                floorIndex === 0
                                  ? "border-blue-200"
                                  : "border-green-200"
                              } shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] overflow-hidden`}
                            >
                              <CardHeader
                                className={`py-3 px-4 ${
                                  floorIndex === 0
                                    ? "bg-blue-50"
                                    : "bg-green-50"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg flex items-center">
                                    <div
                                      className={`w-7 h-7 ${
                                        floorIndex === 0
                                          ? "bg-blue-500"
                                          : "bg-green-500"
                                      } rounded-full flex items-center justify-center mr-2 shadow-sm`}
                                    >
                                      <span className="text-white text-xs font-bold">
                                        {room.name.split(" ")[1]}
                                      </span>
                                    </div>
                                    <span className="font-bold text-gray-800">
                                      {roomBill.roomName}
                                    </span>
                                  </CardTitle>
                                  <div className="bg-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                                    {roomBill.floorName}
                                  </div>
                                </div>
                              </CardHeader>

                              <CardContent className="p-4">
                                {/* Meter Readings */}
                                <div className="bg-white p-3 rounded-lg mb-3 border shadow-sm">
                                  <div className="grid grid-cols-2 gap-2 text-center">
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        Current Reading
                                      </p>
                                      <p className="font-bold text-blue-600">
                                        {roomBill.currentReading}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        Units Consumed
                                      </p>
                                      <p className="font-bold text-green-600">
                                        {roomBill.subMeterUnits}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Cost Breakdown */}
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 flex items-center">
                                      <span className="h-3 w-3 mr-1 bg-orange-500 rounded-full"></span>
                                      Sub Meter:
                                    </span>
                                    <span className="font-semibold text-orange-600">
                                      PKR {roomBill.subMeterCost.toFixed(0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 flex items-center">
                                      <Users className="h-3 w-3 mr-1 text-purple-500" />
                                      Common:
                                    </span>
                                    <span className="font-semibold text-purple-600">
                                      PKR {roomBill.commonCost.toFixed(0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 flex items-center">
                                      <Zap className="h-3 w-3 mr-1 text-blue-500" />
                                      Total Electricity Bill:
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                      PKR {roomBill.electricityCost.toFixed(0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 flex items-center">
                                      <Droplets className="h-3 w-3 mr-1 text-green-500" />
                                      WASA:
                                    </span>
                                    <span className="font-semibold text-green-600">
                                      PKR {roomBill.wasaCost.toFixed(0)}
                                    </span>
                                  </div>
                                  <Separator className="my-2" />
                                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                    <span className="font-bold text-gray-800">
                                      Total:
                                    </span>
                                    <span className="font-bold text-lg text-gray-900">
                                      PKR {roomBill.totalCost.toFixed(0)}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bill Images Section - Visible on desktop or when images tab is active */}
              {(activeTab === "images" || !("ontouchstart" in window)) && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
                    Original Bill Images
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    {formData.electricityBillImage && (
                      <div className="bg-white p-4 rounded-lg shadow-lg border transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                        <h4 className="text-lg sm:text-xl font-semibold text-blue-600 mb-3 flex items-center">
                          <Zap className="mr-2 h-5 w-5" />
                          Electricity Bill
                        </h4>
                        <div className="relative pb-[75%] overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                          <img
                            src={
                              URL.createObjectURL(
                                formData.electricityBillImage
                              ) || "/placeholder.svg"
                            }
                            alt="Electricity Bill"
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {formData.wasaBillImage && (
                      <div className="bg-white p-4 rounded-lg shadow-lg border transform transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                        <h4 className="text-lg sm:text-xl font-semibold text-green-600 mb-3 flex items-center">
                          <Droplets className="mr-2 h-5 w-5" />
                          WASA Bill
                        </h4>
                        <div className="relative pb-[75%] overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                          <img
                            src={
                              URL.createObjectURL(formData.wasaBillImage) ||
                              "/placeholder.svg"
                            }
                            alt="WASA Bill"
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 pt-6 sm:pt-8 border-t-2 border-gray-200">
                <p className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                  This bill was generated automatically by Ajmal House Bill
                  Calculator
                </p>
                <p className="mb-2">
                  For any queries, please contact the management
                </p>
                <p className="text-xs">
                  &copy; 2024 Ajmal House Bill Calculator. All rights reserved.
                </p>
                <p className="text-xs text-gray-400">Powered by Zaeem Khan</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
