export const API = {
    LOCATION: {
        FIND: '/api/Locs/find'
    },
    INBOUND: {
        RECEIPTALL: '/api/Inbounds/receiptAll',
        RECEIPT: '/api/Inbounds/treceipt',
        UNRECEIPT: '/api/Inbounds/tunreceipt',
        PUTAWAY: '/api/Inbounds/tputaway',
        UPDATESTATUSRECEIPT: '/api/Inbounds/updateStatusReceipt',
        CONFIRMPUTAWAY: '/api/Inbounds/tconfirmputaway',
    },

    INBOUND_REPORT:{
        GET_LIST: '/api/Inboundreports/getlist'
    },

    INVENTORY:{
        GET_LIST: '/api/Inventories/getlist',
        LIST_REPORT: '/api/Inventories/listReport'
    },

    OUTBOUND: {
        ALLOCATE: '/api/Outbounds/tallocate',
        ALLOCATEMANUAL: '/api/Outbounds/allocatemanual',
        UNALLOCATEBYORDER: '/api/Outbounds/unallocate',
        PICK: '/api/Outbounds/tpick',
        UNPICK: '/api/Outbounds/unpick',
        PICKBYORDER: '/api/Outbounds/pickbyorder',
        SHIP: '/api/Outbounds/tship',
        SHIPBYORDER: '/api/Outbounds/shipbyorder',
        SHIPPICKDETAIL: '/api/Outbounds/shippickdetail',
        PICKPICKDETAIL: '/api/Outbounds/pickpickdetail',
        ALLOCATEBYSTRATEGY: '/api/Outbounds/orderallocatebystrategy',
        GETLIST_ALLOCATEMANUAL: '/api/Outbounds/getallocatemanual',
        UPDATE_STATUSORDER: '/api/Outbounds/updatestatusorder'
    },
    OUTBOUND_REPORT:{
        GET_LIST: '/api/Outboundreports/getlist'
    },

    PACK: {
        FIND: '/api/Packs/find'
    },

    PUTAWAY_STRATEGY:{
        FIND: '/api/Putawaystrategies/find'
    },

    PUTAWAY_ZONE: {
        FIND: '/api/Putawayzones/find'
    },

    RECEIPT: {
        LIST_RECEIPT: '/api/Receipts/list',
        GETLIST_RECEIPT: '/api/Receipts/getlist',
        FIND_RECEIPT: '/api/Receipts/find',
        CHECK_RECEIPT: '/api/Receipts/checkreceiptimport',
        DELETE_RECEIPT: '/api/Receipts/deletereceipt',
        INSERT_RECEIPT: '/api/Receipts/insert',
        CREATE_RECEIPT: '/api/Receipts/create',
        UPDATE_RECEIPT: '/api/Receipts/update',
        CATEGORY_SKU: '/api/Receipts/category',
        LIST_RECEIPT_DOCK: '/api/Receipts/listForDock',
        UPDATE_RECEIPT_DOCK_TIME: '/api/Receipts/updateTimeForDock',
        TOTALRECEIPTDETAIL: '/api/Receipts/totalreceiptdetail',
        INSERTEXCELASN: '/api/Receipts/insertExcelASN',
    },

    SKU: {
        FIND: '/api/Skus/find'
    },

    SHIPCODE: {
        FIND: '/api/Shipcodes/find'
    },

    INSERTEXCELORDER: '/api/Orders/insertExcelOrder',

    LIST_RECEIPTDETAIL: '/api/Receiptdetails/list',
    FIND_RECEIPTDETAIL: '/api/Receiptdetails/find',
    INSERT_RECEIPTDETAIL: '/api/Receiptdetails/insert',
    UPDATE_RECEIPTDETAIL: '/api/Receiptdetails/_update',
    DELETE_RECEIPTDETAIL: '/api/Receiptdetails/deletereceiptdetail',

    GETLIST_STORER: '/api/Storers/getliststorer',
    LIST_STORER: '/api/Storers/list',
    INSERT_STORER: '/api/Storers/insert',
    UPDATE_STORER: '/api/Storers/update',
    FIND_STORER: '/api/Storers/find',
    LIST_ONESTORER: '/api/Storers/listone',

    _INSERT_STORER: '/api/Storers/_insert',
    _UPDATE_STORER: '/api/Storers/_update',
    _SAVE_STORER: '/api/Storers/_save',

    LIST_CUSTOMERGROUP: '/api/Customergroups/list',
    FIND_CUSTOMERGROUP: '/api/Customergroups/find',
    INSERT_CUSTOMERGROUP: '/api/Customergroups/insert',
    UPDATE_CUSTOMERGROUP: '/api/Customergroups/update',

    _INSERT_CUSTOMERGROUP: '/api/Customergroups/_insert',
    _UPDATE_CUSTOMERGROUP: '/api/Customergroups/_update',
    _SAVE_CUSTOMERGROUP: '/api/Customergroups/_save',

    LIST_BOM: '/api/billofmaterials/list',
    QUERY_BOM: '/api/billofmaterials/query',
    FIND_BOM: '/api/billofmaterials/find',
    INSERT_BOM: '/api/billofmaterials/insert',
    UPDATE_BOM: '/api/billofmaterials/update',
    SAVE_BOM: '/api/billofmaterials/save',

    GETLIST_PACK: '/api/Packs/getListPack',
    LIST_PACK: '/api/Packs/list',
    INSERT_PACK: '/api/Packs/insert',
    UPDATE_PACK: '/api/Packs/update',
    FIND_PACK: '/api/Packs/find',
    DELETE_PACK: '/api/Packs/delete',
    GET_UOM: '/api/Packs/query',
    GET_ALLUOM: '/api/Packs/queryAllPack',
    GET_OTHERUOM: '/api/Packs/queryOtherUOM',

    _INSERT_PACK: '/api/Packs/_insert',
    _UPDATE_PACK: '/api/Packs/_update',
    _SAVE_PACK: '/api/Packs/_save',

    GETLIST_LOCATION: '/api/Locs/getlistlocation',
    LIST_LOCATION: '/api/Locs/list',
    FIND_LOCATION: '/api/Locs/find',
    INSERT_LOCATION: '/api/Locs/insert',
    UPDATE_LOCATION: '/api/Locs/update',

    _INSERT_LOCATION: '/api/Locs/_insert',
    _UPDATE_LOCATION: '/api/Locs/_update',
    _SAVE_LOCATION: '/api/Locs/_save',

    GETLIST_ZONE: '/api/Putawayzones/getlistputawayzone',
    LIST_ZONE: '/api/Putawayzones/list',
    INSERT_ZONE: '/api/Putawayzones/insert',
    UPDATE_ZONE: '/api/Putawayzones/update',
    FIND_ZONE: '/api/Putawayzones/find',

    _INSERT_ZONE: '/api/Putawayzones/_insert',
    _UPDATE_ZONE: '/api/Putawayzones/_update',
    _SAVE_ZONE: '/api/Putawayzones/_save',

    LIST_LINE: '/api/Lines/list',
    INSERT_LINE: '/api/Lines/insert',
    UPDATE_LINE: '/api/Lines/update',
    FIND_LINE: '/api/Lines/find',

    _INSERT_LINE: '/api/Lines/_insert',
    _UPDATE_LINE: '/api/Lines/_update',
    _SAVE_LINE: '/api/Lines/_save',

    GETLIST_PUTAWAYSTRATEGIES: '/api/Putawaystrategies/getlistputawaystrategy',
    LIST_PUTAWAYSTRATEGIES: '/api/Putawaystrategies/list',
    FIND_PUTAWAYSTRATEGIES: '/api/Putawaystrategies/find',
    INSERT_PUTAWAYSTRATEGIES: '/api/Putawaystrategies/insert',
    UPDATE_PUTAWAYSTRATEGIES: '/api/Putawaystrategies/update',

    _INSERT_PUTAWAYSTRATEGIES: '/api/Putawaystrategies/_insert',
    _UPDATE_PUTAWAYSTRATEGIES: '/api/Putawaystrategies/_update',

    LIST_PUTAWAYSTRATEGYDETAILS: '/api/Putawaystrategydetails/list',
    FIND_PUTAWAYSTRATEGYDETAILS: '/api/Putawaystrategydetails/find',
    INSERT_PUTAWAYSTRATEGYDETAILS: '/api/Putawaystrategydetails/insert',
    UPDATE_PUTAWAYSTRATEGYDETAILS: '/api/Putawaystrategydetails/update',

    _INSERT_PUTAWAYSTRATEGYDETAILS: '/api/Putawaystrategydetails/_insert',
    _UPDATE_PUTAWAYSTRATEGYDETAILS: '/api/Putawaystrategydetails/_update',
    _SAVE_PUTAWAYSTRATEGYDETAILS: '/api/Putawaystrategydetails/_save',

    GETLIST_ALLOCATESTRATEGY: '/api/Allocatestrategies/getlistallocatestrategy',
    LIST_ALLOCATESTRATEGY: '/api/Allocatestrategies/list',
    FIND_ALLOCATESTRATEGY: '/api/Allocatestrategies/find',
    INSERT_ALLOCATESTRATEGY: '/api/Allocatestrategies/insert',
    UPDATE_ALLOCATESTRATEGY: '/api/Allocatestrategies/update',

    _INSERT_ALLOCATESTRATEGY: '/api/Allocatestrategies/_insert',
    _UPDATE_ALLOCATESTRATEGY: '/api/Allocatestrategies/_update',

    LIST_ALLOCATESTRATEGYDETAILS: '/api/Allocatestrategydetails/list',
    FIND_ALLOCATESTRATEGYDETAILS: '/api/Allocatestrategydetails/find',
    INSERT_ALLOCATESTRATEGYDETAILS: '/api/Allocatestrategydetails/insert',
    UPDATE_ALLOCATESTRATEGYDETAILS: '/api/Allocatestrategydetails/update',

    _INSERT_ALLOCATESTRATEGYDETAILS: '/api/Allocatestrategydetails/_insert',
    _UPDATE_ALLOCATESTRATEGYDETAILS: '/api/Allocatestrategydetails/_update',
    _SAVE_ALLOCATESTRATEGYDETAILS: '/api/Allocatestrategydetails/_save',

    LIST_CODELIST: '/api/Codelists/list',
    FIND_CODELIST: '/api/Codelists/find',
    INSERT_CODELIST: '/api/Codelists/insert',
    UPDATE_CODELIST: '/api/Codelists/update',

    _INSERT_CODELIST: '/api/Codelists/_insert',
    _UPDATE_CODELIST: '/api/Codelists/_update',

    LIST_SKU: '/api/Skus/list',
    LISTBYOWNER_SKU: '/api/Skus/listbyowner',
    SAVE_SKU: '/api/Skus/save',
    INSERT_SKU: '/api/Skus/insert',
    UPDATE_SKU: '/api/Skus/update',
    FIND_SKU: '/api/Skus/find',
    PRINT_SKU: '/api/Skus/print',

    _INSERT_SKU: '/api/Skus/_insert',
    _UPDATE_SKU: '/api/Skus/_update',
    _SAVE_SKU: '/api/Skus/_save',

    GETLIST_CODELKUP: '/api/Codelkups/getlistcodelkup',
    LIST_CODELKUP: '/api/Codelkups/list',
    FIND_CODELKUP: '/api/Codelkups/find',
    INSERT_CODELKUP: '/api/Codelkups/insert',
    UPDATE_CODELKUP: '/api/Codelkups/update  ',

    _GETLIST_CODELKUP: '/api/Codelkups/_getlistcodelkup',
    _LIST_CODELKUP: '/api/Codelkups/_list',
    _INSERT_CODELKUP: '/api/Codelkups/_insert',
    _UPDATE_CODELKUP: '/api/Codelkups/_update  ',

    LIST_SUPPLIER: '/api/Lines/list',
    SAVE_SUPPLIER: '/api/Lines/save',
    FIND_SUPPLIER: '/api/Lines/find',

    FIND_TASKDETAIL: '/api/Taskdetails/find',

    LIST_INVENTORY: '/api/Inventories/list',
    COUNT_INVENTORY: '/api/Inventories/count',
    FIND_INVENTORY: '/api/Inventories/find',
    TRANSACTION_QTY: '/api/Inventories/tQty',
    TRANSACTION_QTYMOVE: '/api/Inventories/tQtymove',
    TRANSACTION_CHANGESTATUS: '/api/Inventories/tChangeStatus',
    _SAVETOPREMOVE: '/api/Inventories/_saveToPreMove',
    CREATESHORTID: '/api/Inventories/CreateShortId',
    TRANSACTION_QTYPREMOVE: '/api/Inventories/tQtyPreMove',
    TRANSACTION_TRANSFERINTERNAL: '/api/Inventories/tTransferInternal',
    SAVE_TOTRANSFER: '/api/Inventories/saveToTransfer',
    DELETE_TRANSFER: '/api/Inventories/tDeleteTransfer',
    FIND_TRANSFERDETAIL: '/api/Transferdetails/find',
    TRANSACTION_LOTUPDATE: '/api/Inventories/tLotUpdate',
    LIST_INVENTORY_REPORT: '/api/Inventories/listReport',

    LIST_ORDERS: '/api/Orders/list',
    GETLIST_ORDERS: '/api/Orders/getlist',
    FIND_ORDERS: '/api/Orders/find',
    INSERT_ORDERS: '/api/Orders/insert',
    UPDATE_ORDERS: '/api/Orders/update',
    DELETE_ORDERS: '/api/Orders/deleteorder',
    GET_SKU: '/api/Orders/getsku',
    TOTALDETAIL: '/api/Orders/totalDetail',
    CREATE_ORDERS: '/api/Orders/create',
    UPDATE_TIME_DOCK_ORDER: '/api/Orders/updateTimeForDock',

    LIST_ORDERSDETAIL: '/api/Orderdetails/list',
    FIND_ORDERSDETAIL: '/api/Orderdetails/find',
    FINDONE_ORDERSDETAIL: '/api/Orderdetails/findone',
    INSERT_ORDERSDETAIL: '/api/Orderdetails/insert',
    UPDATE_ORDERSDETAIL: '/api/Orderdetails/_update',
    DELETE_ORDERSDETAIL: '/api/Orderdetails/deleteorderdetail',

    LIST_LOTXLOCXID: '/api/Lotxlocxids/list',
    INSERT_LOTXLOCXID: '/api/Lotxlocxids/insert',
    UPDATE_LOTXLOCXID: '/api/Lotxlocxids/update',

    LIST_SKUXLOC: '/api/Skuxlocs/list',
    INSERT_SKUXLOC: '/api/Skuxlocs/insert',
    UPDATE_SKUXLOC: '/api/Skuxlocs/update',

    LIST_LOT: '/api/Lots/list',
    INSERT_LOT: '/api/Lots/insert',
    UPDATE_LOT: '/api/Lots/update',

    FIND_lPNID: '/api/Lpnids/find',

    LIST_PICKDETAIL: '/api/Pickdetails/list',
    GET_PICKDETAIL: '/api/Pickdetails/get',

    LIST_MASTERPICK: '/api/MasterPicks/list',
    FIND_MASTERPICK: '/api/MasterPicks/find',
    INSERT_MASTERPICK: '/api/MasterPicks/insert',
    UPDATE_MASTERPICK: '/api/MasterPicks/update',

    WAREHOUSERECEIPT_REPORT: '/api/Reports/warehousereceipt',
    PUTAWAYLIST_REPORT: '/api/Reports/putawaylist',
    PALLETLABEL_REPORT: '/api/Reports/palletlabel',
    DEVILERYNOTE_REPORT: '/api/Reports/devilerynote',
    PICKINGLIST_REPORT: '/api/Reports/pickinglist',
    MASTERPICK_REPORT: '/api/Reports/masterpick',

    STOCKCOUNT_REPORT: '/api/Reports/stockcount',
    STOCKCOUNT_TIMES_REPORT: '/api/Reports/stockcounttimes',

    CODE128_BARCODE: '/api/Reports/barcode/code128',

    LIST_PREMOVE: '/api/Premoves/list',
    INSERT_PREMOVE: '/api/Premoves/insert',
    UPDATE_PREMOVE: '/api/Premoves/update',
    FIND_PREMOVE: '/api/Premoves/find',

    LISTFULLCOUNT_STOCKCOUNT: '/api/Stockcounts/listfullcount',
    LISTSKU_STOCKCOUNT: '/api/Stockcounts/listsku',
    LISTZONELOC_STOCKCOUNT: '/api/Stockcounts/listzoneloc',
    LISTSTOCKCOUNT_STOCKCOUNT: '/api/Stockcounts/liststockcount',
    LISTCHANGEINDATE_STOCKCOUNT: '/api/Stockcounts/listchangeindate',
    INSERT_STOCKCOUNT: '/api/Stockcounts/insert',
    UPDATE_STOCKCOUNT: '/api/Stockcounts/update',
    FIND_STOCKCOUNT: '/api/Stockcounts/find',
    LIST_STOCKCOUNT: '/api/Stockcounts/list',

    INSERT_STOCKCOUNTDETAIL: '/api/Stockcountdetails/insert',
    INSERTMANY_STOCKCOUNTDETAIL: '/api/Stockcountdetails/insertmany',
    UPDATE_STOCKCOUNTDETAIL: '/api/Stockcountdetails/update',
    FIND_STOCKCOUNTDETAIL: '/api/Stockcountdetails/find',
    LIST_STOCKCOUNTDETAIL: '/api/Stockcountdetails/list',
    GETINVENTORY_STOCKCOUNTDETAIL: '/api/Stockcountdetails/getinventory',

    TOTALORDER_STATISTICS: '/api/Statistics/totalorder',
    TOTALORDERBYOWNER_STATISTICS: '/api/Statistics/totalorderbyowner',
    TOTALORDERBYDATE_STATISTICS: '/api/Statistics/totalorderbydate',
    TOTALBYGROSSWGT_STATISTICS: '/api/Statistics/totalbygrosswgt',
    TOTALBYCUBE_STATISTICS: '/api/Statistics/totalbycube',
    SO_STATISTICS: '/api/Statistics/so',
    ASN_STATISTICS: '/api/Statistics/asn',

    LISTDETAIL_INBOUNDREPORT: '/api/Inboundreports/getlist',
    LISTSUMMARY_INBOUNDREPORT: '/api/Inboundreports/getlistsummary',

    LISTDETAIL_OUTBOUNDREPORT: '/api/Outboundreports/getlistdetail',
    LISTSUMMARY_OUTBOUNDREPORT: '/api/Outboundreports/getlistsummary',

    LIST_SHIPCODE: '/api/Shipcodes/list',
    FIND_SHIPCODE: '/api/Shipcodes/find',
    INSERT_SHIPCODE: '/api/Shipcodes/insert',
    UPDATE_SHIPCODE: '/api/Shipcodes/update',
    SAVE_SHIPCODE: '/api/Shipcodes/save',

    LIST_TARIFF: '/api/Tariffs/list',
    FIND_TARIFF: '/api/Tariffs/find',
    INSERT_TARIFF: '/api/Tariffs/insert',
    UPDATE_TARIFF: '/api/Tariffs/update',

    LIST_TARIFFDETAIL: '/api/Tariffdetails/list',
    FIND_TARIFFDETAIL: '/api/Tariffdetails/find',
    INSERT_TARIFFDETAIL: '/api/Tariffdetails/insert',
    UPDATE_TARIFFDETAIL: '/api/Tariffdetails/update',

    FIND_HELP: "/api/Help/findHelp",
    UPDATE_HELP: "/api/Help/updateHelp",
    INSERT_HELP: "/api/Help/insertHelp",

    LIST_CHARGE: '/api/Charges/list',
    FIND_CHARGE: '/api/Charges/find',
    INSERT_CHARGE: '/api/Charges/insert',
    UPDATE_CHARGE: '/api/Charges/update',

    LIST_CHARGETYPE: '/api/Chargetypes/list',
    FIND_CHARGETYPE: '/api/Chargetypes/find',
    INSERT_CHARGETYPE: '/api/Chargetypes/insert',
    UPDATE_CHARGETYPE: '/api/Chargetypes/update',

    LIST_TRANSACTION: '/api/Transactions/list',
    LIST_TRANSACTIONBYDATE: '/api/Transactions/listbydate',

    TRANSACTION_DOCK_INBOUND: '/api/Docks/tInbound',
    TRANSACTION_TRANSFER_DROP_ID: '/api/Dropids/tTransferCartonId',
    LIST_SO_DOCK: '/api/Orders/listForDock',
    INSERT_DROP_ID: '/api/Dropids/insert',
    UPDATE_DROP_ID: '/api/Dropids/update',
    FIND_DROP_ID: '/api/Dropids/find',
    LIST_DROP_ID: '/api/Dropids/list',
    LIST_ORDER_ID: '/api/Orders/listForDock',

    LIST_CHECKIN: '/api/Checkins/list',
    INSERT_CHECKIN: '/api/Checkins/insert',
    FIND_CHECKIN: '/api/Checkins/find',
    UPDATE_CHECKIN: '/api/Checkins/update',
}