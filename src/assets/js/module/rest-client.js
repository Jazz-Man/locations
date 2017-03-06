var reqwest = require('reqwest');
var Base64 = require('js-base64').Base64;

function RestClient(host, options) {
    this.host = host;
    this.conf(options);
    resource(this, undefined, '', undefined, this);

}

RestClient.prototype.conf = function (options) {
    options = options || {};

    var currentOptions = this._opts || {
            trailing: '',
            shortcut: true,
            contentType: 'application/json',
//			'application/x-www-form-urlencoded': {
//				encode: encodeUrl
//			},
            'application/json': {
                encode: JSON.stringify,
                decode: JSON.parse
            }
        };

    this._opts = Object.assign(currentOptions, options);

    return Object.assign({}, this._opts);
};

RestClient.prototype._request = function (method, url, data, auth) {

    data = data || null;
    var reqwest_prop = {
        url: this.host + url,
        type: 'json',
        crossOrigin: true,
        method: method,
        data: data
    };
    if (null !== auth) {
        reqwest_prop.headers.Authorization = 'Basic ' + Base64.encode('' + auth.username + ':' + auth.password + '')
    }
    console.log(reqwest_prop);

    return reqwest(reqwest_prop);
};

function resource(client, parent, name, id, ctx) {
    var self;
    if (ctx) {
        self = ctx;
    }
    else {
        self = function (newId) {
            if (newId == undefined) {
                return self;
            }
            return self._clone(parent, newId);
        };
    }

    self._resources = {};
    self._shortcuts = {};

    self._clone = function (parent, newId) {
        var copy = resource(client, parent, name, newId);
        copy._shortcuts = self._shortcuts;
        for (var resName in self._resources) {
            copy._resources[resName] = self._resources[resName]._clone(copy);

            if (resName in copy._shortcuts) {
                copy[resName] = copy._resources[resName];
            }
        }
        return copy;
    };

    self.res = function (resources, shortcut) {
        shortcut = shortcut || client._opts.shortcut;

        var makeRes = function makeRes(resName) {
            if (resName in self._resources) {
                return self._resources[resName];
            }

            var r = resource(client, self, resName);
            self._resources[resName] = r;
            if (shortcut) {
                self._shortcuts[resName] = r;
                self[resName] = r;
            }
            return r;
        };

        // (resources instanceof String) don't work. Fuck you, javascript.
        if (resources.constructor == String) {
            return makeRes(resources);
        }

        if (resources instanceof Array) {
            return resources.map(makeRes);
        }

        if (resources instanceof Object) {
            var res = {};
            for (var resName in resources) {
                var r = makeRes(resName);
                if (resources[resName]) {
                    r.res(resources[resName]);
                }
                res[resName] = r;
            }
            return res;
        }
    };

    self.url = function () {
        var url = parent ? parent.url() : '';
        if (name) {
            url += '/' + name;
        }
        if (id != undefined) {
            url += '/' + id;
        }
        return url;
    };

    self.get = function (args, auth) {
        auth = auth || null;

        var url = self.url();
        var data = reqwest.toQueryString(args);

        return client._request('GET', url, data, auth);
    };

    self.post = function (data, auth) {
        auth = auth || null;

        return client._request('POST', self.url(), data, auth);
    };

    self.put = function (data, auth) {
        auth = auth || null;
        return client._request('PUT', self.url(), data, auth);
    };

    self.patch = function (data, auth) {
        auth = auth || null;
        return client._request('PATCH', self.url(), data, auth);
    };

    self.delete = function (auth) {
        auth = auth || null;
        return client._request('DELETE', self.url(), auth);
    };
    return self;
}

module.exports = RestClient;