"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Upload } from "lucide-react"

type SpreadsheetRow = {
  id: string
  name: string
  startStomps: number
  endStomps: number
  team: string
  gainedStomps: number
}

interface StompSpreadsheetProps {
  teams: string[]
  onImportPlayers: (players: Array<{ name: string; scoreBefore: number; scoreAfter: number; team: string }>) => void
}

export function StompSpreadsheet({ teams, onImportPlayers }: StompSpreadsheetProps) {
  const [rows, setRows] = useState<SpreadsheetRow[]>([])
  const [totals, setTotals] = useState({
    startStomps: 0,
    endStomps: 0,
    gainedStomps: 0,
  })

  // Initialize with an empty row
  useEffect(() => {
    if (rows.length === 0) {
      addRow()
    }
  }, [])

  // Calculate totals whenever rows change
  useEffect(() => {
    const newTotals = rows.reduce(
      (acc, row) => {
        return {
          startStomps: acc.startStomps + (row.startStomps || 0),
          endStomps: acc.endStomps + (row.endStomps || 0),
          gainedStomps: acc.gainedStomps + (row.gainedStomps || 0),
        }
      },
      { startStomps: 0, endStomps: 0, gainedStomps: 0 },
    )
    setTotals(newTotals)
  }, [rows])

  const addRow = () => {
    const newRow: SpreadsheetRow = {
      id: crypto.randomUUID(),
      name: "",
      startStomps: 0,
      endStomps: 0,
      team: teams[0] || "Team 1",
      gainedStomps: 0,
    }
    setRows([...rows, newRow])
  }

  const deleteRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const updateRow = (id: string, field: keyof SpreadsheetRow, value: any) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value }

          // Recalculate gained stomps if start or end stomps change
          if (field === "startStomps" || field === "endStomps") {
            updatedRow.gainedStomps = (updatedRow.endStomps || 0) - (updatedRow.startStomps || 0)
          }

          return updatedRow
        }
        return row
      }),
    )
  }

  const handleImport = () => {
    // Filter out incomplete rows
    const validRows = rows.filter((row) => row.name && row.endStomps >= row.startStomps)

    if (validRows.length === 0) {
      alert("No valid data to import. Please make sure all rows have names and valid stomp values.")
      return
    }

    // Convert to the format expected by the parent component
    const playersToImport = validRows.map((row) => ({
      name: row.name,
      scoreBefore: row.startStomps,
      scoreAfter: row.endStomps,
      team: row.team,
    }))

    onImportPlayers(playersToImport)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number) => {
    // Add a new row when pressing Tab on the last field of the last row
    if (e.key === "Tab" && !e.shiftKey && rowIndex === rows.length - 1) {
      const target = e.target as HTMLInputElement
      if (target.name === "team") {
        e.preventDefault()
        addRow()
      }
    }
  }

  return (
    <Card className="border-black/10 dark:border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stomp Spreadsheet</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4 mr-1" /> Add Row
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 border-green-200 dark:border-green-800"
          >
            <Upload className="h-4 w-4 mr-1" /> Import to Counter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5">
                <th className="p-2 text-left">Player Name</th>
                <th className="p-2 text-right">Start Stomps</th>
                <th className="p-2 text-right">End Stomps</th>
                <th className="p-2 text-right">Gained</th>
                <th className="p-2 text-left">Team</th>
                <th className="p-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="p-2">
                    <Input
                      name="name"
                      value={row.name}
                      onChange={(e) => updateRow(row.id, "name", e.target.value)}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                      placeholder="Player name"
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      name="startStomps"
                      type="number"
                      value={row.startStomps || ""}
                      onChange={(e) => updateRow(row.id, "startStomps", Number(e.target.value) || 0)}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm text-right"
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      name="endStomps"
                      type="number"
                      value={row.endStomps || ""}
                      onChange={(e) => updateRow(row.id, "endStomps", Number(e.target.value) || 0)}
                      className="bg-white/50 dark:bg-black/50 backdrop-blur-sm text-right"
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  </td>
                  <td className="p-2 text-right font-bold">{row.gainedStomps.toLocaleString()}</td>
                  <td className="p-2">
                    <Select name="team" value={row.team} onValueChange={(value) => updateRow(row.id, "team", value)}>
                      <SelectTrigger className="bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team} value={team}>
                            {team}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRow(row.id)}
                      className="h-8 w-8 text-red-500"
                      disabled={rows.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {/* Totals row */}
              <tr className="bg-black/5 dark:bg-white/5 font-bold">
                <td className="p-2">TOTALS</td>
                <td className="p-2 text-right">{totals.startStomps.toLocaleString()}</td>
                <td className="p-2 text-right">{totals.endStomps.toLocaleString()}</td>
                <td className="p-2 text-right">{totals.gainedStomps.toLocaleString()}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Press Tab to navigate between fields</li>
            <li>Tab from the last field adds a new row automatically</li>
            <li>Gained stomps are calculated automatically</li>
            <li>Click "Import to Counter" to add all valid rows to the main counter</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
