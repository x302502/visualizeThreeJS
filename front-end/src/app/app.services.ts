import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { NotifyService } from './notify.service';

import { ConfigService } from './services/config-service/config.service';
import { AuthService } from './services/auth-service/auth.service';

@Injectable()
export class AppServices {
  get account() {
    return this.authService.user;
  }
  host: string;
  host_auth: string;

  CHECK_TOKEN = this.host_auth + '/api/Users/checktoken';
  CHECKCROSSDOMAIN_TOKEN = this.host_auth + '/api/Users/validregistoken';
  FIND_USERS = this.host_auth + '/api/Users/find';
  SIGNOUT = this.host_auth + '/api/Users/signout';

  GETLISTWAREHOUSE_USERS = this.host_auth + '/api/Users/getlistwarehouse';
  GETLISTOWNER_USERS = this.host_auth + '/api/Users/getlistowner';
  GETLISTMENU_USERS = this.host_auth + '/api/Users/getlistmenu';
  AFTERSIGNIN_USER = this.host_auth + '/api/Users/aftersignin';
  CHANGE_WAREHOUSE = this.host_auth + '/api/Warehouses/change';

  SIGNIN_USER = this.host_auth + '/api/Users/signin';
  UPDATE_USERS = this.host_auth + '/api/Users/update';
  CHANGEPASSWORD_USERS = this.host_auth + '/api/Users/changepassword';
  FORGOTPASSWORD_USERS = this.host_auth + '/api/Users/forgotpassword';
  GET_APPS = this.host_auth + '/api/Apps/get';
  FINDOWNER_STORER = this.host_auth + '/api/Storers/find';
  GETLISTOWNERBYWAREHOUSE_STORER = this.host_auth + '/api/Storers/getbyonewarehouse';

  RECEIPTALL = this.host + '/api/Inbounds/receiveall';
  RECEIPTBYITEM = this.host + '/api/Inbounds/receivebyitemselect';
  UNRECEIPTALL = this.host + '/api/Inbounds/unreceiveall';
  UNRECEIPTBYITEM = this.host + '/api/Inbounds/unreceivebyitemselect';
  RECEIPT = this.host + '/api/Inbounds/treceipt';
  UNRECEIPT = this.host + '/api/Inbounds/tunreceipt';
  PUTAWAY = this.host + '/api/Inbounds/tputaway';
  UPDATESTATUSRECEIPT = this.host + '/api/Inbounds/updateStatusReceipt';
  CONFIRMPUTAWAY = this.host + '/api/Inbounds/tconfirmputaway';



  ALLOCATE = this.host + '/api/Outbounds/tallocate';
  ALLOCATEMANUAL = this.host + '/api/Outbounds/allocatemanual';
  UNALLOCATEBYORDER = this.host + '/api/Outbounds/unallocate';
  PICK = this.host + '/api/Outbounds/tpick';
  UNPICK = this.host + '/api/Outbounds/unpick';
  PICKBYORDER = this.host + '/api/Outbounds/pickbyorder';
  SHIP = this.host + '/api/Outbounds/tship';
  SHIPBYORDER = this.host + '/api/Outbounds/shipbyorder';
  SHIPPICKDETAIL = this.host + '/api/Outbounds/shippickdetail';
  PICKPICKDETAIL = this.host + '/api/Outbounds/pickpickdetail';
  ALLOCATEBYSTRATEGY = this.host + '/api/Outbounds/orderallocatebystrategy';
  GETLIST_ALLOCATEMANUAL = this.host + '/api/Outbounds/getallocatemanual'
  UPDATE_STATUSORDER = this.host + '/api/Outbounds/updatestatusorder'

  ORDERALLOCATEBYSTRATEGY2 = this.host + '/api/Outbounds/orderallocatebystrategy2';
  UNALLOCATEALL = this.host + '/api/Outbounds/unallocateall';
  UNALLOCATEBYITEMSELECT = this.host + '/api/Outbounds/unallocatebyitemselect';
  PICKALL = this.host + '/api/Outbounds/pickall';
  PICKBYITEMSELECT = this.host + '/api/Outbounds/pickbyitemselect';
  UNPICKALL = this.host + '/api/Outbounds/unpickall';
  UNPICKBYITEMSELECT = this.host + '/api/Outbounds/unpickbyitemselect';
  SHIPALL = this.host + '/api/Outbounds/shipAll';
  SHIPBYITEMSELECT = this.host + '/api/Outbounds/shipByItemSelect';

  LIST_RECEIPT = this.host + '/api/Receipts/list';
  GETLIST_RECEIPT = this.host + '/api/Receipts/getlist';
  FIND_RECEIPT = this.host + '/api/Receipts/find';
  CHECK_RECEIPT = this.host + '/api/Receipts/checkreceiptimport';
  DELETE_RECEIPT = this.host + '/api/Receipts/deletereceipt';
  INSERT_RECEIPT = this.host + '/api/Receipts/insert';
  CREATE_RECEIPT = this.host + '/api/Receipts/create';
  UPDATE_RECEIPT = this.host + '/api/Receipts/update';
  CATEGORY_SKU = this.host + '/api/Receipts/category';
  LIST_RECEIPT_DOCK = this.host + '/api/Receipts/listForDock';
  UPDATE_RECEIPT_DOCK_TIME = this.host + '/api/Receipts/updateTimeForDock';
  TOTALRECEIPTDETAIL = this.host + '/api/Receipts/totalreceiptdetail'

  INSERTEXCELASN = this.host + '/api/Receipts/insertExcelASN';
  INSERTEXCELORDER = this.host + '/api/Orders/insertExcelOrder';


  LIST_RECEIPTDETAIL = this.host + '/api/Receiptdetails/list';
  FIND_RECEIPTDETAIL = this.host + '/api/Receiptdetails/find';
  INSERT_RECEIPTDETAIL = this.host + '/api/Receiptdetails/insert';
  UPDATE_RECEIPTDETAIL = this.host + '/api/Receiptdetails/_update';
  DELETE_RECEIPTDETAIL = this.host + '/api/Receiptdetails/deletereceiptdetail';

  GETLIST_STORER = this.host + '/api/Storers/getliststorer';
  LIST_STORER = this.host + '/api/Storers/list';
  INSERT_STORER = this.host + '/api/Storers/insert';
  UPDATE_STORER = this.host + '/api/Storers/update';
  FIND_STORER = this.host + '/api/Storers/find';
  LIST_ONESTORER = this.host + '/api/Storers/listone';

  _INSERT_STORER = this.host + '/api/Storers/_insert';
  _UPDATE_STORER = this.host + '/api/Storers/_update';
  _SAVE_STORER = this.host + '/api/Storers/_save';

  LIST_CUSTOMERGROUP = this.host + '/api/Customergroups/list';
  FIND_CUSTOMERGROUP = this.host + '/api/Customergroups/find';
  INSERT_CUSTOMERGROUP = this.host + '/api/Customergroups/insert';
  UPDATE_CUSTOMERGROUP = this.host + '/api/Customergroups/update';

  _INSERT_CUSTOMERGROUP = this.host + '/api/Customergroups/_insert';
  _UPDATE_CUSTOMERGROUP = this.host + '/api/Customergroups/_update';
  _SAVE_CUSTOMERGROUP = this.host + '/api/Customergroups/_save';

  LIST_BOM = this.host + '/api/billofmaterials/list';
  QUERY_BOM = this.host + '/api/billofmaterials/query';
  FIND_BOM = this.host + '/api/billofmaterials/find';
  INSERT_BOM = this.host + '/api/billofmaterials/insert';
  UPDATE_BOM = this.host + '/api/billofmaterials/update';
  SAVE_BOM = this.host + '/api/billofmaterials/save';

  GETLIST_PACK = this.host + '/api/Packs/getListPack';
  LIST_PACK = this.host + '/api/Packs/list';
  INSERT_PACK = this.host + '/api/Packs/insert';
  UPDATE_PACK = this.host + '/api/Packs/update';
  FIND_PACK = this.host + '/api/Packs/find';
  DELETE_PACK = this.host + '/api/Packs/delete';
  GET_UOM = this.host + '/api/Packs/query';
  GET_ALLUOM = this.host + '/api/Packs/queryAllPack';
  GET_OTHERUOM = this.host + '/api/Packs/queryOtherUOM';

  _INSERT_PACK = this.host + '/api/Packs/_insert';
  _UPDATE_PACK = this.host + '/api/Packs/_update';
  _SAVE_PACK = this.host + '/api/Packs/_save';

  GETLIST_LOCATION = this.host + '/api/Locs/getlistlocation';
  LIST_LOCATION = this.host + '/api/Locs/list';
  FIND_LOCATION = this.host + '/api/Locs/find';
  INSERT_LOCATION = this.host + '/api/Locs/insert';
  UPDATE_LOCATION = this.host + '/api/Locs/update';

  _INSERT_LOCATION = this.host + '/api/Locs/_insert';
  _UPDATE_LOCATION = this.host + '/api/Locs/_update';
  _SAVE_LOCATION = this.host + '/api/Locs/_save';

  GETLIST_ZONE = this.host + '/api/Putawayzones/getlistputawayzone';
  LIST_ZONE = this.host + '/api/Putawayzones/list';
  INSERT_ZONE = this.host + '/api/Putawayzones/insert';
  UPDATE_ZONE = this.host + '/api/Putawayzones/update';
  FIND_ZONE = this.host + '/api/Putawayzones/find';

  _INSERT_ZONE = this.host + '/api/Putawayzones/_insert';
  _UPDATE_ZONE = this.host + '/api/Putawayzones/_update';
  _SAVE_ZONE = this.host + '/api/Putawayzones/_save';

  LIST_LINE = this.host + '/api/Lines/list';
  INSERT_LINE = this.host + '/api/Lines/insert';
  UPDATE_LINE = this.host + '/api/Lines/update';
  FIND_LINE = this.host + '/api/Lines/find';

  _INSERT_LINE = this.host + '/api/Lines/_insert';
  _UPDATE_LINE = this.host + '/api/Lines/_update';
  _SAVE_LINE = this.host + '/api/Lines/_save';

  GETLIST_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/getlistputawaystrategy';
  LIST_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/list';
  FIND_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/find';
  INSERT_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/insert';
  UPDATE_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/update';

  _INSERT_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/_insert';
  _UPDATE_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/_update';

  LIST_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/list';
  FIND_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/find';
  INSERT_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/insert';
  UPDATE_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/update';

  _INSERT_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/_insert';
  _UPDATE_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/_update';
  _SAVE_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/_save';

  GETLIST_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/getlistallocatestrategy';
  LIST_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/list';
  FIND_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/find';
  INSERT_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/insert';
  UPDATE_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/update';

  _INSERT_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/_insert';
  _UPDATE_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/_update';

  LIST_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/list';
  FIND_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/find';
  INSERT_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/insert';
  UPDATE_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/update';

  _INSERT_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/_insert';
  _UPDATE_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/_update';
  _SAVE_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/_save';

  LIST_CODELIST = this.host + '/api/Codelists/list';
  FIND_CODELIST = this.host + '/api/Codelists/find';
  INSERT_CODELIST = this.host + '/api/Codelists/insert';
  UPDATE_CODELIST = this.host + '/api/Codelists/update';

  _INSERT_CODELIST = this.host + '/api/Codelists/_insert';
  _UPDATE_CODELIST = this.host + '/api/Codelists/_update';

  LIST_SKU = this.host + '/api/Skus/list';
  LISTBYOWNER_SKU = this.host + '/api/Skus/listbyowner';
  SAVE_SKU = this.host + '/api/Skus/save';
  INSERT_SKU = this.host + '/api/Skus/insert';
  UPDATE_SKU = this.host + '/api/Skus/update';
  FIND_SKU = this.host + '/api/Skus/find';
  PRINT_SKU = this.host + '/api/Skus/print';

  _INSERT_SKU = this.host + '/api/Skus/_insert';
  _UPDATE_SKU = this.host + '/api/Skus/_update';
  _SAVE_SKU = this.host + '/api/Skus/_save';

  GETLIST_CODELKUP = this.host + '/api/Codelkups/getlistcodelkup';
  LIST_CODELKUP = this.host + '/api/Codelkups/list';
  FIND_CODELKUP = this.host + '/api/Codelkups/find';
  INSERT_CODELKUP = this.host + '/api/Codelkups/insert';
  UPDATE_CODELKUP = this.host + '/api/Codelkups/update  ';

  _GETLIST_CODELKUP = this.host + '/api/Codelkups/_getlistcodelkup';
  _LIST_CODELKUP = this.host + '/api/Codelkups/_list';
  _INSERT_CODELKUP = this.host + '/api/Codelkups/_insert';
  _UPDATE_CODELKUP = this.host + '/api/Codelkups/_update  ';

  LIST_SUPPLIER = this.host + '/api/Lines/list';
  SAVE_SUPPLIER = this.host + '/api/Lines/save';
  FIND_SUPPLIER = this.host + '/api/Lines/find';

  FIND_TASKDETAIL = this.host + '/api/Taskdetails/find';

  LIST_INVENTORY = this.host + '/api/Inventories/list';
  COUNT_INVENTORY = this.host + '/api/Inventories/count'
  FIND_INVENTORY = this.host + '/api/Inventories/find';
  TRANSACTION_QTY = this.host + '/api/Inventories/tQty';
  TRANSACTION_QTYMOVE = this.host + '/api/Inventories/tQtymove';
  TRANSACTION_CHANGESTATUS = this.host + '/api/Inventories/tChangeStatus';
  _SAVETOPREMOVE = this.host + '/api/Inventories/_saveToPreMove';
  CREATESHORTID = this.host + '/api/Inventories/CreateShortId';
  TRANSACTION_QTYPREMOVE = this.host + '/api/Inventories/tQtyPreMove';
  TRANSACTION_TRANSFERINTERNAL = this.host + '/api/Inventories/tTransferInternal';
  SAVE_TOTRANSFER = this.host + '/api/Inventories/saveToTransfer';
  DELETE_TRANSFER = this.host + '/api/Inventories/tDeleteTransfer';
  FIND_TRANSFERDETAIL = this.host + '/api/Transferdetails/find'
  TRANSACTION_LOTUPDATE = this.host + '/api/Inventories/tLotUpdate';
  LIST_INVENTORY_REPORT = this.host + '/api/Inventories/listReport';
  HAVE_STOCK_INVENTORY = this.host + '/api/Inventories/havestockinventory';


  LIST_ORDERS = this.host + '/api/Orders/list';
  GETLIST_ORDERS = this.host + '/api/Orders/getlist';
  FIND_ORDERS = this.host + '/api/Orders/find';
  INSERT_ORDERS = this.host + '/api/Orders/insert';
  UPDATE_ORDERS = this.host + '/api/Orders/update';
  DELETE_ORDERS = this.host + '/api/Orders/deleteorder';
  GET_SKU = this.host + '/api/Orders/getsku';
  TOTALDETAIL = this.host + '/api/Orders/totalDetail'
  CREATE_ORDERS = this.host + '/api/Orders/create'
  UPDATE_TIME_DOCK_ORDER = this.host + '/api/Orders/updateTimeForDock';

  LIST_ORDERSDETAIL = this.host + '/api/Orderdetails/list';
  FIND_ORDERSDETAIL = this.host + '/api/Orderdetails/find';
  FINDONE_ORDERSDETAIL = this.host + '/api/Orderdetails/findone';
  INSERT_ORDERSDETAIL = this.host + '/api/Orderdetails/insert';
  UPDATE_ORDERSDETAIL = this.host + '/api/Orderdetails/_update';
  DELETE_ORDERSDETAIL = this.host + '/api/Orderdetails/deleteorderdetail';

  LIST_LOTXLOCXID = this.host + '/api/Lotxlocxids/list';
  INSERT_LOTXLOCXID = this.host + '/api/Lotxlocxids/insert';
  UPDATE_LOTXLOCXID = this.host + '/api/Lotxlocxids/update';

  LIST_SKUXLOC = this.host + '/api/Skuxlocs/list';
  INSERT_SKUXLOC = this.host + '/api/Skuxlocs/insert';
  UPDATE_SKUXLOC = this.host + '/api/Skuxlocs/update';

  LIST_LOT = this.host + '/api/Lots/list';
  INSERT_LOT = this.host + '/api/Lots/insert';
  UPDATE_LOT = this.host + '/api/Lots/update';

  FIND_lPNID = this.host + '/api/Lpnids/find';

  LIST_PICKDETAIL = this.host + '/api/Pickdetails/list';
  GET_PICKDETAIL = this.host + '/api/Pickdetails/get';

  LIST_MASTERPICK = this.host + '/api/MasterPicks/list';
  FIND_MASTERPICK = this.host + '/api/MasterPicks/find';
  INSERT_MASTERPICK = this.host + '/api/MasterPicks/insert';
  UPDATE_MASTERPICK = this.host + '/api/MasterPicks/update';

  WAREHOUSERECEIPT_REPORT = this.host + '/api/Reports/warehousereceipt';
  PUTAWAYLIST_REPORT = this.host + '/api/Reports/putawaylist';
  PALLETLABEL_REPORT = this.host + '/api/Reports/palletlabel';
  DEVILERYNOTE_REPORT = this.host + '/api/Reports/devilerynote';
  PICKINGLIST_REPORT = this.host + '/api/Reports/pickinglist';
  MASTERPICK_REPORT = this.host + '/api/Reports/masterpick';

  STOCKCOUNT_REPORT = this.host + '/api/Reports/stockcount';
  STOCKCOUNT_TIMES_REPORT = this.host + '/api/Reports/stockcounttimes';

  CODE128_BARCODE = this.host + '/api/Reports/barcode/code128';

  LIST_PREMOVE = this.host + '/api/Premoves/list';
  INSERT_PREMOVE = this.host + '/api/Premoves/insert';
  UPDATE_PREMOVE = this.host + '/api/Premoves/update';
  FIND_PREMOVE = this.host + '/api/Premoves/find';

  LISTFULLCOUNT_STOCKCOUNT = this.host + '/api/Stockcounts/listfullcount';
  LISTSKU_STOCKCOUNT = this.host + '/api/Stockcounts/listsku';
  LISTZONELOC_STOCKCOUNT = this.host + '/api/Stockcounts/listzoneloc';
  LISTSTOCKCOUNT_STOCKCOUNT = this.host + '/api/Stockcounts/liststockcount';
  LISTCHANGEINDATE_STOCKCOUNT = this.host + '/api/Stockcounts/listchangeindate';
  INSERT_STOCKCOUNT = this.host + '/api/Stockcounts/insert';
  UPDATE_STOCKCOUNT = this.host + '/api/Stockcounts/update';
  FIND_STOCKCOUNT = this.host + '/api/Stockcounts/find';
  LIST_STOCKCOUNT = this.host + '/api/Stockcounts/list';

  INSERT_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/insert';
  INSERTMANY_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/insertmany';
  UPDATE_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/update';
  FIND_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/find';
  LIST_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/list';
  GETINVENTORY_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/getinventory';

  TOTALORDER_STATISTICS = this.host + '/api/Statistics/totalorder';
  TOTALORDERBYOWNER_STATISTICS = this.host + '/api/Statistics/totalorderbyowner';
  TOTALORDERBYDATE_STATISTICS = this.host + '/api/Statistics/totalorderbydate';
  TOTALBYGROSSWGT_STATISTICS = this.host + '/api/Statistics/totalbygrosswgt';
  TOTALBYCUBE_STATISTICS = this.host + '/api/Statistics/totalbycube';
  SO_STATISTICS = this.host + '/api/Statistics/so';
  ASN_STATISTICS = this.host + '/api/Statistics/asn';

  LISTDETAIL_INBOUNDREPORT = this.host + '/api/Inboundreports/getlist';
  LISTSUMMARY_INBOUNDREPORT = this.host + '/api/Inboundreports/getlistsummary';

  LISTDETAIL_OUTBOUNDREPORT = this.host + '/api/Outboundreports/getlistdetail';
  LISTSUMMARY_OUTBOUNDREPORT = this.host + '/api/Outboundreports/getlistsummary';

  LIST_SHIPCODE = this.host + '/api/Shipcodes/list';
  FIND_SHIPCODE = this.host + '/api/Shipcodes/find';
  INSERT_SHIPCODE = this.host + '/api/Shipcodes/insert';
  UPDATE_SHIPCODE = this.host + '/api/Shipcodes/update';
  SAVE_SHIPCODE = this.host + '/api/Shipcodes/save';

  LIST_TARIFF = this.host + '/api/Tariffs/list';
  FIND_TARIFF = this.host + '/api/Tariffs/find';
  INSERT_TARIFF = this.host + '/api/Tariffs/insert';
  UPDATE_TARIFF = this.host + '/api/Tariffs/update';

  LIST_TARIFFDETAIL = this.host + '/api/Tariffdetails/list';
  FIND_TARIFFDETAIL = this.host + '/api/Tariffdetails/find';
  INSERT_TARIFFDETAIL = this.host + '/api/Tariffdetails/insert';
  UPDATE_TARIFFDETAIL = this.host + '/api/Tariffdetails/update';

  FIND_HELP = this.host + "/api/Help/findHelp";
  UPDATE_HELP = this.host + "/api/Help/updateHelp";
  INSERT_HELP = this.host + "/api/Help/insertHelp";

  LIST_CHARGE = this.host + '/api/Charges/list';
  FIND_CHARGE = this.host + '/api/Charges/find';
  INSERT_CHARGE = this.host + '/api/Charges/insert';
  UPDATE_CHARGE = this.host + '/api/Charges/update';

  LIST_CHARGETYPE = this.host + '/api/Chargetypes/list';
  FIND_CHARGETYPE = this.host + '/api/Chargetypes/find';
  INSERT_CHARGETYPE = this.host + '/api/Chargetypes/insert';
  UPDATE_CHARGETYPE = this.host + '/api/Chargetypes/update';

  LIST_TRANSACTION = this.host + '/api/Transactions/list';
  LIST_TRANSACTIONBYDATE = this.host + '/api/Transactions/listbydate';

  TRANSACTION_DOCK_INBOUND = this.host + '/api/Docks/tInbound';
  TRANSACTION_TRANSFER_DROP_ID = this.host + '/api/Dropids/tTransferCartonId';
  LIST_SO_DOCK = this.host + '/api/Orders/listForDock';
  INSERT_DROP_ID = this.host + '/api/Dropids/insert';
  UPDATE_DROP_ID = this.host + '/api/Dropids/update';
  FIND_DROP_ID = this.host + '/api/Dropids/find';
  LIST_DROP_ID = this.host + '/api/Dropids/list';
  LIST_ORDER_ID = this.host + '/api/Orders/listForDock';
  TRANSACTION_DOCK_OUTBOUND = this.host + '/api/Docks/tOutBound';

  LIST_CHECKIN = this.host + '/api/Checkins/list';
  INSERT_CHECKIN = this.host + '/api/Checkins/insert';
  FIND_CHECKIN = this.host + '/api/Checkins/find';
  UPDATE_CHECKIN = this.host + '/api/Checkins/update';


  update() {
    this.CHECK_TOKEN = this.host_auth + '/api/Users/checktoken';
    this.CHECKCROSSDOMAIN_TOKEN = this.host_auth + '/api/Users/validregistoken';
    this.FIND_USERS = this.host_auth + '/api/Users/find';
    this.SIGNOUT = this.host_auth + '/api/Users/signout';

    this.GETLISTWAREHOUSE_USERS = this.host_auth + '/api/Users/getlistwarehouse';
    this.GETLISTOWNER_USERS = this.host_auth + '/api/Users/getlistowner';
    this.GETLISTMENU_USERS = this.host_auth + '/api/Users/getlistmenu';
    this.AFTERSIGNIN_USER = this.host_auth + '/api/Users/aftersignin';
    this.CHANGE_WAREHOUSE = this.host_auth + '/api/Warehouses/change';

    this.SIGNIN_USER = this.host_auth + '/api/Users/signin';
    this.UPDATE_USERS = this.host_auth + '/api/Users/update';
    this.CHANGEPASSWORD_USERS = this.host_auth + '/api/Users/changepassword';
    this.FORGOTPASSWORD_USERS = this.host_auth + '/api/Users/forgotpassword';
    this.GET_APPS = this.host_auth + '/api/Apps/get';
    this.FINDOWNER_STORER = this.host_auth + '/api/Storers/find';
    this.GETLISTOWNERBYWAREHOUSE_STORER = this.host_auth + '/api/Storers/getbyonewarehouse';

    this.RECEIPTALL = this.host + '/api/Inbounds/receiveAll';
    this.RECEIPTBYITEM = this.host + '/api/Inbounds/receivebyitemselect';
    this.UNRECEIPTALL = this.host + '/api/Inbounds/unreceiveall';
    this.UNRECEIPTBYITEM = this.host + '/api/Inbounds/unreceivebyitemselect';
    this.RECEIPT = this.host + '/api/Inbounds/treceipt';
    this.UNRECEIPT = this.host + '/api/Inbounds/tunreceipt';
    this.PUTAWAY = this.host + '/api/Inbounds/tputaway';
    this.UPDATESTATUSRECEIPT = this.host + '/api/Inbounds/updateStatusReceipt';
    this.CONFIRMPUTAWAY = this.host + '/api/Inbounds/tconfirmputaway'

    this.ALLOCATE = this.host + '/api/Outbounds/tallocate';
    this.ALLOCATEMANUAL = this.host + '/api/Outbounds/allocatemanual';
    this.UNALLOCATEBYORDER = this.host + '/api/Outbounds/unallocate';
    this.PICK = this.host + '/api/Outbounds/tpick';
    this.UNPICK = this.host + '/api/Outbounds/unpick';
    this.PICKBYORDER = this.host + '/api/Outbounds/pickbyorder';
    this.SHIP = this.host + '/api/Outbounds/tship';
    this.SHIPBYORDER = this.host + '/api/Outbounds/shipbyorder';
    this.SHIPPICKDETAIL = this.host + '/api/Outbounds/shippickdetail';
    this.PICKPICKDETAIL = this.host + '/api/Outbounds/pickpickdetail';
    this.ALLOCATEBYSTRATEGY = this.host + '/api/Outbounds/orderallocatebystrategy';
    this.GETLIST_ALLOCATEMANUAL = this.host + '/api/Outbounds/getallocatemanual';
    this.UPDATE_STATUSORDER = this.host + '/api/Outbounds/updatestatusorder';

    this.ORDERALLOCATEBYSTRATEGY2 = this.host + '/api/Outbounds/orderallocatebystrategy2';
    this.UNALLOCATEALL = this.host + '/api/Outbounds/unallocateall';
    this.UNALLOCATEBYITEMSELECT = this.host + '/api/Outbounds/unallocatebyitemselect';
    this.PICKALL = this.host + '/api/Outbounds/pickall';
    this.PICKBYITEMSELECT = this.host + '/api/Outbounds/pickbyitemselect';
    this.UNPICKALL = this.host + '/api/Outbounds/unpickall';
    this.UNPICKBYITEMSELECT = this.host + '/api/Outbounds/unpickbyitemselect';
    this.SHIPALL = this.host + '/api/Outbounds/shipAll';
    this.SHIPBYITEMSELECT = this.host + '/api/Outbounds/shipByItemSelect';

    this.LIST_RECEIPT = this.host + '/api/Receipts/list';
    this.GETLIST_RECEIPT = this.host + '/api/Receipts/getlist';
    this.FIND_RECEIPT = this.host + '/api/Receipts/find';
    this.CHECK_RECEIPT = this.host + '/api/Receipts/checkreceiptimport';
    this.DELETE_RECEIPT = this.host + '/api/Receipts/deletereceipt';
    this.INSERT_RECEIPT = this.host + '/api/Receipts/insert';
    this.CREATE_RECEIPT = this.host + '/api/Receipts/create';

    this.UPDATE_RECEIPT = this.host + '/api/Receipts/update';
    this.CATEGORY_SKU = this.host + '/api/Receipts/category';
    this.LIST_RECEIPT_DOCK = this.host + '/api/Receipts/listForDock';
    this.UPDATE_RECEIPT_DOCK_TIME = this.host + '/api/Receipts/updateTimeForDock';
    this.TOTALRECEIPTDETAIL = this.host + '/api/Receipts/totalreceiptdetail'

    this.INSERTEXCELASN = this.host + '/api/Receipts/insertExcelASN';
    this.INSERTEXCELORDER = this.host + '/api/Orders/insertExcelOrder';


    this.LIST_RECEIPTDETAIL = this.host + '/api/Receiptdetails/list';
    this.FIND_RECEIPTDETAIL = this.host + '/api/Receiptdetails/find';
    this.INSERT_RECEIPTDETAIL = this.host + '/api/Receiptdetails/insert';
    this.UPDATE_RECEIPTDETAIL = this.host + '/api/Receiptdetails/_update';
    this.DELETE_RECEIPTDETAIL = this.host + '/api/Receiptdetails/deletereceiptdetail';

    this.GETLIST_STORER = this.host + '/api/Storers/getliststorer';
    this.LIST_STORER = this.host + '/api/Storers/list';
    this.INSERT_STORER = this.host + '/api/Storers/insert';
    this.UPDATE_STORER = this.host + '/api/Storers/update';
    this.FIND_STORER = this.host + '/api/Storers/find';
    this.LIST_ONESTORER = this.host + '/api/Storers/listone';

    this._INSERT_STORER = this.host + '/api/Storers/_insert';
    this._UPDATE_STORER = this.host + '/api/Storers/_update';
    this._SAVE_STORER = this.host + '/api/Storers/_save';

    this.LIST_CUSTOMERGROUP = this.host + '/api/Customergroups/list';
    this.FIND_CUSTOMERGROUP = this.host + '/api/Customergroups/find';
    this.INSERT_CUSTOMERGROUP = this.host + '/api/Customergroups/insert';
    this.UPDATE_CUSTOMERGROUP = this.host + '/api/Customergroups/update';

    this._INSERT_CUSTOMERGROUP = this.host + '/api/Customergroups/_insert';
    this._UPDATE_CUSTOMERGROUP = this.host + '/api/Customergroups/_update';
    this._SAVE_CUSTOMERGROUP = this.host + '/api/Customergroups/_save';

    this.LIST_BOM = this.host + '/api/billofmaterials/list';
    this.QUERY_BOM = this.host + '/api/billofmaterials/query';
    this.FIND_BOM = this.host + '/api/billofmaterials/find';
    this.INSERT_BOM = this.host + '/api/billofmaterials/insert';
    this.UPDATE_BOM = this.host + '/api/billofmaterials/update';
    this.SAVE_BOM = this.host + '/api/billofmaterials/save';

    this.GETLIST_PACK = this.host + '/api/Packs/getListPack';
    this.LIST_PACK = this.host + '/api/Packs/list';
    this.INSERT_PACK = this.host + '/api/Packs/insert';
    this.UPDATE_PACK = this.host + '/api/Packs/update';
    this.FIND_PACK = this.host + '/api/Packs/find';
    this.DELETE_PACK = this.host + '/api/Packs/delete';
    this.GET_UOM = this.host + '/api/Packs/query';
    this.GET_ALLUOM = this.host + '/api/Packs/queryAllPack';
    this.GET_OTHERUOM = this.host + '/api/Packs/queryOtherUOM';

    this._INSERT_PACK = this.host + '/api/Packs/_insert';
    this._UPDATE_PACK = this.host + '/api/Packs/_update';
    this._SAVE_PACK = this.host + '/api/Packs/_save';

    this.GETLIST_LOCATION = this.host + '/api/Locs/getlistlocation';
    this.LIST_LOCATION = this.host + '/api/Locs/list';
    this.FIND_LOCATION = this.host + '/api/Locs/find';
    this.INSERT_LOCATION = this.host + '/api/Locs/insert';
    this.UPDATE_LOCATION = this.host + '/api/Locs/update';

    this._INSERT_LOCATION = this.host + '/api/Locs/_insert';
    this._UPDATE_LOCATION = this.host + '/api/Locs/_update';
    this._SAVE_LOCATION = this.host + '/api/Locs/_save';

    this.GETLIST_ZONE = this.host + '/api/Putawayzones/getlistputawayzone';
    this.LIST_ZONE = this.host + '/api/Putawayzones/list';
    this.INSERT_ZONE = this.host + '/api/Putawayzones/insert';
    this.UPDATE_ZONE = this.host + '/api/Putawayzones/update';
    this.FIND_ZONE = this.host + '/api/Putawayzones/find';

    this._INSERT_ZONE = this.host + '/api/Putawayzones/_insert';
    this._UPDATE_ZONE = this.host + '/api/Putawayzones/_update';
    this._SAVE_ZONE = this.host + '/api/Putawayzones/_save';

    this.LIST_LINE = this.host + '/api/Lines/list';
    this.INSERT_LINE = this.host + '/api/Lines/insert';
    this.UPDATE_LINE = this.host + '/api/Lines/update';
    this.FIND_LINE = this.host + '/api/Lines/find';

    this._INSERT_LINE = this.host + '/api/Lines/_insert';
    this._UPDATE_LINE = this.host + '/api/Lines/_update';
    this._SAVE_LINE = this.host + '/api/Lines/_save';

    this.GETLIST_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/getlistputawaystrategy';
    this.LIST_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/list';
    this.FIND_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/find';
    this.INSERT_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/insert';
    this.UPDATE_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/update';

    this._INSERT_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/_insert';
    this._UPDATE_PUTAWAYSTRATEGIES = this.host + '/api/Putawaystrategies/_update';

    this.LIST_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/list';
    this.FIND_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/find';
    this.INSERT_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/insert';
    this.UPDATE_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/update';

    this._INSERT_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/_insert';
    this._UPDATE_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/_update';
    this._SAVE_PUTAWAYSTRATEGYDETAILS = this.host + '/api/Putawaystrategydetails/_save';

    this.GETLIST_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/getlistallocatestrategy';
    this.LIST_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/list';
    this.FIND_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/find';
    this.INSERT_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/insert';
    this.UPDATE_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/update';

    this._INSERT_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/_insert';
    this._UPDATE_ALLOCATESTRATEGY = this.host + '/api/Allocatestrategies/_update';

    this.LIST_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/list';
    this.FIND_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/find';
    this.INSERT_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/insert';
    this.UPDATE_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/update';

    this._INSERT_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/_insert';
    this._UPDATE_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/_update';
    this._SAVE_ALLOCATESTRATEGYDETAILS = this.host + '/api/Allocatestrategydetails/_save';

    this.LIST_CODELIST = this.host + '/api/Codelists/list';
    this.FIND_CODELIST = this.host + '/api/Codelists/find';
    this.INSERT_CODELIST = this.host + '/api/Codelists/insert';
    this.UPDATE_CODELIST = this.host + '/api/Codelists/update';

    this._INSERT_CODELIST = this.host + '/api/Codelists/_insert';
    this._UPDATE_CODELIST = this.host + '/api/Codelists/_update';

    this.LIST_SKU = this.host + '/api/Skus/list';
    this.LISTBYOWNER_SKU = this.host + '/api/Skus/listbyowner';
    this.SAVE_SKU = this.host + '/api/Skus/save';
    this.INSERT_SKU = this.host + '/api/Skus/insert';
    this.UPDATE_SKU = this.host + '/api/Skus/update';
    this.FIND_SKU = this.host + '/api/Skus/find';
    this.PRINT_SKU = this.host + '/api/Skus/print';

    this._INSERT_SKU = this.host + '/api/Skus/_insert';
    this._UPDATE_SKU = this.host + '/api/Skus/_update';
    this._SAVE_SKU = this.host + '/api/Skus/_save';

    this.GETLIST_CODELKUP = this.host + '/api/Codelkups/getlistcodelkup';
    this.LIST_CODELKUP = this.host + '/api/Codelkups/list';
    this.FIND_CODELKUP = this.host + '/api/Codelkups/find';
    this.INSERT_CODELKUP = this.host + '/api/Codelkups/insert';

    this._GETLIST_CODELKUP = this.host + '/api/Codelkups/_getlistcodelkup';
    this._LIST_CODELKUP = this.host + '/api/Codelkups/_list';
    this._INSERT_CODELKUP = this.host + '/api/Codelkups/_insert';
    this._UPDATE_CODELKUP = this.host + '/api/Codelkups/_update  ';

    this.LIST_SUPPLIER = this.host + '/api/Lines/list';
    this.SAVE_SUPPLIER = this.host + '/api/Lines/save';
    this.FIND_SUPPLIER = this.host + '/api/Lines/find';

    this.FIND_TASKDETAIL = this.host + '/api/Taskdetails/find';

    this.LIST_INVENTORY = this.host + '/api/Inventories/list';
    this.COUNT_INVENTORY = this.host + '/api/Inventories/count'
    this.FIND_INVENTORY = this.host + '/api/Inventories/find';
    this.TRANSACTION_QTY = this.host + '/api/Inventories/tQty';
    this.TRANSACTION_QTYMOVE = this.host + '/api/Inventories/tQtymove';
    this.TRANSACTION_CHANGESTATUS = this.host + '/api/Inventories/tChangeStatus';
    this._SAVETOPREMOVE = this.host + '/api/Inventories/_saveToPreMove';
    this.CREATESHORTID = this.host + '/api/Inventories/CreateShortId';
    this.TRANSACTION_QTYPREMOVE = this.host + '/api/Inventories/tQtyPreMove';
    this.TRANSACTION_TRANSFERINTERNAL = this.host + '/api/Inventories/tTransferInternal';
    this.SAVE_TOTRANSFER = this.host + '/api/Inventories/saveToTransfer';
    this.DELETE_TRANSFER = this.host + '/api/Inventories/tDeleteTransfer';
    this.FIND_TRANSFERDETAIL = this.host + '/api/Transferdetails/find'
    this.TRANSACTION_LOTUPDATE = this.host + '/api/Inventories/tLotUpdate';
    this.LIST_INVENTORY_REPORT = this.host + '/api/Inventories/listReport';
    this.HAVE_STOCK_INVENTORY = this.host + '/api/Inventories/havestockinventory';

    this.LIST_ORDERS = this.host + '/api/Orders/list';
    this.GETLIST_ORDERS = this.host + '/api/Orders/getlist';
    this.FIND_ORDERS = this.host + '/api/Orders/find';
    this.INSERT_ORDERS = this.host + '/api/Orders/insert';
    this.UPDATE_ORDERS = this.host + '/api/Orders/update';
    this.DELETE_ORDERS = this.host + '/api/Orders/deleteorder';
    this.GET_SKU = this.host + '/api/Orders/getsku';
    this.TOTALDETAIL = this.host + '/api/Orders/totalDetail';
    this.CREATE_ORDERS = this.host + '/api/Orders/create'
    this.UPDATE_TIME_DOCK_ORDER = this.host + '/api/Orders/updateTimeForDock';

    this.LIST_ORDERSDETAIL = this.host + '/api/Orderdetails/list';
    this.FIND_ORDERSDETAIL = this.host + '/api/Orderdetails/find';
    this.FINDONE_ORDERSDETAIL = this.host + '/api/Orderdetails/findone';
    this.INSERT_ORDERSDETAIL = this.host + '/api/Orderdetails/insert';
    this.UPDATE_ORDERSDETAIL = this.host + '/api/Orderdetails/_update';
    this.DELETE_ORDERSDETAIL = this.host + '/api/Orderdetails/deleteorderdetail';

    this.LIST_LOTXLOCXID = this.host + '/api/Lotxlocxids/list';
    this.INSERT_LOTXLOCXID = this.host + '/api/Lotxlocxids/insert';
    this.UPDATE_LOTXLOCXID = this.host + '/api/Lotxlocxids/update';

    this.LIST_SKUXLOC = this.host + '/api/Skuxlocs/list';
    this.INSERT_SKUXLOC = this.host + '/api/Skuxlocs/insert';
    this.UPDATE_SKUXLOC = this.host + '/api/Skuxlocs/update';

    this.LIST_LOT = this.host + '/api/Lots/list';
    this.INSERT_LOT = this.host + '/api/Lots/insert';
    this.UPDATE_LOT = this.host + '/api/Lots/update';

    this.FIND_lPNID = this.host + '/api/Lpnids/find';

    this.LIST_PICKDETAIL = this.host + '/api/Pickdetails/list';
    this.GET_PICKDETAIL = this.host + '/api/Pickdetails/get';

    this.LIST_MASTERPICK = this.host + '/api/MasterPicks/list';
    this.FIND_MASTERPICK = this.host + '/api/MasterPicks/find';
    this.INSERT_MASTERPICK = this.host + '/api/MasterPicks/insert';
    this.UPDATE_MASTERPICK = this.host + '/api/MasterPicks/update';

    this.WAREHOUSERECEIPT_REPORT = this.host + '/api/Reports/warehousereceipt';
    this.PUTAWAYLIST_REPORT = this.host + '/api/Reports/putawaylist';
    this.PALLETLABEL_REPORT = this.host + '/api/Reports/palletlabel';
    this.DEVILERYNOTE_REPORT = this.host + '/api/Reports/devilerynote';
    this.PICKINGLIST_REPORT = this.host + '/api/Reports/pickinglist';
    this.MASTERPICK_REPORT = this.host + '/api/Reports/masterpick';

    this.STOCKCOUNT_REPORT = this.host + '/api/Reports/stockcount';
    this.STOCKCOUNT_TIMES_REPORT = this.host + '/api/Reports/stockcounttimes';

    this.CODE128_BARCODE = this.host + '/api/Reports/barcode/code128';

    this.LIST_PREMOVE = this.host + '/api/Premoves/list';
    this.INSERT_PREMOVE = this.host + '/api/Premoves/insert';
    this.UPDATE_PREMOVE = this.host + '/api/Premoves/update';
    this.FIND_PREMOVE = this.host + '/api/Premoves/find';

    this.LISTFULLCOUNT_STOCKCOUNT = this.host + '/api/Stockcounts/listfullcount';
    this.LISTSKU_STOCKCOUNT = this.host + '/api/Stockcounts/listsku';
    this.LISTZONELOC_STOCKCOUNT = this.host + '/api/Stockcounts/listzoneloc';
    this.LISTSTOCKCOUNT_STOCKCOUNT = this.host + '/api/Stockcounts/liststockcount';
    this.LISTCHANGEINDATE_STOCKCOUNT = this.host + '/api/Stockcounts/listchangeindate';
    this.INSERT_STOCKCOUNT = this.host + '/api/Stockcounts/insert';
    this.UPDATE_STOCKCOUNT = this.host + '/api/Stockcounts/update';
    this.FIND_STOCKCOUNT = this.host + '/api/Stockcounts/find';
    this.LIST_STOCKCOUNT = this.host + '/api/Stockcounts/list';

    this.INSERT_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/insert';
    this.INSERTMANY_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/insertmany';
    this.UPDATE_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/update';
    this.FIND_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/find';
    this.LIST_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/list';
    this.GETINVENTORY_STOCKCOUNTDETAIL = this.host + '/api/Stockcountdetails/getinventory';

    this.TOTALORDER_STATISTICS = this.host + '/api/Statistics/totalorder';
    this.TOTALORDERBYOWNER_STATISTICS = this.host + '/api/Statistics/totalorderbyowner';
    this.TOTALORDERBYDATE_STATISTICS = this.host + '/api/Statistics/totalorderbydate';
    this.TOTALBYGROSSWGT_STATISTICS = this.host + '/api/Statistics/totalbygrosswgt';
    this.TOTALBYCUBE_STATISTICS = this.host + '/api/Statistics/totalbycube';
    this.SO_STATISTICS = this.host + '/api/Statistics/so';
    this.ASN_STATISTICS = this.host + '/api/Statistics/asn';

    this.LISTDETAIL_INBOUNDREPORT = this.host + '/api/Inboundreports/getlist';
    this.LISTSUMMARY_INBOUNDREPORT = this.host + '/api/Inboundreports/getlistsummary';

    this.LISTDETAIL_OUTBOUNDREPORT = this.host + '/api/Outboundreports/getlistdetail';
    this.LISTSUMMARY_OUTBOUNDREPORT = this.host + '/api/Outboundreports/getlistsummary';

    this.LIST_SHIPCODE = this.host + '/api/Shipcodes/list';
    this.FIND_SHIPCODE = this.host + '/api/Shipcodes/find';
    this.INSERT_SHIPCODE = this.host + '/api/Shipcodes/insert';
    this.UPDATE_SHIPCODE = this.host + '/api/Shipcodes/update';
    this.SAVE_SHIPCODE = this.host + '/api/Shipcodes/save';

    this.LIST_TARIFF = this.host + '/api/Tariffs/list';
    this.FIND_TARIFF = this.host + '/api/Tariffs/find';
    this.INSERT_TARIFF = this.host + '/api/Tariffs/insert';
    this.UPDATE_TARIFF = this.host + '/api/Tariffs/update';

    this.LIST_TARIFFDETAIL = this.host + '/api/Tariffdetails/list';
    this.FIND_TARIFFDETAIL = this.host + '/api/Tariffdetails/find';
    this.INSERT_TARIFFDETAIL = this.host + '/api/Tariffdetails/insert';
    this.UPDATE_TARIFFDETAIL = this.host + '/api/Tariffdetails/update';

    this.FIND_HELP = this.host + "/api/Help/findHelp";
    this.UPDATE_HELP = this.host + "/api/Help/updateHelp";
    this.INSERT_HELP = this.host + "/api/Help/insertHelp";

    this.LIST_CHARGE = this.host + '/api/Charges/list';
    this.FIND_CHARGE = this.host + '/api/Charges/find';
    this.INSERT_CHARGE = this.host + '/api/Charges/insert';
    this.UPDATE_CHARGE = this.host + '/api/Charges/update';

    this.LIST_CHARGETYPE = this.host + '/api/Chargetypes/list';
    this.FIND_CHARGETYPE = this.host + '/api/Chargetypes/find';
    this.INSERT_CHARGETYPE = this.host + '/api/Chargetypes/insert';
    this.UPDATE_CHARGETYPE = this.host + '/api/Chargetypes/update';

    this.LIST_TRANSACTION = this.host + '/api/Transactions/list';
    this.LIST_TRANSACTIONBYDATE = this.host + '/api/Transactions/listbydate';

    this.TRANSACTION_DOCK_INBOUND = this.host + '/api/Docks/tInbound';
    this.TRANSACTION_TRANSFER_DROP_ID = this.host + '/api/Dropids/tTransferCartonId';
    this.LIST_SO_DOCK = this.host + '/api/Orders/listForDock';
    this.INSERT_DROP_ID = this.host + '/api/Dropids/insert';
    this.UPDATE_DROP_ID = this.host + '/api/Dropids/update';
    this.FIND_DROP_ID = this.host + '/api/Dropids/find';
    this.LIST_DROP_ID = this.host + '/api/Dropids/list';
    this.LIST_ORDER_ID = this.host + '/api/Orders/listForDock';
    this.TRANSACTION_DOCK_OUTBOUND = this.host + '/api/Docks/tOutBound';


    this.LIST_CHECKIN = this.host + '/api/Checkins/list';
    this.INSERT_CHECKIN = this.host + '/api/Checkins/insert';
    this.FIND_CHECKIN = this.host + '/api/Checkins/find';
    this.UPDATE_CHECKIN = this.host + '/api/Checkins/update';

  }

  constructor(private http: Http,
    private router: Router,
    private authService: AuthService,
    private notifyService: NotifyService,
    private configService: ConfigService) {
    this.host = this.configService.clientConfig.host;
    this.host_auth = this.configService.clientConfig.hostAuth;
    this.update();
  }

  /* FUNCTION */
  checkToken(data, component): any {
    return this.handleAPI(this.CHECK_TOKEN, data, component);
  }
  checkCrossDomainToken(data, component): any {
    return this.handleAPI(this.CHECKCROSSDOMAIN_TOKEN, data, component);
  }
  findUsers(data, component): any {
    return this.handleAPI(this.FIND_USERS, data, component);
  }
  signOut(data, component): any {
    return this.handleAPI(this.SIGNOUT, data, component);
  }
  getlistWarehouseUsers(data, component): any {
    return this.handleAPI(this.GETLISTWAREHOUSE_USERS, data, component);
  }
  getlistOwnerUsers(data, component): any {
    return this.handleAPI(this.GETLISTOWNER_USERS, data, component);
  }
  getlistMenuUsers(data, component): any {
    return this.handleAPI(this.GETLISTMENU_USERS, data, component);
  }

  afterSigninUser(data, component): any {
    return this.handleAPI(this.AFTERSIGNIN_USER, data, component);
  }

  changeWarehouse(data, component): any {
    return this.handleAPI(this.CHANGE_WAREHOUSE, data, component);
  }

  signinWMSUsers(data, component): any {
    return this.handleAPI(this.SIGNIN_USER, data, component);
  }
  updateUsers(data, component): any {
    return this.handleAPI(this.UPDATE_USERS, data, component);
  }
  changePasswordUsers(data, component): any {
    return this.handleAPI(this.CHANGEPASSWORD_USERS, data, component);
  }
  forgotPasswordWMSUsers(data, component): any {
    return this.handleAPI(this.FORGOTPASSWORD_USERS, data, component);
  }
  getApps(data, component): any {
    return this.handleAPI(this.GET_APPS, data, component);
  }
  findOwner(data, component): any {
    return this.handleAPI(this.FINDOWNER_STORER, data, component);
  }
  getlistOwnerByWarehouse(data, component): any {
    return this.handleAPI(this.GETLISTOWNERBYWAREHOUSE_STORER, data, component);
  }

  receiptAll(data, component): any {
    return this.handleAPI(this.RECEIPTALL, data, component);
  }
  receiptByItem(data, component): any {
    return this.handleAPI(this.RECEIPTBYITEM, data, component);
  }
  unReceiptAll(data, component): any {
    return this.handleAPI(this.UNRECEIPTALL, data, component);
  }
  unReceiptByItem(data, component): any {
    return this.handleAPI(this.UNRECEIPTBYITEM, data, component);
  }
  receipt(data, component): any {
    return this.handleAPI(this.RECEIPT, data, component);
  }
  unreceipt(data, component): any {
    return this.handleAPI(this.UNRECEIPT, data, component);
  }
  updateStatusReceipt(data, component): any {
    return this.handleAPI(this.UPDATESTATUSRECEIPT, data, component);
  }
  putaway(data, component): any {
    return this.handleAPI(this.PUTAWAY, data, component);
  }
  confirmPutaway(data, component): any {
    return this.handleAPI(this.CONFIRMPUTAWAY, data, component);
  }
  getListAllocatemanual(data, component): any {
    return this.handleAPI(this.GETLIST_ALLOCATEMANUAL, data, component);
  }
  updateStatusOrder(data, component): any {
    return this.handleAPI(this.UPDATE_STATUSORDER, data, component);
  }

  //new version
  orderAllocateByStratugy(data, component): any {
    return this.handleAPI(this.ORDERALLOCATEBYSTRATEGY2, data, component);
  }
  unAllocateAll(data, component): any {
    return this.handleAPI(this.UNALLOCATEALL, data, component);
  }
  unAllocateItemSelect(data, component): any {
    return this.handleAPI(this.UNALLOCATEBYITEMSELECT, data, component);
  }
  pickAll(data, component): any {
    return this.handleAPI(this.PICKALL, data, component);
  }
  pickItemSelect(data, component): any {
    return this.handleAPI(this.PICKBYITEMSELECT, data, component);
  }
  unPickAll(data, component): any {
    return this.handleAPI(this.UNPICKALL, data, component);
  }
  unPickItemSelect(data, component): any {
    return this.handleAPI(this.UNPICKBYITEMSELECT, data, component);
  }
  unShipAll(data, component): any {
    return this.handleAPI(this.SHIPALL, data, component);
  }
  unShipItemSelect(data, component): any {
    return this.handleAPI(this.SHIPBYITEMSELECT, data, component);
  }
  
  


  allocate(data, component): any {
    return this.handleAPI(this.ALLOCATE, data, component);
  }
  allocatemanual(data, component): any {
    return this.handleAPI(this.ALLOCATEMANUAL, data, component);
  }
  allocatebystrategy(data, component): any {
    return this.handleAPI(this.ALLOCATEBYSTRATEGY, data, component);
  }
  unallocatebyorder(data, component): any {
    return this.handleAPI(this.UNALLOCATEBYORDER, data, component);
  }
  pick(data, component): any {
    return this.handleAPI(this.PICK, data, component);
  }
  unPick(data, component): any {
    return this.handleAPI(this.UNPICK, data, component);
  }
  pickbyorder(data, component): any {
    return this.handleAPI(this.PICKBYORDER, data, component);
  }
  ship(data, component): any {
    return this.handleAPI(this.SHIP, data, component);
  }
  shipbyorder(data, component): any {
    return this.handleAPI(this.SHIPBYORDER, data, component);
  }
  shippickdetail(data, component): any {
    return this.handleAPI(this.SHIPPICKDETAIL, data, component);
  }
  pickpickdetail(data, component): any {
    return this.handleAPI(this.PICKPICKDETAIL, data, component);
  }


 



  listReceipt(data, component): any {
    return this.handleAPI(this.LIST_RECEIPT, data, component);
  }
  getlistReceipt(data, component): any {
    return this.handleAPI(this.GETLIST_RECEIPT, data, component);
  }
  findReceipt(data, component): any {
    return this.handleAPI(this.FIND_RECEIPT, data, component);
  }
  checkReceipt(data, component): any {
    return this.handleAPI(this.CHECK_RECEIPT, data, component);
  }
  deteleReceipt(data, component): any {
    return this.handleAPI(this.DELETE_RECEIPT, data, component);
  }
  insertReceipt(data, component): any {
    return this.handleAPI(this.INSERT_RECEIPT, data, component);
  }

  createReceipt(data, component): any {
    return this.handleAPI(this.CREATE_RECEIPT, data, component);
  }

  updateReceipt(data, component): any {
    return this.handleAPI(this.UPDATE_RECEIPT, data, component);
  }

  categorySKU(data, component): any {
    return this.handleAPI(this.CATEGORY_SKU, data, component);
  }

  listReceiptDetail(data, component): any {
    return this.handleAPI(this.LIST_RECEIPTDETAIL, data, component);
  }
  findReceiptDetail(data, component): any {
    return this.handleAPI(this.FIND_RECEIPTDETAIL, data, component);
  }
  insertReceiptDetail(data, component): any {
    return this.handleAPI(this.INSERT_RECEIPTDETAIL, data, component);
  }
  updateReceiptDetail(data, component): any {
    return this.handleAPI(this.UPDATE_RECEIPTDETAIL, data, component);
  }
  deleteReceiptDetail(data, component): any {
    return this.handleAPI(this.DELETE_RECEIPTDETAIL, data, component);
  }
  listStorer(data, component): any {
    return this.handleAPI(this.LIST_STORER, data, component);
  }
  getlistStorer(data, component): any {
    return this.handleAPI(this.GETLIST_STORER, data, component);
  }
  findStorer(data, component): any {
    return this.handleAPI(this.FIND_STORER, data, component);
  }
  insertStorer(data, component): any {
    return this.handleAPI(this.INSERT_STORER, data, component);
  }
  updateStorer(data, component): any {
    return this.handleAPI(this.UPDATE_STORER, data, component);
  }
  listOneStorer(data, component): any {
    return this.handleAPI(this.LIST_ONESTORER, data, component);
  }

  _insertStorer(data, component): any {
    return this.handleAPI(this._INSERT_STORER, data, component);
  }
  _updateStorer(data, component): any {
    return this.handleAPI(this._UPDATE_STORER, data, component);
  }
  _saveStorer(data, component): any {
    return this.handleAPI(this._SAVE_STORER, data, component);
  }

  listCustomergroup(data, component): any {
    return this.handleAPI(this.LIST_CUSTOMERGROUP, data, component);
  }
  findCustomergroup(data, component): any {
    return this.handleAPI(this.FIND_CUSTOMERGROUP, data, component);
  }
  insertCustomergroup(data, component): any {
    return this.handleAPI(this.INSERT_CUSTOMERGROUP, data, component);
  }
  updateCustomergroup(data, component): any {
    return this.handleAPI(this.UPDATE_CUSTOMERGROUP, data, component);
  }

  _insertCustomergroup(data, component): any {
    return this.handleAPI(this._INSERT_CUSTOMERGROUP, data, component);
  }
  _updateCustomergroup(data, component): any {
    return this.handleAPI(this._UPDATE_CUSTOMERGROUP, data, component);
  }
  _saveCustomergroup(data, component): any {
    return this.handleAPI(this._SAVE_CUSTOMERGROUP, data, component);
  }

  listBom(data, component): any {
    return this.handleAPI(this.LIST_BOM, data, component);
  }
  queryBom(data, component): any {
    return this.handleAPI(this.QUERY_BOM, data, component);
  }
  findBom(data, component): any {
    return this.handleAPI(this.FIND_BOM, data, component);
  }
  insertBom(data, component): any {
    return this.handleAPI(this.INSERT_BOM, data, component);
  }
  updateBom(data, component): any {
    return this.handleAPI(this.UPDATE_BOM, data, component);
  }
  saveBom(data, component): any {
    return this.handleAPI(this.SAVE_BOM, data, component);
  }

  listPack(data, component): any {
    return this.handleAPI(this.LIST_PACK, data, component);
  }
  getListPack(data, component): any {
    return this.handleAPI(this.GETLIST_PACK, data, component);
  }
  insertPack(data, component): any {
    return this.handleAPI(this.INSERT_PACK, data, component);
  }
  updatePack(data, component): any {
    return this.handleAPI(this.UPDATE_PACK, data, component);
  }

  _insertPack(data, component): any {
    return this.handleAPI(this._INSERT_PACK, data, component);
  }
  _updatePack(data, component): any {
    return this.handleAPI(this._UPDATE_PACK, data, component);
  }
  _savePack(data, component): any {
    return this.handleAPI(this._SAVE_PACK, data, component);
  }

  findPack(data, component): any {
    return this.handleAPI(this.FIND_PACK, data, component);
  }
  deletePack(data, component): any {
    return this.handleAPI(this.DELETE_PACK, data, component);
  }
  getUOM(data, component): any {
    return this.handleAPI(this.GET_UOM, data, component);
  }

  getAllUOM(data, component): any {
    return this.handleAPI(this.GET_ALLUOM, data, component);
  }

  getOtherUOM(data, component): any {
    return this.handleAPI(this.GET_OTHERUOM, data, component);
  }

  listLocation(data, component): any {
    return this.handleAPI(this.LIST_LOCATION, data, component);
  }
  getlistLocation(data, component): any {
    return this.handleAPI(this.GETLIST_LOCATION, data, component);
  }
  findLocation(data, component): any {
    return this.handleAPI(this.FIND_LOCATION, data, component);
  }
  insertLocation(data, component): any {
    return this.handleAPI(this.INSERT_LOCATION, data, component);
  }
  updateLocation(data, component): any {
    return this.handleAPI(this.UPDATE_LOCATION, data, component);
  }

  _insertLocation(data, component): any {
    return this.handleAPI(this._INSERT_LOCATION, data, component);
  }
  _updateLocation(data, component): any {
    return this.handleAPI(this._UPDATE_LOCATION, data, component);
  }
  _saveLocation(data, component): any {
    return this.handleAPI(this._SAVE_LOCATION, data, component);
  }

  listZone(data, component): any {
    return this.handleAPI(this.LIST_ZONE, data, component);
  }
  getListZone(data, component): any {
    return this.handleAPI(this.GETLIST_ZONE, data, component);
  }
  insertZone(data, component): any {
    return this.handleAPI(this.INSERT_ZONE, data, component);
  }
  updateZone(data, component): any {
    return this.handleAPI(this.UPDATE_ZONE, data, component);
  }
  findZone(data, component): any {
    return this.handleAPI(this.FIND_ZONE, data, component);
  }

  _insertZone(data, component): any {
    return this.handleAPI(this._INSERT_ZONE, data, component);
  }
  _updateZone(data, component): any {
    return this.handleAPI(this._UPDATE_ZONE, data, component);
  }
  _saveZone(data, component): any {
    return this.handleAPI(this._SAVE_ZONE, data, component);
  }

  listLine(data, component): any {
    return this.handleAPI(this.LIST_LINE, data, component);
  }
  insertLine(data, component): any {
    return this.handleAPI(this.INSERT_LINE, data, component);
  }
  updateLine(data, component): any {
    return this.handleAPI(this.UPDATE_LINE, data, component);
  }
  findLine(data, component): any {
    return this.handleAPI(this.FIND_LINE, data, component);
  }

  _insertLine(data, component): any {
    return this.handleAPI(this._INSERT_LINE, data, component);
  }
  _updateLine(data, component): any {
    return this.handleAPI(this._UPDATE_LINE, data, component);
  }
  _saveLine(data, component): any {
    return this.handleAPI(this._SAVE_LINE, data, component);
  }

  listPutawaystrategies(data, component): any {
    return this.handleAPI(this.LIST_PUTAWAYSTRATEGIES, data, component);
  }
  getListPutawaystrategies(data, component): any {
    return this.handleAPI(this.GETLIST_PUTAWAYSTRATEGIES, data, component);
  }
  findPutawaystrategies(data, component): any {
    return this.handleAPI(this.FIND_PUTAWAYSTRATEGIES, data, component);
  }
  insertPutawaystrategies(data, component): any {
    return this.handleAPI(this.INSERT_PUTAWAYSTRATEGIES, data, component);
  }
  updatePutawaystrategies(data, component): any {
    return this.handleAPI(this.UPDATE_PUTAWAYSTRATEGIES, data, component);
  }

  _insertPutawaystrategies(data, component): any {
    return this.handleAPI(this._INSERT_PUTAWAYSTRATEGIES, data, component);
  }
  _updatePutawaystrategies(data, component): any {
    return this.handleAPI(this._UPDATE_PUTAWAYSTRATEGIES, data, component);
  }

  listPutawaystrategydetails(data, component): any {
    return this.handleAPI(this.LIST_PUTAWAYSTRATEGYDETAILS, data, component);
  }
  findPutawaystrategydetails(data, component): any {
    return this.handleAPI(this.FIND_PUTAWAYSTRATEGYDETAILS, data, component);
  }
  insertPutawaystrategydetails(data, component): any {
    return this.handleAPI(this.INSERT_PUTAWAYSTRATEGYDETAILS, data, component);
  }
  updatePutawaystrategydetails(data, component): any {
    return this.handleAPI(this.UPDATE_PUTAWAYSTRATEGYDETAILS, data, component);
  }

  _insertPutawaystrategydetails(data, component): any {
    return this.handleAPI(this._INSERT_PUTAWAYSTRATEGYDETAILS, data, component);
  }
  _updatePutawaystrategydetails(data, component): any {
    return this.handleAPI(this._UPDATE_PUTAWAYSTRATEGYDETAILS, data, component);
  }
  _savePutawaystrategydetails(data, component): any {
    return this.handleAPI(this._SAVE_PUTAWAYSTRATEGYDETAILS, data, component);
  }

  listAllocatestrategy(data, component): any {
    return this.handleAPI(this.LIST_ALLOCATESTRATEGY, data, component);
  }
  getListAllocatestrategy(data, component): any {
    return this.handleAPI(this.GETLIST_ALLOCATESTRATEGY, data, component);
  }



  findAllocatestrategy(data, component): any {
    return this.handleAPI(this.FIND_ALLOCATESTRATEGY, data, component);
  }
  insertAllocatestrategy(data, component): any {
    return this.handleAPI(this.INSERT_ALLOCATESTRATEGY, data, component);
  }
  updateAllocatestrategy(data, component): any {
    return this.handleAPI(this.UPDATE_ALLOCATESTRATEGY, data, component);
  }

  _insertAllocatestrategy(data, component): any {
    return this.handleAPI(this._INSERT_ALLOCATESTRATEGY, data, component);
  }
  _updateAllocatestrategy(data, component): any {
    return this.handleAPI(this._UPDATE_ALLOCATESTRATEGY, data, component);
  }

  listAllocatestrategydetails(data, component): any {
    return this.handleAPI(this.LIST_ALLOCATESTRATEGYDETAILS, data, component);
  }
  findAllocatestrategydetails(data, component): any {
    return this.handleAPI(this.FIND_ALLOCATESTRATEGYDETAILS, data, component);
  }
  insertAllocatestrategydetails(data, component): any {
    return this.handleAPI(this.INSERT_ALLOCATESTRATEGYDETAILS, data, component);
  }
  updateAllocatestrategydetails(data, component): any {
    return this.handleAPI(this.UPDATE_ALLOCATESTRATEGYDETAILS, data, component);
  }

  _insertAllocatestrategydetails(data, component): any {
    return this.handleAPI(this._INSERT_ALLOCATESTRATEGYDETAILS, data, component);
  }
  _updateAllocatestrategydetails(data, component): any {
    return this.handleAPI(this._UPDATE_ALLOCATESTRATEGYDETAILS, data, component);
  }
  _saveAllocatestrategydetails(data, component): any {
    return this.handleAPI(this._SAVE_ALLOCATESTRATEGYDETAILS, data, component);
  }

  listCodelist(data, component): any {
    return this.handleAPI(this.LIST_CODELIST, data, component);
  }
  findCodelist(data, component): any {
    return this.handleAPI(this.FIND_CODELIST, data, component);
  }
  insertCodelist(data, component): any {
    return this.handleAPI(this.INSERT_CODELIST, data, component);
  }
  updateCodelist(data, component): any {
    return this.handleAPI(this.UPDATE_CODELIST, data, component);
  }

  _insertCodelist(data, component): any {
    return this.handleAPI(this._INSERT_CODELIST, data, component);
  }
  _updateCodelist(data, component): any {
    return this.handleAPI(this._UPDATE_CODELIST, data, component);
  }

  listSku(data, component): any {
    return this.handleAPI(this.LIST_SKU, data, component);
  }
  listSkuByOwner(data, component): any {
    return this.handleAPI(this.LISTBYOWNER_SKU, data, component);
  }
  saveSku(data, component): any {
    return this.handleAPI(this.SAVE_SKU, data, component);
  }
  insertSku(data, component): any {
    return this.handleAPI(this.INSERT_SKU, data, component);
  }
  updateSku(data, component): any {
    return this.handleAPI(this.UPDATE_SKU, data, component);
  }
  findSku(data, component): any {
    return this.handleAPI(this.FIND_SKU, data, component);
  }
  printSku(data, component): any {
    return this.handleAPI(this.PRINT_SKU, data, component);
  }

  _insertSku(data, component): any {
    return this.handleAPI(this._INSERT_SKU, data, component);
  }
  _updateSku(data, component): any {
    return this.handleAPI(this._UPDATE_SKU, data, component);
  }
  _saveSku(data, component): any {
    return this.handleAPI(this._SAVE_SKU, data, component);
  }

  listCodelkup(data, component): any {
    return this.handleAPI(this.LIST_CODELKUP, data, component);
  }
  getlistCodelkup(data, component): any {
    return this.handleAPI(this.GETLIST_CODELKUP, data, component);
  }
  findCodelkup(data, component): any {
    return this.handleAPI(this.FIND_CODELKUP, data, component);
  }
  insertCodelkup(data, component): any {
    return this.handleAPI(this.INSERT_CODELKUP, data, component);
  }
  updateCodelkup(data, component): any {
    return this.handleAPI(this.UPDATE_CODELKUP, data, component);
  }

  _getlistCodelkup(data, component): any {
    return this.handleAPI(this._GETLIST_CODELKUP, data, component);
  }
  _listCodelkup(data, component): any {
    return this.handleAPI(this._LIST_CODELKUP, data, component);
  }
  _insertCodelkup(data, component): any {
    return this.handleAPI(this._INSERT_CODELKUP, data, component);
  }
  _updateCodelkup(data, component): any {
    return this.handleAPI(this._UPDATE_CODELKUP, data, component);
  }

  listSupplier(data, component): any {
    return this.handleAPI(this.LIST_SUPPLIER, data, component);
  }
  saveSupplier(data, component): any {
    return this.handleAPI(this.SAVE_SUPPLIER, data, component);
  }
  findSupplier(data, component): any {
    return this.handleAPI(this.FIND_SUPPLIER, data, component);
  }

  findTaskdetail(data, component): any {
    return this.handleAPI(this.FIND_TASKDETAIL, data, component);
  }

  listInventory(data, component): any {
    return this.handleAPI(this.LIST_INVENTORY, data, component);
  }
  countInventory(data, component): any {
    return this.handleAPI(this.COUNT_INVENTORY, data, component);
  }


  findInventory(data, component): any {
    return this.handleAPI(this.FIND_INVENTORY, data, component);
  }
  transactionQty(data, component): any {
    return this.handleAPI(this.TRANSACTION_QTY, data, component);
  }
  transactionQtyMove(data, component): any {
    return this.handleAPI(this.TRANSACTION_QTYMOVE, data, component);
  }
  transactionChangeStatus(data, component): any {
    return this.handleAPI(this.TRANSACTION_CHANGESTATUS, data, component);
  }
  _saveToPreMove(data, component): any {
    return this.handleAPI(this._SAVETOPREMOVE, data, component);
  }
  createShortId(data, component): any {
    return this.handleAPI(this.CREATESHORTID, data, component);
  }
  transactionQtyPreMove(data, component): any {
    return this.handleAPI(this.TRANSACTION_QTYPREMOVE, data, component);
  }
  transactionQtyTransfer(data, component): any {
    return this.handleAPI(this.TRANSACTION_TRANSFERINTERNAL, data, component);
  }
  saveToTransfer(data, component): any {
    return this.handleAPI(this.SAVE_TOTRANSFER, data, component);
  }
  transactionLotUpdate(data, component): any {
    return this.handleAPI(this.TRANSACTION_LOTUPDATE, data, component);
  }
  listInventoryReport(data, component): any {
    return this.handleAPI(this.LIST_INVENTORY_REPORT, data, component);
  }

  listOrders(data, component): any {
    return this.handleAPI(this.LIST_ORDERS, data, component);
  }
  getlistOrders(data, component): any {
    return this.handleAPI(this.GETLIST_ORDERS, data, component);
  }
  findOrders(data, component): any {
    return this.handleAPI(this.FIND_ORDERS, data, component);
  }
  insertOrders(data, component): any {
    return this.handleAPI(this.INSERT_ORDERS, data, component);
  }
  updateOrders(data, component): any {
    return this.handleAPI(this.UPDATE_ORDERS, data, component);
  }
  deleteOrders(data, component): any {
    return this.handleAPI(this.DELETE_ORDERS, data, component);
  }
  getsku(data, component): any {
    return this.handleAPI(this.GET_SKU, data, component);
  }
  totaldetail(data, component): any {
    return this.handleAPI(this.TOTALDETAIL, data, component);
  }
  createOrder(data, component): any {
    return this.handleAPI(this.CREATE_ORDERS, data, component);
  }
  updateTimeOrderForDock(data, component): any {
    return this.handleAPI(this.UPDATE_TIME_DOCK_ORDER, data, component);
  }

  listLotxlocxid(data, component): any {
    return this.handleAPI(this.LIST_LOTXLOCXID, data, component);
  }
  insertLotxlocxid(data, component): any {
    return this.handleAPI(this.INSERT_LOTXLOCXID, data, component);
  }
  updateLotxlocxid(data, component): any {
    return this.handleAPI(this.UPDATE_LOTXLOCXID, data, component);
  }

  listOrdersDetail(data, component): any {
    return this.handleAPI(this.LIST_ORDERSDETAIL, data, component);
  }
  findOrdersDetail(data, component): any {
    return this.handleAPI(this.FIND_ORDERSDETAIL, data, component);
  }
  findOneOrderdetail(data, component): any {
    return this.handleAPI(this.FINDONE_ORDERSDETAIL, data, component);
  }
  insertOrdersDetail(data, component): any {
    return this.handleAPI(this.INSERT_ORDERSDETAIL, data, component);
  }
  updateOrdersDetail(data, component): any {
    return this.handleAPI(this.UPDATE_ORDERSDETAIL, data, component);
  }
  deleteOrdersDetail(data, component): any {
    return this.handleAPI(this.DELETE_ORDERSDETAIL, data, component);
  }

  listSkuxloc(data, component): any {
    return this.handleAPI(this.LIST_SKUXLOC, data, component);
  }
  insertSkuxloc(data, component): any {
    return this.handleAPI(this.INSERT_SKUXLOC, data, component);
  }
  updateSkuxloc(data, component): any {
    return this.handleAPI(this.UPDATE_SKUXLOC, data, component);
  }

  listLot(data, component): any {
    return this.handleAPI(this.LIST_LOT, data, component);
  }
  insertLot(data, component): any {
    return this.handleAPI(this.INSERT_LOT, data, component);
  }
  updateLot(data, component): any {
    return this.handleAPI(this.UPDATE_LOT, data, component);
  }

  findLpnid(data, component): any {
    return this.handleAPI(this.FIND_lPNID, data, component);
  }

  listPickdetail(data, component): any {
    return this.handleAPI(this.LIST_PICKDETAIL, data, component);
  }
  getPickdetail(data, component): any {
    return this.handleAPI(this.GET_PICKDETAIL, data, component);
  }

  listMasterPick(data, component): any {
    return this.handleAPI(this.LIST_MASTERPICK, data, component);
  }
  findMasterPick(data, component): any {
    return this.handleAPI(this.FIND_MASTERPICK, data, component);
  }
  insertMasterPick(data, component): any {
    return this.handleAPI(this.INSERT_MASTERPICK, data, component);
  }
  updateMasterPick(data, component): any {
    return this.handleAPI(this.UPDATE_MASTERPICK, data, component);
  }

  rptWarehouseReceipt(data, component): any {
    return this.handleAPI(this.WAREHOUSERECEIPT_REPORT, data, component);
  }
  rptPutAwayList(data, component): any {
    return this.handleAPI(this.PUTAWAYLIST_REPORT, data, component);
  }
  rptPalletLabel(data, component): any {
    return this.handleAPI(this.PALLETLABEL_REPORT, data, component);
  }
  rptDevileryNote(data, component): any {
    return this.handleAPI(this.DEVILERYNOTE_REPORT, data, component);
  }
  rptPickingList(data, component): any {
    return this.handleAPI(this.PICKINGLIST_REPORT, data, component);
  }
  rptMasterPick(data, component): any {
    return this.handleAPI(this.MASTERPICK_REPORT, data, component);
  }

  rptStockCount(data, component): any {
    return this.handleAPI(this.STOCKCOUNT_REPORT, data, component);
  }
  rptStockCountTime(data, component): any {
    return this.handleAPI(this.STOCKCOUNT_TIMES_REPORT, data, component);
  }

  barcode_code128(data, component): any {
    return this.handleAPI(this.CODE128_BARCODE, data, component);
  }
  findPremove(data, component): any {
    return this.handleAPI(this.FIND_PREMOVE, data, component);
  }

  listPremove(data, component): any {
    return this.handleAPI(this.LIST_PREMOVE, data, component);
  }
  insertPremove(data, component): any {
    return this.handleAPI(this.INSERT_PREMOVE, data, component);
  }
  updatePremove(data, component): any {
    return this.handleAPI(this.UPDATE_PREMOVE, data, component);
  }

  listFullCountStock(data, component): any {
    return this.handleAPI(this.LISTFULLCOUNT_STOCKCOUNT, data, component);
  }
  listSKUStock(data, component): any {
    return this.handleAPI(this.LISTSKU_STOCKCOUNT, data, component);
  }
  listZoneLocStock(data, component): any {
    return this.handleAPI(this.LISTZONELOC_STOCKCOUNT, data, component);
  }
  listStockCountStock(data, component): any {
    return this.handleAPI(this.LISTSTOCKCOUNT_STOCKCOUNT, data, component);
  }
  listChangeInDateStock(data, component): any {
    return this.handleAPI(this.LISTCHANGEINDATE_STOCKCOUNT, data, component);
  }
  insertStock(data, component): any {
    return this.handleAPI(this.INSERT_STOCKCOUNT, data, component);
  }
  updateStock(data, component): any {
    return this.handleAPI(this.UPDATE_STOCKCOUNT, data, component);
  }
  findStock(data, component): any {
    return this.handleAPI(this.FIND_STOCKCOUNT, data, component);
  }
  listStock(data, component): any {
    return this.handleAPI(this.LIST_STOCKCOUNT, data, component);
  }

  insertStockDetail(data, component): any {
    return this.handleAPI(this.INSERT_STOCKCOUNTDETAIL, data, component);
  }
  insertManyStockDetail(data, component): any {
    return this.handleAPI(this.INSERTMANY_STOCKCOUNTDETAIL, data, component);
  }
  updateStockDetail(data, component): any {
    return this.handleAPI(this.UPDATE_STOCKCOUNTDETAIL, data, component);
  }
  findStockDetail(data, component): any {
    return this.handleAPI(this.FIND_STOCKCOUNTDETAIL, data, component);
  }
  listStockDetail(data, component): any {
    return this.handleAPI(this.LIST_STOCKCOUNTDETAIL, data, component);
  }
  getInventoryStockDetail(data, component): any {
    return this.handleAPI(this.GETINVENTORY_STOCKCOUNTDETAIL, data, component);
  }

  findTransferDetail(data, component): any {
    return this.handleAPI(this.FIND_TRANSFERDETAIL, data, component);
  }
  transactionDeleteTransfer(data, component): any {
    return this.handleAPI(this.DELETE_TRANSFER, data, component);
  }
  totalOrderStatistics(data, component): any {
    return this.handleAPI(this.TOTALORDER_STATISTICS, data, component);
  }
  totalOrderByOwnerStatistics(data, component): any {
    return this.handleAPI(this.TOTALORDERBYOWNER_STATISTICS, data, component);
  }
  totalOrderByDateStatistics(data, component): any {
    return this.handleAPI(this.TOTALORDERBYDATE_STATISTICS, data, component);
  }
  TotalInBoundOutBoundByGrossWgtStatistics(data, component): any {
    return this.handleAPI(this.TOTALBYGROSSWGT_STATISTICS, data, component);
  }
  TotalInBoundOutBoundByCubeStatistics(data, component): any {
    return this.handleAPI(this.TOTALBYCUBE_STATISTICS, data, component);
  }
  SO_Statistics(data, component): any {
    return this.handleAPI(this.SO_STATISTICS, data, component);
  }
  ASN_Statistics(data, component): any {
    return this.handleAPI(this.ASN_STATISTICS, data, component);
  }

  listShipcode(data, component): any {
    return this.handleAPI(this.LIST_SHIPCODE, data, component);
  }
  findShipcode(data, component): any {
    return this.handleAPI(this.FIND_SHIPCODE, data, component);
  }
  insertShipcode(data, component): any {
    return this.handleAPI(this.INSERT_SHIPCODE, data, component);
  }
  updateShipcode(data, component): any {
    return this.handleAPI(this.UPDATE_SHIPCODE, data, component);
  }
  saveShipcode(data, component): any {
    return this.handleAPI(this.SAVE_SHIPCODE, data, component);
  }

  listTariff(data, component): any {
    return this.handleAPI(this.LIST_TARIFF, data, component);
  }
  findTariff(data, component): any {
    return this.handleAPI(this.FIND_TARIFF, data, component);
  }
  insertTariff(data, component): any {
    return this.handleAPI(this.INSERT_TARIFF, data, component);
  }
  updateTariff(data, component): any {
    return this.handleAPI(this.UPDATE_TARIFF, data, component);
  }

  listTariffdetail(data, component): any {
    return this.handleAPI(this.LIST_TARIFFDETAIL, data, component);
  }
  findTariffdetail(data, component): any {
    return this.handleAPI(this.FIND_TARIFFDETAIL, data, component);
  }
  insertTariffdetail(data, component): any {
    return this.handleAPI(this.INSERT_TARIFFDETAIL, data, component);
  }
  updateTariffdetail(data, component): any {
    return this.handleAPI(this.UPDATE_TARIFFDETAIL, data, component);
  }

  getListDetailInboundReport(data, component): any {
    return this.handleAPI(this.LISTDETAIL_INBOUNDREPORT, data, component);
  }
  getListSummaryInboundReport(data, component): any {
    return this.handleAPI(this.LISTSUMMARY_INBOUNDREPORT, data, component);
  }
  getListDetailOutboundReport(data, component): any {
    return this.handleAPI(this.LISTDETAIL_OUTBOUNDREPORT, data, component);
  }
  getListSummaryOutboundReport(data, component): any {
    return this.handleAPI(this.LISTSUMMARY_OUTBOUNDREPORT, data, component);
  }

  findHelp(data, component): any {
    return this.handleAPI(this.FIND_HELP, data, component);
  }
  insertHelp(data, component): any {
    return this.handleAPI(this.INSERT_HELP, data, component);
  }
  updateHelp(data, component): any {
    return this.handleAPI(this.UPDATE_HELP, data, component);
  }

  listCharge(data, component): any {
    return this.handleAPI(this.LIST_CHARGE, data, component);
  }
  findCharge(data, component): any {
    return this.handleAPI(this.FIND_CHARGE, data, component);
  }
  insertCharge(data, component): any {
    return this.handleAPI(this.INSERT_CHARGE, data, component);
  }
  updateCharge(data, component): any {
    return this.handleAPI(this.UPDATE_CHARGE, data, component);
  }

  listChargeType(data, component): any {
    return this.handleAPI(this.LIST_CHARGETYPE, data, component);
  }
  findChargeType(data, component): any {
    return this.handleAPI(this.FIND_CHARGETYPE, data, component);
  }
  insertChargeType(data, component): any {
    return this.handleAPI(this.INSERT_CHARGETYPE, data, component);
  }
  updateChargeType(data, component): any {
    return this.handleAPI(this.UPDATE_CHARGETYPE, data, component);
  }

  listTransaction(data, component): any {
    return this.handleAPI(this.LIST_TRANSACTION, data, component);
  }
  listTransactionByDate(data, component): any {
    return this.handleAPI(this.LIST_TRANSACTIONBYDATE, data, component);
  }

  insertExcelASN(data, component): any {
    return this.handleAPI(this.INSERTEXCELASN, data, component);
  }

  insertExcelOrder(data, component): any {
    return this.handleAPI(this.INSERTEXCELORDER, data, component);
  }

  listReceiptForDock(data, component): any {
    return this.handleAPI(this.LIST_RECEIPT_DOCK, data, component);
  }
  updateTimeReceiptForDock(data, component): any {
    return this.handleAPI(this.UPDATE_RECEIPT_DOCK_TIME, data, component);
  }
  totalReceiptDetail(data, component): any {
    return this.handleAPI(this.TOTALRECEIPTDETAIL, data, component);
  }


  transactionDockInbound(data, component): any {
    return this.handleAPI(this.TRANSACTION_DOCK_INBOUND, data, component);
  }
  transactionTransferCartonId(data, component): any {
    return this.handleAPI(this.TRANSACTION_TRANSFER_DROP_ID, data, component);
  }
  listDockSO(data, component): any {
    return this.handleAPI(this.LIST_SO_DOCK, data, component);
  }
  listDropId(data, component): any {
    return this.handleAPI(this.LIST_DROP_ID, data, component);
  }
  insertDropId(data, component): any {
    return this.handleAPI(this.INSERT_DROP_ID, data, component);
  }
  updateDropId(data, component): any {
    return this.handleAPI(this.UPDATE_DROP_ID, data, component);
  }
  findDropId(data, component): any {
    return this.handleAPI(this.FIND_DROP_ID, data, component);
  }

  listOrderForDock(data, component): any {
    return this.handleAPI(this.LIST_ORDER_ID, data, component);
  }
  transactionDockOutbound(data,component) :any {
    return this.handleAPI(this.TRANSACTION_DOCK_OUTBOUND, data, component);
  }

  listCheckin(data, component): any {
    return this.handleAPI(this.LIST_CHECKIN, data, component);
  }
  findCheckin(data, component): any {
    return this.handleAPI(this.FIND_CHECKIN, data, component);
  }
  insertCheckin(data, component): any {
    return this.handleAPI(this.INSERT_CHECKIN, data, component);
  }
  updateCheckin(data, component): any {
    return this.handleAPI(this.UPDATE_CHECKIN, data, component);
  }
  listLocationVisualize(data,component) {
    return this.handleAPI(this.HAVE_STOCK_INVENTORY,data,component);
  }
  private handleAPI(URL, data, component) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('token', this.account !== undefined ? this.account.token : '');
    return new Promise((resolve, reject) => {
      this.http.post(URL, data, { headers }).toPromise().then(function (response) {
        resolve({ response, component });
      }).catch(function (err) {
        reject({ err, component });
      });
    });
  }
}
