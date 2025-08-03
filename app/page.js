"use client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, FileText, Download, Zap, Droplets, Building2, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="mb-8">
              <Building2 className="mx-auto h-16 w-16 text-blue-600 mb-4 animate-bounce" />
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6">Ajmal House</h1>
            <h2 className="text-2xl sm:text-4xl font-semibold text-blue-600 mb-6">Bill Calculator</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Effortlessly calculate and manage electricity and water bills for Ajmal House. Generate professional bills
              with detailed breakdowns and download them instantly in PDF format.
            </p>
            <Link href="/calculator">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-xl rounded-full shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Calculator className="mr-3 h-6 w-6" />
                Start Calculating
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Our Calculator?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your Ajmal House billing process with our comprehensive and user-friendly solution
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
            <CardHeader className="text-center p-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-gray-900 text-xl mb-4">Electricity Bills</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Calculate electricity charges based on units consumed and accurate meter readings with detailed
                floor-wise breakdown
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
            <CardHeader className="text-center p-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-gray-900 text-xl mb-4">Water Bills (WASA)</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Distribute water charges fairly among all Ajmal House partitions with transparent calculations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
            <CardHeader className="text-center p-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Download className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-gray-900 text-xl mb-4">PDF Download</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Generate and download professional bills in PDF format with detailed breakdowns and professional
                formatting
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <Users className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Multiple Floors</h3>
            <p className="text-gray-600">Ground & First Floor Management</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <TrendingUp className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Accurate</h3>
            <p className="text-gray-600">Precise Calculations</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <FileText className="mx-auto h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Professional</h3>
            <p className="text-gray-600">PDF Bill Generation</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 opacity-90">Calculate your Ajmal House bills in minutes, not hours</p>
          <Link href="/calculator">
            <Button
              size="lg"
              variant="secondary"
              className="px-10 py-4 text-xl rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <FileText className="mr-3 h-6 w-6" />
              Calculate Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">&copy; 2025 Ajmal House Bill Calculator. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Powered by Zaeem Khan</p>
        </div>
      </footer>
    </div>
  )
}
