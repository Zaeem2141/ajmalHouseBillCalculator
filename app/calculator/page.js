"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  ArrowLeft,
  Building2,
  Upload,
  X,
  Plus,
  Home,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BillDisplay from "@/components/bill-display";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) =>
  (currentYear - 5 + i).toString()
);

export default function CalculatorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    totalElectricityBill: 0,
    totalUnits: 0,
    totalWasaBill: 0,
    numberOfFloors: 0,
    floors: [],
    subMeterCost: 0,
    commonCost: 0,
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().getFullYear().toString(),
    electricityBillImage: null,
    wasaBillImage: null,
  });

  const [calculatedBill, setCalculatedBill] = useState(null);
  const [showBill, setShowBill] = useState(false);

  // Initialize floors when numberOfFloors changes
  useEffect(() => {
    const newFloors = [];
    for (let i = 0; i < formData.numberOfFloors; i++) {
      const floorName = i === 0 ? "Ground Floor" : `${getOrdinal(i)} Floor`;
      newFloors.push({
        id: `floor-${i}`,
        name: floorName,
        rooms: [],
      });
    }
    setFormData((prev) => ({ ...prev, floors: newFloors }));
  }, [formData.numberOfFloors]);

  const getOrdinal = (num) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        typeof value === "string" &&
        field !== "month" &&
        field !== "year" &&
        field !== "electricityBillImage" &&
        field !== "wasaBillImage"
          ? Number.parseFloat(value) || 0
          : value,
    }));
  };

  const handleImageUpload = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const removeImage = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const addRoom = (floorId) => {
    setFormData((prev) => ({
      ...prev,
      floors: prev?.floors?.map((floor) => {
        if (floor.id === floorId) {
          const roomNumber = floor?.rooms?.length + 1;
          const newRoom = {
            id: `${floorId}-room-${roomNumber}`,
            name: `Room ${roomNumber}`,
            subMeterUnits: 0,
            currentReading: 0,
          };
          return { ...floor, rooms: [...floor.rooms, newRoom] };
        }
        return floor;
      }),
    }));
  };

  const removeRoom = (floorId, roomId) => {
    setFormData((prev) => ({
      ...prev,
      floors: prev?.floors?.map((floor) => {
        if (floor?.id === floorId) {
          const updatedRooms = floor?.rooms?.filter(
            (room) => room.id !== roomId
          );
          // Renumber remaining rooms
          const renumberedRooms = updatedRooms.map((room, index) => ({
            ...room,
            name: `Room ${index + 1}`,
          }));
          return { ...floor, rooms: renumberedRooms };
        }
        return floor;
      }),
    }));
  };

  const updateRoom = (floorId, roomId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      floors: prev.floors.map((floor) => {
        if (floor.id === floorId) {
          return {
            ...floor,
            rooms: floor.rooms.map((room) => {
              if (room.id === roomId) {
                return { ...room, [field]: value };
              }
              return room;
            }),
          };
        }
        return floor;
      }),
    }));
  };

  const getTotalRooms = () => {
    return formData.floors.reduce(
      (total, floor) => total + floor.rooms.length,
      0
    );
  };

  const getTotalSubMeterUnits = () => {
    return formData.floors.reduce(
      (total, floor) =>
        total +
        floor.rooms.reduce(
          (floorTotal, room) => floorTotal + room.subMeterUnits,
          0
        ),
      0
    );
  };

  const isFormValid = () => {
    const hasAllRoomsWithData = formData.floors.every(
      (floor) =>
        floor.rooms.length > 0 &&
        floor.rooms.every(
          (room) =>
            room.currentReading >= 0 &&
            room.subMeterUnits >= 0 &&
            (room.currentReading > 0 || room.subMeterUnits >= 0)
        )
    );

    const requiredFields = [
      formData.totalElectricityBill > 0,
      formData.totalUnits > 0,
      formData.totalWasaBill > 0,
      formData.numberOfFloors > 0,
      hasAllRoomsWithData,
      formData.subMeterCost >= 0,
      formData.commonCost >= 0,
      formData.month !== "",
      formData.year !== "",
      formData.electricityBillImage !== null,
      formData.wasaBillImage !== null,
    ];
    return requiredFields.every(Boolean);
  };

  const calculateBill = () => {
    const totalRooms = getTotalRooms();
    const totalSubMeterUnits = getTotalSubMeterUnits();

    // Calculate rates
    const electricityPerUnit =
      formData.totalElectricityBill / formData.totalUnits;
    const wasaPerRoom = formData.totalWasaBill / totalRooms;
    const totalCommonUnits = formData?.totalUnits - totalSubMeterUnits;
    const totalSubMeterCost = totalSubMeterUnits * electricityPerUnit;
    const totalCommonCost = totalCommonUnits * electricityPerUnit;
    const grandTotal = formData?.totalElectricityBill + formData?.totalWasaBill;
    const subMeterCostPerFloor = 0;
    const commonCostPerRoom = totalCommonCost / totalRooms;

    // Calculate room bills
    const roomBills = [];

    formData?.floors?.forEach((floor) => {
      floor?.rooms?.forEach((room) => {
        const wasaCost = wasaPerRoom; // Each room pays equal WASA
        const subMeterCost = room?.subMeterUnits * electricityPerUnit;
        const commonCost = totalCommonCost / totalRooms;
        const totalCost = wasaCost + subMeterCost + commonCost;
        const electricityCost = subMeterCost + commonCost;

        roomBills.push({
          roomId: room.id,
          roomName: room.name,
          floorName: floor.name,
          subMeterUnits: room?.subMeterUnits,
          currentReading: room?.currentReading,
          electricityCost,
          wasaCost,
          subMeterCost,
          commonCost,
          totalCost,
        });
      });
    });
    const totalCalculated = roomBills.reduce(
      (sum, bill) => sum + bill.totalCost,
      0
    );

    const calculated = {
      roomBills,
      totalCalculated,
      electricityPerUnit,
      wasaPerRoom,
      subMeterCostPerFloor,
      commonCostPerRoom,
      grandTotal,
      totalCommonUnits,
      totalCommonCost,
      totalSubMeterCost,
      totalSubMeterUnits,
    };

    setCalculatedBill(calculated);
    setShowBill(true);
  };

  if (showBill && calculatedBill) {
    return (
      <BillDisplay
        formData={formData}
        calculatedBill={calculatedBill}
        onBack={() => setShowBill(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4 text-gray-700 hover:bg-gray-100"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center mb-4">
            <Building2 className="mr-3 h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Ajmal House Bill Calculator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Enter the details to calculate your Ajmal House bills
          </p>
        </div>

        <Card className="max-w-6xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Calculator className="mr-3 h-6 w-6 text-blue-600" />
              Ajmal House Bill Details
            </CardTitle>
            <CardDescription size="lg">
              Fill in all the required information to generate your professional
              bill (All fields are mandatory)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Date Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="month"
                  className="text-gray-700 text-base font-semibold"
                >
                  Month <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.month}
                  onValueChange={(value) => handleInputChange("month", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="year"
                  className="text-gray-700 text-base font-semibold"
                >
                  Year <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => handleInputChange("year", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Electricity Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">⚡</span>
                </div>
                Electricity Details
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label
                    htmlFor="totalElectricityBill"
                    className="text-gray-700 text-base font-semibold"
                  >
                    Total Electricity Bill (PKR){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="totalElectricityBill"
                    type="number"
                    value={formData.totalElectricityBill || ""}
                    onChange={(e) =>
                      handleInputChange("totalElectricityBill", e.target.value)
                    }
                    placeholder="15000"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="totalUnits"
                    className="text-gray-700 text-base font-semibold"
                  >
                    Total Units Consumed <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="totalUnits"
                    type="number"
                    value={formData.totalUnits || ""}
                    onChange={(e) =>
                      handleInputChange("totalUnits", e.target.value)
                    }
                    placeholder="500"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-700 text-base font-semibold">
                    Electricity Bill Image{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2">
                    {formData.electricityBillImage ? (
                      <div className="relative">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                          <span className="text-sm text-green-700 truncate">
                            {formData.electricityBillImage.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage("electricityBillImage")}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleImageUpload("electricityBillImage", file);
                          }}
                          className="hidden"
                          id="electricity-upload"
                        />
                        <Label
                          htmlFor="electricity-upload"
                          className="flex items-center justify-center w-full h-10 px-3 py-2 border border-input bg-background rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          <span className="text-sm">Choose File</span>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* WASA Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">💧</span>
                </div>
                Water (WASA) Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="totalWasaBill"
                    className="text-gray-700 text-base font-semibold"
                  >
                    Total WASA Bill (PKR){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="totalWasaBill"
                    type="number"
                    value={formData.totalWasaBill || ""}
                    onChange={(e) =>
                      handleInputChange("totalWasaBill", e.target.value)
                    }
                    placeholder="3000"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-700 text-base font-semibold">
                    WASA Bill Image <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2">
                    {formData.wasaBillImage ? (
                      <div className="relative">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                          <span className="text-sm text-green-700 truncate">
                            {formData.wasaBillImage.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage("wasaBillImage")}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleImageUpload("wasaBillImage", file);
                          }}
                          className="hidden"
                          id="wasa-upload"
                        />
                        <Label
                          htmlFor="wasa-upload"
                          className="flex items-center justify-center w-full h-10 px-3 py-2 border border-input bg-background rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          <span className="text-sm">Choose File</span>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Building Structure */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">🏠</span>
                </div>
                Building Structure & Room Details
              </h3>

              {/* Number of Floors */}
              <div className="mb-8">
                <Label
                  htmlFor="numberOfFloors"
                  className="text-gray-700 text-base font-semibold mb-4 block"
                >
                  Number of Floors <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Input
                    id="numberOfFloors"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.numberOfFloors || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "numberOfFloors",
                        Number.parseInt(e.target.value) || 1
                      )
                    }
                    placeholder="0"
                    className="w-full sm:w-32 text-center text-lg font-semibold"
                    required
                  />
                  <div className="text-sm text-gray-600">
                    Building will have {formData.numberOfFloors} floor
                    {formData.numberOfFloors > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Floors and Rooms */}
              <div className="space-y-8">
                {formData.floors.map((floor, floorIndex) => (
                  <Card
                    key={floor.id}
                    className="border-2 border-gray-200 shadow-md overflow-hidden"
                  >
                    <CardHeader
                      className={`${
                        floorIndex === 0 ? "bg-blue-50" : "bg-green-50"
                      } rounded-t-lg p-4 sm:p-6`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <CardTitle className="flex items-center text-xl">
                          <div
                            className={`w-8 h-8 ${
                              floorIndex === 0 ? "bg-blue-600" : "bg-green-600"
                            } rounded-lg flex items-center justify-center mr-3`}
                          >
                            <Home className="h-5 w-5 text-white" />
                          </div>
                          <span className="mr-3">{floor.name}</span>
                          <span className="text-sm font-normal text-gray-600">
                            ({floor.rooms.length} room
                            {floor.rooms.length !== 1 ? "s" : ""})
                          </span>
                        </CardTitle>
                        <Button
                          type="button"
                          onClick={() => addRoom(floor.id)}
                          className={`${
                            floorIndex === 0
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-green-600 hover:bg-green-700"
                          } text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto`}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Room
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6">
                      {floor.rooms.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-500 text-lg font-medium mb-2">
                            No rooms added yet
                          </p>
                          <p className="text-gray-400 text-sm mb-4">
                            Click &quot;Add Room&quot; to start adding rooms to
                            this floor
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {floor.rooms.map((room, roomIndex) => (
                            <Card
                              key={room.id}
                              className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50"
                            >
                              <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white rounded-t-lg p-4">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg flex items-center">
                                    <div
                                      className={`w-8 h-8 ${
                                        floorIndex === 0
                                          ? "bg-blue-500"
                                          : "bg-green-500"
                                      } rounded-full flex items-center justify-center mr-2 shadow-lg`}
                                    >
                                      <span className="text-white text-sm font-bold">
                                        {roomIndex + 1}
                                      </span>
                                    </div>
                                    <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent font-bold">
                                      {room.name}
                                    </span>
                                  </CardTitle>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      removeRoom(floor.id, room.id)
                                    }
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-8 h-8 p-0 shadow-sm hover:shadow-md transition-all"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>

                              <CardContent className="p-4 space-y-4">
                                {/* Current Reading */}
                                <div>
                                  <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                    <Zap className="h-4 w-4 mr-1 text-blue-500" />
                                    Current Reading{" "}
                                    <span className="text-red-500 ml-1">*</span>
                                  </Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={room.currentReading === 0 ? 0 : room.currentReading || ""}
                                    onChange={(e) =>
                                      updateRoom(
                                        floor.id,
                                        room.id,
                                        "currentReading",
                                        Number.parseInt(e.target.value) || 0
                                      )
                                    }
                                    placeholder="1150 (or 0)"
                                    className="text-center font-semibold"
                                    required
                                  />
                                </div>

                                {/* Sub Meter Units */}
                                <div>
                                  <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                    <div className="w-4 h-4 bg-green-500 rounded-full mr-1 flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">
                                        ⚡
                                      </span>
                                    </div>
                                    Sub Meter Units{" "}
                                    <span className="text-red-500 ml-1">*</span>
                                  </Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={room.currentReading === 0 ? 0 : room.currentReading || ""}
                                    onChange={(e) =>
                                      updateRoom(
                                        floor.id,
                                        room.id,
                                        "subMeterUnits",
                                        Number.parseInt(e.target.value) || 0
                                      )
                                    }
                                    placeholder="150 (or 0 if no sub meter)"
                                    className="text-center font-semibold"
                                    required
                                  />
                                </div>

                                {/* Units Display */}
                                {(room.currentReading > 0 ||
                                  room.subMeterUnits > 0) && (
                                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border-2 border-blue-200 mt-4">
                                    <div className="grid grid-cols-2 gap-3 text-center">
                                      <div>
                                        <p className="text-xs text-gray-600 mb-1">
                                          Current Reading
                                        </p>
                                        <p className="text-lg font-bold text-blue-600">
                                          {room.currentReading}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-600 mb-1">
                                          Units Consumed
                                        </p>
                                        <p className="text-lg font-bold text-green-600">
                                          {room.subMeterUnits}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              {getTotalRooms() > 0 && (
                <Card className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      Building Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                      <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="flex items-center justify-center mb-2">
                          <Home className="h-6 w-6 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-gray-600">
                            Total Rooms
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          {getTotalRooms()}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="flex items-center justify-center mb-2">
                          <Zap className="h-6 w-6 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-gray-600">
                            Total Sub Meter Units
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          {getTotalSubMeterUnits()}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="flex items-center justify-center mb-2">
                          <Building2 className="h-6 w-6 text-purple-600 mr-2" />
                          <span className="text-sm font-medium text-gray-600">
                            Remaining Units
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">
                          {Math.max(
                            0,
                            formData.totalUnits - getTotalSubMeterUnits()
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Help Text */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You can enter 0 for rooms without sub
                meters. WASA bill will be distributed equally among all rooms.
              </p>
            </div>

            {/* Calculate Button */}
            <div className="pt-6">
              <div className="max-w-2xl mx-auto">
                <Button
                  onClick={calculateBill}
                  disabled={!isFormValid()}
                  className={`w-full py-6 text-xl font-semibold rounded-xl shadow-lg transition-all duration-300 transform ${
                    isFormValid()
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
                  }`}
                  size="lg"
                >
                  <Calculator className="mr-3 h-7 w-7" />
                  {isFormValid()
                    ? "Calculate Ajmal House Bill"
                    : "Please fill all required fields"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
