import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

interface IBookingListImportItem {
  'Campaign Number': string;
  'External reference': string;
  'Sales Area Code': string;
  'Break Date': string;
  Length: string;
  Sequence: string;
  'Industry Code': string;
  'Copy Code': string;
  'Protected Copy': string;
  'Spot Number': string;
  Tolerance: string;
}

@Component({
  selector: 'my-app',
  template: `
    <ag-grid-angular
      #agGrid
      style="width: 100vw; height: 100vh;"
      id="myGrid"
      class="ag-theme-alpine"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [frameworkComponents]="frameworkComponents"
      [gridOptions]="gridOptions"
      (gridReady)="onGridReady($event)"
    ></ag-grid-angular>
  `,
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;

  private gridOptions;
  private columnDefs;
  private defaultColDef;
  private gridOptionsApi;
  private rowData: Array<any> = [];

  constructor() {
    this.defaultColDef = {};
    this.gridOptions = {
      columnDefs: [
        { field: 'Campaign Number' },
        { field: 'External reference' },
        { field: 'Sales Area Code' },
        { field: 'Break Date' },
        { field: 'Length' },
        { field: 'Sequence' },
        { field: 'Industry Code' },
        { field: 'Copy Code' },
        { field: 'Protected Copy' },
        { field: 'Spot Number' },
        { field: 'Tolerance' },
      ],
      defaultColDef: {
        flex: 1,
      },
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridOptionsApi = this.gridOptions.api;
    this.rowData = [];

    window.addEventListener('paste', (event) =>
      this.insertNewRows(event, this)
    );
  }

  insertNewRows(event, self) {
    var clipboardData = event.clipboardData || window.clipboardData;
    var pastedData = clipboardData.getData('Text');
    var dataArray: any[] = self.dataToArray(pastedData);

    console.log('data-array', dataArray);
    var newData: IBookingListImportItem[] =
      dataArray.map<IBookingListImportItem>((d) => ({
        'Campaign Number': d[0],
        'External reference': d[1],
        'Sales Area Code': d[2],
        'Break Date': d[3],
        Length: d[4],
        Sequence: d[5],
        'Industry Code': d[6],
        'Copy Code': d[7],
        'Protected Copy': d[8],
        'Spot Number': d[9],
        Tolerance: d[10],
      }));

    self.gridApi.applyTransaction({
      add: newData,
    });
  }

  addEmptyRow(rowIndex) {
    var newItem = {};
    this.gridApi.updateRowData({ add: [newItem], addIndex: rowIndex });
  }

  // From http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
  dataToArray(strData) {
    var delimiter = '\t'; //this.gridOptions.api.gridOptionsWrapper.getClipboardDeliminator()
    var objPattern = new RegExp(
      // Delimiters.
      '(\\' +
        delimiter +
        '|\\r?\\n|\\r|^)' +
        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        // Standard fields.
        '([^"\\' +
        delimiter +
        '\\r\\n]*))',
      'gi'
    );
    var arrData = [[]];
    var arrMatches = null;
    while ((arrMatches = objPattern.exec(strData))) {
      var strMatchedDelimiter = arrMatches[1];
      if (strMatchedDelimiter.length && strMatchedDelimiter !== delimiter) {
        arrData.push([]);
      }
      var strMatchedValue = void 0;
      if (arrMatches[2]) {
        strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
      } else {
        strMatchedValue = arrMatches[3];
      }
      arrData[arrData.length - 1].push(strMatchedValue);
    }
    return arrData;
  }
}
