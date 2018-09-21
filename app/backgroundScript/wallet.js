import Logger from 'lib/logger';
import Utils from 'lib/utils';
import AccountHandler from 'lib/AccountHandler';
import TronWeb from 'tronweb';

import {
    WALLET_STATUS,
    ACCOUNT_TYPE
} from 'lib/constants';

const logger = new Logger('wallet');

export default class Wallet {
    constructor({ full, solidity, event }) {
        this._tronWeb = new TronWeb(full, solidity, event);

        this._walletStatus = WALLET_STATUS.UNINITIALIZED;

        this._accounts = {};
        this._internalAccounts = 0;
        this._rootAccount = false;
        this._mnemonic = false;
        this._password = false;
        this._currentAccount = false;
        this._encryptedStorage = false;

        this._loadWallet();
    }

    get status() {
        return this._walletStatus;
    }

    get tronWeb() {
        return this._tronWeb;
    }

    _loadWallet() {
        this._encryptedStorage = Utils.loadStorage();

        if (this._encryptedStorage)
            this._walletStatus = WALLET_STATUS.LOCKED;
    }

    _saveStorage(password = false) {
        if (!this._password && !password)
            throw 'Storage requires a password for encryption';

        this._encryptedStorage = Utils.encrypt(JSON.stringify({
            accounts: this._accounts,
            mnemonic: this._mnemonic,
            currentAccount: this._currentAccount,
            internalAccounts: this._internalAccounts
        }), this._password || password);

        if (!this._password)
            this._password = password;

        logger.info('Saving storage');
        Utils.saveStorage(this._encryptedStorage);
    }

    _importRaw(privateKey, name) {
        const account = new AccountHandler(privateKey, ACCOUNT_TYPE.RAW).export();

        if(name) {
            let accountName = name.toString().substring(0, 32).trim();

            if(Object.values(this._accounts).some(account => account.name === accountName))
                accountName = false;

            account.name = accountName;
        }

        this.addAccount(account);

        return account;
    }

    async _importMnemonic(mnemonic, name = false) {
        const account = new AccountHandler(mnemonic);
        const accounts = [];

        let accountIndex = 0;
        let checked = 0;

        while(checked < 20) {
            const childAccount = account.getAccountAtIndex(accountIndex);
            const transactions = await this._tronWeb.trx.getTransactionsRelated(childAccount.publicKey);

            accountIndex++;

            if(!transactions.length) {
                checked++;
                continue;
            } checked = 0;

            if(Object.keys(this._accounts).includes(childAccount.publicKey))
                continue;

            if(name) {
                let accountName = `${name.toString().trim()} ${accounts.length + 1}`.substring(0, 32);

                if(Object.values(this._accounts).some(account => account.name === accountName))
                    accountName = false;

                childAccount.name = accountName;
            }

            accounts.push(childAccount);
        }

        accounts.forEach(account => {
            this.addAccount(account);
        });

        return accounts;
    }

    getFullAccount() {
        if (this._accounts[this._currentAccount])
            return this._accounts[this._currentAccount];

        const keys = Object.keys(this._accounts);

        this._currentAccount = keys[0];
        this._saveStorage();

        return this._accounts[this._currentAccount];
    }

    async freeze(amount, duration) {
        const account = this.getFullAccount();

        logger.info(`Freezing from ${account.publicKey} amount ${amount} duration ${duration}`);

        // TODO:
        // - this._tronWeb.transactionBuilder.freezeBalance()
        // - this._tronWeb.trx.sign()
        // - this._tronWeb.trx.broadcast();

        // return this._rpc.freezeBalance(
        //     account.privateKey,
        //     amount,
        //     duration
        // );

        return false;
    }

    async unfreeze() {
        const account = this.getFullAccount();

        logger.info(`Unfreezing from ${account.publicKey}`);

        // TODO:
        // - this._tronWeb.transactionBuilder.unfreezeBalance()
        // - this._tronWeb.trx.sign()
        // - this._tronWeb.trx.broadcast();

        // return this._rpc.unfreezeBalance(
        //     account.privateKey
        // );

        return false;
    }

    async send(recipient, amount) {
        const account = this.getFullAccount();

        logger.info(`Sending from ${account.publicKey} to ${recipient}, amount: ${amount}`);

        // TODO:
        // - this._tronWeb.transactionBuilder.sendTrx()
        // - this._tronWeb.trx.sign()
        // - this._tronWeb.trx.broadcast();

        // return this._rpc.sendTrx(
        //     account.privateKey,
        //     recipient,
        //     amount
        // );

        return false;
    }

    async sendAsset(recipient, asset, amount) {
        const account = this.getFullAccount();
        logger.info(`Sending asset from ${account.publicKey} to ${recipient}, asset: ${asset}, amount: ${amount}`);

        // TODO:
        // - this._tronWeb.transactionBuilder.sendToken()
        // - this._tronWeb.trx.sign()
        // - this._tronWeb.trx.broadcast();

        // return this._rpc.sendAsset(
        //     account.privateKey,
        //     recipient,
        //     Utils.stringToHex(asset),
        //     amount
        // );

        return false;
    }

    async issueAsset(options) {
        // const account = this.getFullAccount();
        logger.info('Issuing asset: ', options);

        options.name = Utils.stringToHex(options.name);
        options.abbr = Utils.stringToHex(options.abbr);
        options.description = Utils.stringToHex(options.description);
        options.url = Utils.stringToHex(options.url);

        // TODO:
        // - this._tronWeb.transactionBuilder.createToken()
        // - this._tronWeb.trx.sign()
        // - this._tronWeb.trx.broadcast();

        // return this._rpc.issueAsset(
        //     account.privateKey,
        //     options
        // );

        return false;
    }

    async signSmartContract(transaction) {
        const signedResult = await this._tronWeb.trx.sign(transaction);
        return signedResult;
    }

    async triggerSmartContract(address, functionSelector, parameters, callValue, feeLimit, options) {
        const account = this.getFullAccount();

        logger.info(`Triggering smart contract from ${account.publicKey}`, {
            address,
            functionSelector,
            parameters,
            options
        });

        const buildResult = await this._tronWeb.transactionBuilder.triggerSmartContract(address, functionSelector, feeLimit, callValue, parameters);
        const signedResult = await this._tronWeb.trx.sign(buildResult.transaction);
        const result = await this._tronWeb.trx.broadcast(signedResult.transaction);

        return result;
    }

    async createSmartContract(abi, bytecode, name, options) {
        const account = this.getFullAccount();

        logger.info(`Creating smart contract from account ${account.publicKey}`, { abi, bytecode, name, options });

        // TODO:
        // - this._tronWeb.transactionBuilder.createSmartContract()
        // - this._tronWeb.trx.sign()
        // - this._tronWeb.trx.broadcast();

        // return this._rpc.deployContract(
        //     account.privateKey,
        //     abi,
        //     bytecode,
        //     name,
        //     options
        // );

        return false;
    }

    async updateAccount(address, save = false) {
        logger.info(`Account update requested for ${address}`);

        const account = await this._tronWeb.trx.getAccount(address);
        const transactions = await this._tronWeb.trx.getTransactionsRelated(address);

        logger.info('Account updated', { account, transactions });

        const tokens = (account.asset || []).filter(({ value }) => {
            return value > 0;
        }).reduce((obj, { key, value }) => {
            obj[key] = value;
            return obj;
        }, {});

        this._accounts[address] = {
            ...this._accounts[address],
            transactions: Utils.convertTransactions(transactions, address),
            balance: account.balance || 0,
            tokens
        };

        if (save)
            this._saveStorage();
    }

    async updateAccounts() {
        logger.info('Requesting batch account update');

        for (const address in this.getAccounts())
            await this.updateAccount(address, false);

        this._saveStorage();

        logger.info('Batch account update complete');
    }

    addAccount(account) {
        logger.info(`Adding account to wallet ${account.publicKey}`);

        const extendedAccount = {
            tokens: {},
            transactions: [],
            balance: 0,
            ...account
        };

        this._accounts[account.publicKey] = extendedAccount;
        this._saveStorage();
    }

    setupWallet(password = false) {
        if (this._walletStatus !== WALLET_STATUS.UNINITIALIZED)
            throw 'Wallet cannot be initialized multiple times';

        if (!password)
            throw 'Wallet cannot be initialized without a password';

        logger.info('Initialising wallet for first use');

        const account = AccountHandler.generateAccount();
        const wordList = account.export();
        const defaultAccount = account.getAccountAtIndex(0);

        defaultAccount.name = 'Default Account';
        defaultAccount.internal = true;

        this._rootAccount = new AccountHandler(wordList);
        this._mnemonic = wordList;
        this._password = password;
        this._internalAccounts = 1;

        this.addAccount(defaultAccount);
        this.unlockWallet(password);

        return defaultAccount;
    }

    isSetup() {
        return this._walletStatus !== WALLET_STATUS.UNINITIALIZED;
    }

    unlockWallet(password) {
        logger.info('Requested wallet unlock');

        try {
            const {
                accounts,
                mnemonic,
                currentAccount,
                internalAccounts
            } = JSON.parse(Utils.decrypt(this._encryptedStorage, password));

            this._rootAccount = new AccountHandler(mnemonic);
            this._accounts = accounts;
            this._mnemonic = mnemonic;
            this._currentAccount = currentAccount;
            this._password = password;
            this._internalAccounts = internalAccounts;
            this._tronWeb.setPrivateKey(this.getFullAccount().privateKey);

            this._walletStatus = WALLET_STATUS.UNLOCKED;

            logger.info('Wallet unlocked successfully');
            return true;
        } catch (e) {
            logger.warn('Error unlocking wallet');
            logger.error(e);

            return false;
        }
    }

    getAccounts() {
        return this._accounts;
    }

    getAccount(address = this._currentAccount) {
        if (this._walletStatus !== WALLET_STATUS.UNLOCKED)
            return false;

        if (this._accounts[address])
            return this._accounts[address];

        const keys = Object.keys(this._accounts);

        this._currentAccount = keys[0];
        this._tronWeb.setPrivateKey(this.getFullAccount().privateKey);
        this._saveStorage();

        return this._accounts[this._currentAccount];
    }

    createAccount(name = '') {
        const account = this._rootAccount.getAccountAtIndex(
            this._internalAccounts + 1
        );

        if (name) {
            let accountName = name.toString().substring(0, 32).trim();

            if (Object.values(this._accounts).some(account => account.name === accountName))
                accountName = false;

            account.name = accountName;
        }

        account.internal = true;
        this._internalAccounts += 1;
        this.addAccount(account);

        return account;
    }

    importAccount(accountType, importData, name = false) {
        if(accountType == ACCOUNT_TYPE.RAW)
            return this._importRaw(importData, name);

        if(accountType == ACCOUNT_TYPE.MNEMONIC)
            return this._importMnemonic(importData, name);

        throw new Error(`Invalid ACCOUNT_TYPE ${accountType} supplied`);
    }

    selectAccount(publicKey) {
        if (!this._accounts.hasOwnProperty(publicKey))
            return;

        this._currentAccount = publicKey;
        this._tronWeb.setPrivateKey(this.getFullAccount().privateKey);
        this._saveStorage();
    }

    deleteAccount(publicKey) {
        if (!this._accounts.hasOwnProperty(publicKey))
            return;

        if (Object.keys(this._accounts).length === 1)
            return;

        delete this._accounts[publicKey];

        if (this._currentAccount === publicKey)
            this.selectAccount(Object.keys(this._accounts)[0]); // this calls saveStorage()
        else this._saveStorage();
    }
}
