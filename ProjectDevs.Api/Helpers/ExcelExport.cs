using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace ProjectDevs.Api.Helpers
{
    public static class ExcelExport
    {
        public static readonly string UIDomain = ConfigurationManager.AppSettings["UIDomain"];
        public static bool ExportSprintCloseStoryHoursReport(string FileName, List<ProjectSprintCloseResult> data)
        {
            try
            {
                using (var workbook = SpreadsheetDocument.Create(FileName, DocumentFormat.OpenXml.SpreadsheetDocumentType.Workbook))
                {
                    var workbookPart = workbook.AddWorkbookPart();
                    workbook.WorkbookPart.Workbook = new Workbook();
                    workbook.WorkbookPart.Workbook.Sheets = new Sheets();
                    var sheetPart = workbook.WorkbookPart.AddNewPart<WorksheetPart>();
                    var sheetData = new SheetData();
                    sheetPart.Worksheet = new Worksheet(sheetData);

                    Sheets sheets = workbook.WorkbookPart.Workbook.GetFirstChild<Sheets>();
                    string relationshipId = workbook.WorkbookPart.GetIdOfPart(sheetPart);

                    uint sheetId = 1;
                    if (sheets.Elements<Sheet>().Count() > 0)
                    {
                        sheetId = sheets.Elements<Sheet>().Select(s => s.SheetId.Value).Max() + 1;
                    }

                    Sheet sheet = new Sheet() { Id = relationshipId, SheetId = sheetId, Name = "Sprint Close Story Hours Report" };
                    sheets.Append(sheet);

                    Row headerRow = new Row();

                    List<String> columns = new List<string>();
                    AddColumn(headerRow, columns, "First Name", CellValues.String);
                    AddColumn(headerRow, columns, "Story", CellValues.String);
                    AddColumn(headerRow, columns, "Start Date", CellValues.String);
                    AddColumn(headerRow, columns, "End Date", CellValues.String);
                    AddColumn(headerRow, columns, "As a", CellValues.String);
                    AddColumn(headerRow, columns, "I want to", CellValues.String);
                    AddColumn(headerRow, columns, "So I Can", CellValues.String);
                    AddColumn(headerRow, columns, "Task Name", CellValues.String);
                    AddColumn(headerRow, columns, "Projected Hours", CellValues.String);
                    AddColumn(headerRow, columns, "Hours Worked", CellValues.String);
                    AddColumn(headerRow, columns, "Total Actual Hours", CellValues.String);

                    sheetData.AppendChild(headerRow);

                    foreach (var d in data)
                    {
                        Row newRow = new Row();

                        Cell cell1 = new Cell();
                        cell1.DataType = CellValues.String;
                        cell1.CellValue = new CellValue(d.FirstName);
                        newRow.AppendChild(cell1);

                        Cell cell2 = new Cell();
                        cell2.DataType = CellValues.String;
                        cell2.CellValue = new CellValue(d.StoryName);
                        newRow.AppendChild(cell2);

                        if (d.StartDate.HasValue && d.StartDate != DateTime.MinValue)
                        {
                            Cell cell3 = new Cell();
                            cell3.DataType = CellValues.String;
                            cell3.CellValue = new CellValue(string.Format("{0:yyyy-MM-dd}", d.StartDate.Value));
                            newRow.AppendChild(cell3);
                        }
                        else
                        {
                            Cell cell3 = new Cell();
                            cell3.DataType = CellValues.String;
                            cell3.CellValue = new CellValue("");
                            newRow.AppendChild(cell3);
                        }

                        if (d.EndDate.HasValue && d.EndDate != DateTime.MinValue)
                        {
                            Cell cell4 = new Cell();
                            cell4.DataType = CellValues.String;
                            cell4.CellValue = new CellValue(string.Format("{0:yyyy-MM-dd}", d.EndDate.Value));
                            newRow.AppendChild(cell4);
                        }
                        else
                        {
                            Cell cell4 = new Cell();
                            cell4.DataType = CellValues.String;
                            cell4.CellValue = new CellValue("");
                            newRow.AppendChild(cell4);
                        }

                        Cell cell5 = new Cell();
                        cell5.DataType = CellValues.String;
                        cell5.CellValue = new CellValue(string.IsNullOrEmpty(d.F1) ? "" : d.F1);
                        newRow.AppendChild(cell5);

                        Cell cell6 = new Cell();
                        cell6.DataType = CellValues.String;
                        cell6.CellValue = new CellValue(string.IsNullOrEmpty(d.F2) ? "" : d.F2);
                        newRow.AppendChild(cell6);

                        Cell cell7 = new Cell();
                        cell7.DataType = CellValues.String;
                        cell7.CellValue = new CellValue(string.IsNullOrEmpty(d.F3) ? "" : d.F3);
                        newRow.AppendChild(cell7);

                        Cell cell8 = new Cell();
                        cell8.DataType = CellValues.String;
                        cell8.CellValue = new CellValue(string.IsNullOrEmpty(d.TaskName) ? "" : d.TaskName);
                        newRow.AppendChild(cell8);

                        Cell cell9 = new Cell();
                        cell9.DataType = CellValues.Number;
                        cell9.CellValue = new CellValue(d.ProjectedHours.ToString());
                        newRow.AppendChild(cell9);

                        Cell cell10 = new Cell();
                        cell10.DataType = CellValues.Number;
                        cell10.CellValue = new CellValue(d.HoursWorked.ToString());
                        newRow.AppendChild(cell10);

                        Cell cell11 = new Cell();
                        cell11.DataType = CellValues.Number;
                        cell11.CellValue = new CellValue(d.TotalActualHours.ToString());
                        newRow.AppendChild(cell11);

                        sheetData.AppendChild(newRow);
                    }

                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static bool ExportProductionSupportReport(string FileName, List<ProjectStoriesReportDataResult> data)
        {
            try
            {
                using (var workbook = SpreadsheetDocument.Create(FileName, DocumentFormat.OpenXml.SpreadsheetDocumentType.Workbook))
                {
                    var workbookPart = workbook.AddWorkbookPart();
                    workbook.WorkbookPart.Workbook = new Workbook();
                    workbook.WorkbookPart.Workbook.Sheets = new Sheets();
                    var sheetPart = workbook.WorkbookPart.AddNewPart<WorksheetPart>();
                    var sheetData = new SheetData();
                    sheetPart.Worksheet = new Worksheet(sheetData);

                    Sheets sheets = workbook.WorkbookPart.Workbook.GetFirstChild<Sheets>();
                    string relationshipId = workbook.WorkbookPart.GetIdOfPart(sheetPart);

                    uint sheetId = 1;
                    if (sheets.Elements<Sheet>().Count() > 0)
                    {
                        sheetId = sheets.Elements<Sheet>().Select(s => s.SheetId.Value).Max() + 1;
                    }

                    Sheet sheet = new Sheet() { Id = relationshipId, SheetId = sheetId, Name = "Production Support Report" };
                    sheets.Append(sheet);

                    Row headerRow = new Row();

                    List<String> columns = new List<string>();

                    AddColumn(headerRow, columns, "Story ID", CellValues.String);                   
                    AddColumn(headerRow, columns, "As a", CellValues.String);
                    AddColumn(headerRow, columns, "I want to", CellValues.String);
                    AddColumn(headerRow, columns, "So I Can", CellValues.String);
                    AddColumn(headerRow, columns, "Acceptance Criteria", CellValues.String);
                    AddColumn(headerRow, columns, "Note", CellValues.String);
                    AddColumn(headerRow, columns, "Requester", CellValues.String);
                    AddColumn(headerRow, columns, "Assigned To", CellValues.String);
                    AddColumn(headerRow, columns, "Status", CellValues.String);
                    AddColumn(headerRow, columns, "Request Date", CellValues.String);
                    AddColumn(headerRow, columns, "Start Date", CellValues.String);
                    AddColumn(headerRow, columns, "End Date", CellValues.String);                    
                    sheetData.AppendChild(headerRow);

                    foreach (var d in data)
                    {
                        Row newRow = new Row();

                        Cell cell1 = new Cell();
                        cell1.DataType = CellValues.String;
                        cell1.CellValue = new CellValue(d.StoryId);
                        newRow.AppendChild(cell1);                        

                        Cell cell2 = new Cell();
                        cell2.DataType = CellValues.String;
                        cell2.CellValue = new CellValue(string.IsNullOrEmpty(d.F1) ? "" : d.F1);
                        newRow.AppendChild(cell2);


                        Cell cell3 = new Cell();
                        cell3.DataType = CellValues.String;
                        cell3.CellValue = new CellValue(string.IsNullOrEmpty(d.F2) ? "" : d.F2);
                        newRow.AppendChild(cell3);

                        Cell cell4 = new Cell();
                        cell4.DataType = CellValues.String;
                        cell4.CellValue = new CellValue(string.IsNullOrEmpty(d.F3) ? "" : d.F3);
                        newRow.AppendChild(cell4);

                        Cell cell5 = new Cell();
                        cell5.DataType = CellValues.String;
                        cell5.CellValue = new CellValue(string.IsNullOrEmpty(d.AcceptanceCriteria) ? "" : d.AcceptanceCriteria);
                        newRow.AppendChild(cell5);

                        Cell cell6 = new Cell();
                        cell6.DataType = CellValues.String;
                        cell6.CellValue = new CellValue(string.IsNullOrEmpty(d.Note) ? "" : d.Note);
                        newRow.AppendChild(cell6);

                        Cell cell7 = new Cell();
                        cell7.DataType = CellValues.String;
                        cell7.CellValue = new CellValue(d.RequesterName);
                        newRow.AppendChild(cell7);

                        Cell cell8 = new Cell();
                        cell8.DataType = CellValues.String;
                        cell8.CellValue = new CellValue(d.AssignedToName);
                        newRow.AppendChild(cell8);

                        Cell cell9 = new Cell();
                        cell9.DataType = CellValues.String;
                        cell9.CellValue = new CellValue(d.StoryStatusName);
                        newRow.AppendChild(cell9);


                        if (d.RequestDate.HasValue && d.RequestDate != DateTime.MinValue)
                        {
                            Cell cell10 = new Cell();
                            cell10.DataType = CellValues.String;
                            cell10.CellValue = new CellValue(string.Format("{0:yyyy-MM-dd}", d.RequestDate.Value));
                            newRow.AppendChild(cell10);
                        }
                        else
                        {
                            Cell cell10 = new Cell();
                            cell10.DataType = CellValues.String;
                            cell10.CellValue = new CellValue("");
                            newRow.AppendChild(cell10);
                        }

                        if (d.StartDate.HasValue && d.StartDate != DateTime.MinValue)
                        {
                            Cell cell11 = new Cell();
                            cell11.DataType = CellValues.String;
                            cell11.CellValue = new CellValue(string.Format("{0:yyyy-MM-dd}", d.StartDate.Value));
                            newRow.AppendChild(cell11);
                        }
                        else
                        {
                            Cell cell11 = new Cell();
                            cell11.DataType = CellValues.String;
                            cell11.CellValue = new CellValue("");
                            newRow.AppendChild(cell11);
                        }

                        if (d.EndDate.HasValue && d.EndDate != DateTime.MinValue)
                        {
                            Cell cell12 = new Cell();
                            cell12.DataType = CellValues.String;
                            cell12.CellValue = new CellValue(string.Format("{0:yyyy-MM-dd}", d.EndDate.Value));
                            newRow.AppendChild(cell12);
                        }
                        else
                        {
                            Cell cell12 = new Cell();
                            cell12.DataType = CellValues.String;
                            cell12.CellValue = new CellValue("");
                            newRow.AppendChild(cell12);
                        }

                        sheetData.AppendChild(newRow);
                    }

                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static bool ExportProductionReleaseReport(string FileName, List<ProductionReleaseReportDataResult> data)
        {
            try
            {
                using (var workbook = SpreadsheetDocument.Create(FileName, DocumentFormat.OpenXml.SpreadsheetDocumentType.Workbook))
                {
                    var workbookPart = workbook.AddWorkbookPart();
                    workbook.WorkbookPart.Workbook = new Workbook();
                    workbook.WorkbookPart.Workbook.Sheets = new Sheets();
                    var sheetPart = workbook.WorkbookPart.AddNewPart<WorksheetPart>();
                    var sheetData = new SheetData();
                    sheetPart.Worksheet = new Worksheet(sheetData);

                    Sheets sheets = workbook.WorkbookPart.Workbook.GetFirstChild<Sheets>();
                    string relationshipId = workbook.WorkbookPart.GetIdOfPart(sheetPart);

                    uint sheetId = 1;
                    if (sheets.Elements<Sheet>().Count() > 0)
                    {
                        sheetId = sheets.Elements<Sheet>().Select(s => s.SheetId.Value).Max() + 1;
                    }

                    Sheet sheet = new Sheet() { Id = relationshipId, SheetId = sheetId, Name = "Production Release Report" };
                    sheets.Append(sheet);

                    Row headerRow = new Row();

                    List<String> columns = new List<string>();
                    AddColumn(headerRow, columns, "Project", CellValues.String);
                    AddColumn(headerRow, columns, "Story ID", CellValues.String);
                    AddColumn(headerRow, columns, "As a", CellValues.String);
                    AddColumn(headerRow, columns, "I want to", CellValues.String);
                    AddColumn(headerRow, columns, "So I Can", CellValues.String);
                    AddColumn(headerRow, columns, "Acceptance Criteria", CellValues.String);
                    AddColumn(headerRow, columns, "Note", CellValues.String);
                    AddColumn(headerRow, columns, "Requester", CellValues.String);
                    AddColumn(headerRow, columns, "Assigned To", CellValues.String);
                    AddColumn(headerRow, columns, "Status", CellValues.String);
                    AddColumn(headerRow, columns, "Request Date", CellValues.String);
                    AddColumn(headerRow, columns, "Start Date", CellValues.String);
                    AddColumn(headerRow, columns, "End Date", CellValues.String);
                    sheetData.AppendChild(headerRow);

                    foreach (var d in data)
                    {
                        Row newRow = new Row();

                        Cell cell0 = new Cell();
                        cell0.DataType = CellValues.String;
                        cell0.CellValue = new CellValue(d.ProjectName);
                        newRow.AppendChild(cell0);

                        Cell cell1 = new Cell();
                        cell1.DataType = CellValues.String;
                        cell1.CellValue = new CellValue(d.StoryName);
                        newRow.AppendChild(cell1);

                        Cell cell2 = new Cell();
                        cell2.DataType = CellValues.String;
                        cell2.CellValue = new CellValue(string.IsNullOrEmpty(d.F1) ? "" : d.F1);
                        newRow.AppendChild(cell2);


                        Cell cell3 = new Cell();
                        cell3.DataType = CellValues.String;
                        cell3.CellValue = new CellValue(string.IsNullOrEmpty(d.F2) ? "" : d.F2);
                        newRow.AppendChild(cell3);

                        Cell cell4 = new Cell();
                        cell4.DataType = CellValues.String;
                        cell4.CellValue = new CellValue(string.IsNullOrEmpty(d.F3) ? "" : d.F3);
                        newRow.AppendChild(cell4);

                        Cell cell5 = new Cell();
                        cell5.DataType = CellValues.String;
                        cell5.CellValue = new CellValue(string.IsNullOrEmpty(d.AcceptanceCriteria) ? "" : d.AcceptanceCriteria);
                        newRow.AppendChild(cell5);

                        Cell cell6 = new Cell();
                        cell6.DataType = CellValues.String;
                        cell6.CellValue = new CellValue(string.IsNullOrEmpty(d.Note) ? "" : d.Note);
                        newRow.AppendChild(cell6);

                        Cell cell7 = new Cell();
                        cell7.DataType = CellValues.String;
                        cell7.CellValue = new CellValue(d.RequesterName);
                        newRow.AppendChild(cell7);

                        Cell cell8 = new Cell();
                        cell8.DataType = CellValues.String;
                        cell8.CellValue = new CellValue(d.AssignedToName);
                        newRow.AppendChild(cell8);

                        Cell cell9 = new Cell();
                        cell9.DataType = CellValues.String;
                        cell9.CellValue = new CellValue(d.StoryStatusName);
                        newRow.AppendChild(cell9);


                        if (d.RequestDate.HasValue && d.RequestDate != DateTime.MinValue)
                        {
                            Cell cell10 = new Cell();
                            cell10.DataType = CellValues.String;
                            cell10.CellValue = new CellValue(string.Format("{0:yyyy-MM-dd}", d.RequestDate.Value));
                            newRow.AppendChild(cell10);
                        }
                        else
                        {
                            Cell cell10 = new Cell();
                            cell10.DataType = CellValues.String;
                            cell10.CellValue = new CellValue("");
                            newRow.AppendChild(cell10);
                        }

                        if (d.StartDate.HasValue && d.StartDate != DateTime.MinValue)
                        {
                            Cell cell11 = new Cell();
                            cell11.DataType = CellValues.String;
                            cell11.CellValue = new CellValue(string.Format("{0:yyyy-MM-dd}", d.StartDate.Value));
                            newRow.AppendChild(cell11);
                        }
                        else
                        {
                            Cell cell11 = new Cell();
                            cell11.DataType = CellValues.String;
                            cell11.CellValue = new CellValue("");
                            newRow.AppendChild(cell11);
                        }

                        if (d.EndDate.HasValue && d.EndDate != DateTime.MinValue)
                        {
                            Cell cell12 = new Cell();
                            cell12.DataType = CellValues.String;
                            cell12.CellValue = new CellValue(string.Format("{0:yyyy-MM-dd}", d.EndDate.Value));
                            newRow.AppendChild(cell12);
                        }
                        else
                        {
                            Cell cell12 = new Cell();
                            cell12.DataType = CellValues.String;
                            cell12.CellValue = new CellValue("");
                            newRow.AppendChild(cell12);
                        }

                        sheetData.AppendChild(newRow);
                    }

                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private static void AddColumn(Row headerRow, List<String> columns, string columnName, CellValues type)
        {
            columns.Add(columnName);
            Cell cell = new Cell();
            cell.DataType = type;
            cell.CellValue = new CellValue(columnName);
            headerRow.AppendChild(cell);
        }
    }
}
