import { ItemListComponent } from "../item/item-list.component";
import { InventoryListComponent } from "../inventory-list/inventory-list.component";
import { MoveComponent } from "../move/move.component";
import { CustomerListComponent } from "../customer/customer-list.component";
import { DockAsnComponent } from '../dock-asn/dock-asn.component';
import { CustomergroupListComponent } from "../customergroup/customergroup-list.component";
import { PackListComponent } from "../pack/pack-list.component";
import { ZoneListComponent } from "../zone/zone-list.component";
import { LocationListComponent } from "../location/location-list.component";
import { AllocateListComponent } from "../allocate/allocate-list.component";
import { PutawayListComponent } from "../putaway/putaway-list.component";
import { SystemCodeListComponent } from "../system-code/system-code-list.component";
import { ReceiptListComponent } from "../receipt/receipt-list.component";
import { AdjustmentListComponent } from "../adjustment/adjustment-list.component";
import { BomListComponent } from "../bom/bom-list.component";
import { CarrierListComponent } from "../carrier/carrier-list.component";
import { ChangeStatusListComponent } from "../change-status/change-status-list.component";
import { ChargeListComponent } from "../charge/charge-list.component";
import { ChargeTypeListComponent } from "../charge-type/charge-type-list.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { HelperListComponent } from "../helper/helper-list.component";
import { InboundReportListComponent } from "../inbound-report/inbound-report-list.component";
import { InternalTransferListComponent } from "../internal-transfer/internal-transfer-list.component";
import { LineListComponent } from "../line/line-list.component";
import { LotUpdateComponent } from "../lot-update/lot-update.component";
import { OutboundReportListComponent } from "../outbound-report/outbound-report-list.component";
import { PostStockListComponent } from "../post-stock/post-stock-list.component";
import { PremoveListComponent } from "../premove/premove-list.component";
import { ShipmentListComponent } from "../shipment/shipment-list.component";
import { StockListComponent } from "../stock/stock-list.component";
import { SupplierListComponent } from "../supplier/supplier-list.component";
import { TransactionListComponent } from "../transaction/transaction-list.component";
import { ViewhelperListComponent } from "../viewhelper/viewhelper-list.component";
import { TariffListComponent } from "../tariff/tariff-list.component";
import { DockSoComponent } from "../dock-so/dock-so.component";
import { DropidComponent } from "../dropid/dropid.component";
import { CheckInListComponent } from "../check-in/check-in-list.component";
import { InventoyReportComponent } from '../inventoy-report/inventoy-report.component';
import { VisualizeComponent } from '../visualize/visualize.component';
import { NewwarehouseComponent } from "../newwarehouse/newwarehouse.component";

export let menu = {
    itemList: {
        title: 'Item List',
        component: ItemListComponent
    },
    zoneList: {
        title: 'Zone List',
        component: ZoneListComponent
    },
    locationList: {
        title: 'Location List',
        component: LocationListComponent
    },
    inventoryList: {
        title: 'Inventory List',
        component: InventoryListComponent
    },
    move: {
        title: 'Move',
        component: MoveComponent
    },
    customerList: {
        title: 'Customer List',
        component: CustomerListComponent,
    },
    changeStatus: {
        title: 'Change Status',
        component: ChangeStatusListComponent,
    },
    lotUpdate: {
        title: 'Lot Update',
        component: LotUpdateComponent,
    },
    dockAsn: {
        title: 'Dock ASN',
        component: DockAsnComponent,
    },
    customergroupList: {
        title: 'Customergroup List',
        component: CustomergroupListComponent
    },
    packList: {
        title: 'Pack List',
        component: PackListComponent
    },
    allocateList: {
        title: 'Allocate List',
        component: AllocateListComponent
    },
    putawayList: {
        title: 'Putaway List',
        component: PutawayListComponent
    },
    systemCodeList: {
        title: 'System Code List',
        component: SystemCodeListComponent
    },
    receiptList:{
        title: 'Receipt List',
        component: ReceiptListComponent
    },
    adjustmentList:{
        title: 'Adjustment List',
        component: AdjustmentListComponent
    },
    bomList:{
        title: 'Bom List',
        component: BomListComponent
    },
    storageList:{
        title: 'Storage List',
        component: StockListComponent
    },
    carrierList:{
        title: 'Carrier List',
        component: CarrierListComponent
    },
    changeStatusList:{
        title:'Change Status List',
        component: ChangeStatusListComponent
    },
    chargeList:{
        title:'Charge List',
        component: ChargeListComponent
    },
    chargeTypeList:{
        title:'Charge Type List',
        component: ChargeTypeListComponent
    },
    dashboard:{
        title:'Dashboard',
        component: DashboardComponent
    },
    helperList:{
        title:'Helper List',
        component: HelperListComponent
    },
    inboundReportList:{
        title:'Inbound Report List',
        component: InboundReportListComponent
    },
    internalTransferList:{
        title:'Internal Transfer List',
        component: InternalTransferListComponent
    },
    lineList:{
        title:'Line List',
        component: LineListComponent
    },
    // lotUpdateList:{
    //     title:'Lot Update List',
    //     component: LotUpdateListComponent
    // },
    outboundReportList:{
        title: 'Outbound Report List',
        component: OutboundReportListComponent
    },
    postStockList:{
        title: 'Post Stock List',
        component: PostStockListComponent
    },
    premoveList:{
        title: 'Premove List',
        component: PremoveListComponent
    },
    shipmentList:{
        title: 'Shipment List',
        component: ShipmentListComponent
    },
    stockList:{
        title: 'Stock List',
        component: StockListComponent
    },
    supplierList:{
        title: 'Supplier List',
        component: SupplierListComponent
    },
    transactionList:{
        title: 'Transaction List',
        component: TransactionListComponent
    },
    viewhelperList:{
        title: 'Viewhelper List',
        component: ViewhelperListComponent
    },
    tariffList:{
        title: 'Tariff ASN',
        component: TariffListComponent
    },
    dockASN:{
        title: 'Dock ASN',
        component: DockAsnComponent
    },
    dockSO:{
        title: 'Dock SO',
        component: DockSoComponent
    },
    dropId:{
        title: 'Drop Id',
        component: DropidComponent
    },
    checkIn:{
        title: 'Check In',
        component: CheckInListComponent,
    },
    inventoryReport:{
        title: 'Inventory Report',
        component: InventoyReportComponent,
    },
    visualize:{
        title: 'Visualize',
        component: VisualizeComponent,
    },
    newwarehouse:{
        title: 'New Warehouse',
        component: NewwarehouseComponent,
    }
};