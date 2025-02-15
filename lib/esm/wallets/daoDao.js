var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Decimal } from "@cosmjs/math";
import { GasPrice, SigningStargateClient, } from "@cosmjs/stargate";
import { IframeClient, iframeWallet } from "@cosmos-kit/core/esm/iframe";
import { aminoTypes } from "../amino";
import { accountParser, registry } from "../registry";
const iframeClient = new IframeClient(iframeWallet);
export class DaoDao {
    constructor(account, config, options) {
        this.account = account;
        this.config = config;
        this.options = options;
        this.onChange = (fn) => { };
        this.disconnect = () => { };
        this.signAndBroadcast = (rpc, msgs) => __awaiter(this, void 0, void 0, function* () {
            const signer = iframeClient.getOfflineSigner("kaiyo-1");
            const gasPrice = new GasPrice(Decimal.fromUserInput("0.00125", 18), this.options
                ? this.options.feeDenom
                : this.config.feeCurrencies[0].coinDenom);
            const client = yield SigningStargateClient.connectWithSigner(rpc, signer, {
                registry,
                gasPrice,
                aminoTypes: aminoTypes(this.config.bech32Config.bech32PrefixAccAddr),
                accountParser,
            });
            return client.signAndBroadcast(this.account.address, msgs, 1.7);
        });
    }
}
DaoDao.connect = (config, opts) => iframeClient
    .connect(config.chainId)
    .then(() => iframeClient
    .getAccount(config.chainId)
    .then((account) => new DaoDao(Object.assign(Object.assign({}, account), { label: account.username }), config, opts)));
