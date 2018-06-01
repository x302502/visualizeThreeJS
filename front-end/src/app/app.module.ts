import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { Ng2CompleterModule } from "ng2-completer";
import { NgxPaginationModule } from 'ngx-pagination';

import { AppServices } from './app.services';
import { NotifyService } from './notify.service';
import { PasteService } from './paste.service';
import { DnDService } from './dnd.service';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './not-found.component';

import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { LotUpdateComponent } from './components/lot-update/lot-update.component';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { Daterangepicker } from 'ng2-daterangepicker';
import { PopupLocationComponent } from './common/popup-location/popup-location.component';
import { PopupSKUComponent } from './common/popup-sku/popup-sku.component';
import { PopupCheckinComponent } from './common/popup-checkin/popup-checkin.component';
import { ModalService } from './common/modal.service';
import { ModalComponent } from './common/modal.component';
import { ScheduleControlComponent } from './common/schedule-control/schedule-control.component';
import { DemoScheduleComponent } from './demo/demo-schedule/demo-schedule.component';
import { PopupZoneComponent } from './common/popup-zone/popup-zone.component';
import { PopupPackComponent } from './common/popup-pack/popup-pack.component';
import { PopupAllocateStrategyComponent } from './common/popup-allocate-strategy/popup-allocate-strategy.component';
import { PopupPutawayStrategyComponent } from './common/popup-putaway-strategy/popup-putaway-strategy.component';
import { DemoNotifyComponent } from './demo/demo-notify/demo-notify.component';
import { DemoDynamicLoaderComponent } from './demo/demo-dynamic-loader/demo-dynamic-loader.component';
import { DynamicComponentNo1Component } from './demo/demo-dynamic-loader/dynamic-component-no1/dynamic-component-no1.component';
import { DynamicComponentNo2Component } from './demo/demo-dynamic-loader/dynamic-component-no2/dynamic-component-no2.component';
import { DynamicComponentNo3Component } from './demo/demo-dynamic-loader/dynamic-component-no3/dynamic-component-no3.component';
import { DynamicLoaderDirective } from './common/dynamic-loader/dynamic-loader.directive';
import { DemoDynamicLoaderService } from './demo/demo-dynamic-loader/demo-dynamic-loader.service';
import { MainComponent } from './components/main/main.component';
import { GridControlComponent } from './common/grid-control/grid-control.component';
import { ItemListComponent } from './components/item/item-list.component';
import { ItemDetailComponent } from './components/item/item-detail.component';
import { SocketService } from './services/socket.service';
import { GridService } from './common/grid-control/grid.service';
import { MoveComponent } from './components/move/move.component';
import { CustomerListComponent } from './components/customer/customer-list.component';
import { CustomerDetailComponent } from './components/customer/customer-detail.component';
import { CustomergroupListComponent } from './components/customergroup/customergroup-list.component';
import { CustomergroupDetailComponent } from './components/customergroup/customergroup-detail.component';
import { PackListComponent } from './components/pack/pack-list.component';
import { PackDetailComponent } from './components/pack/pack-detail.component';
import { ExcelService } from './services/excel.service';
import { ZoneListComponent } from './components/zone/zone-list.component';
import { ZoneDetailComponent } from './components/zone/zone-detail.component';
import { LocationListComponent } from './components/location/location-list.component';
import { LocationDetailComponent } from './components/location/location-detail.component';
import { AllocateListComponent } from './components/allocate/allocate-list.component';
import { AllocateDetailComponent } from './components/allocate/allocate-detail.component';
import { PutawayListComponent } from './components/putaway/putaway-list.component';
import { PutawayDetailComponent } from './components/putaway/putaway-detail.component';
import { SystemCodeListComponent } from './components/system-code/system-code-list.component';
import { ReceiptListComponent } from './components/receipt/receipt-list.component';
import { AdjustmentListComponent } from './components/adjustment/adjustment-list.component';
import { BomListComponent } from './components/bom/bom-list.component';
import { CarrierListComponent } from './components/carrier/carrier-list.component';
import { CarrierDetailComponent } from './components/carrier/carrier-detail.component';
import { ChangeStatusListComponent } from './components/change-status/change-status-list.component';
import { ChargeListComponent } from './components/charge/charge-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HelperListComponent } from './components/helper/helper-list.component';
import { InboundReportListComponent } from './components/inbound-report/inbound-report-list.component';
import { InternalTransferListComponent } from './components/internal-transfer/internal-transfer-list.component';
import { LineListComponent } from './components/line/line-list.component';
import { LineDetailComponent } from './components/line/line-detail.component';
import { OutboundReportListComponent } from './components/outbound-report/outbound-report-list.component';
import { PostStockListComponent } from './components/post-stock/post-stock-list.component';
import { PremoveListComponent } from './components/premove/premove-list.component';
import { ShipmentListComponent } from './components/shipment/shipment-list.component';
import { StockListComponent } from './components/stock/stock-list.component';
import { SupplierListComponent } from './components/supplier/supplier-list.component';
import { SupplierDetailComponent } from './components/supplier/supplier-detail.component';
import { TransactionListComponent } from './components/transaction/transaction-list.component';
import { ViewhelperListComponent } from './components/viewhelper/viewhelper-list.component';
import { DockAsnComponent } from './components/dock-asn/dock-asn.component';
import { TariffListComponent } from './components/tariff/tariff-list.component';
import { ChargeTypeListComponent } from './components/charge-type/charge-type-list.component';
import { SystemCodeDetailComponent } from './components/system-code/system-code-detail.component';
import { BomDetailComponent } from './components/bom/bom-detail.component';
import { HelperDetailComponent } from './components/helper/helper-detail.component';
import { PopupUomComponent } from './common/popup-uom/popup-uom.component';
import { TaskdetailListComponent } from './components/taskdetail/taskdetail-list.component';
import { ConfigService } from './services/config-service/config.service';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { LanguageService } from './services/language-service/language.service';
import { AllocatemanualComponent } from './components/allocatemanual/allocatemanual.component';
import { DemoChartComponent } from './demo/demo-chart/demo-chart.component';
import { LoginComponent } from './components/login/login.component';
import { PieChartComponent } from './common/chart-control/pie-chart/pie-chart.component';
import { PopupAsnComponent } from './common/popup-asn/popup-asn.component';
import { DockSoComponent } from './components/dock-so/dock-so.component';
import { BarChartComponent } from './common/chart-control/bar-chart/bar-chart.component';
import { LineChartControl } from './common/chart-control/line-chart/line-chart.component';
import { DropidComponent } from './components/dropid/dropid.component';
import { ReportService } from './services/report.service';
import { CheckInListComponent } from './components/check-in/check-in-list.component';
import { CheckinDetailComponent } from './components/check-in/check-in-detail.component';
import { LoadingService } from './services/loading-service/loading.service';
import { WidgetControlComponent } from './common/widget-control/widget-control.component';
import { VisualizeComponent } from './components/visualize/visualize.component';
import { UtilityService } from './services/utility-service/utility.service';
import { JSONtoDictionaryPipe } from './pipes/JSONtoDictionary.pipe';
import { InventoyReportComponent } from './components/inventoy-report/inventoy-report.component';
import { DoughnutChartControl } from './common/chart-control/doughnut-chart/doughnut-chart.component';
import { DatePickerControl } from './common/date-picker-control/date-picker.control';
import { AuthService } from './services/auth-service/auth.service';
import { ApiService } from './services/api-service/api.service';
import { AuthManager } from './services/auth-service/auth.manager';
import { ReceiptDetailComponent } from './components/receipt/receipt-detail.component';
import { PopupShipcodeComponent } from './common/popup-shipcode/popup-shipcode.component';
import { NewwarehouseComponent } from './components/newwarehouse/newwarehouse.component';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { PoupVisualizeComponent } from './components/visualize/poup-visualize/poup-visualize.component';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  decimal: ".",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: ",",

};

const appRoutes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent, canActivate: [AuthManager] },
  { path: 'login', component: LoginComponent },
  { path: 'demo-schedule', component: DemoScheduleComponent },
  { path: 'demo-chart', component: DemoChartComponent },
  { path: 'demo-notify', component: DemoNotifyComponent },
  { path: 'demo-dynamic-loader', component: DemoDynamicLoaderComponent },
  { path: 'dock-asn', component: DockAsnComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    DoughnutChartControl,
    LineChartControl,
    DatePickerControl,
    JSONtoDictionaryPipe,
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    DashboardComponent,
    InventoryListComponent,
    MoveComponent,
    LotUpdateComponent,
    TaskdetailListComponent,
    AllocatemanualComponent,
    ModalComponent,
    PopupLocationComponent,
    ScheduleControlComponent,
    DemoScheduleComponent,
    PopupSKUComponent,
    PopupShipcodeComponent,
    PopupCheckinComponent,
    PopupZoneComponent,
    PopupPutawayStrategyComponent,
    PopupAllocateStrategyComponent,
    PopupPackComponent,
    DemoNotifyComponent,
    DemoDynamicLoaderComponent,
    DynamicComponentNo1Component,
    DynamicComponentNo2Component,
    DynamicComponentNo3Component,
    DynamicLoaderDirective,
    MainComponent,
    GridControlComponent,
    ItemListComponent,
    ItemDetailComponent,
    ZoneListComponent,
    ZoneDetailComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    LocationListComponent,
    LocationDetailComponent,
    DockAsnComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    CustomergroupListComponent,
    CustomergroupDetailComponent,
    PackListComponent,
    PackDetailComponent,
    AllocateListComponent,
    AllocateDetailComponent,
    PutawayListComponent,
    PutawayDetailComponent,
    SystemCodeListComponent,
    ReceiptListComponent,
    ReceiptDetailComponent,
    AdjustmentListComponent,
    BomListComponent,
    BomDetailComponent,
    CarrierListComponent,
    CarrierDetailComponent,
    ChangeStatusListComponent,
    ChargeListComponent,
    HelperListComponent,
    HelperDetailComponent,
    InboundReportListComponent,
    InternalTransferListComponent,
    LineListComponent,
    LineDetailComponent,
    OutboundReportListComponent,
    PostStockListComponent,
    PremoveListComponent,
    ShipmentListComponent,
    StockListComponent,
    SupplierListComponent,
    SupplierDetailComponent,
    TransactionListComponent,
    ViewhelperListComponent,
    TariffListComponent,
    ChargeTypeListComponent,
    SystemCodeDetailComponent,
    PopupUomComponent,
    DemoChartComponent,
    PieChartComponent,
    BarChartComponent,
    PopupAsnComponent,
    DockSoComponent,
    DropidComponent,
    CheckInListComponent,
    CheckinDetailComponent,
    WidgetControlComponent,
    VisualizeComponent,
    InventoyReportComponent,
    NewwarehouseComponent,
    PoupVisualizeComponent
  ],
  entryComponents: [
    DynamicComponentNo1Component,
    DynamicComponentNo2Component,
    DynamicComponentNo3Component,
    ItemListComponent,
    ItemDetailComponent,
    ZoneListComponent,
    ZoneDetailComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    CustomergroupListComponent,
    CustomergroupDetailComponent,
    PackListComponent,
    PackDetailComponent,
    LocationListComponent,
    LocationDetailComponent,
    AllocateListComponent,
    AllocateDetailComponent,
    PutawayListComponent,
    PutawayDetailComponent,
    SystemCodeListComponent,
    ReceiptListComponent,
    ReceiptDetailComponent,
    AdjustmentListComponent,
    BomListComponent,
    BomDetailComponent,
    CarrierListComponent,
    CarrierDetailComponent,
    ChangeStatusListComponent,
    ChargeListComponent,
    HelperListComponent,
    HelperDetailComponent,
    InboundReportListComponent,
    InternalTransferListComponent,
    LineListComponent,
    LineDetailComponent,
    OutboundReportListComponent,
    PostStockListComponent,
    PremoveListComponent,
    ShipmentListComponent,
    StockListComponent,
    SupplierListComponent,
    SupplierDetailComponent,
    TransactionListComponent,
    ViewhelperListComponent,
    DockAsnComponent,
    TariffListComponent,
    ChargeTypeListComponent,
    SystemCodeDetailComponent,
    TaskdetailListComponent,
    AllocatemanualComponent,
    InventoryListComponent,
    MoveComponent,
    LotUpdateComponent,
    PremoveListComponent,
    TransactionListComponent,
    TariffListComponent,
    ChargeTypeListComponent,
    DockSoComponent,
    DashboardComponent,
    DropidComponent,
    CheckInListComponent,
    CheckinDetailComponent,
    VisualizeComponent,
    InventoyReportComponent,
    NewwarehouseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularMultiSelectModule,
    Ng2CompleterModule,
    NgxPaginationModule,
    NguiDatetimePickerModule,
    Daterangepicker,
    CurrencyMaskModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    }),
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot()
  ],
  providers: [
    LanguageService,
    UtilityService,
    ReportService,
    LoadingService,
    ConfigService,
    ExcelService,
    SocketService,
    ApiService,
    GridService,
    DemoDynamicLoaderService,
    AppServices,
    NotifyService,
    PasteService,
    DnDService,
    AuthManager,
    AuthService,
    DatePipe,
    DecimalPipe,
    ModalService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }],
  bootstrap: [AppComponent]
})
export class AppModule { }
