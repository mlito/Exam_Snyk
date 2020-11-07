export default class PackageTreeItem {
    constructor(name) {
        this.name = name;
        this.dependentItems = [];
        this.version = ''; //TODO - add support
    }
}