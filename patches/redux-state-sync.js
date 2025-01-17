import {
  __commonJS,
  __esm,
  __export,
  __toCommonJS,
  __toESM
} from "./chunk-S5KM4IGW.js";

// node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/util.js
function isPromise(obj) {
  if (obj && typeof obj.then === "function") {
    return true;
  } else {
    return false;
  }
}
function sleep(time) {
  if (!time)
    time = 0;
  return new Promise(function(res) {
    return setTimeout(res, time);
  });
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomToken() {
  return Math.random().toString(36).substring(2);
}
function microSeconds() {
  var ms = new Date().getTime();
  if (ms === lastMs) {
    additional++;
    return ms * 1e3 + additional;
  } else {
    lastMs = ms;
    additional = 0;
    return ms * 1e3;
  }
}
var lastMs, additional, isNode;
var init_util = __esm({
  "node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/util.js"() {
    lastMs = 0;
    additional = 0;
    isNode = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
  }
});

// node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/methods/native.js
function create(channelName) {
  var state = {
    messagesCallback: null,
    bc: new BroadcastChannel(channelName),
    subFns: []
  };
  state.bc.onmessage = function(msg) {
    if (state.messagesCallback) {
      state.messagesCallback(msg.data);
    }
  };
  return state;
}
function close(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}
function postMessage(channelState, messageJson) {
  try {
	const messageString = JSON.stringify(messageJson);
    channelState.bc.postMessage(messageString, false);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  if (isNode && typeof window === "undefined")
    return false;
  if (typeof BroadcastChannel === "function") {
    if (BroadcastChannel._pubkey) {
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    }
    return true;
  } else
    return false;
}
function averageResponseTime() {
  return 150;
}
var microSeconds2, type, native_default;
var init_native = __esm({
  "node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/methods/native.js"() {
    init_util();
    microSeconds2 = microSeconds;
    type = "native";
    native_default = {
      create,
      close,
      onMessage,
      postMessage,
      canBeUsed,
      type,
      averageResponseTime,
      microSeconds: microSeconds2
    };
  }
});

// node_modules/oblivious-set/dist/es/index.js
function removeTooOldValues(obliviousSet) {
  var olderThen = now() - obliviousSet.ttl;
  var iterator = obliviousSet.set[Symbol.iterator]();
  while (true) {
    var value = iterator.next().value;
    if (!value) {
      return;
    }
    var time = obliviousSet.timeMap.get(value);
    if (time < olderThen) {
      obliviousSet.timeMap.delete(value);
      obliviousSet.set.delete(value);
    } else {
      return;
    }
  }
}
function now() {
  return new Date().getTime();
}
var ObliviousSet;
var init_es = __esm({
  "node_modules/oblivious-set/dist/es/index.js"() {
    ObliviousSet = function() {
      function ObliviousSet2(ttl) {
        this.ttl = ttl;
        this.set = /* @__PURE__ */ new Set();
        this.timeMap = /* @__PURE__ */ new Map();
      }
      ObliviousSet2.prototype.has = function(value) {
        return this.set.has(value);
      };
      ObliviousSet2.prototype.add = function(value) {
        var _this = this;
        this.timeMap.set(value, now());
        this.set.add(value);
        setTimeout(function() {
          removeTooOldValues(_this);
        }, 0);
      };
      ObliviousSet2.prototype.clear = function() {
        this.set.clear();
        this.timeMap.clear();
      };
      return ObliviousSet2;
    }();
  }
});

// node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/options.js
function fillOptionsWithDefaults() {
  var originalOptions = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var options = JSON.parse(JSON.stringify(originalOptions));
  if (typeof options.webWorkerSupport === "undefined")
    options.webWorkerSupport = true;
  if (!options.idb)
    options.idb = {};
  if (!options.idb.ttl)
    options.idb.ttl = 1e3 * 45;
  if (!options.idb.fallbackInterval)
    options.idb.fallbackInterval = 150;
  if (originalOptions.idb && typeof originalOptions.idb.onclose === "function")
    options.idb.onclose = originalOptions.idb.onclose;
  if (!options.localstorage)
    options.localstorage = {};
  if (!options.localstorage.removeTimeout)
    options.localstorage.removeTimeout = 1e3 * 60;
  if (originalOptions.methods)
    options.methods = originalOptions.methods;
  if (!options.node)
    options.node = {};
  if (!options.node.ttl)
    options.node.ttl = 1e3 * 60 * 2;
  if (typeof options.node.useFastPath === "undefined")
    options.node.useFastPath = true;
  return options;
}
var init_options = __esm({
  "node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/options.js"() {
  }
});

// node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/methods/indexed-db.js
function getIdb() {
  if (typeof indexedDB !== "undefined")
    return indexedDB;
  if (typeof window !== "undefined") {
    if (typeof window.mozIndexedDB !== "undefined")
      return window.mozIndexedDB;
    if (typeof window.webkitIndexedDB !== "undefined")
      return window.webkitIndexedDB;
    if (typeof window.msIndexedDB !== "undefined")
      return window.msIndexedDB;
  }
  return false;
}
function createDatabase(channelName) {
  var IndexedDB = getIdb();
  var dbName = DB_PREFIX + channelName;
  var openRequest = IndexedDB.open(dbName, 1);
  openRequest.onupgradeneeded = function(ev) {
    var db = ev.target.result;
    db.createObjectStore(OBJECT_STORE_ID, {
      keyPath: "id",
      autoIncrement: true
    });
  };
  var dbPromise = new Promise(function(res, rej) {
    openRequest.onerror = function(ev) {
      return rej(ev);
    };
    openRequest.onsuccess = function() {
      res(openRequest.result);
    };
  });
  return dbPromise;
}
function writeMessage(db, readerUuid, messageJson) {
  var time = new Date().getTime();
  var writeObject = {
    uuid: readerUuid,
    time,
    data: messageJson
  };
  var transaction = db.transaction([OBJECT_STORE_ID], "readwrite");
  return new Promise(function(res, rej) {
    transaction.oncomplete = function() {
      return res();
    };
    transaction.onerror = function(ev) {
      return rej(ev);
    };
    var objectStore = transaction.objectStore(OBJECT_STORE_ID);
    objectStore.add(writeObject);
  });
}
function getMessagesHigherThan(db, lastCursorId) {
  var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
  var ret = [];
  function openCursor() {
    try {
      var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
      return objectStore.openCursor(keyRangeValue);
    } catch (e) {
      return objectStore.openCursor();
    }
  }
  return new Promise(function(res) {
    openCursor().onsuccess = function(ev) {
      var cursor = ev.target.result;
      if (cursor) {
        if (cursor.value.id < lastCursorId + 1) {
          cursor["continue"](lastCursorId + 1);
        } else {
          ret.push(cursor.value);
          cursor["continue"]();
        }
      } else {
        res(ret);
      }
    };
  });
}
function removeMessageById(db, id) {
  var request = db.transaction([OBJECT_STORE_ID], "readwrite").objectStore(OBJECT_STORE_ID)["delete"](id);
  return new Promise(function(res) {
    request.onsuccess = function() {
      return res();
    };
  });
}
function getOldMessages(db, ttl) {
  var olderThen = new Date().getTime() - ttl;
  var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function(res) {
    objectStore.openCursor().onsuccess = function(ev) {
      var cursor = ev.target.result;
      if (cursor) {
        var msgObk = cursor.value;
        if (msgObk.time < olderThen) {
          ret.push(msgObk);
          cursor["continue"]();
        } else {
          res(ret);
          return;
        }
      } else {
        res(ret);
      }
    };
  });
}
function cleanOldMessages(db, ttl) {
  return getOldMessages(db, ttl).then(function(tooOld) {
    return Promise.all(tooOld.map(function(msgObj) {
      return removeMessageById(db, msgObj.id);
    }));
  });
}
function create2(channelName, options) {
  options = fillOptionsWithDefaults(options);
  return createDatabase(channelName).then(function(db) {
    var state = {
      closed: false,
      lastCursorId: 0,
      channelName,
      options,
      uuid: randomToken(),
      eMIs: new ObliviousSet(options.idb.ttl * 2),
      writeBlockPromise: Promise.resolve(),
      messagesCallback: null,
      readQueuePromises: [],
      db
    };
    db.onclose = function() {
      state.closed = true;
      if (options.idb.onclose)
        options.idb.onclose();
    };
    _readLoop(state);
    return state;
  });
}
function _readLoop(state) {
  if (state.closed)
    return;
  readNewMessages(state).then(function() {
    return sleep(state.options.idb.fallbackInterval);
  }).then(function() {
    return _readLoop(state);
  });
}
function _filterMessage(msgObj, state) {
  if (msgObj.uuid === state.uuid)
    return false;
  if (state.eMIs.has(msgObj.id))
    return false;
  if (msgObj.data.time < state.messagesCallbackTime)
    return false;
  return true;
}
function readNewMessages(state) {
  if (state.closed)
    return Promise.resolve();
  if (!state.messagesCallback)
    return Promise.resolve();
  return getMessagesHigherThan(state.db, state.lastCursorId).then(function(newerMessages) {
    var useMessages = newerMessages.filter(function(msgObj) {
      return !!msgObj;
    }).map(function(msgObj) {
      if (msgObj.id > state.lastCursorId) {
        state.lastCursorId = msgObj.id;
      }
      return msgObj;
    }).filter(function(msgObj) {
      return _filterMessage(msgObj, state);
    }).sort(function(msgObjA, msgObjB) {
      return msgObjA.time - msgObjB.time;
    });
    useMessages.forEach(function(msgObj) {
      if (state.messagesCallback) {
        state.eMIs.add(msgObj.id);
        state.messagesCallback(msgObj.data);
      }
    });
    return Promise.resolve();
  });
}
function close2(channelState) {
  channelState.closed = true;
  channelState.db.close();
}
function postMessage2(channelState, messageJson) {
  channelState.writeBlockPromise = channelState.writeBlockPromise.then(function() {
    return writeMessage(channelState.db, channelState.uuid, messageJson);
  }).then(function() {
    if (randomInt(0, 10) === 0) {
      cleanOldMessages(channelState.db, channelState.options.idb.ttl);
    }
  });
  return channelState.writeBlockPromise;
}
function onMessage2(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
  readNewMessages(channelState);
}
function canBeUsed2() {
  if (isNode)
    return false;
  var idb = getIdb();
  if (!idb)
    return false;
  return true;
}
function averageResponseTime2(options) {
  return options.idb.fallbackInterval * 2;
}
var microSeconds3, DB_PREFIX, OBJECT_STORE_ID, type2, indexed_db_default;
var init_indexed_db = __esm({
  "node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/methods/indexed-db.js"() {
    init_util();
    init_es();
    init_options();
    microSeconds3 = microSeconds;
    DB_PREFIX = "pubkey.broadcast-channel-0-";
    OBJECT_STORE_ID = "messages";
    type2 = "idb";
    indexed_db_default = {
      create: create2,
      close: close2,
      onMessage: onMessage2,
      postMessage: postMessage2,
      canBeUsed: canBeUsed2,
      type: type2,
      averageResponseTime: averageResponseTime2,
      microSeconds: microSeconds3
    };
  }
});

// node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/methods/localstorage.js
function getLocalStorage() {
  var localStorage;
  if (typeof window === "undefined")
    return null;
  try {
    localStorage = window.localStorage;
    localStorage = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch (e) {
  }
  return localStorage;
}
function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
function postMessage3(channelState, messageJson) {
  return new Promise(function(res) {
    sleep().then(function() {
      var key = storageKey(channelState.channelName);
      var writeObj = {
        token: randomToken(),
        time: new Date().getTime(),
        data: messageJson,
        uuid: channelState.uuid
      };
      var value = JSON.stringify(writeObj);
      getLocalStorage().setItem(key, value);
      var ev = document.createEvent("Event");
      ev.initEvent("storage", true, true);
      ev.key = key;
      ev.newValue = value;
      window.dispatchEvent(ev);
      res();
    });
  });
}
function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);
  var listener = function listener2(ev) {
    if (ev.key === key) {
      fn(JSON.parse(ev.newValue));
    }
  };
  window.addEventListener("storage", listener);
  return listener;
}
function removeStorageEventListener(listener) {
  window.removeEventListener("storage", listener);
}
function create3(channelName, options) {
  options = fillOptionsWithDefaults(options);
  if (!canBeUsed3()) {
    throw new Error("BroadcastChannel: localstorage cannot be used");
  }
  var uuid = randomToken();
  var eMIs = new ObliviousSet(options.localstorage.removeTimeout);
  var state = {
    channelName,
    uuid,
    eMIs
  };
  state.listener = addStorageEventListener(channelName, function(msgObj) {
    if (!state.messagesCallback)
      return;
    if (msgObj.uuid === uuid)
      return;
    if (!msgObj.token || eMIs.has(msgObj.token))
      return;
    if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime)
      return;
    eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}
function close3(channelState) {
  removeStorageEventListener(channelState.listener);
}
function onMessage3(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
function canBeUsed3() {
  if (isNode)
    return false;
  var ls = getLocalStorage();
  if (!ls)
    return false;
  try {
    var key = "__broadcastchannel_check";
    ls.setItem(key, "works");
    ls.removeItem(key);
  } catch (e) {
    return false;
  }
  return true;
}
function averageResponseTime3() {
  var defaultTime = 120;
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    return defaultTime * 2;
  }
  return defaultTime;
}
var microSeconds4, KEY_PREFIX, type3, localstorage_default;
var init_localstorage = __esm({
  "node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/methods/localstorage.js"() {
    init_es();
    init_options();
    init_util();
    microSeconds4 = microSeconds;
    KEY_PREFIX = "pubkey.broadcastChannel-";
    type3 = "localstorage";
    localstorage_default = {
      create: create3,
      close: close3,
      onMessage: onMessage3,
      postMessage: postMessage3,
      canBeUsed: canBeUsed3,
      type: type3,
      averageResponseTime: averageResponseTime3,
      microSeconds: microSeconds4
    };
  }
});

// node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/methods/simulate.js
function create4(channelName) {
  var state = {
    name: channelName,
    messagesCallback: null
  };
  SIMULATE_CHANNELS.add(state);
  return state;
}
function close4(channelState) {
  SIMULATE_CHANNELS["delete"](channelState);
}
function postMessage4(channelState, messageJson) {
  return new Promise(function(res) {
    return setTimeout(function() {
      var channelArray = Array.from(SIMULATE_CHANNELS);
      channelArray.filter(function(channel) {
        return channel.name === channelState.name;
      }).filter(function(channel) {
        return channel !== channelState;
      }).filter(function(channel) {
        return !!channel.messagesCallback;
      }).forEach(function(channel) {
        return channel.messagesCallback(messageJson);
      });
      res();
    }, 5);
  });
}
function onMessage4(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed4() {
  return true;
}
function averageResponseTime4() {
  return 5;
}
var microSeconds5, type4, SIMULATE_CHANNELS, simulate_default;
var init_simulate = __esm({
  "node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/methods/simulate.js"() {
    init_util();
    microSeconds5 = microSeconds;
    type4 = "simulate";
    SIMULATE_CHANNELS = /* @__PURE__ */ new Set();
    simulate_default = {
      create: create4,
      close: close4,
      onMessage: onMessage4,
      postMessage: postMessage4,
      canBeUsed: canBeUsed4,
      type: type4,
      averageResponseTime: averageResponseTime4,
      microSeconds: microSeconds5
    };
  }
});

// (disabled):node_modules/redux-state-sync/node_modules/broadcast-channel/src/methods/node.js
var require_node = __commonJS({
  "(disabled):node_modules/redux-state-sync/node_modules/broadcast-channel/src/methods/node.js"() {
  }
});

// node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/method-chooser.js
function chooseMethod(options) {
  var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);
  if (options.type) {
    if (options.type === "simulate") {
      return simulate_default;
    }
    var ret = chooseMethods.find(function(m) {
      return m.type === options.type;
    });
    if (!ret)
      throw new Error("method-type " + options.type + " not found");
    else
      return ret;
  }
  if (!options.webWorkerSupport && !isNode) {
    chooseMethods = chooseMethods.filter(function(m) {
      return m.type !== "idb";
    });
  }
  var useMethod = chooseMethods.find(function(method) {
    return method.canBeUsed();
  });
  if (!useMethod)
    throw new Error("No useable methode found:" + JSON.stringify(METHODS.map(function(m) {
      return m.type;
    })));
  else
    return useMethod;
}
var METHODS, NodeMethod2;
var init_method_chooser = __esm({
  "node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/method-chooser.js"() {
    init_native();
    init_indexed_db();
    init_localstorage();
    init_simulate();
    init_util();
    METHODS = [
      native_default,
      indexed_db_default,
      localstorage_default
    ];
    if (isNode) {
      NodeMethod2 = require_node();
      if (typeof NodeMethod2.canBeUsed === "function") {
        METHODS.push(NodeMethod2);
      }
    }
  }
});

// node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/broadcast-channel.js
function clearNodeFolder(options) {
  options = fillOptionsWithDefaults(options);
  var method = chooseMethod(options);
  if (method.type === "node") {
    return method.clearNodeFolder().then(function() {
      return true;
    });
  } else {
    return Promise.resolve(false);
  }
}
function enforceOptions(options) {
  ENFORCED_OPTIONS = options;
}
function _post(broadcastChannel, type5, msg) {
  var time = broadcastChannel.method.microSeconds();
  var msgObj = {
    time,
    type: type5,
    data: msg
  };
  var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : Promise.resolve();
  return awaitPrepare.then(function() {
    var sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
    broadcastChannel._uMP.add(sendPromise);
    sendPromise["catch"]().then(function() {
      return broadcastChannel._uMP["delete"](sendPromise);
    });
    return sendPromise;
  });
}
function _prepareChannel(channel) {
  var maybePromise = channel.method.create(channel.name, channel.options);
  if (isPromise(maybePromise)) {
    channel._prepP = maybePromise;
    maybePromise.then(function(s) {
      channel._state = s;
    });
  } else {
    channel._state = maybePromise;
  }
}
function _hasMessageListeners(channel) {
  if (channel._addEL.message.length > 0)
    return true;
  if (channel._addEL.internal.length > 0)
    return true;
  return false;
}
function _addListenerObject(channel, type5, obj) {
  channel._addEL[type5].push(obj);
  _startListening(channel);
}
function _removeListenerObject(channel, type5, obj) {
  channel._addEL[type5] = channel._addEL[type5].filter(function(o) {
    return o !== obj;
  });
  _stopListening(channel);
}
function _startListening(channel) {
  if (!channel._iL && _hasMessageListeners(channel)) {
    var listenerFn = function listenerFn2(msgObj) {
      channel._addEL[msgObj.type].forEach(function(obj) {
        if (msgObj.time >= obj.time) {
          obj.fn(msgObj.data);
        }
      });
    };
    var time = channel.method.microSeconds();
    if (channel._prepP) {
      channel._prepP.then(function() {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      });
    } else {
      channel._iL = true;
      channel.method.onMessage(channel._state, listenerFn, time);
    }
  }
}
function _stopListening(channel) {
  if (channel._iL && !_hasMessageListeners(channel)) {
    channel._iL = false;
    var time = channel.method.microSeconds();
    channel.method.onMessage(channel._state, null, time);
  }
}
var BroadcastChannel2, ENFORCED_OPTIONS;
var init_broadcast_channel = __esm({
  "node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/broadcast-channel.js"() {
    init_util();
    init_method_chooser();
    init_options();
    BroadcastChannel2 = function BroadcastChannel3(name, options) {
      this.name = name;
      if (ENFORCED_OPTIONS) {
        options = ENFORCED_OPTIONS;
      }
      this.options = fillOptionsWithDefaults(options);
      this.method = chooseMethod(this.options);
      this._iL = false;
      this._onML = null;
      this._addEL = {
        message: [],
        internal: []
      };
      this._uMP = /* @__PURE__ */ new Set();
      this._befC = [];
      this._prepP = null;
      _prepareChannel(this);
    };
    BroadcastChannel2._pubkey = true;
    BroadcastChannel2.prototype = {
      postMessage: function postMessage5(msg) {
        if (this.closed) {
          throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed");
        }
        return _post(this, "message", msg);
      },
      postInternal: function postInternal(msg) {
        return _post(this, "internal", msg);
      },
      set onmessage(fn) {
        var time = this.method.microSeconds();
        var listenObj = {
          time,
          fn
        };
        _removeListenerObject(this, "message", this._onML);
        if (fn && typeof fn === "function") {
          this._onML = listenObj;
          _addListenerObject(this, "message", listenObj);
        } else {
          this._onML = null;
        }
      },
      addEventListener: function addEventListener(type5, fn) {
        var time = this.method.microSeconds();
        var listenObj = {
          time,
          fn
        };
        _addListenerObject(this, type5, listenObj);
      },
      removeEventListener: function removeEventListener(type5, fn) {
        var obj = this._addEL[type5].find(function(obj2) {
          return obj2.fn === fn;
        });
        _removeListenerObject(this, type5, obj);
      },
      close: function close5() {
        var _this = this;
        if (this.closed) {
          return;
        }
        this.closed = true;
        var awaitPrepare = this._prepP ? this._prepP : Promise.resolve();
        this._onML = null;
        this._addEL.message = [];
        return awaitPrepare.then(function() {
          return Promise.all(Array.from(_this._uMP));
        }).then(function() {
          return Promise.all(_this._befC.map(function(fn) {
            return fn();
          }));
        }).then(function() {
          return _this.method.close(_this._state);
        });
      },
      get type() {
        return this.method.type;
      },
      get isClosed() {
        return this.closed;
      }
    };
  }
});

// node_modules/detect-node/index.esm.js
var index_esm_default;
var init_index_esm = __esm({
  "node_modules/detect-node/index.esm.js"() {
    index_esm_default = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
  }
});

// node_modules/unload/dist/es/browser.js
function add(fn) {
  if (typeof WorkerGlobalScope === "function" && self instanceof WorkerGlobalScope) {
  } else {
    if (typeof window.addEventListener !== "function")
      return;
    window.addEventListener("beforeunload", function() {
      fn();
    }, true);
    window.addEventListener("unload", function() {
      fn();
    }, true);
  }
}
var browser_default;
var init_browser = __esm({
  "node_modules/unload/dist/es/browser.js"() {
    browser_default = {
      add
    };
  }
});

// (disabled):node_modules/unload/dist/es/node.js
var require_node2 = __commonJS({
  "(disabled):node_modules/unload/dist/es/node.js"() {
  }
});

// node_modules/unload/dist/es/index.js
function startListening() {
  if (startedListening)
    return;
  startedListening = true;
  USE_METHOD.add(runAll);
}
function add2(fn) {
  startListening();
  if (typeof fn !== "function")
    throw new Error("Listener is no function");
  LISTENERS.add(fn);
  var addReturn = {
    remove: function remove() {
      return LISTENERS["delete"](fn);
    },
    run: function run() {
      LISTENERS["delete"](fn);
      return fn();
    }
  };
  return addReturn;
}
function runAll() {
  var promises = [];
  LISTENERS.forEach(function(fn) {
    promises.push(fn());
    LISTENERS["delete"](fn);
  });
  return Promise.all(promises);
}
function removeAll() {
  LISTENERS.clear();
}
function getSize() {
  return LISTENERS.size;
}
var import_node, USE_METHOD, LISTENERS, startedListening, es_default;
var init_es2 = __esm({
  "node_modules/unload/dist/es/index.js"() {
    init_index_esm();
    init_browser();
    import_node = __toESM(require_node2());
    USE_METHOD = index_esm_default ? import_node.default : browser_default;
    LISTENERS = /* @__PURE__ */ new Set();
    startedListening = false;
    es_default = {
      add: add2,
      runAll,
      removeAll,
      getSize
    };
  }
});

// node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/leader-election.js
function _awaitLeadershipOnce(leaderElector) {
  if (leaderElector.isLeader)
    return Promise.resolve();
  return new Promise(function(res) {
    var resolved = false;
    function finish() {
      if (resolved) {
        return;
      }
      resolved = true;
      clearInterval(interval);
      leaderElector._channel.removeEventListener("internal", whenDeathListener);
      res(true);
    }
    leaderElector.applyOnce().then(function() {
      if (leaderElector.isLeader) {
        finish();
      }
    });
    var interval = setInterval(function() {
      leaderElector.applyOnce().then(function() {
        if (leaderElector.isLeader) {
          finish();
        }
      });
    }, leaderElector._options.fallbackInterval);
    leaderElector._invs.push(interval);
    var whenDeathListener = function whenDeathListener2(msg) {
      if (msg.context === "leader" && msg.action === "death") {
        leaderElector.applyOnce().then(function() {
          if (leaderElector.isLeader)
            finish();
        });
      }
    };
    leaderElector._channel.addEventListener("internal", whenDeathListener);
    leaderElector._lstns.push(whenDeathListener);
  });
}
function _sendMessage(leaderElector, action) {
  var msgJson = {
    context: "leader",
    action,
    token: leaderElector.token
  };
  return leaderElector._channel.postInternal(msgJson);
}
function beLeader(leaderElector) {
  leaderElector.isLeader = true;
  var unloadFn = es_default.add(function() {
    return leaderElector.die();
  });
  leaderElector._unl.push(unloadFn);
  var isLeaderListener = function isLeaderListener2(msg) {
    if (msg.context === "leader" && msg.action === "apply") {
      _sendMessage(leaderElector, "tell");
    }
    if (msg.context === "leader" && msg.action === "tell" && !leaderElector._dpLC) {
      leaderElector._dpLC = true;
      leaderElector._dpL();
      _sendMessage(leaderElector, "tell");
    }
  };
  leaderElector._channel.addEventListener("internal", isLeaderListener);
  leaderElector._lstns.push(isLeaderListener);
  return _sendMessage(leaderElector, "tell");
}
function fillOptionsWithDefaults2(options, channel) {
  if (!options)
    options = {};
  options = JSON.parse(JSON.stringify(options));
  if (!options.fallbackInterval) {
    options.fallbackInterval = 3e3;
  }
  if (!options.responseTime) {
    options.responseTime = channel.method.averageResponseTime(channel.options);
  }
  return options;
}
function createLeaderElection(channel, options) {
  if (channel._leaderElector) {
    throw new Error("BroadcastChannel already has a leader-elector");
  }
  options = fillOptionsWithDefaults2(options, channel);
  var elector = new LeaderElection(channel, options);
  channel._befC.push(function() {
    return elector.die();
  });
  channel._leaderElector = elector;
  return elector;
}
var LeaderElection;
var init_leader_election = __esm({
  "node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/leader-election.js"() {
    init_util();
    init_es2();
    LeaderElection = function LeaderElection2(channel, options) {
      this._channel = channel;
      this._options = options;
      this.isLeader = false;
      this.isDead = false;
      this.token = randomToken();
      this._isApl = false;
      this._reApply = false;
      this._unl = [];
      this._lstns = [];
      this._invs = [];
      this._dpL = function() {
      };
      this._dpLC = false;
    };
    LeaderElection.prototype = {
      applyOnce: function applyOnce() {
        var _this = this;
        if (this.isLeader)
          return Promise.resolve(false);
        if (this.isDead)
          return Promise.resolve(false);
        if (this._isApl) {
          this._reApply = true;
          return Promise.resolve(false);
        }
        this._isApl = true;
        var stopCriteria = false;
        var recieved = [];
        var handleMessage = function handleMessage2(msg) {
          if (msg.context === "leader" && msg.token != _this.token) {
            recieved.push(msg);
            if (msg.action === "apply") {
              if (msg.token > _this.token) {
                stopCriteria = true;
              }
            }
            if (msg.action === "tell") {
              stopCriteria = true;
            }
          }
        };
        this._channel.addEventListener("internal", handleMessage);
        var ret = _sendMessage(this, "apply").then(function() {
          return sleep(_this._options.responseTime);
        }).then(function() {
          if (stopCriteria)
            return Promise.reject(new Error());
          else
            return _sendMessage(_this, "apply");
        }).then(function() {
          return sleep(_this._options.responseTime);
        }).then(function() {
          if (stopCriteria)
            return Promise.reject(new Error());
          else
            return _sendMessage(_this);
        }).then(function() {
          return beLeader(_this);
        }).then(function() {
          return true;
        })["catch"](function() {
          return false;
        }).then(function(success) {
          _this._channel.removeEventListener("internal", handleMessage);
          _this._isApl = false;
          if (!success && _this._reApply) {
            _this._reApply = false;
            return _this.applyOnce();
          } else
            return success;
        });
        return ret;
      },
      awaitLeadership: function awaitLeadership() {
        if (!this._aLP) {
          this._aLP = _awaitLeadershipOnce(this);
        }
        return this._aLP;
      },
      set onduplicate(fn) {
        this._dpL = fn;
      },
      die: function die() {
        var _this2 = this;
        if (this.isDead)
          return;
        this.isDead = true;
        this._lstns.forEach(function(listener) {
          return _this2._channel.removeEventListener("internal", listener);
        });
        this._invs.forEach(function(interval) {
          return clearInterval(interval);
        });
        this._unl.forEach(function(uFn) {
          uFn.remove();
        });
        return _sendMessage(this, "death");
      }
    };
  }
});

// node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/index.js
var es_exports = {};
__export(es_exports, {
  BroadcastChannel: () => BroadcastChannel2,
  beLeader: () => beLeader,
  clearNodeFolder: () => clearNodeFolder,
  createLeaderElection: () => createLeaderElection,
  enforceOptions: () => enforceOptions
});
var init_es3 = __esm({
  "node_modules/redux-state-sync/node_modules/broadcast-channel/dist/es/index.js"() {
    init_broadcast_channel();
    init_leader_election();
  }
});

// node_modules/redux-state-sync/dist/syncState.js
var require_syncState = __commonJS({
  "node_modules/redux-state-sync/dist/syncState.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.initMessageListener = exports.initStateWithPrevTab = exports.withReduxStateSync = exports.createReduxStateSync = exports.createStateSyncMiddleware = exports.WINDOW_STATE_SYNC_ID = exports.INIT_MESSAGE_LISTENER = exports.RECEIVE_INIT_STATE = exports.SEND_INIT_STATE = exports.GET_INIT_STATE = void 0;
    exports.generateUuidForAction = generateUuidForAction;
    exports.isActionAllowed = isActionAllowed;
    exports.isActionSynced = isActionSynced;
    exports.MessageListener = MessageListener;
    var _broadcastChannel = (init_es3(), __toCommonJS(es_exports));
    var lastUuid = 0;
    var GET_INIT_STATE = exports.GET_INIT_STATE = "&_GET_INIT_STATE";
    var SEND_INIT_STATE = exports.SEND_INIT_STATE = "&_SEND_INIT_STATE";
    var RECEIVE_INIT_STATE = exports.RECEIVE_INIT_STATE = "&_RECEIVE_INIT_STATE";
    var INIT_MESSAGE_LISTENER = exports.INIT_MESSAGE_LISTENER = "&_INIT_MESSAGE_LISTENER";
    var defaultConfig = {
      channel: "redux_state_sync",
      predicate: null,
      blacklist: [],
      whitelist: [],
      broadcastChannelOption: void 0,
      prepareState: function prepareState(state) {
        return state;
      },
      receiveState: function receiveState(prevState, nextState) {
        return nextState;
      }
    };
    var getIniteState = function getIniteState2() {
      return { type: GET_INIT_STATE };
    };
    var sendIniteState = function sendIniteState2() {
      return { type: SEND_INIT_STATE };
    };
    var receiveIniteState = function receiveIniteState2(state) {
      return { type: RECEIVE_INIT_STATE, payload: state };
    };
    var initListener = function initListener2() {
      return { type: INIT_MESSAGE_LISTENER };
    };
    function s4() {
      return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
    }
    function guid() {
      return "" + s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }
    var WINDOW_STATE_SYNC_ID = exports.WINDOW_STATE_SYNC_ID = guid();
    function generateUuidForAction(action) {
      var stampedAction = action;
      stampedAction.$uuid = guid();
      stampedAction.$wuid = WINDOW_STATE_SYNC_ID;
      return stampedAction;
    }
    function isActionAllowed(_ref) {
      var predicate = _ref.predicate, blacklist = _ref.blacklist, whitelist = _ref.whitelist;
      var allowed = function allowed2() {
        return true;
      };
      if (predicate && typeof predicate === "function") {
        allowed = predicate;
      } else if (Array.isArray(blacklist)) {
        allowed = function allowed2(action) {
          return blacklist.indexOf(action.type) < 0;
        };
      } else if (Array.isArray(whitelist)) {
        allowed = function allowed2(action) {
          return whitelist.indexOf(action.type) >= 0;
        };
      }
      return allowed;
    }
    function isActionSynced(action) {
      return !!action.$isSync;
    }
    function MessageListener(_ref2) {
      var channel = _ref2.channel, dispatch = _ref2.dispatch, allowed = _ref2.allowed;
      var isSynced = false;
      var tabs = {};
      this.handleOnMessage = function(stampedAction) {
        if (stampedAction.$wuid === WINDOW_STATE_SYNC_ID) {
          return;
        }
        if (stampedAction.type === RECEIVE_INIT_STATE) {
          return;
        }
        if (stampedAction.$uuid && stampedAction.$uuid !== lastUuid) {
          if (stampedAction.type === GET_INIT_STATE && !tabs[stampedAction.$wuid]) {
            tabs[stampedAction.$wuid] = true;
            dispatch(sendIniteState());
          } else if (stampedAction.type === SEND_INIT_STATE && !tabs[stampedAction.$wuid]) {
            if (!isSynced) {
              isSynced = true;
              dispatch(receiveIniteState(stampedAction.payload));
            }
          } else if (allowed(stampedAction)) {
            lastUuid = stampedAction.$uuid;
            dispatch(Object.assign(stampedAction, {
              $isSync: true
            }));
          }
        }
      };
      this.messageChannel = channel;
      this.messageChannel.onmessage = this.handleOnMessage;
    }
    var createStateSyncMiddleware = exports.createStateSyncMiddleware = function createStateSyncMiddleware2() {
      var config = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : defaultConfig;
      var allowed = isActionAllowed(config);
      var channel = new _broadcastChannel.BroadcastChannel(config.channel, config.broadcastChannelOption);
      var prepareState = config.prepareState || defaultConfig.prepareState;
      var messageListener = null;
      return function(_ref3) {
        var getState = _ref3.getState, dispatch = _ref3.dispatch;
        return function(next) {
          return function(action) {
            if (!messageListener) {
              messageListener = new MessageListener({ channel, dispatch, allowed });
            }
            if (action && !action.$uuid) {
              var stampedAction = generateUuidForAction(action);
              lastUuid = stampedAction.$uuid;
              try {
                if (action.type === SEND_INIT_STATE) {
                  if (getState()) {
                    stampedAction.payload = prepareState(getState());
                    channel.postMessage(stampedAction);
                  }
                  return next(action);
                }
                if (allowed(stampedAction) || action.type === GET_INIT_STATE) {
                  channel.postMessage(stampedAction);
                }
              } catch (e) {
                console.error("Your browser doesn't support cross tab communication");
              }
            }
            return next(Object.assign(action, {
              $isSync: typeof action.$isSync === "undefined" ? false : action.$isSync
            }));
          };
        };
      };
    };
    var createReduxStateSync = exports.createReduxStateSync = function createReduxStateSync2(appReducer) {
      var receiveState = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : defaultConfig.receiveState;
      return function(state, action) {
        var initState = state;
        if (action.type === RECEIVE_INIT_STATE) {
          initState = receiveState(state, action.payload);
        }
        return appReducer(initState, action);
      };
    };
    var withReduxStateSync = exports.withReduxStateSync = createReduxStateSync;
    var initStateWithPrevTab = exports.initStateWithPrevTab = function initStateWithPrevTab2(_ref4) {
      var dispatch = _ref4.dispatch;
      dispatch(getIniteState());
    };
    var initMessageListener = exports.initMessageListener = function initMessageListener2(_ref5) {
      var dispatch = _ref5.dispatch;
      dispatch(initListener());
    };
  }
});

// dep:redux-state-sync
var redux_state_sync_default = require_syncState();
export {
  redux_state_sync_default as default
};
//# sourceMappingURL=redux-state-sync.js.map
