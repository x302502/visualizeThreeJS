import { Injectable } from '@angular/core';
import { ConfigService } from './config-service/config.service';

@Injectable()
export class ReportService {
  host: string;
  client: string;
  constructor(private configService: ConfigService) {
    this.host = this.configService.clientConfig.report.url;
    this.client = this.configService.clientConfig.report.template;
  }

  warehouseReceipt(reportInfo: { whseid: string, username: string, storerkey: string, storername: string, receiptkey: string }) {
    window.open(`${this.host}/Report/Receipt?client=${this.client}&language=VN&username=${reportInfo.username}&whseid=${reportInfo.whseid}&storerkey=${reportInfo.storerkey}&storername=${reportInfo.storername}&receiptkey=${reportInfo.receiptkey}`, "_blank");
  }

  palletLabelDetail(reportInfo: { whseid: string, username: string, storerkey: string, receiptkey: string }) {
    window.open(`${this.host}/Report/PalletLabelDetail?client=${this.client}&language=VN&username=${reportInfo.username}&whseid=${reportInfo.whseid}&storerkey=${reportInfo.storerkey}&storerkey=${reportInfo.storerkey}&receiptkey=${reportInfo.receiptkey}`, "_blank");
  }

  packingList(reportInfo: { whseid: string, username: string, storerkey: string, orderkey: string }) {
    window.open(`${this.host}/Report/PackingList?client=${this.client}&language=VN&username=${reportInfo.username}&whseid=${reportInfo.whseid}&storerkey=${reportInfo.storerkey}&orderkey=${reportInfo.orderkey}`, "_blank");
  }

  pickingList(reportInfo: { whseid: string, username: string, storerkey: string, orderkey: string }) {
    window.open(`${this.host}/Report/PickingList?client=${this.client}&language=VN&username=${reportInfo.username}&whseid=${reportInfo.whseid}&storerkey=${reportInfo.storerkey}&orderkey=${reportInfo.orderkey}`, "_blank");
  }

  shipmentOrder(reportInfo: { whseid: string, username: string, storerkey: string, orderkey: string }) {
    window.open(`${this.host}/Report/ShipmentOrder?client=${this.client}&language=VN&username=${reportInfo.username}&whseid=${reportInfo.whseid}&storerkey=${reportInfo.storerkey}&orderkey=${reportInfo.orderkey}`, "_blank");
  }

  cartonLabel(code: string, whseid: string) {
    window.open(`${this.host}/Report/CartonLabel?client=${this.client}&whseid=${whseid}&code=${code}`, "_blank");
  }

  palletLabel(code: string, whseid: string) {
    window.open(`${this.host}/Report/PalletLabel?client=${this.client}&whseid=${whseid}&code=${code}`, "_blank");
  }
}
