"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DataService } from "@/lib/data-service"
import { Download, Upload, SettingsIcon, Database, Shield } from "lucide-react"

export default function Settings() {
  const [settings, setSettings] = useState({
    autoApproveJobs: false,
    emailNotifications: true,
    analyticsRetentionDays: 90,
  })
  const [importData, setImportData] = useState("")

  const handleExportData = () => {
    const data = DataService.exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `apm-jobs-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    if (!importData.trim()) {
      alert("Please paste the JSON data to import")
      return
    }

    try {
      const success = DataService.importData(importData)
      if (success) {
        alert("Data imported successfully!")
        setImportData("")
        window.location.reload()
      } else {
        alert("Failed to import data. Please check the format.")
      }
    } catch (error) {
      alert("Invalid JSON format")
    }
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("apm_jobs_data")
        localStorage.removeItem("apm_analytics_data")
        alert("All data cleared successfully!")
        window.location.reload()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your admin preferences and data</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-approve new jobs</Label>
              <p className="text-sm text-muted-foreground">
                Automatically approve new job submissions without manual review
              </p>
            </div>
            <Switch
              checked={settings.autoApproveJobs}
              onCheckedChange={(checked) => setSettings({ ...settings, autoApproveJobs: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email alerts for new job applications and updates</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retention">Analytics retention (days)</Label>
            <Input
              id="retention"
              type="number"
              value={settings.analyticsRetentionDays}
              onChange={(e) =>
                setSettings({ ...settings, analyticsRetentionDays: Number.parseInt(e.target.value) || 90 })
              }
              className="w-32"
            />
            <p className="text-sm text-muted-foreground">How long to keep analytics data before automatic cleanup</p>
          </div>

          <Button>Save Settings</Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Export Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download all your job postings and analytics data as a JSON file for backup or migration.
            </p>
            <Button onClick={handleExportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Import Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Import job postings and analytics data from a previously exported JSON file.
            </p>
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your JSON data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={6}
              />
              <Button onClick={handleImportData}>
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete all job postings and analytics data. This action cannot be undone.
            </p>
            <Button onClick={handleClearAllData} variant="destructive">
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
