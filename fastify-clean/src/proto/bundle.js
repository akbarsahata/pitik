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
            if (message.users != null && message.users.length) {
                writer.uint32(/* id 4, wireType 2 =*/34).fork();
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
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.filesize != null && message.hasOwnProperty("filesize"))
                object.filesize = message.filesize;
            if (message.devtype != null && message.hasOwnProperty("devtype"))
                object.devtype = message.devtype;
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

    return smartcamera;
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
         * @property {smartmonitorsensor.IMapSensor|null} [mapSensor] MonitorContent mapSensor
         * @property {commoniot.IMapDevice|null} [mapDevice] MonitorContent mapDevice
         * @property {commoniot.IReportSetting|null} [reportSetting] MonitorContent reportSetting
         * @property {smartmonitor.IMonitorData|null} [monitorData] MonitorContent monitorData
         * @property {smartmonitor.IMonitorStatus|null} [monitorStatus] MonitorContent monitorStatus
         * @property {smartmonitor.IstoreR0|null} [storeR0] MonitorContent storeR0
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
         * @member {smartmonitorsensor.IMapSensor|null|undefined} mapSensor
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
                $root.smartmonitorsensor.MapSensor.encode(message.mapSensor, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
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
                        message.mapSensor = $root.smartmonitorsensor.MapSensor.decode(reader, reader.uint32());
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
                var error = $root.smartmonitorsensor.MapSensor.verify(message.mapSensor);
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
                message.mapSensor = $root.smartmonitorsensor.MapSensor.fromObject(object.mapSensor);
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
                object.mapSensor = $root.smartmonitorsensor.MapSensor.toObject(message.mapSensor, options);
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
         * @property {smartmonitorsensor.ISensor|null} [local] MonitorData local
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
         * @member {smartmonitorsensor.ISensor|null|undefined} local
         * @memberof smartmonitor.MonitorData
         * @instance
         */
        MonitorData.prototype.local = null;

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
                $root.smartmonitorsensor.Sensor.encode(message.local, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
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
                        message.local = $root.smartmonitorsensor.Sensor.decode(reader, reader.uint32());
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
                var error = $root.smartmonitorsensor.Sensor.verify(message.local);
                if (error)
                    return "local." + error;
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
                message.local = $root.smartmonitorsensor.Sensor.fromObject(object.local);
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
                object.rssi = 0;
            }
            if (message.local != null && message.hasOwnProperty("local"))
                object.local = $root.smartmonitorsensor.Sensor.toObject(message.local, options);
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
