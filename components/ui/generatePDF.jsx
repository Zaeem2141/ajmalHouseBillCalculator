export const createPDFContent = (totalRooms, formData, calculatedBill) => {
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
  return `
  <div style="font-family: Arial, sans-serif; color: #000000;">
    <!-- Grand Total Page -->
    <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 30mm; background: #000000; page-break-after: always; display: flex; flex-direction: column;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 48px; font-weight: bold; color: #1f2937; margin: 0 0 10px 0;">AJMAL HOUSE</h1>
        <h2 style="font-size: 32px; font-weight: 600; color: #3b82f6; margin: 0 0 20px 0;">UTILITY BILL</h2>
        <div style="font-size: 24px; color: #6b7280; font-weight: 500;">${
          formData?.month
        } ${formData?.year}</div>
        <div style="width: 80px; height: 3px; background: #3b82f6; margin: 15px auto;"></div>
      </div>

      <!-- Grand Total Section -->
      <div style="background: #f8fafc; padding: 40px; border-radius: 15px; text-align: center; margin-bottom: 40px; border: 2px solid #e2e8f0;">
        <h3 style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 30px;">TOTAL AMOUNT</h3>
        <div style="font-size: 64px; font-weight: bold; margin-bottom: 30px; color: #1f2937;">
          PKR ${formatCurrency(calculatedBill?.grandTotal)}
        </div>
      </div>              
      
      </div>
              </div>`;
  //   <!-- Cost Breakdown -->
  //   <div style="margin-bottom: 40px;">
  //     <h4 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 25px; text-align: center;">Cost Breakdown</h4>
  //     <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
  //       <div style="background: white; padding: 25px; border-radius: 10px; border: 2px solid #bfdbfe; text-align: center;">
  //         <div style="font-size: 18px; color: #6b7280; margin-bottom: 8px;">Electricity Bill</div>
  //         <div style="font-size: 28px; font-weight: bold; color: #3b82f6;">PKR ${formatCurrency(
  //           formData?.totalElectricityBill
  //         )}</div>
  //       </div>
  //       <div style="background: white; padding: 25px; border-radius: 10px; border: 2px solid #bbf7d0; text-align: center;">
  //         <div style="font-size: 18px; color: #6b7280; margin-bottom: 8px;">WASA Bill</div>
  //         <div style="font-size: 28px; font-weight: bold; color: #10b981;">PKR ${formatCurrency(
  //           formData?.totalWasaBill
  //         )}</div>
  //       </div>
  //       <div style="background: white; padding: 25px; border-radius: 10px; border: 2px solid #fed7aa; text-align: center;">
  //         <div style="font-size: 18px; color: #6b7280; margin-bottom: 8px;">Sub Meter Cost</div>
  //         <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">PKR ${formatCurrency(
  //           calculatedBill?.totalSubMeterCost
  //         )}</div>
  //       </div>
  //       <div style="background: white; padding: 25px; border-radius: 10px; border: 2px solid #ddd6fe; text-align: center;">
  //         <div style="font-size: 18px; color: #6b7280; margin-bottom: 8px;">Common Cost</div>
  //         <div style="font-size: 28px; font-weight: bold; color: #8b5cf6;">PKR ${formatCurrency(
  //           calculatedBill?.totalSubMeterUnits
  //         )}</div>
  //       </div>
  //     </div>
  //   </div>

  //   <!-- Building Info -->
  //   <div style="background: #f0fdf4; padding: 30px; border-radius: 15px; border: 2px solid #bbf7d0;">
  //     <h4 style="font-size: 24px; font-weight: bold; color: #166534; margin-bottom: 25px; text-align: center;">Building Information</h4>
  //     <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
  //       <div>
  //         <div style="font-size: 16px; color: #6b7280; margin-bottom: 5px;">Total Units</div>
  //         <div style="font-size: 24px; font-weight: bold; color: #166534;">${
  //           formData?.totalUnits
  //         }</div>
  //       </div>
  //       <div>
  //         <div style="font-size: 16px; color: #6b7280; margin-bottom: 5px;">Total Rooms</div>
  //         <div style="font-size: 24px; font-weight: bold; color: #166534;">${totalRooms}</div>
  //       </div>
  //       <div>
  //         <div style="font-size: 16px; color: #6b7280; margin-bottom: 5px;">Floors</div>
  //         <div style="font-size: 24px; font-weight: bold; color: #166534;">${
  //           formData?.numberOfFloors
  //         }</div>
  //       </div>
  //     </div>
  //   </div>

  //   <!-- Footer -->
  //   <div style="margin-top: auto; text-align: center; padding-top: 30px; border-top: 2px solid #e5e7eb;">
  //     <div style="font-size: 16px; color: #6b7280;">
  //       Ajmal House Bill Calculator • ${formData?.month} ${formData?.year}
  //     </div>
  //   </div>
  // </div>

  //   <!-- Rate Information Page -->
  //   <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 30mm; background: white; page-break-after: always;">
  //     <!-- Header -->
  //     <div style="text-align: center; margin-bottom: 40px;">
  //       <h2 style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">RATE INFORMATION</h2>
  //       <div style="font-size: 18px; color: #6b7280;">${formData.month} ${
  //     formData.year
  //   }</div>
  //       <div style="width: 80px; height: 3px; background: #f59e0b; margin: 15px auto;"></div>
  //     </div>

  //     <!-- Rate Cards -->
  //     <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
  //       <div style="background: white; padding: 30px; border-radius: 15px; border: 3px solid #bfdbfe; text-align: center;">
  //         <div style="font-size: 18px; color: #6b7280; margin-bottom: 10px;">Electricity Per Unit</div>
  //         <div style="font-size: 32px; font-weight: bold; color: #3b82f6;">PKR ${calculatedBill.electricityPerUnit.toFixed(
  //           2
  //         )}</div>
  //       </div>
  //       <div style="background: white; padding: 30px; border-radius: 15px; border: 3px solid #bbf7d0; text-align: center;">
  //         <div style="font-size: 18px; color: #6b7280; margin-bottom: 10px;">WASA Per Room</div>
  //         <div style="font-size: 32px; font-weight: bold; color: #10b981;">PKR ${calculatedBill.wasaPerRoom.toFixed(
  //           2
  //         )}</div>
  //       </div>
  //       <div style="background: white; padding: 30px; border-radius: 15px; border: 3px solid #fed7aa; text-align: center;">
  //         <div style="font-size: 18px; color: #6b7280; margin-bottom: 10px;">Sub Meter Per Floor</div>
  //         <div style="font-size: 32px; font-weight: bold; color: #f59e0b;">PKR ${calculatedBill.subMeterCostPerFloor.toFixed(
  //           2
  //         )}</div>
  //       </div>
  //       <div style="background: white; padding: 30px; border-radius: 15px; border: 3px solid #ddd6fe; text-align: center;">
  //         <div style="font-size: 18px; color: #6b7280; margin-bottom: 10px;">Common Per Room</div>
  //         <div style="font-size: 32px; font-weight: bold; color: #8b5cf6;">PKR ${calculatedBill.commonCostPerRoom.toFixed(
  //           2
  //         )}</div>
  //       </div>
  //     </div>

  //     <!-- Floor Structure -->
  //     <div style="background: #f8fafc; padding: 30px; border-radius: 15px; border: 2px solid #e2e8f0;">
  //       <h4 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 25px; text-align: center;">Floor Structure</h4>
  //       <div style="display: grid; grid-template-columns: repeat(${Math.min(
  //         formData.numberOfFloors,
  //         2
  //       )}, 1fr); gap: 25px;">
  //         ${formData.floors
  //           .map(
  //             (floor, index) => `
  //           <div style="background: white; padding: 25px; border-radius: 15px; text-align: center; border: 3px solid ${
  //             index === 0 ? "#bfdbfe" : "#bbf7d0"
  //           };">
  //             <div style="font-size: 20px; color: #6b7280; margin-bottom: 10px; font-weight: 600;">${
  //               floor.name
  //             }</div>
  //             <div style="font-size: 28px; font-weight: bold; color: ${
  //               index === 0 ? "#3b82f6" : "#10b981"
  //             }; margin-bottom: 8px;">${floor.rooms.length} Rooms</div>
  //             <div style="font-size: 16px; color: #6b7280;">${floor.rooms.reduce(
  //               (sum, room) => sum + room.subMeterUnits,
  //               0
  //             )} Units</div>
  //           </div>
  //         `
  //           )
  //           .join("")}
  //       </div>
  //     </div>

  //     <!-- Footer -->
  //     <div style="margin-top: auto; text-align: center; padding-top: 30px; border-top: 2px solid #e5e7eb;">
  //       <div style="font-size: 16px; color: #6b7280;">
  //         Rate Information • Page 2 of ${formData.floors.length + 4}
  //       </div>
  //     </div>
  //   </div>

  //   ${formData.floors
  //     .map(
  //       (floor, floorIndex) => `
  //     <!-- Floor ${floorIndex + 1} Page -->
  //     <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 30mm; background: white; page-break-after: always;">
  //       <!-- Floor Header -->
  //       <div style="background: ${
  //         floorIndex === 0 ? "#eff6ff" : "#f0fdf4"
  //       }; padding: 30px; border-radius: 15px; margin-bottom: 40px; text-align: center; border: 3px solid ${
  //         floorIndex === 0 ? "#bfdbfe" : "#bbf7d0"
  //       };">
  //         <h2 style="font-size: 36px; font-weight: bold; color: ${
  //           floorIndex === 0 ? "#1e40af" : "#166534"
  //         }; margin: 0 0 10px 0;">${floor.name}</h2>
  //         <div style="font-size: 18px; color: #6b7280;">${
  //           floor.rooms.length
  //         } Room${floor.rooms.length !== 1 ? "s" : ""} • ${formData.month} ${
  //         formData.year
  //       }</div>
  //       </div>

  //       <!-- Rooms Grid -->
  //       <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-bottom: 40px;">
  //         ${floor.rooms
  //           .map((room, roomIndex) => {
  //             const roomBill = calculatedBill.roomBills.find(
  //               (bill) => bill.roomId === room.id
  //             );
  //             if (!roomBill) return "";

  //             return `
  //             <div style="background: white; border: 3px solid ${
  //               floorIndex === 0 ? "#bfdbfe" : "#bbf7d0"
  //             }; border-radius: 15px; padding: 25px;">
  //               <!-- Room Header -->
  //               <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
  //                 <h3 style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 0 0 5px 0;">${
  //                   roomBill.roomName
  //                 }</h3>
  //                 <div style="font-size: 14px; color: #6b7280;">${
  //                   roomBill.floorName
  //                 }</div>
  //               </div>

  //               <!-- Meter Readings -->
  //               <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #e2e8f0;">
  //                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: center;">
  //                   <div>
  //                     <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Current Reading</div>
  //                     <div style="font-size: 20px; font-weight: bold; color: #3b82f6;">${
  //                       roomBill.currentReading
  //                     }</div>
  //                   </div>
  //                   <div>
  //                     <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Units Consumed</div>
  //                     <div style="font-size: 20px; font-weight: bold; color: #10b981;">${
  //                       roomBill.subMeterUnits
  //                     }</div>
  //                   </div>
  //                 </div>
  //               </div>

  //               <!-- Cost Breakdown -->
  //               <div style="space-y: 10px;">
  //                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
  //                   <span style="font-size: 16px; color: #374151;">Electricity:</span>
  //                   <span style="font-size: 16px; font-weight: 600; color: #3b82f6;">PKR ${roomBill.electricityCost.toFixed(
  //                     0
  //                   )}</span>
  //                 </div>
  //                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
  //                   <span style="font-size: 16px; color: #374151;">WASA:</span>
  //                   <span style="font-size: 16px; font-weight: 600; color: #10b981;">PKR ${roomBill.wasaCost.toFixed(
  //                     0
  //                   )}</span>
  //                 </div>
  //                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
  //                   <span style="font-size: 16px; color: #374151;">Sub Meter:</span>
  //                   <span style="font-size: 16px; font-weight: 600; color: #f59e0b;">PKR ${roomBill.subMeterCost.toFixed(
  //                     0
  //                   )}</span>
  //                 </div>
  //                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 2px solid #d1d5db;">
  //                   <span style="font-size: 16px; color: #374151;">Common:</span>
  //                   <span style="font-size: 16px; font-weight: 600; color: #8b5cf6;">PKR ${roomBill.commonCost.toFixed(
  //                     0
  //                   )}</span>
  //                 </div>
  //                 <div style="background: ${
  //                   floorIndex === 0 ? "#eff6ff" : "#f0fdf4"
  //                 }; padding: 15px; border-radius: 10px; margin-top: 10px;">
  //                   <div style="display: flex; justify-content: space-between; align-items: center;">
  //                     <span style="font-size: 18px; font-weight: bold; color: #1f2937;">TOTAL:</span>
  //                     <span style="font-size: 20px; font-weight: bold; color: #1f2937;">PKR ${roomBill.totalCost.toFixed(
  //                       0
  //                     )}</span>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           `;
  //           })
  //           .join("")}
  //       </div>

  //       <!-- Floor Summary -->
  //       <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border: 2px solid #e2e8f0;">
  //         <h3 style="font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 20px; text-align: center;">
  //           ${floor.name} Summary
  //         </h3>
  //         <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
  //           <div>
  //             <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Total Rooms</div>
  //             <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${
  //               floor.rooms.length
  //             }</div>
  //           </div>
  //           <div>
  //             <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Total Units</div>
  //             <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${floor.rooms.reduce(
  //               (sum, room) => sum + room.subMeterUnits,
  //               0
  //             )}</div>
  //           </div>
  //           <div>
  //             <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Floor Total</div>
  //             <div style="font-size: 24px; font-weight: bold; color: #1f2937;">PKR ${calculatedBill.roomBills
  //               .filter((bill) => bill.floorName === floor.name)
  //               .reduce((sum, bill) => sum + bill.totalCost, 0)
  //               .toFixed(0)}</div>
  //           </div>
  //         </div>
  //       </div>

  //       <!-- Page Footer -->
  //       <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 2px solid #e5e7eb;">
  //         <div style="font-size: 16px; color: #6b7280;">
  //           ${floor.name} • Page ${floorIndex + 3} of ${
  //         formData.floors.length + 4
  //       }
  //         </div>
  //       </div>
  //     </div>
  //   `
  //     )
  //     .join("")}

  //   <!-- Electricity Bill Image Page -->
  //   <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 30mm; background: white; page-break-after: always;">
  //     <div style="text-align: center; margin-bottom: 40px;">
  //       <h2 style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">ELECTRICITY BILL</h2>
  //       <div style="font-size: 18px; color: #6b7280;">${formData.month} ${
  //     formData.year
  //   }</div>
  //       <div style="width: 80px; height: 3px; background: #3b82f6; margin: 15px auto;"></div>
  //     </div>

  //     ${
  //       formData.electricityBillImage
  //         ? `
  //       <div style="text-align: center; border: 3px solid #e5e7eb; border-radius: 15px; padding: 20px; background: #f8fafc;">
  //         <img src="${URL.createObjectURL(
  //           formData.electricityBillImage
  //         )}" alt="Electricity Bill" style="max-width: 100%; max-height: 700px; border-radius: 10px;" />
  //       </div>
  //     `
  //         : `
  //       <div style="background: #f9fafb; padding: 60px; border-radius: 15px; text-align: center; border: 2px dashed #d1d5db;">
  //         <div style="font-size: 24px; color: #6b7280; font-weight: 600;">No Electricity Bill Image Available</div>
  //       </div>
  //     `
  //     }

  //     <!-- Page Footer -->
  //     <div style="margin-top: auto; text-align: center; padding-top: 40px; border-top: 2px solid #e5e7eb;">
  //       <div style="font-size: 16px; color: #6b7280;">
  //         Electricity Bill • Page ${formData.floors.length + 3} of ${
  //     formData.floors.length + 4
  //   }
  //       </div>
  //     </div>
  //   </div>

  //   <!-- WASA Bill Image Page -->
  //   <div class="pdf-page" style="width: 210mm; min-height: 297mm; padding: 30mm; background: white;">
  //     <div style="text-align: center; margin-bottom: 40px;">
  //       <h2 style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">WASA BILL</h2>
  //       <div style="font-size: 18px; color: #6b7280;">${formData.month} ${
  //     formData.year
  //   }</div>
  //       <div style="width: 80px; height: 3px; background: #10b981; margin: 15px auto;"></div>
  //     </div>

  //     ${
  //       formData.wasaBillImage
  //         ? `
  //       <div style="text-align: center; border: 3px solid #e5e7eb; border-radius: 15px; padding: 20px; background: #f8fafc;">
  //         <img src="${URL.createObjectURL(
  //           formData.wasaBillImage
  //         )}" alt="WASA Bill" style="max-width: 100%; max-height: 700px; border-radius: 10px;" />
  //       </div>
  //     `
  //         : `
  //       <div style="background: #f9fafb; padding: 60px; border-radius: 15px; text-align: center; border: 2px dashed #d1d5db;">
  //         <div style="font-size: 24px; color: #6b7280; font-weight: 600;">No WASA Bill Image Available</div>
  //       </div>
  //     `
  //     }

  //     <!-- Final Footer -->
  //     <div style="margin-top: auto; text-align: center; padding-top: 40px; border-top: 2px solid #e5e7eb;">
  //       <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border: 2px solid #e2e8f0;">
  //         <div style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">
  //           Ajmal House Bill Calculator
  //         </div>
  //         <div style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
  //           Professional Utility Bill Management System
  //         </div>
  //         <div style="font-size: 12px; color: #6b7280;">
  //           Designed & Developed by <strong>Zaeem Khan</strong> - Software Engineer
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>
};
