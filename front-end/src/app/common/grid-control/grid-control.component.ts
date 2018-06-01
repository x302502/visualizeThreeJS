import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import * as uuid from 'uuid';
import { GridOption, IGridColumnConfig } from './grid-control';
import { ModalService } from '../modal.service';
import { GridService } from './grid.service';
import { ExcelService } from '../../services/excel.service';
import { NotifyService } from '../../notify.service';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api-service/api.service';

@Component({
  selector: 'grid-control',
  templateUrl: './grid-control.component.html',
  styleUrls: ['./grid-control.component.css']
})
export class GridControlComponent implements OnInit {
  @Input() option = new GridOption();
  @Output() onImportExcel: EventEmitter<any> = new EventEmitter();
  @Output() onAddRow: EventEmitter<any> = new EventEmitter();
  @Output() onEditRow: EventEmitter<any> = new EventEmitter();
  @Output() onSaveRow: EventEmitter<any> = new EventEmitter();
  @Output() onCancelRow: EventEmitter<any> = new EventEmitter();
  @Output() onLoaded: EventEmitter<any> = new EventEmitter();

  gridOption: GridOption;
  orderBy: string;
  orderDirection: string;
  items: any[] = [];
  total: number;
  filter: any = {};
  pageNumber: number;
  numberOfPages: number[] = [5, 12, 24, 50, 100];
  pageSize: number = 12;
  currentPage: number = 1;
  @ViewChild('table') table: ElementRef;

  //Configure
  configModalId: string;
  columnConfigs: IGridColumnConfig[] = [];

  //Paginate
  pages: number[] = [1];
  pageCount: number = 5;
  totalPage: number = 1;
  constructor(private datePipe: DatePipe,
    private apiService: ApiService,
    private modalService: ModalService,
    private gridService: GridService,
    private excelService: ExcelService,
    private notifyService: NotifyService) { }


  ngOnInit() {
    // Gán id cho popup thiết lập grid
    this.configModalId = uuid.v4();
    // Generate grid option
    this.generateOption();
    // Load data for grid
    this.reload();
  }

  ngAfterViewInit() {
    // Fix height grid 
    this.resize();
  }

  reload() {
    if (this.gridOption.type === 'default') {
      let filter = this.generateFilterDefault();
      this.apiService.post(this.gridOption.url, {
        'filter': JSON.stringify({
          'fields': {}, 'where': $.extend({}, filter.field),
          'skip': filter.skip,
          'limit': filter.limit,
          'order': this.orderBy ? this.orderBy + " " + this.orderDirection : null
        })
      }).then(response => {
        this.items = response.json().res;
        this.total = response.json().total;
        // Generate phân trang dựa vào items và total
        this.onLoaded.emit(response.json());
        this.generatePaginate();
      });
    } else {
      let filter = this.generateFilterCustom();
      this.apiService.post(this.gridOption.url, filter).then(response => {
        this.items = response.json().res;
        this.total = response.json().total;
        // Generate phân trang dựa vào items và total
        this.onLoaded.emit(response.json());
        this.generatePaginate();
      });
    }
  }

  private generateFilterDefault() {
    let skip = (this.currentPage - 1) * this.pageSize;
    if (skip < 0) skip = 0;
    let limit = this.pageSize;
    let field: Object;
    if (this.gridOption.customFilter) {
      // Nếu custom filter là object 
      if (this.gridOption.customFilter instanceof Object) {
        field = $.extend(field, this.gridOption.customFilter);
      }
      // Nếu custom filter là function thì call function đó
      if (this.gridOption.customFilter instanceof Function) {
        field = $.extend(field, this.gridOption.customFilter());
      }
    }
    this.gridOption.columns.forEach(column => {
      if (this.filter[column.field]) {
        if (column.type === 'string') {
          let columnFilter = {};
          columnFilter[column.field] = { like: `%${this.filter[column.field].trim()}%` };
          Object.assign(field, columnFilter);
        }
        else if (column.type === 'number') {
          let columnFilter = {};
          let value = parseFloat(this.filter[column.field].trim().replace('>=', '').replace('<=', '').replace('>', '').replace('<', ''));
          if (this.filter[column.field].indexOf('>=') > -1) {
            columnFilter[column.field] = { gte: value };
          } else if (this.filter[column.field].indexOf('<=') > -1) {
            columnFilter[column.field] = { lte: value };
          } else if (this.filter[column.field].indexOf('>') > -1) {
            columnFilter[column.field] = { gt: value };
          } else if (this.filter[column.field].indexOf('<') > -1) {
            columnFilter[column.field] = { lt: value };
          } else columnFilter[column.field] = value;
          Object.assign(field, columnFilter);
        } else if (column.type === 'bool') {
          let columnFilter = {};
          if (this.filter[column.field] || this.filter[column.field] === '0') {
            columnFilter[column.field] = { like: this.filter[column.field] };
            Object.assign(field, columnFilter);
          }
        }
      }
    });
    return { field, skip, limit };
  }

  private generateFilterCustom() {
    let whereClause: string;
    if (this.gridOption.customFilter) {
      // Nếu custom filter là object 
      if (typeof (this.gridOption.customFilter) === 'string') {
        whereClause = this.gridOption.customFilter;
      }
      // Nếu custom filter là function thì call function đó
      if (this.gridOption.customFilter instanceof Function) {
        whereClause = this.gridOption.customFilter();
      }
    } else {
      whereClause = '1>0';
    }
    this.gridOption.columns.forEach(column => {
      if (this.filter[column.field]) {
        if (column.type === 'string') {
          whereClause += ` AND ${column.field} LIKE '%${this.filter[column.field].trim()}%'`;
        }
        else if (column.type === 'number') {
          let columnFilter = {};
          let value = parseFloat(this.filter[column.field].trim().replace('>=', '').replace('<=', '').replace('>', '').replace('<', ''));
          if (this.filter[column.field].indexOf('>=') > -1) {
            whereClause += ` AND ${column.field} >= ${value}`;
          } else if (this.filter[column.field].indexOf('<=') > -1) {
            whereClause += ` AND ${column.field} <= ${value}`;
          } else if (this.filter[column.field].indexOf('>') > -1) {
            whereClause += ` AND ${column.field} > ${value}`;
          } else if (this.filter[column.field].indexOf('<') > -1) {
            whereClause += ` AND ${column.field} < ${value}`;
          } else whereClause += ` AND ${column.field} = ${value}`;
        } else if (column.type === 'bool') {
          // if (this.filter[column.field] || this.filter[column.field] === '0') {
          //   columnFilter[column.field] = { like: this.filter[column.field] };
          //   Object.assign(field, columnFilter);
          // }
        } else if (column.type === 'date' || column.type === 'datetime') {
          let date = new Date(this.filter[column.field]);
          date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
          let fromDate = this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
          date.setDate(date.getDate() + 1);
          let toDate = this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
          whereClause += ` AND ${column.field} >= '${fromDate}' AND ${column.field} < '${toDate}'`;
        } else if (column.type === 'values') {
          if (this.filter[column.field] !== '') whereClause += ` AND ${column.field} = '${this.filter[column.field].trim()}'`;
        }
      }
    });
    return {
      whereClause,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection,
      page: +this.currentPage || 1,
      pageSize: +this.pageSize
    };
  }

  selectPage(selectedPage) {
    let page = +selectedPage;
    if (this.currentPage !== page && page > 0 && page <= this.totalPage) {
      this.currentPage = page;
      this.reload();
    }
  }

  private generateOption() {
    delete this.gridOption;
    this.gridOption = this.option.clone();
    this.gridOption.columns = [];
    if (this.gridOption.key) {
      let key = this.gridOption.key;
      if (!this.gridService.check(key)) {
        let columns: IGridColumnConfig[] = [];
        this.option.columns.forEach((column, index) => {
          columns.push({
            originColumn: $.extend({}, column),
            order: index,
            isHidden: false
          });
        });
        this.gridService.set(key, columns);
      } else {
        let columns = this.gridService.get(key);
        columns.forEach((column, index) => {
          let originColumn = this.option.columns.find(e => e.field === column.originColumn.field);
          if (originColumn) {
            column.originColumn = originColumn;
          }
        });
        this.gridService.set(key, columns);
      }

      this.columnConfigs = this.gridService.get(key);
      this.columnConfigs.forEach(column => {
        if (!column.isHidden) {
          this.filter[column.originColumn.field] = '';
          this.gridOption.columns.push({
            field: column.originColumn.field,
            type: column.originColumn.type,
            format: column.originColumn.format,
            title: column.title || column.originColumn.title,
            width: column.width || column.originColumn.width,
            // properties for boolean type
            trueValue: column.originColumn.trueValue,
            falseValue: column.originColumn.falseValue,
            // properties for values type
            values: column.originColumn.values
          });
        }
      })

    } else {
      this.gridOption.columns = $.extend([], this.option.columns);
    }
  }

  private generatePaginate() {
    this.pages = [];
    this.totalPage = Math.trunc(this.total / this.pageSize) + (this.total % this.pageSize === 0 ? 0 : 1);
    if (this.currentPage > this.totalPage) this.currentPage = this.totalPage;
    if (this.totalPage <= this.pageCount) {
      for (let i = 1; i <= this.totalPage; i++) this.pages.push(i);
    } else {
      if (this.currentPage < 3) this.pages = [1, 2, 3, 4, 5];
      else if (this.currentPage > this.totalPage - 2) this.pages = [this.totalPage - 4, this.totalPage - 3, this.totalPage - 2, this.totalPage - 1, this.totalPage];
      else this.pages = [this.currentPage - 2, this.currentPage - 1, this.currentPage, this.currentPage + 1, this.currentPage + 2];
    }
  }

  getItems() {
    return this.items;
  }

  //#region Checkable
  isCheckedAll: boolean = false;
  getSelectedItems() {
    return this.items.filter(item => item.isChecked);
  }

  check(item: any) {
    this.isCheckedAll = this.items.length === this.items.filter(item => item.isChecked).length;
  }

  checkAll(isCheckedAll: boolean) {
    this.items.forEach(item => item.isChecked = this.isCheckedAll);
  }

  //#endregion

  //#region Editable
  addRow() {
    this.items.push({});
    this.onAddRow.emit(this.items[this.items.length - 1]);
  }

  editRow(item) {
    item.data_row_temp = Object.assign({}, item);
    item.isEditing = true;
    this.onEditRow.emit(item);
  }

  saveRow(item) {
    item.isEditing = false;
    this.onSaveRow.emit(item);
  }

  cancelRow(item) {
    Object.assign(item, item.data_row_temp);
    item.isEditing = false;
    this.onCancelRow.emit(item);
  }
  //#endregion

  //#region Sort
  private sort(field: string) {
    if (this.orderBy === field) {
      this.orderDirection = this.orderDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.orderBy = field;
      this.orderDirection = 'ASC';
    }
    this.reload();
  }
  //#endregion

  // Resize grid fix to browser
  private resize() {
    if (this.gridOption.height) {
      $(this.table.nativeElement).height(this.gridOption.height);
    } else {
      $(this.table.nativeElement).height(`calc(100vh - 51px)`);
      setTimeout(() => {
        let top = $(this.table.nativeElement).offset().top;
        $(this.table.nativeElement).height(`calc(100vh - ${top + 55}px)`);
      }, 500);
    }
  }

  private loadGridConfig() {
    // this.gridService.get()
  }

  //#region Import, Export, Config

  importExcel() {
    this.excelService.import().then((lines: any[]) => {
      let records = lines.map(line => {
        let record = {};
        this.gridOption.columns.forEach(column => {
          record[column.field] = line[column.title];
          if (column.type === 'number') record[column.field] = record[column.field] || 0;
          else if (column.type === 'bool') record[column.field] = record[column.field].toString().toLowerCase() === "true" ? true : false;
          else if (column.type === 'string') record[column.field] = record[column.field] || '';
        });
        return record;
      });
      this.onImportExcel.emit(records);
    });
  }

  exportExcel() {
    if (this.items && this.items.length > 0) {
      let data = this.items.map(item => {
        let obj = {};
        this.gridOption.columns.forEach(column => {
          obj[column.title] = item[column.field];
        });
        return obj;
      });
      this.excelService.export({
        data: data
      });
    } else {
      this.notifyService.warning('No data to export');
    }
  }

  resetConfig() {
    let key = this.gridOption.key;
    let columns: IGridColumnConfig[] = [];
    this.option.columns.forEach((column, index) => {
      columns.push({
        originColumn: $.extend({}, column),
        order: index,
        isHidden: false
      });
    });
    this.gridService.set(key, columns);
    this.generateOption();
    this.modalService.close(this.configModalId);
  }

  saveModalConfig() {
    let key = this.gridOption.key;
    this.gridService.set(key, this.columnConfigs);
    this.generateOption();
    this.modalService.close(this.configModalId);
  }

  openModalConfig() {
    this.modalService.open(this.configModalId);
  }

  closeModalConfig() {
    this.modalService.close(this.configModalId);
  }

  //#endregion

  selectRow(item) {
    if (this.gridOption.onSelectRow) this.gridOption.onSelectRow(item);
  }
}
