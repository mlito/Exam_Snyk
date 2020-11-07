import fetch from 'isomorphic-fetch';
import PackageTreeItem from './packageTreeItem.js';
import AsyncWhile from 'async-while';
import Queue from 'queue-fifo';

const REPOSIRORY_NAME = 'https://registry.npmjs.org/';
export default class PackageDataHelper {
    constructor() {

    }
    async getPkgJsonData(name, version) {
        let versionSuffix = (version) ? '/' + version : '/latest';
        let url = REPOSIRORY_NAME + name + versionSuffix;
        let fetchResult;
        try {
            fetchResult = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
        }
        catch (Err) {
            throw Error(Err);
        }

        if (fetchResult.status !== 200) {
            throw Error(fetchResult.statusText);
        }

        let resJson = await fetchResult.json();
        return resJson;
    }

    async updatePackageDependencies(pkgToProcess) {
        try {
            let resJson = await this.getPkgJsonData(pkgToProcess.name);
            let dependencies = resJson['dependencies'];
            if (!pkgToProcess.dependentItems) {
                pkgToProcess.dependentItems = [];
            }
            for (let element in dependencies) {
                let itemToAdd = { name: element };
                pkgToProcess.dependentItems.push(itemToAdd);
            };

        }
        catch (Err) {
            throw Error(Err);
        }

        return pkgToProcess;
    }

    async getPackageDataFromRepository(name, version) {
        let result = new PackageTreeItem(name);
        try {
            let resJson = await this.getPkgJsonData(name, version);
            let dependencies = resJson['dependencies'];
            for (let element in dependencies) {
                let itemToAdd = { name: element };
                result.dependentItems.push(itemToAdd);
            };
        }
        catch (Err) {
            throw Error(Err);
        }

        return result;
    }

    async processPackageDependencies(pkgToProcess) {
        var queue = new Queue();
        let that = this;
        for (let ind = 0; ind < pkgToProcess.dependentItems.length; ind++) {
            queue.enqueue(pkgToProcess.dependentItems[ind]);
        }

        let itemToProcess;
        var myWhile = AsyncWhile(function () {
            // synchronous conditional
            itemToProcess = queue.dequeue();
            return (!queue.isEmpty());
        }, function () {
            // loop content goes here
            //return itemToProcess.process(); 
            return that.updatePackageDependencies(itemToProcess);
        })();

        return myWhile;
    }
}