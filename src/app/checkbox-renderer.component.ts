import { Component, OnDestroy } from '@angular/core';

import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'checkbox-renderer',
  template: `
    <input 
      type="checkbox" 
      (click)="checkedHandler($event)"
      [checked]="params.value"
    />
`,
})
export class CheckboxRenderer implements ICellRendererAngularComp, OnDestroy {
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  checkedHandler(event) {
      let checked = event.target.checked;
      let colId = this.params.column.colId;
      this.params.node.setDataValue(colId, checked);
  }
}
