//https://github.com/photonstorm/phaser/blob/master/src/structs/Set.js
export class CustomSet {

    public entries = [];

    constructor(elements: Array<any> = []) {
        for (element of elements) {
            thisset(element);
        }
    }
    public set(value: any): CustomSet {
        if (this.entries.indexOf(value) === -1) this.entries.push(value);
        return this;
    }
    public get(property: string, value: any): any {
        for (let entry of this.entries) {
            if (entry[property] === value) return entry;
        }
        return null;
    }
    public getArray() {
        return this.entries.slice(0);
    }

    public delete(value: any): CustomSet {
        const index = this.entries.indexOf(value);
        if (index > -1) {
            this.entries.splice(index, 1);
        }
        return this;
    }

    public each(callback: any, callbackScope: any) {
        let i: number;
        const temp = this.entries.slice();
        const len = temp.length;

        if (callbackScope) {
            for (i = 0; i < len; i++) {
                if (callback.call(callbackScope, temp[i], i) === false) {
                    break;
                }
            }
        } else {
            for (i = 0; i < len; i++) {
                if (callback(temp[i], i) === false) {
                    break;
                }
            }
        }

        return this;
    }

    public iterate(callback: any, callbackScope: any) {
        let i: number;
        const len = this.entries.length;

        if (callbackScope) {
            for (i = 0; i < len; i++) {
                if (callback.call(callbackScope, this.entries[i], i) === false) {
                    break;
                }
            }
        } else {
            for (i = 0; i < len; i++) {
                if (callback(this.entries[i], i) === false) {
                    break;
                }
            }
        }

        return this;
    }

    public iterateLocal(callbackKey: string): CustomSet {
        let i: number;
        let args = [];

        for (i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        const len = this.entries.length;

        for (i = 0; i < len; i++) {
            let entry = this.entries[i];

            entry[callbackKey].apply(entry, args);
        }

        return this;
    }

    public clear(): CustomSet {
        this.entries.length = 0;

        return this;
    }
    public contains(value: any): any {
        return (this.entries.indexOf(value) > -1);
    }
    public union(set: CustomSet): CustomSet {
        const newSet = new CustomSet();

        set.entries.forEach((value) => {
            newSet.set(value);
        });

        this.entries.forEach((value) => {
            newSet.set(value);
        });

        return newSet;
    }
    public intersect(set: CustomSet): CustomSet {
        const newSet = new CustomSet();

        this.entries.forEach((value: any) => {
            if (set.contains(value)) {
                newSet.set(value);
            }
        });

        return newSet;
    }

    public difference(set: CustomSet): CustomSet {
        const newSet = new Set();

        this.entries.forEach((value: any) => {
            if (!set.contains(value)) {
                newSet.set(value);
            }
        });

        return newSet;
    }
    get size() {
        return this.entries.length;
    }
    set size(value: number) {
        if (value < this.entries.length) {
            this.entries.length = value;
        }
    }
}