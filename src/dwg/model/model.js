import * as THREE from 'three';
import { defineProperties } from '../inner/util';
import { Trigger } from '../inner/trigger';

export class Model extends Trigger {
    constructor() {
        super();
        let self = this;
        self._scene = new THREE.Scene();
        self._datas = [];
        self._datasMap = {};
    }

    add(data) {
        let self = this,
            datas = self._datas,
            datasMap = self._datasMap;
        if (self.contains(data)) {
            return self;
        }
        datas.push(data);
        datasMap[data.id] = data;
        data.on('all', self._handleDataChange, self);
        self.fire({
            type: 'add',
            data,
        });
        if (data.children && data.children.length) {
            data.children.forEach((child) => {
                self.add(child);
            });
        }
        return self;
    }

    remove(data) {
        let self = this,
            datas = self._datas,
            index = datas.indexOf(data);
        if (index >= 0) {
            let { children } = data;
            datas.splice(index, 1);
            delete self._datasMap[data.id];
            data.off('all', self._handleDataChange, self);
            self.fire({
                type: 'remove',
                data,
            });
            data.parent = null;
            if (children && children.length) {
                for (let i = children.length - 1; i >= 0; i--) {
                    self.remove(children[i]);
                }
            }
        }
        return self;
    }

    _handleDataChange(e) {
        this.fire(e);
    }

    contains(data) {
        return !!this._datasMap[data.id];
    }

    forEach(callback, thisArg) {
        let self = this;
        self._datas.forEach(callback, thisArg);
        return self;
    }

    clear() {
        let self = this,
            datas = self._datas;
        self._datas = [];
        self._datasMap = {};
        self.fire({
            type: 'clear',
            datas,
        });
        return self;
    }

    get(index) {
        return this._datas[index];
    }

    getById(id) {
        return this._datasMap[id];
    }
}

defineProperties(Model.prototype, [
    {
        name: 'datas',
        value: null,
        noSet: true,
    },
    {
        name: 'count',
        value: null,
        get() {
            return this._datas.length;
        },
        noSet: true,
    },
    {
        name: 'scene',
        value: null,
        noSet: true,
        get() {
            return this._scene;
        }
    }
]);
