/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.base = (function() {

    /**
     * Namespace base.
     * @exports base
     * @namespace
     */
    var base = {};

    base.BasePayload = (function() {

        /**
         * Properties of a BasePayload.
         * @memberof base
         * @interface IBasePayload
         * @property {Uint8Array|null} [meta] BasePayload meta
         */

        /**
         * Constructs a new BasePayload.
         * @memberof base
         * @classdesc Represents a BasePayload.
         * @implements IBasePayload
         * @constructor
         * @param {base.IBasePayload=} [properties] Properties to set
         */
        function BasePayload(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BasePayload meta.
         * @member {Uint8Array} meta
         * @memberof base.BasePayload
         * @instance
         */
        BasePayload.prototype.meta = $util.newBuffer([]);

        /**
         * Creates a new BasePayload instance using the specified properties.
         * @function create
         * @memberof base.BasePayload
         * @static
         * @param {base.IBasePayload=} [properties] Properties to set
         * @returns {base.BasePayload} BasePayload instance
         */
        BasePayload.create = function create(properties) {
            return new BasePayload(properties);
        };

        /**
         * Encodes the specified BasePayload message. Does not implicitly {@link base.BasePayload.verify|verify} messages.
         * @function encode
         * @memberof base.BasePayload
         * @static
         * @param {base.IBasePayload} message BasePayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BasePayload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.meta);
            return writer;
        };

        /**
         * Encodes the specified BasePayload message, length delimited. Does not implicitly {@link base.BasePayload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof base.BasePayload
         * @static
         * @param {base.IBasePayload} message BasePayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BasePayload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BasePayload message from the specified reader or buffer.
         * @function decode
         * @memberof base.BasePayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {base.BasePayload} BasePayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BasePayload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.base.BasePayload();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.meta = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BasePayload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof base.BasePayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {base.BasePayload} BasePayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BasePayload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BasePayload message.
         * @function verify
         * @memberof base.BasePayload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BasePayload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.meta != null && message.hasOwnProperty("meta"))
                if (!(message.meta && typeof message.meta.length === "number" || $util.isString(message.meta)))
                    return "meta: buffer expected";
            return null;
        };

        /**
         * Creates a BasePayload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof base.BasePayload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {base.BasePayload} BasePayload
         */
        BasePayload.fromObject = function fromObject(object) {
            if (object instanceof $root.base.BasePayload)
                return object;
            var message = new $root.base.BasePayload();
            if (object.meta != null)
                if (typeof object.meta === "string")
                    $util.base64.decode(object.meta, message.meta = $util.newBuffer($util.base64.length(object.meta)), 0);
                else if (object.meta.length >= 0)
                    message.meta = object.meta;
            return message;
        };

        /**
         * Creates a plain object from a BasePayload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof base.BasePayload
         * @static
         * @param {base.BasePayload} message BasePayload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BasePayload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.meta = "";
                else {
                    object.meta = [];
                    if (options.bytes !== Array)
                        object.meta = $util.newBuffer(object.meta);
                }
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = options.bytes === String ? $util.base64.encode(message.meta, 0, message.meta.length) : options.bytes === Array ? Array.prototype.slice.call(message.meta) : message.meta;
            return object;
        };

        /**
         * Converts this BasePayload to JSON.
         * @function toJSON
         * @memberof base.BasePayload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BasePayload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BasePayload
         * @function getTypeUrl
         * @memberof base.BasePayload
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BasePayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/base.BasePayload";
        };

        return BasePayload;
    })();

    return base;
})();

$root.commoniot = (function() {

    /**
     * Namespace commoniot.
     * @exports commoniot
     * @namespace
     */
    var commoniot = {};

    commoniot.InfoDevice = (function() {

        /**
         * Properties of an InfoDevice.
         * @memberof commoniot
         * @interface IInfoDevice
         * @property {Uint8Array|null} [uid] InfoDevice uid
         * @property {number|null} [firmware] InfoDevice firmware
         * @property {number|null} [hardware] InfoDevice hardware
         */

        /**
         * Constructs a new InfoDevice.
         * @memberof commoniot
         * @classdesc Represents an InfoDevice.
         * @implements IInfoDevice
         * @constructor
         * @param {commoniot.IInfoDevice=} [properties] Properties to set
         */
        function InfoDevice(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InfoDevice uid.
         * @member {Uint8Array} uid
         * @memberof commoniot.InfoDevice
         * @instance
         */
        InfoDevice.prototype.uid = $util.newBuffer([]);

        /**
         * InfoDevice firmware.
         * @member {number} firmware
         * @memberof commoniot.InfoDevice
         * @instance
         */
        InfoDevice.prototype.firmware = 0;

        /**
         * InfoDevice hardware.
         * @member {number} hardware
         * @memberof commoniot.InfoDevice
         * @instance
         */
        InfoDevice.prototype.hardware = 0;

        /**
         * Creates a new InfoDevice instance using the specified properties.
         * @function create
         * @memberof commoniot.InfoDevice
         * @static
         * @param {commoniot.IInfoDevice=} [properties] Properties to set
         * @returns {commoniot.InfoDevice} InfoDevice instance
         */
        InfoDevice.create = function create(properties) {
            return new InfoDevice(properties);
        };

        /**
         * Encodes the specified InfoDevice message. Does not implicitly {@link commoniot.InfoDevice.verify|verify} messages.
         * @function encode
         * @memberof commoniot.InfoDevice
         * @static
         * @param {commoniot.IInfoDevice} message InfoDevice message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InfoDevice.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.uid);
            if (message.firmware != null && Object.hasOwnProperty.call(message, "firmware"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.firmware);
            if (message.hardware != null && Object.hasOwnProperty.call(message, "hardware"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.hardware);
            return writer;
        };

        /**
         * Encodes the specified InfoDevice message, length delimited. Does not implicitly {@link commoniot.InfoDevice.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.InfoDevice
         * @static
         * @param {commoniot.IInfoDevice} message InfoDevice message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InfoDevice.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InfoDevice message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.InfoDevice
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.InfoDevice} InfoDevice
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InfoDevice.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.InfoDevice();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.uid = reader.bytes();
                        break;
                    }
                case 2: {
                        message.firmware = reader.uint32();
                        break;
                    }
                case 3: {
                        message.hardware = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InfoDevice message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.InfoDevice
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.InfoDevice} InfoDevice
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InfoDevice.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InfoDevice message.
         * @function verify
         * @memberof commoniot.InfoDevice
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InfoDevice.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!(message.uid && typeof message.uid.length === "number" || $util.isString(message.uid)))
                    return "uid: buffer expected";
            if (message.firmware != null && message.hasOwnProperty("firmware"))
                if (!$util.isInteger(message.firmware))
                    return "firmware: integer expected";
            if (message.hardware != null && message.hasOwnProperty("hardware"))
                if (!$util.isInteger(message.hardware))
                    return "hardware: integer expected";
            return null;
        };

        /**
         * Creates an InfoDevice message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.InfoDevice
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.InfoDevice} InfoDevice
         */
        InfoDevice.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.InfoDevice)
                return object;
            var message = new $root.commoniot.InfoDevice();
            if (object.uid != null)
                if (typeof object.uid === "string")
                    $util.base64.decode(object.uid, message.uid = $util.newBuffer($util.base64.length(object.uid)), 0);
                else if (object.uid.length >= 0)
                    message.uid = object.uid;
            if (object.firmware != null)
                message.firmware = object.firmware >>> 0;
            if (object.hardware != null)
                message.hardware = object.hardware >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an InfoDevice message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.InfoDevice
         * @static
         * @param {commoniot.InfoDevice} message InfoDevice
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InfoDevice.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.uid = "";
                else {
                    object.uid = [];
                    if (options.bytes !== Array)
                        object.uid = $util.newBuffer(object.uid);
                }
                object.firmware = 0;
                object.hardware = 0;
            }
            if (message.uid != null && message.hasOwnProperty("uid"))
                object.uid = options.bytes === String ? $util.base64.encode(message.uid, 0, message.uid.length) : options.bytes === Array ? Array.prototype.slice.call(message.uid) : message.uid;
            if (message.firmware != null && message.hasOwnProperty("firmware"))
                object.firmware = message.firmware;
            if (message.hardware != null && message.hasOwnProperty("hardware"))
                object.hardware = message.hardware;
            return object;
        };

        /**
         * Converts this InfoDevice to JSON.
         * @function toJSON
         * @memberof commoniot.InfoDevice
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InfoDevice.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for InfoDevice
         * @function getTypeUrl
         * @memberof commoniot.InfoDevice
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        InfoDevice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.InfoDevice";
        };

        return InfoDevice;
    })();

    commoniot.InfoFarm = (function() {

        /**
         * Properties of an InfoFarm.
         * @memberof commoniot
         * @interface IInfoFarm
         * @property {number|null} [room] InfoFarm room
         * @property {number|null} [status] InfoFarm status
         */

        /**
         * Constructs a new InfoFarm.
         * @memberof commoniot
         * @classdesc Represents an InfoFarm.
         * @implements IInfoFarm
         * @constructor
         * @param {commoniot.IInfoFarm=} [properties] Properties to set
         */
        function InfoFarm(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InfoFarm room.
         * @member {number} room
         * @memberof commoniot.InfoFarm
         * @instance
         */
        InfoFarm.prototype.room = 0;

        /**
         * InfoFarm status.
         * @member {number} status
         * @memberof commoniot.InfoFarm
         * @instance
         */
        InfoFarm.prototype.status = 0;

        /**
         * Creates a new InfoFarm instance using the specified properties.
         * @function create
         * @memberof commoniot.InfoFarm
         * @static
         * @param {commoniot.IInfoFarm=} [properties] Properties to set
         * @returns {commoniot.InfoFarm} InfoFarm instance
         */
        InfoFarm.create = function create(properties) {
            return new InfoFarm(properties);
        };

        /**
         * Encodes the specified InfoFarm message. Does not implicitly {@link commoniot.InfoFarm.verify|verify} messages.
         * @function encode
         * @memberof commoniot.InfoFarm
         * @static
         * @param {commoniot.IInfoFarm} message InfoFarm message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InfoFarm.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.room != null && Object.hasOwnProperty.call(message, "room"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.room);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.status);
            return writer;
        };

        /**
         * Encodes the specified InfoFarm message, length delimited. Does not implicitly {@link commoniot.InfoFarm.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.InfoFarm
         * @static
         * @param {commoniot.IInfoFarm} message InfoFarm message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InfoFarm.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InfoFarm message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.InfoFarm
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.InfoFarm} InfoFarm
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InfoFarm.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.InfoFarm();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 4: {
                        message.room = reader.uint32();
                        break;
                    }
                case 7: {
                        message.status = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InfoFarm message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.InfoFarm
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.InfoFarm} InfoFarm
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InfoFarm.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InfoFarm message.
         * @function verify
         * @memberof commoniot.InfoFarm
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InfoFarm.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.room != null && message.hasOwnProperty("room"))
                if (!$util.isInteger(message.room))
                    return "room: integer expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            return null;
        };

        /**
         * Creates an InfoFarm message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.InfoFarm
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.InfoFarm} InfoFarm
         */
        InfoFarm.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.InfoFarm)
                return object;
            var message = new $root.commoniot.InfoFarm();
            if (object.room != null)
                message.room = object.room >>> 0;
            if (object.status != null)
                message.status = object.status >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an InfoFarm message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.InfoFarm
         * @static
         * @param {commoniot.InfoFarm} message InfoFarm
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InfoFarm.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.room = 0;
                object.status = 0;
            }
            if (message.room != null && message.hasOwnProperty("room"))
                object.room = message.room;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            return object;
        };

        /**
         * Converts this InfoFarm to JSON.
         * @function toJSON
         * @memberof commoniot.InfoFarm
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InfoFarm.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for InfoFarm
         * @function getTypeUrl
         * @memberof commoniot.InfoFarm
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        InfoFarm.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.InfoFarm";
        };

        return InfoFarm;
    })();

    commoniot.StartCycle = (function() {

        /**
         * Properties of a StartCycle.
         * @memberof commoniot
         * @interface IStartCycle
         * @property {number|null} [at] StartCycle at
         */

        /**
         * Constructs a new StartCycle.
         * @memberof commoniot
         * @classdesc Represents a StartCycle.
         * @implements IStartCycle
         * @constructor
         * @param {commoniot.IStartCycle=} [properties] Properties to set
         */
        function StartCycle(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StartCycle at.
         * @member {number} at
         * @memberof commoniot.StartCycle
         * @instance
         */
        StartCycle.prototype.at = 0;

        /**
         * Creates a new StartCycle instance using the specified properties.
         * @function create
         * @memberof commoniot.StartCycle
         * @static
         * @param {commoniot.IStartCycle=} [properties] Properties to set
         * @returns {commoniot.StartCycle} StartCycle instance
         */
        StartCycle.create = function create(properties) {
            return new StartCycle(properties);
        };

        /**
         * Encodes the specified StartCycle message. Does not implicitly {@link commoniot.StartCycle.verify|verify} messages.
         * @function encode
         * @memberof commoniot.StartCycle
         * @static
         * @param {commoniot.IStartCycle} message StartCycle message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StartCycle.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.at != null && Object.hasOwnProperty.call(message, "at"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.at);
            return writer;
        };

        /**
         * Encodes the specified StartCycle message, length delimited. Does not implicitly {@link commoniot.StartCycle.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.StartCycle
         * @static
         * @param {commoniot.IStartCycle} message StartCycle message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StartCycle.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StartCycle message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.StartCycle
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.StartCycle} StartCycle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StartCycle.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.StartCycle();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.at = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StartCycle message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.StartCycle
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.StartCycle} StartCycle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StartCycle.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StartCycle message.
         * @function verify
         * @memberof commoniot.StartCycle
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StartCycle.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.at != null && message.hasOwnProperty("at"))
                if (!$util.isInteger(message.at))
                    return "at: integer expected";
            return null;
        };

        /**
         * Creates a StartCycle message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.StartCycle
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.StartCycle} StartCycle
         */
        StartCycle.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.StartCycle)
                return object;
            var message = new $root.commoniot.StartCycle();
            if (object.at != null)
                message.at = object.at >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a StartCycle message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.StartCycle
         * @static
         * @param {commoniot.StartCycle} message StartCycle
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StartCycle.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.at = 0;
            if (message.at != null && message.hasOwnProperty("at"))
                object.at = message.at;
            return object;
        };

        /**
         * Converts this StartCycle to JSON.
         * @function toJSON
         * @memberof commoniot.StartCycle
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StartCycle.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for StartCycle
         * @function getTypeUrl
         * @memberof commoniot.StartCycle
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StartCycle.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.StartCycle";
        };

        return StartCycle;
    })();

    commoniot.StopCycle = (function() {

        /**
         * Properties of a StopCycle.
         * @memberof commoniot
         * @interface IStopCycle
         */

        /**
         * Constructs a new StopCycle.
         * @memberof commoniot
         * @classdesc Represents a StopCycle.
         * @implements IStopCycle
         * @constructor
         * @param {commoniot.IStopCycle=} [properties] Properties to set
         */
        function StopCycle(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new StopCycle instance using the specified properties.
         * @function create
         * @memberof commoniot.StopCycle
         * @static
         * @param {commoniot.IStopCycle=} [properties] Properties to set
         * @returns {commoniot.StopCycle} StopCycle instance
         */
        StopCycle.create = function create(properties) {
            return new StopCycle(properties);
        };

        /**
         * Encodes the specified StopCycle message. Does not implicitly {@link commoniot.StopCycle.verify|verify} messages.
         * @function encode
         * @memberof commoniot.StopCycle
         * @static
         * @param {commoniot.IStopCycle} message StopCycle message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StopCycle.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified StopCycle message, length delimited. Does not implicitly {@link commoniot.StopCycle.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.StopCycle
         * @static
         * @param {commoniot.IStopCycle} message StopCycle message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StopCycle.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StopCycle message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.StopCycle
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.StopCycle} StopCycle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StopCycle.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.StopCycle();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StopCycle message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.StopCycle
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.StopCycle} StopCycle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StopCycle.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StopCycle message.
         * @function verify
         * @memberof commoniot.StopCycle
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StopCycle.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a StopCycle message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.StopCycle
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.StopCycle} StopCycle
         */
        StopCycle.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.StopCycle)
                return object;
            return new $root.commoniot.StopCycle();
        };

        /**
         * Creates a plain object from a StopCycle message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.StopCycle
         * @static
         * @param {commoniot.StopCycle} message StopCycle
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StopCycle.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this StopCycle to JSON.
         * @function toJSON
         * @memberof commoniot.StopCycle
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StopCycle.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for StopCycle
         * @function getTypeUrl
         * @memberof commoniot.StopCycle
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StopCycle.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.StopCycle";
        };

        return StopCycle;
    })();

    commoniot.Reset = (function() {

        /**
         * Properties of a Reset.
         * @memberof commoniot
         * @interface IReset
         */

        /**
         * Constructs a new Reset.
         * @memberof commoniot
         * @classdesc Represents a Reset.
         * @implements IReset
         * @constructor
         * @param {commoniot.IReset=} [properties] Properties to set
         */
        function Reset(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new Reset instance using the specified properties.
         * @function create
         * @memberof commoniot.Reset
         * @static
         * @param {commoniot.IReset=} [properties] Properties to set
         * @returns {commoniot.Reset} Reset instance
         */
        Reset.create = function create(properties) {
            return new Reset(properties);
        };

        /**
         * Encodes the specified Reset message. Does not implicitly {@link commoniot.Reset.verify|verify} messages.
         * @function encode
         * @memberof commoniot.Reset
         * @static
         * @param {commoniot.IReset} message Reset message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Reset.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Reset message, length delimited. Does not implicitly {@link commoniot.Reset.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.Reset
         * @static
         * @param {commoniot.IReset} message Reset message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Reset.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Reset message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.Reset
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.Reset} Reset
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Reset.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.Reset();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Reset message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.Reset
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.Reset} Reset
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Reset.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Reset message.
         * @function verify
         * @memberof commoniot.Reset
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Reset.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a Reset message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.Reset
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.Reset} Reset
         */
        Reset.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.Reset)
                return object;
            return new $root.commoniot.Reset();
        };

        /**
         * Creates a plain object from a Reset message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.Reset
         * @static
         * @param {commoniot.Reset} message Reset
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Reset.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Reset to JSON.
         * @function toJSON
         * @memberof commoniot.Reset
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Reset.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Reset
         * @function getTypeUrl
         * @memberof commoniot.Reset
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Reset.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.Reset";
        };

        return Reset;
    })();

    commoniot.Ping = (function() {

        /**
         * Properties of a Ping.
         * @memberof commoniot
         * @interface IPing
         * @property {number|null} [tscmd] Ping tscmd
         * @property {number|null} [tsreply] Ping tsreply
         */

        /**
         * Constructs a new Ping.
         * @memberof commoniot
         * @classdesc Represents a Ping.
         * @implements IPing
         * @constructor
         * @param {commoniot.IPing=} [properties] Properties to set
         */
        function Ping(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Ping tscmd.
         * @member {number} tscmd
         * @memberof commoniot.Ping
         * @instance
         */
        Ping.prototype.tscmd = 0;

        /**
         * Ping tsreply.
         * @member {number} tsreply
         * @memberof commoniot.Ping
         * @instance
         */
        Ping.prototype.tsreply = 0;

        /**
         * Creates a new Ping instance using the specified properties.
         * @function create
         * @memberof commoniot.Ping
         * @static
         * @param {commoniot.IPing=} [properties] Properties to set
         * @returns {commoniot.Ping} Ping instance
         */
        Ping.create = function create(properties) {
            return new Ping(properties);
        };

        /**
         * Encodes the specified Ping message. Does not implicitly {@link commoniot.Ping.verify|verify} messages.
         * @function encode
         * @memberof commoniot.Ping
         * @static
         * @param {commoniot.IPing} message Ping message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ping.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tscmd != null && Object.hasOwnProperty.call(message, "tscmd"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.tscmd);
            if (message.tsreply != null && Object.hasOwnProperty.call(message, "tsreply"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.tsreply);
            return writer;
        };

        /**
         * Encodes the specified Ping message, length delimited. Does not implicitly {@link commoniot.Ping.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.Ping
         * @static
         * @param {commoniot.IPing} message Ping message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ping.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Ping message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.Ping
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.Ping} Ping
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ping.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.Ping();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.tscmd = reader.uint32();
                        break;
                    }
                case 2: {
                        message.tsreply = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Ping message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.Ping
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.Ping} Ping
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ping.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Ping message.
         * @function verify
         * @memberof commoniot.Ping
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Ping.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tscmd != null && message.hasOwnProperty("tscmd"))
                if (!$util.isInteger(message.tscmd))
                    return "tscmd: integer expected";
            if (message.tsreply != null && message.hasOwnProperty("tsreply"))
                if (!$util.isInteger(message.tsreply))
                    return "tsreply: integer expected";
            return null;
        };

        /**
         * Creates a Ping message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.Ping
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.Ping} Ping
         */
        Ping.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.Ping)
                return object;
            var message = new $root.commoniot.Ping();
            if (object.tscmd != null)
                message.tscmd = object.tscmd >>> 0;
            if (object.tsreply != null)
                message.tsreply = object.tsreply >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Ping message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.Ping
         * @static
         * @param {commoniot.Ping} message Ping
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Ping.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.tscmd = 0;
                object.tsreply = 0;
            }
            if (message.tscmd != null && message.hasOwnProperty("tscmd"))
                object.tscmd = message.tscmd;
            if (message.tsreply != null && message.hasOwnProperty("tsreply"))
                object.tsreply = message.tsreply;
            return object;
        };

        /**
         * Converts this Ping to JSON.
         * @function toJSON
         * @memberof commoniot.Ping
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Ping.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Ping
         * @function getTypeUrl
         * @memberof commoniot.Ping
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Ping.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.Ping";
        };

        return Ping;
    })();

    commoniot.Ota = (function() {

        /**
         * Properties of an Ota.
         * @memberof commoniot
         * @interface IOta
         * @property {number|null} [version] Ota version
         * @property {number|null} [filesize] Ota filesize
         * @property {number|null} [devtype] Ota devtype
         * @property {number|null} [status] Ota status
         * @property {Array.<number>|null} [users] Ota users
         */

        /**
         * Constructs a new Ota.
         * @memberof commoniot
         * @classdesc Represents an Ota.
         * @implements IOta
         * @constructor
         * @param {commoniot.IOta=} [properties] Properties to set
         */
        function Ota(properties) {
            this.users = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Ota version.
         * @member {number} version
         * @memberof commoniot.Ota
         * @instance
         */
        Ota.prototype.version = 0;

        /**
         * Ota filesize.
         * @member {number} filesize
         * @memberof commoniot.Ota
         * @instance
         */
        Ota.prototype.filesize = 0;

        /**
         * Ota devtype.
         * @member {number} devtype
         * @memberof commoniot.Ota
         * @instance
         */
        Ota.prototype.devtype = 0;

        /**
         * Ota status.
         * @member {number} status
         * @memberof commoniot.Ota
         * @instance
         */
        Ota.prototype.status = 0;

        /**
         * Ota users.
         * @member {Array.<number>} users
         * @memberof commoniot.Ota
         * @instance
         */
        Ota.prototype.users = $util.emptyArray;

        /**
         * Creates a new Ota instance using the specified properties.
         * @function create
         * @memberof commoniot.Ota
         * @static
         * @param {commoniot.IOta=} [properties] Properties to set
         * @returns {commoniot.Ota} Ota instance
         */
        Ota.create = function create(properties) {
            return new Ota(properties);
        };

        /**
         * Encodes the specified Ota message. Does not implicitly {@link commoniot.Ota.verify|verify} messages.
         * @function encode
         * @memberof commoniot.Ota
         * @static
         * @param {commoniot.IOta} message Ota message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ota.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.version);
            if (message.filesize != null && Object.hasOwnProperty.call(message, "filesize"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.filesize);
            if (message.devtype != null && Object.hasOwnProperty.call(message, "devtype"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.devtype);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.status);
            if (message.users != null && message.users.length) {
                writer.uint32(/* id 5, wireType 2 =*/42).fork();
                for (var i = 0; i < message.users.length; ++i)
                    writer.uint32(message.users[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified Ota message, length delimited. Does not implicitly {@link commoniot.Ota.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.Ota
         * @static
         * @param {commoniot.IOta} message Ota message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ota.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Ota message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.Ota
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.Ota} Ota
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ota.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.Ota();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.version = reader.uint32();
                        break;
                    }
                case 2: {
                        message.filesize = reader.uint32();
                        break;
                    }
                case 3: {
                        message.devtype = reader.uint32();
                        break;
                    }
                case 4: {
                        message.status = reader.uint32();
                        break;
                    }
                case 5: {
                        if (!(message.users && message.users.length))
                            message.users = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.users.push(reader.uint32());
                        } else
                            message.users.push(reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Ota message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.Ota
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.Ota} Ota
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ota.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Ota message.
         * @function verify
         * @memberof commoniot.Ota
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Ota.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.filesize != null && message.hasOwnProperty("filesize"))
                if (!$util.isInteger(message.filesize))
                    return "filesize: integer expected";
            if (message.devtype != null && message.hasOwnProperty("devtype"))
                if (!$util.isInteger(message.devtype))
                    return "devtype: integer expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            if (message.users != null && message.hasOwnProperty("users")) {
                if (!Array.isArray(message.users))
                    return "users: array expected";
                for (var i = 0; i < message.users.length; ++i)
                    if (!$util.isInteger(message.users[i]))
                        return "users: integer[] expected";
            }
            return null;
        };

        /**
         * Creates an Ota message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.Ota
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.Ota} Ota
         */
        Ota.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.Ota)
                return object;
            var message = new $root.commoniot.Ota();
            if (object.version != null)
                message.version = object.version >>> 0;
            if (object.filesize != null)
                message.filesize = object.filesize >>> 0;
            if (object.devtype != null)
                message.devtype = object.devtype >>> 0;
            if (object.status != null)
                message.status = object.status >>> 0;
            if (object.users) {
                if (!Array.isArray(object.users))
                    throw TypeError(".commoniot.Ota.users: array expected");
                message.users = [];
                for (var i = 0; i < object.users.length; ++i)
                    message.users[i] = object.users[i] >>> 0;
            }
            return message;
        };

        /**
         * Creates a plain object from an Ota message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.Ota
         * @static
         * @param {commoniot.Ota} message Ota
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Ota.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.users = [];
            if (options.defaults) {
                object.version = 0;
                object.filesize = 0;
                object.devtype = 0;
                object.status = 0;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.filesize != null && message.hasOwnProperty("filesize"))
                object.filesize = message.filesize;
            if (message.devtype != null && message.hasOwnProperty("devtype"))
                object.devtype = message.devtype;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.users && message.users.length) {
                object.users = [];
                for (var j = 0; j < message.users.length; ++j)
                    object.users[j] = message.users[j];
            }
            return object;
        };

        /**
         * Converts this Ota to JSON.
         * @function toJSON
         * @memberof commoniot.Ota
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Ota.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Ota
         * @function getTypeUrl
         * @memberof commoniot.Ota
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Ota.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.Ota";
        };

        return Ota;
    })();

    commoniot.MapDevice = (function() {

        /**
         * Properties of a MapDevice.
         * @memberof commoniot
         * @interface IMapDevice
         * @property {number|null} [room] MapDevice room
         * @property {number|null} [command] MapDevice command
         */

        /**
         * Constructs a new MapDevice.
         * @memberof commoniot
         * @classdesc Represents a MapDevice.
         * @implements IMapDevice
         * @constructor
         * @param {commoniot.IMapDevice=} [properties] Properties to set
         */
        function MapDevice(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MapDevice room.
         * @member {number} room
         * @memberof commoniot.MapDevice
         * @instance
         */
        MapDevice.prototype.room = 0;

        /**
         * MapDevice command.
         * @member {number} command
         * @memberof commoniot.MapDevice
         * @instance
         */
        MapDevice.prototype.command = 0;

        /**
         * Creates a new MapDevice instance using the specified properties.
         * @function create
         * @memberof commoniot.MapDevice
         * @static
         * @param {commoniot.IMapDevice=} [properties] Properties to set
         * @returns {commoniot.MapDevice} MapDevice instance
         */
        MapDevice.create = function create(properties) {
            return new MapDevice(properties);
        };

        /**
         * Encodes the specified MapDevice message. Does not implicitly {@link commoniot.MapDevice.verify|verify} messages.
         * @function encode
         * @memberof commoniot.MapDevice
         * @static
         * @param {commoniot.IMapDevice} message MapDevice message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapDevice.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.room != null && Object.hasOwnProperty.call(message, "room"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.room);
            if (message.command != null && Object.hasOwnProperty.call(message, "command"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.command);
            return writer;
        };

        /**
         * Encodes the specified MapDevice message, length delimited. Does not implicitly {@link commoniot.MapDevice.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.MapDevice
         * @static
         * @param {commoniot.IMapDevice} message MapDevice message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapDevice.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MapDevice message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.MapDevice
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.MapDevice} MapDevice
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapDevice.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.MapDevice();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.room = reader.uint32();
                        break;
                    }
                case 2: {
                        message.command = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MapDevice message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.MapDevice
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.MapDevice} MapDevice
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapDevice.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MapDevice message.
         * @function verify
         * @memberof commoniot.MapDevice
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MapDevice.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.room != null && message.hasOwnProperty("room"))
                if (!$util.isInteger(message.room))
                    return "room: integer expected";
            if (message.command != null && message.hasOwnProperty("command"))
                if (!$util.isInteger(message.command))
                    return "command: integer expected";
            return null;
        };

        /**
         * Creates a MapDevice message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.MapDevice
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.MapDevice} MapDevice
         */
        MapDevice.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.MapDevice)
                return object;
            var message = new $root.commoniot.MapDevice();
            if (object.room != null)
                message.room = object.room >>> 0;
            if (object.command != null)
                message.command = object.command >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a MapDevice message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.MapDevice
         * @static
         * @param {commoniot.MapDevice} message MapDevice
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MapDevice.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.room = 0;
                object.command = 0;
            }
            if (message.room != null && message.hasOwnProperty("room"))
                object.room = message.room;
            if (message.command != null && message.hasOwnProperty("command"))
                object.command = message.command;
            return object;
        };

        /**
         * Converts this MapDevice to JSON.
         * @function toJSON
         * @memberof commoniot.MapDevice
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MapDevice.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MapDevice
         * @function getTypeUrl
         * @memberof commoniot.MapDevice
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MapDevice.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.MapDevice";
        };

        return MapDevice;
    })();

    commoniot.ReportSetting = (function() {

        /**
         * Properties of a ReportSetting.
         * @memberof commoniot
         * @interface IReportSetting
         * @property {number|null} [at] ReportSetting at
         * @property {number|null} [period] ReportSetting period
         */

        /**
         * Constructs a new ReportSetting.
         * @memberof commoniot
         * @classdesc Represents a ReportSetting.
         * @implements IReportSetting
         * @constructor
         * @param {commoniot.IReportSetting=} [properties] Properties to set
         */
        function ReportSetting(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ReportSetting at.
         * @member {number} at
         * @memberof commoniot.ReportSetting
         * @instance
         */
        ReportSetting.prototype.at = 0;

        /**
         * ReportSetting period.
         * @member {number} period
         * @memberof commoniot.ReportSetting
         * @instance
         */
        ReportSetting.prototype.period = 0;

        /**
         * Creates a new ReportSetting instance using the specified properties.
         * @function create
         * @memberof commoniot.ReportSetting
         * @static
         * @param {commoniot.IReportSetting=} [properties] Properties to set
         * @returns {commoniot.ReportSetting} ReportSetting instance
         */
        ReportSetting.create = function create(properties) {
            return new ReportSetting(properties);
        };

        /**
         * Encodes the specified ReportSetting message. Does not implicitly {@link commoniot.ReportSetting.verify|verify} messages.
         * @function encode
         * @memberof commoniot.ReportSetting
         * @static
         * @param {commoniot.IReportSetting} message ReportSetting message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReportSetting.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.at != null && Object.hasOwnProperty.call(message, "at"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.at);
            if (message.period != null && Object.hasOwnProperty.call(message, "period"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.period);
            return writer;
        };

        /**
         * Encodes the specified ReportSetting message, length delimited. Does not implicitly {@link commoniot.ReportSetting.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.ReportSetting
         * @static
         * @param {commoniot.IReportSetting} message ReportSetting message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReportSetting.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReportSetting message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.ReportSetting
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.ReportSetting} ReportSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReportSetting.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.ReportSetting();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.at = reader.uint32();
                        break;
                    }
                case 2: {
                        message.period = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ReportSetting message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.ReportSetting
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.ReportSetting} ReportSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReportSetting.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ReportSetting message.
         * @function verify
         * @memberof commoniot.ReportSetting
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ReportSetting.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.at != null && message.hasOwnProperty("at"))
                if (!$util.isInteger(message.at))
                    return "at: integer expected";
            if (message.period != null && message.hasOwnProperty("period"))
                if (!$util.isInteger(message.period))
                    return "period: integer expected";
            return null;
        };

        /**
         * Creates a ReportSetting message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.ReportSetting
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.ReportSetting} ReportSetting
         */
        ReportSetting.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.ReportSetting)
                return object;
            var message = new $root.commoniot.ReportSetting();
            if (object.at != null)
                message.at = object.at >>> 0;
            if (object.period != null)
                message.period = object.period >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a ReportSetting message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.ReportSetting
         * @static
         * @param {commoniot.ReportSetting} message ReportSetting
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ReportSetting.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.at = 0;
                object.period = 0;
            }
            if (message.at != null && message.hasOwnProperty("at"))
                object.at = message.at;
            if (message.period != null && message.hasOwnProperty("period"))
                object.period = message.period;
            return object;
        };

        /**
         * Converts this ReportSetting to JSON.
         * @function toJSON
         * @memberof commoniot.ReportSetting
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ReportSetting.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ReportSetting
         * @function getTypeUrl
         * @memberof commoniot.ReportSetting
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ReportSetting.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.ReportSetting";
        };

        return ReportSetting;
    })();

    commoniot.Signal = (function() {

        /**
         * Properties of a Signal.
         * @memberof commoniot
         * @interface ISignal
         * @property {Array.<Uint8Array>|null} [leveltime] Signal leveltime
         */

        /**
         * Constructs a new Signal.
         * @memberof commoniot
         * @classdesc Represents a Signal.
         * @implements ISignal
         * @constructor
         * @param {commoniot.ISignal=} [properties] Properties to set
         */
        function Signal(properties) {
            this.leveltime = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Signal leveltime.
         * @member {Array.<Uint8Array>} leveltime
         * @memberof commoniot.Signal
         * @instance
         */
        Signal.prototype.leveltime = $util.emptyArray;

        /**
         * Creates a new Signal instance using the specified properties.
         * @function create
         * @memberof commoniot.Signal
         * @static
         * @param {commoniot.ISignal=} [properties] Properties to set
         * @returns {commoniot.Signal} Signal instance
         */
        Signal.create = function create(properties) {
            return new Signal(properties);
        };

        /**
         * Encodes the specified Signal message. Does not implicitly {@link commoniot.Signal.verify|verify} messages.
         * @function encode
         * @memberof commoniot.Signal
         * @static
         * @param {commoniot.ISignal} message Signal message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Signal.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.leveltime != null && message.leveltime.length)
                for (var i = 0; i < message.leveltime.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.leveltime[i]);
            return writer;
        };

        /**
         * Encodes the specified Signal message, length delimited. Does not implicitly {@link commoniot.Signal.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.Signal
         * @static
         * @param {commoniot.ISignal} message Signal message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Signal.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Signal message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.Signal
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.Signal} Signal
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Signal.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.Signal();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.leveltime && message.leveltime.length))
                            message.leveltime = [];
                        message.leveltime.push(reader.bytes());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Signal message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.Signal
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.Signal} Signal
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Signal.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Signal message.
         * @function verify
         * @memberof commoniot.Signal
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Signal.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.leveltime != null && message.hasOwnProperty("leveltime")) {
                if (!Array.isArray(message.leveltime))
                    return "leveltime: array expected";
                for (var i = 0; i < message.leveltime.length; ++i)
                    if (!(message.leveltime[i] && typeof message.leveltime[i].length === "number" || $util.isString(message.leveltime[i])))
                        return "leveltime: buffer[] expected";
            }
            return null;
        };

        /**
         * Creates a Signal message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.Signal
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.Signal} Signal
         */
        Signal.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.Signal)
                return object;
            var message = new $root.commoniot.Signal();
            if (object.leveltime) {
                if (!Array.isArray(object.leveltime))
                    throw TypeError(".commoniot.Signal.leveltime: array expected");
                message.leveltime = [];
                for (var i = 0; i < object.leveltime.length; ++i)
                    if (typeof object.leveltime[i] === "string")
                        $util.base64.decode(object.leveltime[i], message.leveltime[i] = $util.newBuffer($util.base64.length(object.leveltime[i])), 0);
                    else if (object.leveltime[i].length >= 0)
                        message.leveltime[i] = object.leveltime[i];
            }
            return message;
        };

        /**
         * Creates a plain object from a Signal message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.Signal
         * @static
         * @param {commoniot.Signal} message Signal
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Signal.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.leveltime = [];
            if (message.leveltime && message.leveltime.length) {
                object.leveltime = [];
                for (var j = 0; j < message.leveltime.length; ++j)
                    object.leveltime[j] = options.bytes === String ? $util.base64.encode(message.leveltime[j], 0, message.leveltime[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.leveltime[j]) : message.leveltime[j];
            }
            return object;
        };

        /**
         * Converts this Signal to JSON.
         * @function toJSON
         * @memberof commoniot.Signal
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Signal.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Signal
         * @function getTypeUrl
         * @memberof commoniot.Signal
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Signal.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.Signal";
        };

        return Signal;
    })();

    commoniot.Error = (function() {

        /**
         * Properties of an Error.
         * @memberof commoniot
         * @interface IError
         * @property {number|null} [num] Error num
         * @property {string|null} [msg] Error msg
         */

        /**
         * Constructs a new Error.
         * @memberof commoniot
         * @classdesc Represents an Error.
         * @implements IError
         * @constructor
         * @param {commoniot.IError=} [properties] Properties to set
         */
        function Error(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Error num.
         * @member {number} num
         * @memberof commoniot.Error
         * @instance
         */
        Error.prototype.num = 0;

        /**
         * Error msg.
         * @member {string} msg
         * @memberof commoniot.Error
         * @instance
         */
        Error.prototype.msg = "";

        /**
         * Creates a new Error instance using the specified properties.
         * @function create
         * @memberof commoniot.Error
         * @static
         * @param {commoniot.IError=} [properties] Properties to set
         * @returns {commoniot.Error} Error instance
         */
        Error.create = function create(properties) {
            return new Error(properties);
        };

        /**
         * Encodes the specified Error message. Does not implicitly {@link commoniot.Error.verify|verify} messages.
         * @function encode
         * @memberof commoniot.Error
         * @static
         * @param {commoniot.IError} message Error message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.num != null && Object.hasOwnProperty.call(message, "num"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.num);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            return writer;
        };

        /**
         * Encodes the specified Error message, length delimited. Does not implicitly {@link commoniot.Error.verify|verify} messages.
         * @function encodeDelimited
         * @memberof commoniot.Error
         * @static
         * @param {commoniot.IError} message Error message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Error message from the specified reader or buffer.
         * @function decode
         * @memberof commoniot.Error
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {commoniot.Error} Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.commoniot.Error();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.num = reader.uint32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Error message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof commoniot.Error
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {commoniot.Error} Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Error message.
         * @function verify
         * @memberof commoniot.Error
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Error.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.num != null && message.hasOwnProperty("num"))
                if (!$util.isInteger(message.num))
                    return "num: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            return null;
        };

        /**
         * Creates an Error message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof commoniot.Error
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {commoniot.Error} Error
         */
        Error.fromObject = function fromObject(object) {
            if (object instanceof $root.commoniot.Error)
                return object;
            var message = new $root.commoniot.Error();
            if (object.num != null)
                message.num = object.num >>> 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            return message;
        };

        /**
         * Creates a plain object from an Error message. Also converts values to other types if specified.
         * @function toObject
         * @memberof commoniot.Error
         * @static
         * @param {commoniot.Error} message Error
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Error.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.num = 0;
                object.msg = "";
            }
            if (message.num != null && message.hasOwnProperty("num"))
                object.num = message.num;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            return object;
        };

        /**
         * Converts this Error to JSON.
         * @function toJSON
         * @memberof commoniot.Error
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Error.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Error
         * @function getTypeUrl
         * @memberof commoniot.Error
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Error.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/commoniot.Error";
        };

        return Error;
    })();

    return commoniot;
})();

$root.sensor = (function() {

    /**
     * Namespace sensor.
     * @exports sensor
     * @namespace
     */
    var sensor = {};

    sensor.MapSensor = (function() {

        /**
         * Properties of a MapSensor.
         * @memberof sensor
         * @interface IMapSensor
         * @property {number|null} [room] MapSensor room
         * @property {Array.<sensor.IXiaomi>|null} [xiaomis] MapSensor xiaomis
         * @property {Array.<sensor.IHoney>|null} [honeys] MapSensor honeys
         * @property {Array.<sensor.IWind>|null} [wind] MapSensor wind
         * @property {number|null} [command] MapSensor command
         */

        /**
         * Constructs a new MapSensor.
         * @memberof sensor
         * @classdesc Represents a MapSensor.
         * @implements IMapSensor
         * @constructor
         * @param {sensor.IMapSensor=} [properties] Properties to set
         */
        function MapSensor(properties) {
            this.xiaomis = [];
            this.honeys = [];
            this.wind = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MapSensor room.
         * @member {number} room
         * @memberof sensor.MapSensor
         * @instance
         */
        MapSensor.prototype.room = 0;

        /**
         * MapSensor xiaomis.
         * @member {Array.<sensor.IXiaomi>} xiaomis
         * @memberof sensor.MapSensor
         * @instance
         */
        MapSensor.prototype.xiaomis = $util.emptyArray;

        /**
         * MapSensor honeys.
         * @member {Array.<sensor.IHoney>} honeys
         * @memberof sensor.MapSensor
         * @instance
         */
        MapSensor.prototype.honeys = $util.emptyArray;

        /**
         * MapSensor wind.
         * @member {Array.<sensor.IWind>} wind
         * @memberof sensor.MapSensor
         * @instance
         */
        MapSensor.prototype.wind = $util.emptyArray;

        /**
         * MapSensor command.
         * @member {number} command
         * @memberof sensor.MapSensor
         * @instance
         */
        MapSensor.prototype.command = 0;

        /**
         * Creates a new MapSensor instance using the specified properties.
         * @function create
         * @memberof sensor.MapSensor
         * @static
         * @param {sensor.IMapSensor=} [properties] Properties to set
         * @returns {sensor.MapSensor} MapSensor instance
         */
        MapSensor.create = function create(properties) {
            return new MapSensor(properties);
        };

        /**
         * Encodes the specified MapSensor message. Does not implicitly {@link sensor.MapSensor.verify|verify} messages.
         * @function encode
         * @memberof sensor.MapSensor
         * @static
         * @param {sensor.IMapSensor} message MapSensor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapSensor.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.room != null && Object.hasOwnProperty.call(message, "room"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.room);
            if (message.xiaomis != null && message.xiaomis.length)
                for (var i = 0; i < message.xiaomis.length; ++i)
                    $root.sensor.Xiaomi.encode(message.xiaomis[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.honeys != null && message.honeys.length)
                for (var i = 0; i < message.honeys.length; ++i)
                    $root.sensor.Honey.encode(message.honeys[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.wind != null && message.wind.length)
                for (var i = 0; i < message.wind.length; ++i)
                    $root.sensor.Wind.encode(message.wind[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.command != null && Object.hasOwnProperty.call(message, "command"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.command);
            return writer;
        };

        /**
         * Encodes the specified MapSensor message, length delimited. Does not implicitly {@link sensor.MapSensor.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sensor.MapSensor
         * @static
         * @param {sensor.IMapSensor} message MapSensor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapSensor.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MapSensor message from the specified reader or buffer.
         * @function decode
         * @memberof sensor.MapSensor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sensor.MapSensor} MapSensor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapSensor.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensor.MapSensor();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.room = reader.uint32();
                        break;
                    }
                case 2: {
                        if (!(message.xiaomis && message.xiaomis.length))
                            message.xiaomis = [];
                        message.xiaomis.push($root.sensor.Xiaomi.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        if (!(message.honeys && message.honeys.length))
                            message.honeys = [];
                        message.honeys.push($root.sensor.Honey.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        if (!(message.wind && message.wind.length))
                            message.wind = [];
                        message.wind.push($root.sensor.Wind.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        message.command = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MapSensor message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sensor.MapSensor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sensor.MapSensor} MapSensor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapSensor.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MapSensor message.
         * @function verify
         * @memberof sensor.MapSensor
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MapSensor.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.room != null && message.hasOwnProperty("room"))
                if (!$util.isInteger(message.room))
                    return "room: integer expected";
            if (message.xiaomis != null && message.hasOwnProperty("xiaomis")) {
                if (!Array.isArray(message.xiaomis))
                    return "xiaomis: array expected";
                for (var i = 0; i < message.xiaomis.length; ++i) {
                    var error = $root.sensor.Xiaomi.verify(message.xiaomis[i]);
                    if (error)
                        return "xiaomis." + error;
                }
            }
            if (message.honeys != null && message.hasOwnProperty("honeys")) {
                if (!Array.isArray(message.honeys))
                    return "honeys: array expected";
                for (var i = 0; i < message.honeys.length; ++i) {
                    var error = $root.sensor.Honey.verify(message.honeys[i]);
                    if (error)
                        return "honeys." + error;
                }
            }
            if (message.wind != null && message.hasOwnProperty("wind")) {
                if (!Array.isArray(message.wind))
                    return "wind: array expected";
                for (var i = 0; i < message.wind.length; ++i) {
                    var error = $root.sensor.Wind.verify(message.wind[i]);
                    if (error)
                        return "wind." + error;
                }
            }
            if (message.command != null && message.hasOwnProperty("command"))
                if (!$util.isInteger(message.command))
                    return "command: integer expected";
            return null;
        };

        /**
         * Creates a MapSensor message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sensor.MapSensor
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sensor.MapSensor} MapSensor
         */
        MapSensor.fromObject = function fromObject(object) {
            if (object instanceof $root.sensor.MapSensor)
                return object;
            var message = new $root.sensor.MapSensor();
            if (object.room != null)
                message.room = object.room >>> 0;
            if (object.xiaomis) {
                if (!Array.isArray(object.xiaomis))
                    throw TypeError(".sensor.MapSensor.xiaomis: array expected");
                message.xiaomis = [];
                for (var i = 0; i < object.xiaomis.length; ++i) {
                    if (typeof object.xiaomis[i] !== "object")
                        throw TypeError(".sensor.MapSensor.xiaomis: object expected");
                    message.xiaomis[i] = $root.sensor.Xiaomi.fromObject(object.xiaomis[i]);
                }
            }
            if (object.honeys) {
                if (!Array.isArray(object.honeys))
                    throw TypeError(".sensor.MapSensor.honeys: array expected");
                message.honeys = [];
                for (var i = 0; i < object.honeys.length; ++i) {
                    if (typeof object.honeys[i] !== "object")
                        throw TypeError(".sensor.MapSensor.honeys: object expected");
                    message.honeys[i] = $root.sensor.Honey.fromObject(object.honeys[i]);
                }
            }
            if (object.wind) {
                if (!Array.isArray(object.wind))
                    throw TypeError(".sensor.MapSensor.wind: array expected");
                message.wind = [];
                for (var i = 0; i < object.wind.length; ++i) {
                    if (typeof object.wind[i] !== "object")
                        throw TypeError(".sensor.MapSensor.wind: object expected");
                    message.wind[i] = $root.sensor.Wind.fromObject(object.wind[i]);
                }
            }
            if (object.command != null)
                message.command = object.command >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a MapSensor message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sensor.MapSensor
         * @static
         * @param {sensor.MapSensor} message MapSensor
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MapSensor.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.xiaomis = [];
                object.honeys = [];
                object.wind = [];
            }
            if (options.defaults) {
                object.room = 0;
                object.command = 0;
            }
            if (message.room != null && message.hasOwnProperty("room"))
                object.room = message.room;
            if (message.xiaomis && message.xiaomis.length) {
                object.xiaomis = [];
                for (var j = 0; j < message.xiaomis.length; ++j)
                    object.xiaomis[j] = $root.sensor.Xiaomi.toObject(message.xiaomis[j], options);
            }
            if (message.honeys && message.honeys.length) {
                object.honeys = [];
                for (var j = 0; j < message.honeys.length; ++j)
                    object.honeys[j] = $root.sensor.Honey.toObject(message.honeys[j], options);
            }
            if (message.wind && message.wind.length) {
                object.wind = [];
                for (var j = 0; j < message.wind.length; ++j)
                    object.wind[j] = $root.sensor.Wind.toObject(message.wind[j], options);
            }
            if (message.command != null && message.hasOwnProperty("command"))
                object.command = message.command;
            return object;
        };

        /**
         * Converts this MapSensor to JSON.
         * @function toJSON
         * @memberof sensor.MapSensor
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MapSensor.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MapSensor
         * @function getTypeUrl
         * @memberof sensor.MapSensor
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MapSensor.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/sensor.MapSensor";
        };

        return MapSensor;
    })();

    sensor.Sensor = (function() {

        /**
         * Properties of a Sensor.
         * @memberof sensor
         * @interface ISensor
         * @property {number|null} [room] Sensor room
         * @property {Array.<sensor.IXiaomi>|null} [xiaomis] Sensor xiaomis
         * @property {sensor.IMics|null} [ammoniaMics] Sensor ammoniaMics
         * @property {sensor.IHoney|null} [nh3wsModbus] Sensor nh3wsModbus
         * @property {number|null} [light] Sensor light
         * @property {sensor.IWind|null} [wind] Sensor wind
         * @property {number|null} [oxygen] Sensor oxygen
         * @property {number|null} [errorCodeSensor] Sensor errorCodeSensor
         */

        /**
         * Constructs a new Sensor.
         * @memberof sensor
         * @classdesc Represents a Sensor.
         * @implements ISensor
         * @constructor
         * @param {sensor.ISensor=} [properties] Properties to set
         */
        function Sensor(properties) {
            this.xiaomis = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Sensor room.
         * @member {number} room
         * @memberof sensor.Sensor
         * @instance
         */
        Sensor.prototype.room = 0;

        /**
         * Sensor xiaomis.
         * @member {Array.<sensor.IXiaomi>} xiaomis
         * @memberof sensor.Sensor
         * @instance
         */
        Sensor.prototype.xiaomis = $util.emptyArray;

        /**
         * Sensor ammoniaMics.
         * @member {sensor.IMics|null|undefined} ammoniaMics
         * @memberof sensor.Sensor
         * @instance
         */
        Sensor.prototype.ammoniaMics = null;

        /**
         * Sensor nh3wsModbus.
         * @member {sensor.IHoney|null|undefined} nh3wsModbus
         * @memberof sensor.Sensor
         * @instance
         */
        Sensor.prototype.nh3wsModbus = null;

        /**
         * Sensor light.
         * @member {number} light
         * @memberof sensor.Sensor
         * @instance
         */
        Sensor.prototype.light = 0;

        /**
         * Sensor wind.
         * @member {sensor.IWind|null|undefined} wind
         * @memberof sensor.Sensor
         * @instance
         */
        Sensor.prototype.wind = null;

        /**
         * Sensor oxygen.
         * @member {number} oxygen
         * @memberof sensor.Sensor
         * @instance
         */
        Sensor.prototype.oxygen = 0;

        /**
         * Sensor errorCodeSensor.
         * @member {number} errorCodeSensor
         * @memberof sensor.Sensor
         * @instance
         */
        Sensor.prototype.errorCodeSensor = 0;

        /**
         * Creates a new Sensor instance using the specified properties.
         * @function create
         * @memberof sensor.Sensor
         * @static
         * @param {sensor.ISensor=} [properties] Properties to set
         * @returns {sensor.Sensor} Sensor instance
         */
        Sensor.create = function create(properties) {
            return new Sensor(properties);
        };

        /**
         * Encodes the specified Sensor message. Does not implicitly {@link sensor.Sensor.verify|verify} messages.
         * @function encode
         * @memberof sensor.Sensor
         * @static
         * @param {sensor.ISensor} message Sensor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Sensor.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.room != null && Object.hasOwnProperty.call(message, "room"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.room);
            if (message.xiaomis != null && message.xiaomis.length)
                for (var i = 0; i < message.xiaomis.length; ++i)
                    $root.sensor.Xiaomi.encode(message.xiaomis[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.ammoniaMics != null && Object.hasOwnProperty.call(message, "ammoniaMics"))
                $root.sensor.Mics.encode(message.ammoniaMics, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.nh3wsModbus != null && Object.hasOwnProperty.call(message, "nh3wsModbus"))
                $root.sensor.Honey.encode(message.nh3wsModbus, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.light != null && Object.hasOwnProperty.call(message, "light"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.light);
            if (message.wind != null && Object.hasOwnProperty.call(message, "wind"))
                $root.sensor.Wind.encode(message.wind, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.oxygen != null && Object.hasOwnProperty.call(message, "oxygen"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.oxygen);
            if (message.errorCodeSensor != null && Object.hasOwnProperty.call(message, "errorCodeSensor"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.errorCodeSensor);
            return writer;
        };

        /**
         * Encodes the specified Sensor message, length delimited. Does not implicitly {@link sensor.Sensor.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sensor.Sensor
         * @static
         * @param {sensor.ISensor} message Sensor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Sensor.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Sensor message from the specified reader or buffer.
         * @function decode
         * @memberof sensor.Sensor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sensor.Sensor} Sensor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Sensor.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensor.Sensor();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.room = reader.uint32();
                        break;
                    }
                case 2: {
                        if (!(message.xiaomis && message.xiaomis.length))
                            message.xiaomis = [];
                        message.xiaomis.push($root.sensor.Xiaomi.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.ammoniaMics = $root.sensor.Mics.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.nh3wsModbus = $root.sensor.Honey.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.light = reader.uint32();
                        break;
                    }
                case 6: {
                        message.wind = $root.sensor.Wind.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.oxygen = reader.uint32();
                        break;
                    }
                case 8: {
                        message.errorCodeSensor = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Sensor message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sensor.Sensor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sensor.Sensor} Sensor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Sensor.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Sensor message.
         * @function verify
         * @memberof sensor.Sensor
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Sensor.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.room != null && message.hasOwnProperty("room"))
                if (!$util.isInteger(message.room))
                    return "room: integer expected";
            if (message.xiaomis != null && message.hasOwnProperty("xiaomis")) {
                if (!Array.isArray(message.xiaomis))
                    return "xiaomis: array expected";
                for (var i = 0; i < message.xiaomis.length; ++i) {
                    var error = $root.sensor.Xiaomi.verify(message.xiaomis[i]);
                    if (error)
                        return "xiaomis." + error;
                }
            }
            if (message.ammoniaMics != null && message.hasOwnProperty("ammoniaMics")) {
                var error = $root.sensor.Mics.verify(message.ammoniaMics);
                if (error)
                    return "ammoniaMics." + error;
            }
            if (message.nh3wsModbus != null && message.hasOwnProperty("nh3wsModbus")) {
                var error = $root.sensor.Honey.verify(message.nh3wsModbus);
                if (error)
                    return "nh3wsModbus." + error;
            }
            if (message.light != null && message.hasOwnProperty("light"))
                if (!$util.isInteger(message.light))
                    return "light: integer expected";
            if (message.wind != null && message.hasOwnProperty("wind")) {
                var error = $root.sensor.Wind.verify(message.wind);
                if (error)
                    return "wind." + error;
            }
            if (message.oxygen != null && message.hasOwnProperty("oxygen"))
                if (!$util.isInteger(message.oxygen))
                    return "oxygen: integer expected";
            if (message.errorCodeSensor != null && message.hasOwnProperty("errorCodeSensor"))
                if (!$util.isInteger(message.errorCodeSensor))
                    return "errorCodeSensor: integer expected";
            return null;
        };

        /**
         * Creates a Sensor message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sensor.Sensor
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sensor.Sensor} Sensor
         */
        Sensor.fromObject = function fromObject(object) {
            if (object instanceof $root.sensor.Sensor)
                return object;
            var message = new $root.sensor.Sensor();
            if (object.room != null)
                message.room = object.room >>> 0;
            if (object.xiaomis) {
                if (!Array.isArray(object.xiaomis))
                    throw TypeError(".sensor.Sensor.xiaomis: array expected");
                message.xiaomis = [];
                for (var i = 0; i < object.xiaomis.length; ++i) {
                    if (typeof object.xiaomis[i] !== "object")
                        throw TypeError(".sensor.Sensor.xiaomis: object expected");
                    message.xiaomis[i] = $root.sensor.Xiaomi.fromObject(object.xiaomis[i]);
                }
            }
            if (object.ammoniaMics != null) {
                if (typeof object.ammoniaMics !== "object")
                    throw TypeError(".sensor.Sensor.ammoniaMics: object expected");
                message.ammoniaMics = $root.sensor.Mics.fromObject(object.ammoniaMics);
            }
            if (object.nh3wsModbus != null) {
                if (typeof object.nh3wsModbus !== "object")
                    throw TypeError(".sensor.Sensor.nh3wsModbus: object expected");
                message.nh3wsModbus = $root.sensor.Honey.fromObject(object.nh3wsModbus);
            }
            if (object.light != null)
                message.light = object.light >>> 0;
            if (object.wind != null) {
                if (typeof object.wind !== "object")
                    throw TypeError(".sensor.Sensor.wind: object expected");
                message.wind = $root.sensor.Wind.fromObject(object.wind);
            }
            if (object.oxygen != null)
                message.oxygen = object.oxygen >>> 0;
            if (object.errorCodeSensor != null)
                message.errorCodeSensor = object.errorCodeSensor >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Sensor message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sensor.Sensor
         * @static
         * @param {sensor.Sensor} message Sensor
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Sensor.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.xiaomis = [];
            if (options.defaults) {
                object.room = 0;
                object.ammoniaMics = null;
                object.nh3wsModbus = null;
                object.light = 0;
                object.wind = null;
                object.oxygen = 0;
                object.errorCodeSensor = 0;
            }
            if (message.room != null && message.hasOwnProperty("room"))
                object.room = message.room;
            if (message.xiaomis && message.xiaomis.length) {
                object.xiaomis = [];
                for (var j = 0; j < message.xiaomis.length; ++j)
                    object.xiaomis[j] = $root.sensor.Xiaomi.toObject(message.xiaomis[j], options);
            }
            if (message.ammoniaMics != null && message.hasOwnProperty("ammoniaMics"))
                object.ammoniaMics = $root.sensor.Mics.toObject(message.ammoniaMics, options);
            if (message.nh3wsModbus != null && message.hasOwnProperty("nh3wsModbus"))
                object.nh3wsModbus = $root.sensor.Honey.toObject(message.nh3wsModbus, options);
            if (message.light != null && message.hasOwnProperty("light"))
                object.light = message.light;
            if (message.wind != null && message.hasOwnProperty("wind"))
                object.wind = $root.sensor.Wind.toObject(message.wind, options);
            if (message.oxygen != null && message.hasOwnProperty("oxygen"))
                object.oxygen = message.oxygen;
            if (message.errorCodeSensor != null && message.hasOwnProperty("errorCodeSensor"))
                object.errorCodeSensor = message.errorCodeSensor;
            return object;
        };

        /**
         * Converts this Sensor to JSON.
         * @function toJSON
         * @memberof sensor.Sensor
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Sensor.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Sensor
         * @function getTypeUrl
         * @memberof sensor.Sensor
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Sensor.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/sensor.Sensor";
        };

        return Sensor;
    })();

    sensor.Xiaomi = (function() {

        /**
         * Properties of a Xiaomi.
         * @memberof sensor
         * @interface IXiaomi
         * @property {Uint8Array|null} [id] Xiaomi id
         * @property {number|null} [temp] Xiaomi temp
         * @property {number|null} [humi] Xiaomi humi
         * @property {number|null} [batt] Xiaomi batt
         * @property {number|null} [rssi] Xiaomi rssi
         * @property {string|null} [name] Xiaomi name
         * @property {Uint8Array|null} [pos] Xiaomi pos
         * @property {number|null} [dist] Xiaomi dist
         */

        /**
         * Constructs a new Xiaomi.
         * @memberof sensor
         * @classdesc Represents a Xiaomi.
         * @implements IXiaomi
         * @constructor
         * @param {sensor.IXiaomi=} [properties] Properties to set
         */
        function Xiaomi(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Xiaomi id.
         * @member {Uint8Array} id
         * @memberof sensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.id = $util.newBuffer([]);

        /**
         * Xiaomi temp.
         * @member {number} temp
         * @memberof sensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.temp = 0;

        /**
         * Xiaomi humi.
         * @member {number} humi
         * @memberof sensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.humi = 0;

        /**
         * Xiaomi batt.
         * @member {number} batt
         * @memberof sensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.batt = 0;

        /**
         * Xiaomi rssi.
         * @member {number} rssi
         * @memberof sensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.rssi = 0;

        /**
         * Xiaomi name.
         * @member {string} name
         * @memberof sensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.name = "";

        /**
         * Xiaomi pos.
         * @member {Uint8Array} pos
         * @memberof sensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.pos = $util.newBuffer([]);

        /**
         * Xiaomi dist.
         * @member {number} dist
         * @memberof sensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.dist = 0;

        /**
         * Creates a new Xiaomi instance using the specified properties.
         * @function create
         * @memberof sensor.Xiaomi
         * @static
         * @param {sensor.IXiaomi=} [properties] Properties to set
         * @returns {sensor.Xiaomi} Xiaomi instance
         */
        Xiaomi.create = function create(properties) {
            return new Xiaomi(properties);
        };

        /**
         * Encodes the specified Xiaomi message. Does not implicitly {@link sensor.Xiaomi.verify|verify} messages.
         * @function encode
         * @memberof sensor.Xiaomi
         * @static
         * @param {sensor.IXiaomi} message Xiaomi message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Xiaomi.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.id);
            if (message.temp != null && Object.hasOwnProperty.call(message, "temp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.temp);
            if (message.humi != null && Object.hasOwnProperty.call(message, "humi"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.humi);
            if (message.batt != null && Object.hasOwnProperty.call(message, "batt"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.batt);
            if (message.rssi != null && Object.hasOwnProperty.call(message, "rssi"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.rssi);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.name);
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.pos);
            if (message.dist != null && Object.hasOwnProperty.call(message, "dist"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.dist);
            return writer;
        };

        /**
         * Encodes the specified Xiaomi message, length delimited. Does not implicitly {@link sensor.Xiaomi.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sensor.Xiaomi
         * @static
         * @param {sensor.IXiaomi} message Xiaomi message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Xiaomi.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Xiaomi message from the specified reader or buffer.
         * @function decode
         * @memberof sensor.Xiaomi
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sensor.Xiaomi} Xiaomi
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Xiaomi.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensor.Xiaomi();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.bytes();
                        break;
                    }
                case 2: {
                        message.temp = reader.uint32();
                        break;
                    }
                case 3: {
                        message.humi = reader.uint32();
                        break;
                    }
                case 4: {
                        message.batt = reader.uint32();
                        break;
                    }
                case 5: {
                        message.rssi = reader.uint32();
                        break;
                    }
                case 6: {
                        message.name = reader.string();
                        break;
                    }
                case 7: {
                        message.pos = reader.bytes();
                        break;
                    }
                case 8: {
                        message.dist = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Xiaomi message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sensor.Xiaomi
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sensor.Xiaomi} Xiaomi
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Xiaomi.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Xiaomi message.
         * @function verify
         * @memberof sensor.Xiaomi
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Xiaomi.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!(message.id && typeof message.id.length === "number" || $util.isString(message.id)))
                    return "id: buffer expected";
            if (message.temp != null && message.hasOwnProperty("temp"))
                if (!$util.isInteger(message.temp))
                    return "temp: integer expected";
            if (message.humi != null && message.hasOwnProperty("humi"))
                if (!$util.isInteger(message.humi))
                    return "humi: integer expected";
            if (message.batt != null && message.hasOwnProperty("batt"))
                if (!$util.isInteger(message.batt))
                    return "batt: integer expected";
            if (message.rssi != null && message.hasOwnProperty("rssi"))
                if (!$util.isInteger(message.rssi))
                    return "rssi: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.pos != null && message.hasOwnProperty("pos"))
                if (!(message.pos && typeof message.pos.length === "number" || $util.isString(message.pos)))
                    return "pos: buffer expected";
            if (message.dist != null && message.hasOwnProperty("dist"))
                if (!$util.isInteger(message.dist))
                    return "dist: integer expected";
            return null;
        };

        /**
         * Creates a Xiaomi message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sensor.Xiaomi
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sensor.Xiaomi} Xiaomi
         */
        Xiaomi.fromObject = function fromObject(object) {
            if (object instanceof $root.sensor.Xiaomi)
                return object;
            var message = new $root.sensor.Xiaomi();
            if (object.id != null)
                if (typeof object.id === "string")
                    $util.base64.decode(object.id, message.id = $util.newBuffer($util.base64.length(object.id)), 0);
                else if (object.id.length >= 0)
                    message.id = object.id;
            if (object.temp != null)
                message.temp = object.temp >>> 0;
            if (object.humi != null)
                message.humi = object.humi >>> 0;
            if (object.batt != null)
                message.batt = object.batt >>> 0;
            if (object.rssi != null)
                message.rssi = object.rssi >>> 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.pos != null)
                if (typeof object.pos === "string")
                    $util.base64.decode(object.pos, message.pos = $util.newBuffer($util.base64.length(object.pos)), 0);
                else if (object.pos.length >= 0)
                    message.pos = object.pos;
            if (object.dist != null)
                message.dist = object.dist >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Xiaomi message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sensor.Xiaomi
         * @static
         * @param {sensor.Xiaomi} message Xiaomi
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Xiaomi.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.id = "";
                else {
                    object.id = [];
                    if (options.bytes !== Array)
                        object.id = $util.newBuffer(object.id);
                }
                object.temp = 0;
                object.humi = 0;
                object.batt = 0;
                object.rssi = 0;
                object.name = "";
                if (options.bytes === String)
                    object.pos = "";
                else {
                    object.pos = [];
                    if (options.bytes !== Array)
                        object.pos = $util.newBuffer(object.pos);
                }
                object.dist = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = options.bytes === String ? $util.base64.encode(message.id, 0, message.id.length) : options.bytes === Array ? Array.prototype.slice.call(message.id) : message.id;
            if (message.temp != null && message.hasOwnProperty("temp"))
                object.temp = message.temp;
            if (message.humi != null && message.hasOwnProperty("humi"))
                object.humi = message.humi;
            if (message.batt != null && message.hasOwnProperty("batt"))
                object.batt = message.batt;
            if (message.rssi != null && message.hasOwnProperty("rssi"))
                object.rssi = message.rssi;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = options.bytes === String ? $util.base64.encode(message.pos, 0, message.pos.length) : options.bytes === Array ? Array.prototype.slice.call(message.pos) : message.pos;
            if (message.dist != null && message.hasOwnProperty("dist"))
                object.dist = message.dist;
            return object;
        };

        /**
         * Converts this Xiaomi to JSON.
         * @function toJSON
         * @memberof sensor.Xiaomi
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Xiaomi.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Xiaomi
         * @function getTypeUrl
         * @memberof sensor.Xiaomi
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Xiaomi.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/sensor.Xiaomi";
        };

        return Xiaomi;
    })();

    sensor.Mics = (function() {

        /**
         * Properties of a Mics.
         * @memberof sensor
         * @interface IMics
         * @property {number|null} [rs] Mics rs
         * @property {number|null} [ro] Mics ro
         */

        /**
         * Constructs a new Mics.
         * @memberof sensor
         * @classdesc Represents a Mics.
         * @implements IMics
         * @constructor
         * @param {sensor.IMics=} [properties] Properties to set
         */
        function Mics(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Mics rs.
         * @member {number} rs
         * @memberof sensor.Mics
         * @instance
         */
        Mics.prototype.rs = 0;

        /**
         * Mics ro.
         * @member {number} ro
         * @memberof sensor.Mics
         * @instance
         */
        Mics.prototype.ro = 0;

        /**
         * Creates a new Mics instance using the specified properties.
         * @function create
         * @memberof sensor.Mics
         * @static
         * @param {sensor.IMics=} [properties] Properties to set
         * @returns {sensor.Mics} Mics instance
         */
        Mics.create = function create(properties) {
            return new Mics(properties);
        };

        /**
         * Encodes the specified Mics message. Does not implicitly {@link sensor.Mics.verify|verify} messages.
         * @function encode
         * @memberof sensor.Mics
         * @static
         * @param {sensor.IMics} message Mics message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Mics.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rs != null && Object.hasOwnProperty.call(message, "rs"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.rs);
            if (message.ro != null && Object.hasOwnProperty.call(message, "ro"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.ro);
            return writer;
        };

        /**
         * Encodes the specified Mics message, length delimited. Does not implicitly {@link sensor.Mics.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sensor.Mics
         * @static
         * @param {sensor.IMics} message Mics message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Mics.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Mics message from the specified reader or buffer.
         * @function decode
         * @memberof sensor.Mics
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sensor.Mics} Mics
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Mics.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensor.Mics();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.rs = reader.uint32();
                        break;
                    }
                case 2: {
                        message.ro = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Mics message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sensor.Mics
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sensor.Mics} Mics
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Mics.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Mics message.
         * @function verify
         * @memberof sensor.Mics
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Mics.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rs != null && message.hasOwnProperty("rs"))
                if (!$util.isInteger(message.rs))
                    return "rs: integer expected";
            if (message.ro != null && message.hasOwnProperty("ro"))
                if (!$util.isInteger(message.ro))
                    return "ro: integer expected";
            return null;
        };

        /**
         * Creates a Mics message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sensor.Mics
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sensor.Mics} Mics
         */
        Mics.fromObject = function fromObject(object) {
            if (object instanceof $root.sensor.Mics)
                return object;
            var message = new $root.sensor.Mics();
            if (object.rs != null)
                message.rs = object.rs >>> 0;
            if (object.ro != null)
                message.ro = object.ro >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Mics message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sensor.Mics
         * @static
         * @param {sensor.Mics} message Mics
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Mics.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.rs = 0;
                object.ro = 0;
            }
            if (message.rs != null && message.hasOwnProperty("rs"))
                object.rs = message.rs;
            if (message.ro != null && message.hasOwnProperty("ro"))
                object.ro = message.ro;
            return object;
        };

        /**
         * Converts this Mics to JSON.
         * @function toJSON
         * @memberof sensor.Mics
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Mics.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Mics
         * @function getTypeUrl
         * @memberof sensor.Mics
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Mics.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/sensor.Mics";
        };

        return Mics;
    })();

    sensor.Honey = (function() {

        /**
         * Properties of an Honey.
         * @memberof sensor
         * @interface IHoney
         * @property {Uint8Array|null} [id] Honey id
         * @property {number|null} [ammo] Honey ammo
         * @property {number|null} [temp] Honey temp
         * @property {number|null} [humi] Honey humi
         * @property {string|null} [name] Honey name
         * @property {Uint8Array|null} [pos] Honey pos
         * @property {number|null} [dist] Honey dist
         */

        /**
         * Constructs a new Honey.
         * @memberof sensor
         * @classdesc Represents an Honey.
         * @implements IHoney
         * @constructor
         * @param {sensor.IHoney=} [properties] Properties to set
         */
        function Honey(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Honey id.
         * @member {Uint8Array} id
         * @memberof sensor.Honey
         * @instance
         */
        Honey.prototype.id = $util.newBuffer([]);

        /**
         * Honey ammo.
         * @member {number} ammo
         * @memberof sensor.Honey
         * @instance
         */
        Honey.prototype.ammo = 0;

        /**
         * Honey temp.
         * @member {number} temp
         * @memberof sensor.Honey
         * @instance
         */
        Honey.prototype.temp = 0;

        /**
         * Honey humi.
         * @member {number} humi
         * @memberof sensor.Honey
         * @instance
         */
        Honey.prototype.humi = 0;

        /**
         * Honey name.
         * @member {string} name
         * @memberof sensor.Honey
         * @instance
         */
        Honey.prototype.name = "";

        /**
         * Honey pos.
         * @member {Uint8Array} pos
         * @memberof sensor.Honey
         * @instance
         */
        Honey.prototype.pos = $util.newBuffer([]);

        /**
         * Honey dist.
         * @member {number} dist
         * @memberof sensor.Honey
         * @instance
         */
        Honey.prototype.dist = 0;

        /**
         * Creates a new Honey instance using the specified properties.
         * @function create
         * @memberof sensor.Honey
         * @static
         * @param {sensor.IHoney=} [properties] Properties to set
         * @returns {sensor.Honey} Honey instance
         */
        Honey.create = function create(properties) {
            return new Honey(properties);
        };

        /**
         * Encodes the specified Honey message. Does not implicitly {@link sensor.Honey.verify|verify} messages.
         * @function encode
         * @memberof sensor.Honey
         * @static
         * @param {sensor.IHoney} message Honey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Honey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.id);
            if (message.ammo != null && Object.hasOwnProperty.call(message, "ammo"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.ammo);
            if (message.temp != null && Object.hasOwnProperty.call(message, "temp"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.temp);
            if (message.humi != null && Object.hasOwnProperty.call(message, "humi"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.humi);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.name);
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.pos);
            if (message.dist != null && Object.hasOwnProperty.call(message, "dist"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.dist);
            return writer;
        };

        /**
         * Encodes the specified Honey message, length delimited. Does not implicitly {@link sensor.Honey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sensor.Honey
         * @static
         * @param {sensor.IHoney} message Honey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Honey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Honey message from the specified reader or buffer.
         * @function decode
         * @memberof sensor.Honey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sensor.Honey} Honey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Honey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensor.Honey();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.bytes();
                        break;
                    }
                case 2: {
                        message.ammo = reader.uint32();
                        break;
                    }
                case 3: {
                        message.temp = reader.uint32();
                        break;
                    }
                case 4: {
                        message.humi = reader.uint32();
                        break;
                    }
                case 6: {
                        message.name = reader.string();
                        break;
                    }
                case 7: {
                        message.pos = reader.bytes();
                        break;
                    }
                case 8: {
                        message.dist = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Honey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sensor.Honey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sensor.Honey} Honey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Honey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Honey message.
         * @function verify
         * @memberof sensor.Honey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Honey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!(message.id && typeof message.id.length === "number" || $util.isString(message.id)))
                    return "id: buffer expected";
            if (message.ammo != null && message.hasOwnProperty("ammo"))
                if (!$util.isInteger(message.ammo))
                    return "ammo: integer expected";
            if (message.temp != null && message.hasOwnProperty("temp"))
                if (!$util.isInteger(message.temp))
                    return "temp: integer expected";
            if (message.humi != null && message.hasOwnProperty("humi"))
                if (!$util.isInteger(message.humi))
                    return "humi: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.pos != null && message.hasOwnProperty("pos"))
                if (!(message.pos && typeof message.pos.length === "number" || $util.isString(message.pos)))
                    return "pos: buffer expected";
            if (message.dist != null && message.hasOwnProperty("dist"))
                if (!$util.isInteger(message.dist))
                    return "dist: integer expected";
            return null;
        };

        /**
         * Creates an Honey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sensor.Honey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sensor.Honey} Honey
         */
        Honey.fromObject = function fromObject(object) {
            if (object instanceof $root.sensor.Honey)
                return object;
            var message = new $root.sensor.Honey();
            if (object.id != null)
                if (typeof object.id === "string")
                    $util.base64.decode(object.id, message.id = $util.newBuffer($util.base64.length(object.id)), 0);
                else if (object.id.length >= 0)
                    message.id = object.id;
            if (object.ammo != null)
                message.ammo = object.ammo >>> 0;
            if (object.temp != null)
                message.temp = object.temp >>> 0;
            if (object.humi != null)
                message.humi = object.humi >>> 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.pos != null)
                if (typeof object.pos === "string")
                    $util.base64.decode(object.pos, message.pos = $util.newBuffer($util.base64.length(object.pos)), 0);
                else if (object.pos.length >= 0)
                    message.pos = object.pos;
            if (object.dist != null)
                message.dist = object.dist >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an Honey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sensor.Honey
         * @static
         * @param {sensor.Honey} message Honey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Honey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.id = "";
                else {
                    object.id = [];
                    if (options.bytes !== Array)
                        object.id = $util.newBuffer(object.id);
                }
                object.ammo = 0;
                object.temp = 0;
                object.humi = 0;
                object.name = "";
                if (options.bytes === String)
                    object.pos = "";
                else {
                    object.pos = [];
                    if (options.bytes !== Array)
                        object.pos = $util.newBuffer(object.pos);
                }
                object.dist = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = options.bytes === String ? $util.base64.encode(message.id, 0, message.id.length) : options.bytes === Array ? Array.prototype.slice.call(message.id) : message.id;
            if (message.ammo != null && message.hasOwnProperty("ammo"))
                object.ammo = message.ammo;
            if (message.temp != null && message.hasOwnProperty("temp"))
                object.temp = message.temp;
            if (message.humi != null && message.hasOwnProperty("humi"))
                object.humi = message.humi;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = options.bytes === String ? $util.base64.encode(message.pos, 0, message.pos.length) : options.bytes === Array ? Array.prototype.slice.call(message.pos) : message.pos;
            if (message.dist != null && message.hasOwnProperty("dist"))
                object.dist = message.dist;
            return object;
        };

        /**
         * Converts this Honey to JSON.
         * @function toJSON
         * @memberof sensor.Honey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Honey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Honey
         * @function getTypeUrl
         * @memberof sensor.Honey
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Honey.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/sensor.Honey";
        };

        return Honey;
    })();

    sensor.Wind = (function() {

        /**
         * Properties of a Wind.
         * @memberof sensor
         * @interface IWind
         * @property {Uint8Array|null} [id] Wind id
         * @property {number|null} [speed] Wind speed
         * @property {string|null} [name] Wind name
         * @property {Uint8Array|null} [pos] Wind pos
         * @property {number|null} [dist] Wind dist
         */

        /**
         * Constructs a new Wind.
         * @memberof sensor
         * @classdesc Represents a Wind.
         * @implements IWind
         * @constructor
         * @param {sensor.IWind=} [properties] Properties to set
         */
        function Wind(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Wind id.
         * @member {Uint8Array} id
         * @memberof sensor.Wind
         * @instance
         */
        Wind.prototype.id = $util.newBuffer([]);

        /**
         * Wind speed.
         * @member {number} speed
         * @memberof sensor.Wind
         * @instance
         */
        Wind.prototype.speed = 0;

        /**
         * Wind name.
         * @member {string} name
         * @memberof sensor.Wind
         * @instance
         */
        Wind.prototype.name = "";

        /**
         * Wind pos.
         * @member {Uint8Array} pos
         * @memberof sensor.Wind
         * @instance
         */
        Wind.prototype.pos = $util.newBuffer([]);

        /**
         * Wind dist.
         * @member {number} dist
         * @memberof sensor.Wind
         * @instance
         */
        Wind.prototype.dist = 0;

        /**
         * Creates a new Wind instance using the specified properties.
         * @function create
         * @memberof sensor.Wind
         * @static
         * @param {sensor.IWind=} [properties] Properties to set
         * @returns {sensor.Wind} Wind instance
         */
        Wind.create = function create(properties) {
            return new Wind(properties);
        };

        /**
         * Encodes the specified Wind message. Does not implicitly {@link sensor.Wind.verify|verify} messages.
         * @function encode
         * @memberof sensor.Wind
         * @static
         * @param {sensor.IWind} message Wind message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Wind.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.id);
            if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.speed);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.name);
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.pos);
            if (message.dist != null && Object.hasOwnProperty.call(message, "dist"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.dist);
            return writer;
        };

        /**
         * Encodes the specified Wind message, length delimited. Does not implicitly {@link sensor.Wind.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sensor.Wind
         * @static
         * @param {sensor.IWind} message Wind message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Wind.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Wind message from the specified reader or buffer.
         * @function decode
         * @memberof sensor.Wind
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sensor.Wind} Wind
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Wind.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensor.Wind();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.bytes();
                        break;
                    }
                case 2: {
                        message.speed = reader.uint32();
                        break;
                    }
                case 6: {
                        message.name = reader.string();
                        break;
                    }
                case 7: {
                        message.pos = reader.bytes();
                        break;
                    }
                case 8: {
                        message.dist = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Wind message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sensor.Wind
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sensor.Wind} Wind
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Wind.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Wind message.
         * @function verify
         * @memberof sensor.Wind
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Wind.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!(message.id && typeof message.id.length === "number" || $util.isString(message.id)))
                    return "id: buffer expected";
            if (message.speed != null && message.hasOwnProperty("speed"))
                if (!$util.isInteger(message.speed))
                    return "speed: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.pos != null && message.hasOwnProperty("pos"))
                if (!(message.pos && typeof message.pos.length === "number" || $util.isString(message.pos)))
                    return "pos: buffer expected";
            if (message.dist != null && message.hasOwnProperty("dist"))
                if (!$util.isInteger(message.dist))
                    return "dist: integer expected";
            return null;
        };

        /**
         * Creates a Wind message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sensor.Wind
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sensor.Wind} Wind
         */
        Wind.fromObject = function fromObject(object) {
            if (object instanceof $root.sensor.Wind)
                return object;
            var message = new $root.sensor.Wind();
            if (object.id != null)
                if (typeof object.id === "string")
                    $util.base64.decode(object.id, message.id = $util.newBuffer($util.base64.length(object.id)), 0);
                else if (object.id.length >= 0)
                    message.id = object.id;
            if (object.speed != null)
                message.speed = object.speed >>> 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.pos != null)
                if (typeof object.pos === "string")
                    $util.base64.decode(object.pos, message.pos = $util.newBuffer($util.base64.length(object.pos)), 0);
                else if (object.pos.length >= 0)
                    message.pos = object.pos;
            if (object.dist != null)
                message.dist = object.dist >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Wind message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sensor.Wind
         * @static
         * @param {sensor.Wind} message Wind
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Wind.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.id = "";
                else {
                    object.id = [];
                    if (options.bytes !== Array)
                        object.id = $util.newBuffer(object.id);
                }
                object.speed = 0;
                object.name = "";
                if (options.bytes === String)
                    object.pos = "";
                else {
                    object.pos = [];
                    if (options.bytes !== Array)
                        object.pos = $util.newBuffer(object.pos);
                }
                object.dist = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = options.bytes === String ? $util.base64.encode(message.id, 0, message.id.length) : options.bytes === Array ? Array.prototype.slice.call(message.id) : message.id;
            if (message.speed != null && message.hasOwnProperty("speed"))
                object.speed = message.speed;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = options.bytes === String ? $util.base64.encode(message.pos, 0, message.pos.length) : options.bytes === Array ? Array.prototype.slice.call(message.pos) : message.pos;
            if (message.dist != null && message.hasOwnProperty("dist"))
                object.dist = message.dist;
            return object;
        };

        /**
         * Converts this Wind to JSON.
         * @function toJSON
         * @memberof sensor.Wind
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Wind.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Wind
         * @function getTypeUrl
         * @memberof sensor.Wind
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Wind.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/sensor.Wind";
        };

        return Wind;
    })();

    return sensor;
})();

$root.smartcamera = (function() {

    /**
     * Namespace smartcamera.
     * @exports smartcamera
     * @namespace
     */
    var smartcamera = {};

    /**
     * DeviceImageState enum.
     * @name smartcamera.DeviceImageState
     * @enum {number}
     * @property {number} DONE=0 DONE value
     * @property {number} ERROR_CAPTURE_IMAGE=1 ERROR_CAPTURE_IMAGE value
     * @property {number} ERROR_UPLOAD_IMAGE=2 ERROR_UPLOAD_IMAGE value
     * @property {number} CRC_FAILED=4 CRC_FAILED value
     */
    smartcamera.DeviceImageState = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DONE"] = 0;
        values[valuesById[1] = "ERROR_CAPTURE_IMAGE"] = 1;
        values[valuesById[2] = "ERROR_UPLOAD_IMAGE"] = 2;
        values[valuesById[4] = "CRC_FAILED"] = 4;
        return values;
    })();

    smartcamera.Cam = (function() {

        /**
         * Properties of a Cam.
         * @memberof smartcamera
         * @interface ICam
         * @property {Uint8Array|null} [meta] Cam meta
         * @property {string|null} [jobId] Cam jobId
         * @property {string|null} [sensorCode] Cam sensorCode
         * @property {smartcamera.DeviceImageState|null} [state] Cam state
         * @property {smartcamera.ISetCam|null} [setCam] Cam setCam
         * @property {smartcamera.IDiagnosticsData|null} [diagnosticsData] Cam diagnosticsData
         * @property {smartcamera.IAlertCameraOffline|null} [alertCameraOffline] Cam alertCameraOffline
         */

        /**
         * Constructs a new Cam.
         * @memberof smartcamera
         * @classdesc Represents a Cam.
         * @implements ICam
         * @constructor
         * @param {smartcamera.ICam=} [properties] Properties to set
         */
        function Cam(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Cam meta.
         * @member {Uint8Array} meta
         * @memberof smartcamera.Cam
         * @instance
         */
        Cam.prototype.meta = $util.newBuffer([]);

        /**
         * Cam jobId.
         * @member {string} jobId
         * @memberof smartcamera.Cam
         * @instance
         */
        Cam.prototype.jobId = "";

        /**
         * Cam sensorCode.
         * @member {string} sensorCode
         * @memberof smartcamera.Cam
         * @instance
         */
        Cam.prototype.sensorCode = "";

        /**
         * Cam state.
         * @member {smartcamera.DeviceImageState} state
         * @memberof smartcamera.Cam
         * @instance
         */
        Cam.prototype.state = 0;

        /**
         * Cam setCam.
         * @member {smartcamera.ISetCam|null|undefined} setCam
         * @memberof smartcamera.Cam
         * @instance
         */
        Cam.prototype.setCam = null;

        /**
         * Cam diagnosticsData.
         * @member {smartcamera.IDiagnosticsData|null|undefined} diagnosticsData
         * @memberof smartcamera.Cam
         * @instance
         */
        Cam.prototype.diagnosticsData = null;

        /**
         * Cam alertCameraOffline.
         * @member {smartcamera.IAlertCameraOffline|null|undefined} alertCameraOffline
         * @memberof smartcamera.Cam
         * @instance
         */
        Cam.prototype.alertCameraOffline = null;

        /**
         * Creates a new Cam instance using the specified properties.
         * @function create
         * @memberof smartcamera.Cam
         * @static
         * @param {smartcamera.ICam=} [properties] Properties to set
         * @returns {smartcamera.Cam} Cam instance
         */
        Cam.create = function create(properties) {
            return new Cam(properties);
        };

        /**
         * Encodes the specified Cam message. Does not implicitly {@link smartcamera.Cam.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.Cam
         * @static
         * @param {smartcamera.ICam} message Cam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cam.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.meta);
            if (message.jobId != null && Object.hasOwnProperty.call(message, "jobId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.jobId);
            if (message.sensorCode != null && Object.hasOwnProperty.call(message, "sensorCode"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.sensorCode);
            if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.state);
            if (message.setCam != null && Object.hasOwnProperty.call(message, "setCam"))
                $root.smartcamera.SetCam.encode(message.setCam, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.diagnosticsData != null && Object.hasOwnProperty.call(message, "diagnosticsData"))
                $root.smartcamera.DiagnosticsData.encode(message.diagnosticsData, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.alertCameraOffline != null && Object.hasOwnProperty.call(message, "alertCameraOffline"))
                $root.smartcamera.AlertCameraOffline.encode(message.alertCameraOffline, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Cam message, length delimited. Does not implicitly {@link smartcamera.Cam.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.Cam
         * @static
         * @param {smartcamera.ICam} message Cam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cam.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Cam message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.Cam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.Cam} Cam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cam.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.Cam();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.meta = reader.bytes();
                        break;
                    }
                case 2: {
                        message.jobId = reader.string();
                        break;
                    }
                case 3: {
                        message.sensorCode = reader.string();
                        break;
                    }
                case 4: {
                        message.state = reader.int32();
                        break;
                    }
                case 5: {
                        message.setCam = $root.smartcamera.SetCam.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.diagnosticsData = $root.smartcamera.DiagnosticsData.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.alertCameraOffline = $root.smartcamera.AlertCameraOffline.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Cam message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.Cam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.Cam} Cam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cam.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Cam message.
         * @function verify
         * @memberof smartcamera.Cam
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Cam.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.meta != null && message.hasOwnProperty("meta"))
                if (!(message.meta && typeof message.meta.length === "number" || $util.isString(message.meta)))
                    return "meta: buffer expected";
            if (message.jobId != null && message.hasOwnProperty("jobId"))
                if (!$util.isString(message.jobId))
                    return "jobId: string expected";
            if (message.sensorCode != null && message.hasOwnProperty("sensorCode"))
                if (!$util.isString(message.sensorCode))
                    return "sensorCode: string expected";
            if (message.state != null && message.hasOwnProperty("state"))
                switch (message.state) {
                default:
                    return "state: enum value expected";
                case 0:
                case 1:
                case 2:
                case 4:
                    break;
                }
            if (message.setCam != null && message.hasOwnProperty("setCam")) {
                var error = $root.smartcamera.SetCam.verify(message.setCam);
                if (error)
                    return "setCam." + error;
            }
            if (message.diagnosticsData != null && message.hasOwnProperty("diagnosticsData")) {
                var error = $root.smartcamera.DiagnosticsData.verify(message.diagnosticsData);
                if (error)
                    return "diagnosticsData." + error;
            }
            if (message.alertCameraOffline != null && message.hasOwnProperty("alertCameraOffline")) {
                var error = $root.smartcamera.AlertCameraOffline.verify(message.alertCameraOffline);
                if (error)
                    return "alertCameraOffline." + error;
            }
            return null;
        };

        /**
         * Creates a Cam message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.Cam
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.Cam} Cam
         */
        Cam.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.Cam)
                return object;
            var message = new $root.smartcamera.Cam();
            if (object.meta != null)
                if (typeof object.meta === "string")
                    $util.base64.decode(object.meta, message.meta = $util.newBuffer($util.base64.length(object.meta)), 0);
                else if (object.meta.length >= 0)
                    message.meta = object.meta;
            if (object.jobId != null)
                message.jobId = String(object.jobId);
            if (object.sensorCode != null)
                message.sensorCode = String(object.sensorCode);
            switch (object.state) {
            default:
                if (typeof object.state === "number") {
                    message.state = object.state;
                    break;
                }
                break;
            case "DONE":
            case 0:
                message.state = 0;
                break;
            case "ERROR_CAPTURE_IMAGE":
            case 1:
                message.state = 1;
                break;
            case "ERROR_UPLOAD_IMAGE":
            case 2:
                message.state = 2;
                break;
            case "CRC_FAILED":
            case 4:
                message.state = 4;
                break;
            }
            if (object.setCam != null) {
                if (typeof object.setCam !== "object")
                    throw TypeError(".smartcamera.Cam.setCam: object expected");
                message.setCam = $root.smartcamera.SetCam.fromObject(object.setCam);
            }
            if (object.diagnosticsData != null) {
                if (typeof object.diagnosticsData !== "object")
                    throw TypeError(".smartcamera.Cam.diagnosticsData: object expected");
                message.diagnosticsData = $root.smartcamera.DiagnosticsData.fromObject(object.diagnosticsData);
            }
            if (object.alertCameraOffline != null) {
                if (typeof object.alertCameraOffline !== "object")
                    throw TypeError(".smartcamera.Cam.alertCameraOffline: object expected");
                message.alertCameraOffline = $root.smartcamera.AlertCameraOffline.fromObject(object.alertCameraOffline);
            }
            return message;
        };

        /**
         * Creates a plain object from a Cam message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.Cam
         * @static
         * @param {smartcamera.Cam} message Cam
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Cam.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.meta = "";
                else {
                    object.meta = [];
                    if (options.bytes !== Array)
                        object.meta = $util.newBuffer(object.meta);
                }
                object.jobId = "";
                object.sensorCode = "";
                object.state = options.enums === String ? "DONE" : 0;
                object.setCam = null;
                object.diagnosticsData = null;
                object.alertCameraOffline = null;
            }
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = options.bytes === String ? $util.base64.encode(message.meta, 0, message.meta.length) : options.bytes === Array ? Array.prototype.slice.call(message.meta) : message.meta;
            if (message.jobId != null && message.hasOwnProperty("jobId"))
                object.jobId = message.jobId;
            if (message.sensorCode != null && message.hasOwnProperty("sensorCode"))
                object.sensorCode = message.sensorCode;
            if (message.state != null && message.hasOwnProperty("state"))
                object.state = options.enums === String ? $root.smartcamera.DeviceImageState[message.state] === undefined ? message.state : $root.smartcamera.DeviceImageState[message.state] : message.state;
            if (message.setCam != null && message.hasOwnProperty("setCam"))
                object.setCam = $root.smartcamera.SetCam.toObject(message.setCam, options);
            if (message.diagnosticsData != null && message.hasOwnProperty("diagnosticsData"))
                object.diagnosticsData = $root.smartcamera.DiagnosticsData.toObject(message.diagnosticsData, options);
            if (message.alertCameraOffline != null && message.hasOwnProperty("alertCameraOffline"))
                object.alertCameraOffline = $root.smartcamera.AlertCameraOffline.toObject(message.alertCameraOffline, options);
            return object;
        };

        /**
         * Converts this Cam to JSON.
         * @function toJSON
         * @memberof smartcamera.Cam
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Cam.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Cam
         * @function getTypeUrl
         * @memberof smartcamera.Cam
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Cam.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.Cam";
        };

        return Cam;
    })();

    /**
     * DeviceErrorState enum.
     * @name smartcamera.DeviceErrorState
     * @enum {number}
     * @property {number} OTA_SUCCEED=0 OTA_SUCCEED value
     * @property {number} SET_CAM_SUCCEED=1 SET_CAM_SUCCEED value
     * @property {number} OTA_FAILED=2 OTA_FAILED value
     * @property {number} SET_CAM_FAILED=3 SET_CAM_FAILED value
     * @property {number} OTA_HASH_FAILED=4 OTA_HASH_FAILED value
     * @property {number} PROTO_CRC_FAILED=5 PROTO_CRC_FAILED value
     * @property {number} PRESIGNED_URL_FAILED=6 PRESIGNED_URL_FAILED value
     */
    smartcamera.DeviceErrorState = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "OTA_SUCCEED"] = 0;
        values[valuesById[1] = "SET_CAM_SUCCEED"] = 1;
        values[valuesById[2] = "OTA_FAILED"] = 2;
        values[valuesById[3] = "SET_CAM_FAILED"] = 3;
        values[valuesById[4] = "OTA_HASH_FAILED"] = 4;
        values[valuesById[5] = "PROTO_CRC_FAILED"] = 5;
        values[valuesById[6] = "PRESIGNED_URL_FAILED"] = 6;
        return values;
    })();

    smartcamera.SetParam = (function() {

        /**
         * Properties of a SetParam.
         * @memberof smartcamera
         * @interface ISetParam
         * @property {string|null} [sensorCode] SetParam sensorCode
         * @property {string|null} [ipCam] SetParam ipCam
         */

        /**
         * Constructs a new SetParam.
         * @memberof smartcamera
         * @classdesc Represents a SetParam.
         * @implements ISetParam
         * @constructor
         * @param {smartcamera.ISetParam=} [properties] Properties to set
         */
        function SetParam(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SetParam sensorCode.
         * @member {string} sensorCode
         * @memberof smartcamera.SetParam
         * @instance
         */
        SetParam.prototype.sensorCode = "";

        /**
         * SetParam ipCam.
         * @member {string} ipCam
         * @memberof smartcamera.SetParam
         * @instance
         */
        SetParam.prototype.ipCam = "";

        /**
         * Creates a new SetParam instance using the specified properties.
         * @function create
         * @memberof smartcamera.SetParam
         * @static
         * @param {smartcamera.ISetParam=} [properties] Properties to set
         * @returns {smartcamera.SetParam} SetParam instance
         */
        SetParam.create = function create(properties) {
            return new SetParam(properties);
        };

        /**
         * Encodes the specified SetParam message. Does not implicitly {@link smartcamera.SetParam.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.SetParam
         * @static
         * @param {smartcamera.ISetParam} message SetParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetParam.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sensorCode != null && Object.hasOwnProperty.call(message, "sensorCode"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.sensorCode);
            if (message.ipCam != null && Object.hasOwnProperty.call(message, "ipCam"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.ipCam);
            return writer;
        };

        /**
         * Encodes the specified SetParam message, length delimited. Does not implicitly {@link smartcamera.SetParam.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.SetParam
         * @static
         * @param {smartcamera.ISetParam} message SetParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetParam.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SetParam message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.SetParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.SetParam} SetParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetParam.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.SetParam();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.sensorCode = reader.string();
                        break;
                    }
                case 2: {
                        message.ipCam = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SetParam message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.SetParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.SetParam} SetParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetParam.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SetParam message.
         * @function verify
         * @memberof smartcamera.SetParam
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SetParam.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sensorCode != null && message.hasOwnProperty("sensorCode"))
                if (!$util.isString(message.sensorCode))
                    return "sensorCode: string expected";
            if (message.ipCam != null && message.hasOwnProperty("ipCam"))
                if (!$util.isString(message.ipCam))
                    return "ipCam: string expected";
            return null;
        };

        /**
         * Creates a SetParam message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.SetParam
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.SetParam} SetParam
         */
        SetParam.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.SetParam)
                return object;
            var message = new $root.smartcamera.SetParam();
            if (object.sensorCode != null)
                message.sensorCode = String(object.sensorCode);
            if (object.ipCam != null)
                message.ipCam = String(object.ipCam);
            return message;
        };

        /**
         * Creates a plain object from a SetParam message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.SetParam
         * @static
         * @param {smartcamera.SetParam} message SetParam
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SetParam.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.sensorCode = "";
                object.ipCam = "";
            }
            if (message.sensorCode != null && message.hasOwnProperty("sensorCode"))
                object.sensorCode = message.sensorCode;
            if (message.ipCam != null && message.hasOwnProperty("ipCam"))
                object.ipCam = message.ipCam;
            return object;
        };

        /**
         * Converts this SetParam to JSON.
         * @function toJSON
         * @memberof smartcamera.SetParam
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SetParam.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SetParam
         * @function getTypeUrl
         * @memberof smartcamera.SetParam
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SetParam.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.SetParam";
        };

        return SetParam;
    })();

    smartcamera.SetOta = (function() {

        /**
         * Properties of a SetOta.
         * @memberof smartcamera
         * @interface ISetOta
         * @property {string|null} [fileName] SetOta fileName
         * @property {string|null} [fileHash] SetOta fileHash
         * @property {string|null} [fileLink] SetOta fileLink
         */

        /**
         * Constructs a new SetOta.
         * @memberof smartcamera
         * @classdesc Represents a SetOta.
         * @implements ISetOta
         * @constructor
         * @param {smartcamera.ISetOta=} [properties] Properties to set
         */
        function SetOta(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SetOta fileName.
         * @member {string} fileName
         * @memberof smartcamera.SetOta
         * @instance
         */
        SetOta.prototype.fileName = "";

        /**
         * SetOta fileHash.
         * @member {string} fileHash
         * @memberof smartcamera.SetOta
         * @instance
         */
        SetOta.prototype.fileHash = "";

        /**
         * SetOta fileLink.
         * @member {string} fileLink
         * @memberof smartcamera.SetOta
         * @instance
         */
        SetOta.prototype.fileLink = "";

        /**
         * Creates a new SetOta instance using the specified properties.
         * @function create
         * @memberof smartcamera.SetOta
         * @static
         * @param {smartcamera.ISetOta=} [properties] Properties to set
         * @returns {smartcamera.SetOta} SetOta instance
         */
        SetOta.create = function create(properties) {
            return new SetOta(properties);
        };

        /**
         * Encodes the specified SetOta message. Does not implicitly {@link smartcamera.SetOta.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.SetOta
         * @static
         * @param {smartcamera.ISetOta} message SetOta message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetOta.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.fileName);
            if (message.fileHash != null && Object.hasOwnProperty.call(message, "fileHash"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.fileHash);
            if (message.fileLink != null && Object.hasOwnProperty.call(message, "fileLink"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.fileLink);
            return writer;
        };

        /**
         * Encodes the specified SetOta message, length delimited. Does not implicitly {@link smartcamera.SetOta.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.SetOta
         * @static
         * @param {smartcamera.ISetOta} message SetOta message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetOta.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SetOta message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.SetOta
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.SetOta} SetOta
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetOta.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.SetOta();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2: {
                        message.fileName = reader.string();
                        break;
                    }
                case 3: {
                        message.fileHash = reader.string();
                        break;
                    }
                case 4: {
                        message.fileLink = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SetOta message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.SetOta
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.SetOta} SetOta
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetOta.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SetOta message.
         * @function verify
         * @memberof smartcamera.SetOta
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SetOta.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.fileName != null && message.hasOwnProperty("fileName"))
                if (!$util.isString(message.fileName))
                    return "fileName: string expected";
            if (message.fileHash != null && message.hasOwnProperty("fileHash"))
                if (!$util.isString(message.fileHash))
                    return "fileHash: string expected";
            if (message.fileLink != null && message.hasOwnProperty("fileLink"))
                if (!$util.isString(message.fileLink))
                    return "fileLink: string expected";
            return null;
        };

        /**
         * Creates a SetOta message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.SetOta
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.SetOta} SetOta
         */
        SetOta.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.SetOta)
                return object;
            var message = new $root.smartcamera.SetOta();
            if (object.fileName != null)
                message.fileName = String(object.fileName);
            if (object.fileHash != null)
                message.fileHash = String(object.fileHash);
            if (object.fileLink != null)
                message.fileLink = String(object.fileLink);
            return message;
        };

        /**
         * Creates a plain object from a SetOta message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.SetOta
         * @static
         * @param {smartcamera.SetOta} message SetOta
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SetOta.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.fileName = "";
                object.fileHash = "";
                object.fileLink = "";
            }
            if (message.fileName != null && message.hasOwnProperty("fileName"))
                object.fileName = message.fileName;
            if (message.fileHash != null && message.hasOwnProperty("fileHash"))
                object.fileHash = message.fileHash;
            if (message.fileLink != null && message.hasOwnProperty("fileLink"))
                object.fileLink = message.fileLink;
            return object;
        };

        /**
         * Converts this SetOta to JSON.
         * @function toJSON
         * @memberof smartcamera.SetOta
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SetOta.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SetOta
         * @function getTypeUrl
         * @memberof smartcamera.SetOta
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SetOta.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.SetOta";
        };

        return SetOta;
    })();

    smartcamera.SetError = (function() {

        /**
         * Properties of a SetError.
         * @memberof smartcamera
         * @interface ISetError
         * @property {string|null} [macAddress] SetError macAddress
         * @property {smartcamera.DeviceErrorState|null} [state] SetError state
         */

        /**
         * Constructs a new SetError.
         * @memberof smartcamera
         * @classdesc Represents a SetError.
         * @implements ISetError
         * @constructor
         * @param {smartcamera.ISetError=} [properties] Properties to set
         */
        function SetError(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SetError macAddress.
         * @member {string} macAddress
         * @memberof smartcamera.SetError
         * @instance
         */
        SetError.prototype.macAddress = "";

        /**
         * SetError state.
         * @member {smartcamera.DeviceErrorState} state
         * @memberof smartcamera.SetError
         * @instance
         */
        SetError.prototype.state = 0;

        /**
         * Creates a new SetError instance using the specified properties.
         * @function create
         * @memberof smartcamera.SetError
         * @static
         * @param {smartcamera.ISetError=} [properties] Properties to set
         * @returns {smartcamera.SetError} SetError instance
         */
        SetError.create = function create(properties) {
            return new SetError(properties);
        };

        /**
         * Encodes the specified SetError message. Does not implicitly {@link smartcamera.SetError.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.SetError
         * @static
         * @param {smartcamera.ISetError} message SetError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetError.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.macAddress != null && Object.hasOwnProperty.call(message, "macAddress"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.macAddress);
            if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.state);
            return writer;
        };

        /**
         * Encodes the specified SetError message, length delimited. Does not implicitly {@link smartcamera.SetError.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.SetError
         * @static
         * @param {smartcamera.ISetError} message SetError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetError.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SetError message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.SetError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.SetError} SetError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetError.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.SetError();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2: {
                        message.macAddress = reader.string();
                        break;
                    }
                case 4: {
                        message.state = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SetError message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.SetError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.SetError} SetError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetError.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SetError message.
         * @function verify
         * @memberof smartcamera.SetError
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SetError.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.macAddress != null && message.hasOwnProperty("macAddress"))
                if (!$util.isString(message.macAddress))
                    return "macAddress: string expected";
            if (message.state != null && message.hasOwnProperty("state"))
                switch (message.state) {
                default:
                    return "state: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    break;
                }
            return null;
        };

        /**
         * Creates a SetError message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.SetError
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.SetError} SetError
         */
        SetError.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.SetError)
                return object;
            var message = new $root.smartcamera.SetError();
            if (object.macAddress != null)
                message.macAddress = String(object.macAddress);
            switch (object.state) {
            default:
                if (typeof object.state === "number") {
                    message.state = object.state;
                    break;
                }
                break;
            case "OTA_SUCCEED":
            case 0:
                message.state = 0;
                break;
            case "SET_CAM_SUCCEED":
            case 1:
                message.state = 1;
                break;
            case "OTA_FAILED":
            case 2:
                message.state = 2;
                break;
            case "SET_CAM_FAILED":
            case 3:
                message.state = 3;
                break;
            case "OTA_HASH_FAILED":
            case 4:
                message.state = 4;
                break;
            case "PROTO_CRC_FAILED":
            case 5:
                message.state = 5;
                break;
            case "PRESIGNED_URL_FAILED":
            case 6:
                message.state = 6;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a SetError message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.SetError
         * @static
         * @param {smartcamera.SetError} message SetError
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SetError.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.macAddress = "";
                object.state = options.enums === String ? "OTA_SUCCEED" : 0;
            }
            if (message.macAddress != null && message.hasOwnProperty("macAddress"))
                object.macAddress = message.macAddress;
            if (message.state != null && message.hasOwnProperty("state"))
                object.state = options.enums === String ? $root.smartcamera.DeviceErrorState[message.state] === undefined ? message.state : $root.smartcamera.DeviceErrorState[message.state] : message.state;
            return object;
        };

        /**
         * Converts this SetError to JSON.
         * @function toJSON
         * @memberof smartcamera.SetError
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SetError.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SetError
         * @function getTypeUrl
         * @memberof smartcamera.SetError
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SetError.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.SetError";
        };

        return SetError;
    })();

    smartcamera.SetCam = (function() {

        /**
         * Properties of a SetCam.
         * @memberof smartcamera
         * @interface ISetCam
         * @property {smartcamera.ISetParam|null} [setParam] SetCam setParam
         * @property {smartcamera.ISetOta|null} [setOta] SetCam setOta
         * @property {smartcamera.ISetError|null} [setError] SetCam setError
         */

        /**
         * Constructs a new SetCam.
         * @memberof smartcamera
         * @classdesc Represents a SetCam.
         * @implements ISetCam
         * @constructor
         * @param {smartcamera.ISetCam=} [properties] Properties to set
         */
        function SetCam(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SetCam setParam.
         * @member {smartcamera.ISetParam|null|undefined} setParam
         * @memberof smartcamera.SetCam
         * @instance
         */
        SetCam.prototype.setParam = null;

        /**
         * SetCam setOta.
         * @member {smartcamera.ISetOta|null|undefined} setOta
         * @memberof smartcamera.SetCam
         * @instance
         */
        SetCam.prototype.setOta = null;

        /**
         * SetCam setError.
         * @member {smartcamera.ISetError|null|undefined} setError
         * @memberof smartcamera.SetCam
         * @instance
         */
        SetCam.prototype.setError = null;

        /**
         * Creates a new SetCam instance using the specified properties.
         * @function create
         * @memberof smartcamera.SetCam
         * @static
         * @param {smartcamera.ISetCam=} [properties] Properties to set
         * @returns {smartcamera.SetCam} SetCam instance
         */
        SetCam.create = function create(properties) {
            return new SetCam(properties);
        };

        /**
         * Encodes the specified SetCam message. Does not implicitly {@link smartcamera.SetCam.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.SetCam
         * @static
         * @param {smartcamera.ISetCam} message SetCam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetCam.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.setParam != null && Object.hasOwnProperty.call(message, "setParam"))
                $root.smartcamera.SetParam.encode(message.setParam, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.setOta != null && Object.hasOwnProperty.call(message, "setOta"))
                $root.smartcamera.SetOta.encode(message.setOta, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.setError != null && Object.hasOwnProperty.call(message, "setError"))
                $root.smartcamera.SetError.encode(message.setError, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SetCam message, length delimited. Does not implicitly {@link smartcamera.SetCam.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.SetCam
         * @static
         * @param {smartcamera.ISetCam} message SetCam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetCam.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SetCam message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.SetCam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.SetCam} SetCam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetCam.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.SetCam();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.setParam = $root.smartcamera.SetParam.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.setOta = $root.smartcamera.SetOta.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.setError = $root.smartcamera.SetError.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SetCam message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.SetCam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.SetCam} SetCam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetCam.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SetCam message.
         * @function verify
         * @memberof smartcamera.SetCam
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SetCam.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.setParam != null && message.hasOwnProperty("setParam")) {
                var error = $root.smartcamera.SetParam.verify(message.setParam);
                if (error)
                    return "setParam." + error;
            }
            if (message.setOta != null && message.hasOwnProperty("setOta")) {
                var error = $root.smartcamera.SetOta.verify(message.setOta);
                if (error)
                    return "setOta." + error;
            }
            if (message.setError != null && message.hasOwnProperty("setError")) {
                var error = $root.smartcamera.SetError.verify(message.setError);
                if (error)
                    return "setError." + error;
            }
            return null;
        };

        /**
         * Creates a SetCam message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.SetCam
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.SetCam} SetCam
         */
        SetCam.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.SetCam)
                return object;
            var message = new $root.smartcamera.SetCam();
            if (object.setParam != null) {
                if (typeof object.setParam !== "object")
                    throw TypeError(".smartcamera.SetCam.setParam: object expected");
                message.setParam = $root.smartcamera.SetParam.fromObject(object.setParam);
            }
            if (object.setOta != null) {
                if (typeof object.setOta !== "object")
                    throw TypeError(".smartcamera.SetCam.setOta: object expected");
                message.setOta = $root.smartcamera.SetOta.fromObject(object.setOta);
            }
            if (object.setError != null) {
                if (typeof object.setError !== "object")
                    throw TypeError(".smartcamera.SetCam.setError: object expected");
                message.setError = $root.smartcamera.SetError.fromObject(object.setError);
            }
            return message;
        };

        /**
         * Creates a plain object from a SetCam message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.SetCam
         * @static
         * @param {smartcamera.SetCam} message SetCam
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SetCam.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.setParam = null;
                object.setOta = null;
                object.setError = null;
            }
            if (message.setParam != null && message.hasOwnProperty("setParam"))
                object.setParam = $root.smartcamera.SetParam.toObject(message.setParam, options);
            if (message.setOta != null && message.hasOwnProperty("setOta"))
                object.setOta = $root.smartcamera.SetOta.toObject(message.setOta, options);
            if (message.setError != null && message.hasOwnProperty("setError"))
                object.setError = $root.smartcamera.SetError.toObject(message.setError, options);
            return object;
        };

        /**
         * Converts this SetCam to JSON.
         * @function toJSON
         * @memberof smartcamera.SetCam
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SetCam.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SetCam
         * @function getTypeUrl
         * @memberof smartcamera.SetCam
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SetCam.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.SetCam";
        };

        return SetCam;
    })();

    smartcamera.DiagnosticsData = (function() {

        /**
         * Properties of a DiagnosticsData.
         * @memberof smartcamera
         * @interface IDiagnosticsData
         * @property {smartcamera.ICpuUsage|null} [cpuUsage] DiagnosticsData cpuUsage
         * @property {smartcamera.ICpuTemp|null} [cpuTemperature] DiagnosticsData cpuTemperature
         * @property {smartcamera.IDiskStatistics|null} [diskStats] DiagnosticsData diskStats
         * @property {smartcamera.IMemoryStatistics|null} [memoryStats] DiagnosticsData memoryStats
         * @property {smartcamera.INetworkStatistics|null} [networkStats] DiagnosticsData networkStats
         */

        /**
         * Constructs a new DiagnosticsData.
         * @memberof smartcamera
         * @classdesc Represents a DiagnosticsData.
         * @implements IDiagnosticsData
         * @constructor
         * @param {smartcamera.IDiagnosticsData=} [properties] Properties to set
         */
        function DiagnosticsData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DiagnosticsData cpuUsage.
         * @member {smartcamera.ICpuUsage|null|undefined} cpuUsage
         * @memberof smartcamera.DiagnosticsData
         * @instance
         */
        DiagnosticsData.prototype.cpuUsage = null;

        /**
         * DiagnosticsData cpuTemperature.
         * @member {smartcamera.ICpuTemp|null|undefined} cpuTemperature
         * @memberof smartcamera.DiagnosticsData
         * @instance
         */
        DiagnosticsData.prototype.cpuTemperature = null;

        /**
         * DiagnosticsData diskStats.
         * @member {smartcamera.IDiskStatistics|null|undefined} diskStats
         * @memberof smartcamera.DiagnosticsData
         * @instance
         */
        DiagnosticsData.prototype.diskStats = null;

        /**
         * DiagnosticsData memoryStats.
         * @member {smartcamera.IMemoryStatistics|null|undefined} memoryStats
         * @memberof smartcamera.DiagnosticsData
         * @instance
         */
        DiagnosticsData.prototype.memoryStats = null;

        /**
         * DiagnosticsData networkStats.
         * @member {smartcamera.INetworkStatistics|null|undefined} networkStats
         * @memberof smartcamera.DiagnosticsData
         * @instance
         */
        DiagnosticsData.prototype.networkStats = null;

        /**
         * Creates a new DiagnosticsData instance using the specified properties.
         * @function create
         * @memberof smartcamera.DiagnosticsData
         * @static
         * @param {smartcamera.IDiagnosticsData=} [properties] Properties to set
         * @returns {smartcamera.DiagnosticsData} DiagnosticsData instance
         */
        DiagnosticsData.create = function create(properties) {
            return new DiagnosticsData(properties);
        };

        /**
         * Encodes the specified DiagnosticsData message. Does not implicitly {@link smartcamera.DiagnosticsData.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.DiagnosticsData
         * @static
         * @param {smartcamera.IDiagnosticsData} message DiagnosticsData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DiagnosticsData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cpuUsage != null && Object.hasOwnProperty.call(message, "cpuUsage"))
                $root.smartcamera.CpuUsage.encode(message.cpuUsage, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.cpuTemperature != null && Object.hasOwnProperty.call(message, "cpuTemperature"))
                $root.smartcamera.CpuTemp.encode(message.cpuTemperature, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.diskStats != null && Object.hasOwnProperty.call(message, "diskStats"))
                $root.smartcamera.DiskStatistics.encode(message.diskStats, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.memoryStats != null && Object.hasOwnProperty.call(message, "memoryStats"))
                $root.smartcamera.MemoryStatistics.encode(message.memoryStats, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.networkStats != null && Object.hasOwnProperty.call(message, "networkStats"))
                $root.smartcamera.NetworkStatistics.encode(message.networkStats, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DiagnosticsData message, length delimited. Does not implicitly {@link smartcamera.DiagnosticsData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.DiagnosticsData
         * @static
         * @param {smartcamera.IDiagnosticsData} message DiagnosticsData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DiagnosticsData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DiagnosticsData message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.DiagnosticsData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.DiagnosticsData} DiagnosticsData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DiagnosticsData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.DiagnosticsData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.cpuUsage = $root.smartcamera.CpuUsage.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.cpuTemperature = $root.smartcamera.CpuTemp.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.diskStats = $root.smartcamera.DiskStatistics.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.memoryStats = $root.smartcamera.MemoryStatistics.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.networkStats = $root.smartcamera.NetworkStatistics.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DiagnosticsData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.DiagnosticsData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.DiagnosticsData} DiagnosticsData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DiagnosticsData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DiagnosticsData message.
         * @function verify
         * @memberof smartcamera.DiagnosticsData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DiagnosticsData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cpuUsage != null && message.hasOwnProperty("cpuUsage")) {
                var error = $root.smartcamera.CpuUsage.verify(message.cpuUsage);
                if (error)
                    return "cpuUsage." + error;
            }
            if (message.cpuTemperature != null && message.hasOwnProperty("cpuTemperature")) {
                var error = $root.smartcamera.CpuTemp.verify(message.cpuTemperature);
                if (error)
                    return "cpuTemperature." + error;
            }
            if (message.diskStats != null && message.hasOwnProperty("diskStats")) {
                var error = $root.smartcamera.DiskStatistics.verify(message.diskStats);
                if (error)
                    return "diskStats." + error;
            }
            if (message.memoryStats != null && message.hasOwnProperty("memoryStats")) {
                var error = $root.smartcamera.MemoryStatistics.verify(message.memoryStats);
                if (error)
                    return "memoryStats." + error;
            }
            if (message.networkStats != null && message.hasOwnProperty("networkStats")) {
                var error = $root.smartcamera.NetworkStatistics.verify(message.networkStats);
                if (error)
                    return "networkStats." + error;
            }
            return null;
        };

        /**
         * Creates a DiagnosticsData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.DiagnosticsData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.DiagnosticsData} DiagnosticsData
         */
        DiagnosticsData.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.DiagnosticsData)
                return object;
            var message = new $root.smartcamera.DiagnosticsData();
            if (object.cpuUsage != null) {
                if (typeof object.cpuUsage !== "object")
                    throw TypeError(".smartcamera.DiagnosticsData.cpuUsage: object expected");
                message.cpuUsage = $root.smartcamera.CpuUsage.fromObject(object.cpuUsage);
            }
            if (object.cpuTemperature != null) {
                if (typeof object.cpuTemperature !== "object")
                    throw TypeError(".smartcamera.DiagnosticsData.cpuTemperature: object expected");
                message.cpuTemperature = $root.smartcamera.CpuTemp.fromObject(object.cpuTemperature);
            }
            if (object.diskStats != null) {
                if (typeof object.diskStats !== "object")
                    throw TypeError(".smartcamera.DiagnosticsData.diskStats: object expected");
                message.diskStats = $root.smartcamera.DiskStatistics.fromObject(object.diskStats);
            }
            if (object.memoryStats != null) {
                if (typeof object.memoryStats !== "object")
                    throw TypeError(".smartcamera.DiagnosticsData.memoryStats: object expected");
                message.memoryStats = $root.smartcamera.MemoryStatistics.fromObject(object.memoryStats);
            }
            if (object.networkStats != null) {
                if (typeof object.networkStats !== "object")
                    throw TypeError(".smartcamera.DiagnosticsData.networkStats: object expected");
                message.networkStats = $root.smartcamera.NetworkStatistics.fromObject(object.networkStats);
            }
            return message;
        };

        /**
         * Creates a plain object from a DiagnosticsData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.DiagnosticsData
         * @static
         * @param {smartcamera.DiagnosticsData} message DiagnosticsData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DiagnosticsData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cpuUsage = null;
                object.cpuTemperature = null;
                object.diskStats = null;
                object.memoryStats = null;
                object.networkStats = null;
            }
            if (message.cpuUsage != null && message.hasOwnProperty("cpuUsage"))
                object.cpuUsage = $root.smartcamera.CpuUsage.toObject(message.cpuUsage, options);
            if (message.cpuTemperature != null && message.hasOwnProperty("cpuTemperature"))
                object.cpuTemperature = $root.smartcamera.CpuTemp.toObject(message.cpuTemperature, options);
            if (message.diskStats != null && message.hasOwnProperty("diskStats"))
                object.diskStats = $root.smartcamera.DiskStatistics.toObject(message.diskStats, options);
            if (message.memoryStats != null && message.hasOwnProperty("memoryStats"))
                object.memoryStats = $root.smartcamera.MemoryStatistics.toObject(message.memoryStats, options);
            if (message.networkStats != null && message.hasOwnProperty("networkStats"))
                object.networkStats = $root.smartcamera.NetworkStatistics.toObject(message.networkStats, options);
            return object;
        };

        /**
         * Converts this DiagnosticsData to JSON.
         * @function toJSON
         * @memberof smartcamera.DiagnosticsData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DiagnosticsData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DiagnosticsData
         * @function getTypeUrl
         * @memberof smartcamera.DiagnosticsData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DiagnosticsData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.DiagnosticsData";
        };

        return DiagnosticsData;
    })();

    smartcamera.CpuUsage = (function() {

        /**
         * Properties of a CpuUsage.
         * @memberof smartcamera
         * @interface ICpuUsage
         * @property {number|Long|null} [timestampUnix] CpuUsage timestampUnix
         * @property {number|null} [cpuUsagePercentage] CpuUsage cpuUsagePercentage
         */

        /**
         * Constructs a new CpuUsage.
         * @memberof smartcamera
         * @classdesc Represents a CpuUsage.
         * @implements ICpuUsage
         * @constructor
         * @param {smartcamera.ICpuUsage=} [properties] Properties to set
         */
        function CpuUsage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CpuUsage timestampUnix.
         * @member {number|Long} timestampUnix
         * @memberof smartcamera.CpuUsage
         * @instance
         */
        CpuUsage.prototype.timestampUnix = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * CpuUsage cpuUsagePercentage.
         * @member {number} cpuUsagePercentage
         * @memberof smartcamera.CpuUsage
         * @instance
         */
        CpuUsage.prototype.cpuUsagePercentage = 0;

        /**
         * Creates a new CpuUsage instance using the specified properties.
         * @function create
         * @memberof smartcamera.CpuUsage
         * @static
         * @param {smartcamera.ICpuUsage=} [properties] Properties to set
         * @returns {smartcamera.CpuUsage} CpuUsage instance
         */
        CpuUsage.create = function create(properties) {
            return new CpuUsage(properties);
        };

        /**
         * Encodes the specified CpuUsage message. Does not implicitly {@link smartcamera.CpuUsage.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.CpuUsage
         * @static
         * @param {smartcamera.ICpuUsage} message CpuUsage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CpuUsage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestampUnix != null && Object.hasOwnProperty.call(message, "timestampUnix"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.timestampUnix);
            if (message.cpuUsagePercentage != null && Object.hasOwnProperty.call(message, "cpuUsagePercentage"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.cpuUsagePercentage);
            return writer;
        };

        /**
         * Encodes the specified CpuUsage message, length delimited. Does not implicitly {@link smartcamera.CpuUsage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.CpuUsage
         * @static
         * @param {smartcamera.ICpuUsage} message CpuUsage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CpuUsage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CpuUsage message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.CpuUsage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.CpuUsage} CpuUsage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CpuUsage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.CpuUsage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.timestampUnix = reader.uint64();
                        break;
                    }
                case 2: {
                        message.cpuUsagePercentage = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CpuUsage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.CpuUsage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.CpuUsage} CpuUsage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CpuUsage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CpuUsage message.
         * @function verify
         * @memberof smartcamera.CpuUsage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CpuUsage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestampUnix != null && message.hasOwnProperty("timestampUnix"))
                if (!$util.isInteger(message.timestampUnix) && !(message.timestampUnix && $util.isInteger(message.timestampUnix.low) && $util.isInteger(message.timestampUnix.high)))
                    return "timestampUnix: integer|Long expected";
            if (message.cpuUsagePercentage != null && message.hasOwnProperty("cpuUsagePercentage"))
                if (typeof message.cpuUsagePercentage !== "number")
                    return "cpuUsagePercentage: number expected";
            return null;
        };

        /**
         * Creates a CpuUsage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.CpuUsage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.CpuUsage} CpuUsage
         */
        CpuUsage.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.CpuUsage)
                return object;
            var message = new $root.smartcamera.CpuUsage();
            if (object.timestampUnix != null)
                if ($util.Long)
                    (message.timestampUnix = $util.Long.fromValue(object.timestampUnix)).unsigned = true;
                else if (typeof object.timestampUnix === "string")
                    message.timestampUnix = parseInt(object.timestampUnix, 10);
                else if (typeof object.timestampUnix === "number")
                    message.timestampUnix = object.timestampUnix;
                else if (typeof object.timestampUnix === "object")
                    message.timestampUnix = new $util.LongBits(object.timestampUnix.low >>> 0, object.timestampUnix.high >>> 0).toNumber(true);
            if (object.cpuUsagePercentage != null)
                message.cpuUsagePercentage = Number(object.cpuUsagePercentage);
            return message;
        };

        /**
         * Creates a plain object from a CpuUsage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.CpuUsage
         * @static
         * @param {smartcamera.CpuUsage} message CpuUsage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CpuUsage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestampUnix = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampUnix = options.longs === String ? "0" : 0;
                object.cpuUsagePercentage = 0;
            }
            if (message.timestampUnix != null && message.hasOwnProperty("timestampUnix"))
                if (typeof message.timestampUnix === "number")
                    object.timestampUnix = options.longs === String ? String(message.timestampUnix) : message.timestampUnix;
                else
                    object.timestampUnix = options.longs === String ? $util.Long.prototype.toString.call(message.timestampUnix) : options.longs === Number ? new $util.LongBits(message.timestampUnix.low >>> 0, message.timestampUnix.high >>> 0).toNumber(true) : message.timestampUnix;
            if (message.cpuUsagePercentage != null && message.hasOwnProperty("cpuUsagePercentage"))
                object.cpuUsagePercentage = options.json && !isFinite(message.cpuUsagePercentage) ? String(message.cpuUsagePercentage) : message.cpuUsagePercentage;
            return object;
        };

        /**
         * Converts this CpuUsage to JSON.
         * @function toJSON
         * @memberof smartcamera.CpuUsage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CpuUsage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CpuUsage
         * @function getTypeUrl
         * @memberof smartcamera.CpuUsage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CpuUsage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.CpuUsage";
        };

        return CpuUsage;
    })();

    smartcamera.CpuTemp = (function() {

        /**
         * Properties of a CpuTemp.
         * @memberof smartcamera
         * @interface ICpuTemp
         * @property {number|Long|null} [timestampUnix] CpuTemp timestampUnix
         * @property {number|null} [cpuTemperatureCelcius] CpuTemp cpuTemperatureCelcius
         */

        /**
         * Constructs a new CpuTemp.
         * @memberof smartcamera
         * @classdesc Represents a CpuTemp.
         * @implements ICpuTemp
         * @constructor
         * @param {smartcamera.ICpuTemp=} [properties] Properties to set
         */
        function CpuTemp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CpuTemp timestampUnix.
         * @member {number|Long} timestampUnix
         * @memberof smartcamera.CpuTemp
         * @instance
         */
        CpuTemp.prototype.timestampUnix = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * CpuTemp cpuTemperatureCelcius.
         * @member {number} cpuTemperatureCelcius
         * @memberof smartcamera.CpuTemp
         * @instance
         */
        CpuTemp.prototype.cpuTemperatureCelcius = 0;

        /**
         * Creates a new CpuTemp instance using the specified properties.
         * @function create
         * @memberof smartcamera.CpuTemp
         * @static
         * @param {smartcamera.ICpuTemp=} [properties] Properties to set
         * @returns {smartcamera.CpuTemp} CpuTemp instance
         */
        CpuTemp.create = function create(properties) {
            return new CpuTemp(properties);
        };

        /**
         * Encodes the specified CpuTemp message. Does not implicitly {@link smartcamera.CpuTemp.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.CpuTemp
         * @static
         * @param {smartcamera.ICpuTemp} message CpuTemp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CpuTemp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestampUnix != null && Object.hasOwnProperty.call(message, "timestampUnix"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.timestampUnix);
            if (message.cpuTemperatureCelcius != null && Object.hasOwnProperty.call(message, "cpuTemperatureCelcius"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.cpuTemperatureCelcius);
            return writer;
        };

        /**
         * Encodes the specified CpuTemp message, length delimited. Does not implicitly {@link smartcamera.CpuTemp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.CpuTemp
         * @static
         * @param {smartcamera.ICpuTemp} message CpuTemp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CpuTemp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CpuTemp message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.CpuTemp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.CpuTemp} CpuTemp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CpuTemp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.CpuTemp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.timestampUnix = reader.uint64();
                        break;
                    }
                case 2: {
                        message.cpuTemperatureCelcius = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CpuTemp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.CpuTemp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.CpuTemp} CpuTemp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CpuTemp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CpuTemp message.
         * @function verify
         * @memberof smartcamera.CpuTemp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CpuTemp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestampUnix != null && message.hasOwnProperty("timestampUnix"))
                if (!$util.isInteger(message.timestampUnix) && !(message.timestampUnix && $util.isInteger(message.timestampUnix.low) && $util.isInteger(message.timestampUnix.high)))
                    return "timestampUnix: integer|Long expected";
            if (message.cpuTemperatureCelcius != null && message.hasOwnProperty("cpuTemperatureCelcius"))
                if (typeof message.cpuTemperatureCelcius !== "number")
                    return "cpuTemperatureCelcius: number expected";
            return null;
        };

        /**
         * Creates a CpuTemp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.CpuTemp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.CpuTemp} CpuTemp
         */
        CpuTemp.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.CpuTemp)
                return object;
            var message = new $root.smartcamera.CpuTemp();
            if (object.timestampUnix != null)
                if ($util.Long)
                    (message.timestampUnix = $util.Long.fromValue(object.timestampUnix)).unsigned = true;
                else if (typeof object.timestampUnix === "string")
                    message.timestampUnix = parseInt(object.timestampUnix, 10);
                else if (typeof object.timestampUnix === "number")
                    message.timestampUnix = object.timestampUnix;
                else if (typeof object.timestampUnix === "object")
                    message.timestampUnix = new $util.LongBits(object.timestampUnix.low >>> 0, object.timestampUnix.high >>> 0).toNumber(true);
            if (object.cpuTemperatureCelcius != null)
                message.cpuTemperatureCelcius = Number(object.cpuTemperatureCelcius);
            return message;
        };

        /**
         * Creates a plain object from a CpuTemp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.CpuTemp
         * @static
         * @param {smartcamera.CpuTemp} message CpuTemp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CpuTemp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestampUnix = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampUnix = options.longs === String ? "0" : 0;
                object.cpuTemperatureCelcius = 0;
            }
            if (message.timestampUnix != null && message.hasOwnProperty("timestampUnix"))
                if (typeof message.timestampUnix === "number")
                    object.timestampUnix = options.longs === String ? String(message.timestampUnix) : message.timestampUnix;
                else
                    object.timestampUnix = options.longs === String ? $util.Long.prototype.toString.call(message.timestampUnix) : options.longs === Number ? new $util.LongBits(message.timestampUnix.low >>> 0, message.timestampUnix.high >>> 0).toNumber(true) : message.timestampUnix;
            if (message.cpuTemperatureCelcius != null && message.hasOwnProperty("cpuTemperatureCelcius"))
                object.cpuTemperatureCelcius = options.json && !isFinite(message.cpuTemperatureCelcius) ? String(message.cpuTemperatureCelcius) : message.cpuTemperatureCelcius;
            return object;
        };

        /**
         * Converts this CpuTemp to JSON.
         * @function toJSON
         * @memberof smartcamera.CpuTemp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CpuTemp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CpuTemp
         * @function getTypeUrl
         * @memberof smartcamera.CpuTemp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CpuTemp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.CpuTemp";
        };

        return CpuTemp;
    })();

    smartcamera.DiskStatistics = (function() {

        /**
         * Properties of a DiskStatistics.
         * @memberof smartcamera
         * @interface IDiskStatistics
         * @property {number|Long|null} [timestampUnix] DiskStatistics timestampUnix
         * @property {number|null} [diskUsed_KB] DiskStatistics diskUsed_KB
         * @property {number|null} [diskAvailable_KB] DiskStatistics diskAvailable_KB
         * @property {number|null} [diskUsedPercentage] DiskStatistics diskUsedPercentage
         */

        /**
         * Constructs a new DiskStatistics.
         * @memberof smartcamera
         * @classdesc Represents a DiskStatistics.
         * @implements IDiskStatistics
         * @constructor
         * @param {smartcamera.IDiskStatistics=} [properties] Properties to set
         */
        function DiskStatistics(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DiskStatistics timestampUnix.
         * @member {number|Long} timestampUnix
         * @memberof smartcamera.DiskStatistics
         * @instance
         */
        DiskStatistics.prototype.timestampUnix = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * DiskStatistics diskUsed_KB.
         * @member {number} diskUsed_KB
         * @memberof smartcamera.DiskStatistics
         * @instance
         */
        DiskStatistics.prototype.diskUsed_KB = 0;

        /**
         * DiskStatistics diskAvailable_KB.
         * @member {number} diskAvailable_KB
         * @memberof smartcamera.DiskStatistics
         * @instance
         */
        DiskStatistics.prototype.diskAvailable_KB = 0;

        /**
         * DiskStatistics diskUsedPercentage.
         * @member {number} diskUsedPercentage
         * @memberof smartcamera.DiskStatistics
         * @instance
         */
        DiskStatistics.prototype.diskUsedPercentage = 0;

        /**
         * Creates a new DiskStatistics instance using the specified properties.
         * @function create
         * @memberof smartcamera.DiskStatistics
         * @static
         * @param {smartcamera.IDiskStatistics=} [properties] Properties to set
         * @returns {smartcamera.DiskStatistics} DiskStatistics instance
         */
        DiskStatistics.create = function create(properties) {
            return new DiskStatistics(properties);
        };

        /**
         * Encodes the specified DiskStatistics message. Does not implicitly {@link smartcamera.DiskStatistics.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.DiskStatistics
         * @static
         * @param {smartcamera.IDiskStatistics} message DiskStatistics message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DiskStatistics.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestampUnix != null && Object.hasOwnProperty.call(message, "timestampUnix"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.timestampUnix);
            if (message.diskUsed_KB != null && Object.hasOwnProperty.call(message, "diskUsed_KB"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.diskUsed_KB);
            if (message.diskAvailable_KB != null && Object.hasOwnProperty.call(message, "diskAvailable_KB"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.diskAvailable_KB);
            if (message.diskUsedPercentage != null && Object.hasOwnProperty.call(message, "diskUsedPercentage"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.diskUsedPercentage);
            return writer;
        };

        /**
         * Encodes the specified DiskStatistics message, length delimited. Does not implicitly {@link smartcamera.DiskStatistics.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.DiskStatistics
         * @static
         * @param {smartcamera.IDiskStatistics} message DiskStatistics message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DiskStatistics.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DiskStatistics message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.DiskStatistics
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.DiskStatistics} DiskStatistics
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DiskStatistics.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.DiskStatistics();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.timestampUnix = reader.uint64();
                        break;
                    }
                case 2: {
                        message.diskUsed_KB = reader.uint32();
                        break;
                    }
                case 3: {
                        message.diskAvailable_KB = reader.uint32();
                        break;
                    }
                case 4: {
                        message.diskUsedPercentage = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DiskStatistics message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.DiskStatistics
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.DiskStatistics} DiskStatistics
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DiskStatistics.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DiskStatistics message.
         * @function verify
         * @memberof smartcamera.DiskStatistics
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DiskStatistics.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestampUnix != null && message.hasOwnProperty("timestampUnix"))
                if (!$util.isInteger(message.timestampUnix) && !(message.timestampUnix && $util.isInteger(message.timestampUnix.low) && $util.isInteger(message.timestampUnix.high)))
                    return "timestampUnix: integer|Long expected";
            if (message.diskUsed_KB != null && message.hasOwnProperty("diskUsed_KB"))
                if (!$util.isInteger(message.diskUsed_KB))
                    return "diskUsed_KB: integer expected";
            if (message.diskAvailable_KB != null && message.hasOwnProperty("diskAvailable_KB"))
                if (!$util.isInteger(message.diskAvailable_KB))
                    return "diskAvailable_KB: integer expected";
            if (message.diskUsedPercentage != null && message.hasOwnProperty("diskUsedPercentage"))
                if (!$util.isInteger(message.diskUsedPercentage))
                    return "diskUsedPercentage: integer expected";
            return null;
        };

        /**
         * Creates a DiskStatistics message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.DiskStatistics
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.DiskStatistics} DiskStatistics
         */
        DiskStatistics.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.DiskStatistics)
                return object;
            var message = new $root.smartcamera.DiskStatistics();
            if (object.timestampUnix != null)
                if ($util.Long)
                    (message.timestampUnix = $util.Long.fromValue(object.timestampUnix)).unsigned = true;
                else if (typeof object.timestampUnix === "string")
                    message.timestampUnix = parseInt(object.timestampUnix, 10);
                else if (typeof object.timestampUnix === "number")
                    message.timestampUnix = object.timestampUnix;
                else if (typeof object.timestampUnix === "object")
                    message.timestampUnix = new $util.LongBits(object.timestampUnix.low >>> 0, object.timestampUnix.high >>> 0).toNumber(true);
            if (object.diskUsed_KB != null)
                message.diskUsed_KB = object.diskUsed_KB >>> 0;
            if (object.diskAvailable_KB != null)
                message.diskAvailable_KB = object.diskAvailable_KB >>> 0;
            if (object.diskUsedPercentage != null)
                message.diskUsedPercentage = object.diskUsedPercentage >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a DiskStatistics message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.DiskStatistics
         * @static
         * @param {smartcamera.DiskStatistics} message DiskStatistics
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DiskStatistics.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestampUnix = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampUnix = options.longs === String ? "0" : 0;
                object.diskUsed_KB = 0;
                object.diskAvailable_KB = 0;
                object.diskUsedPercentage = 0;
            }
            if (message.timestampUnix != null && message.hasOwnProperty("timestampUnix"))
                if (typeof message.timestampUnix === "number")
                    object.timestampUnix = options.longs === String ? String(message.timestampUnix) : message.timestampUnix;
                else
                    object.timestampUnix = options.longs === String ? $util.Long.prototype.toString.call(message.timestampUnix) : options.longs === Number ? new $util.LongBits(message.timestampUnix.low >>> 0, message.timestampUnix.high >>> 0).toNumber(true) : message.timestampUnix;
            if (message.diskUsed_KB != null && message.hasOwnProperty("diskUsed_KB"))
                object.diskUsed_KB = message.diskUsed_KB;
            if (message.diskAvailable_KB != null && message.hasOwnProperty("diskAvailable_KB"))
                object.diskAvailable_KB = message.diskAvailable_KB;
            if (message.diskUsedPercentage != null && message.hasOwnProperty("diskUsedPercentage"))
                object.diskUsedPercentage = message.diskUsedPercentage;
            return object;
        };

        /**
         * Converts this DiskStatistics to JSON.
         * @function toJSON
         * @memberof smartcamera.DiskStatistics
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DiskStatistics.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DiskStatistics
         * @function getTypeUrl
         * @memberof smartcamera.DiskStatistics
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DiskStatistics.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.DiskStatistics";
        };

        return DiskStatistics;
    })();

    smartcamera.MemoryStatistics = (function() {

        /**
         * Properties of a MemoryStatistics.
         * @memberof smartcamera
         * @interface IMemoryStatistics
         * @property {number|Long|null} [timestampUnix] MemoryStatistics timestampUnix
         * @property {number|null} [memoryUsed_MiB] MemoryStatistics memoryUsed_MiB
         * @property {number|null} [memoryAvailable_MiB] MemoryStatistics memoryAvailable_MiB
         */

        /**
         * Constructs a new MemoryStatistics.
         * @memberof smartcamera
         * @classdesc Represents a MemoryStatistics.
         * @implements IMemoryStatistics
         * @constructor
         * @param {smartcamera.IMemoryStatistics=} [properties] Properties to set
         */
        function MemoryStatistics(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MemoryStatistics timestampUnix.
         * @member {number|Long} timestampUnix
         * @memberof smartcamera.MemoryStatistics
         * @instance
         */
        MemoryStatistics.prototype.timestampUnix = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * MemoryStatistics memoryUsed_MiB.
         * @member {number} memoryUsed_MiB
         * @memberof smartcamera.MemoryStatistics
         * @instance
         */
        MemoryStatistics.prototype.memoryUsed_MiB = 0;

        /**
         * MemoryStatistics memoryAvailable_MiB.
         * @member {number} memoryAvailable_MiB
         * @memberof smartcamera.MemoryStatistics
         * @instance
         */
        MemoryStatistics.prototype.memoryAvailable_MiB = 0;

        /**
         * Creates a new MemoryStatistics instance using the specified properties.
         * @function create
         * @memberof smartcamera.MemoryStatistics
         * @static
         * @param {smartcamera.IMemoryStatistics=} [properties] Properties to set
         * @returns {smartcamera.MemoryStatistics} MemoryStatistics instance
         */
        MemoryStatistics.create = function create(properties) {
            return new MemoryStatistics(properties);
        };

        /**
         * Encodes the specified MemoryStatistics message. Does not implicitly {@link smartcamera.MemoryStatistics.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.MemoryStatistics
         * @static
         * @param {smartcamera.IMemoryStatistics} message MemoryStatistics message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MemoryStatistics.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestampUnix != null && Object.hasOwnProperty.call(message, "timestampUnix"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.timestampUnix);
            if (message.memoryUsed_MiB != null && Object.hasOwnProperty.call(message, "memoryUsed_MiB"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.memoryUsed_MiB);
            if (message.memoryAvailable_MiB != null && Object.hasOwnProperty.call(message, "memoryAvailable_MiB"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.memoryAvailable_MiB);
            return writer;
        };

        /**
         * Encodes the specified MemoryStatistics message, length delimited. Does not implicitly {@link smartcamera.MemoryStatistics.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.MemoryStatistics
         * @static
         * @param {smartcamera.IMemoryStatistics} message MemoryStatistics message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MemoryStatistics.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MemoryStatistics message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.MemoryStatistics
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.MemoryStatistics} MemoryStatistics
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MemoryStatistics.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.MemoryStatistics();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.timestampUnix = reader.uint64();
                        break;
                    }
                case 2: {
                        message.memoryUsed_MiB = reader.uint32();
                        break;
                    }
                case 3: {
                        message.memoryAvailable_MiB = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MemoryStatistics message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.MemoryStatistics
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.MemoryStatistics} MemoryStatistics
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MemoryStatistics.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MemoryStatistics message.
         * @function verify
         * @memberof smartcamera.MemoryStatistics
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MemoryStatistics.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestampUnix != null && message.hasOwnProperty("timestampUnix"))
                if (!$util.isInteger(message.timestampUnix) && !(message.timestampUnix && $util.isInteger(message.timestampUnix.low) && $util.isInteger(message.timestampUnix.high)))
                    return "timestampUnix: integer|Long expected";
            if (message.memoryUsed_MiB != null && message.hasOwnProperty("memoryUsed_MiB"))
                if (!$util.isInteger(message.memoryUsed_MiB))
                    return "memoryUsed_MiB: integer expected";
            if (message.memoryAvailable_MiB != null && message.hasOwnProperty("memoryAvailable_MiB"))
                if (!$util.isInteger(message.memoryAvailable_MiB))
                    return "memoryAvailable_MiB: integer expected";
            return null;
        };

        /**
         * Creates a MemoryStatistics message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.MemoryStatistics
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.MemoryStatistics} MemoryStatistics
         */
        MemoryStatistics.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.MemoryStatistics)
                return object;
            var message = new $root.smartcamera.MemoryStatistics();
            if (object.timestampUnix != null)
                if ($util.Long)
                    (message.timestampUnix = $util.Long.fromValue(object.timestampUnix)).unsigned = true;
                else if (typeof object.timestampUnix === "string")
                    message.timestampUnix = parseInt(object.timestampUnix, 10);
                else if (typeof object.timestampUnix === "number")
                    message.timestampUnix = object.timestampUnix;
                else if (typeof object.timestampUnix === "object")
                    message.timestampUnix = new $util.LongBits(object.timestampUnix.low >>> 0, object.timestampUnix.high >>> 0).toNumber(true);
            if (object.memoryUsed_MiB != null)
                message.memoryUsed_MiB = object.memoryUsed_MiB >>> 0;
            if (object.memoryAvailable_MiB != null)
                message.memoryAvailable_MiB = object.memoryAvailable_MiB >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a MemoryStatistics message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.MemoryStatistics
         * @static
         * @param {smartcamera.MemoryStatistics} message MemoryStatistics
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MemoryStatistics.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestampUnix = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampUnix = options.longs === String ? "0" : 0;
                object.memoryUsed_MiB = 0;
                object.memoryAvailable_MiB = 0;
            }
            if (message.timestampUnix != null && message.hasOwnProperty("timestampUnix"))
                if (typeof message.timestampUnix === "number")
                    object.timestampUnix = options.longs === String ? String(message.timestampUnix) : message.timestampUnix;
                else
                    object.timestampUnix = options.longs === String ? $util.Long.prototype.toString.call(message.timestampUnix) : options.longs === Number ? new $util.LongBits(message.timestampUnix.low >>> 0, message.timestampUnix.high >>> 0).toNumber(true) : message.timestampUnix;
            if (message.memoryUsed_MiB != null && message.hasOwnProperty("memoryUsed_MiB"))
                object.memoryUsed_MiB = message.memoryUsed_MiB;
            if (message.memoryAvailable_MiB != null && message.hasOwnProperty("memoryAvailable_MiB"))
                object.memoryAvailable_MiB = message.memoryAvailable_MiB;
            return object;
        };

        /**
         * Converts this MemoryStatistics to JSON.
         * @function toJSON
         * @memberof smartcamera.MemoryStatistics
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MemoryStatistics.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MemoryStatistics
         * @function getTypeUrl
         * @memberof smartcamera.MemoryStatistics
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MemoryStatistics.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.MemoryStatistics";
        };

        return MemoryStatistics;
    })();

    smartcamera.NetworkStatistics = (function() {

        /**
         * Properties of a NetworkStatistics.
         * @memberof smartcamera
         * @interface INetworkStatistics
         * @property {number|Long|null} [timestampUnix] NetworkStatistics timestampUnix
         * @property {number|null} [pingMillis] NetworkStatistics pingMillis
         */

        /**
         * Constructs a new NetworkStatistics.
         * @memberof smartcamera
         * @classdesc Represents a NetworkStatistics.
         * @implements INetworkStatistics
         * @constructor
         * @param {smartcamera.INetworkStatistics=} [properties] Properties to set
         */
        function NetworkStatistics(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NetworkStatistics timestampUnix.
         * @member {number|Long} timestampUnix
         * @memberof smartcamera.NetworkStatistics
         * @instance
         */
        NetworkStatistics.prototype.timestampUnix = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * NetworkStatistics pingMillis.
         * @member {number} pingMillis
         * @memberof smartcamera.NetworkStatistics
         * @instance
         */
        NetworkStatistics.prototype.pingMillis = 0;

        /**
         * Creates a new NetworkStatistics instance using the specified properties.
         * @function create
         * @memberof smartcamera.NetworkStatistics
         * @static
         * @param {smartcamera.INetworkStatistics=} [properties] Properties to set
         * @returns {smartcamera.NetworkStatistics} NetworkStatistics instance
         */
        NetworkStatistics.create = function create(properties) {
            return new NetworkStatistics(properties);
        };

        /**
         * Encodes the specified NetworkStatistics message. Does not implicitly {@link smartcamera.NetworkStatistics.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.NetworkStatistics
         * @static
         * @param {smartcamera.INetworkStatistics} message NetworkStatistics message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetworkStatistics.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestampUnix != null && Object.hasOwnProperty.call(message, "timestampUnix"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.timestampUnix);
            if (message.pingMillis != null && Object.hasOwnProperty.call(message, "pingMillis"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.pingMillis);
            return writer;
        };

        /**
         * Encodes the specified NetworkStatistics message, length delimited. Does not implicitly {@link smartcamera.NetworkStatistics.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.NetworkStatistics
         * @static
         * @param {smartcamera.INetworkStatistics} message NetworkStatistics message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetworkStatistics.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NetworkStatistics message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.NetworkStatistics
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.NetworkStatistics} NetworkStatistics
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetworkStatistics.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.NetworkStatistics();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.timestampUnix = reader.uint64();
                        break;
                    }
                case 2: {
                        message.pingMillis = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NetworkStatistics message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.NetworkStatistics
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.NetworkStatistics} NetworkStatistics
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetworkStatistics.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NetworkStatistics message.
         * @function verify
         * @memberof smartcamera.NetworkStatistics
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NetworkStatistics.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestampUnix != null && message.hasOwnProperty("timestampUnix"))
                if (!$util.isInteger(message.timestampUnix) && !(message.timestampUnix && $util.isInteger(message.timestampUnix.low) && $util.isInteger(message.timestampUnix.high)))
                    return "timestampUnix: integer|Long expected";
            if (message.pingMillis != null && message.hasOwnProperty("pingMillis"))
                if (typeof message.pingMillis !== "number")
                    return "pingMillis: number expected";
            return null;
        };

        /**
         * Creates a NetworkStatistics message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.NetworkStatistics
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.NetworkStatistics} NetworkStatistics
         */
        NetworkStatistics.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.NetworkStatistics)
                return object;
            var message = new $root.smartcamera.NetworkStatistics();
            if (object.timestampUnix != null)
                if ($util.Long)
                    (message.timestampUnix = $util.Long.fromValue(object.timestampUnix)).unsigned = true;
                else if (typeof object.timestampUnix === "string")
                    message.timestampUnix = parseInt(object.timestampUnix, 10);
                else if (typeof object.timestampUnix === "number")
                    message.timestampUnix = object.timestampUnix;
                else if (typeof object.timestampUnix === "object")
                    message.timestampUnix = new $util.LongBits(object.timestampUnix.low >>> 0, object.timestampUnix.high >>> 0).toNumber(true);
            if (object.pingMillis != null)
                message.pingMillis = Number(object.pingMillis);
            return message;
        };

        /**
         * Creates a plain object from a NetworkStatistics message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.NetworkStatistics
         * @static
         * @param {smartcamera.NetworkStatistics} message NetworkStatistics
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NetworkStatistics.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestampUnix = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestampUnix = options.longs === String ? "0" : 0;
                object.pingMillis = 0;
            }
            if (message.timestampUnix != null && message.hasOwnProperty("timestampUnix"))
                if (typeof message.timestampUnix === "number")
                    object.timestampUnix = options.longs === String ? String(message.timestampUnix) : message.timestampUnix;
                else
                    object.timestampUnix = options.longs === String ? $util.Long.prototype.toString.call(message.timestampUnix) : options.longs === Number ? new $util.LongBits(message.timestampUnix.low >>> 0, message.timestampUnix.high >>> 0).toNumber(true) : message.timestampUnix;
            if (message.pingMillis != null && message.hasOwnProperty("pingMillis"))
                object.pingMillis = options.json && !isFinite(message.pingMillis) ? String(message.pingMillis) : message.pingMillis;
            return object;
        };

        /**
         * Converts this NetworkStatistics to JSON.
         * @function toJSON
         * @memberof smartcamera.NetworkStatistics
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NetworkStatistics.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for NetworkStatistics
         * @function getTypeUrl
         * @memberof smartcamera.NetworkStatistics
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        NetworkStatistics.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.NetworkStatistics";
        };

        return NetworkStatistics;
    })();

    smartcamera.AlertCameraOffline = (function() {

        /**
         * Properties of an AlertCameraOffline.
         * @memberof smartcamera
         * @interface IAlertCameraOffline
         * @property {Array.<string>|null} [sensorCode] AlertCameraOffline sensorCode
         */

        /**
         * Constructs a new AlertCameraOffline.
         * @memberof smartcamera
         * @classdesc Represents an AlertCameraOffline.
         * @implements IAlertCameraOffline
         * @constructor
         * @param {smartcamera.IAlertCameraOffline=} [properties] Properties to set
         */
        function AlertCameraOffline(properties) {
            this.sensorCode = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AlertCameraOffline sensorCode.
         * @member {Array.<string>} sensorCode
         * @memberof smartcamera.AlertCameraOffline
         * @instance
         */
        AlertCameraOffline.prototype.sensorCode = $util.emptyArray;

        /**
         * Creates a new AlertCameraOffline instance using the specified properties.
         * @function create
         * @memberof smartcamera.AlertCameraOffline
         * @static
         * @param {smartcamera.IAlertCameraOffline=} [properties] Properties to set
         * @returns {smartcamera.AlertCameraOffline} AlertCameraOffline instance
         */
        AlertCameraOffline.create = function create(properties) {
            return new AlertCameraOffline(properties);
        };

        /**
         * Encodes the specified AlertCameraOffline message. Does not implicitly {@link smartcamera.AlertCameraOffline.verify|verify} messages.
         * @function encode
         * @memberof smartcamera.AlertCameraOffline
         * @static
         * @param {smartcamera.IAlertCameraOffline} message AlertCameraOffline message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AlertCameraOffline.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sensorCode != null && message.sensorCode.length)
                for (var i = 0; i < message.sensorCode.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.sensorCode[i]);
            return writer;
        };

        /**
         * Encodes the specified AlertCameraOffline message, length delimited. Does not implicitly {@link smartcamera.AlertCameraOffline.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcamera.AlertCameraOffline
         * @static
         * @param {smartcamera.IAlertCameraOffline} message AlertCameraOffline message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AlertCameraOffline.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AlertCameraOffline message from the specified reader or buffer.
         * @function decode
         * @memberof smartcamera.AlertCameraOffline
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcamera.AlertCameraOffline} AlertCameraOffline
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AlertCameraOffline.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcamera.AlertCameraOffline();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.sensorCode && message.sensorCode.length))
                            message.sensorCode = [];
                        message.sensorCode.push(reader.string());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AlertCameraOffline message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcamera.AlertCameraOffline
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcamera.AlertCameraOffline} AlertCameraOffline
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AlertCameraOffline.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AlertCameraOffline message.
         * @function verify
         * @memberof smartcamera.AlertCameraOffline
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AlertCameraOffline.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sensorCode != null && message.hasOwnProperty("sensorCode")) {
                if (!Array.isArray(message.sensorCode))
                    return "sensorCode: array expected";
                for (var i = 0; i < message.sensorCode.length; ++i)
                    if (!$util.isString(message.sensorCode[i]))
                        return "sensorCode: string[] expected";
            }
            return null;
        };

        /**
         * Creates an AlertCameraOffline message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcamera.AlertCameraOffline
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcamera.AlertCameraOffline} AlertCameraOffline
         */
        AlertCameraOffline.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcamera.AlertCameraOffline)
                return object;
            var message = new $root.smartcamera.AlertCameraOffline();
            if (object.sensorCode) {
                if (!Array.isArray(object.sensorCode))
                    throw TypeError(".smartcamera.AlertCameraOffline.sensorCode: array expected");
                message.sensorCode = [];
                for (var i = 0; i < object.sensorCode.length; ++i)
                    message.sensorCode[i] = String(object.sensorCode[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from an AlertCameraOffline message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcamera.AlertCameraOffline
         * @static
         * @param {smartcamera.AlertCameraOffline} message AlertCameraOffline
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AlertCameraOffline.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.sensorCode = [];
            if (message.sensorCode && message.sensorCode.length) {
                object.sensorCode = [];
                for (var j = 0; j < message.sensorCode.length; ++j)
                    object.sensorCode[j] = message.sensorCode[j];
            }
            return object;
        };

        /**
         * Converts this AlertCameraOffline to JSON.
         * @function toJSON
         * @memberof smartcamera.AlertCameraOffline
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AlertCameraOffline.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AlertCameraOffline
         * @function getTypeUrl
         * @memberof smartcamera.AlertCameraOffline
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AlertCameraOffline.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcamera.AlertCameraOffline";
        };

        return AlertCameraOffline;
    })();

    return smartcamera;
})();

$root.smartcontroller = (function() {

    /**
     * Namespace smartcontroller.
     * @exports smartcontroller
     * @namespace
     */
    var smartcontroller = {};

    smartcontroller.ControllerContent = (function() {

        /**
         * Properties of a ControllerContent.
         * @memberof smartcontroller
         * @interface IControllerContent
         * @property {Uint8Array|null} [meta] ControllerContent meta
         * @property {commoniot.IInfoDevice|null} [infoDevice] ControllerContent infoDevice
         * @property {commoniot.IInfoFarm|null} [infoFarm] ControllerContent infoFarm
         * @property {commoniot.IStartCycle|null} [startCycle] ControllerContent startCycle
         * @property {commoniot.IStopCycle|null} [stopCycle] ControllerContent stopCycle
         * @property {commoniot.IReset|null} [reset] ControllerContent reset
         * @property {commoniot.IPing|null} [ping] ControllerContent ping
         * @property {commoniot.IOta|null} [ota] ControllerContent ota
         * @property {commoniot.IMapDevice|null} [mapDevice] ControllerContent mapDevice
         * @property {commoniot.IReportSetting|null} [reportSetting] ControllerContent reportSetting
         * @property {smartcontroller.IControllerData|null} [controllerData] ControllerContent controllerData
         * @property {smartcontroller.IControllerStatus|null} [controllerStatus] ControllerContent controllerStatus
         * @property {smartcontroller.IControllerSetting|null} [controllerSetting] ControllerContent controllerSetting
         * @property {smartcontroller.IControllerLocalComm|null} [controllerLocalComm] ControllerContent controllerLocalComm
         * @property {commoniot.IError|null} [error] ControllerContent error
         */

        /**
         * Constructs a new ControllerContent.
         * @memberof smartcontroller
         * @classdesc Represents a ControllerContent.
         * @implements IControllerContent
         * @constructor
         * @param {smartcontroller.IControllerContent=} [properties] Properties to set
         */
        function ControllerContent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ControllerContent meta.
         * @member {Uint8Array} meta
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.meta = $util.newBuffer([]);

        /**
         * ControllerContent infoDevice.
         * @member {commoniot.IInfoDevice|null|undefined} infoDevice
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.infoDevice = null;

        /**
         * ControllerContent infoFarm.
         * @member {commoniot.IInfoFarm|null|undefined} infoFarm
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.infoFarm = null;

        /**
         * ControllerContent startCycle.
         * @member {commoniot.IStartCycle|null|undefined} startCycle
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.startCycle = null;

        /**
         * ControllerContent stopCycle.
         * @member {commoniot.IStopCycle|null|undefined} stopCycle
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.stopCycle = null;

        /**
         * ControllerContent reset.
         * @member {commoniot.IReset|null|undefined} reset
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.reset = null;

        /**
         * ControllerContent ping.
         * @member {commoniot.IPing|null|undefined} ping
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.ping = null;

        /**
         * ControllerContent ota.
         * @member {commoniot.IOta|null|undefined} ota
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.ota = null;

        /**
         * ControllerContent mapDevice.
         * @member {commoniot.IMapDevice|null|undefined} mapDevice
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.mapDevice = null;

        /**
         * ControllerContent reportSetting.
         * @member {commoniot.IReportSetting|null|undefined} reportSetting
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.reportSetting = null;

        /**
         * ControllerContent controllerData.
         * @member {smartcontroller.IControllerData|null|undefined} controllerData
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.controllerData = null;

        /**
         * ControllerContent controllerStatus.
         * @member {smartcontroller.IControllerStatus|null|undefined} controllerStatus
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.controllerStatus = null;

        /**
         * ControllerContent controllerSetting.
         * @member {smartcontroller.IControllerSetting|null|undefined} controllerSetting
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.controllerSetting = null;

        /**
         * ControllerContent controllerLocalComm.
         * @member {smartcontroller.IControllerLocalComm|null|undefined} controllerLocalComm
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.controllerLocalComm = null;

        /**
         * ControllerContent error.
         * @member {commoniot.IError|null|undefined} error
         * @memberof smartcontroller.ControllerContent
         * @instance
         */
        ControllerContent.prototype.error = null;

        /**
         * Creates a new ControllerContent instance using the specified properties.
         * @function create
         * @memberof smartcontroller.ControllerContent
         * @static
         * @param {smartcontroller.IControllerContent=} [properties] Properties to set
         * @returns {smartcontroller.ControllerContent} ControllerContent instance
         */
        ControllerContent.create = function create(properties) {
            return new ControllerContent(properties);
        };

        /**
         * Encodes the specified ControllerContent message. Does not implicitly {@link smartcontroller.ControllerContent.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.ControllerContent
         * @static
         * @param {smartcontroller.IControllerContent} message ControllerContent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ControllerContent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.meta);
            if (message.infoDevice != null && Object.hasOwnProperty.call(message, "infoDevice"))
                $root.commoniot.InfoDevice.encode(message.infoDevice, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.infoFarm != null && Object.hasOwnProperty.call(message, "infoFarm"))
                $root.commoniot.InfoFarm.encode(message.infoFarm, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.startCycle != null && Object.hasOwnProperty.call(message, "startCycle"))
                $root.commoniot.StartCycle.encode(message.startCycle, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.stopCycle != null && Object.hasOwnProperty.call(message, "stopCycle"))
                $root.commoniot.StopCycle.encode(message.stopCycle, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.reset != null && Object.hasOwnProperty.call(message, "reset"))
                $root.commoniot.Reset.encode(message.reset, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.ping != null && Object.hasOwnProperty.call(message, "ping"))
                $root.commoniot.Ping.encode(message.ping, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.ota != null && Object.hasOwnProperty.call(message, "ota"))
                $root.commoniot.Ota.encode(message.ota, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.mapDevice != null && Object.hasOwnProperty.call(message, "mapDevice"))
                $root.commoniot.MapDevice.encode(message.mapDevice, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.reportSetting != null && Object.hasOwnProperty.call(message, "reportSetting"))
                $root.commoniot.ReportSetting.encode(message.reportSetting, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.controllerData != null && Object.hasOwnProperty.call(message, "controllerData"))
                $root.smartcontroller.ControllerData.encode(message.controllerData, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.controllerStatus != null && Object.hasOwnProperty.call(message, "controllerStatus"))
                $root.smartcontroller.ControllerStatus.encode(message.controllerStatus, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.controllerSetting != null && Object.hasOwnProperty.call(message, "controllerSetting"))
                $root.smartcontroller.ControllerSetting.encode(message.controllerSetting, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.controllerLocalComm != null && Object.hasOwnProperty.call(message, "controllerLocalComm"))
                $root.smartcontroller.ControllerLocalComm.encode(message.controllerLocalComm, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                $root.commoniot.Error.encode(message.error, writer.uint32(/* id 50, wireType 2 =*/402).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ControllerContent message, length delimited. Does not implicitly {@link smartcontroller.ControllerContent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.ControllerContent
         * @static
         * @param {smartcontroller.IControllerContent} message ControllerContent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ControllerContent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ControllerContent message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.ControllerContent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.ControllerContent} ControllerContent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ControllerContent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.ControllerContent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.meta = reader.bytes();
                        break;
                    }
                case 2: {
                        message.infoDevice = $root.commoniot.InfoDevice.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.infoFarm = $root.commoniot.InfoFarm.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.startCycle = $root.commoniot.StartCycle.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.stopCycle = $root.commoniot.StopCycle.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.reset = $root.commoniot.Reset.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.ping = $root.commoniot.Ping.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.ota = $root.commoniot.Ota.decode(reader, reader.uint32());
                        break;
                    }
                case 10: {
                        message.mapDevice = $root.commoniot.MapDevice.decode(reader, reader.uint32());
                        break;
                    }
                case 11: {
                        message.reportSetting = $root.commoniot.ReportSetting.decode(reader, reader.uint32());
                        break;
                    }
                case 12: {
                        message.controllerData = $root.smartcontroller.ControllerData.decode(reader, reader.uint32());
                        break;
                    }
                case 13: {
                        message.controllerStatus = $root.smartcontroller.ControllerStatus.decode(reader, reader.uint32());
                        break;
                    }
                case 14: {
                        message.controllerSetting = $root.smartcontroller.ControllerSetting.decode(reader, reader.uint32());
                        break;
                    }
                case 15: {
                        message.controllerLocalComm = $root.smartcontroller.ControllerLocalComm.decode(reader, reader.uint32());
                        break;
                    }
                case 50: {
                        message.error = $root.commoniot.Error.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ControllerContent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.ControllerContent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.ControllerContent} ControllerContent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ControllerContent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ControllerContent message.
         * @function verify
         * @memberof smartcontroller.ControllerContent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ControllerContent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.meta != null && message.hasOwnProperty("meta"))
                if (!(message.meta && typeof message.meta.length === "number" || $util.isString(message.meta)))
                    return "meta: buffer expected";
            if (message.infoDevice != null && message.hasOwnProperty("infoDevice")) {
                var error = $root.commoniot.InfoDevice.verify(message.infoDevice);
                if (error)
                    return "infoDevice." + error;
            }
            if (message.infoFarm != null && message.hasOwnProperty("infoFarm")) {
                var error = $root.commoniot.InfoFarm.verify(message.infoFarm);
                if (error)
                    return "infoFarm." + error;
            }
            if (message.startCycle != null && message.hasOwnProperty("startCycle")) {
                var error = $root.commoniot.StartCycle.verify(message.startCycle);
                if (error)
                    return "startCycle." + error;
            }
            if (message.stopCycle != null && message.hasOwnProperty("stopCycle")) {
                var error = $root.commoniot.StopCycle.verify(message.stopCycle);
                if (error)
                    return "stopCycle." + error;
            }
            if (message.reset != null && message.hasOwnProperty("reset")) {
                var error = $root.commoniot.Reset.verify(message.reset);
                if (error)
                    return "reset." + error;
            }
            if (message.ping != null && message.hasOwnProperty("ping")) {
                var error = $root.commoniot.Ping.verify(message.ping);
                if (error)
                    return "ping." + error;
            }
            if (message.ota != null && message.hasOwnProperty("ota")) {
                var error = $root.commoniot.Ota.verify(message.ota);
                if (error)
                    return "ota." + error;
            }
            if (message.mapDevice != null && message.hasOwnProperty("mapDevice")) {
                var error = $root.commoniot.MapDevice.verify(message.mapDevice);
                if (error)
                    return "mapDevice." + error;
            }
            if (message.reportSetting != null && message.hasOwnProperty("reportSetting")) {
                var error = $root.commoniot.ReportSetting.verify(message.reportSetting);
                if (error)
                    return "reportSetting." + error;
            }
            if (message.controllerData != null && message.hasOwnProperty("controllerData")) {
                var error = $root.smartcontroller.ControllerData.verify(message.controllerData);
                if (error)
                    return "controllerData." + error;
            }
            if (message.controllerStatus != null && message.hasOwnProperty("controllerStatus")) {
                var error = $root.smartcontroller.ControllerStatus.verify(message.controllerStatus);
                if (error)
                    return "controllerStatus." + error;
            }
            if (message.controllerSetting != null && message.hasOwnProperty("controllerSetting")) {
                var error = $root.smartcontroller.ControllerSetting.verify(message.controllerSetting);
                if (error)
                    return "controllerSetting." + error;
            }
            if (message.controllerLocalComm != null && message.hasOwnProperty("controllerLocalComm")) {
                var error = $root.smartcontroller.ControllerLocalComm.verify(message.controllerLocalComm);
                if (error)
                    return "controllerLocalComm." + error;
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                var error = $root.commoniot.Error.verify(message.error);
                if (error)
                    return "error." + error;
            }
            return null;
        };

        /**
         * Creates a ControllerContent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.ControllerContent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.ControllerContent} ControllerContent
         */
        ControllerContent.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.ControllerContent)
                return object;
            var message = new $root.smartcontroller.ControllerContent();
            if (object.meta != null)
                if (typeof object.meta === "string")
                    $util.base64.decode(object.meta, message.meta = $util.newBuffer($util.base64.length(object.meta)), 0);
                else if (object.meta.length >= 0)
                    message.meta = object.meta;
            if (object.infoDevice != null) {
                if (typeof object.infoDevice !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.infoDevice: object expected");
                message.infoDevice = $root.commoniot.InfoDevice.fromObject(object.infoDevice);
            }
            if (object.infoFarm != null) {
                if (typeof object.infoFarm !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.infoFarm: object expected");
                message.infoFarm = $root.commoniot.InfoFarm.fromObject(object.infoFarm);
            }
            if (object.startCycle != null) {
                if (typeof object.startCycle !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.startCycle: object expected");
                message.startCycle = $root.commoniot.StartCycle.fromObject(object.startCycle);
            }
            if (object.stopCycle != null) {
                if (typeof object.stopCycle !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.stopCycle: object expected");
                message.stopCycle = $root.commoniot.StopCycle.fromObject(object.stopCycle);
            }
            if (object.reset != null) {
                if (typeof object.reset !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.reset: object expected");
                message.reset = $root.commoniot.Reset.fromObject(object.reset);
            }
            if (object.ping != null) {
                if (typeof object.ping !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.ping: object expected");
                message.ping = $root.commoniot.Ping.fromObject(object.ping);
            }
            if (object.ota != null) {
                if (typeof object.ota !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.ota: object expected");
                message.ota = $root.commoniot.Ota.fromObject(object.ota);
            }
            if (object.mapDevice != null) {
                if (typeof object.mapDevice !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.mapDevice: object expected");
                message.mapDevice = $root.commoniot.MapDevice.fromObject(object.mapDevice);
            }
            if (object.reportSetting != null) {
                if (typeof object.reportSetting !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.reportSetting: object expected");
                message.reportSetting = $root.commoniot.ReportSetting.fromObject(object.reportSetting);
            }
            if (object.controllerData != null) {
                if (typeof object.controllerData !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.controllerData: object expected");
                message.controllerData = $root.smartcontroller.ControllerData.fromObject(object.controllerData);
            }
            if (object.controllerStatus != null) {
                if (typeof object.controllerStatus !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.controllerStatus: object expected");
                message.controllerStatus = $root.smartcontroller.ControllerStatus.fromObject(object.controllerStatus);
            }
            if (object.controllerSetting != null) {
                if (typeof object.controllerSetting !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.controllerSetting: object expected");
                message.controllerSetting = $root.smartcontroller.ControllerSetting.fromObject(object.controllerSetting);
            }
            if (object.controllerLocalComm != null) {
                if (typeof object.controllerLocalComm !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.controllerLocalComm: object expected");
                message.controllerLocalComm = $root.smartcontroller.ControllerLocalComm.fromObject(object.controllerLocalComm);
            }
            if (object.error != null) {
                if (typeof object.error !== "object")
                    throw TypeError(".smartcontroller.ControllerContent.error: object expected");
                message.error = $root.commoniot.Error.fromObject(object.error);
            }
            return message;
        };

        /**
         * Creates a plain object from a ControllerContent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.ControllerContent
         * @static
         * @param {smartcontroller.ControllerContent} message ControllerContent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ControllerContent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.meta = "";
                else {
                    object.meta = [];
                    if (options.bytes !== Array)
                        object.meta = $util.newBuffer(object.meta);
                }
                object.infoDevice = null;
                object.infoFarm = null;
                object.startCycle = null;
                object.stopCycle = null;
                object.reset = null;
                object.ping = null;
                object.ota = null;
                object.mapDevice = null;
                object.reportSetting = null;
                object.controllerData = null;
                object.controllerStatus = null;
                object.controllerSetting = null;
                object.controllerLocalComm = null;
                object.error = null;
            }
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = options.bytes === String ? $util.base64.encode(message.meta, 0, message.meta.length) : options.bytes === Array ? Array.prototype.slice.call(message.meta) : message.meta;
            if (message.infoDevice != null && message.hasOwnProperty("infoDevice"))
                object.infoDevice = $root.commoniot.InfoDevice.toObject(message.infoDevice, options);
            if (message.infoFarm != null && message.hasOwnProperty("infoFarm"))
                object.infoFarm = $root.commoniot.InfoFarm.toObject(message.infoFarm, options);
            if (message.startCycle != null && message.hasOwnProperty("startCycle"))
                object.startCycle = $root.commoniot.StartCycle.toObject(message.startCycle, options);
            if (message.stopCycle != null && message.hasOwnProperty("stopCycle"))
                object.stopCycle = $root.commoniot.StopCycle.toObject(message.stopCycle, options);
            if (message.reset != null && message.hasOwnProperty("reset"))
                object.reset = $root.commoniot.Reset.toObject(message.reset, options);
            if (message.ping != null && message.hasOwnProperty("ping"))
                object.ping = $root.commoniot.Ping.toObject(message.ping, options);
            if (message.ota != null && message.hasOwnProperty("ota"))
                object.ota = $root.commoniot.Ota.toObject(message.ota, options);
            if (message.mapDevice != null && message.hasOwnProperty("mapDevice"))
                object.mapDevice = $root.commoniot.MapDevice.toObject(message.mapDevice, options);
            if (message.reportSetting != null && message.hasOwnProperty("reportSetting"))
                object.reportSetting = $root.commoniot.ReportSetting.toObject(message.reportSetting, options);
            if (message.controllerData != null && message.hasOwnProperty("controllerData"))
                object.controllerData = $root.smartcontroller.ControllerData.toObject(message.controllerData, options);
            if (message.controllerStatus != null && message.hasOwnProperty("controllerStatus"))
                object.controllerStatus = $root.smartcontroller.ControllerStatus.toObject(message.controllerStatus, options);
            if (message.controllerSetting != null && message.hasOwnProperty("controllerSetting"))
                object.controllerSetting = $root.smartcontroller.ControllerSetting.toObject(message.controllerSetting, options);
            if (message.controllerLocalComm != null && message.hasOwnProperty("controllerLocalComm"))
                object.controllerLocalComm = $root.smartcontroller.ControllerLocalComm.toObject(message.controllerLocalComm, options);
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = $root.commoniot.Error.toObject(message.error, options);
            return object;
        };

        /**
         * Converts this ControllerContent to JSON.
         * @function toJSON
         * @memberof smartcontroller.ControllerContent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ControllerContent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ControllerContent
         * @function getTypeUrl
         * @memberof smartcontroller.ControllerContent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ControllerContent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.ControllerContent";
        };

        return ControllerContent;
    })();

    smartcontroller.ControllerData = (function() {

        /**
         * Properties of a ControllerData.
         * @memberof smartcontroller
         * @interface IControllerData
         * @property {Array.<commoniot.ISignal>|null} [fan] ControllerData fan
         * @property {commoniot.ISignal|null} [heater] ControllerData heater
         * @property {commoniot.ISignal|null} [cooler] ControllerData cooler
         * @property {commoniot.ISignal|null} [lamp] ControllerData lamp
         * @property {commoniot.ISignal|null} [alarm] ControllerData alarm
         * @property {Array.<commoniot.ISignal>|null} [intermit] ControllerData intermit
         * @property {Array.<number>|null} [temp] ControllerData temp
         * @property {Array.<number>|null} [humi] ControllerData humi
         * @property {number|null} [rssi] ControllerData rssi
         * @property {number|null} [extTemp] ControllerData extTemp
         * @property {number|null} [extHumi] ControllerData extHumi
         */

        /**
         * Constructs a new ControllerData.
         * @memberof smartcontroller
         * @classdesc Represents a ControllerData.
         * @implements IControllerData
         * @constructor
         * @param {smartcontroller.IControllerData=} [properties] Properties to set
         */
        function ControllerData(properties) {
            this.fan = [];
            this.intermit = [];
            this.temp = [];
            this.humi = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ControllerData fan.
         * @member {Array.<commoniot.ISignal>} fan
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.fan = $util.emptyArray;

        /**
         * ControllerData heater.
         * @member {commoniot.ISignal|null|undefined} heater
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.heater = null;

        /**
         * ControllerData cooler.
         * @member {commoniot.ISignal|null|undefined} cooler
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.cooler = null;

        /**
         * ControllerData lamp.
         * @member {commoniot.ISignal|null|undefined} lamp
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.lamp = null;

        /**
         * ControllerData alarm.
         * @member {commoniot.ISignal|null|undefined} alarm
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.alarm = null;

        /**
         * ControllerData intermit.
         * @member {Array.<commoniot.ISignal>} intermit
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.intermit = $util.emptyArray;

        /**
         * ControllerData temp.
         * @member {Array.<number>} temp
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.temp = $util.emptyArray;

        /**
         * ControllerData humi.
         * @member {Array.<number>} humi
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.humi = $util.emptyArray;

        /**
         * ControllerData rssi.
         * @member {number} rssi
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.rssi = 0;

        /**
         * ControllerData extTemp.
         * @member {number} extTemp
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.extTemp = 0;

        /**
         * ControllerData extHumi.
         * @member {number} extHumi
         * @memberof smartcontroller.ControllerData
         * @instance
         */
        ControllerData.prototype.extHumi = 0;

        /**
         * Creates a new ControllerData instance using the specified properties.
         * @function create
         * @memberof smartcontroller.ControllerData
         * @static
         * @param {smartcontroller.IControllerData=} [properties] Properties to set
         * @returns {smartcontroller.ControllerData} ControllerData instance
         */
        ControllerData.create = function create(properties) {
            return new ControllerData(properties);
        };

        /**
         * Encodes the specified ControllerData message. Does not implicitly {@link smartcontroller.ControllerData.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.ControllerData
         * @static
         * @param {smartcontroller.IControllerData} message ControllerData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ControllerData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fan != null && message.fan.length)
                for (var i = 0; i < message.fan.length; ++i)
                    $root.commoniot.Signal.encode(message.fan[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.heater != null && Object.hasOwnProperty.call(message, "heater"))
                $root.commoniot.Signal.encode(message.heater, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.cooler != null && Object.hasOwnProperty.call(message, "cooler"))
                $root.commoniot.Signal.encode(message.cooler, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.lamp != null && Object.hasOwnProperty.call(message, "lamp"))
                $root.commoniot.Signal.encode(message.lamp, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.alarm != null && Object.hasOwnProperty.call(message, "alarm"))
                $root.commoniot.Signal.encode(message.alarm, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.intermit != null && message.intermit.length)
                for (var i = 0; i < message.intermit.length; ++i)
                    $root.commoniot.Signal.encode(message.intermit[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.temp != null && message.temp.length) {
                writer.uint32(/* id 7, wireType 2 =*/58).fork();
                for (var i = 0; i < message.temp.length; ++i)
                    writer.uint32(message.temp[i]);
                writer.ldelim();
            }
            if (message.humi != null && message.humi.length) {
                writer.uint32(/* id 8, wireType 2 =*/66).fork();
                for (var i = 0; i < message.humi.length; ++i)
                    writer.uint32(message.humi[i]);
                writer.ldelim();
            }
            if (message.rssi != null && Object.hasOwnProperty.call(message, "rssi"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.rssi);
            if (message.extTemp != null && Object.hasOwnProperty.call(message, "extTemp"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.extTemp);
            if (message.extHumi != null && Object.hasOwnProperty.call(message, "extHumi"))
                writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.extHumi);
            return writer;
        };

        /**
         * Encodes the specified ControllerData message, length delimited. Does not implicitly {@link smartcontroller.ControllerData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.ControllerData
         * @static
         * @param {smartcontroller.IControllerData} message ControllerData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ControllerData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ControllerData message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.ControllerData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.ControllerData} ControllerData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ControllerData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.ControllerData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.fan && message.fan.length))
                            message.fan = [];
                        message.fan.push($root.commoniot.Signal.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.heater = $root.commoniot.Signal.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.cooler = $root.commoniot.Signal.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.lamp = $root.commoniot.Signal.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.alarm = $root.commoniot.Signal.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        if (!(message.intermit && message.intermit.length))
                            message.intermit = [];
                        message.intermit.push($root.commoniot.Signal.decode(reader, reader.uint32()));
                        break;
                    }
                case 7: {
                        if (!(message.temp && message.temp.length))
                            message.temp = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.temp.push(reader.uint32());
                        } else
                            message.temp.push(reader.uint32());
                        break;
                    }
                case 8: {
                        if (!(message.humi && message.humi.length))
                            message.humi = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.humi.push(reader.uint32());
                        } else
                            message.humi.push(reader.uint32());
                        break;
                    }
                case 9: {
                        message.rssi = reader.int32();
                        break;
                    }
                case 10: {
                        message.extTemp = reader.uint32();
                        break;
                    }
                case 11: {
                        message.extHumi = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ControllerData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.ControllerData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.ControllerData} ControllerData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ControllerData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ControllerData message.
         * @function verify
         * @memberof smartcontroller.ControllerData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ControllerData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.fan != null && message.hasOwnProperty("fan")) {
                if (!Array.isArray(message.fan))
                    return "fan: array expected";
                for (var i = 0; i < message.fan.length; ++i) {
                    var error = $root.commoniot.Signal.verify(message.fan[i]);
                    if (error)
                        return "fan." + error;
                }
            }
            if (message.heater != null && message.hasOwnProperty("heater")) {
                var error = $root.commoniot.Signal.verify(message.heater);
                if (error)
                    return "heater." + error;
            }
            if (message.cooler != null && message.hasOwnProperty("cooler")) {
                var error = $root.commoniot.Signal.verify(message.cooler);
                if (error)
                    return "cooler." + error;
            }
            if (message.lamp != null && message.hasOwnProperty("lamp")) {
                var error = $root.commoniot.Signal.verify(message.lamp);
                if (error)
                    return "lamp." + error;
            }
            if (message.alarm != null && message.hasOwnProperty("alarm")) {
                var error = $root.commoniot.Signal.verify(message.alarm);
                if (error)
                    return "alarm." + error;
            }
            if (message.intermit != null && message.hasOwnProperty("intermit")) {
                if (!Array.isArray(message.intermit))
                    return "intermit: array expected";
                for (var i = 0; i < message.intermit.length; ++i) {
                    var error = $root.commoniot.Signal.verify(message.intermit[i]);
                    if (error)
                        return "intermit." + error;
                }
            }
            if (message.temp != null && message.hasOwnProperty("temp")) {
                if (!Array.isArray(message.temp))
                    return "temp: array expected";
                for (var i = 0; i < message.temp.length; ++i)
                    if (!$util.isInteger(message.temp[i]))
                        return "temp: integer[] expected";
            }
            if (message.humi != null && message.hasOwnProperty("humi")) {
                if (!Array.isArray(message.humi))
                    return "humi: array expected";
                for (var i = 0; i < message.humi.length; ++i)
                    if (!$util.isInteger(message.humi[i]))
                        return "humi: integer[] expected";
            }
            if (message.rssi != null && message.hasOwnProperty("rssi"))
                if (!$util.isInteger(message.rssi))
                    return "rssi: integer expected";
            if (message.extTemp != null && message.hasOwnProperty("extTemp"))
                if (!$util.isInteger(message.extTemp))
                    return "extTemp: integer expected";
            if (message.extHumi != null && message.hasOwnProperty("extHumi"))
                if (!$util.isInteger(message.extHumi))
                    return "extHumi: integer expected";
            return null;
        };

        /**
         * Creates a ControllerData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.ControllerData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.ControllerData} ControllerData
         */
        ControllerData.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.ControllerData)
                return object;
            var message = new $root.smartcontroller.ControllerData();
            if (object.fan) {
                if (!Array.isArray(object.fan))
                    throw TypeError(".smartcontroller.ControllerData.fan: array expected");
                message.fan = [];
                for (var i = 0; i < object.fan.length; ++i) {
                    if (typeof object.fan[i] !== "object")
                        throw TypeError(".smartcontroller.ControllerData.fan: object expected");
                    message.fan[i] = $root.commoniot.Signal.fromObject(object.fan[i]);
                }
            }
            if (object.heater != null) {
                if (typeof object.heater !== "object")
                    throw TypeError(".smartcontroller.ControllerData.heater: object expected");
                message.heater = $root.commoniot.Signal.fromObject(object.heater);
            }
            if (object.cooler != null) {
                if (typeof object.cooler !== "object")
                    throw TypeError(".smartcontroller.ControllerData.cooler: object expected");
                message.cooler = $root.commoniot.Signal.fromObject(object.cooler);
            }
            if (object.lamp != null) {
                if (typeof object.lamp !== "object")
                    throw TypeError(".smartcontroller.ControllerData.lamp: object expected");
                message.lamp = $root.commoniot.Signal.fromObject(object.lamp);
            }
            if (object.alarm != null) {
                if (typeof object.alarm !== "object")
                    throw TypeError(".smartcontroller.ControllerData.alarm: object expected");
                message.alarm = $root.commoniot.Signal.fromObject(object.alarm);
            }
            if (object.intermit) {
                if (!Array.isArray(object.intermit))
                    throw TypeError(".smartcontroller.ControllerData.intermit: array expected");
                message.intermit = [];
                for (var i = 0; i < object.intermit.length; ++i) {
                    if (typeof object.intermit[i] !== "object")
                        throw TypeError(".smartcontroller.ControllerData.intermit: object expected");
                    message.intermit[i] = $root.commoniot.Signal.fromObject(object.intermit[i]);
                }
            }
            if (object.temp) {
                if (!Array.isArray(object.temp))
                    throw TypeError(".smartcontroller.ControllerData.temp: array expected");
                message.temp = [];
                for (var i = 0; i < object.temp.length; ++i)
                    message.temp[i] = object.temp[i] >>> 0;
            }
            if (object.humi) {
                if (!Array.isArray(object.humi))
                    throw TypeError(".smartcontroller.ControllerData.humi: array expected");
                message.humi = [];
                for (var i = 0; i < object.humi.length; ++i)
                    message.humi[i] = object.humi[i] >>> 0;
            }
            if (object.rssi != null)
                message.rssi = object.rssi | 0;
            if (object.extTemp != null)
                message.extTemp = object.extTemp >>> 0;
            if (object.extHumi != null)
                message.extHumi = object.extHumi >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a ControllerData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.ControllerData
         * @static
         * @param {smartcontroller.ControllerData} message ControllerData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ControllerData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.fan = [];
                object.intermit = [];
                object.temp = [];
                object.humi = [];
            }
            if (options.defaults) {
                object.heater = null;
                object.cooler = null;
                object.lamp = null;
                object.alarm = null;
                object.rssi = 0;
                object.extTemp = 0;
                object.extHumi = 0;
            }
            if (message.fan && message.fan.length) {
                object.fan = [];
                for (var j = 0; j < message.fan.length; ++j)
                    object.fan[j] = $root.commoniot.Signal.toObject(message.fan[j], options);
            }
            if (message.heater != null && message.hasOwnProperty("heater"))
                object.heater = $root.commoniot.Signal.toObject(message.heater, options);
            if (message.cooler != null && message.hasOwnProperty("cooler"))
                object.cooler = $root.commoniot.Signal.toObject(message.cooler, options);
            if (message.lamp != null && message.hasOwnProperty("lamp"))
                object.lamp = $root.commoniot.Signal.toObject(message.lamp, options);
            if (message.alarm != null && message.hasOwnProperty("alarm"))
                object.alarm = $root.commoniot.Signal.toObject(message.alarm, options);
            if (message.intermit && message.intermit.length) {
                object.intermit = [];
                for (var j = 0; j < message.intermit.length; ++j)
                    object.intermit[j] = $root.commoniot.Signal.toObject(message.intermit[j], options);
            }
            if (message.temp && message.temp.length) {
                object.temp = [];
                for (var j = 0; j < message.temp.length; ++j)
                    object.temp[j] = message.temp[j];
            }
            if (message.humi && message.humi.length) {
                object.humi = [];
                for (var j = 0; j < message.humi.length; ++j)
                    object.humi[j] = message.humi[j];
            }
            if (message.rssi != null && message.hasOwnProperty("rssi"))
                object.rssi = message.rssi;
            if (message.extTemp != null && message.hasOwnProperty("extTemp"))
                object.extTemp = message.extTemp;
            if (message.extHumi != null && message.hasOwnProperty("extHumi"))
                object.extHumi = message.extHumi;
            return object;
        };

        /**
         * Converts this ControllerData to JSON.
         * @function toJSON
         * @memberof smartcontroller.ControllerData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ControllerData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ControllerData
         * @function getTypeUrl
         * @memberof smartcontroller.ControllerData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ControllerData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.ControllerData";
        };

        return ControllerData;
    })();

    smartcontroller.ControllerStatus = (function() {

        /**
         * Properties of a ControllerStatus.
         * @memberof smartcontroller
         * @interface IControllerStatus
         * @property {number|null} [rtc] ControllerStatus rtc
         * @property {number|null} [relay] ControllerStatus relay
         * @property {number|null} [modbus] ControllerStatus modbus
         * @property {number|null} [sdcard] ControllerStatus sdcard
         * @property {number|null} [eeprom] ControllerStatus eeprom
         * @property {number|null} [stm32] ControllerStatus stm32
         * @property {number|null} [hot] ControllerStatus hot
         * @property {number|null} [cold] ControllerStatus cold
         * @property {number|null} [undervolt] ControllerStatus undervolt
         * @property {Array.<smartcontroller.IErrorSht20>|null} [errorSht20] ControllerStatus errorSht20
         * @property {smartcontroller.IButton|null} [button] ControllerStatus button
         * @property {number|null} [priority] ControllerStatus priority
         */

        /**
         * Constructs a new ControllerStatus.
         * @memberof smartcontroller
         * @classdesc Represents a ControllerStatus.
         * @implements IControllerStatus
         * @constructor
         * @param {smartcontroller.IControllerStatus=} [properties] Properties to set
         */
        function ControllerStatus(properties) {
            this.errorSht20 = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ControllerStatus rtc.
         * @member {number} rtc
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.rtc = 0;

        /**
         * ControllerStatus relay.
         * @member {number} relay
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.relay = 0;

        /**
         * ControllerStatus modbus.
         * @member {number} modbus
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.modbus = 0;

        /**
         * ControllerStatus sdcard.
         * @member {number} sdcard
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.sdcard = 0;

        /**
         * ControllerStatus eeprom.
         * @member {number} eeprom
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.eeprom = 0;

        /**
         * ControllerStatus stm32.
         * @member {number} stm32
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.stm32 = 0;

        /**
         * ControllerStatus hot.
         * @member {number} hot
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.hot = 0;

        /**
         * ControllerStatus cold.
         * @member {number} cold
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.cold = 0;

        /**
         * ControllerStatus undervolt.
         * @member {number} undervolt
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.undervolt = 0;

        /**
         * ControllerStatus errorSht20.
         * @member {Array.<smartcontroller.IErrorSht20>} errorSht20
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.errorSht20 = $util.emptyArray;

        /**
         * ControllerStatus button.
         * @member {smartcontroller.IButton|null|undefined} button
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.button = null;

        /**
         * ControllerStatus priority.
         * @member {number} priority
         * @memberof smartcontroller.ControllerStatus
         * @instance
         */
        ControllerStatus.prototype.priority = 0;

        /**
         * Creates a new ControllerStatus instance using the specified properties.
         * @function create
         * @memberof smartcontroller.ControllerStatus
         * @static
         * @param {smartcontroller.IControllerStatus=} [properties] Properties to set
         * @returns {smartcontroller.ControllerStatus} ControllerStatus instance
         */
        ControllerStatus.create = function create(properties) {
            return new ControllerStatus(properties);
        };

        /**
         * Encodes the specified ControllerStatus message. Does not implicitly {@link smartcontroller.ControllerStatus.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.ControllerStatus
         * @static
         * @param {smartcontroller.IControllerStatus} message ControllerStatus message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ControllerStatus.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rtc != null && Object.hasOwnProperty.call(message, "rtc"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.rtc);
            if (message.relay != null && Object.hasOwnProperty.call(message, "relay"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.relay);
            if (message.modbus != null && Object.hasOwnProperty.call(message, "modbus"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.modbus);
            if (message.sdcard != null && Object.hasOwnProperty.call(message, "sdcard"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.sdcard);
            if (message.eeprom != null && Object.hasOwnProperty.call(message, "eeprom"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.eeprom);
            if (message.stm32 != null && Object.hasOwnProperty.call(message, "stm32"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.stm32);
            if (message.hot != null && Object.hasOwnProperty.call(message, "hot"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.hot);
            if (message.cold != null && Object.hasOwnProperty.call(message, "cold"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.cold);
            if (message.undervolt != null && Object.hasOwnProperty.call(message, "undervolt"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.undervolt);
            if (message.errorSht20 != null && message.errorSht20.length)
                for (var i = 0; i < message.errorSht20.length; ++i)
                    $root.smartcontroller.ErrorSht20.encode(message.errorSht20[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.button != null && Object.hasOwnProperty.call(message, "button"))
                $root.smartcontroller.Button.encode(message.button, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.priority != null && Object.hasOwnProperty.call(message, "priority"))
                writer.uint32(/* id 30, wireType 0 =*/240).uint32(message.priority);
            return writer;
        };

        /**
         * Encodes the specified ControllerStatus message, length delimited. Does not implicitly {@link smartcontroller.ControllerStatus.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.ControllerStatus
         * @static
         * @param {smartcontroller.IControllerStatus} message ControllerStatus message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ControllerStatus.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ControllerStatus message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.ControllerStatus
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.ControllerStatus} ControllerStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ControllerStatus.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.ControllerStatus();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.rtc = reader.uint32();
                        break;
                    }
                case 2: {
                        message.relay = reader.uint32();
                        break;
                    }
                case 3: {
                        message.modbus = reader.uint32();
                        break;
                    }
                case 4: {
                        message.sdcard = reader.uint32();
                        break;
                    }
                case 5: {
                        message.eeprom = reader.uint32();
                        break;
                    }
                case 6: {
                        message.stm32 = reader.uint32();
                        break;
                    }
                case 7: {
                        message.hot = reader.uint32();
                        break;
                    }
                case 8: {
                        message.cold = reader.uint32();
                        break;
                    }
                case 9: {
                        message.undervolt = reader.uint32();
                        break;
                    }
                case 10: {
                        if (!(message.errorSht20 && message.errorSht20.length))
                            message.errorSht20 = [];
                        message.errorSht20.push($root.smartcontroller.ErrorSht20.decode(reader, reader.uint32()));
                        break;
                    }
                case 11: {
                        message.button = $root.smartcontroller.Button.decode(reader, reader.uint32());
                        break;
                    }
                case 30: {
                        message.priority = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ControllerStatus message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.ControllerStatus
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.ControllerStatus} ControllerStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ControllerStatus.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ControllerStatus message.
         * @function verify
         * @memberof smartcontroller.ControllerStatus
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ControllerStatus.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rtc != null && message.hasOwnProperty("rtc"))
                if (!$util.isInteger(message.rtc))
                    return "rtc: integer expected";
            if (message.relay != null && message.hasOwnProperty("relay"))
                if (!$util.isInteger(message.relay))
                    return "relay: integer expected";
            if (message.modbus != null && message.hasOwnProperty("modbus"))
                if (!$util.isInteger(message.modbus))
                    return "modbus: integer expected";
            if (message.sdcard != null && message.hasOwnProperty("sdcard"))
                if (!$util.isInteger(message.sdcard))
                    return "sdcard: integer expected";
            if (message.eeprom != null && message.hasOwnProperty("eeprom"))
                if (!$util.isInteger(message.eeprom))
                    return "eeprom: integer expected";
            if (message.stm32 != null && message.hasOwnProperty("stm32"))
                if (!$util.isInteger(message.stm32))
                    return "stm32: integer expected";
            if (message.hot != null && message.hasOwnProperty("hot"))
                if (!$util.isInteger(message.hot))
                    return "hot: integer expected";
            if (message.cold != null && message.hasOwnProperty("cold"))
                if (!$util.isInteger(message.cold))
                    return "cold: integer expected";
            if (message.undervolt != null && message.hasOwnProperty("undervolt"))
                if (!$util.isInteger(message.undervolt))
                    return "undervolt: integer expected";
            if (message.errorSht20 != null && message.hasOwnProperty("errorSht20")) {
                if (!Array.isArray(message.errorSht20))
                    return "errorSht20: array expected";
                for (var i = 0; i < message.errorSht20.length; ++i) {
                    var error = $root.smartcontroller.ErrorSht20.verify(message.errorSht20[i]);
                    if (error)
                        return "errorSht20." + error;
                }
            }
            if (message.button != null && message.hasOwnProperty("button")) {
                var error = $root.smartcontroller.Button.verify(message.button);
                if (error)
                    return "button." + error;
            }
            if (message.priority != null && message.hasOwnProperty("priority"))
                if (!$util.isInteger(message.priority))
                    return "priority: integer expected";
            return null;
        };

        /**
         * Creates a ControllerStatus message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.ControllerStatus
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.ControllerStatus} ControllerStatus
         */
        ControllerStatus.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.ControllerStatus)
                return object;
            var message = new $root.smartcontroller.ControllerStatus();
            if (object.rtc != null)
                message.rtc = object.rtc >>> 0;
            if (object.relay != null)
                message.relay = object.relay >>> 0;
            if (object.modbus != null)
                message.modbus = object.modbus >>> 0;
            if (object.sdcard != null)
                message.sdcard = object.sdcard >>> 0;
            if (object.eeprom != null)
                message.eeprom = object.eeprom >>> 0;
            if (object.stm32 != null)
                message.stm32 = object.stm32 >>> 0;
            if (object.hot != null)
                message.hot = object.hot >>> 0;
            if (object.cold != null)
                message.cold = object.cold >>> 0;
            if (object.undervolt != null)
                message.undervolt = object.undervolt >>> 0;
            if (object.errorSht20) {
                if (!Array.isArray(object.errorSht20))
                    throw TypeError(".smartcontroller.ControllerStatus.errorSht20: array expected");
                message.errorSht20 = [];
                for (var i = 0; i < object.errorSht20.length; ++i) {
                    if (typeof object.errorSht20[i] !== "object")
                        throw TypeError(".smartcontroller.ControllerStatus.errorSht20: object expected");
                    message.errorSht20[i] = $root.smartcontroller.ErrorSht20.fromObject(object.errorSht20[i]);
                }
            }
            if (object.button != null) {
                if (typeof object.button !== "object")
                    throw TypeError(".smartcontroller.ControllerStatus.button: object expected");
                message.button = $root.smartcontroller.Button.fromObject(object.button);
            }
            if (object.priority != null)
                message.priority = object.priority >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a ControllerStatus message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.ControllerStatus
         * @static
         * @param {smartcontroller.ControllerStatus} message ControllerStatus
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ControllerStatus.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.errorSht20 = [];
            if (options.defaults) {
                object.rtc = 0;
                object.relay = 0;
                object.modbus = 0;
                object.sdcard = 0;
                object.eeprom = 0;
                object.stm32 = 0;
                object.hot = 0;
                object.cold = 0;
                object.undervolt = 0;
                object.button = null;
                object.priority = 0;
            }
            if (message.rtc != null && message.hasOwnProperty("rtc"))
                object.rtc = message.rtc;
            if (message.relay != null && message.hasOwnProperty("relay"))
                object.relay = message.relay;
            if (message.modbus != null && message.hasOwnProperty("modbus"))
                object.modbus = message.modbus;
            if (message.sdcard != null && message.hasOwnProperty("sdcard"))
                object.sdcard = message.sdcard;
            if (message.eeprom != null && message.hasOwnProperty("eeprom"))
                object.eeprom = message.eeprom;
            if (message.stm32 != null && message.hasOwnProperty("stm32"))
                object.stm32 = message.stm32;
            if (message.hot != null && message.hasOwnProperty("hot"))
                object.hot = message.hot;
            if (message.cold != null && message.hasOwnProperty("cold"))
                object.cold = message.cold;
            if (message.undervolt != null && message.hasOwnProperty("undervolt"))
                object.undervolt = message.undervolt;
            if (message.errorSht20 && message.errorSht20.length) {
                object.errorSht20 = [];
                for (var j = 0; j < message.errorSht20.length; ++j)
                    object.errorSht20[j] = $root.smartcontroller.ErrorSht20.toObject(message.errorSht20[j], options);
            }
            if (message.button != null && message.hasOwnProperty("button"))
                object.button = $root.smartcontroller.Button.toObject(message.button, options);
            if (message.priority != null && message.hasOwnProperty("priority"))
                object.priority = message.priority;
            return object;
        };

        /**
         * Converts this ControllerStatus to JSON.
         * @function toJSON
         * @memberof smartcontroller.ControllerStatus
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ControllerStatus.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ControllerStatus
         * @function getTypeUrl
         * @memberof smartcontroller.ControllerStatus
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ControllerStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.ControllerStatus";
        };

        return ControllerStatus;
    })();

    smartcontroller.ControllerSetting = (function() {

        /**
         * Properties of a ControllerSetting.
         * @memberof smartcontroller
         * @interface IControllerSetting
         * @property {number|null} [tOffSet] ControllerSetting tOffSet
         * @property {number|null} [heater] ControllerSetting heater
         * @property {number|null} [growth] ControllerSetting growth
         * @property {number|null} [reset] ControllerSetting reset
         * @property {number|null} [tempDayOne] ControllerSetting tempDayOne
         * @property {number|null} [reqTemp] ControllerSetting reqTemp
         * @property {smartcontroller.ICooler|null} [cooler] ControllerSetting cooler
         * @property {smartcontroller.IAlarm|null} [alarm] ControllerSetting alarm
         * @property {Array.<smartcontroller.IReductionOpt>|null} [reduction] ControllerSetting reduction
         * @property {Array.<smartcontroller.IFanOpt>|null} [fan] ControllerSetting fan
         * @property {Array.<smartcontroller.ILightOpt>|null} [light] ControllerSetting light
         * @property {number|null} [sensor] ControllerSetting sensor
         * @property {smartcontroller.IRotationMode|null} [rotMode] ControllerSetting rotMode
         */

        /**
         * Constructs a new ControllerSetting.
         * @memberof smartcontroller
         * @classdesc Represents a ControllerSetting.
         * @implements IControllerSetting
         * @constructor
         * @param {smartcontroller.IControllerSetting=} [properties] Properties to set
         */
        function ControllerSetting(properties) {
            this.reduction = [];
            this.fan = [];
            this.light = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ControllerSetting tOffSet.
         * @member {number} tOffSet
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.tOffSet = 0;

        /**
         * ControllerSetting heater.
         * @member {number} heater
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.heater = 0;

        /**
         * ControllerSetting growth.
         * @member {number} growth
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.growth = 0;

        /**
         * ControllerSetting reset.
         * @member {number} reset
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.reset = 0;

        /**
         * ControllerSetting tempDayOne.
         * @member {number} tempDayOne
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.tempDayOne = 0;

        /**
         * ControllerSetting reqTemp.
         * @member {number} reqTemp
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.reqTemp = 0;

        /**
         * ControllerSetting cooler.
         * @member {smartcontroller.ICooler|null|undefined} cooler
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.cooler = null;

        /**
         * ControllerSetting alarm.
         * @member {smartcontroller.IAlarm|null|undefined} alarm
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.alarm = null;

        /**
         * ControllerSetting reduction.
         * @member {Array.<smartcontroller.IReductionOpt>} reduction
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.reduction = $util.emptyArray;

        /**
         * ControllerSetting fan.
         * @member {Array.<smartcontroller.IFanOpt>} fan
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.fan = $util.emptyArray;

        /**
         * ControllerSetting light.
         * @member {Array.<smartcontroller.ILightOpt>} light
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.light = $util.emptyArray;

        /**
         * ControllerSetting sensor.
         * @member {number} sensor
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.sensor = 0;

        /**
         * ControllerSetting rotMode.
         * @member {smartcontroller.IRotationMode|null|undefined} rotMode
         * @memberof smartcontroller.ControllerSetting
         * @instance
         */
        ControllerSetting.prototype.rotMode = null;

        /**
         * Creates a new ControllerSetting instance using the specified properties.
         * @function create
         * @memberof smartcontroller.ControllerSetting
         * @static
         * @param {smartcontroller.IControllerSetting=} [properties] Properties to set
         * @returns {smartcontroller.ControllerSetting} ControllerSetting instance
         */
        ControllerSetting.create = function create(properties) {
            return new ControllerSetting(properties);
        };

        /**
         * Encodes the specified ControllerSetting message. Does not implicitly {@link smartcontroller.ControllerSetting.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.ControllerSetting
         * @static
         * @param {smartcontroller.IControllerSetting} message ControllerSetting message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ControllerSetting.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tOffSet != null && Object.hasOwnProperty.call(message, "tOffSet"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.tOffSet);
            if (message.heater != null && Object.hasOwnProperty.call(message, "heater"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.heater);
            if (message.growth != null && Object.hasOwnProperty.call(message, "growth"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.growth);
            if (message.reset != null && Object.hasOwnProperty.call(message, "reset"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.reset);
            if (message.tempDayOne != null && Object.hasOwnProperty.call(message, "tempDayOne"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.tempDayOne);
            if (message.reqTemp != null && Object.hasOwnProperty.call(message, "reqTemp"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.reqTemp);
            if (message.cooler != null && Object.hasOwnProperty.call(message, "cooler"))
                $root.smartcontroller.Cooler.encode(message.cooler, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.alarm != null && Object.hasOwnProperty.call(message, "alarm"))
                $root.smartcontroller.Alarm.encode(message.alarm, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.reduction != null && message.reduction.length)
                for (var i = 0; i < message.reduction.length; ++i)
                    $root.smartcontroller.ReductionOpt.encode(message.reduction[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.fan != null && message.fan.length)
                for (var i = 0; i < message.fan.length; ++i)
                    $root.smartcontroller.FanOpt.encode(message.fan[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.light != null && message.light.length)
                for (var i = 0; i < message.light.length; ++i)
                    $root.smartcontroller.LightOpt.encode(message.light[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.sensor != null && Object.hasOwnProperty.call(message, "sensor"))
                writer.uint32(/* id 12, wireType 0 =*/96).uint32(message.sensor);
            if (message.rotMode != null && Object.hasOwnProperty.call(message, "rotMode"))
                $root.smartcontroller.RotationMode.encode(message.rotMode, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ControllerSetting message, length delimited. Does not implicitly {@link smartcontroller.ControllerSetting.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.ControllerSetting
         * @static
         * @param {smartcontroller.IControllerSetting} message ControllerSetting message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ControllerSetting.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ControllerSetting message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.ControllerSetting
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.ControllerSetting} ControllerSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ControllerSetting.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.ControllerSetting();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.tOffSet = reader.uint32();
                        break;
                    }
                case 2: {
                        message.heater = reader.uint32();
                        break;
                    }
                case 3: {
                        message.growth = reader.uint32();
                        break;
                    }
                case 4: {
                        message.reset = reader.uint32();
                        break;
                    }
                case 5: {
                        message.tempDayOne = reader.uint32();
                        break;
                    }
                case 6: {
                        message.reqTemp = reader.uint32();
                        break;
                    }
                case 7: {
                        message.cooler = $root.smartcontroller.Cooler.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.alarm = $root.smartcontroller.Alarm.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        if (!(message.reduction && message.reduction.length))
                            message.reduction = [];
                        message.reduction.push($root.smartcontroller.ReductionOpt.decode(reader, reader.uint32()));
                        break;
                    }
                case 10: {
                        if (!(message.fan && message.fan.length))
                            message.fan = [];
                        message.fan.push($root.smartcontroller.FanOpt.decode(reader, reader.uint32()));
                        break;
                    }
                case 11: {
                        if (!(message.light && message.light.length))
                            message.light = [];
                        message.light.push($root.smartcontroller.LightOpt.decode(reader, reader.uint32()));
                        break;
                    }
                case 12: {
                        message.sensor = reader.uint32();
                        break;
                    }
                case 13: {
                        message.rotMode = $root.smartcontroller.RotationMode.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ControllerSetting message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.ControllerSetting
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.ControllerSetting} ControllerSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ControllerSetting.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ControllerSetting message.
         * @function verify
         * @memberof smartcontroller.ControllerSetting
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ControllerSetting.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tOffSet != null && message.hasOwnProperty("tOffSet"))
                if (!$util.isInteger(message.tOffSet))
                    return "tOffSet: integer expected";
            if (message.heater != null && message.hasOwnProperty("heater"))
                if (!$util.isInteger(message.heater))
                    return "heater: integer expected";
            if (message.growth != null && message.hasOwnProperty("growth"))
                if (!$util.isInteger(message.growth))
                    return "growth: integer expected";
            if (message.reset != null && message.hasOwnProperty("reset"))
                if (!$util.isInteger(message.reset))
                    return "reset: integer expected";
            if (message.tempDayOne != null && message.hasOwnProperty("tempDayOne"))
                if (!$util.isInteger(message.tempDayOne))
                    return "tempDayOne: integer expected";
            if (message.reqTemp != null && message.hasOwnProperty("reqTemp"))
                if (!$util.isInteger(message.reqTemp))
                    return "reqTemp: integer expected";
            if (message.cooler != null && message.hasOwnProperty("cooler")) {
                var error = $root.smartcontroller.Cooler.verify(message.cooler);
                if (error)
                    return "cooler." + error;
            }
            if (message.alarm != null && message.hasOwnProperty("alarm")) {
                var error = $root.smartcontroller.Alarm.verify(message.alarm);
                if (error)
                    return "alarm." + error;
            }
            if (message.reduction != null && message.hasOwnProperty("reduction")) {
                if (!Array.isArray(message.reduction))
                    return "reduction: array expected";
                for (var i = 0; i < message.reduction.length; ++i) {
                    var error = $root.smartcontroller.ReductionOpt.verify(message.reduction[i]);
                    if (error)
                        return "reduction." + error;
                }
            }
            if (message.fan != null && message.hasOwnProperty("fan")) {
                if (!Array.isArray(message.fan))
                    return "fan: array expected";
                for (var i = 0; i < message.fan.length; ++i) {
                    var error = $root.smartcontroller.FanOpt.verify(message.fan[i]);
                    if (error)
                        return "fan." + error;
                }
            }
            if (message.light != null && message.hasOwnProperty("light")) {
                if (!Array.isArray(message.light))
                    return "light: array expected";
                for (var i = 0; i < message.light.length; ++i) {
                    var error = $root.smartcontroller.LightOpt.verify(message.light[i]);
                    if (error)
                        return "light." + error;
                }
            }
            if (message.sensor != null && message.hasOwnProperty("sensor"))
                if (!$util.isInteger(message.sensor))
                    return "sensor: integer expected";
            if (message.rotMode != null && message.hasOwnProperty("rotMode")) {
                var error = $root.smartcontroller.RotationMode.verify(message.rotMode);
                if (error)
                    return "rotMode." + error;
            }
            return null;
        };

        /**
         * Creates a ControllerSetting message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.ControllerSetting
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.ControllerSetting} ControllerSetting
         */
        ControllerSetting.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.ControllerSetting)
                return object;
            var message = new $root.smartcontroller.ControllerSetting();
            if (object.tOffSet != null)
                message.tOffSet = object.tOffSet >>> 0;
            if (object.heater != null)
                message.heater = object.heater >>> 0;
            if (object.growth != null)
                message.growth = object.growth >>> 0;
            if (object.reset != null)
                message.reset = object.reset >>> 0;
            if (object.tempDayOne != null)
                message.tempDayOne = object.tempDayOne >>> 0;
            if (object.reqTemp != null)
                message.reqTemp = object.reqTemp >>> 0;
            if (object.cooler != null) {
                if (typeof object.cooler !== "object")
                    throw TypeError(".smartcontroller.ControllerSetting.cooler: object expected");
                message.cooler = $root.smartcontroller.Cooler.fromObject(object.cooler);
            }
            if (object.alarm != null) {
                if (typeof object.alarm !== "object")
                    throw TypeError(".smartcontroller.ControllerSetting.alarm: object expected");
                message.alarm = $root.smartcontroller.Alarm.fromObject(object.alarm);
            }
            if (object.reduction) {
                if (!Array.isArray(object.reduction))
                    throw TypeError(".smartcontroller.ControllerSetting.reduction: array expected");
                message.reduction = [];
                for (var i = 0; i < object.reduction.length; ++i) {
                    if (typeof object.reduction[i] !== "object")
                        throw TypeError(".smartcontroller.ControllerSetting.reduction: object expected");
                    message.reduction[i] = $root.smartcontroller.ReductionOpt.fromObject(object.reduction[i]);
                }
            }
            if (object.fan) {
                if (!Array.isArray(object.fan))
                    throw TypeError(".smartcontroller.ControllerSetting.fan: array expected");
                message.fan = [];
                for (var i = 0; i < object.fan.length; ++i) {
                    if (typeof object.fan[i] !== "object")
                        throw TypeError(".smartcontroller.ControllerSetting.fan: object expected");
                    message.fan[i] = $root.smartcontroller.FanOpt.fromObject(object.fan[i]);
                }
            }
            if (object.light) {
                if (!Array.isArray(object.light))
                    throw TypeError(".smartcontroller.ControllerSetting.light: array expected");
                message.light = [];
                for (var i = 0; i < object.light.length; ++i) {
                    if (typeof object.light[i] !== "object")
                        throw TypeError(".smartcontroller.ControllerSetting.light: object expected");
                    message.light[i] = $root.smartcontroller.LightOpt.fromObject(object.light[i]);
                }
            }
            if (object.sensor != null)
                message.sensor = object.sensor >>> 0;
            if (object.rotMode != null) {
                if (typeof object.rotMode !== "object")
                    throw TypeError(".smartcontroller.ControllerSetting.rotMode: object expected");
                message.rotMode = $root.smartcontroller.RotationMode.fromObject(object.rotMode);
            }
            return message;
        };

        /**
         * Creates a plain object from a ControllerSetting message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.ControllerSetting
         * @static
         * @param {smartcontroller.ControllerSetting} message ControllerSetting
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ControllerSetting.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.reduction = [];
                object.fan = [];
                object.light = [];
            }
            if (options.defaults) {
                object.tOffSet = 0;
                object.heater = 0;
                object.growth = 0;
                object.reset = 0;
                object.tempDayOne = 0;
                object.reqTemp = 0;
                object.cooler = null;
                object.alarm = null;
                object.sensor = 0;
                object.rotMode = null;
            }
            if (message.tOffSet != null && message.hasOwnProperty("tOffSet"))
                object.tOffSet = message.tOffSet;
            if (message.heater != null && message.hasOwnProperty("heater"))
                object.heater = message.heater;
            if (message.growth != null && message.hasOwnProperty("growth"))
                object.growth = message.growth;
            if (message.reset != null && message.hasOwnProperty("reset"))
                object.reset = message.reset;
            if (message.tempDayOne != null && message.hasOwnProperty("tempDayOne"))
                object.tempDayOne = message.tempDayOne;
            if (message.reqTemp != null && message.hasOwnProperty("reqTemp"))
                object.reqTemp = message.reqTemp;
            if (message.cooler != null && message.hasOwnProperty("cooler"))
                object.cooler = $root.smartcontroller.Cooler.toObject(message.cooler, options);
            if (message.alarm != null && message.hasOwnProperty("alarm"))
                object.alarm = $root.smartcontroller.Alarm.toObject(message.alarm, options);
            if (message.reduction && message.reduction.length) {
                object.reduction = [];
                for (var j = 0; j < message.reduction.length; ++j)
                    object.reduction[j] = $root.smartcontroller.ReductionOpt.toObject(message.reduction[j], options);
            }
            if (message.fan && message.fan.length) {
                object.fan = [];
                for (var j = 0; j < message.fan.length; ++j)
                    object.fan[j] = $root.smartcontroller.FanOpt.toObject(message.fan[j], options);
            }
            if (message.light && message.light.length) {
                object.light = [];
                for (var j = 0; j < message.light.length; ++j)
                    object.light[j] = $root.smartcontroller.LightOpt.toObject(message.light[j], options);
            }
            if (message.sensor != null && message.hasOwnProperty("sensor"))
                object.sensor = message.sensor;
            if (message.rotMode != null && message.hasOwnProperty("rotMode"))
                object.rotMode = $root.smartcontroller.RotationMode.toObject(message.rotMode, options);
            return object;
        };

        /**
         * Converts this ControllerSetting to JSON.
         * @function toJSON
         * @memberof smartcontroller.ControllerSetting
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ControllerSetting.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ControllerSetting
         * @function getTypeUrl
         * @memberof smartcontroller.ControllerSetting
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ControllerSetting.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.ControllerSetting";
        };

        return ControllerSetting;
    })();

    smartcontroller.Alarm = (function() {

        /**
         * Properties of an Alarm.
         * @memberof smartcontroller
         * @interface IAlarm
         * @property {number|null} [cold] Alarm cold
         * @property {number|null} [hot] Alarm hot
         */

        /**
         * Constructs a new Alarm.
         * @memberof smartcontroller
         * @classdesc Represents an Alarm.
         * @implements IAlarm
         * @constructor
         * @param {smartcontroller.IAlarm=} [properties] Properties to set
         */
        function Alarm(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Alarm cold.
         * @member {number} cold
         * @memberof smartcontroller.Alarm
         * @instance
         */
        Alarm.prototype.cold = 0;

        /**
         * Alarm hot.
         * @member {number} hot
         * @memberof smartcontroller.Alarm
         * @instance
         */
        Alarm.prototype.hot = 0;

        /**
         * Creates a new Alarm instance using the specified properties.
         * @function create
         * @memberof smartcontroller.Alarm
         * @static
         * @param {smartcontroller.IAlarm=} [properties] Properties to set
         * @returns {smartcontroller.Alarm} Alarm instance
         */
        Alarm.create = function create(properties) {
            return new Alarm(properties);
        };

        /**
         * Encodes the specified Alarm message. Does not implicitly {@link smartcontroller.Alarm.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.Alarm
         * @static
         * @param {smartcontroller.IAlarm} message Alarm message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Alarm.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cold != null && Object.hasOwnProperty.call(message, "cold"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.cold);
            if (message.hot != null && Object.hasOwnProperty.call(message, "hot"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.hot);
            return writer;
        };

        /**
         * Encodes the specified Alarm message, length delimited. Does not implicitly {@link smartcontroller.Alarm.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.Alarm
         * @static
         * @param {smartcontroller.IAlarm} message Alarm message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Alarm.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Alarm message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.Alarm
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.Alarm} Alarm
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Alarm.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.Alarm();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.cold = reader.uint32();
                        break;
                    }
                case 2: {
                        message.hot = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Alarm message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.Alarm
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.Alarm} Alarm
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Alarm.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Alarm message.
         * @function verify
         * @memberof smartcontroller.Alarm
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Alarm.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cold != null && message.hasOwnProperty("cold"))
                if (!$util.isInteger(message.cold))
                    return "cold: integer expected";
            if (message.hot != null && message.hasOwnProperty("hot"))
                if (!$util.isInteger(message.hot))
                    return "hot: integer expected";
            return null;
        };

        /**
         * Creates an Alarm message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.Alarm
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.Alarm} Alarm
         */
        Alarm.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.Alarm)
                return object;
            var message = new $root.smartcontroller.Alarm();
            if (object.cold != null)
                message.cold = object.cold >>> 0;
            if (object.hot != null)
                message.hot = object.hot >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an Alarm message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.Alarm
         * @static
         * @param {smartcontroller.Alarm} message Alarm
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Alarm.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cold = 0;
                object.hot = 0;
            }
            if (message.cold != null && message.hasOwnProperty("cold"))
                object.cold = message.cold;
            if (message.hot != null && message.hasOwnProperty("hot"))
                object.hot = message.hot;
            return object;
        };

        /**
         * Converts this Alarm to JSON.
         * @function toJSON
         * @memberof smartcontroller.Alarm
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Alarm.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Alarm
         * @function getTypeUrl
         * @memberof smartcontroller.Alarm
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Alarm.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.Alarm";
        };

        return Alarm;
    })();

    smartcontroller.Cooler = (function() {

        /**
         * Properties of a Cooler.
         * @memberof smartcontroller
         * @interface ICooler
         * @property {number|null} [tempCool] Cooler tempCool
         * @property {smartcontroller.ITime|null} [TimeCool] Cooler TimeCool
         */

        /**
         * Constructs a new Cooler.
         * @memberof smartcontroller
         * @classdesc Represents a Cooler.
         * @implements ICooler
         * @constructor
         * @param {smartcontroller.ICooler=} [properties] Properties to set
         */
        function Cooler(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Cooler tempCool.
         * @member {number} tempCool
         * @memberof smartcontroller.Cooler
         * @instance
         */
        Cooler.prototype.tempCool = 0;

        /**
         * Cooler TimeCool.
         * @member {smartcontroller.ITime|null|undefined} TimeCool
         * @memberof smartcontroller.Cooler
         * @instance
         */
        Cooler.prototype.TimeCool = null;

        /**
         * Creates a new Cooler instance using the specified properties.
         * @function create
         * @memberof smartcontroller.Cooler
         * @static
         * @param {smartcontroller.ICooler=} [properties] Properties to set
         * @returns {smartcontroller.Cooler} Cooler instance
         */
        Cooler.create = function create(properties) {
            return new Cooler(properties);
        };

        /**
         * Encodes the specified Cooler message. Does not implicitly {@link smartcontroller.Cooler.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.Cooler
         * @static
         * @param {smartcontroller.ICooler} message Cooler message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cooler.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tempCool != null && Object.hasOwnProperty.call(message, "tempCool"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.tempCool);
            if (message.TimeCool != null && Object.hasOwnProperty.call(message, "TimeCool"))
                $root.smartcontroller.Time.encode(message.TimeCool, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Cooler message, length delimited. Does not implicitly {@link smartcontroller.Cooler.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.Cooler
         * @static
         * @param {smartcontroller.ICooler} message Cooler message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cooler.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Cooler message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.Cooler
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.Cooler} Cooler
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cooler.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.Cooler();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.tempCool = reader.uint32();
                        break;
                    }
                case 2: {
                        message.TimeCool = $root.smartcontroller.Time.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Cooler message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.Cooler
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.Cooler} Cooler
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cooler.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Cooler message.
         * @function verify
         * @memberof smartcontroller.Cooler
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Cooler.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tempCool != null && message.hasOwnProperty("tempCool"))
                if (!$util.isInteger(message.tempCool))
                    return "tempCool: integer expected";
            if (message.TimeCool != null && message.hasOwnProperty("TimeCool")) {
                var error = $root.smartcontroller.Time.verify(message.TimeCool);
                if (error)
                    return "TimeCool." + error;
            }
            return null;
        };

        /**
         * Creates a Cooler message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.Cooler
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.Cooler} Cooler
         */
        Cooler.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.Cooler)
                return object;
            var message = new $root.smartcontroller.Cooler();
            if (object.tempCool != null)
                message.tempCool = object.tempCool >>> 0;
            if (object.TimeCool != null) {
                if (typeof object.TimeCool !== "object")
                    throw TypeError(".smartcontroller.Cooler.TimeCool: object expected");
                message.TimeCool = $root.smartcontroller.Time.fromObject(object.TimeCool);
            }
            return message;
        };

        /**
         * Creates a plain object from a Cooler message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.Cooler
         * @static
         * @param {smartcontroller.Cooler} message Cooler
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Cooler.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.tempCool = 0;
                object.TimeCool = null;
            }
            if (message.tempCool != null && message.hasOwnProperty("tempCool"))
                object.tempCool = message.tempCool;
            if (message.TimeCool != null && message.hasOwnProperty("TimeCool"))
                object.TimeCool = $root.smartcontroller.Time.toObject(message.TimeCool, options);
            return object;
        };

        /**
         * Converts this Cooler to JSON.
         * @function toJSON
         * @memberof smartcontroller.Cooler
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Cooler.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Cooler
         * @function getTypeUrl
         * @memberof smartcontroller.Cooler
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Cooler.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.Cooler";
        };

        return Cooler;
    })();

    smartcontroller.LightOpt = (function() {

        /**
         * Properties of a LightOpt.
         * @memberof smartcontroller
         * @interface ILightOpt
         * @property {number|null} [id] LightOpt id
         * @property {smartcontroller.ITime|null} [time] LightOpt time
         */

        /**
         * Constructs a new LightOpt.
         * @memberof smartcontroller
         * @classdesc Represents a LightOpt.
         * @implements ILightOpt
         * @constructor
         * @param {smartcontroller.ILightOpt=} [properties] Properties to set
         */
        function LightOpt(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LightOpt id.
         * @member {number} id
         * @memberof smartcontroller.LightOpt
         * @instance
         */
        LightOpt.prototype.id = 0;

        /**
         * LightOpt time.
         * @member {smartcontroller.ITime|null|undefined} time
         * @memberof smartcontroller.LightOpt
         * @instance
         */
        LightOpt.prototype.time = null;

        /**
         * Creates a new LightOpt instance using the specified properties.
         * @function create
         * @memberof smartcontroller.LightOpt
         * @static
         * @param {smartcontroller.ILightOpt=} [properties] Properties to set
         * @returns {smartcontroller.LightOpt} LightOpt instance
         */
        LightOpt.create = function create(properties) {
            return new LightOpt(properties);
        };

        /**
         * Encodes the specified LightOpt message. Does not implicitly {@link smartcontroller.LightOpt.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.LightOpt
         * @static
         * @param {smartcontroller.ILightOpt} message LightOpt message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LightOpt.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                $root.smartcontroller.Time.encode(message.time, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LightOpt message, length delimited. Does not implicitly {@link smartcontroller.LightOpt.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.LightOpt
         * @static
         * @param {smartcontroller.ILightOpt} message LightOpt message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LightOpt.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LightOpt message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.LightOpt
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.LightOpt} LightOpt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LightOpt.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.LightOpt();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.time = $root.smartcontroller.Time.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LightOpt message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.LightOpt
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.LightOpt} LightOpt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LightOpt.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LightOpt message.
         * @function verify
         * @memberof smartcontroller.LightOpt
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LightOpt.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.time != null && message.hasOwnProperty("time")) {
                var error = $root.smartcontroller.Time.verify(message.time);
                if (error)
                    return "time." + error;
            }
            return null;
        };

        /**
         * Creates a LightOpt message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.LightOpt
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.LightOpt} LightOpt
         */
        LightOpt.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.LightOpt)
                return object;
            var message = new $root.smartcontroller.LightOpt();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.time != null) {
                if (typeof object.time !== "object")
                    throw TypeError(".smartcontroller.LightOpt.time: object expected");
                message.time = $root.smartcontroller.Time.fromObject(object.time);
            }
            return message;
        };

        /**
         * Creates a plain object from a LightOpt message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.LightOpt
         * @static
         * @param {smartcontroller.LightOpt} message LightOpt
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LightOpt.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.time = null;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = $root.smartcontroller.Time.toObject(message.time, options);
            return object;
        };

        /**
         * Converts this LightOpt to JSON.
         * @function toJSON
         * @memberof smartcontroller.LightOpt
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LightOpt.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LightOpt
         * @function getTypeUrl
         * @memberof smartcontroller.LightOpt
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LightOpt.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.LightOpt";
        };

        return LightOpt;
    })();

    smartcontroller.ReductionOpt = (function() {

        /**
         * Properties of a ReductionOpt.
         * @memberof smartcontroller
         * @interface IReductionOpt
         * @property {number|null} [id] ReductionOpt id
         * @property {smartcontroller.ITempDay|null} [tempDay] ReductionOpt tempDay
         */

        /**
         * Constructs a new ReductionOpt.
         * @memberof smartcontroller
         * @classdesc Represents a ReductionOpt.
         * @implements IReductionOpt
         * @constructor
         * @param {smartcontroller.IReductionOpt=} [properties] Properties to set
         */
        function ReductionOpt(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ReductionOpt id.
         * @member {number} id
         * @memberof smartcontroller.ReductionOpt
         * @instance
         */
        ReductionOpt.prototype.id = 0;

        /**
         * ReductionOpt tempDay.
         * @member {smartcontroller.ITempDay|null|undefined} tempDay
         * @memberof smartcontroller.ReductionOpt
         * @instance
         */
        ReductionOpt.prototype.tempDay = null;

        /**
         * Creates a new ReductionOpt instance using the specified properties.
         * @function create
         * @memberof smartcontroller.ReductionOpt
         * @static
         * @param {smartcontroller.IReductionOpt=} [properties] Properties to set
         * @returns {smartcontroller.ReductionOpt} ReductionOpt instance
         */
        ReductionOpt.create = function create(properties) {
            return new ReductionOpt(properties);
        };

        /**
         * Encodes the specified ReductionOpt message. Does not implicitly {@link smartcontroller.ReductionOpt.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.ReductionOpt
         * @static
         * @param {smartcontroller.IReductionOpt} message ReductionOpt message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReductionOpt.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.tempDay != null && Object.hasOwnProperty.call(message, "tempDay"))
                $root.smartcontroller.TempDay.encode(message.tempDay, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ReductionOpt message, length delimited. Does not implicitly {@link smartcontroller.ReductionOpt.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.ReductionOpt
         * @static
         * @param {smartcontroller.IReductionOpt} message ReductionOpt message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReductionOpt.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReductionOpt message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.ReductionOpt
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.ReductionOpt} ReductionOpt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReductionOpt.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.ReductionOpt();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.tempDay = $root.smartcontroller.TempDay.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ReductionOpt message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.ReductionOpt
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.ReductionOpt} ReductionOpt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReductionOpt.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ReductionOpt message.
         * @function verify
         * @memberof smartcontroller.ReductionOpt
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ReductionOpt.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.tempDay != null && message.hasOwnProperty("tempDay")) {
                var error = $root.smartcontroller.TempDay.verify(message.tempDay);
                if (error)
                    return "tempDay." + error;
            }
            return null;
        };

        /**
         * Creates a ReductionOpt message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.ReductionOpt
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.ReductionOpt} ReductionOpt
         */
        ReductionOpt.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.ReductionOpt)
                return object;
            var message = new $root.smartcontroller.ReductionOpt();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.tempDay != null) {
                if (typeof object.tempDay !== "object")
                    throw TypeError(".smartcontroller.ReductionOpt.tempDay: object expected");
                message.tempDay = $root.smartcontroller.TempDay.fromObject(object.tempDay);
            }
            return message;
        };

        /**
         * Creates a plain object from a ReductionOpt message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.ReductionOpt
         * @static
         * @param {smartcontroller.ReductionOpt} message ReductionOpt
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ReductionOpt.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.tempDay = null;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.tempDay != null && message.hasOwnProperty("tempDay"))
                object.tempDay = $root.smartcontroller.TempDay.toObject(message.tempDay, options);
            return object;
        };

        /**
         * Converts this ReductionOpt to JSON.
         * @function toJSON
         * @memberof smartcontroller.ReductionOpt
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ReductionOpt.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ReductionOpt
         * @function getTypeUrl
         * @memberof smartcontroller.ReductionOpt
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ReductionOpt.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.ReductionOpt";
        };

        return ReductionOpt;
    })();

    smartcontroller.FanOpt = (function() {

        /**
         * Properties of a FanOpt.
         * @memberof smartcontroller
         * @interface IFanOpt
         * @property {number|null} [id] FanOpt id
         * @property {number|null} [mode] FanOpt mode
         * @property {number|null} [diff] FanOpt diff
         * @property {smartcontroller.ITime|null} [time] FanOpt time
         * @property {number|null} [intKipas] FanOpt intKipas
         */

        /**
         * Constructs a new FanOpt.
         * @memberof smartcontroller
         * @classdesc Represents a FanOpt.
         * @implements IFanOpt
         * @constructor
         * @param {smartcontroller.IFanOpt=} [properties] Properties to set
         */
        function FanOpt(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FanOpt id.
         * @member {number} id
         * @memberof smartcontroller.FanOpt
         * @instance
         */
        FanOpt.prototype.id = 0;

        /**
         * FanOpt mode.
         * @member {number} mode
         * @memberof smartcontroller.FanOpt
         * @instance
         */
        FanOpt.prototype.mode = 0;

        /**
         * FanOpt diff.
         * @member {number} diff
         * @memberof smartcontroller.FanOpt
         * @instance
         */
        FanOpt.prototype.diff = 0;

        /**
         * FanOpt time.
         * @member {smartcontroller.ITime|null|undefined} time
         * @memberof smartcontroller.FanOpt
         * @instance
         */
        FanOpt.prototype.time = null;

        /**
         * FanOpt intKipas.
         * @member {number} intKipas
         * @memberof smartcontroller.FanOpt
         * @instance
         */
        FanOpt.prototype.intKipas = 0;

        /**
         * Creates a new FanOpt instance using the specified properties.
         * @function create
         * @memberof smartcontroller.FanOpt
         * @static
         * @param {smartcontroller.IFanOpt=} [properties] Properties to set
         * @returns {smartcontroller.FanOpt} FanOpt instance
         */
        FanOpt.create = function create(properties) {
            return new FanOpt(properties);
        };

        /**
         * Encodes the specified FanOpt message. Does not implicitly {@link smartcontroller.FanOpt.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.FanOpt
         * @static
         * @param {smartcontroller.IFanOpt} message FanOpt message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FanOpt.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.mode);
            if (message.diff != null && Object.hasOwnProperty.call(message, "diff"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.diff);
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                $root.smartcontroller.Time.encode(message.time, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.intKipas != null && Object.hasOwnProperty.call(message, "intKipas"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.intKipas);
            return writer;
        };

        /**
         * Encodes the specified FanOpt message, length delimited. Does not implicitly {@link smartcontroller.FanOpt.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.FanOpt
         * @static
         * @param {smartcontroller.IFanOpt} message FanOpt message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FanOpt.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FanOpt message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.FanOpt
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.FanOpt} FanOpt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FanOpt.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.FanOpt();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.mode = reader.uint32();
                        break;
                    }
                case 3: {
                        message.diff = reader.uint32();
                        break;
                    }
                case 4: {
                        message.time = $root.smartcontroller.Time.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.intKipas = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FanOpt message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.FanOpt
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.FanOpt} FanOpt
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FanOpt.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FanOpt message.
         * @function verify
         * @memberof smartcontroller.FanOpt
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FanOpt.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.mode != null && message.hasOwnProperty("mode"))
                if (!$util.isInteger(message.mode))
                    return "mode: integer expected";
            if (message.diff != null && message.hasOwnProperty("diff"))
                if (!$util.isInteger(message.diff))
                    return "diff: integer expected";
            if (message.time != null && message.hasOwnProperty("time")) {
                var error = $root.smartcontroller.Time.verify(message.time);
                if (error)
                    return "time." + error;
            }
            if (message.intKipas != null && message.hasOwnProperty("intKipas"))
                if (!$util.isInteger(message.intKipas))
                    return "intKipas: integer expected";
            return null;
        };

        /**
         * Creates a FanOpt message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.FanOpt
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.FanOpt} FanOpt
         */
        FanOpt.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.FanOpt)
                return object;
            var message = new $root.smartcontroller.FanOpt();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.mode != null)
                message.mode = object.mode >>> 0;
            if (object.diff != null)
                message.diff = object.diff >>> 0;
            if (object.time != null) {
                if (typeof object.time !== "object")
                    throw TypeError(".smartcontroller.FanOpt.time: object expected");
                message.time = $root.smartcontroller.Time.fromObject(object.time);
            }
            if (object.intKipas != null)
                message.intKipas = object.intKipas >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a FanOpt message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.FanOpt
         * @static
         * @param {smartcontroller.FanOpt} message FanOpt
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FanOpt.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.mode = 0;
                object.diff = 0;
                object.time = null;
                object.intKipas = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.mode != null && message.hasOwnProperty("mode"))
                object.mode = message.mode;
            if (message.diff != null && message.hasOwnProperty("diff"))
                object.diff = message.diff;
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = $root.smartcontroller.Time.toObject(message.time, options);
            if (message.intKipas != null && message.hasOwnProperty("intKipas"))
                object.intKipas = message.intKipas;
            return object;
        };

        /**
         * Converts this FanOpt to JSON.
         * @function toJSON
         * @memberof smartcontroller.FanOpt
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FanOpt.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FanOpt
         * @function getTypeUrl
         * @memberof smartcontroller.FanOpt
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FanOpt.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.FanOpt";
        };

        return FanOpt;
    })();

    smartcontroller.Time = (function() {

        /**
         * Properties of a Time.
         * @memberof smartcontroller
         * @interface ITime
         * @property {number|null} [on] Time on
         * @property {number|null} [off] Time off
         */

        /**
         * Constructs a new Time.
         * @memberof smartcontroller
         * @classdesc Represents a Time.
         * @implements ITime
         * @constructor
         * @param {smartcontroller.ITime=} [properties] Properties to set
         */
        function Time(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Time on.
         * @member {number} on
         * @memberof smartcontroller.Time
         * @instance
         */
        Time.prototype.on = 0;

        /**
         * Time off.
         * @member {number} off
         * @memberof smartcontroller.Time
         * @instance
         */
        Time.prototype.off = 0;

        /**
         * Creates a new Time instance using the specified properties.
         * @function create
         * @memberof smartcontroller.Time
         * @static
         * @param {smartcontroller.ITime=} [properties] Properties to set
         * @returns {smartcontroller.Time} Time instance
         */
        Time.create = function create(properties) {
            return new Time(properties);
        };

        /**
         * Encodes the specified Time message. Does not implicitly {@link smartcontroller.Time.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.Time
         * @static
         * @param {smartcontroller.ITime} message Time message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Time.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.on != null && Object.hasOwnProperty.call(message, "on"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.on);
            if (message.off != null && Object.hasOwnProperty.call(message, "off"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.off);
            return writer;
        };

        /**
         * Encodes the specified Time message, length delimited. Does not implicitly {@link smartcontroller.Time.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.Time
         * @static
         * @param {smartcontroller.ITime} message Time message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Time.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Time message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.Time
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.Time} Time
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Time.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.Time();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.on = reader.uint32();
                        break;
                    }
                case 2: {
                        message.off = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Time message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.Time
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.Time} Time
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Time.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Time message.
         * @function verify
         * @memberof smartcontroller.Time
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Time.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.on != null && message.hasOwnProperty("on"))
                if (!$util.isInteger(message.on))
                    return "on: integer expected";
            if (message.off != null && message.hasOwnProperty("off"))
                if (!$util.isInteger(message.off))
                    return "off: integer expected";
            return null;
        };

        /**
         * Creates a Time message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.Time
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.Time} Time
         */
        Time.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.Time)
                return object;
            var message = new $root.smartcontroller.Time();
            if (object.on != null)
                message.on = object.on >>> 0;
            if (object.off != null)
                message.off = object.off >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Time message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.Time
         * @static
         * @param {smartcontroller.Time} message Time
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Time.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.on = 0;
                object.off = 0;
            }
            if (message.on != null && message.hasOwnProperty("on"))
                object.on = message.on;
            if (message.off != null && message.hasOwnProperty("off"))
                object.off = message.off;
            return object;
        };

        /**
         * Converts this Time to JSON.
         * @function toJSON
         * @memberof smartcontroller.Time
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Time.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Time
         * @function getTypeUrl
         * @memberof smartcontroller.Time
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Time.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.Time";
        };

        return Time;
    })();

    smartcontroller.TempDay = (function() {

        /**
         * Properties of a TempDay.
         * @memberof smartcontroller
         * @interface ITempDay
         * @property {number|null} [temp] TempDay temp
         * @property {number|null} [days] TempDay days
         */

        /**
         * Constructs a new TempDay.
         * @memberof smartcontroller
         * @classdesc Represents a TempDay.
         * @implements ITempDay
         * @constructor
         * @param {smartcontroller.ITempDay=} [properties] Properties to set
         */
        function TempDay(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TempDay temp.
         * @member {number} temp
         * @memberof smartcontroller.TempDay
         * @instance
         */
        TempDay.prototype.temp = 0;

        /**
         * TempDay days.
         * @member {number} days
         * @memberof smartcontroller.TempDay
         * @instance
         */
        TempDay.prototype.days = 0;

        /**
         * Creates a new TempDay instance using the specified properties.
         * @function create
         * @memberof smartcontroller.TempDay
         * @static
         * @param {smartcontroller.ITempDay=} [properties] Properties to set
         * @returns {smartcontroller.TempDay} TempDay instance
         */
        TempDay.create = function create(properties) {
            return new TempDay(properties);
        };

        /**
         * Encodes the specified TempDay message. Does not implicitly {@link smartcontroller.TempDay.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.TempDay
         * @static
         * @param {smartcontroller.ITempDay} message TempDay message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TempDay.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.temp != null && Object.hasOwnProperty.call(message, "temp"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.temp);
            if (message.days != null && Object.hasOwnProperty.call(message, "days"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.days);
            return writer;
        };

        /**
         * Encodes the specified TempDay message, length delimited. Does not implicitly {@link smartcontroller.TempDay.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.TempDay
         * @static
         * @param {smartcontroller.ITempDay} message TempDay message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TempDay.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TempDay message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.TempDay
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.TempDay} TempDay
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TempDay.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.TempDay();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.temp = reader.uint32();
                        break;
                    }
                case 2: {
                        message.days = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TempDay message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.TempDay
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.TempDay} TempDay
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TempDay.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TempDay message.
         * @function verify
         * @memberof smartcontroller.TempDay
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TempDay.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.temp != null && message.hasOwnProperty("temp"))
                if (!$util.isInteger(message.temp))
                    return "temp: integer expected";
            if (message.days != null && message.hasOwnProperty("days"))
                if (!$util.isInteger(message.days))
                    return "days: integer expected";
            return null;
        };

        /**
         * Creates a TempDay message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.TempDay
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.TempDay} TempDay
         */
        TempDay.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.TempDay)
                return object;
            var message = new $root.smartcontroller.TempDay();
            if (object.temp != null)
                message.temp = object.temp >>> 0;
            if (object.days != null)
                message.days = object.days >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a TempDay message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.TempDay
         * @static
         * @param {smartcontroller.TempDay} message TempDay
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TempDay.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.temp = 0;
                object.days = 0;
            }
            if (message.temp != null && message.hasOwnProperty("temp"))
                object.temp = message.temp;
            if (message.days != null && message.hasOwnProperty("days"))
                object.days = message.days;
            return object;
        };

        /**
         * Converts this TempDay to JSON.
         * @function toJSON
         * @memberof smartcontroller.TempDay
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TempDay.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TempDay
         * @function getTypeUrl
         * @memberof smartcontroller.TempDay
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TempDay.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.TempDay";
        };

        return TempDay;
    })();

    smartcontroller.RotationMode = (function() {

        /**
         * Properties of a RotationMode.
         * @memberof smartcontroller
         * @interface IRotationMode
         * @property {number|null} [mode] RotationMode mode
         * @property {smartcontroller.ITime|null} [time] RotationMode time
         * @property {number|null} [loop] RotationMode loop
         */

        /**
         * Constructs a new RotationMode.
         * @memberof smartcontroller
         * @classdesc Represents a RotationMode.
         * @implements IRotationMode
         * @constructor
         * @param {smartcontroller.IRotationMode=} [properties] Properties to set
         */
        function RotationMode(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RotationMode mode.
         * @member {number} mode
         * @memberof smartcontroller.RotationMode
         * @instance
         */
        RotationMode.prototype.mode = 0;

        /**
         * RotationMode time.
         * @member {smartcontroller.ITime|null|undefined} time
         * @memberof smartcontroller.RotationMode
         * @instance
         */
        RotationMode.prototype.time = null;

        /**
         * RotationMode loop.
         * @member {number} loop
         * @memberof smartcontroller.RotationMode
         * @instance
         */
        RotationMode.prototype.loop = 0;

        /**
         * Creates a new RotationMode instance using the specified properties.
         * @function create
         * @memberof smartcontroller.RotationMode
         * @static
         * @param {smartcontroller.IRotationMode=} [properties] Properties to set
         * @returns {smartcontroller.RotationMode} RotationMode instance
         */
        RotationMode.create = function create(properties) {
            return new RotationMode(properties);
        };

        /**
         * Encodes the specified RotationMode message. Does not implicitly {@link smartcontroller.RotationMode.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.RotationMode
         * @static
         * @param {smartcontroller.IRotationMode} message RotationMode message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RotationMode.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.mode);
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                $root.smartcontroller.Time.encode(message.time, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.loop != null && Object.hasOwnProperty.call(message, "loop"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.loop);
            return writer;
        };

        /**
         * Encodes the specified RotationMode message, length delimited. Does not implicitly {@link smartcontroller.RotationMode.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.RotationMode
         * @static
         * @param {smartcontroller.IRotationMode} message RotationMode message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RotationMode.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RotationMode message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.RotationMode
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.RotationMode} RotationMode
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RotationMode.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.RotationMode();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.mode = reader.uint32();
                        break;
                    }
                case 2: {
                        message.time = $root.smartcontroller.Time.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.loop = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RotationMode message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.RotationMode
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.RotationMode} RotationMode
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RotationMode.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RotationMode message.
         * @function verify
         * @memberof smartcontroller.RotationMode
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RotationMode.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.mode != null && message.hasOwnProperty("mode"))
                if (!$util.isInteger(message.mode))
                    return "mode: integer expected";
            if (message.time != null && message.hasOwnProperty("time")) {
                var error = $root.smartcontroller.Time.verify(message.time);
                if (error)
                    return "time." + error;
            }
            if (message.loop != null && message.hasOwnProperty("loop"))
                if (!$util.isInteger(message.loop))
                    return "loop: integer expected";
            return null;
        };

        /**
         * Creates a RotationMode message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.RotationMode
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.RotationMode} RotationMode
         */
        RotationMode.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.RotationMode)
                return object;
            var message = new $root.smartcontroller.RotationMode();
            if (object.mode != null)
                message.mode = object.mode >>> 0;
            if (object.time != null) {
                if (typeof object.time !== "object")
                    throw TypeError(".smartcontroller.RotationMode.time: object expected");
                message.time = $root.smartcontroller.Time.fromObject(object.time);
            }
            if (object.loop != null)
                message.loop = object.loop >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a RotationMode message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.RotationMode
         * @static
         * @param {smartcontroller.RotationMode} message RotationMode
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RotationMode.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.mode = 0;
                object.time = null;
                object.loop = 0;
            }
            if (message.mode != null && message.hasOwnProperty("mode"))
                object.mode = message.mode;
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = $root.smartcontroller.Time.toObject(message.time, options);
            if (message.loop != null && message.hasOwnProperty("loop"))
                object.loop = message.loop;
            return object;
        };

        /**
         * Converts this RotationMode to JSON.
         * @function toJSON
         * @memberof smartcontroller.RotationMode
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RotationMode.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RotationMode
         * @function getTypeUrl
         * @memberof smartcontroller.RotationMode
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RotationMode.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.RotationMode";
        };

        return RotationMode;
    })();

    smartcontroller.ErrorSht20 = (function() {

        /**
         * Properties of an ErrorSht20.
         * @memberof smartcontroller
         * @interface IErrorSht20
         * @property {number|null} [id] ErrorSht20 id
         * @property {number|null} [exception] ErrorSht20 exception
         * @property {number|null} [command] ErrorSht20 command
         */

        /**
         * Constructs a new ErrorSht20.
         * @memberof smartcontroller
         * @classdesc Represents an ErrorSht20.
         * @implements IErrorSht20
         * @constructor
         * @param {smartcontroller.IErrorSht20=} [properties] Properties to set
         */
        function ErrorSht20(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ErrorSht20 id.
         * @member {number} id
         * @memberof smartcontroller.ErrorSht20
         * @instance
         */
        ErrorSht20.prototype.id = 0;

        /**
         * ErrorSht20 exception.
         * @member {number} exception
         * @memberof smartcontroller.ErrorSht20
         * @instance
         */
        ErrorSht20.prototype.exception = 0;

        /**
         * ErrorSht20 command.
         * @member {number} command
         * @memberof smartcontroller.ErrorSht20
         * @instance
         */
        ErrorSht20.prototype.command = 0;

        /**
         * Creates a new ErrorSht20 instance using the specified properties.
         * @function create
         * @memberof smartcontroller.ErrorSht20
         * @static
         * @param {smartcontroller.IErrorSht20=} [properties] Properties to set
         * @returns {smartcontroller.ErrorSht20} ErrorSht20 instance
         */
        ErrorSht20.create = function create(properties) {
            return new ErrorSht20(properties);
        };

        /**
         * Encodes the specified ErrorSht20 message. Does not implicitly {@link smartcontroller.ErrorSht20.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.ErrorSht20
         * @static
         * @param {smartcontroller.IErrorSht20} message ErrorSht20 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorSht20.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.exception != null && Object.hasOwnProperty.call(message, "exception"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.exception);
            if (message.command != null && Object.hasOwnProperty.call(message, "command"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.command);
            return writer;
        };

        /**
         * Encodes the specified ErrorSht20 message, length delimited. Does not implicitly {@link smartcontroller.ErrorSht20.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.ErrorSht20
         * @static
         * @param {smartcontroller.IErrorSht20} message ErrorSht20 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorSht20.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ErrorSht20 message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.ErrorSht20
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.ErrorSht20} ErrorSht20
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorSht20.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.ErrorSht20();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.exception = reader.uint32();
                        break;
                    }
                case 3: {
                        message.command = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ErrorSht20 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.ErrorSht20
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.ErrorSht20} ErrorSht20
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorSht20.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ErrorSht20 message.
         * @function verify
         * @memberof smartcontroller.ErrorSht20
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ErrorSht20.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.exception != null && message.hasOwnProperty("exception"))
                if (!$util.isInteger(message.exception))
                    return "exception: integer expected";
            if (message.command != null && message.hasOwnProperty("command"))
                if (!$util.isInteger(message.command))
                    return "command: integer expected";
            return null;
        };

        /**
         * Creates an ErrorSht20 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.ErrorSht20
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.ErrorSht20} ErrorSht20
         */
        ErrorSht20.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.ErrorSht20)
                return object;
            var message = new $root.smartcontroller.ErrorSht20();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.exception != null)
                message.exception = object.exception >>> 0;
            if (object.command != null)
                message.command = object.command >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an ErrorSht20 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.ErrorSht20
         * @static
         * @param {smartcontroller.ErrorSht20} message ErrorSht20
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ErrorSht20.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.exception = 0;
                object.command = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.exception != null && message.hasOwnProperty("exception"))
                object.exception = message.exception;
            if (message.command != null && message.hasOwnProperty("command"))
                object.command = message.command;
            return object;
        };

        /**
         * Converts this ErrorSht20 to JSON.
         * @function toJSON
         * @memberof smartcontroller.ErrorSht20
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ErrorSht20.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ErrorSht20
         * @function getTypeUrl
         * @memberof smartcontroller.ErrorSht20
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ErrorSht20.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.ErrorSht20";
        };

        return ErrorSht20;
    })();

    smartcontroller.Button = (function() {

        /**
         * Properties of a Button.
         * @memberof smartcontroller
         * @interface IButton
         * @property {number|null} [id] Button id
         * @property {number|null} [command] Button command
         */

        /**
         * Constructs a new Button.
         * @memberof smartcontroller
         * @classdesc Represents a Button.
         * @implements IButton
         * @constructor
         * @param {smartcontroller.IButton=} [properties] Properties to set
         */
        function Button(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Button id.
         * @member {number} id
         * @memberof smartcontroller.Button
         * @instance
         */
        Button.prototype.id = 0;

        /**
         * Button command.
         * @member {number} command
         * @memberof smartcontroller.Button
         * @instance
         */
        Button.prototype.command = 0;

        /**
         * Creates a new Button instance using the specified properties.
         * @function create
         * @memberof smartcontroller.Button
         * @static
         * @param {smartcontroller.IButton=} [properties] Properties to set
         * @returns {smartcontroller.Button} Button instance
         */
        Button.create = function create(properties) {
            return new Button(properties);
        };

        /**
         * Encodes the specified Button message. Does not implicitly {@link smartcontroller.Button.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.Button
         * @static
         * @param {smartcontroller.IButton} message Button message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Button.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.command != null && Object.hasOwnProperty.call(message, "command"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.command);
            return writer;
        };

        /**
         * Encodes the specified Button message, length delimited. Does not implicitly {@link smartcontroller.Button.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.Button
         * @static
         * @param {smartcontroller.IButton} message Button message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Button.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Button message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.Button
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.Button} Button
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Button.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.Button();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.command = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Button message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.Button
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.Button} Button
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Button.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Button message.
         * @function verify
         * @memberof smartcontroller.Button
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Button.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.command != null && message.hasOwnProperty("command"))
                if (!$util.isInteger(message.command))
                    return "command: integer expected";
            return null;
        };

        /**
         * Creates a Button message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.Button
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.Button} Button
         */
        Button.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.Button)
                return object;
            var message = new $root.smartcontroller.Button();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.command != null)
                message.command = object.command >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Button message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.Button
         * @static
         * @param {smartcontroller.Button} message Button
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Button.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.command = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.command != null && message.hasOwnProperty("command"))
                object.command = message.command;
            return object;
        };

        /**
         * Converts this Button to JSON.
         * @function toJSON
         * @memberof smartcontroller.Button
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Button.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Button
         * @function getTypeUrl
         * @memberof smartcontroller.Button
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Button.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.Button";
        };

        return Button;
    })();

    smartcontroller.ControllerLocalComm = (function() {

        /**
         * Properties of a ControllerLocalComm.
         * @memberof smartcontroller
         * @interface IControllerLocalComm
         * @property {string|null} [mac] ControllerLocalComm mac
         * @property {Array.<number>|null} [atc] ControllerLocalComm atc
         * @property {number|null} [status] ControllerLocalComm status
         */

        /**
         * Constructs a new ControllerLocalComm.
         * @memberof smartcontroller
         * @classdesc Represents a ControllerLocalComm.
         * @implements IControllerLocalComm
         * @constructor
         * @param {smartcontroller.IControllerLocalComm=} [properties] Properties to set
         */
        function ControllerLocalComm(properties) {
            this.atc = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ControllerLocalComm mac.
         * @member {string|null|undefined} mac
         * @memberof smartcontroller.ControllerLocalComm
         * @instance
         */
        ControllerLocalComm.prototype.mac = null;

        /**
         * ControllerLocalComm atc.
         * @member {Array.<number>} atc
         * @memberof smartcontroller.ControllerLocalComm
         * @instance
         */
        ControllerLocalComm.prototype.atc = $util.emptyArray;

        /**
         * ControllerLocalComm status.
         * @member {number|null|undefined} status
         * @memberof smartcontroller.ControllerLocalComm
         * @instance
         */
        ControllerLocalComm.prototype.status = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * ControllerLocalComm _mac.
         * @member {"mac"|undefined} _mac
         * @memberof smartcontroller.ControllerLocalComm
         * @instance
         */
        Object.defineProperty(ControllerLocalComm.prototype, "_mac", {
            get: $util.oneOfGetter($oneOfFields = ["mac"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * ControllerLocalComm _status.
         * @member {"status"|undefined} _status
         * @memberof smartcontroller.ControllerLocalComm
         * @instance
         */
        Object.defineProperty(ControllerLocalComm.prototype, "_status", {
            get: $util.oneOfGetter($oneOfFields = ["status"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ControllerLocalComm instance using the specified properties.
         * @function create
         * @memberof smartcontroller.ControllerLocalComm
         * @static
         * @param {smartcontroller.IControllerLocalComm=} [properties] Properties to set
         * @returns {smartcontroller.ControllerLocalComm} ControllerLocalComm instance
         */
        ControllerLocalComm.create = function create(properties) {
            return new ControllerLocalComm(properties);
        };

        /**
         * Encodes the specified ControllerLocalComm message. Does not implicitly {@link smartcontroller.ControllerLocalComm.verify|verify} messages.
         * @function encode
         * @memberof smartcontroller.ControllerLocalComm
         * @static
         * @param {smartcontroller.IControllerLocalComm} message ControllerLocalComm message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ControllerLocalComm.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.mac != null && Object.hasOwnProperty.call(message, "mac"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.mac);
            if (message.atc != null && message.atc.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (var i = 0; i < message.atc.length; ++i)
                    writer.uint32(message.atc[i]);
                writer.ldelim();
            }
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.status);
            return writer;
        };

        /**
         * Encodes the specified ControllerLocalComm message, length delimited. Does not implicitly {@link smartcontroller.ControllerLocalComm.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartcontroller.ControllerLocalComm
         * @static
         * @param {smartcontroller.IControllerLocalComm} message ControllerLocalComm message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ControllerLocalComm.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ControllerLocalComm message from the specified reader or buffer.
         * @function decode
         * @memberof smartcontroller.ControllerLocalComm
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartcontroller.ControllerLocalComm} ControllerLocalComm
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ControllerLocalComm.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartcontroller.ControllerLocalComm();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.mac = reader.string();
                        break;
                    }
                case 2: {
                        if (!(message.atc && message.atc.length))
                            message.atc = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.atc.push(reader.uint32());
                        } else
                            message.atc.push(reader.uint32());
                        break;
                    }
                case 3: {
                        message.status = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ControllerLocalComm message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartcontroller.ControllerLocalComm
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartcontroller.ControllerLocalComm} ControllerLocalComm
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ControllerLocalComm.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ControllerLocalComm message.
         * @function verify
         * @memberof smartcontroller.ControllerLocalComm
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ControllerLocalComm.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.mac != null && message.hasOwnProperty("mac")) {
                properties._mac = 1;
                if (!$util.isString(message.mac))
                    return "mac: string expected";
            }
            if (message.atc != null && message.hasOwnProperty("atc")) {
                if (!Array.isArray(message.atc))
                    return "atc: array expected";
                for (var i = 0; i < message.atc.length; ++i)
                    if (!$util.isInteger(message.atc[i]))
                        return "atc: integer[] expected";
            }
            if (message.status != null && message.hasOwnProperty("status")) {
                properties._status = 1;
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            }
            return null;
        };

        /**
         * Creates a ControllerLocalComm message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartcontroller.ControllerLocalComm
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartcontroller.ControllerLocalComm} ControllerLocalComm
         */
        ControllerLocalComm.fromObject = function fromObject(object) {
            if (object instanceof $root.smartcontroller.ControllerLocalComm)
                return object;
            var message = new $root.smartcontroller.ControllerLocalComm();
            if (object.mac != null)
                message.mac = String(object.mac);
            if (object.atc) {
                if (!Array.isArray(object.atc))
                    throw TypeError(".smartcontroller.ControllerLocalComm.atc: array expected");
                message.atc = [];
                for (var i = 0; i < object.atc.length; ++i)
                    message.atc[i] = object.atc[i] >>> 0;
            }
            if (object.status != null)
                message.status = object.status >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a ControllerLocalComm message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartcontroller.ControllerLocalComm
         * @static
         * @param {smartcontroller.ControllerLocalComm} message ControllerLocalComm
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ControllerLocalComm.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.atc = [];
            if (message.mac != null && message.hasOwnProperty("mac")) {
                object.mac = message.mac;
                if (options.oneofs)
                    object._mac = "mac";
            }
            if (message.atc && message.atc.length) {
                object.atc = [];
                for (var j = 0; j < message.atc.length; ++j)
                    object.atc[j] = message.atc[j];
            }
            if (message.status != null && message.hasOwnProperty("status")) {
                object.status = message.status;
                if (options.oneofs)
                    object._status = "status";
            }
            return object;
        };

        /**
         * Converts this ControllerLocalComm to JSON.
         * @function toJSON
         * @memberof smartcontroller.ControllerLocalComm
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ControllerLocalComm.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ControllerLocalComm
         * @function getTypeUrl
         * @memberof smartcontroller.ControllerLocalComm
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ControllerLocalComm.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartcontroller.ControllerLocalComm";
        };

        return ControllerLocalComm;
    })();

    return smartcontroller;
})();

$root.smartelmon = (function() {

    /**
     * Namespace smartelmon.
     * @exports smartelmon
     * @namespace
     */
    var smartelmon = {};

    smartelmon.ElmonContent = (function() {

        /**
         * Properties of an ElmonContent.
         * @memberof smartelmon
         * @interface IElmonContent
         * @property {Uint8Array|null} [meta] ElmonContent meta
         * @property {commoniot.IInfoDevice|null} [infoDevice] ElmonContent infoDevice
         * @property {commoniot.IInfoFarm|null} [infoFarm] ElmonContent infoFarm
         * @property {commoniot.IStartCycle|null} [startCycle] ElmonContent startCycle
         * @property {commoniot.IStopCycle|null} [stopCycle] ElmonContent stopCycle
         * @property {commoniot.IReset|null} [reset] ElmonContent reset
         * @property {commoniot.IPing|null} [ping] ElmonContent ping
         * @property {commoniot.IOta|null} [ota] ElmonContent ota
         * @property {commoniot.IReportSetting|null} [reportSetting] ElmonContent reportSetting
         * @property {smartelmon.IElmonData|null} [elmonData] ElmonContent elmonData
         * @property {smartelmon.IElmonStatus|null} [elmonStatus] ElmonContent elmonStatus
         * @property {smartelmon.IElmonSetting|null} [elmonSetting] ElmonContent elmonSetting
         * @property {commoniot.IError|null} [error] ElmonContent error
         */

        /**
         * Constructs a new ElmonContent.
         * @memberof smartelmon
         * @classdesc Represents an ElmonContent.
         * @implements IElmonContent
         * @constructor
         * @param {smartelmon.IElmonContent=} [properties] Properties to set
         */
        function ElmonContent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ElmonContent meta.
         * @member {Uint8Array} meta
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.meta = $util.newBuffer([]);

        /**
         * ElmonContent infoDevice.
         * @member {commoniot.IInfoDevice|null|undefined} infoDevice
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.infoDevice = null;

        /**
         * ElmonContent infoFarm.
         * @member {commoniot.IInfoFarm|null|undefined} infoFarm
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.infoFarm = null;

        /**
         * ElmonContent startCycle.
         * @member {commoniot.IStartCycle|null|undefined} startCycle
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.startCycle = null;

        /**
         * ElmonContent stopCycle.
         * @member {commoniot.IStopCycle|null|undefined} stopCycle
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.stopCycle = null;

        /**
         * ElmonContent reset.
         * @member {commoniot.IReset|null|undefined} reset
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.reset = null;

        /**
         * ElmonContent ping.
         * @member {commoniot.IPing|null|undefined} ping
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.ping = null;

        /**
         * ElmonContent ota.
         * @member {commoniot.IOta|null|undefined} ota
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.ota = null;

        /**
         * ElmonContent reportSetting.
         * @member {commoniot.IReportSetting|null|undefined} reportSetting
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.reportSetting = null;

        /**
         * ElmonContent elmonData.
         * @member {smartelmon.IElmonData|null|undefined} elmonData
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.elmonData = null;

        /**
         * ElmonContent elmonStatus.
         * @member {smartelmon.IElmonStatus|null|undefined} elmonStatus
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.elmonStatus = null;

        /**
         * ElmonContent elmonSetting.
         * @member {smartelmon.IElmonSetting|null|undefined} elmonSetting
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.elmonSetting = null;

        /**
         * ElmonContent error.
         * @member {commoniot.IError|null|undefined} error
         * @memberof smartelmon.ElmonContent
         * @instance
         */
        ElmonContent.prototype.error = null;

        /**
         * Creates a new ElmonContent instance using the specified properties.
         * @function create
         * @memberof smartelmon.ElmonContent
         * @static
         * @param {smartelmon.IElmonContent=} [properties] Properties to set
         * @returns {smartelmon.ElmonContent} ElmonContent instance
         */
        ElmonContent.create = function create(properties) {
            return new ElmonContent(properties);
        };

        /**
         * Encodes the specified ElmonContent message. Does not implicitly {@link smartelmon.ElmonContent.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.ElmonContent
         * @static
         * @param {smartelmon.IElmonContent} message ElmonContent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ElmonContent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.meta);
            if (message.infoDevice != null && Object.hasOwnProperty.call(message, "infoDevice"))
                $root.commoniot.InfoDevice.encode(message.infoDevice, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.infoFarm != null && Object.hasOwnProperty.call(message, "infoFarm"))
                $root.commoniot.InfoFarm.encode(message.infoFarm, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.startCycle != null && Object.hasOwnProperty.call(message, "startCycle"))
                $root.commoniot.StartCycle.encode(message.startCycle, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.stopCycle != null && Object.hasOwnProperty.call(message, "stopCycle"))
                $root.commoniot.StopCycle.encode(message.stopCycle, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.reset != null && Object.hasOwnProperty.call(message, "reset"))
                $root.commoniot.Reset.encode(message.reset, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.ping != null && Object.hasOwnProperty.call(message, "ping"))
                $root.commoniot.Ping.encode(message.ping, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.ota != null && Object.hasOwnProperty.call(message, "ota"))
                $root.commoniot.Ota.encode(message.ota, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.reportSetting != null && Object.hasOwnProperty.call(message, "reportSetting"))
                $root.commoniot.ReportSetting.encode(message.reportSetting, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.elmonData != null && Object.hasOwnProperty.call(message, "elmonData"))
                $root.smartelmon.ElmonData.encode(message.elmonData, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.elmonStatus != null && Object.hasOwnProperty.call(message, "elmonStatus"))
                $root.smartelmon.ElmonStatus.encode(message.elmonStatus, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.elmonSetting != null && Object.hasOwnProperty.call(message, "elmonSetting"))
                $root.smartelmon.ElmonSetting.encode(message.elmonSetting, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                $root.commoniot.Error.encode(message.error, writer.uint32(/* id 50, wireType 2 =*/402).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ElmonContent message, length delimited. Does not implicitly {@link smartelmon.ElmonContent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.ElmonContent
         * @static
         * @param {smartelmon.IElmonContent} message ElmonContent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ElmonContent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ElmonContent message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.ElmonContent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.ElmonContent} ElmonContent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ElmonContent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.ElmonContent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.meta = reader.bytes();
                        break;
                    }
                case 2: {
                        message.infoDevice = $root.commoniot.InfoDevice.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.infoFarm = $root.commoniot.InfoFarm.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.startCycle = $root.commoniot.StartCycle.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.stopCycle = $root.commoniot.StopCycle.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.reset = $root.commoniot.Reset.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.ping = $root.commoniot.Ping.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.ota = $root.commoniot.Ota.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        message.reportSetting = $root.commoniot.ReportSetting.decode(reader, reader.uint32());
                        break;
                    }
                case 10: {
                        message.elmonData = $root.smartelmon.ElmonData.decode(reader, reader.uint32());
                        break;
                    }
                case 11: {
                        message.elmonStatus = $root.smartelmon.ElmonStatus.decode(reader, reader.uint32());
                        break;
                    }
                case 12: {
                        message.elmonSetting = $root.smartelmon.ElmonSetting.decode(reader, reader.uint32());
                        break;
                    }
                case 50: {
                        message.error = $root.commoniot.Error.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ElmonContent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.ElmonContent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.ElmonContent} ElmonContent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ElmonContent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ElmonContent message.
         * @function verify
         * @memberof smartelmon.ElmonContent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ElmonContent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.meta != null && message.hasOwnProperty("meta"))
                if (!(message.meta && typeof message.meta.length === "number" || $util.isString(message.meta)))
                    return "meta: buffer expected";
            if (message.infoDevice != null && message.hasOwnProperty("infoDevice")) {
                var error = $root.commoniot.InfoDevice.verify(message.infoDevice);
                if (error)
                    return "infoDevice." + error;
            }
            if (message.infoFarm != null && message.hasOwnProperty("infoFarm")) {
                var error = $root.commoniot.InfoFarm.verify(message.infoFarm);
                if (error)
                    return "infoFarm." + error;
            }
            if (message.startCycle != null && message.hasOwnProperty("startCycle")) {
                var error = $root.commoniot.StartCycle.verify(message.startCycle);
                if (error)
                    return "startCycle." + error;
            }
            if (message.stopCycle != null && message.hasOwnProperty("stopCycle")) {
                var error = $root.commoniot.StopCycle.verify(message.stopCycle);
                if (error)
                    return "stopCycle." + error;
            }
            if (message.reset != null && message.hasOwnProperty("reset")) {
                var error = $root.commoniot.Reset.verify(message.reset);
                if (error)
                    return "reset." + error;
            }
            if (message.ping != null && message.hasOwnProperty("ping")) {
                var error = $root.commoniot.Ping.verify(message.ping);
                if (error)
                    return "ping." + error;
            }
            if (message.ota != null && message.hasOwnProperty("ota")) {
                var error = $root.commoniot.Ota.verify(message.ota);
                if (error)
                    return "ota." + error;
            }
            if (message.reportSetting != null && message.hasOwnProperty("reportSetting")) {
                var error = $root.commoniot.ReportSetting.verify(message.reportSetting);
                if (error)
                    return "reportSetting." + error;
            }
            if (message.elmonData != null && message.hasOwnProperty("elmonData")) {
                var error = $root.smartelmon.ElmonData.verify(message.elmonData);
                if (error)
                    return "elmonData." + error;
            }
            if (message.elmonStatus != null && message.hasOwnProperty("elmonStatus")) {
                var error = $root.smartelmon.ElmonStatus.verify(message.elmonStatus);
                if (error)
                    return "elmonStatus." + error;
            }
            if (message.elmonSetting != null && message.hasOwnProperty("elmonSetting")) {
                var error = $root.smartelmon.ElmonSetting.verify(message.elmonSetting);
                if (error)
                    return "elmonSetting." + error;
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                var error = $root.commoniot.Error.verify(message.error);
                if (error)
                    return "error." + error;
            }
            return null;
        };

        /**
         * Creates an ElmonContent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.ElmonContent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.ElmonContent} ElmonContent
         */
        ElmonContent.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.ElmonContent)
                return object;
            var message = new $root.smartelmon.ElmonContent();
            if (object.meta != null)
                if (typeof object.meta === "string")
                    $util.base64.decode(object.meta, message.meta = $util.newBuffer($util.base64.length(object.meta)), 0);
                else if (object.meta.length >= 0)
                    message.meta = object.meta;
            if (object.infoDevice != null) {
                if (typeof object.infoDevice !== "object")
                    throw TypeError(".smartelmon.ElmonContent.infoDevice: object expected");
                message.infoDevice = $root.commoniot.InfoDevice.fromObject(object.infoDevice);
            }
            if (object.infoFarm != null) {
                if (typeof object.infoFarm !== "object")
                    throw TypeError(".smartelmon.ElmonContent.infoFarm: object expected");
                message.infoFarm = $root.commoniot.InfoFarm.fromObject(object.infoFarm);
            }
            if (object.startCycle != null) {
                if (typeof object.startCycle !== "object")
                    throw TypeError(".smartelmon.ElmonContent.startCycle: object expected");
                message.startCycle = $root.commoniot.StartCycle.fromObject(object.startCycle);
            }
            if (object.stopCycle != null) {
                if (typeof object.stopCycle !== "object")
                    throw TypeError(".smartelmon.ElmonContent.stopCycle: object expected");
                message.stopCycle = $root.commoniot.StopCycle.fromObject(object.stopCycle);
            }
            if (object.reset != null) {
                if (typeof object.reset !== "object")
                    throw TypeError(".smartelmon.ElmonContent.reset: object expected");
                message.reset = $root.commoniot.Reset.fromObject(object.reset);
            }
            if (object.ping != null) {
                if (typeof object.ping !== "object")
                    throw TypeError(".smartelmon.ElmonContent.ping: object expected");
                message.ping = $root.commoniot.Ping.fromObject(object.ping);
            }
            if (object.ota != null) {
                if (typeof object.ota !== "object")
                    throw TypeError(".smartelmon.ElmonContent.ota: object expected");
                message.ota = $root.commoniot.Ota.fromObject(object.ota);
            }
            if (object.reportSetting != null) {
                if (typeof object.reportSetting !== "object")
                    throw TypeError(".smartelmon.ElmonContent.reportSetting: object expected");
                message.reportSetting = $root.commoniot.ReportSetting.fromObject(object.reportSetting);
            }
            if (object.elmonData != null) {
                if (typeof object.elmonData !== "object")
                    throw TypeError(".smartelmon.ElmonContent.elmonData: object expected");
                message.elmonData = $root.smartelmon.ElmonData.fromObject(object.elmonData);
            }
            if (object.elmonStatus != null) {
                if (typeof object.elmonStatus !== "object")
                    throw TypeError(".smartelmon.ElmonContent.elmonStatus: object expected");
                message.elmonStatus = $root.smartelmon.ElmonStatus.fromObject(object.elmonStatus);
            }
            if (object.elmonSetting != null) {
                if (typeof object.elmonSetting !== "object")
                    throw TypeError(".smartelmon.ElmonContent.elmonSetting: object expected");
                message.elmonSetting = $root.smartelmon.ElmonSetting.fromObject(object.elmonSetting);
            }
            if (object.error != null) {
                if (typeof object.error !== "object")
                    throw TypeError(".smartelmon.ElmonContent.error: object expected");
                message.error = $root.commoniot.Error.fromObject(object.error);
            }
            return message;
        };

        /**
         * Creates a plain object from an ElmonContent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.ElmonContent
         * @static
         * @param {smartelmon.ElmonContent} message ElmonContent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ElmonContent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.meta = "";
                else {
                    object.meta = [];
                    if (options.bytes !== Array)
                        object.meta = $util.newBuffer(object.meta);
                }
                object.infoDevice = null;
                object.infoFarm = null;
                object.startCycle = null;
                object.stopCycle = null;
                object.reset = null;
                object.ping = null;
                object.ota = null;
                object.reportSetting = null;
                object.elmonData = null;
                object.elmonStatus = null;
                object.elmonSetting = null;
                object.error = null;
            }
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = options.bytes === String ? $util.base64.encode(message.meta, 0, message.meta.length) : options.bytes === Array ? Array.prototype.slice.call(message.meta) : message.meta;
            if (message.infoDevice != null && message.hasOwnProperty("infoDevice"))
                object.infoDevice = $root.commoniot.InfoDevice.toObject(message.infoDevice, options);
            if (message.infoFarm != null && message.hasOwnProperty("infoFarm"))
                object.infoFarm = $root.commoniot.InfoFarm.toObject(message.infoFarm, options);
            if (message.startCycle != null && message.hasOwnProperty("startCycle"))
                object.startCycle = $root.commoniot.StartCycle.toObject(message.startCycle, options);
            if (message.stopCycle != null && message.hasOwnProperty("stopCycle"))
                object.stopCycle = $root.commoniot.StopCycle.toObject(message.stopCycle, options);
            if (message.reset != null && message.hasOwnProperty("reset"))
                object.reset = $root.commoniot.Reset.toObject(message.reset, options);
            if (message.ping != null && message.hasOwnProperty("ping"))
                object.ping = $root.commoniot.Ping.toObject(message.ping, options);
            if (message.ota != null && message.hasOwnProperty("ota"))
                object.ota = $root.commoniot.Ota.toObject(message.ota, options);
            if (message.reportSetting != null && message.hasOwnProperty("reportSetting"))
                object.reportSetting = $root.commoniot.ReportSetting.toObject(message.reportSetting, options);
            if (message.elmonData != null && message.hasOwnProperty("elmonData"))
                object.elmonData = $root.smartelmon.ElmonData.toObject(message.elmonData, options);
            if (message.elmonStatus != null && message.hasOwnProperty("elmonStatus"))
                object.elmonStatus = $root.smartelmon.ElmonStatus.toObject(message.elmonStatus, options);
            if (message.elmonSetting != null && message.hasOwnProperty("elmonSetting"))
                object.elmonSetting = $root.smartelmon.ElmonSetting.toObject(message.elmonSetting, options);
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = $root.commoniot.Error.toObject(message.error, options);
            return object;
        };

        /**
         * Converts this ElmonContent to JSON.
         * @function toJSON
         * @memberof smartelmon.ElmonContent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ElmonContent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ElmonContent
         * @function getTypeUrl
         * @memberof smartelmon.ElmonContent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ElmonContent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.ElmonContent";
        };

        return ElmonContent;
    })();

    smartelmon.ElmonSetting = (function() {

        /**
         * Properties of an ElmonSetting.
         * @memberof smartelmon
         * @interface IElmonSetting
         * @property {smartelmon.IVoltParams|null} [voltParams] ElmonSetting voltParams
         * @property {number|null} [pfParams] ElmonSetting pfParams
         */

        /**
         * Constructs a new ElmonSetting.
         * @memberof smartelmon
         * @classdesc Represents an ElmonSetting.
         * @implements IElmonSetting
         * @constructor
         * @param {smartelmon.IElmonSetting=} [properties] Properties to set
         */
        function ElmonSetting(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ElmonSetting voltParams.
         * @member {smartelmon.IVoltParams|null|undefined} voltParams
         * @memberof smartelmon.ElmonSetting
         * @instance
         */
        ElmonSetting.prototype.voltParams = null;

        /**
         * ElmonSetting pfParams.
         * @member {number} pfParams
         * @memberof smartelmon.ElmonSetting
         * @instance
         */
        ElmonSetting.prototype.pfParams = 0;

        /**
         * Creates a new ElmonSetting instance using the specified properties.
         * @function create
         * @memberof smartelmon.ElmonSetting
         * @static
         * @param {smartelmon.IElmonSetting=} [properties] Properties to set
         * @returns {smartelmon.ElmonSetting} ElmonSetting instance
         */
        ElmonSetting.create = function create(properties) {
            return new ElmonSetting(properties);
        };

        /**
         * Encodes the specified ElmonSetting message. Does not implicitly {@link smartelmon.ElmonSetting.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.ElmonSetting
         * @static
         * @param {smartelmon.IElmonSetting} message ElmonSetting message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ElmonSetting.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.voltParams != null && Object.hasOwnProperty.call(message, "voltParams"))
                $root.smartelmon.VoltParams.encode(message.voltParams, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.pfParams != null && Object.hasOwnProperty.call(message, "pfParams"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.pfParams);
            return writer;
        };

        /**
         * Encodes the specified ElmonSetting message, length delimited. Does not implicitly {@link smartelmon.ElmonSetting.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.ElmonSetting
         * @static
         * @param {smartelmon.IElmonSetting} message ElmonSetting message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ElmonSetting.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ElmonSetting message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.ElmonSetting
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.ElmonSetting} ElmonSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ElmonSetting.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.ElmonSetting();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.voltParams = $root.smartelmon.VoltParams.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.pfParams = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ElmonSetting message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.ElmonSetting
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.ElmonSetting} ElmonSetting
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ElmonSetting.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ElmonSetting message.
         * @function verify
         * @memberof smartelmon.ElmonSetting
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ElmonSetting.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.voltParams != null && message.hasOwnProperty("voltParams")) {
                var error = $root.smartelmon.VoltParams.verify(message.voltParams);
                if (error)
                    return "voltParams." + error;
            }
            if (message.pfParams != null && message.hasOwnProperty("pfParams"))
                if (!$util.isInteger(message.pfParams))
                    return "pfParams: integer expected";
            return null;
        };

        /**
         * Creates an ElmonSetting message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.ElmonSetting
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.ElmonSetting} ElmonSetting
         */
        ElmonSetting.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.ElmonSetting)
                return object;
            var message = new $root.smartelmon.ElmonSetting();
            if (object.voltParams != null) {
                if (typeof object.voltParams !== "object")
                    throw TypeError(".smartelmon.ElmonSetting.voltParams: object expected");
                message.voltParams = $root.smartelmon.VoltParams.fromObject(object.voltParams);
            }
            if (object.pfParams != null)
                message.pfParams = object.pfParams >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an ElmonSetting message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.ElmonSetting
         * @static
         * @param {smartelmon.ElmonSetting} message ElmonSetting
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ElmonSetting.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.voltParams = null;
                object.pfParams = 0;
            }
            if (message.voltParams != null && message.hasOwnProperty("voltParams"))
                object.voltParams = $root.smartelmon.VoltParams.toObject(message.voltParams, options);
            if (message.pfParams != null && message.hasOwnProperty("pfParams"))
                object.pfParams = message.pfParams;
            return object;
        };

        /**
         * Converts this ElmonSetting to JSON.
         * @function toJSON
         * @memberof smartelmon.ElmonSetting
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ElmonSetting.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ElmonSetting
         * @function getTypeUrl
         * @memberof smartelmon.ElmonSetting
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ElmonSetting.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.ElmonSetting";
        };

        return ElmonSetting;
    })();

    smartelmon.ElmonData = (function() {

        /**
         * Properties of an ElmonData.
         * @memberof smartelmon
         * @interface IElmonData
         * @property {smartelmon.IVoltage|null} [voltage] ElmonData voltage
         * @property {smartelmon.ICurrent|null} [current] ElmonData current
         * @property {smartelmon.IPower|null} [power] ElmonData power
         * @property {smartelmon.IFrequency|null} [freq] ElmonData freq
         * @property {smartelmon.ITHDVoltage|null} [thdVolt] ElmonData thdVolt
         * @property {smartelmon.ITHDCurrent|null} [thdCurr] ElmonData thdCurr
         * @property {number|null} [wifiRssi] ElmonData wifiRssi
         * @property {smartelmon.IEnergy|null} [energy] ElmonData energy
         * @property {smartelmon.IAngle|null} [angle] ElmonData angle
         * @property {number|null} [powerSource] ElmonData powerSource
         */

        /**
         * Constructs a new ElmonData.
         * @memberof smartelmon
         * @classdesc Represents an ElmonData.
         * @implements IElmonData
         * @constructor
         * @param {smartelmon.IElmonData=} [properties] Properties to set
         */
        function ElmonData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ElmonData voltage.
         * @member {smartelmon.IVoltage|null|undefined} voltage
         * @memberof smartelmon.ElmonData
         * @instance
         */
        ElmonData.prototype.voltage = null;

        /**
         * ElmonData current.
         * @member {smartelmon.ICurrent|null|undefined} current
         * @memberof smartelmon.ElmonData
         * @instance
         */
        ElmonData.prototype.current = null;

        /**
         * ElmonData power.
         * @member {smartelmon.IPower|null|undefined} power
         * @memberof smartelmon.ElmonData
         * @instance
         */
        ElmonData.prototype.power = null;

        /**
         * ElmonData freq.
         * @member {smartelmon.IFrequency|null|undefined} freq
         * @memberof smartelmon.ElmonData
         * @instance
         */
        ElmonData.prototype.freq = null;

        /**
         * ElmonData thdVolt.
         * @member {smartelmon.ITHDVoltage|null|undefined} thdVolt
         * @memberof smartelmon.ElmonData
         * @instance
         */
        ElmonData.prototype.thdVolt = null;

        /**
         * ElmonData thdCurr.
         * @member {smartelmon.ITHDCurrent|null|undefined} thdCurr
         * @memberof smartelmon.ElmonData
         * @instance
         */
        ElmonData.prototype.thdCurr = null;

        /**
         * ElmonData wifiRssi.
         * @member {number} wifiRssi
         * @memberof smartelmon.ElmonData
         * @instance
         */
        ElmonData.prototype.wifiRssi = 0;

        /**
         * ElmonData energy.
         * @member {smartelmon.IEnergy|null|undefined} energy
         * @memberof smartelmon.ElmonData
         * @instance
         */
        ElmonData.prototype.energy = null;

        /**
         * ElmonData angle.
         * @member {smartelmon.IAngle|null|undefined} angle
         * @memberof smartelmon.ElmonData
         * @instance
         */
        ElmonData.prototype.angle = null;

        /**
         * ElmonData powerSource.
         * @member {number} powerSource
         * @memberof smartelmon.ElmonData
         * @instance
         */
        ElmonData.prototype.powerSource = 0;

        /**
         * Creates a new ElmonData instance using the specified properties.
         * @function create
         * @memberof smartelmon.ElmonData
         * @static
         * @param {smartelmon.IElmonData=} [properties] Properties to set
         * @returns {smartelmon.ElmonData} ElmonData instance
         */
        ElmonData.create = function create(properties) {
            return new ElmonData(properties);
        };

        /**
         * Encodes the specified ElmonData message. Does not implicitly {@link smartelmon.ElmonData.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.ElmonData
         * @static
         * @param {smartelmon.IElmonData} message ElmonData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ElmonData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.voltage != null && Object.hasOwnProperty.call(message, "voltage"))
                $root.smartelmon.Voltage.encode(message.voltage, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.current != null && Object.hasOwnProperty.call(message, "current"))
                $root.smartelmon.Current.encode(message.current, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.power != null && Object.hasOwnProperty.call(message, "power"))
                $root.smartelmon.Power.encode(message.power, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.freq != null && Object.hasOwnProperty.call(message, "freq"))
                $root.smartelmon.Frequency.encode(message.freq, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.thdVolt != null && Object.hasOwnProperty.call(message, "thdVolt"))
                $root.smartelmon.THDVoltage.encode(message.thdVolt, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.thdCurr != null && Object.hasOwnProperty.call(message, "thdCurr"))
                $root.smartelmon.THDCurrent.encode(message.thdCurr, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.wifiRssi != null && Object.hasOwnProperty.call(message, "wifiRssi"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.wifiRssi);
            if (message.energy != null && Object.hasOwnProperty.call(message, "energy"))
                $root.smartelmon.Energy.encode(message.energy, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.angle != null && Object.hasOwnProperty.call(message, "angle"))
                $root.smartelmon.Angle.encode(message.angle, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.powerSource != null && Object.hasOwnProperty.call(message, "powerSource"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.powerSource);
            return writer;
        };

        /**
         * Encodes the specified ElmonData message, length delimited. Does not implicitly {@link smartelmon.ElmonData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.ElmonData
         * @static
         * @param {smartelmon.IElmonData} message ElmonData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ElmonData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ElmonData message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.ElmonData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.ElmonData} ElmonData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ElmonData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.ElmonData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.voltage = $root.smartelmon.Voltage.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.current = $root.smartelmon.Current.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.power = $root.smartelmon.Power.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.freq = $root.smartelmon.Frequency.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.thdVolt = $root.smartelmon.THDVoltage.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.thdCurr = $root.smartelmon.THDCurrent.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.wifiRssi = reader.uint32();
                        break;
                    }
                case 8: {
                        message.energy = $root.smartelmon.Energy.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        message.angle = $root.smartelmon.Angle.decode(reader, reader.uint32());
                        break;
                    }
                case 10: {
                        message.powerSource = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ElmonData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.ElmonData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.ElmonData} ElmonData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ElmonData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ElmonData message.
         * @function verify
         * @memberof smartelmon.ElmonData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ElmonData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.voltage != null && message.hasOwnProperty("voltage")) {
                var error = $root.smartelmon.Voltage.verify(message.voltage);
                if (error)
                    return "voltage." + error;
            }
            if (message.current != null && message.hasOwnProperty("current")) {
                var error = $root.smartelmon.Current.verify(message.current);
                if (error)
                    return "current." + error;
            }
            if (message.power != null && message.hasOwnProperty("power")) {
                var error = $root.smartelmon.Power.verify(message.power);
                if (error)
                    return "power." + error;
            }
            if (message.freq != null && message.hasOwnProperty("freq")) {
                var error = $root.smartelmon.Frequency.verify(message.freq);
                if (error)
                    return "freq." + error;
            }
            if (message.thdVolt != null && message.hasOwnProperty("thdVolt")) {
                var error = $root.smartelmon.THDVoltage.verify(message.thdVolt);
                if (error)
                    return "thdVolt." + error;
            }
            if (message.thdCurr != null && message.hasOwnProperty("thdCurr")) {
                var error = $root.smartelmon.THDCurrent.verify(message.thdCurr);
                if (error)
                    return "thdCurr." + error;
            }
            if (message.wifiRssi != null && message.hasOwnProperty("wifiRssi"))
                if (!$util.isInteger(message.wifiRssi))
                    return "wifiRssi: integer expected";
            if (message.energy != null && message.hasOwnProperty("energy")) {
                var error = $root.smartelmon.Energy.verify(message.energy);
                if (error)
                    return "energy." + error;
            }
            if (message.angle != null && message.hasOwnProperty("angle")) {
                var error = $root.smartelmon.Angle.verify(message.angle);
                if (error)
                    return "angle." + error;
            }
            if (message.powerSource != null && message.hasOwnProperty("powerSource"))
                if (!$util.isInteger(message.powerSource))
                    return "powerSource: integer expected";
            return null;
        };

        /**
         * Creates an ElmonData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.ElmonData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.ElmonData} ElmonData
         */
        ElmonData.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.ElmonData)
                return object;
            var message = new $root.smartelmon.ElmonData();
            if (object.voltage != null) {
                if (typeof object.voltage !== "object")
                    throw TypeError(".smartelmon.ElmonData.voltage: object expected");
                message.voltage = $root.smartelmon.Voltage.fromObject(object.voltage);
            }
            if (object.current != null) {
                if (typeof object.current !== "object")
                    throw TypeError(".smartelmon.ElmonData.current: object expected");
                message.current = $root.smartelmon.Current.fromObject(object.current);
            }
            if (object.power != null) {
                if (typeof object.power !== "object")
                    throw TypeError(".smartelmon.ElmonData.power: object expected");
                message.power = $root.smartelmon.Power.fromObject(object.power);
            }
            if (object.freq != null) {
                if (typeof object.freq !== "object")
                    throw TypeError(".smartelmon.ElmonData.freq: object expected");
                message.freq = $root.smartelmon.Frequency.fromObject(object.freq);
            }
            if (object.thdVolt != null) {
                if (typeof object.thdVolt !== "object")
                    throw TypeError(".smartelmon.ElmonData.thdVolt: object expected");
                message.thdVolt = $root.smartelmon.THDVoltage.fromObject(object.thdVolt);
            }
            if (object.thdCurr != null) {
                if (typeof object.thdCurr !== "object")
                    throw TypeError(".smartelmon.ElmonData.thdCurr: object expected");
                message.thdCurr = $root.smartelmon.THDCurrent.fromObject(object.thdCurr);
            }
            if (object.wifiRssi != null)
                message.wifiRssi = object.wifiRssi >>> 0;
            if (object.energy != null) {
                if (typeof object.energy !== "object")
                    throw TypeError(".smartelmon.ElmonData.energy: object expected");
                message.energy = $root.smartelmon.Energy.fromObject(object.energy);
            }
            if (object.angle != null) {
                if (typeof object.angle !== "object")
                    throw TypeError(".smartelmon.ElmonData.angle: object expected");
                message.angle = $root.smartelmon.Angle.fromObject(object.angle);
            }
            if (object.powerSource != null)
                message.powerSource = object.powerSource >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an ElmonData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.ElmonData
         * @static
         * @param {smartelmon.ElmonData} message ElmonData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ElmonData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.voltage = null;
                object.current = null;
                object.power = null;
                object.freq = null;
                object.thdVolt = null;
                object.thdCurr = null;
                object.wifiRssi = 0;
                object.energy = null;
                object.angle = null;
                object.powerSource = 0;
            }
            if (message.voltage != null && message.hasOwnProperty("voltage"))
                object.voltage = $root.smartelmon.Voltage.toObject(message.voltage, options);
            if (message.current != null && message.hasOwnProperty("current"))
                object.current = $root.smartelmon.Current.toObject(message.current, options);
            if (message.power != null && message.hasOwnProperty("power"))
                object.power = $root.smartelmon.Power.toObject(message.power, options);
            if (message.freq != null && message.hasOwnProperty("freq"))
                object.freq = $root.smartelmon.Frequency.toObject(message.freq, options);
            if (message.thdVolt != null && message.hasOwnProperty("thdVolt"))
                object.thdVolt = $root.smartelmon.THDVoltage.toObject(message.thdVolt, options);
            if (message.thdCurr != null && message.hasOwnProperty("thdCurr"))
                object.thdCurr = $root.smartelmon.THDCurrent.toObject(message.thdCurr, options);
            if (message.wifiRssi != null && message.hasOwnProperty("wifiRssi"))
                object.wifiRssi = message.wifiRssi;
            if (message.energy != null && message.hasOwnProperty("energy"))
                object.energy = $root.smartelmon.Energy.toObject(message.energy, options);
            if (message.angle != null && message.hasOwnProperty("angle"))
                object.angle = $root.smartelmon.Angle.toObject(message.angle, options);
            if (message.powerSource != null && message.hasOwnProperty("powerSource"))
                object.powerSource = message.powerSource;
            return object;
        };

        /**
         * Converts this ElmonData to JSON.
         * @function toJSON
         * @memberof smartelmon.ElmonData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ElmonData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ElmonData
         * @function getTypeUrl
         * @memberof smartelmon.ElmonData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ElmonData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.ElmonData";
        };

        return ElmonData;
    })();

    smartelmon.ElmonStatus = (function() {

        /**
         * Properties of an ElmonStatus.
         * @memberof smartelmon
         * @interface IElmonStatus
         * @property {number|null} [underVoltage] ElmonStatus underVoltage
         * @property {number|null} [overVoltage] ElmonStatus overVoltage
         * @property {number|null} [underPF] ElmonStatus underPF
         * @property {number|null} [phaseSequence] ElmonStatus phaseSequence
         * @property {number|null} [onePhaseFailure] ElmonStatus onePhaseFailure
         * @property {number|null} [rtc] ElmonStatus rtc
         * @property {number|null} [sdcard] ElmonStatus sdcard
         * @property {number|null} [modbus] ElmonStatus modbus
         * @property {number|null} [powerOff] ElmonStatus powerOff
         * @property {number|null} [buttonRst] ElmonStatus buttonRst
         * @property {number|null} [priority] ElmonStatus priority
         */

        /**
         * Constructs a new ElmonStatus.
         * @memberof smartelmon
         * @classdesc Represents an ElmonStatus.
         * @implements IElmonStatus
         * @constructor
         * @param {smartelmon.IElmonStatus=} [properties] Properties to set
         */
        function ElmonStatus(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ElmonStatus underVoltage.
         * @member {number} underVoltage
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.underVoltage = 0;

        /**
         * ElmonStatus overVoltage.
         * @member {number} overVoltage
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.overVoltage = 0;

        /**
         * ElmonStatus underPF.
         * @member {number} underPF
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.underPF = 0;

        /**
         * ElmonStatus phaseSequence.
         * @member {number} phaseSequence
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.phaseSequence = 0;

        /**
         * ElmonStatus onePhaseFailure.
         * @member {number} onePhaseFailure
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.onePhaseFailure = 0;

        /**
         * ElmonStatus rtc.
         * @member {number} rtc
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.rtc = 0;

        /**
         * ElmonStatus sdcard.
         * @member {number} sdcard
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.sdcard = 0;

        /**
         * ElmonStatus modbus.
         * @member {number} modbus
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.modbus = 0;

        /**
         * ElmonStatus powerOff.
         * @member {number} powerOff
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.powerOff = 0;

        /**
         * ElmonStatus buttonRst.
         * @member {number} buttonRst
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.buttonRst = 0;

        /**
         * ElmonStatus priority.
         * @member {number} priority
         * @memberof smartelmon.ElmonStatus
         * @instance
         */
        ElmonStatus.prototype.priority = 0;

        /**
         * Creates a new ElmonStatus instance using the specified properties.
         * @function create
         * @memberof smartelmon.ElmonStatus
         * @static
         * @param {smartelmon.IElmonStatus=} [properties] Properties to set
         * @returns {smartelmon.ElmonStatus} ElmonStatus instance
         */
        ElmonStatus.create = function create(properties) {
            return new ElmonStatus(properties);
        };

        /**
         * Encodes the specified ElmonStatus message. Does not implicitly {@link smartelmon.ElmonStatus.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.ElmonStatus
         * @static
         * @param {smartelmon.IElmonStatus} message ElmonStatus message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ElmonStatus.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.underVoltage != null && Object.hasOwnProperty.call(message, "underVoltage"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.underVoltage);
            if (message.overVoltage != null && Object.hasOwnProperty.call(message, "overVoltage"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.overVoltage);
            if (message.underPF != null && Object.hasOwnProperty.call(message, "underPF"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.underPF);
            if (message.phaseSequence != null && Object.hasOwnProperty.call(message, "phaseSequence"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.phaseSequence);
            if (message.onePhaseFailure != null && Object.hasOwnProperty.call(message, "onePhaseFailure"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.onePhaseFailure);
            if (message.rtc != null && Object.hasOwnProperty.call(message, "rtc"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.rtc);
            if (message.sdcard != null && Object.hasOwnProperty.call(message, "sdcard"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.sdcard);
            if (message.modbus != null && Object.hasOwnProperty.call(message, "modbus"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.modbus);
            if (message.powerOff != null && Object.hasOwnProperty.call(message, "powerOff"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.powerOff);
            if (message.buttonRst != null && Object.hasOwnProperty.call(message, "buttonRst"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.buttonRst);
            if (message.priority != null && Object.hasOwnProperty.call(message, "priority"))
                writer.uint32(/* id 30, wireType 0 =*/240).uint32(message.priority);
            return writer;
        };

        /**
         * Encodes the specified ElmonStatus message, length delimited. Does not implicitly {@link smartelmon.ElmonStatus.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.ElmonStatus
         * @static
         * @param {smartelmon.IElmonStatus} message ElmonStatus message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ElmonStatus.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ElmonStatus message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.ElmonStatus
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.ElmonStatus} ElmonStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ElmonStatus.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.ElmonStatus();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.underVoltage = reader.uint32();
                        break;
                    }
                case 2: {
                        message.overVoltage = reader.uint32();
                        break;
                    }
                case 3: {
                        message.underPF = reader.uint32();
                        break;
                    }
                case 4: {
                        message.phaseSequence = reader.uint32();
                        break;
                    }
                case 5: {
                        message.onePhaseFailure = reader.uint32();
                        break;
                    }
                case 6: {
                        message.rtc = reader.uint32();
                        break;
                    }
                case 7: {
                        message.sdcard = reader.uint32();
                        break;
                    }
                case 8: {
                        message.modbus = reader.uint32();
                        break;
                    }
                case 9: {
                        message.powerOff = reader.uint32();
                        break;
                    }
                case 10: {
                        message.buttonRst = reader.uint32();
                        break;
                    }
                case 30: {
                        message.priority = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ElmonStatus message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.ElmonStatus
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.ElmonStatus} ElmonStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ElmonStatus.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ElmonStatus message.
         * @function verify
         * @memberof smartelmon.ElmonStatus
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ElmonStatus.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.underVoltage != null && message.hasOwnProperty("underVoltage"))
                if (!$util.isInteger(message.underVoltage))
                    return "underVoltage: integer expected";
            if (message.overVoltage != null && message.hasOwnProperty("overVoltage"))
                if (!$util.isInteger(message.overVoltage))
                    return "overVoltage: integer expected";
            if (message.underPF != null && message.hasOwnProperty("underPF"))
                if (!$util.isInteger(message.underPF))
                    return "underPF: integer expected";
            if (message.phaseSequence != null && message.hasOwnProperty("phaseSequence"))
                if (!$util.isInteger(message.phaseSequence))
                    return "phaseSequence: integer expected";
            if (message.onePhaseFailure != null && message.hasOwnProperty("onePhaseFailure"))
                if (!$util.isInteger(message.onePhaseFailure))
                    return "onePhaseFailure: integer expected";
            if (message.rtc != null && message.hasOwnProperty("rtc"))
                if (!$util.isInteger(message.rtc))
                    return "rtc: integer expected";
            if (message.sdcard != null && message.hasOwnProperty("sdcard"))
                if (!$util.isInteger(message.sdcard))
                    return "sdcard: integer expected";
            if (message.modbus != null && message.hasOwnProperty("modbus"))
                if (!$util.isInteger(message.modbus))
                    return "modbus: integer expected";
            if (message.powerOff != null && message.hasOwnProperty("powerOff"))
                if (!$util.isInteger(message.powerOff))
                    return "powerOff: integer expected";
            if (message.buttonRst != null && message.hasOwnProperty("buttonRst"))
                if (!$util.isInteger(message.buttonRst))
                    return "buttonRst: integer expected";
            if (message.priority != null && message.hasOwnProperty("priority"))
                if (!$util.isInteger(message.priority))
                    return "priority: integer expected";
            return null;
        };

        /**
         * Creates an ElmonStatus message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.ElmonStatus
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.ElmonStatus} ElmonStatus
         */
        ElmonStatus.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.ElmonStatus)
                return object;
            var message = new $root.smartelmon.ElmonStatus();
            if (object.underVoltage != null)
                message.underVoltage = object.underVoltage >>> 0;
            if (object.overVoltage != null)
                message.overVoltage = object.overVoltage >>> 0;
            if (object.underPF != null)
                message.underPF = object.underPF >>> 0;
            if (object.phaseSequence != null)
                message.phaseSequence = object.phaseSequence >>> 0;
            if (object.onePhaseFailure != null)
                message.onePhaseFailure = object.onePhaseFailure >>> 0;
            if (object.rtc != null)
                message.rtc = object.rtc >>> 0;
            if (object.sdcard != null)
                message.sdcard = object.sdcard >>> 0;
            if (object.modbus != null)
                message.modbus = object.modbus >>> 0;
            if (object.powerOff != null)
                message.powerOff = object.powerOff >>> 0;
            if (object.buttonRst != null)
                message.buttonRst = object.buttonRst >>> 0;
            if (object.priority != null)
                message.priority = object.priority >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an ElmonStatus message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.ElmonStatus
         * @static
         * @param {smartelmon.ElmonStatus} message ElmonStatus
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ElmonStatus.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.underVoltage = 0;
                object.overVoltage = 0;
                object.underPF = 0;
                object.phaseSequence = 0;
                object.onePhaseFailure = 0;
                object.rtc = 0;
                object.sdcard = 0;
                object.modbus = 0;
                object.powerOff = 0;
                object.buttonRst = 0;
                object.priority = 0;
            }
            if (message.underVoltage != null && message.hasOwnProperty("underVoltage"))
                object.underVoltage = message.underVoltage;
            if (message.overVoltage != null && message.hasOwnProperty("overVoltage"))
                object.overVoltage = message.overVoltage;
            if (message.underPF != null && message.hasOwnProperty("underPF"))
                object.underPF = message.underPF;
            if (message.phaseSequence != null && message.hasOwnProperty("phaseSequence"))
                object.phaseSequence = message.phaseSequence;
            if (message.onePhaseFailure != null && message.hasOwnProperty("onePhaseFailure"))
                object.onePhaseFailure = message.onePhaseFailure;
            if (message.rtc != null && message.hasOwnProperty("rtc"))
                object.rtc = message.rtc;
            if (message.sdcard != null && message.hasOwnProperty("sdcard"))
                object.sdcard = message.sdcard;
            if (message.modbus != null && message.hasOwnProperty("modbus"))
                object.modbus = message.modbus;
            if (message.powerOff != null && message.hasOwnProperty("powerOff"))
                object.powerOff = message.powerOff;
            if (message.buttonRst != null && message.hasOwnProperty("buttonRst"))
                object.buttonRst = message.buttonRst;
            if (message.priority != null && message.hasOwnProperty("priority"))
                object.priority = message.priority;
            return object;
        };

        /**
         * Converts this ElmonStatus to JSON.
         * @function toJSON
         * @memberof smartelmon.ElmonStatus
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ElmonStatus.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ElmonStatus
         * @function getTypeUrl
         * @memberof smartelmon.ElmonStatus
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ElmonStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.ElmonStatus";
        };

        return ElmonStatus;
    })();

    smartelmon.Voltage = (function() {

        /**
         * Properties of a Voltage.
         * @memberof smartelmon
         * @interface IVoltage
         * @property {number|null} [AN] Voltage AN
         * @property {number|null} [BN] Voltage BN
         * @property {number|null} [CN] Voltage CN
         * @property {number|null} [AB] Voltage AB
         * @property {number|null} [BC] Voltage BC
         * @property {number|null} [CA] Voltage CA
         */

        /**
         * Constructs a new Voltage.
         * @memberof smartelmon
         * @classdesc Represents a Voltage.
         * @implements IVoltage
         * @constructor
         * @param {smartelmon.IVoltage=} [properties] Properties to set
         */
        function Voltage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Voltage AN.
         * @member {number} AN
         * @memberof smartelmon.Voltage
         * @instance
         */
        Voltage.prototype.AN = 0;

        /**
         * Voltage BN.
         * @member {number} BN
         * @memberof smartelmon.Voltage
         * @instance
         */
        Voltage.prototype.BN = 0;

        /**
         * Voltage CN.
         * @member {number} CN
         * @memberof smartelmon.Voltage
         * @instance
         */
        Voltage.prototype.CN = 0;

        /**
         * Voltage AB.
         * @member {number} AB
         * @memberof smartelmon.Voltage
         * @instance
         */
        Voltage.prototype.AB = 0;

        /**
         * Voltage BC.
         * @member {number} BC
         * @memberof smartelmon.Voltage
         * @instance
         */
        Voltage.prototype.BC = 0;

        /**
         * Voltage CA.
         * @member {number} CA
         * @memberof smartelmon.Voltage
         * @instance
         */
        Voltage.prototype.CA = 0;

        /**
         * Creates a new Voltage instance using the specified properties.
         * @function create
         * @memberof smartelmon.Voltage
         * @static
         * @param {smartelmon.IVoltage=} [properties] Properties to set
         * @returns {smartelmon.Voltage} Voltage instance
         */
        Voltage.create = function create(properties) {
            return new Voltage(properties);
        };

        /**
         * Encodes the specified Voltage message. Does not implicitly {@link smartelmon.Voltage.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.Voltage
         * @static
         * @param {smartelmon.IVoltage} message Voltage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Voltage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.AN != null && Object.hasOwnProperty.call(message, "AN"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.AN);
            if (message.BN != null && Object.hasOwnProperty.call(message, "BN"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.BN);
            if (message.CN != null && Object.hasOwnProperty.call(message, "CN"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.CN);
            if (message.AB != null && Object.hasOwnProperty.call(message, "AB"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.AB);
            if (message.BC != null && Object.hasOwnProperty.call(message, "BC"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.BC);
            if (message.CA != null && Object.hasOwnProperty.call(message, "CA"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.CA);
            return writer;
        };

        /**
         * Encodes the specified Voltage message, length delimited. Does not implicitly {@link smartelmon.Voltage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.Voltage
         * @static
         * @param {smartelmon.IVoltage} message Voltage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Voltage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Voltage message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.Voltage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.Voltage} Voltage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Voltage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.Voltage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.AN = reader.uint32();
                        break;
                    }
                case 2: {
                        message.BN = reader.uint32();
                        break;
                    }
                case 3: {
                        message.CN = reader.uint32();
                        break;
                    }
                case 4: {
                        message.AB = reader.uint32();
                        break;
                    }
                case 5: {
                        message.BC = reader.uint32();
                        break;
                    }
                case 6: {
                        message.CA = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Voltage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.Voltage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.Voltage} Voltage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Voltage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Voltage message.
         * @function verify
         * @memberof smartelmon.Voltage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Voltage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.AN != null && message.hasOwnProperty("AN"))
                if (!$util.isInteger(message.AN))
                    return "AN: integer expected";
            if (message.BN != null && message.hasOwnProperty("BN"))
                if (!$util.isInteger(message.BN))
                    return "BN: integer expected";
            if (message.CN != null && message.hasOwnProperty("CN"))
                if (!$util.isInteger(message.CN))
                    return "CN: integer expected";
            if (message.AB != null && message.hasOwnProperty("AB"))
                if (!$util.isInteger(message.AB))
                    return "AB: integer expected";
            if (message.BC != null && message.hasOwnProperty("BC"))
                if (!$util.isInteger(message.BC))
                    return "BC: integer expected";
            if (message.CA != null && message.hasOwnProperty("CA"))
                if (!$util.isInteger(message.CA))
                    return "CA: integer expected";
            return null;
        };

        /**
         * Creates a Voltage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.Voltage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.Voltage} Voltage
         */
        Voltage.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.Voltage)
                return object;
            var message = new $root.smartelmon.Voltage();
            if (object.AN != null)
                message.AN = object.AN >>> 0;
            if (object.BN != null)
                message.BN = object.BN >>> 0;
            if (object.CN != null)
                message.CN = object.CN >>> 0;
            if (object.AB != null)
                message.AB = object.AB >>> 0;
            if (object.BC != null)
                message.BC = object.BC >>> 0;
            if (object.CA != null)
                message.CA = object.CA >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Voltage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.Voltage
         * @static
         * @param {smartelmon.Voltage} message Voltage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Voltage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.AN = 0;
                object.BN = 0;
                object.CN = 0;
                object.AB = 0;
                object.BC = 0;
                object.CA = 0;
            }
            if (message.AN != null && message.hasOwnProperty("AN"))
                object.AN = message.AN;
            if (message.BN != null && message.hasOwnProperty("BN"))
                object.BN = message.BN;
            if (message.CN != null && message.hasOwnProperty("CN"))
                object.CN = message.CN;
            if (message.AB != null && message.hasOwnProperty("AB"))
                object.AB = message.AB;
            if (message.BC != null && message.hasOwnProperty("BC"))
                object.BC = message.BC;
            if (message.CA != null && message.hasOwnProperty("CA"))
                object.CA = message.CA;
            return object;
        };

        /**
         * Converts this Voltage to JSON.
         * @function toJSON
         * @memberof smartelmon.Voltage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Voltage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Voltage
         * @function getTypeUrl
         * @memberof smartelmon.Voltage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Voltage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.Voltage";
        };

        return Voltage;
    })();

    smartelmon.Current = (function() {

        /**
         * Properties of a Current.
         * @memberof smartelmon
         * @interface ICurrent
         * @property {number|null} [A] Current A
         * @property {number|null} [B] Current B
         * @property {number|null} [C] Current C
         */

        /**
         * Constructs a new Current.
         * @memberof smartelmon
         * @classdesc Represents a Current.
         * @implements ICurrent
         * @constructor
         * @param {smartelmon.ICurrent=} [properties] Properties to set
         */
        function Current(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Current A.
         * @member {number} A
         * @memberof smartelmon.Current
         * @instance
         */
        Current.prototype.A = 0;

        /**
         * Current B.
         * @member {number} B
         * @memberof smartelmon.Current
         * @instance
         */
        Current.prototype.B = 0;

        /**
         * Current C.
         * @member {number} C
         * @memberof smartelmon.Current
         * @instance
         */
        Current.prototype.C = 0;

        /**
         * Creates a new Current instance using the specified properties.
         * @function create
         * @memberof smartelmon.Current
         * @static
         * @param {smartelmon.ICurrent=} [properties] Properties to set
         * @returns {smartelmon.Current} Current instance
         */
        Current.create = function create(properties) {
            return new Current(properties);
        };

        /**
         * Encodes the specified Current message. Does not implicitly {@link smartelmon.Current.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.Current
         * @static
         * @param {smartelmon.ICurrent} message Current message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Current.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.A != null && Object.hasOwnProperty.call(message, "A"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.A);
            if (message.B != null && Object.hasOwnProperty.call(message, "B"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.B);
            if (message.C != null && Object.hasOwnProperty.call(message, "C"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.C);
            return writer;
        };

        /**
         * Encodes the specified Current message, length delimited. Does not implicitly {@link smartelmon.Current.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.Current
         * @static
         * @param {smartelmon.ICurrent} message Current message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Current.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Current message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.Current
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.Current} Current
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Current.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.Current();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.A = reader.uint32();
                        break;
                    }
                case 2: {
                        message.B = reader.uint32();
                        break;
                    }
                case 3: {
                        message.C = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Current message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.Current
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.Current} Current
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Current.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Current message.
         * @function verify
         * @memberof smartelmon.Current
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Current.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.A != null && message.hasOwnProperty("A"))
                if (!$util.isInteger(message.A))
                    return "A: integer expected";
            if (message.B != null && message.hasOwnProperty("B"))
                if (!$util.isInteger(message.B))
                    return "B: integer expected";
            if (message.C != null && message.hasOwnProperty("C"))
                if (!$util.isInteger(message.C))
                    return "C: integer expected";
            return null;
        };

        /**
         * Creates a Current message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.Current
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.Current} Current
         */
        Current.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.Current)
                return object;
            var message = new $root.smartelmon.Current();
            if (object.A != null)
                message.A = object.A >>> 0;
            if (object.B != null)
                message.B = object.B >>> 0;
            if (object.C != null)
                message.C = object.C >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Current message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.Current
         * @static
         * @param {smartelmon.Current} message Current
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Current.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.A = 0;
                object.B = 0;
                object.C = 0;
            }
            if (message.A != null && message.hasOwnProperty("A"))
                object.A = message.A;
            if (message.B != null && message.hasOwnProperty("B"))
                object.B = message.B;
            if (message.C != null && message.hasOwnProperty("C"))
                object.C = message.C;
            return object;
        };

        /**
         * Converts this Current to JSON.
         * @function toJSON
         * @memberof smartelmon.Current
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Current.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Current
         * @function getTypeUrl
         * @memberof smartelmon.Current
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Current.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.Current";
        };

        return Current;
    })();

    smartelmon.Power = (function() {

        /**
         * Properties of a Power.
         * @memberof smartelmon
         * @interface IPower
         * @property {number|null} [activeA] Power activeA
         * @property {number|null} [activeB] Power activeB
         * @property {number|null} [activeC] Power activeC
         * @property {number|null} [activeTotal] Power activeTotal
         * @property {number|null} [reactiveA] Power reactiveA
         * @property {number|null} [reactiveB] Power reactiveB
         * @property {number|null} [reactiveC] Power reactiveC
         * @property {number|null} [reactiveTotal] Power reactiveTotal
         * @property {number|null} [pfA] Power pfA
         * @property {number|null} [pfB] Power pfB
         * @property {number|null} [pfC] Power pfC
         * @property {number|null} [pfTotal] Power pfTotal
         * @property {number|null} [apparentA] Power apparentA
         * @property {number|null} [apparentB] Power apparentB
         * @property {number|null} [apparentC] Power apparentC
         * @property {number|null} [apparentTotal] Power apparentTotal
         */

        /**
         * Constructs a new Power.
         * @memberof smartelmon
         * @classdesc Represents a Power.
         * @implements IPower
         * @constructor
         * @param {smartelmon.IPower=} [properties] Properties to set
         */
        function Power(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Power activeA.
         * @member {number} activeA
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.activeA = 0;

        /**
         * Power activeB.
         * @member {number} activeB
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.activeB = 0;

        /**
         * Power activeC.
         * @member {number} activeC
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.activeC = 0;

        /**
         * Power activeTotal.
         * @member {number} activeTotal
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.activeTotal = 0;

        /**
         * Power reactiveA.
         * @member {number} reactiveA
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.reactiveA = 0;

        /**
         * Power reactiveB.
         * @member {number} reactiveB
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.reactiveB = 0;

        /**
         * Power reactiveC.
         * @member {number} reactiveC
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.reactiveC = 0;

        /**
         * Power reactiveTotal.
         * @member {number} reactiveTotal
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.reactiveTotal = 0;

        /**
         * Power pfA.
         * @member {number} pfA
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.pfA = 0;

        /**
         * Power pfB.
         * @member {number} pfB
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.pfB = 0;

        /**
         * Power pfC.
         * @member {number} pfC
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.pfC = 0;

        /**
         * Power pfTotal.
         * @member {number} pfTotal
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.pfTotal = 0;

        /**
         * Power apparentA.
         * @member {number} apparentA
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.apparentA = 0;

        /**
         * Power apparentB.
         * @member {number} apparentB
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.apparentB = 0;

        /**
         * Power apparentC.
         * @member {number} apparentC
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.apparentC = 0;

        /**
         * Power apparentTotal.
         * @member {number} apparentTotal
         * @memberof smartelmon.Power
         * @instance
         */
        Power.prototype.apparentTotal = 0;

        /**
         * Creates a new Power instance using the specified properties.
         * @function create
         * @memberof smartelmon.Power
         * @static
         * @param {smartelmon.IPower=} [properties] Properties to set
         * @returns {smartelmon.Power} Power instance
         */
        Power.create = function create(properties) {
            return new Power(properties);
        };

        /**
         * Encodes the specified Power message. Does not implicitly {@link smartelmon.Power.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.Power
         * @static
         * @param {smartelmon.IPower} message Power message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Power.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.activeA != null && Object.hasOwnProperty.call(message, "activeA"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.activeA);
            if (message.activeB != null && Object.hasOwnProperty.call(message, "activeB"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.activeB);
            if (message.activeC != null && Object.hasOwnProperty.call(message, "activeC"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.activeC);
            if (message.activeTotal != null && Object.hasOwnProperty.call(message, "activeTotal"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.activeTotal);
            if (message.reactiveA != null && Object.hasOwnProperty.call(message, "reactiveA"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.reactiveA);
            if (message.reactiveB != null && Object.hasOwnProperty.call(message, "reactiveB"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.reactiveB);
            if (message.reactiveC != null && Object.hasOwnProperty.call(message, "reactiveC"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.reactiveC);
            if (message.reactiveTotal != null && Object.hasOwnProperty.call(message, "reactiveTotal"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.reactiveTotal);
            if (message.pfA != null && Object.hasOwnProperty.call(message, "pfA"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.pfA);
            if (message.pfB != null && Object.hasOwnProperty.call(message, "pfB"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.pfB);
            if (message.pfC != null && Object.hasOwnProperty.call(message, "pfC"))
                writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.pfC);
            if (message.pfTotal != null && Object.hasOwnProperty.call(message, "pfTotal"))
                writer.uint32(/* id 12, wireType 0 =*/96).uint32(message.pfTotal);
            if (message.apparentA != null && Object.hasOwnProperty.call(message, "apparentA"))
                writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.apparentA);
            if (message.apparentB != null && Object.hasOwnProperty.call(message, "apparentB"))
                writer.uint32(/* id 14, wireType 0 =*/112).uint32(message.apparentB);
            if (message.apparentC != null && Object.hasOwnProperty.call(message, "apparentC"))
                writer.uint32(/* id 15, wireType 0 =*/120).uint32(message.apparentC);
            if (message.apparentTotal != null && Object.hasOwnProperty.call(message, "apparentTotal"))
                writer.uint32(/* id 16, wireType 0 =*/128).uint32(message.apparentTotal);
            return writer;
        };

        /**
         * Encodes the specified Power message, length delimited. Does not implicitly {@link smartelmon.Power.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.Power
         * @static
         * @param {smartelmon.IPower} message Power message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Power.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Power message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.Power
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.Power} Power
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Power.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.Power();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.activeA = reader.uint32();
                        break;
                    }
                case 2: {
                        message.activeB = reader.uint32();
                        break;
                    }
                case 3: {
                        message.activeC = reader.uint32();
                        break;
                    }
                case 4: {
                        message.activeTotal = reader.uint32();
                        break;
                    }
                case 5: {
                        message.reactiveA = reader.uint32();
                        break;
                    }
                case 6: {
                        message.reactiveB = reader.uint32();
                        break;
                    }
                case 7: {
                        message.reactiveC = reader.uint32();
                        break;
                    }
                case 8: {
                        message.reactiveTotal = reader.uint32();
                        break;
                    }
                case 9: {
                        message.pfA = reader.uint32();
                        break;
                    }
                case 10: {
                        message.pfB = reader.uint32();
                        break;
                    }
                case 11: {
                        message.pfC = reader.uint32();
                        break;
                    }
                case 12: {
                        message.pfTotal = reader.uint32();
                        break;
                    }
                case 13: {
                        message.apparentA = reader.uint32();
                        break;
                    }
                case 14: {
                        message.apparentB = reader.uint32();
                        break;
                    }
                case 15: {
                        message.apparentC = reader.uint32();
                        break;
                    }
                case 16: {
                        message.apparentTotal = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Power message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.Power
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.Power} Power
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Power.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Power message.
         * @function verify
         * @memberof smartelmon.Power
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Power.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.activeA != null && message.hasOwnProperty("activeA"))
                if (!$util.isInteger(message.activeA))
                    return "activeA: integer expected";
            if (message.activeB != null && message.hasOwnProperty("activeB"))
                if (!$util.isInteger(message.activeB))
                    return "activeB: integer expected";
            if (message.activeC != null && message.hasOwnProperty("activeC"))
                if (!$util.isInteger(message.activeC))
                    return "activeC: integer expected";
            if (message.activeTotal != null && message.hasOwnProperty("activeTotal"))
                if (!$util.isInteger(message.activeTotal))
                    return "activeTotal: integer expected";
            if (message.reactiveA != null && message.hasOwnProperty("reactiveA"))
                if (!$util.isInteger(message.reactiveA))
                    return "reactiveA: integer expected";
            if (message.reactiveB != null && message.hasOwnProperty("reactiveB"))
                if (!$util.isInteger(message.reactiveB))
                    return "reactiveB: integer expected";
            if (message.reactiveC != null && message.hasOwnProperty("reactiveC"))
                if (!$util.isInteger(message.reactiveC))
                    return "reactiveC: integer expected";
            if (message.reactiveTotal != null && message.hasOwnProperty("reactiveTotal"))
                if (!$util.isInteger(message.reactiveTotal))
                    return "reactiveTotal: integer expected";
            if (message.pfA != null && message.hasOwnProperty("pfA"))
                if (!$util.isInteger(message.pfA))
                    return "pfA: integer expected";
            if (message.pfB != null && message.hasOwnProperty("pfB"))
                if (!$util.isInteger(message.pfB))
                    return "pfB: integer expected";
            if (message.pfC != null && message.hasOwnProperty("pfC"))
                if (!$util.isInteger(message.pfC))
                    return "pfC: integer expected";
            if (message.pfTotal != null && message.hasOwnProperty("pfTotal"))
                if (!$util.isInteger(message.pfTotal))
                    return "pfTotal: integer expected";
            if (message.apparentA != null && message.hasOwnProperty("apparentA"))
                if (!$util.isInteger(message.apparentA))
                    return "apparentA: integer expected";
            if (message.apparentB != null && message.hasOwnProperty("apparentB"))
                if (!$util.isInteger(message.apparentB))
                    return "apparentB: integer expected";
            if (message.apparentC != null && message.hasOwnProperty("apparentC"))
                if (!$util.isInteger(message.apparentC))
                    return "apparentC: integer expected";
            if (message.apparentTotal != null && message.hasOwnProperty("apparentTotal"))
                if (!$util.isInteger(message.apparentTotal))
                    return "apparentTotal: integer expected";
            return null;
        };

        /**
         * Creates a Power message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.Power
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.Power} Power
         */
        Power.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.Power)
                return object;
            var message = new $root.smartelmon.Power();
            if (object.activeA != null)
                message.activeA = object.activeA >>> 0;
            if (object.activeB != null)
                message.activeB = object.activeB >>> 0;
            if (object.activeC != null)
                message.activeC = object.activeC >>> 0;
            if (object.activeTotal != null)
                message.activeTotal = object.activeTotal >>> 0;
            if (object.reactiveA != null)
                message.reactiveA = object.reactiveA >>> 0;
            if (object.reactiveB != null)
                message.reactiveB = object.reactiveB >>> 0;
            if (object.reactiveC != null)
                message.reactiveC = object.reactiveC >>> 0;
            if (object.reactiveTotal != null)
                message.reactiveTotal = object.reactiveTotal >>> 0;
            if (object.pfA != null)
                message.pfA = object.pfA >>> 0;
            if (object.pfB != null)
                message.pfB = object.pfB >>> 0;
            if (object.pfC != null)
                message.pfC = object.pfC >>> 0;
            if (object.pfTotal != null)
                message.pfTotal = object.pfTotal >>> 0;
            if (object.apparentA != null)
                message.apparentA = object.apparentA >>> 0;
            if (object.apparentB != null)
                message.apparentB = object.apparentB >>> 0;
            if (object.apparentC != null)
                message.apparentC = object.apparentC >>> 0;
            if (object.apparentTotal != null)
                message.apparentTotal = object.apparentTotal >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Power message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.Power
         * @static
         * @param {smartelmon.Power} message Power
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Power.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.activeA = 0;
                object.activeB = 0;
                object.activeC = 0;
                object.activeTotal = 0;
                object.reactiveA = 0;
                object.reactiveB = 0;
                object.reactiveC = 0;
                object.reactiveTotal = 0;
                object.pfA = 0;
                object.pfB = 0;
                object.pfC = 0;
                object.pfTotal = 0;
                object.apparentA = 0;
                object.apparentB = 0;
                object.apparentC = 0;
                object.apparentTotal = 0;
            }
            if (message.activeA != null && message.hasOwnProperty("activeA"))
                object.activeA = message.activeA;
            if (message.activeB != null && message.hasOwnProperty("activeB"))
                object.activeB = message.activeB;
            if (message.activeC != null && message.hasOwnProperty("activeC"))
                object.activeC = message.activeC;
            if (message.activeTotal != null && message.hasOwnProperty("activeTotal"))
                object.activeTotal = message.activeTotal;
            if (message.reactiveA != null && message.hasOwnProperty("reactiveA"))
                object.reactiveA = message.reactiveA;
            if (message.reactiveB != null && message.hasOwnProperty("reactiveB"))
                object.reactiveB = message.reactiveB;
            if (message.reactiveC != null && message.hasOwnProperty("reactiveC"))
                object.reactiveC = message.reactiveC;
            if (message.reactiveTotal != null && message.hasOwnProperty("reactiveTotal"))
                object.reactiveTotal = message.reactiveTotal;
            if (message.pfA != null && message.hasOwnProperty("pfA"))
                object.pfA = message.pfA;
            if (message.pfB != null && message.hasOwnProperty("pfB"))
                object.pfB = message.pfB;
            if (message.pfC != null && message.hasOwnProperty("pfC"))
                object.pfC = message.pfC;
            if (message.pfTotal != null && message.hasOwnProperty("pfTotal"))
                object.pfTotal = message.pfTotal;
            if (message.apparentA != null && message.hasOwnProperty("apparentA"))
                object.apparentA = message.apparentA;
            if (message.apparentB != null && message.hasOwnProperty("apparentB"))
                object.apparentB = message.apparentB;
            if (message.apparentC != null && message.hasOwnProperty("apparentC"))
                object.apparentC = message.apparentC;
            if (message.apparentTotal != null && message.hasOwnProperty("apparentTotal"))
                object.apparentTotal = message.apparentTotal;
            return object;
        };

        /**
         * Converts this Power to JSON.
         * @function toJSON
         * @memberof smartelmon.Power
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Power.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Power
         * @function getTypeUrl
         * @memberof smartelmon.Power
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Power.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.Power";
        };

        return Power;
    })();

    smartelmon.Frequency = (function() {

        /**
         * Properties of a Frequency.
         * @memberof smartelmon
         * @interface IFrequency
         * @property {number|null} [freq] Frequency freq
         */

        /**
         * Constructs a new Frequency.
         * @memberof smartelmon
         * @classdesc Represents a Frequency.
         * @implements IFrequency
         * @constructor
         * @param {smartelmon.IFrequency=} [properties] Properties to set
         */
        function Frequency(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Frequency freq.
         * @member {number} freq
         * @memberof smartelmon.Frequency
         * @instance
         */
        Frequency.prototype.freq = 0;

        /**
         * Creates a new Frequency instance using the specified properties.
         * @function create
         * @memberof smartelmon.Frequency
         * @static
         * @param {smartelmon.IFrequency=} [properties] Properties to set
         * @returns {smartelmon.Frequency} Frequency instance
         */
        Frequency.create = function create(properties) {
            return new Frequency(properties);
        };

        /**
         * Encodes the specified Frequency message. Does not implicitly {@link smartelmon.Frequency.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.Frequency
         * @static
         * @param {smartelmon.IFrequency} message Frequency message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Frequency.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.freq != null && Object.hasOwnProperty.call(message, "freq"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.freq);
            return writer;
        };

        /**
         * Encodes the specified Frequency message, length delimited. Does not implicitly {@link smartelmon.Frequency.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.Frequency
         * @static
         * @param {smartelmon.IFrequency} message Frequency message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Frequency.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Frequency message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.Frequency
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.Frequency} Frequency
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Frequency.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.Frequency();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.freq = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Frequency message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.Frequency
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.Frequency} Frequency
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Frequency.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Frequency message.
         * @function verify
         * @memberof smartelmon.Frequency
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Frequency.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.freq != null && message.hasOwnProperty("freq"))
                if (!$util.isInteger(message.freq))
                    return "freq: integer expected";
            return null;
        };

        /**
         * Creates a Frequency message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.Frequency
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.Frequency} Frequency
         */
        Frequency.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.Frequency)
                return object;
            var message = new $root.smartelmon.Frequency();
            if (object.freq != null)
                message.freq = object.freq >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Frequency message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.Frequency
         * @static
         * @param {smartelmon.Frequency} message Frequency
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Frequency.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.freq = 0;
            if (message.freq != null && message.hasOwnProperty("freq"))
                object.freq = message.freq;
            return object;
        };

        /**
         * Converts this Frequency to JSON.
         * @function toJSON
         * @memberof smartelmon.Frequency
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Frequency.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Frequency
         * @function getTypeUrl
         * @memberof smartelmon.Frequency
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Frequency.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.Frequency";
        };

        return Frequency;
    })();

    smartelmon.THDVoltage = (function() {

        /**
         * Properties of a THDVoltage.
         * @memberof smartelmon
         * @interface ITHDVoltage
         * @property {number|null} [AN] THDVoltage AN
         * @property {number|null} [BN] THDVoltage BN
         * @property {number|null} [CN] THDVoltage CN
         */

        /**
         * Constructs a new THDVoltage.
         * @memberof smartelmon
         * @classdesc Represents a THDVoltage.
         * @implements ITHDVoltage
         * @constructor
         * @param {smartelmon.ITHDVoltage=} [properties] Properties to set
         */
        function THDVoltage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * THDVoltage AN.
         * @member {number} AN
         * @memberof smartelmon.THDVoltage
         * @instance
         */
        THDVoltage.prototype.AN = 0;

        /**
         * THDVoltage BN.
         * @member {number} BN
         * @memberof smartelmon.THDVoltage
         * @instance
         */
        THDVoltage.prototype.BN = 0;

        /**
         * THDVoltage CN.
         * @member {number} CN
         * @memberof smartelmon.THDVoltage
         * @instance
         */
        THDVoltage.prototype.CN = 0;

        /**
         * Creates a new THDVoltage instance using the specified properties.
         * @function create
         * @memberof smartelmon.THDVoltage
         * @static
         * @param {smartelmon.ITHDVoltage=} [properties] Properties to set
         * @returns {smartelmon.THDVoltage} THDVoltage instance
         */
        THDVoltage.create = function create(properties) {
            return new THDVoltage(properties);
        };

        /**
         * Encodes the specified THDVoltage message. Does not implicitly {@link smartelmon.THDVoltage.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.THDVoltage
         * @static
         * @param {smartelmon.ITHDVoltage} message THDVoltage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        THDVoltage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.AN != null && Object.hasOwnProperty.call(message, "AN"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.AN);
            if (message.BN != null && Object.hasOwnProperty.call(message, "BN"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.BN);
            if (message.CN != null && Object.hasOwnProperty.call(message, "CN"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.CN);
            return writer;
        };

        /**
         * Encodes the specified THDVoltage message, length delimited. Does not implicitly {@link smartelmon.THDVoltage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.THDVoltage
         * @static
         * @param {smartelmon.ITHDVoltage} message THDVoltage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        THDVoltage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a THDVoltage message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.THDVoltage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.THDVoltage} THDVoltage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        THDVoltage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.THDVoltage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.AN = reader.uint32();
                        break;
                    }
                case 2: {
                        message.BN = reader.uint32();
                        break;
                    }
                case 3: {
                        message.CN = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a THDVoltage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.THDVoltage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.THDVoltage} THDVoltage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        THDVoltage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a THDVoltage message.
         * @function verify
         * @memberof smartelmon.THDVoltage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        THDVoltage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.AN != null && message.hasOwnProperty("AN"))
                if (!$util.isInteger(message.AN))
                    return "AN: integer expected";
            if (message.BN != null && message.hasOwnProperty("BN"))
                if (!$util.isInteger(message.BN))
                    return "BN: integer expected";
            if (message.CN != null && message.hasOwnProperty("CN"))
                if (!$util.isInteger(message.CN))
                    return "CN: integer expected";
            return null;
        };

        /**
         * Creates a THDVoltage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.THDVoltage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.THDVoltage} THDVoltage
         */
        THDVoltage.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.THDVoltage)
                return object;
            var message = new $root.smartelmon.THDVoltage();
            if (object.AN != null)
                message.AN = object.AN >>> 0;
            if (object.BN != null)
                message.BN = object.BN >>> 0;
            if (object.CN != null)
                message.CN = object.CN >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a THDVoltage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.THDVoltage
         * @static
         * @param {smartelmon.THDVoltage} message THDVoltage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        THDVoltage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.AN = 0;
                object.BN = 0;
                object.CN = 0;
            }
            if (message.AN != null && message.hasOwnProperty("AN"))
                object.AN = message.AN;
            if (message.BN != null && message.hasOwnProperty("BN"))
                object.BN = message.BN;
            if (message.CN != null && message.hasOwnProperty("CN"))
                object.CN = message.CN;
            return object;
        };

        /**
         * Converts this THDVoltage to JSON.
         * @function toJSON
         * @memberof smartelmon.THDVoltage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        THDVoltage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for THDVoltage
         * @function getTypeUrl
         * @memberof smartelmon.THDVoltage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        THDVoltage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.THDVoltage";
        };

        return THDVoltage;
    })();

    smartelmon.THDCurrent = (function() {

        /**
         * Properties of a THDCurrent.
         * @memberof smartelmon
         * @interface ITHDCurrent
         * @property {number|null} [A] THDCurrent A
         * @property {number|null} [B] THDCurrent B
         * @property {number|null} [C] THDCurrent C
         */

        /**
         * Constructs a new THDCurrent.
         * @memberof smartelmon
         * @classdesc Represents a THDCurrent.
         * @implements ITHDCurrent
         * @constructor
         * @param {smartelmon.ITHDCurrent=} [properties] Properties to set
         */
        function THDCurrent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * THDCurrent A.
         * @member {number} A
         * @memberof smartelmon.THDCurrent
         * @instance
         */
        THDCurrent.prototype.A = 0;

        /**
         * THDCurrent B.
         * @member {number} B
         * @memberof smartelmon.THDCurrent
         * @instance
         */
        THDCurrent.prototype.B = 0;

        /**
         * THDCurrent C.
         * @member {number} C
         * @memberof smartelmon.THDCurrent
         * @instance
         */
        THDCurrent.prototype.C = 0;

        /**
         * Creates a new THDCurrent instance using the specified properties.
         * @function create
         * @memberof smartelmon.THDCurrent
         * @static
         * @param {smartelmon.ITHDCurrent=} [properties] Properties to set
         * @returns {smartelmon.THDCurrent} THDCurrent instance
         */
        THDCurrent.create = function create(properties) {
            return new THDCurrent(properties);
        };

        /**
         * Encodes the specified THDCurrent message. Does not implicitly {@link smartelmon.THDCurrent.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.THDCurrent
         * @static
         * @param {smartelmon.ITHDCurrent} message THDCurrent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        THDCurrent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.A != null && Object.hasOwnProperty.call(message, "A"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.A);
            if (message.B != null && Object.hasOwnProperty.call(message, "B"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.B);
            if (message.C != null && Object.hasOwnProperty.call(message, "C"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.C);
            return writer;
        };

        /**
         * Encodes the specified THDCurrent message, length delimited. Does not implicitly {@link smartelmon.THDCurrent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.THDCurrent
         * @static
         * @param {smartelmon.ITHDCurrent} message THDCurrent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        THDCurrent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a THDCurrent message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.THDCurrent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.THDCurrent} THDCurrent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        THDCurrent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.THDCurrent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.A = reader.uint32();
                        break;
                    }
                case 2: {
                        message.B = reader.uint32();
                        break;
                    }
                case 3: {
                        message.C = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a THDCurrent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.THDCurrent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.THDCurrent} THDCurrent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        THDCurrent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a THDCurrent message.
         * @function verify
         * @memberof smartelmon.THDCurrent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        THDCurrent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.A != null && message.hasOwnProperty("A"))
                if (!$util.isInteger(message.A))
                    return "A: integer expected";
            if (message.B != null && message.hasOwnProperty("B"))
                if (!$util.isInteger(message.B))
                    return "B: integer expected";
            if (message.C != null && message.hasOwnProperty("C"))
                if (!$util.isInteger(message.C))
                    return "C: integer expected";
            return null;
        };

        /**
         * Creates a THDCurrent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.THDCurrent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.THDCurrent} THDCurrent
         */
        THDCurrent.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.THDCurrent)
                return object;
            var message = new $root.smartelmon.THDCurrent();
            if (object.A != null)
                message.A = object.A >>> 0;
            if (object.B != null)
                message.B = object.B >>> 0;
            if (object.C != null)
                message.C = object.C >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a THDCurrent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.THDCurrent
         * @static
         * @param {smartelmon.THDCurrent} message THDCurrent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        THDCurrent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.A = 0;
                object.B = 0;
                object.C = 0;
            }
            if (message.A != null && message.hasOwnProperty("A"))
                object.A = message.A;
            if (message.B != null && message.hasOwnProperty("B"))
                object.B = message.B;
            if (message.C != null && message.hasOwnProperty("C"))
                object.C = message.C;
            return object;
        };

        /**
         * Converts this THDCurrent to JSON.
         * @function toJSON
         * @memberof smartelmon.THDCurrent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        THDCurrent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for THDCurrent
         * @function getTypeUrl
         * @memberof smartelmon.THDCurrent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        THDCurrent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.THDCurrent";
        };

        return THDCurrent;
    })();

    smartelmon.VoltParams = (function() {

        /**
         * Properties of a VoltParams.
         * @memberof smartelmon
         * @interface IVoltParams
         * @property {number|null} [underVoltage1] VoltParams underVoltage1
         * @property {number|null} [underVoltage2] VoltParams underVoltage2
         * @property {number|null} [overVoltage1] VoltParams overVoltage1
         * @property {number|null} [overVoltage2] VoltParams overVoltage2
         */

        /**
         * Constructs a new VoltParams.
         * @memberof smartelmon
         * @classdesc Represents a VoltParams.
         * @implements IVoltParams
         * @constructor
         * @param {smartelmon.IVoltParams=} [properties] Properties to set
         */
        function VoltParams(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VoltParams underVoltage1.
         * @member {number} underVoltage1
         * @memberof smartelmon.VoltParams
         * @instance
         */
        VoltParams.prototype.underVoltage1 = 0;

        /**
         * VoltParams underVoltage2.
         * @member {number} underVoltage2
         * @memberof smartelmon.VoltParams
         * @instance
         */
        VoltParams.prototype.underVoltage2 = 0;

        /**
         * VoltParams overVoltage1.
         * @member {number} overVoltage1
         * @memberof smartelmon.VoltParams
         * @instance
         */
        VoltParams.prototype.overVoltage1 = 0;

        /**
         * VoltParams overVoltage2.
         * @member {number} overVoltage2
         * @memberof smartelmon.VoltParams
         * @instance
         */
        VoltParams.prototype.overVoltage2 = 0;

        /**
         * Creates a new VoltParams instance using the specified properties.
         * @function create
         * @memberof smartelmon.VoltParams
         * @static
         * @param {smartelmon.IVoltParams=} [properties] Properties to set
         * @returns {smartelmon.VoltParams} VoltParams instance
         */
        VoltParams.create = function create(properties) {
            return new VoltParams(properties);
        };

        /**
         * Encodes the specified VoltParams message. Does not implicitly {@link smartelmon.VoltParams.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.VoltParams
         * @static
         * @param {smartelmon.IVoltParams} message VoltParams message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VoltParams.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.underVoltage1 != null && Object.hasOwnProperty.call(message, "underVoltage1"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.underVoltage1);
            if (message.underVoltage2 != null && Object.hasOwnProperty.call(message, "underVoltage2"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.underVoltage2);
            if (message.overVoltage1 != null && Object.hasOwnProperty.call(message, "overVoltage1"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.overVoltage1);
            if (message.overVoltage2 != null && Object.hasOwnProperty.call(message, "overVoltage2"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.overVoltage2);
            return writer;
        };

        /**
         * Encodes the specified VoltParams message, length delimited. Does not implicitly {@link smartelmon.VoltParams.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.VoltParams
         * @static
         * @param {smartelmon.IVoltParams} message VoltParams message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VoltParams.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VoltParams message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.VoltParams
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.VoltParams} VoltParams
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VoltParams.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.VoltParams();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.underVoltage1 = reader.uint32();
                        break;
                    }
                case 2: {
                        message.underVoltage2 = reader.uint32();
                        break;
                    }
                case 3: {
                        message.overVoltage1 = reader.uint32();
                        break;
                    }
                case 4: {
                        message.overVoltage2 = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a VoltParams message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.VoltParams
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.VoltParams} VoltParams
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VoltParams.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VoltParams message.
         * @function verify
         * @memberof smartelmon.VoltParams
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VoltParams.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.underVoltage1 != null && message.hasOwnProperty("underVoltage1"))
                if (!$util.isInteger(message.underVoltage1))
                    return "underVoltage1: integer expected";
            if (message.underVoltage2 != null && message.hasOwnProperty("underVoltage2"))
                if (!$util.isInteger(message.underVoltage2))
                    return "underVoltage2: integer expected";
            if (message.overVoltage1 != null && message.hasOwnProperty("overVoltage1"))
                if (!$util.isInteger(message.overVoltage1))
                    return "overVoltage1: integer expected";
            if (message.overVoltage2 != null && message.hasOwnProperty("overVoltage2"))
                if (!$util.isInteger(message.overVoltage2))
                    return "overVoltage2: integer expected";
            return null;
        };

        /**
         * Creates a VoltParams message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.VoltParams
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.VoltParams} VoltParams
         */
        VoltParams.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.VoltParams)
                return object;
            var message = new $root.smartelmon.VoltParams();
            if (object.underVoltage1 != null)
                message.underVoltage1 = object.underVoltage1 >>> 0;
            if (object.underVoltage2 != null)
                message.underVoltage2 = object.underVoltage2 >>> 0;
            if (object.overVoltage1 != null)
                message.overVoltage1 = object.overVoltage1 >>> 0;
            if (object.overVoltage2 != null)
                message.overVoltage2 = object.overVoltage2 >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a VoltParams message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.VoltParams
         * @static
         * @param {smartelmon.VoltParams} message VoltParams
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VoltParams.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.underVoltage1 = 0;
                object.underVoltage2 = 0;
                object.overVoltage1 = 0;
                object.overVoltage2 = 0;
            }
            if (message.underVoltage1 != null && message.hasOwnProperty("underVoltage1"))
                object.underVoltage1 = message.underVoltage1;
            if (message.underVoltage2 != null && message.hasOwnProperty("underVoltage2"))
                object.underVoltage2 = message.underVoltage2;
            if (message.overVoltage1 != null && message.hasOwnProperty("overVoltage1"))
                object.overVoltage1 = message.overVoltage1;
            if (message.overVoltage2 != null && message.hasOwnProperty("overVoltage2"))
                object.overVoltage2 = message.overVoltage2;
            return object;
        };

        /**
         * Converts this VoltParams to JSON.
         * @function toJSON
         * @memberof smartelmon.VoltParams
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VoltParams.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VoltParams
         * @function getTypeUrl
         * @memberof smartelmon.VoltParams
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VoltParams.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.VoltParams";
        };

        return VoltParams;
    })();

    smartelmon.Angle = (function() {

        /**
         * Properties of an Angle.
         * @memberof smartelmon
         * @interface IAngle
         * @property {number|null} [phaseA] Angle phaseA
         * @property {number|null} [phaseB] Angle phaseB
         * @property {number|null} [phaseC] Angle phaseC
         */

        /**
         * Constructs a new Angle.
         * @memberof smartelmon
         * @classdesc Represents an Angle.
         * @implements IAngle
         * @constructor
         * @param {smartelmon.IAngle=} [properties] Properties to set
         */
        function Angle(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Angle phaseA.
         * @member {number} phaseA
         * @memberof smartelmon.Angle
         * @instance
         */
        Angle.prototype.phaseA = 0;

        /**
         * Angle phaseB.
         * @member {number} phaseB
         * @memberof smartelmon.Angle
         * @instance
         */
        Angle.prototype.phaseB = 0;

        /**
         * Angle phaseC.
         * @member {number} phaseC
         * @memberof smartelmon.Angle
         * @instance
         */
        Angle.prototype.phaseC = 0;

        /**
         * Creates a new Angle instance using the specified properties.
         * @function create
         * @memberof smartelmon.Angle
         * @static
         * @param {smartelmon.IAngle=} [properties] Properties to set
         * @returns {smartelmon.Angle} Angle instance
         */
        Angle.create = function create(properties) {
            return new Angle(properties);
        };

        /**
         * Encodes the specified Angle message. Does not implicitly {@link smartelmon.Angle.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.Angle
         * @static
         * @param {smartelmon.IAngle} message Angle message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Angle.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.phaseA != null && Object.hasOwnProperty.call(message, "phaseA"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.phaseA);
            if (message.phaseB != null && Object.hasOwnProperty.call(message, "phaseB"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.phaseB);
            if (message.phaseC != null && Object.hasOwnProperty.call(message, "phaseC"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.phaseC);
            return writer;
        };

        /**
         * Encodes the specified Angle message, length delimited. Does not implicitly {@link smartelmon.Angle.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.Angle
         * @static
         * @param {smartelmon.IAngle} message Angle message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Angle.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Angle message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.Angle
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.Angle} Angle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Angle.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.Angle();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.phaseA = reader.uint32();
                        break;
                    }
                case 2: {
                        message.phaseB = reader.uint32();
                        break;
                    }
                case 3: {
                        message.phaseC = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Angle message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.Angle
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.Angle} Angle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Angle.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Angle message.
         * @function verify
         * @memberof smartelmon.Angle
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Angle.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.phaseA != null && message.hasOwnProperty("phaseA"))
                if (!$util.isInteger(message.phaseA))
                    return "phaseA: integer expected";
            if (message.phaseB != null && message.hasOwnProperty("phaseB"))
                if (!$util.isInteger(message.phaseB))
                    return "phaseB: integer expected";
            if (message.phaseC != null && message.hasOwnProperty("phaseC"))
                if (!$util.isInteger(message.phaseC))
                    return "phaseC: integer expected";
            return null;
        };

        /**
         * Creates an Angle message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.Angle
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.Angle} Angle
         */
        Angle.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.Angle)
                return object;
            var message = new $root.smartelmon.Angle();
            if (object.phaseA != null)
                message.phaseA = object.phaseA >>> 0;
            if (object.phaseB != null)
                message.phaseB = object.phaseB >>> 0;
            if (object.phaseC != null)
                message.phaseC = object.phaseC >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an Angle message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.Angle
         * @static
         * @param {smartelmon.Angle} message Angle
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Angle.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.phaseA = 0;
                object.phaseB = 0;
                object.phaseC = 0;
            }
            if (message.phaseA != null && message.hasOwnProperty("phaseA"))
                object.phaseA = message.phaseA;
            if (message.phaseB != null && message.hasOwnProperty("phaseB"))
                object.phaseB = message.phaseB;
            if (message.phaseC != null && message.hasOwnProperty("phaseC"))
                object.phaseC = message.phaseC;
            return object;
        };

        /**
         * Converts this Angle to JSON.
         * @function toJSON
         * @memberof smartelmon.Angle
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Angle.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Angle
         * @function getTypeUrl
         * @memberof smartelmon.Angle
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Angle.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.Angle";
        };

        return Angle;
    })();

    smartelmon.Energy = (function() {

        /**
         * Properties of an Energy.
         * @memberof smartelmon
         * @interface IEnergy
         * @property {number|null} [absorptiveActive] Energy absorptiveActive
         * @property {number|null} [releaseActive] Energy releaseActive
         * @property {number|null} [inductiveReactive] Energy inductiveReactive
         * @property {number|null} [capasitiveReactive] Energy capasitiveReactive
         */

        /**
         * Constructs a new Energy.
         * @memberof smartelmon
         * @classdesc Represents an Energy.
         * @implements IEnergy
         * @constructor
         * @param {smartelmon.IEnergy=} [properties] Properties to set
         */
        function Energy(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Energy absorptiveActive.
         * @member {number} absorptiveActive
         * @memberof smartelmon.Energy
         * @instance
         */
        Energy.prototype.absorptiveActive = 0;

        /**
         * Energy releaseActive.
         * @member {number} releaseActive
         * @memberof smartelmon.Energy
         * @instance
         */
        Energy.prototype.releaseActive = 0;

        /**
         * Energy inductiveReactive.
         * @member {number} inductiveReactive
         * @memberof smartelmon.Energy
         * @instance
         */
        Energy.prototype.inductiveReactive = 0;

        /**
         * Energy capasitiveReactive.
         * @member {number} capasitiveReactive
         * @memberof smartelmon.Energy
         * @instance
         */
        Energy.prototype.capasitiveReactive = 0;

        /**
         * Creates a new Energy instance using the specified properties.
         * @function create
         * @memberof smartelmon.Energy
         * @static
         * @param {smartelmon.IEnergy=} [properties] Properties to set
         * @returns {smartelmon.Energy} Energy instance
         */
        Energy.create = function create(properties) {
            return new Energy(properties);
        };

        /**
         * Encodes the specified Energy message. Does not implicitly {@link smartelmon.Energy.verify|verify} messages.
         * @function encode
         * @memberof smartelmon.Energy
         * @static
         * @param {smartelmon.IEnergy} message Energy message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Energy.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.absorptiveActive != null && Object.hasOwnProperty.call(message, "absorptiveActive"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.absorptiveActive);
            if (message.releaseActive != null && Object.hasOwnProperty.call(message, "releaseActive"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.releaseActive);
            if (message.inductiveReactive != null && Object.hasOwnProperty.call(message, "inductiveReactive"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.inductiveReactive);
            if (message.capasitiveReactive != null && Object.hasOwnProperty.call(message, "capasitiveReactive"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.capasitiveReactive);
            return writer;
        };

        /**
         * Encodes the specified Energy message, length delimited. Does not implicitly {@link smartelmon.Energy.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartelmon.Energy
         * @static
         * @param {smartelmon.IEnergy} message Energy message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Energy.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Energy message from the specified reader or buffer.
         * @function decode
         * @memberof smartelmon.Energy
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartelmon.Energy} Energy
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Energy.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartelmon.Energy();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.absorptiveActive = reader.uint32();
                        break;
                    }
                case 2: {
                        message.releaseActive = reader.uint32();
                        break;
                    }
                case 3: {
                        message.inductiveReactive = reader.uint32();
                        break;
                    }
                case 4: {
                        message.capasitiveReactive = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Energy message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartelmon.Energy
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartelmon.Energy} Energy
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Energy.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Energy message.
         * @function verify
         * @memberof smartelmon.Energy
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Energy.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.absorptiveActive != null && message.hasOwnProperty("absorptiveActive"))
                if (!$util.isInteger(message.absorptiveActive))
                    return "absorptiveActive: integer expected";
            if (message.releaseActive != null && message.hasOwnProperty("releaseActive"))
                if (!$util.isInteger(message.releaseActive))
                    return "releaseActive: integer expected";
            if (message.inductiveReactive != null && message.hasOwnProperty("inductiveReactive"))
                if (!$util.isInteger(message.inductiveReactive))
                    return "inductiveReactive: integer expected";
            if (message.capasitiveReactive != null && message.hasOwnProperty("capasitiveReactive"))
                if (!$util.isInteger(message.capasitiveReactive))
                    return "capasitiveReactive: integer expected";
            return null;
        };

        /**
         * Creates an Energy message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartelmon.Energy
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartelmon.Energy} Energy
         */
        Energy.fromObject = function fromObject(object) {
            if (object instanceof $root.smartelmon.Energy)
                return object;
            var message = new $root.smartelmon.Energy();
            if (object.absorptiveActive != null)
                message.absorptiveActive = object.absorptiveActive >>> 0;
            if (object.releaseActive != null)
                message.releaseActive = object.releaseActive >>> 0;
            if (object.inductiveReactive != null)
                message.inductiveReactive = object.inductiveReactive >>> 0;
            if (object.capasitiveReactive != null)
                message.capasitiveReactive = object.capasitiveReactive >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an Energy message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartelmon.Energy
         * @static
         * @param {smartelmon.Energy} message Energy
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Energy.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.absorptiveActive = 0;
                object.releaseActive = 0;
                object.inductiveReactive = 0;
                object.capasitiveReactive = 0;
            }
            if (message.absorptiveActive != null && message.hasOwnProperty("absorptiveActive"))
                object.absorptiveActive = message.absorptiveActive;
            if (message.releaseActive != null && message.hasOwnProperty("releaseActive"))
                object.releaseActive = message.releaseActive;
            if (message.inductiveReactive != null && message.hasOwnProperty("inductiveReactive"))
                object.inductiveReactive = message.inductiveReactive;
            if (message.capasitiveReactive != null && message.hasOwnProperty("capasitiveReactive"))
                object.capasitiveReactive = message.capasitiveReactive;
            return object;
        };

        /**
         * Converts this Energy to JSON.
         * @function toJSON
         * @memberof smartelmon.Energy
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Energy.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Energy
         * @function getTypeUrl
         * @memberof smartelmon.Energy
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Energy.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartelmon.Energy";
        };

        return Energy;
    })();

    return smartelmon;
})();

$root.smartmonitor = (function() {

    /**
     * Namespace smartmonitor.
     * @exports smartmonitor
     * @namespace
     */
    var smartmonitor = {};

    smartmonitor.MonitorContent = (function() {

        /**
         * Properties of a MonitorContent.
         * @memberof smartmonitor
         * @interface IMonitorContent
         * @property {Uint8Array|null} [meta] MonitorContent meta
         * @property {commoniot.IInfoDevice|null} [infoDevice] MonitorContent infoDevice
         * @property {commoniot.IInfoFarm|null} [infoFarm] MonitorContent infoFarm
         * @property {commoniot.IStartCycle|null} [startCycle] MonitorContent startCycle
         * @property {commoniot.IStopCycle|null} [stopCycle] MonitorContent stopCycle
         * @property {commoniot.IReset|null} [reset] MonitorContent reset
         * @property {commoniot.IPing|null} [ping] MonitorContent ping
         * @property {commoniot.IOta|null} [ota] MonitorContent ota
         * @property {sensor.IMapSensor|null} [mapSensor] MonitorContent mapSensor
         * @property {commoniot.IMapDevice|null} [mapDevice] MonitorContent mapDevice
         * @property {commoniot.IReportSetting|null} [reportSetting] MonitorContent reportSetting
         * @property {smartmonitor.IMonitorData|null} [monitorData] MonitorContent monitorData
         * @property {smartmonitor.IMonitorStatus|null} [monitorStatus] MonitorContent monitorStatus
         * @property {smartmonitor.IstoreR0|null} [storeR0] MonitorContent storeR0
         * @property {smartmonitor.IDiagnosticsData|null} [diagnosticsData] MonitorContent diagnosticsData
         * @property {commoniot.IError|null} [error] MonitorContent error
         */

        /**
         * Constructs a new MonitorContent.
         * @memberof smartmonitor
         * @classdesc Represents a MonitorContent.
         * @implements IMonitorContent
         * @constructor
         * @param {smartmonitor.IMonitorContent=} [properties] Properties to set
         */
        function MonitorContent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MonitorContent meta.
         * @member {Uint8Array} meta
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.meta = $util.newBuffer([]);

        /**
         * MonitorContent infoDevice.
         * @member {commoniot.IInfoDevice|null|undefined} infoDevice
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.infoDevice = null;

        /**
         * MonitorContent infoFarm.
         * @member {commoniot.IInfoFarm|null|undefined} infoFarm
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.infoFarm = null;

        /**
         * MonitorContent startCycle.
         * @member {commoniot.IStartCycle|null|undefined} startCycle
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.startCycle = null;

        /**
         * MonitorContent stopCycle.
         * @member {commoniot.IStopCycle|null|undefined} stopCycle
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.stopCycle = null;

        /**
         * MonitorContent reset.
         * @member {commoniot.IReset|null|undefined} reset
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.reset = null;

        /**
         * MonitorContent ping.
         * @member {commoniot.IPing|null|undefined} ping
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.ping = null;

        /**
         * MonitorContent ota.
         * @member {commoniot.IOta|null|undefined} ota
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.ota = null;

        /**
         * MonitorContent mapSensor.
         * @member {sensor.IMapSensor|null|undefined} mapSensor
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.mapSensor = null;

        /**
         * MonitorContent mapDevice.
         * @member {commoniot.IMapDevice|null|undefined} mapDevice
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.mapDevice = null;

        /**
         * MonitorContent reportSetting.
         * @member {commoniot.IReportSetting|null|undefined} reportSetting
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.reportSetting = null;

        /**
         * MonitorContent monitorData.
         * @member {smartmonitor.IMonitorData|null|undefined} monitorData
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.monitorData = null;

        /**
         * MonitorContent monitorStatus.
         * @member {smartmonitor.IMonitorStatus|null|undefined} monitorStatus
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.monitorStatus = null;

        /**
         * MonitorContent storeR0.
         * @member {smartmonitor.IstoreR0|null|undefined} storeR0
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.storeR0 = null;

        /**
         * MonitorContent diagnosticsData.
         * @member {smartmonitor.IDiagnosticsData|null|undefined} diagnosticsData
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.diagnosticsData = null;

        /**
         * MonitorContent error.
         * @member {commoniot.IError|null|undefined} error
         * @memberof smartmonitor.MonitorContent
         * @instance
         */
        MonitorContent.prototype.error = null;

        /**
         * Creates a new MonitorContent instance using the specified properties.
         * @function create
         * @memberof smartmonitor.MonitorContent
         * @static
         * @param {smartmonitor.IMonitorContent=} [properties] Properties to set
         * @returns {smartmonitor.MonitorContent} MonitorContent instance
         */
        MonitorContent.create = function create(properties) {
            return new MonitorContent(properties);
        };

        /**
         * Encodes the specified MonitorContent message. Does not implicitly {@link smartmonitor.MonitorContent.verify|verify} messages.
         * @function encode
         * @memberof smartmonitor.MonitorContent
         * @static
         * @param {smartmonitor.IMonitorContent} message MonitorContent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonitorContent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.meta);
            if (message.infoDevice != null && Object.hasOwnProperty.call(message, "infoDevice"))
                $root.commoniot.InfoDevice.encode(message.infoDevice, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.infoFarm != null && Object.hasOwnProperty.call(message, "infoFarm"))
                $root.commoniot.InfoFarm.encode(message.infoFarm, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.startCycle != null && Object.hasOwnProperty.call(message, "startCycle"))
                $root.commoniot.StartCycle.encode(message.startCycle, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.stopCycle != null && Object.hasOwnProperty.call(message, "stopCycle"))
                $root.commoniot.StopCycle.encode(message.stopCycle, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.reset != null && Object.hasOwnProperty.call(message, "reset"))
                $root.commoniot.Reset.encode(message.reset, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.ping != null && Object.hasOwnProperty.call(message, "ping"))
                $root.commoniot.Ping.encode(message.ping, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.ota != null && Object.hasOwnProperty.call(message, "ota"))
                $root.commoniot.Ota.encode(message.ota, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.mapSensor != null && Object.hasOwnProperty.call(message, "mapSensor"))
                $root.sensor.MapSensor.encode(message.mapSensor, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.mapDevice != null && Object.hasOwnProperty.call(message, "mapDevice"))
                $root.commoniot.MapDevice.encode(message.mapDevice, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.reportSetting != null && Object.hasOwnProperty.call(message, "reportSetting"))
                $root.commoniot.ReportSetting.encode(message.reportSetting, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.monitorData != null && Object.hasOwnProperty.call(message, "monitorData"))
                $root.smartmonitor.MonitorData.encode(message.monitorData, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.monitorStatus != null && Object.hasOwnProperty.call(message, "monitorStatus"))
                $root.smartmonitor.MonitorStatus.encode(message.monitorStatus, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.storeR0 != null && Object.hasOwnProperty.call(message, "storeR0"))
                $root.smartmonitor.storeR0.encode(message.storeR0, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.diagnosticsData != null && Object.hasOwnProperty.call(message, "diagnosticsData"))
                $root.smartmonitor.DiagnosticsData.encode(message.diagnosticsData, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                $root.commoniot.Error.encode(message.error, writer.uint32(/* id 50, wireType 2 =*/402).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MonitorContent message, length delimited. Does not implicitly {@link smartmonitor.MonitorContent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitor.MonitorContent
         * @static
         * @param {smartmonitor.IMonitorContent} message MonitorContent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonitorContent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MonitorContent message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitor.MonitorContent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitor.MonitorContent} MonitorContent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonitorContent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitor.MonitorContent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.meta = reader.bytes();
                        break;
                    }
                case 2: {
                        message.infoDevice = $root.commoniot.InfoDevice.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.infoFarm = $root.commoniot.InfoFarm.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.startCycle = $root.commoniot.StartCycle.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.stopCycle = $root.commoniot.StopCycle.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.reset = $root.commoniot.Reset.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.ping = $root.commoniot.Ping.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.ota = $root.commoniot.Ota.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        message.mapSensor = $root.sensor.MapSensor.decode(reader, reader.uint32());
                        break;
                    }
                case 10: {
                        message.mapDevice = $root.commoniot.MapDevice.decode(reader, reader.uint32());
                        break;
                    }
                case 11: {
                        message.reportSetting = $root.commoniot.ReportSetting.decode(reader, reader.uint32());
                        break;
                    }
                case 12: {
                        message.monitorData = $root.smartmonitor.MonitorData.decode(reader, reader.uint32());
                        break;
                    }
                case 13: {
                        message.monitorStatus = $root.smartmonitor.MonitorStatus.decode(reader, reader.uint32());
                        break;
                    }
                case 14: {
                        message.storeR0 = $root.smartmonitor.storeR0.decode(reader, reader.uint32());
                        break;
                    }
                case 15: {
                        message.diagnosticsData = $root.smartmonitor.DiagnosticsData.decode(reader, reader.uint32());
                        break;
                    }
                case 50: {
                        message.error = $root.commoniot.Error.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MonitorContent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitor.MonitorContent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitor.MonitorContent} MonitorContent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonitorContent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MonitorContent message.
         * @function verify
         * @memberof smartmonitor.MonitorContent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MonitorContent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.meta != null && message.hasOwnProperty("meta"))
                if (!(message.meta && typeof message.meta.length === "number" || $util.isString(message.meta)))
                    return "meta: buffer expected";
            if (message.infoDevice != null && message.hasOwnProperty("infoDevice")) {
                var error = $root.commoniot.InfoDevice.verify(message.infoDevice);
                if (error)
                    return "infoDevice." + error;
            }
            if (message.infoFarm != null && message.hasOwnProperty("infoFarm")) {
                var error = $root.commoniot.InfoFarm.verify(message.infoFarm);
                if (error)
                    return "infoFarm." + error;
            }
            if (message.startCycle != null && message.hasOwnProperty("startCycle")) {
                var error = $root.commoniot.StartCycle.verify(message.startCycle);
                if (error)
                    return "startCycle." + error;
            }
            if (message.stopCycle != null && message.hasOwnProperty("stopCycle")) {
                var error = $root.commoniot.StopCycle.verify(message.stopCycle);
                if (error)
                    return "stopCycle." + error;
            }
            if (message.reset != null && message.hasOwnProperty("reset")) {
                var error = $root.commoniot.Reset.verify(message.reset);
                if (error)
                    return "reset." + error;
            }
            if (message.ping != null && message.hasOwnProperty("ping")) {
                var error = $root.commoniot.Ping.verify(message.ping);
                if (error)
                    return "ping." + error;
            }
            if (message.ota != null && message.hasOwnProperty("ota")) {
                var error = $root.commoniot.Ota.verify(message.ota);
                if (error)
                    return "ota." + error;
            }
            if (message.mapSensor != null && message.hasOwnProperty("mapSensor")) {
                var error = $root.sensor.MapSensor.verify(message.mapSensor);
                if (error)
                    return "mapSensor." + error;
            }
            if (message.mapDevice != null && message.hasOwnProperty("mapDevice")) {
                var error = $root.commoniot.MapDevice.verify(message.mapDevice);
                if (error)
                    return "mapDevice." + error;
            }
            if (message.reportSetting != null && message.hasOwnProperty("reportSetting")) {
                var error = $root.commoniot.ReportSetting.verify(message.reportSetting);
                if (error)
                    return "reportSetting." + error;
            }
            if (message.monitorData != null && message.hasOwnProperty("monitorData")) {
                var error = $root.smartmonitor.MonitorData.verify(message.monitorData);
                if (error)
                    return "monitorData." + error;
            }
            if (message.monitorStatus != null && message.hasOwnProperty("monitorStatus")) {
                var error = $root.smartmonitor.MonitorStatus.verify(message.monitorStatus);
                if (error)
                    return "monitorStatus." + error;
            }
            if (message.storeR0 != null && message.hasOwnProperty("storeR0")) {
                var error = $root.smartmonitor.storeR0.verify(message.storeR0);
                if (error)
                    return "storeR0." + error;
            }
            if (message.diagnosticsData != null && message.hasOwnProperty("diagnosticsData")) {
                var error = $root.smartmonitor.DiagnosticsData.verify(message.diagnosticsData);
                if (error)
                    return "diagnosticsData." + error;
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                var error = $root.commoniot.Error.verify(message.error);
                if (error)
                    return "error." + error;
            }
            return null;
        };

        /**
         * Creates a MonitorContent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitor.MonitorContent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitor.MonitorContent} MonitorContent
         */
        MonitorContent.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitor.MonitorContent)
                return object;
            var message = new $root.smartmonitor.MonitorContent();
            if (object.meta != null)
                if (typeof object.meta === "string")
                    $util.base64.decode(object.meta, message.meta = $util.newBuffer($util.base64.length(object.meta)), 0);
                else if (object.meta.length >= 0)
                    message.meta = object.meta;
            if (object.infoDevice != null) {
                if (typeof object.infoDevice !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.infoDevice: object expected");
                message.infoDevice = $root.commoniot.InfoDevice.fromObject(object.infoDevice);
            }
            if (object.infoFarm != null) {
                if (typeof object.infoFarm !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.infoFarm: object expected");
                message.infoFarm = $root.commoniot.InfoFarm.fromObject(object.infoFarm);
            }
            if (object.startCycle != null) {
                if (typeof object.startCycle !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.startCycle: object expected");
                message.startCycle = $root.commoniot.StartCycle.fromObject(object.startCycle);
            }
            if (object.stopCycle != null) {
                if (typeof object.stopCycle !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.stopCycle: object expected");
                message.stopCycle = $root.commoniot.StopCycle.fromObject(object.stopCycle);
            }
            if (object.reset != null) {
                if (typeof object.reset !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.reset: object expected");
                message.reset = $root.commoniot.Reset.fromObject(object.reset);
            }
            if (object.ping != null) {
                if (typeof object.ping !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.ping: object expected");
                message.ping = $root.commoniot.Ping.fromObject(object.ping);
            }
            if (object.ota != null) {
                if (typeof object.ota !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.ota: object expected");
                message.ota = $root.commoniot.Ota.fromObject(object.ota);
            }
            if (object.mapSensor != null) {
                if (typeof object.mapSensor !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.mapSensor: object expected");
                message.mapSensor = $root.sensor.MapSensor.fromObject(object.mapSensor);
            }
            if (object.mapDevice != null) {
                if (typeof object.mapDevice !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.mapDevice: object expected");
                message.mapDevice = $root.commoniot.MapDevice.fromObject(object.mapDevice);
            }
            if (object.reportSetting != null) {
                if (typeof object.reportSetting !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.reportSetting: object expected");
                message.reportSetting = $root.commoniot.ReportSetting.fromObject(object.reportSetting);
            }
            if (object.monitorData != null) {
                if (typeof object.monitorData !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.monitorData: object expected");
                message.monitorData = $root.smartmonitor.MonitorData.fromObject(object.monitorData);
            }
            if (object.monitorStatus != null) {
                if (typeof object.monitorStatus !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.monitorStatus: object expected");
                message.monitorStatus = $root.smartmonitor.MonitorStatus.fromObject(object.monitorStatus);
            }
            if (object.storeR0 != null) {
                if (typeof object.storeR0 !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.storeR0: object expected");
                message.storeR0 = $root.smartmonitor.storeR0.fromObject(object.storeR0);
            }
            if (object.diagnosticsData != null) {
                if (typeof object.diagnosticsData !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.diagnosticsData: object expected");
                message.diagnosticsData = $root.smartmonitor.DiagnosticsData.fromObject(object.diagnosticsData);
            }
            if (object.error != null) {
                if (typeof object.error !== "object")
                    throw TypeError(".smartmonitor.MonitorContent.error: object expected");
                message.error = $root.commoniot.Error.fromObject(object.error);
            }
            return message;
        };

        /**
         * Creates a plain object from a MonitorContent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitor.MonitorContent
         * @static
         * @param {smartmonitor.MonitorContent} message MonitorContent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MonitorContent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.meta = "";
                else {
                    object.meta = [];
                    if (options.bytes !== Array)
                        object.meta = $util.newBuffer(object.meta);
                }
                object.infoDevice = null;
                object.infoFarm = null;
                object.startCycle = null;
                object.stopCycle = null;
                object.reset = null;
                object.ping = null;
                object.ota = null;
                object.mapSensor = null;
                object.mapDevice = null;
                object.reportSetting = null;
                object.monitorData = null;
                object.monitorStatus = null;
                object.storeR0 = null;
                object.diagnosticsData = null;
                object.error = null;
            }
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = options.bytes === String ? $util.base64.encode(message.meta, 0, message.meta.length) : options.bytes === Array ? Array.prototype.slice.call(message.meta) : message.meta;
            if (message.infoDevice != null && message.hasOwnProperty("infoDevice"))
                object.infoDevice = $root.commoniot.InfoDevice.toObject(message.infoDevice, options);
            if (message.infoFarm != null && message.hasOwnProperty("infoFarm"))
                object.infoFarm = $root.commoniot.InfoFarm.toObject(message.infoFarm, options);
            if (message.startCycle != null && message.hasOwnProperty("startCycle"))
                object.startCycle = $root.commoniot.StartCycle.toObject(message.startCycle, options);
            if (message.stopCycle != null && message.hasOwnProperty("stopCycle"))
                object.stopCycle = $root.commoniot.StopCycle.toObject(message.stopCycle, options);
            if (message.reset != null && message.hasOwnProperty("reset"))
                object.reset = $root.commoniot.Reset.toObject(message.reset, options);
            if (message.ping != null && message.hasOwnProperty("ping"))
                object.ping = $root.commoniot.Ping.toObject(message.ping, options);
            if (message.ota != null && message.hasOwnProperty("ota"))
                object.ota = $root.commoniot.Ota.toObject(message.ota, options);
            if (message.mapSensor != null && message.hasOwnProperty("mapSensor"))
                object.mapSensor = $root.sensor.MapSensor.toObject(message.mapSensor, options);
            if (message.mapDevice != null && message.hasOwnProperty("mapDevice"))
                object.mapDevice = $root.commoniot.MapDevice.toObject(message.mapDevice, options);
            if (message.reportSetting != null && message.hasOwnProperty("reportSetting"))
                object.reportSetting = $root.commoniot.ReportSetting.toObject(message.reportSetting, options);
            if (message.monitorData != null && message.hasOwnProperty("monitorData"))
                object.monitorData = $root.smartmonitor.MonitorData.toObject(message.monitorData, options);
            if (message.monitorStatus != null && message.hasOwnProperty("monitorStatus"))
                object.monitorStatus = $root.smartmonitor.MonitorStatus.toObject(message.monitorStatus, options);
            if (message.storeR0 != null && message.hasOwnProperty("storeR0"))
                object.storeR0 = $root.smartmonitor.storeR0.toObject(message.storeR0, options);
            if (message.diagnosticsData != null && message.hasOwnProperty("diagnosticsData"))
                object.diagnosticsData = $root.smartmonitor.DiagnosticsData.toObject(message.diagnosticsData, options);
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = $root.commoniot.Error.toObject(message.error, options);
            return object;
        };

        /**
         * Converts this MonitorContent to JSON.
         * @function toJSON
         * @memberof smartmonitor.MonitorContent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MonitorContent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MonitorContent
         * @function getTypeUrl
         * @memberof smartmonitor.MonitorContent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MonitorContent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitor.MonitorContent";
        };

        return MonitorContent;
    })();

    smartmonitor.MonitorData = (function() {

        /**
         * Properties of a MonitorData.
         * @memberof smartmonitor
         * @interface IMonitorData
         * @property {sensor.ISensor|null} [local] MonitorData local
         * @property {sensor.ISensor|null} [remote] MonitorData remote
         * @property {number|null} [rssi] MonitorData rssi
         */

        /**
         * Constructs a new MonitorData.
         * @memberof smartmonitor
         * @classdesc Represents a MonitorData.
         * @implements IMonitorData
         * @constructor
         * @param {smartmonitor.IMonitorData=} [properties] Properties to set
         */
        function MonitorData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MonitorData local.
         * @member {sensor.ISensor|null|undefined} local
         * @memberof smartmonitor.MonitorData
         * @instance
         */
        MonitorData.prototype.local = null;

        /**
         * MonitorData remote.
         * @member {sensor.ISensor|null|undefined} remote
         * @memberof smartmonitor.MonitorData
         * @instance
         */
        MonitorData.prototype.remote = null;

        /**
         * MonitorData rssi.
         * @member {number} rssi
         * @memberof smartmonitor.MonitorData
         * @instance
         */
        MonitorData.prototype.rssi = 0;

        /**
         * Creates a new MonitorData instance using the specified properties.
         * @function create
         * @memberof smartmonitor.MonitorData
         * @static
         * @param {smartmonitor.IMonitorData=} [properties] Properties to set
         * @returns {smartmonitor.MonitorData} MonitorData instance
         */
        MonitorData.create = function create(properties) {
            return new MonitorData(properties);
        };

        /**
         * Encodes the specified MonitorData message. Does not implicitly {@link smartmonitor.MonitorData.verify|verify} messages.
         * @function encode
         * @memberof smartmonitor.MonitorData
         * @static
         * @param {smartmonitor.IMonitorData} message MonitorData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonitorData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.local != null && Object.hasOwnProperty.call(message, "local"))
                $root.sensor.Sensor.encode(message.local, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.remote != null && Object.hasOwnProperty.call(message, "remote"))
                $root.sensor.Sensor.encode(message.remote, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.rssi != null && Object.hasOwnProperty.call(message, "rssi"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.rssi);
            return writer;
        };

        /**
         * Encodes the specified MonitorData message, length delimited. Does not implicitly {@link smartmonitor.MonitorData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitor.MonitorData
         * @static
         * @param {smartmonitor.IMonitorData} message MonitorData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonitorData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MonitorData message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitor.MonitorData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitor.MonitorData} MonitorData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonitorData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitor.MonitorData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.local = $root.sensor.Sensor.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.remote = $root.sensor.Sensor.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.rssi = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MonitorData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitor.MonitorData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitor.MonitorData} MonitorData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonitorData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MonitorData message.
         * @function verify
         * @memberof smartmonitor.MonitorData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MonitorData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.local != null && message.hasOwnProperty("local")) {
                var error = $root.sensor.Sensor.verify(message.local);
                if (error)
                    return "local." + error;
            }
            if (message.remote != null && message.hasOwnProperty("remote")) {
                var error = $root.sensor.Sensor.verify(message.remote);
                if (error)
                    return "remote." + error;
            }
            if (message.rssi != null && message.hasOwnProperty("rssi"))
                if (!$util.isInteger(message.rssi))
                    return "rssi: integer expected";
            return null;
        };

        /**
         * Creates a MonitorData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitor.MonitorData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitor.MonitorData} MonitorData
         */
        MonitorData.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitor.MonitorData)
                return object;
            var message = new $root.smartmonitor.MonitorData();
            if (object.local != null) {
                if (typeof object.local !== "object")
                    throw TypeError(".smartmonitor.MonitorData.local: object expected");
                message.local = $root.sensor.Sensor.fromObject(object.local);
            }
            if (object.remote != null) {
                if (typeof object.remote !== "object")
                    throw TypeError(".smartmonitor.MonitorData.remote: object expected");
                message.remote = $root.sensor.Sensor.fromObject(object.remote);
            }
            if (object.rssi != null)
                message.rssi = object.rssi >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a MonitorData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitor.MonitorData
         * @static
         * @param {smartmonitor.MonitorData} message MonitorData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MonitorData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.local = null;
                object.remote = null;
                object.rssi = 0;
            }
            if (message.local != null && message.hasOwnProperty("local"))
                object.local = $root.sensor.Sensor.toObject(message.local, options);
            if (message.remote != null && message.hasOwnProperty("remote"))
                object.remote = $root.sensor.Sensor.toObject(message.remote, options);
            if (message.rssi != null && message.hasOwnProperty("rssi"))
                object.rssi = message.rssi;
            return object;
        };

        /**
         * Converts this MonitorData to JSON.
         * @function toJSON
         * @memberof smartmonitor.MonitorData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MonitorData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MonitorData
         * @function getTypeUrl
         * @memberof smartmonitor.MonitorData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MonitorData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitor.MonitorData";
        };

        return MonitorData;
    })();

    smartmonitor.MonitorStatus = (function() {

        /**
         * Properties of a MonitorStatus.
         * @memberof smartmonitor
         * @interface IMonitorStatus
         * @property {number|null} [status] MonitorStatus status
         */

        /**
         * Constructs a new MonitorStatus.
         * @memberof smartmonitor
         * @classdesc Represents a MonitorStatus.
         * @implements IMonitorStatus
         * @constructor
         * @param {smartmonitor.IMonitorStatus=} [properties] Properties to set
         */
        function MonitorStatus(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MonitorStatus status.
         * @member {number} status
         * @memberof smartmonitor.MonitorStatus
         * @instance
         */
        MonitorStatus.prototype.status = 0;

        /**
         * Creates a new MonitorStatus instance using the specified properties.
         * @function create
         * @memberof smartmonitor.MonitorStatus
         * @static
         * @param {smartmonitor.IMonitorStatus=} [properties] Properties to set
         * @returns {smartmonitor.MonitorStatus} MonitorStatus instance
         */
        MonitorStatus.create = function create(properties) {
            return new MonitorStatus(properties);
        };

        /**
         * Encodes the specified MonitorStatus message. Does not implicitly {@link smartmonitor.MonitorStatus.verify|verify} messages.
         * @function encode
         * @memberof smartmonitor.MonitorStatus
         * @static
         * @param {smartmonitor.IMonitorStatus} message MonitorStatus message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonitorStatus.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.status);
            return writer;
        };

        /**
         * Encodes the specified MonitorStatus message, length delimited. Does not implicitly {@link smartmonitor.MonitorStatus.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitor.MonitorStatus
         * @static
         * @param {smartmonitor.IMonitorStatus} message MonitorStatus message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MonitorStatus.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MonitorStatus message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitor.MonitorStatus
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitor.MonitorStatus} MonitorStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonitorStatus.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitor.MonitorStatus();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.status = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MonitorStatus message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitor.MonitorStatus
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitor.MonitorStatus} MonitorStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MonitorStatus.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MonitorStatus message.
         * @function verify
         * @memberof smartmonitor.MonitorStatus
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MonitorStatus.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            return null;
        };

        /**
         * Creates a MonitorStatus message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitor.MonitorStatus
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitor.MonitorStatus} MonitorStatus
         */
        MonitorStatus.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitor.MonitorStatus)
                return object;
            var message = new $root.smartmonitor.MonitorStatus();
            if (object.status != null)
                message.status = object.status >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a MonitorStatus message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitor.MonitorStatus
         * @static
         * @param {smartmonitor.MonitorStatus} message MonitorStatus
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MonitorStatus.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.status = 0;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            return object;
        };

        /**
         * Converts this MonitorStatus to JSON.
         * @function toJSON
         * @memberof smartmonitor.MonitorStatus
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MonitorStatus.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MonitorStatus
         * @function getTypeUrl
         * @memberof smartmonitor.MonitorStatus
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MonitorStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitor.MonitorStatus";
        };

        return MonitorStatus;
    })();

    smartmonitor.storeR0 = (function() {

        /**
         * Properties of a storeR0.
         * @memberof smartmonitor
         * @interface IstoreR0
         * @property {number|null} [r0Value] storeR0 r0Value
         */

        /**
         * Constructs a new storeR0.
         * @memberof smartmonitor
         * @classdesc Represents a storeR0.
         * @implements IstoreR0
         * @constructor
         * @param {smartmonitor.IstoreR0=} [properties] Properties to set
         */
        function storeR0(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * storeR0 r0Value.
         * @member {number} r0Value
         * @memberof smartmonitor.storeR0
         * @instance
         */
        storeR0.prototype.r0Value = 0;

        /**
         * Creates a new storeR0 instance using the specified properties.
         * @function create
         * @memberof smartmonitor.storeR0
         * @static
         * @param {smartmonitor.IstoreR0=} [properties] Properties to set
         * @returns {smartmonitor.storeR0} storeR0 instance
         */
        storeR0.create = function create(properties) {
            return new storeR0(properties);
        };

        /**
         * Encodes the specified storeR0 message. Does not implicitly {@link smartmonitor.storeR0.verify|verify} messages.
         * @function encode
         * @memberof smartmonitor.storeR0
         * @static
         * @param {smartmonitor.IstoreR0} message storeR0 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        storeR0.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.r0Value != null && Object.hasOwnProperty.call(message, "r0Value"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.r0Value);
            return writer;
        };

        /**
         * Encodes the specified storeR0 message, length delimited. Does not implicitly {@link smartmonitor.storeR0.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitor.storeR0
         * @static
         * @param {smartmonitor.IstoreR0} message storeR0 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        storeR0.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a storeR0 message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitor.storeR0
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitor.storeR0} storeR0
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        storeR0.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitor.storeR0();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.r0Value = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a storeR0 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitor.storeR0
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitor.storeR0} storeR0
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        storeR0.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a storeR0 message.
         * @function verify
         * @memberof smartmonitor.storeR0
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        storeR0.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.r0Value != null && message.hasOwnProperty("r0Value"))
                if (!$util.isInteger(message.r0Value))
                    return "r0Value: integer expected";
            return null;
        };

        /**
         * Creates a storeR0 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitor.storeR0
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitor.storeR0} storeR0
         */
        storeR0.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitor.storeR0)
                return object;
            var message = new $root.smartmonitor.storeR0();
            if (object.r0Value != null)
                message.r0Value = object.r0Value >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a storeR0 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitor.storeR0
         * @static
         * @param {smartmonitor.storeR0} message storeR0
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        storeR0.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.r0Value = 0;
            if (message.r0Value != null && message.hasOwnProperty("r0Value"))
                object.r0Value = message.r0Value;
            return object;
        };

        /**
         * Converts this storeR0 to JSON.
         * @function toJSON
         * @memberof smartmonitor.storeR0
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        storeR0.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for storeR0
         * @function getTypeUrl
         * @memberof smartmonitor.storeR0
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        storeR0.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitor.storeR0";
        };

        return storeR0;
    })();

    smartmonitor.DiagnosticsData = (function() {

        /**
         * Properties of a DiagnosticsData.
         * @memberof smartmonitor
         * @interface IDiagnosticsData
         * @property {number|Long|null} [unixTimeData] DiagnosticsData unixTimeData
         * @property {number|null} [pingResponseTime] DiagnosticsData pingResponseTime
         * @property {number|null} [wifiRSSI] DiagnosticsData wifiRSSI
         * @property {number|null} [minFreeHeapSinceBoot] DiagnosticsData minFreeHeapSinceBoot
         */

        /**
         * Constructs a new DiagnosticsData.
         * @memberof smartmonitor
         * @classdesc Represents a DiagnosticsData.
         * @implements IDiagnosticsData
         * @constructor
         * @param {smartmonitor.IDiagnosticsData=} [properties] Properties to set
         */
        function DiagnosticsData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DiagnosticsData unixTimeData.
         * @member {number|Long} unixTimeData
         * @memberof smartmonitor.DiagnosticsData
         * @instance
         */
        DiagnosticsData.prototype.unixTimeData = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * DiagnosticsData pingResponseTime.
         * @member {number} pingResponseTime
         * @memberof smartmonitor.DiagnosticsData
         * @instance
         */
        DiagnosticsData.prototype.pingResponseTime = 0;

        /**
         * DiagnosticsData wifiRSSI.
         * @member {number} wifiRSSI
         * @memberof smartmonitor.DiagnosticsData
         * @instance
         */
        DiagnosticsData.prototype.wifiRSSI = 0;

        /**
         * DiagnosticsData minFreeHeapSinceBoot.
         * @member {number} minFreeHeapSinceBoot
         * @memberof smartmonitor.DiagnosticsData
         * @instance
         */
        DiagnosticsData.prototype.minFreeHeapSinceBoot = 0;

        /**
         * Creates a new DiagnosticsData instance using the specified properties.
         * @function create
         * @memberof smartmonitor.DiagnosticsData
         * @static
         * @param {smartmonitor.IDiagnosticsData=} [properties] Properties to set
         * @returns {smartmonitor.DiagnosticsData} DiagnosticsData instance
         */
        DiagnosticsData.create = function create(properties) {
            return new DiagnosticsData(properties);
        };

        /**
         * Encodes the specified DiagnosticsData message. Does not implicitly {@link smartmonitor.DiagnosticsData.verify|verify} messages.
         * @function encode
         * @memberof smartmonitor.DiagnosticsData
         * @static
         * @param {smartmonitor.IDiagnosticsData} message DiagnosticsData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DiagnosticsData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.unixTimeData != null && Object.hasOwnProperty.call(message, "unixTimeData"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.unixTimeData);
            if (message.pingResponseTime != null && Object.hasOwnProperty.call(message, "pingResponseTime"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.pingResponseTime);
            if (message.wifiRSSI != null && Object.hasOwnProperty.call(message, "wifiRSSI"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.wifiRSSI);
            if (message.minFreeHeapSinceBoot != null && Object.hasOwnProperty.call(message, "minFreeHeapSinceBoot"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.minFreeHeapSinceBoot);
            return writer;
        };

        /**
         * Encodes the specified DiagnosticsData message, length delimited. Does not implicitly {@link smartmonitor.DiagnosticsData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitor.DiagnosticsData
         * @static
         * @param {smartmonitor.IDiagnosticsData} message DiagnosticsData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DiagnosticsData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DiagnosticsData message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitor.DiagnosticsData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitor.DiagnosticsData} DiagnosticsData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DiagnosticsData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitor.DiagnosticsData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.unixTimeData = reader.uint64();
                        break;
                    }
                case 2: {
                        message.pingResponseTime = reader.float();
                        break;
                    }
                case 3: {
                        message.wifiRSSI = reader.int32();
                        break;
                    }
                case 4: {
                        message.minFreeHeapSinceBoot = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DiagnosticsData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitor.DiagnosticsData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitor.DiagnosticsData} DiagnosticsData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DiagnosticsData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DiagnosticsData message.
         * @function verify
         * @memberof smartmonitor.DiagnosticsData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DiagnosticsData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.unixTimeData != null && message.hasOwnProperty("unixTimeData"))
                if (!$util.isInteger(message.unixTimeData) && !(message.unixTimeData && $util.isInteger(message.unixTimeData.low) && $util.isInteger(message.unixTimeData.high)))
                    return "unixTimeData: integer|Long expected";
            if (message.pingResponseTime != null && message.hasOwnProperty("pingResponseTime"))
                if (typeof message.pingResponseTime !== "number")
                    return "pingResponseTime: number expected";
            if (message.wifiRSSI != null && message.hasOwnProperty("wifiRSSI"))
                if (!$util.isInteger(message.wifiRSSI))
                    return "wifiRSSI: integer expected";
            if (message.minFreeHeapSinceBoot != null && message.hasOwnProperty("minFreeHeapSinceBoot"))
                if (!$util.isInteger(message.minFreeHeapSinceBoot))
                    return "minFreeHeapSinceBoot: integer expected";
            return null;
        };

        /**
         * Creates a DiagnosticsData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitor.DiagnosticsData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitor.DiagnosticsData} DiagnosticsData
         */
        DiagnosticsData.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitor.DiagnosticsData)
                return object;
            var message = new $root.smartmonitor.DiagnosticsData();
            if (object.unixTimeData != null)
                if ($util.Long)
                    (message.unixTimeData = $util.Long.fromValue(object.unixTimeData)).unsigned = true;
                else if (typeof object.unixTimeData === "string")
                    message.unixTimeData = parseInt(object.unixTimeData, 10);
                else if (typeof object.unixTimeData === "number")
                    message.unixTimeData = object.unixTimeData;
                else if (typeof object.unixTimeData === "object")
                    message.unixTimeData = new $util.LongBits(object.unixTimeData.low >>> 0, object.unixTimeData.high >>> 0).toNumber(true);
            if (object.pingResponseTime != null)
                message.pingResponseTime = Number(object.pingResponseTime);
            if (object.wifiRSSI != null)
                message.wifiRSSI = object.wifiRSSI | 0;
            if (object.minFreeHeapSinceBoot != null)
                message.minFreeHeapSinceBoot = object.minFreeHeapSinceBoot >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a DiagnosticsData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitor.DiagnosticsData
         * @static
         * @param {smartmonitor.DiagnosticsData} message DiagnosticsData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DiagnosticsData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.unixTimeData = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.unixTimeData = options.longs === String ? "0" : 0;
                object.pingResponseTime = 0;
                object.wifiRSSI = 0;
                object.minFreeHeapSinceBoot = 0;
            }
            if (message.unixTimeData != null && message.hasOwnProperty("unixTimeData"))
                if (typeof message.unixTimeData === "number")
                    object.unixTimeData = options.longs === String ? String(message.unixTimeData) : message.unixTimeData;
                else
                    object.unixTimeData = options.longs === String ? $util.Long.prototype.toString.call(message.unixTimeData) : options.longs === Number ? new $util.LongBits(message.unixTimeData.low >>> 0, message.unixTimeData.high >>> 0).toNumber(true) : message.unixTimeData;
            if (message.pingResponseTime != null && message.hasOwnProperty("pingResponseTime"))
                object.pingResponseTime = options.json && !isFinite(message.pingResponseTime) ? String(message.pingResponseTime) : message.pingResponseTime;
            if (message.wifiRSSI != null && message.hasOwnProperty("wifiRSSI"))
                object.wifiRSSI = message.wifiRSSI;
            if (message.minFreeHeapSinceBoot != null && message.hasOwnProperty("minFreeHeapSinceBoot"))
                object.minFreeHeapSinceBoot = message.minFreeHeapSinceBoot;
            return object;
        };

        /**
         * Converts this DiagnosticsData to JSON.
         * @function toJSON
         * @memberof smartmonitor.DiagnosticsData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DiagnosticsData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DiagnosticsData
         * @function getTypeUrl
         * @memberof smartmonitor.DiagnosticsData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DiagnosticsData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitor.DiagnosticsData";
        };

        return DiagnosticsData;
    })();

    return smartmonitor;
})();

$root.smartmonitorsensor = (function() {

    /**
     * Namespace smartmonitorsensor.
     * @exports smartmonitorsensor
     * @namespace
     */
    var smartmonitorsensor = {};

    smartmonitorsensor.MapSensor = (function() {

        /**
         * Properties of a MapSensor.
         * @memberof smartmonitorsensor
         * @interface IMapSensor
         * @property {number|null} [room] MapSensor room
         * @property {Array.<smartmonitorsensor.IXiaomi>|null} [xiaomis] MapSensor xiaomis
         * @property {Array.<smartmonitorsensor.IHoney>|null} [honeys] MapSensor honeys
         * @property {Array.<smartmonitorsensor.IWind>|null} [wind] MapSensor wind
         * @property {number|null} [command] MapSensor command
         */

        /**
         * Constructs a new MapSensor.
         * @memberof smartmonitorsensor
         * @classdesc Represents a MapSensor.
         * @implements IMapSensor
         * @constructor
         * @param {smartmonitorsensor.IMapSensor=} [properties] Properties to set
         */
        function MapSensor(properties) {
            this.xiaomis = [];
            this.honeys = [];
            this.wind = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MapSensor room.
         * @member {number} room
         * @memberof smartmonitorsensor.MapSensor
         * @instance
         */
        MapSensor.prototype.room = 0;

        /**
         * MapSensor xiaomis.
         * @member {Array.<smartmonitorsensor.IXiaomi>} xiaomis
         * @memberof smartmonitorsensor.MapSensor
         * @instance
         */
        MapSensor.prototype.xiaomis = $util.emptyArray;

        /**
         * MapSensor honeys.
         * @member {Array.<smartmonitorsensor.IHoney>} honeys
         * @memberof smartmonitorsensor.MapSensor
         * @instance
         */
        MapSensor.prototype.honeys = $util.emptyArray;

        /**
         * MapSensor wind.
         * @member {Array.<smartmonitorsensor.IWind>} wind
         * @memberof smartmonitorsensor.MapSensor
         * @instance
         */
        MapSensor.prototype.wind = $util.emptyArray;

        /**
         * MapSensor command.
         * @member {number} command
         * @memberof smartmonitorsensor.MapSensor
         * @instance
         */
        MapSensor.prototype.command = 0;

        /**
         * Creates a new MapSensor instance using the specified properties.
         * @function create
         * @memberof smartmonitorsensor.MapSensor
         * @static
         * @param {smartmonitorsensor.IMapSensor=} [properties] Properties to set
         * @returns {smartmonitorsensor.MapSensor} MapSensor instance
         */
        MapSensor.create = function create(properties) {
            return new MapSensor(properties);
        };

        /**
         * Encodes the specified MapSensor message. Does not implicitly {@link smartmonitorsensor.MapSensor.verify|verify} messages.
         * @function encode
         * @memberof smartmonitorsensor.MapSensor
         * @static
         * @param {smartmonitorsensor.IMapSensor} message MapSensor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapSensor.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.room != null && Object.hasOwnProperty.call(message, "room"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.room);
            if (message.xiaomis != null && message.xiaomis.length)
                for (var i = 0; i < message.xiaomis.length; ++i)
                    $root.smartmonitorsensor.Xiaomi.encode(message.xiaomis[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.honeys != null && message.honeys.length)
                for (var i = 0; i < message.honeys.length; ++i)
                    $root.smartmonitorsensor.Honey.encode(message.honeys[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.wind != null && message.wind.length)
                for (var i = 0; i < message.wind.length; ++i)
                    $root.smartmonitorsensor.Wind.encode(message.wind[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.command != null && Object.hasOwnProperty.call(message, "command"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.command);
            return writer;
        };

        /**
         * Encodes the specified MapSensor message, length delimited. Does not implicitly {@link smartmonitorsensor.MapSensor.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitorsensor.MapSensor
         * @static
         * @param {smartmonitorsensor.IMapSensor} message MapSensor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapSensor.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MapSensor message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitorsensor.MapSensor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitorsensor.MapSensor} MapSensor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapSensor.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitorsensor.MapSensor();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.room = reader.uint32();
                        break;
                    }
                case 2: {
                        if (!(message.xiaomis && message.xiaomis.length))
                            message.xiaomis = [];
                        message.xiaomis.push($root.smartmonitorsensor.Xiaomi.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        if (!(message.honeys && message.honeys.length))
                            message.honeys = [];
                        message.honeys.push($root.smartmonitorsensor.Honey.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        if (!(message.wind && message.wind.length))
                            message.wind = [];
                        message.wind.push($root.smartmonitorsensor.Wind.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        message.command = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MapSensor message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitorsensor.MapSensor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitorsensor.MapSensor} MapSensor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapSensor.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MapSensor message.
         * @function verify
         * @memberof smartmonitorsensor.MapSensor
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MapSensor.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.room != null && message.hasOwnProperty("room"))
                if (!$util.isInteger(message.room))
                    return "room: integer expected";
            if (message.xiaomis != null && message.hasOwnProperty("xiaomis")) {
                if (!Array.isArray(message.xiaomis))
                    return "xiaomis: array expected";
                for (var i = 0; i < message.xiaomis.length; ++i) {
                    var error = $root.smartmonitorsensor.Xiaomi.verify(message.xiaomis[i]);
                    if (error)
                        return "xiaomis." + error;
                }
            }
            if (message.honeys != null && message.hasOwnProperty("honeys")) {
                if (!Array.isArray(message.honeys))
                    return "honeys: array expected";
                for (var i = 0; i < message.honeys.length; ++i) {
                    var error = $root.smartmonitorsensor.Honey.verify(message.honeys[i]);
                    if (error)
                        return "honeys." + error;
                }
            }
            if (message.wind != null && message.hasOwnProperty("wind")) {
                if (!Array.isArray(message.wind))
                    return "wind: array expected";
                for (var i = 0; i < message.wind.length; ++i) {
                    var error = $root.smartmonitorsensor.Wind.verify(message.wind[i]);
                    if (error)
                        return "wind." + error;
                }
            }
            if (message.command != null && message.hasOwnProperty("command"))
                if (!$util.isInteger(message.command))
                    return "command: integer expected";
            return null;
        };

        /**
         * Creates a MapSensor message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitorsensor.MapSensor
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitorsensor.MapSensor} MapSensor
         */
        MapSensor.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitorsensor.MapSensor)
                return object;
            var message = new $root.smartmonitorsensor.MapSensor();
            if (object.room != null)
                message.room = object.room >>> 0;
            if (object.xiaomis) {
                if (!Array.isArray(object.xiaomis))
                    throw TypeError(".smartmonitorsensor.MapSensor.xiaomis: array expected");
                message.xiaomis = [];
                for (var i = 0; i < object.xiaomis.length; ++i) {
                    if (typeof object.xiaomis[i] !== "object")
                        throw TypeError(".smartmonitorsensor.MapSensor.xiaomis: object expected");
                    message.xiaomis[i] = $root.smartmonitorsensor.Xiaomi.fromObject(object.xiaomis[i]);
                }
            }
            if (object.honeys) {
                if (!Array.isArray(object.honeys))
                    throw TypeError(".smartmonitorsensor.MapSensor.honeys: array expected");
                message.honeys = [];
                for (var i = 0; i < object.honeys.length; ++i) {
                    if (typeof object.honeys[i] !== "object")
                        throw TypeError(".smartmonitorsensor.MapSensor.honeys: object expected");
                    message.honeys[i] = $root.smartmonitorsensor.Honey.fromObject(object.honeys[i]);
                }
            }
            if (object.wind) {
                if (!Array.isArray(object.wind))
                    throw TypeError(".smartmonitorsensor.MapSensor.wind: array expected");
                message.wind = [];
                for (var i = 0; i < object.wind.length; ++i) {
                    if (typeof object.wind[i] !== "object")
                        throw TypeError(".smartmonitorsensor.MapSensor.wind: object expected");
                    message.wind[i] = $root.smartmonitorsensor.Wind.fromObject(object.wind[i]);
                }
            }
            if (object.command != null)
                message.command = object.command >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a MapSensor message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitorsensor.MapSensor
         * @static
         * @param {smartmonitorsensor.MapSensor} message MapSensor
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MapSensor.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.xiaomis = [];
                object.honeys = [];
                object.wind = [];
            }
            if (options.defaults) {
                object.room = 0;
                object.command = 0;
            }
            if (message.room != null && message.hasOwnProperty("room"))
                object.room = message.room;
            if (message.xiaomis && message.xiaomis.length) {
                object.xiaomis = [];
                for (var j = 0; j < message.xiaomis.length; ++j)
                    object.xiaomis[j] = $root.smartmonitorsensor.Xiaomi.toObject(message.xiaomis[j], options);
            }
            if (message.honeys && message.honeys.length) {
                object.honeys = [];
                for (var j = 0; j < message.honeys.length; ++j)
                    object.honeys[j] = $root.smartmonitorsensor.Honey.toObject(message.honeys[j], options);
            }
            if (message.wind && message.wind.length) {
                object.wind = [];
                for (var j = 0; j < message.wind.length; ++j)
                    object.wind[j] = $root.smartmonitorsensor.Wind.toObject(message.wind[j], options);
            }
            if (message.command != null && message.hasOwnProperty("command"))
                object.command = message.command;
            return object;
        };

        /**
         * Converts this MapSensor to JSON.
         * @function toJSON
         * @memberof smartmonitorsensor.MapSensor
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MapSensor.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MapSensor
         * @function getTypeUrl
         * @memberof smartmonitorsensor.MapSensor
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MapSensor.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitorsensor.MapSensor";
        };

        return MapSensor;
    })();

    smartmonitorsensor.Sensor = (function() {

        /**
         * Properties of a Sensor.
         * @memberof smartmonitorsensor
         * @interface ISensor
         * @property {number|null} [room] Sensor room
         * @property {Array.<smartmonitorsensor.IXiaomi>|null} [xiaomis] Sensor xiaomis
         * @property {smartmonitorsensor.IMics|null} [ammoniaMics] Sensor ammoniaMics
         * @property {smartmonitorsensor.IHoney|null} [nh3wsModbus] Sensor nh3wsModbus
         * @property {number|null} [light] Sensor light
         * @property {smartmonitorsensor.IWind|null} [wind] Sensor wind
         * @property {number|null} [oxygen] Sensor oxygen
         * @property {number|null} [errorCodeSensor] Sensor errorCodeSensor
         */

        /**
         * Constructs a new Sensor.
         * @memberof smartmonitorsensor
         * @classdesc Represents a Sensor.
         * @implements ISensor
         * @constructor
         * @param {smartmonitorsensor.ISensor=} [properties] Properties to set
         */
        function Sensor(properties) {
            this.xiaomis = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Sensor room.
         * @member {number} room
         * @memberof smartmonitorsensor.Sensor
         * @instance
         */
        Sensor.prototype.room = 0;

        /**
         * Sensor xiaomis.
         * @member {Array.<smartmonitorsensor.IXiaomi>} xiaomis
         * @memberof smartmonitorsensor.Sensor
         * @instance
         */
        Sensor.prototype.xiaomis = $util.emptyArray;

        /**
         * Sensor ammoniaMics.
         * @member {smartmonitorsensor.IMics|null|undefined} ammoniaMics
         * @memberof smartmonitorsensor.Sensor
         * @instance
         */
        Sensor.prototype.ammoniaMics = null;

        /**
         * Sensor nh3wsModbus.
         * @member {smartmonitorsensor.IHoney|null|undefined} nh3wsModbus
         * @memberof smartmonitorsensor.Sensor
         * @instance
         */
        Sensor.prototype.nh3wsModbus = null;

        /**
         * Sensor light.
         * @member {number} light
         * @memberof smartmonitorsensor.Sensor
         * @instance
         */
        Sensor.prototype.light = 0;

        /**
         * Sensor wind.
         * @member {smartmonitorsensor.IWind|null|undefined} wind
         * @memberof smartmonitorsensor.Sensor
         * @instance
         */
        Sensor.prototype.wind = null;

        /**
         * Sensor oxygen.
         * @member {number} oxygen
         * @memberof smartmonitorsensor.Sensor
         * @instance
         */
        Sensor.prototype.oxygen = 0;

        /**
         * Sensor errorCodeSensor.
         * @member {number} errorCodeSensor
         * @memberof smartmonitorsensor.Sensor
         * @instance
         */
        Sensor.prototype.errorCodeSensor = 0;

        /**
         * Creates a new Sensor instance using the specified properties.
         * @function create
         * @memberof smartmonitorsensor.Sensor
         * @static
         * @param {smartmonitorsensor.ISensor=} [properties] Properties to set
         * @returns {smartmonitorsensor.Sensor} Sensor instance
         */
        Sensor.create = function create(properties) {
            return new Sensor(properties);
        };

        /**
         * Encodes the specified Sensor message. Does not implicitly {@link smartmonitorsensor.Sensor.verify|verify} messages.
         * @function encode
         * @memberof smartmonitorsensor.Sensor
         * @static
         * @param {smartmonitorsensor.ISensor} message Sensor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Sensor.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.room != null && Object.hasOwnProperty.call(message, "room"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.room);
            if (message.xiaomis != null && message.xiaomis.length)
                for (var i = 0; i < message.xiaomis.length; ++i)
                    $root.smartmonitorsensor.Xiaomi.encode(message.xiaomis[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.ammoniaMics != null && Object.hasOwnProperty.call(message, "ammoniaMics"))
                $root.smartmonitorsensor.Mics.encode(message.ammoniaMics, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.nh3wsModbus != null && Object.hasOwnProperty.call(message, "nh3wsModbus"))
                $root.smartmonitorsensor.Honey.encode(message.nh3wsModbus, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.light != null && Object.hasOwnProperty.call(message, "light"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.light);
            if (message.wind != null && Object.hasOwnProperty.call(message, "wind"))
                $root.smartmonitorsensor.Wind.encode(message.wind, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.oxygen != null && Object.hasOwnProperty.call(message, "oxygen"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.oxygen);
            if (message.errorCodeSensor != null && Object.hasOwnProperty.call(message, "errorCodeSensor"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.errorCodeSensor);
            return writer;
        };

        /**
         * Encodes the specified Sensor message, length delimited. Does not implicitly {@link smartmonitorsensor.Sensor.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitorsensor.Sensor
         * @static
         * @param {smartmonitorsensor.ISensor} message Sensor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Sensor.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Sensor message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitorsensor.Sensor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitorsensor.Sensor} Sensor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Sensor.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitorsensor.Sensor();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.room = reader.uint32();
                        break;
                    }
                case 2: {
                        if (!(message.xiaomis && message.xiaomis.length))
                            message.xiaomis = [];
                        message.xiaomis.push($root.smartmonitorsensor.Xiaomi.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.ammoniaMics = $root.smartmonitorsensor.Mics.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.nh3wsModbus = $root.smartmonitorsensor.Honey.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.light = reader.uint32();
                        break;
                    }
                case 6: {
                        message.wind = $root.smartmonitorsensor.Wind.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.oxygen = reader.uint32();
                        break;
                    }
                case 8: {
                        message.errorCodeSensor = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Sensor message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitorsensor.Sensor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitorsensor.Sensor} Sensor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Sensor.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Sensor message.
         * @function verify
         * @memberof smartmonitorsensor.Sensor
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Sensor.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.room != null && message.hasOwnProperty("room"))
                if (!$util.isInteger(message.room))
                    return "room: integer expected";
            if (message.xiaomis != null && message.hasOwnProperty("xiaomis")) {
                if (!Array.isArray(message.xiaomis))
                    return "xiaomis: array expected";
                for (var i = 0; i < message.xiaomis.length; ++i) {
                    var error = $root.smartmonitorsensor.Xiaomi.verify(message.xiaomis[i]);
                    if (error)
                        return "xiaomis." + error;
                }
            }
            if (message.ammoniaMics != null && message.hasOwnProperty("ammoniaMics")) {
                var error = $root.smartmonitorsensor.Mics.verify(message.ammoniaMics);
                if (error)
                    return "ammoniaMics." + error;
            }
            if (message.nh3wsModbus != null && message.hasOwnProperty("nh3wsModbus")) {
                var error = $root.smartmonitorsensor.Honey.verify(message.nh3wsModbus);
                if (error)
                    return "nh3wsModbus." + error;
            }
            if (message.light != null && message.hasOwnProperty("light"))
                if (!$util.isInteger(message.light))
                    return "light: integer expected";
            if (message.wind != null && message.hasOwnProperty("wind")) {
                var error = $root.smartmonitorsensor.Wind.verify(message.wind);
                if (error)
                    return "wind." + error;
            }
            if (message.oxygen != null && message.hasOwnProperty("oxygen"))
                if (!$util.isInteger(message.oxygen))
                    return "oxygen: integer expected";
            if (message.errorCodeSensor != null && message.hasOwnProperty("errorCodeSensor"))
                if (!$util.isInteger(message.errorCodeSensor))
                    return "errorCodeSensor: integer expected";
            return null;
        };

        /**
         * Creates a Sensor message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitorsensor.Sensor
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitorsensor.Sensor} Sensor
         */
        Sensor.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitorsensor.Sensor)
                return object;
            var message = new $root.smartmonitorsensor.Sensor();
            if (object.room != null)
                message.room = object.room >>> 0;
            if (object.xiaomis) {
                if (!Array.isArray(object.xiaomis))
                    throw TypeError(".smartmonitorsensor.Sensor.xiaomis: array expected");
                message.xiaomis = [];
                for (var i = 0; i < object.xiaomis.length; ++i) {
                    if (typeof object.xiaomis[i] !== "object")
                        throw TypeError(".smartmonitorsensor.Sensor.xiaomis: object expected");
                    message.xiaomis[i] = $root.smartmonitorsensor.Xiaomi.fromObject(object.xiaomis[i]);
                }
            }
            if (object.ammoniaMics != null) {
                if (typeof object.ammoniaMics !== "object")
                    throw TypeError(".smartmonitorsensor.Sensor.ammoniaMics: object expected");
                message.ammoniaMics = $root.smartmonitorsensor.Mics.fromObject(object.ammoniaMics);
            }
            if (object.nh3wsModbus != null) {
                if (typeof object.nh3wsModbus !== "object")
                    throw TypeError(".smartmonitorsensor.Sensor.nh3wsModbus: object expected");
                message.nh3wsModbus = $root.smartmonitorsensor.Honey.fromObject(object.nh3wsModbus);
            }
            if (object.light != null)
                message.light = object.light >>> 0;
            if (object.wind != null) {
                if (typeof object.wind !== "object")
                    throw TypeError(".smartmonitorsensor.Sensor.wind: object expected");
                message.wind = $root.smartmonitorsensor.Wind.fromObject(object.wind);
            }
            if (object.oxygen != null)
                message.oxygen = object.oxygen >>> 0;
            if (object.errorCodeSensor != null)
                message.errorCodeSensor = object.errorCodeSensor >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Sensor message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitorsensor.Sensor
         * @static
         * @param {smartmonitorsensor.Sensor} message Sensor
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Sensor.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.xiaomis = [];
            if (options.defaults) {
                object.room = 0;
                object.ammoniaMics = null;
                object.nh3wsModbus = null;
                object.light = 0;
                object.wind = null;
                object.oxygen = 0;
                object.errorCodeSensor = 0;
            }
            if (message.room != null && message.hasOwnProperty("room"))
                object.room = message.room;
            if (message.xiaomis && message.xiaomis.length) {
                object.xiaomis = [];
                for (var j = 0; j < message.xiaomis.length; ++j)
                    object.xiaomis[j] = $root.smartmonitorsensor.Xiaomi.toObject(message.xiaomis[j], options);
            }
            if (message.ammoniaMics != null && message.hasOwnProperty("ammoniaMics"))
                object.ammoniaMics = $root.smartmonitorsensor.Mics.toObject(message.ammoniaMics, options);
            if (message.nh3wsModbus != null && message.hasOwnProperty("nh3wsModbus"))
                object.nh3wsModbus = $root.smartmonitorsensor.Honey.toObject(message.nh3wsModbus, options);
            if (message.light != null && message.hasOwnProperty("light"))
                object.light = message.light;
            if (message.wind != null && message.hasOwnProperty("wind"))
                object.wind = $root.smartmonitorsensor.Wind.toObject(message.wind, options);
            if (message.oxygen != null && message.hasOwnProperty("oxygen"))
                object.oxygen = message.oxygen;
            if (message.errorCodeSensor != null && message.hasOwnProperty("errorCodeSensor"))
                object.errorCodeSensor = message.errorCodeSensor;
            return object;
        };

        /**
         * Converts this Sensor to JSON.
         * @function toJSON
         * @memberof smartmonitorsensor.Sensor
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Sensor.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Sensor
         * @function getTypeUrl
         * @memberof smartmonitorsensor.Sensor
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Sensor.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitorsensor.Sensor";
        };

        return Sensor;
    })();

    smartmonitorsensor.Xiaomi = (function() {

        /**
         * Properties of a Xiaomi.
         * @memberof smartmonitorsensor
         * @interface IXiaomi
         * @property {Uint8Array|null} [id] Xiaomi id
         * @property {number|null} [temp] Xiaomi temp
         * @property {number|null} [humi] Xiaomi humi
         * @property {number|null} [batt] Xiaomi batt
         * @property {number|null} [rssi] Xiaomi rssi
         * @property {string|null} [name] Xiaomi name
         * @property {Uint8Array|null} [pos] Xiaomi pos
         * @property {number|null} [dist] Xiaomi dist
         */

        /**
         * Constructs a new Xiaomi.
         * @memberof smartmonitorsensor
         * @classdesc Represents a Xiaomi.
         * @implements IXiaomi
         * @constructor
         * @param {smartmonitorsensor.IXiaomi=} [properties] Properties to set
         */
        function Xiaomi(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Xiaomi id.
         * @member {Uint8Array} id
         * @memberof smartmonitorsensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.id = $util.newBuffer([]);

        /**
         * Xiaomi temp.
         * @member {number} temp
         * @memberof smartmonitorsensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.temp = 0;

        /**
         * Xiaomi humi.
         * @member {number} humi
         * @memberof smartmonitorsensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.humi = 0;

        /**
         * Xiaomi batt.
         * @member {number} batt
         * @memberof smartmonitorsensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.batt = 0;

        /**
         * Xiaomi rssi.
         * @member {number} rssi
         * @memberof smartmonitorsensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.rssi = 0;

        /**
         * Xiaomi name.
         * @member {string} name
         * @memberof smartmonitorsensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.name = "";

        /**
         * Xiaomi pos.
         * @member {Uint8Array} pos
         * @memberof smartmonitorsensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.pos = $util.newBuffer([]);

        /**
         * Xiaomi dist.
         * @member {number} dist
         * @memberof smartmonitorsensor.Xiaomi
         * @instance
         */
        Xiaomi.prototype.dist = 0;

        /**
         * Creates a new Xiaomi instance using the specified properties.
         * @function create
         * @memberof smartmonitorsensor.Xiaomi
         * @static
         * @param {smartmonitorsensor.IXiaomi=} [properties] Properties to set
         * @returns {smartmonitorsensor.Xiaomi} Xiaomi instance
         */
        Xiaomi.create = function create(properties) {
            return new Xiaomi(properties);
        };

        /**
         * Encodes the specified Xiaomi message. Does not implicitly {@link smartmonitorsensor.Xiaomi.verify|verify} messages.
         * @function encode
         * @memberof smartmonitorsensor.Xiaomi
         * @static
         * @param {smartmonitorsensor.IXiaomi} message Xiaomi message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Xiaomi.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.id);
            if (message.temp != null && Object.hasOwnProperty.call(message, "temp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.temp);
            if (message.humi != null && Object.hasOwnProperty.call(message, "humi"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.humi);
            if (message.batt != null && Object.hasOwnProperty.call(message, "batt"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.batt);
            if (message.rssi != null && Object.hasOwnProperty.call(message, "rssi"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.rssi);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.name);
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.pos);
            if (message.dist != null && Object.hasOwnProperty.call(message, "dist"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.dist);
            return writer;
        };

        /**
         * Encodes the specified Xiaomi message, length delimited. Does not implicitly {@link smartmonitorsensor.Xiaomi.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitorsensor.Xiaomi
         * @static
         * @param {smartmonitorsensor.IXiaomi} message Xiaomi message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Xiaomi.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Xiaomi message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitorsensor.Xiaomi
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitorsensor.Xiaomi} Xiaomi
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Xiaomi.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitorsensor.Xiaomi();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.bytes();
                        break;
                    }
                case 2: {
                        message.temp = reader.uint32();
                        break;
                    }
                case 3: {
                        message.humi = reader.uint32();
                        break;
                    }
                case 4: {
                        message.batt = reader.uint32();
                        break;
                    }
                case 5: {
                        message.rssi = reader.uint32();
                        break;
                    }
                case 6: {
                        message.name = reader.string();
                        break;
                    }
                case 7: {
                        message.pos = reader.bytes();
                        break;
                    }
                case 8: {
                        message.dist = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Xiaomi message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitorsensor.Xiaomi
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitorsensor.Xiaomi} Xiaomi
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Xiaomi.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Xiaomi message.
         * @function verify
         * @memberof smartmonitorsensor.Xiaomi
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Xiaomi.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!(message.id && typeof message.id.length === "number" || $util.isString(message.id)))
                    return "id: buffer expected";
            if (message.temp != null && message.hasOwnProperty("temp"))
                if (!$util.isInteger(message.temp))
                    return "temp: integer expected";
            if (message.humi != null && message.hasOwnProperty("humi"))
                if (!$util.isInteger(message.humi))
                    return "humi: integer expected";
            if (message.batt != null && message.hasOwnProperty("batt"))
                if (!$util.isInteger(message.batt))
                    return "batt: integer expected";
            if (message.rssi != null && message.hasOwnProperty("rssi"))
                if (!$util.isInteger(message.rssi))
                    return "rssi: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.pos != null && message.hasOwnProperty("pos"))
                if (!(message.pos && typeof message.pos.length === "number" || $util.isString(message.pos)))
                    return "pos: buffer expected";
            if (message.dist != null && message.hasOwnProperty("dist"))
                if (!$util.isInteger(message.dist))
                    return "dist: integer expected";
            return null;
        };

        /**
         * Creates a Xiaomi message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitorsensor.Xiaomi
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitorsensor.Xiaomi} Xiaomi
         */
        Xiaomi.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitorsensor.Xiaomi)
                return object;
            var message = new $root.smartmonitorsensor.Xiaomi();
            if (object.id != null)
                if (typeof object.id === "string")
                    $util.base64.decode(object.id, message.id = $util.newBuffer($util.base64.length(object.id)), 0);
                else if (object.id.length >= 0)
                    message.id = object.id;
            if (object.temp != null)
                message.temp = object.temp >>> 0;
            if (object.humi != null)
                message.humi = object.humi >>> 0;
            if (object.batt != null)
                message.batt = object.batt >>> 0;
            if (object.rssi != null)
                message.rssi = object.rssi >>> 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.pos != null)
                if (typeof object.pos === "string")
                    $util.base64.decode(object.pos, message.pos = $util.newBuffer($util.base64.length(object.pos)), 0);
                else if (object.pos.length >= 0)
                    message.pos = object.pos;
            if (object.dist != null)
                message.dist = object.dist >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Xiaomi message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitorsensor.Xiaomi
         * @static
         * @param {smartmonitorsensor.Xiaomi} message Xiaomi
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Xiaomi.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.id = "";
                else {
                    object.id = [];
                    if (options.bytes !== Array)
                        object.id = $util.newBuffer(object.id);
                }
                object.temp = 0;
                object.humi = 0;
                object.batt = 0;
                object.rssi = 0;
                object.name = "";
                if (options.bytes === String)
                    object.pos = "";
                else {
                    object.pos = [];
                    if (options.bytes !== Array)
                        object.pos = $util.newBuffer(object.pos);
                }
                object.dist = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = options.bytes === String ? $util.base64.encode(message.id, 0, message.id.length) : options.bytes === Array ? Array.prototype.slice.call(message.id) : message.id;
            if (message.temp != null && message.hasOwnProperty("temp"))
                object.temp = message.temp;
            if (message.humi != null && message.hasOwnProperty("humi"))
                object.humi = message.humi;
            if (message.batt != null && message.hasOwnProperty("batt"))
                object.batt = message.batt;
            if (message.rssi != null && message.hasOwnProperty("rssi"))
                object.rssi = message.rssi;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = options.bytes === String ? $util.base64.encode(message.pos, 0, message.pos.length) : options.bytes === Array ? Array.prototype.slice.call(message.pos) : message.pos;
            if (message.dist != null && message.hasOwnProperty("dist"))
                object.dist = message.dist;
            return object;
        };

        /**
         * Converts this Xiaomi to JSON.
         * @function toJSON
         * @memberof smartmonitorsensor.Xiaomi
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Xiaomi.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Xiaomi
         * @function getTypeUrl
         * @memberof smartmonitorsensor.Xiaomi
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Xiaomi.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitorsensor.Xiaomi";
        };

        return Xiaomi;
    })();

    smartmonitorsensor.Mics = (function() {

        /**
         * Properties of a Mics.
         * @memberof smartmonitorsensor
         * @interface IMics
         * @property {number|null} [rs] Mics rs
         * @property {number|null} [ro] Mics ro
         */

        /**
         * Constructs a new Mics.
         * @memberof smartmonitorsensor
         * @classdesc Represents a Mics.
         * @implements IMics
         * @constructor
         * @param {smartmonitorsensor.IMics=} [properties] Properties to set
         */
        function Mics(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Mics rs.
         * @member {number} rs
         * @memberof smartmonitorsensor.Mics
         * @instance
         */
        Mics.prototype.rs = 0;

        /**
         * Mics ro.
         * @member {number} ro
         * @memberof smartmonitorsensor.Mics
         * @instance
         */
        Mics.prototype.ro = 0;

        /**
         * Creates a new Mics instance using the specified properties.
         * @function create
         * @memberof smartmonitorsensor.Mics
         * @static
         * @param {smartmonitorsensor.IMics=} [properties] Properties to set
         * @returns {smartmonitorsensor.Mics} Mics instance
         */
        Mics.create = function create(properties) {
            return new Mics(properties);
        };

        /**
         * Encodes the specified Mics message. Does not implicitly {@link smartmonitorsensor.Mics.verify|verify} messages.
         * @function encode
         * @memberof smartmonitorsensor.Mics
         * @static
         * @param {smartmonitorsensor.IMics} message Mics message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Mics.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rs != null && Object.hasOwnProperty.call(message, "rs"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.rs);
            if (message.ro != null && Object.hasOwnProperty.call(message, "ro"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.ro);
            return writer;
        };

        /**
         * Encodes the specified Mics message, length delimited. Does not implicitly {@link smartmonitorsensor.Mics.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitorsensor.Mics
         * @static
         * @param {smartmonitorsensor.IMics} message Mics message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Mics.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Mics message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitorsensor.Mics
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitorsensor.Mics} Mics
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Mics.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitorsensor.Mics();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.rs = reader.uint32();
                        break;
                    }
                case 2: {
                        message.ro = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Mics message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitorsensor.Mics
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitorsensor.Mics} Mics
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Mics.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Mics message.
         * @function verify
         * @memberof smartmonitorsensor.Mics
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Mics.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rs != null && message.hasOwnProperty("rs"))
                if (!$util.isInteger(message.rs))
                    return "rs: integer expected";
            if (message.ro != null && message.hasOwnProperty("ro"))
                if (!$util.isInteger(message.ro))
                    return "ro: integer expected";
            return null;
        };

        /**
         * Creates a Mics message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitorsensor.Mics
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitorsensor.Mics} Mics
         */
        Mics.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitorsensor.Mics)
                return object;
            var message = new $root.smartmonitorsensor.Mics();
            if (object.rs != null)
                message.rs = object.rs >>> 0;
            if (object.ro != null)
                message.ro = object.ro >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Mics message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitorsensor.Mics
         * @static
         * @param {smartmonitorsensor.Mics} message Mics
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Mics.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.rs = 0;
                object.ro = 0;
            }
            if (message.rs != null && message.hasOwnProperty("rs"))
                object.rs = message.rs;
            if (message.ro != null && message.hasOwnProperty("ro"))
                object.ro = message.ro;
            return object;
        };

        /**
         * Converts this Mics to JSON.
         * @function toJSON
         * @memberof smartmonitorsensor.Mics
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Mics.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Mics
         * @function getTypeUrl
         * @memberof smartmonitorsensor.Mics
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Mics.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitorsensor.Mics";
        };

        return Mics;
    })();

    smartmonitorsensor.Honey = (function() {

        /**
         * Properties of an Honey.
         * @memberof smartmonitorsensor
         * @interface IHoney
         * @property {Uint8Array|null} [id] Honey id
         * @property {number|null} [ammo] Honey ammo
         * @property {number|null} [temp] Honey temp
         * @property {number|null} [humi] Honey humi
         * @property {string|null} [name] Honey name
         * @property {Uint8Array|null} [pos] Honey pos
         * @property {number|null} [dist] Honey dist
         */

        /**
         * Constructs a new Honey.
         * @memberof smartmonitorsensor
         * @classdesc Represents an Honey.
         * @implements IHoney
         * @constructor
         * @param {smartmonitorsensor.IHoney=} [properties] Properties to set
         */
        function Honey(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Honey id.
         * @member {Uint8Array} id
         * @memberof smartmonitorsensor.Honey
         * @instance
         */
        Honey.prototype.id = $util.newBuffer([]);

        /**
         * Honey ammo.
         * @member {number} ammo
         * @memberof smartmonitorsensor.Honey
         * @instance
         */
        Honey.prototype.ammo = 0;

        /**
         * Honey temp.
         * @member {number} temp
         * @memberof smartmonitorsensor.Honey
         * @instance
         */
        Honey.prototype.temp = 0;

        /**
         * Honey humi.
         * @member {number} humi
         * @memberof smartmonitorsensor.Honey
         * @instance
         */
        Honey.prototype.humi = 0;

        /**
         * Honey name.
         * @member {string} name
         * @memberof smartmonitorsensor.Honey
         * @instance
         */
        Honey.prototype.name = "";

        /**
         * Honey pos.
         * @member {Uint8Array} pos
         * @memberof smartmonitorsensor.Honey
         * @instance
         */
        Honey.prototype.pos = $util.newBuffer([]);

        /**
         * Honey dist.
         * @member {number} dist
         * @memberof smartmonitorsensor.Honey
         * @instance
         */
        Honey.prototype.dist = 0;

        /**
         * Creates a new Honey instance using the specified properties.
         * @function create
         * @memberof smartmonitorsensor.Honey
         * @static
         * @param {smartmonitorsensor.IHoney=} [properties] Properties to set
         * @returns {smartmonitorsensor.Honey} Honey instance
         */
        Honey.create = function create(properties) {
            return new Honey(properties);
        };

        /**
         * Encodes the specified Honey message. Does not implicitly {@link smartmonitorsensor.Honey.verify|verify} messages.
         * @function encode
         * @memberof smartmonitorsensor.Honey
         * @static
         * @param {smartmonitorsensor.IHoney} message Honey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Honey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.id);
            if (message.ammo != null && Object.hasOwnProperty.call(message, "ammo"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.ammo);
            if (message.temp != null && Object.hasOwnProperty.call(message, "temp"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.temp);
            if (message.humi != null && Object.hasOwnProperty.call(message, "humi"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.humi);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.name);
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.pos);
            if (message.dist != null && Object.hasOwnProperty.call(message, "dist"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.dist);
            return writer;
        };

        /**
         * Encodes the specified Honey message, length delimited. Does not implicitly {@link smartmonitorsensor.Honey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitorsensor.Honey
         * @static
         * @param {smartmonitorsensor.IHoney} message Honey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Honey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Honey message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitorsensor.Honey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitorsensor.Honey} Honey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Honey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitorsensor.Honey();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.bytes();
                        break;
                    }
                case 2: {
                        message.ammo = reader.uint32();
                        break;
                    }
                case 3: {
                        message.temp = reader.uint32();
                        break;
                    }
                case 4: {
                        message.humi = reader.uint32();
                        break;
                    }
                case 6: {
                        message.name = reader.string();
                        break;
                    }
                case 7: {
                        message.pos = reader.bytes();
                        break;
                    }
                case 8: {
                        message.dist = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Honey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitorsensor.Honey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitorsensor.Honey} Honey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Honey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Honey message.
         * @function verify
         * @memberof smartmonitorsensor.Honey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Honey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!(message.id && typeof message.id.length === "number" || $util.isString(message.id)))
                    return "id: buffer expected";
            if (message.ammo != null && message.hasOwnProperty("ammo"))
                if (!$util.isInteger(message.ammo))
                    return "ammo: integer expected";
            if (message.temp != null && message.hasOwnProperty("temp"))
                if (!$util.isInteger(message.temp))
                    return "temp: integer expected";
            if (message.humi != null && message.hasOwnProperty("humi"))
                if (!$util.isInteger(message.humi))
                    return "humi: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.pos != null && message.hasOwnProperty("pos"))
                if (!(message.pos && typeof message.pos.length === "number" || $util.isString(message.pos)))
                    return "pos: buffer expected";
            if (message.dist != null && message.hasOwnProperty("dist"))
                if (!$util.isInteger(message.dist))
                    return "dist: integer expected";
            return null;
        };

        /**
         * Creates an Honey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitorsensor.Honey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitorsensor.Honey} Honey
         */
        Honey.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitorsensor.Honey)
                return object;
            var message = new $root.smartmonitorsensor.Honey();
            if (object.id != null)
                if (typeof object.id === "string")
                    $util.base64.decode(object.id, message.id = $util.newBuffer($util.base64.length(object.id)), 0);
                else if (object.id.length >= 0)
                    message.id = object.id;
            if (object.ammo != null)
                message.ammo = object.ammo >>> 0;
            if (object.temp != null)
                message.temp = object.temp >>> 0;
            if (object.humi != null)
                message.humi = object.humi >>> 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.pos != null)
                if (typeof object.pos === "string")
                    $util.base64.decode(object.pos, message.pos = $util.newBuffer($util.base64.length(object.pos)), 0);
                else if (object.pos.length >= 0)
                    message.pos = object.pos;
            if (object.dist != null)
                message.dist = object.dist >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an Honey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitorsensor.Honey
         * @static
         * @param {smartmonitorsensor.Honey} message Honey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Honey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.id = "";
                else {
                    object.id = [];
                    if (options.bytes !== Array)
                        object.id = $util.newBuffer(object.id);
                }
                object.ammo = 0;
                object.temp = 0;
                object.humi = 0;
                object.name = "";
                if (options.bytes === String)
                    object.pos = "";
                else {
                    object.pos = [];
                    if (options.bytes !== Array)
                        object.pos = $util.newBuffer(object.pos);
                }
                object.dist = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = options.bytes === String ? $util.base64.encode(message.id, 0, message.id.length) : options.bytes === Array ? Array.prototype.slice.call(message.id) : message.id;
            if (message.ammo != null && message.hasOwnProperty("ammo"))
                object.ammo = message.ammo;
            if (message.temp != null && message.hasOwnProperty("temp"))
                object.temp = message.temp;
            if (message.humi != null && message.hasOwnProperty("humi"))
                object.humi = message.humi;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = options.bytes === String ? $util.base64.encode(message.pos, 0, message.pos.length) : options.bytes === Array ? Array.prototype.slice.call(message.pos) : message.pos;
            if (message.dist != null && message.hasOwnProperty("dist"))
                object.dist = message.dist;
            return object;
        };

        /**
         * Converts this Honey to JSON.
         * @function toJSON
         * @memberof smartmonitorsensor.Honey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Honey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Honey
         * @function getTypeUrl
         * @memberof smartmonitorsensor.Honey
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Honey.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitorsensor.Honey";
        };

        return Honey;
    })();

    smartmonitorsensor.Wind = (function() {

        /**
         * Properties of a Wind.
         * @memberof smartmonitorsensor
         * @interface IWind
         * @property {Uint8Array|null} [id] Wind id
         * @property {number|null} [speed] Wind speed
         * @property {string|null} [name] Wind name
         * @property {Uint8Array|null} [pos] Wind pos
         * @property {number|null} [dist] Wind dist
         */

        /**
         * Constructs a new Wind.
         * @memberof smartmonitorsensor
         * @classdesc Represents a Wind.
         * @implements IWind
         * @constructor
         * @param {smartmonitorsensor.IWind=} [properties] Properties to set
         */
        function Wind(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Wind id.
         * @member {Uint8Array} id
         * @memberof smartmonitorsensor.Wind
         * @instance
         */
        Wind.prototype.id = $util.newBuffer([]);

        /**
         * Wind speed.
         * @member {number} speed
         * @memberof smartmonitorsensor.Wind
         * @instance
         */
        Wind.prototype.speed = 0;

        /**
         * Wind name.
         * @member {string} name
         * @memberof smartmonitorsensor.Wind
         * @instance
         */
        Wind.prototype.name = "";

        /**
         * Wind pos.
         * @member {Uint8Array} pos
         * @memberof smartmonitorsensor.Wind
         * @instance
         */
        Wind.prototype.pos = $util.newBuffer([]);

        /**
         * Wind dist.
         * @member {number} dist
         * @memberof smartmonitorsensor.Wind
         * @instance
         */
        Wind.prototype.dist = 0;

        /**
         * Creates a new Wind instance using the specified properties.
         * @function create
         * @memberof smartmonitorsensor.Wind
         * @static
         * @param {smartmonitorsensor.IWind=} [properties] Properties to set
         * @returns {smartmonitorsensor.Wind} Wind instance
         */
        Wind.create = function create(properties) {
            return new Wind(properties);
        };

        /**
         * Encodes the specified Wind message. Does not implicitly {@link smartmonitorsensor.Wind.verify|verify} messages.
         * @function encode
         * @memberof smartmonitorsensor.Wind
         * @static
         * @param {smartmonitorsensor.IWind} message Wind message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Wind.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.id);
            if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.speed);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.name);
            if (message.pos != null && Object.hasOwnProperty.call(message, "pos"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.pos);
            if (message.dist != null && Object.hasOwnProperty.call(message, "dist"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.dist);
            return writer;
        };

        /**
         * Encodes the specified Wind message, length delimited. Does not implicitly {@link smartmonitorsensor.Wind.verify|verify} messages.
         * @function encodeDelimited
         * @memberof smartmonitorsensor.Wind
         * @static
         * @param {smartmonitorsensor.IWind} message Wind message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Wind.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Wind message from the specified reader or buffer.
         * @function decode
         * @memberof smartmonitorsensor.Wind
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {smartmonitorsensor.Wind} Wind
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Wind.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.smartmonitorsensor.Wind();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.bytes();
                        break;
                    }
                case 2: {
                        message.speed = reader.uint32();
                        break;
                    }
                case 6: {
                        message.name = reader.string();
                        break;
                    }
                case 7: {
                        message.pos = reader.bytes();
                        break;
                    }
                case 8: {
                        message.dist = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Wind message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof smartmonitorsensor.Wind
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {smartmonitorsensor.Wind} Wind
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Wind.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Wind message.
         * @function verify
         * @memberof smartmonitorsensor.Wind
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Wind.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!(message.id && typeof message.id.length === "number" || $util.isString(message.id)))
                    return "id: buffer expected";
            if (message.speed != null && message.hasOwnProperty("speed"))
                if (!$util.isInteger(message.speed))
                    return "speed: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.pos != null && message.hasOwnProperty("pos"))
                if (!(message.pos && typeof message.pos.length === "number" || $util.isString(message.pos)))
                    return "pos: buffer expected";
            if (message.dist != null && message.hasOwnProperty("dist"))
                if (!$util.isInteger(message.dist))
                    return "dist: integer expected";
            return null;
        };

        /**
         * Creates a Wind message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof smartmonitorsensor.Wind
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {smartmonitorsensor.Wind} Wind
         */
        Wind.fromObject = function fromObject(object) {
            if (object instanceof $root.smartmonitorsensor.Wind)
                return object;
            var message = new $root.smartmonitorsensor.Wind();
            if (object.id != null)
                if (typeof object.id === "string")
                    $util.base64.decode(object.id, message.id = $util.newBuffer($util.base64.length(object.id)), 0);
                else if (object.id.length >= 0)
                    message.id = object.id;
            if (object.speed != null)
                message.speed = object.speed >>> 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.pos != null)
                if (typeof object.pos === "string")
                    $util.base64.decode(object.pos, message.pos = $util.newBuffer($util.base64.length(object.pos)), 0);
                else if (object.pos.length >= 0)
                    message.pos = object.pos;
            if (object.dist != null)
                message.dist = object.dist >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Wind message. Also converts values to other types if specified.
         * @function toObject
         * @memberof smartmonitorsensor.Wind
         * @static
         * @param {smartmonitorsensor.Wind} message Wind
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Wind.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.id = "";
                else {
                    object.id = [];
                    if (options.bytes !== Array)
                        object.id = $util.newBuffer(object.id);
                }
                object.speed = 0;
                object.name = "";
                if (options.bytes === String)
                    object.pos = "";
                else {
                    object.pos = [];
                    if (options.bytes !== Array)
                        object.pos = $util.newBuffer(object.pos);
                }
                object.dist = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = options.bytes === String ? $util.base64.encode(message.id, 0, message.id.length) : options.bytes === Array ? Array.prototype.slice.call(message.id) : message.id;
            if (message.speed != null && message.hasOwnProperty("speed"))
                object.speed = message.speed;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.pos != null && message.hasOwnProperty("pos"))
                object.pos = options.bytes === String ? $util.base64.encode(message.pos, 0, message.pos.length) : options.bytes === Array ? Array.prototype.slice.call(message.pos) : message.pos;
            if (message.dist != null && message.hasOwnProperty("dist"))
                object.dist = message.dist;
            return object;
        };

        /**
         * Converts this Wind to JSON.
         * @function toJSON
         * @memberof smartmonitorsensor.Wind
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Wind.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Wind
         * @function getTypeUrl
         * @memberof smartmonitorsensor.Wind
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Wind.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/smartmonitorsensor.Wind";
        };

        return Wind;
    })();

    return smartmonitorsensor;
})();

module.exports = $root;
