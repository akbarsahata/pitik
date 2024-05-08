import * as $protobuf from 'protobufjs';
import Long = require('long');
/** Namespace base. */
export namespace base {
  /** Properties of a BasePayload. */
  interface IBasePayload {
    /** BasePayload meta */
    meta?: Uint8Array | null;
  }

  /** Represents a BasePayload. */
  class BasePayload implements IBasePayload {
    /**
     * Constructs a new BasePayload.
     * @param [properties] Properties to set
     */
    constructor(properties?: base.IBasePayload);

    /** BasePayload meta. */
    public meta: Uint8Array;

    /**
     * Creates a new BasePayload instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BasePayload instance
     */
    public static create(properties?: base.IBasePayload): base.BasePayload;

    /**
     * Encodes the specified BasePayload message. Does not implicitly {@link base.BasePayload.verify|verify} messages.
     * @param message BasePayload message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: base.IBasePayload, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified BasePayload message, length delimited. Does not implicitly {@link base.BasePayload.verify|verify} messages.
     * @param message BasePayload message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: base.IBasePayload,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a BasePayload message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BasePayload
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): base.BasePayload;

    /**
     * Decodes a BasePayload message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BasePayload
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): base.BasePayload;

    /**
     * Verifies a BasePayload message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a BasePayload message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BasePayload
     */
    public static fromObject(object: { [k: string]: any }): base.BasePayload;

    /**
     * Creates a plain object from a BasePayload message. Also converts values to other types if specified.
     * @param message BasePayload
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: base.BasePayload,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this BasePayload to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for BasePayload
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}

/** Namespace commoniot. */
export namespace commoniot {
  /** Properties of an InfoDevice. */
  interface IInfoDevice {
    /** InfoDevice uid */
    uid?: Uint8Array | null;

    /** InfoDevice firmware */
    firmware?: number | null;

    /** InfoDevice hardware */
    hardware?: number | null;
  }

  /** Represents an InfoDevice. */
  class InfoDevice implements IInfoDevice {
    /**
     * Constructs a new InfoDevice.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.IInfoDevice);

    /** InfoDevice uid. */
    public uid: Uint8Array;

    /** InfoDevice firmware. */
    public firmware: number;

    /** InfoDevice hardware. */
    public hardware: number;

    /**
     * Creates a new InfoDevice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns InfoDevice instance
     */
    public static create(properties?: commoniot.IInfoDevice): commoniot.InfoDevice;

    /**
     * Encodes the specified InfoDevice message. Does not implicitly {@link commoniot.InfoDevice.verify|verify} messages.
     * @param message InfoDevice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: commoniot.IInfoDevice,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified InfoDevice message, length delimited. Does not implicitly {@link commoniot.InfoDevice.verify|verify} messages.
     * @param message InfoDevice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.IInfoDevice,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an InfoDevice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns InfoDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): commoniot.InfoDevice;

    /**
     * Decodes an InfoDevice message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns InfoDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.InfoDevice;

    /**
     * Verifies an InfoDevice message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an InfoDevice message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns InfoDevice
     */
    public static fromObject(object: { [k: string]: any }): commoniot.InfoDevice;

    /**
     * Creates a plain object from an InfoDevice message. Also converts values to other types if specified.
     * @param message InfoDevice
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.InfoDevice,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this InfoDevice to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for InfoDevice
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an InfoFarm. */
  interface IInfoFarm {
    /** InfoFarm room */
    room?: number | null;

    /** InfoFarm status */
    status?: number | null;
  }

  /** Represents an InfoFarm. */
  class InfoFarm implements IInfoFarm {
    /**
     * Constructs a new InfoFarm.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.IInfoFarm);

    /** InfoFarm room. */
    public room: number;

    /** InfoFarm status. */
    public status: number;

    /**
     * Creates a new InfoFarm instance using the specified properties.
     * @param [properties] Properties to set
     * @returns InfoFarm instance
     */
    public static create(properties?: commoniot.IInfoFarm): commoniot.InfoFarm;

    /**
     * Encodes the specified InfoFarm message. Does not implicitly {@link commoniot.InfoFarm.verify|verify} messages.
     * @param message InfoFarm message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: commoniot.IInfoFarm, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified InfoFarm message, length delimited. Does not implicitly {@link commoniot.InfoFarm.verify|verify} messages.
     * @param message InfoFarm message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.IInfoFarm,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an InfoFarm message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns InfoFarm
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): commoniot.InfoFarm;

    /**
     * Decodes an InfoFarm message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns InfoFarm
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.InfoFarm;

    /**
     * Verifies an InfoFarm message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an InfoFarm message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns InfoFarm
     */
    public static fromObject(object: { [k: string]: any }): commoniot.InfoFarm;

    /**
     * Creates a plain object from an InfoFarm message. Also converts values to other types if specified.
     * @param message InfoFarm
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.InfoFarm,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this InfoFarm to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for InfoFarm
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a StartCycle. */
  interface IStartCycle {
    /** StartCycle at */
    at?: number | null;
  }

  /** Represents a StartCycle. */
  class StartCycle implements IStartCycle {
    /**
     * Constructs a new StartCycle.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.IStartCycle);

    /** StartCycle at. */
    public at: number;

    /**
     * Creates a new StartCycle instance using the specified properties.
     * @param [properties] Properties to set
     * @returns StartCycle instance
     */
    public static create(properties?: commoniot.IStartCycle): commoniot.StartCycle;

    /**
     * Encodes the specified StartCycle message. Does not implicitly {@link commoniot.StartCycle.verify|verify} messages.
     * @param message StartCycle message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: commoniot.IStartCycle,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified StartCycle message, length delimited. Does not implicitly {@link commoniot.StartCycle.verify|verify} messages.
     * @param message StartCycle message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.IStartCycle,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a StartCycle message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns StartCycle
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): commoniot.StartCycle;

    /**
     * Decodes a StartCycle message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns StartCycle
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.StartCycle;

    /**
     * Verifies a StartCycle message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a StartCycle message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns StartCycle
     */
    public static fromObject(object: { [k: string]: any }): commoniot.StartCycle;

    /**
     * Creates a plain object from a StartCycle message. Also converts values to other types if specified.
     * @param message StartCycle
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.StartCycle,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this StartCycle to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for StartCycle
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a StopCycle. */
  interface IStopCycle {}

  /** Represents a StopCycle. */
  class StopCycle implements IStopCycle {
    /**
     * Constructs a new StopCycle.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.IStopCycle);

    /**
     * Creates a new StopCycle instance using the specified properties.
     * @param [properties] Properties to set
     * @returns StopCycle instance
     */
    public static create(properties?: commoniot.IStopCycle): commoniot.StopCycle;

    /**
     * Encodes the specified StopCycle message. Does not implicitly {@link commoniot.StopCycle.verify|verify} messages.
     * @param message StopCycle message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: commoniot.IStopCycle,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified StopCycle message, length delimited. Does not implicitly {@link commoniot.StopCycle.verify|verify} messages.
     * @param message StopCycle message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.IStopCycle,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a StopCycle message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns StopCycle
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): commoniot.StopCycle;

    /**
     * Decodes a StopCycle message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns StopCycle
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.StopCycle;

    /**
     * Verifies a StopCycle message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a StopCycle message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns StopCycle
     */
    public static fromObject(object: { [k: string]: any }): commoniot.StopCycle;

    /**
     * Creates a plain object from a StopCycle message. Also converts values to other types if specified.
     * @param message StopCycle
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.StopCycle,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this StopCycle to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for StopCycle
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Reset. */
  interface IReset {}

  /** Represents a Reset. */
  class Reset implements IReset {
    /**
     * Constructs a new Reset.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.IReset);

    /**
     * Creates a new Reset instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Reset instance
     */
    public static create(properties?: commoniot.IReset): commoniot.Reset;

    /**
     * Encodes the specified Reset message. Does not implicitly {@link commoniot.Reset.verify|verify} messages.
     * @param message Reset message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: commoniot.IReset, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Reset message, length delimited. Does not implicitly {@link commoniot.Reset.verify|verify} messages.
     * @param message Reset message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.IReset,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Reset message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Reset
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): commoniot.Reset;

    /**
     * Decodes a Reset message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Reset
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.Reset;

    /**
     * Verifies a Reset message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Reset message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Reset
     */
    public static fromObject(object: { [k: string]: any }): commoniot.Reset;

    /**
     * Creates a plain object from a Reset message. Also converts values to other types if specified.
     * @param message Reset
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.Reset,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Reset to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Reset
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Ping. */
  interface IPing {
    /** Ping tscmd */
    tscmd?: number | null;

    /** Ping tsreply */
    tsreply?: number | null;
  }

  /** Represents a Ping. */
  class Ping implements IPing {
    /**
     * Constructs a new Ping.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.IPing);

    /** Ping tscmd. */
    public tscmd: number;

    /** Ping tsreply. */
    public tsreply: number;

    /**
     * Creates a new Ping instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Ping instance
     */
    public static create(properties?: commoniot.IPing): commoniot.Ping;

    /**
     * Encodes the specified Ping message. Does not implicitly {@link commoniot.Ping.verify|verify} messages.
     * @param message Ping message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: commoniot.IPing, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Ping message, length delimited. Does not implicitly {@link commoniot.Ping.verify|verify} messages.
     * @param message Ping message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.IPing,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Ping message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Ping
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): commoniot.Ping;

    /**
     * Decodes a Ping message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Ping
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.Ping;

    /**
     * Verifies a Ping message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Ping message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Ping
     */
    public static fromObject(object: { [k: string]: any }): commoniot.Ping;

    /**
     * Creates a plain object from a Ping message. Also converts values to other types if specified.
     * @param message Ping
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.Ping,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Ping to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Ping
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an Ota. */
  interface IOta {
    /** Ota version */
    version?: number | null;

    /** Ota filesize */
    filesize?: number | null;

    /** Ota devtype */
    devtype?: number | null;

    /** Ota status */
    status?: number | null;

    /** Ota users */
    users?: number[] | null;
  }

  /** Represents an Ota. */
  class Ota implements IOta {
    /**
     * Constructs a new Ota.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.IOta);

    /** Ota version. */
    public version: number;

    /** Ota filesize. */
    public filesize: number;

    /** Ota devtype. */
    public devtype: number;

    /** Ota status. */
    public status: number;

    /** Ota users. */
    public users: number[];

    /**
     * Creates a new Ota instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Ota instance
     */
    public static create(properties?: commoniot.IOta): commoniot.Ota;

    /**
     * Encodes the specified Ota message. Does not implicitly {@link commoniot.Ota.verify|verify} messages.
     * @param message Ota message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: commoniot.IOta, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Ota message, length delimited. Does not implicitly {@link commoniot.Ota.verify|verify} messages.
     * @param message Ota message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.IOta,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an Ota message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Ota
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): commoniot.Ota;

    /**
     * Decodes an Ota message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Ota
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.Ota;

    /**
     * Verifies an Ota message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an Ota message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Ota
     */
    public static fromObject(object: { [k: string]: any }): commoniot.Ota;

    /**
     * Creates a plain object from an Ota message. Also converts values to other types if specified.
     * @param message Ota
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.Ota,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Ota to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Ota
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a MapDevice. */
  interface IMapDevice {
    /** MapDevice room */
    room?: number | null;

    /** MapDevice command */
    command?: number | null;
  }

  /** Represents a MapDevice. */
  class MapDevice implements IMapDevice {
    /**
     * Constructs a new MapDevice.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.IMapDevice);

    /** MapDevice room. */
    public room: number;

    /** MapDevice command. */
    public command: number;

    /**
     * Creates a new MapDevice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MapDevice instance
     */
    public static create(properties?: commoniot.IMapDevice): commoniot.MapDevice;

    /**
     * Encodes the specified MapDevice message. Does not implicitly {@link commoniot.MapDevice.verify|verify} messages.
     * @param message MapDevice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: commoniot.IMapDevice,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified MapDevice message, length delimited. Does not implicitly {@link commoniot.MapDevice.verify|verify} messages.
     * @param message MapDevice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.IMapDevice,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a MapDevice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MapDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): commoniot.MapDevice;

    /**
     * Decodes a MapDevice message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MapDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.MapDevice;

    /**
     * Verifies a MapDevice message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a MapDevice message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MapDevice
     */
    public static fromObject(object: { [k: string]: any }): commoniot.MapDevice;

    /**
     * Creates a plain object from a MapDevice message. Also converts values to other types if specified.
     * @param message MapDevice
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.MapDevice,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this MapDevice to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for MapDevice
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ReportSetting. */
  interface IReportSetting {
    /** ReportSetting at */
    at?: number | null;

    /** ReportSetting period */
    period?: number | null;
  }

  /** Represents a ReportSetting. */
  class ReportSetting implements IReportSetting {
    /**
     * Constructs a new ReportSetting.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.IReportSetting);

    /** ReportSetting at. */
    public at: number;

    /** ReportSetting period. */
    public period: number;

    /**
     * Creates a new ReportSetting instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ReportSetting instance
     */
    public static create(properties?: commoniot.IReportSetting): commoniot.ReportSetting;

    /**
     * Encodes the specified ReportSetting message. Does not implicitly {@link commoniot.ReportSetting.verify|verify} messages.
     * @param message ReportSetting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: commoniot.IReportSetting,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ReportSetting message, length delimited. Does not implicitly {@link commoniot.ReportSetting.verify|verify} messages.
     * @param message ReportSetting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.IReportSetting,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ReportSetting message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ReportSetting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): commoniot.ReportSetting;

    /**
     * Decodes a ReportSetting message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ReportSetting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.ReportSetting;

    /**
     * Verifies a ReportSetting message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ReportSetting message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ReportSetting
     */
    public static fromObject(object: { [k: string]: any }): commoniot.ReportSetting;

    /**
     * Creates a plain object from a ReportSetting message. Also converts values to other types if specified.
     * @param message ReportSetting
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.ReportSetting,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ReportSetting to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ReportSetting
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Signal. */
  interface ISignal {
    /** Signal leveltime */
    leveltime?: Uint8Array[] | null;
  }

  /** Represents a Signal. */
  class Signal implements ISignal {
    /**
     * Constructs a new Signal.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.ISignal);

    /** Signal leveltime. */
    public leveltime: Uint8Array[];

    /**
     * Creates a new Signal instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Signal instance
     */
    public static create(properties?: commoniot.ISignal): commoniot.Signal;

    /**
     * Encodes the specified Signal message. Does not implicitly {@link commoniot.Signal.verify|verify} messages.
     * @param message Signal message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: commoniot.ISignal, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Signal message, length delimited. Does not implicitly {@link commoniot.Signal.verify|verify} messages.
     * @param message Signal message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.ISignal,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Signal message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Signal
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): commoniot.Signal;

    /**
     * Decodes a Signal message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Signal
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.Signal;

    /**
     * Verifies a Signal message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Signal message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Signal
     */
    public static fromObject(object: { [k: string]: any }): commoniot.Signal;

    /**
     * Creates a plain object from a Signal message. Also converts values to other types if specified.
     * @param message Signal
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.Signal,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Signal to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Signal
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an Error. */
  interface IError {
    /** Error num */
    num?: number | null;

    /** Error msg */
    msg?: string | null;
  }

  /** Represents an Error. */
  class Error implements IError {
    /**
     * Constructs a new Error.
     * @param [properties] Properties to set
     */
    constructor(properties?: commoniot.IError);

    /** Error num. */
    public num: number;

    /** Error msg. */
    public msg: string;

    /**
     * Creates a new Error instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Error instance
     */
    public static create(properties?: commoniot.IError): commoniot.Error;

    /**
     * Encodes the specified Error message. Does not implicitly {@link commoniot.Error.verify|verify} messages.
     * @param message Error message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: commoniot.IError, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Error message, length delimited. Does not implicitly {@link commoniot.Error.verify|verify} messages.
     * @param message Error message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: commoniot.IError,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an Error message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Error
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): commoniot.Error;

    /**
     * Decodes an Error message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Error
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): commoniot.Error;

    /**
     * Verifies an Error message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an Error message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Error
     */
    public static fromObject(object: { [k: string]: any }): commoniot.Error;

    /**
     * Creates a plain object from an Error message. Also converts values to other types if specified.
     * @param message Error
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: commoniot.Error,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Error to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Error
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}

/** Namespace sensor. */
export namespace sensor {
  /** Properties of a MapSensor. */
  interface IMapSensor {
    /** MapSensor room */
    room?: number | null;

    /** MapSensor xiaomis */
    xiaomis?: sensor.IXiaomi[] | null;

    /** MapSensor honeys */
    honeys?: sensor.IHoney[] | null;

    /** MapSensor wind */
    wind?: sensor.IWind[] | null;

    /** MapSensor command */
    command?: number | null;
  }

  /** Represents a MapSensor. */
  class MapSensor implements IMapSensor {
    /**
     * Constructs a new MapSensor.
     * @param [properties] Properties to set
     */
    constructor(properties?: sensor.IMapSensor);

    /** MapSensor room. */
    public room: number;

    /** MapSensor xiaomis. */
    public xiaomis: sensor.IXiaomi[];

    /** MapSensor honeys. */
    public honeys: sensor.IHoney[];

    /** MapSensor wind. */
    public wind: sensor.IWind[];

    /** MapSensor command. */
    public command: number;

    /**
     * Creates a new MapSensor instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MapSensor instance
     */
    public static create(properties?: sensor.IMapSensor): sensor.MapSensor;

    /**
     * Encodes the specified MapSensor message. Does not implicitly {@link sensor.MapSensor.verify|verify} messages.
     * @param message MapSensor message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: sensor.IMapSensor, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified MapSensor message, length delimited. Does not implicitly {@link sensor.MapSensor.verify|verify} messages.
     * @param message MapSensor message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: sensor.IMapSensor,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a MapSensor message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MapSensor
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): sensor.MapSensor;

    /**
     * Decodes a MapSensor message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MapSensor
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): sensor.MapSensor;

    /**
     * Verifies a MapSensor message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a MapSensor message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MapSensor
     */
    public static fromObject(object: { [k: string]: any }): sensor.MapSensor;

    /**
     * Creates a plain object from a MapSensor message. Also converts values to other types if specified.
     * @param message MapSensor
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: sensor.MapSensor,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this MapSensor to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for MapSensor
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Sensor. */
  interface ISensor {
    /** Sensor room */
    room?: number | null;

    /** Sensor xiaomis */
    xiaomis?: sensor.IXiaomi[] | null;

    /** Sensor ammoniaMics */
    ammoniaMics?: sensor.IMics | null;

    /** Sensor nh3wsModbus */
    nh3wsModbus?: sensor.IHoney | null;

    /** Sensor light */
    light?: number | null;

    /** Sensor wind */
    wind?: sensor.IWind | null;

    /** Sensor oxygen */
    oxygen?: number | null;

    /** Sensor errorCodeSensor */
    errorCodeSensor?: number | null;
  }

  /** Represents a Sensor. */
  class Sensor implements ISensor {
    /**
     * Constructs a new Sensor.
     * @param [properties] Properties to set
     */
    constructor(properties?: sensor.ISensor);

    /** Sensor room. */
    public room: number;

    /** Sensor xiaomis. */
    public xiaomis: sensor.IXiaomi[];

    /** Sensor ammoniaMics. */
    public ammoniaMics?: sensor.IMics | null;

    /** Sensor nh3wsModbus. */
    public nh3wsModbus?: sensor.IHoney | null;

    /** Sensor light. */
    public light: number;

    /** Sensor wind. */
    public wind?: sensor.IWind | null;

    /** Sensor oxygen. */
    public oxygen: number;

    /** Sensor errorCodeSensor. */
    public errorCodeSensor: number;

    /**
     * Creates a new Sensor instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Sensor instance
     */
    public static create(properties?: sensor.ISensor): sensor.Sensor;

    /**
     * Encodes the specified Sensor message. Does not implicitly {@link sensor.Sensor.verify|verify} messages.
     * @param message Sensor message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: sensor.ISensor, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Sensor message, length delimited. Does not implicitly {@link sensor.Sensor.verify|verify} messages.
     * @param message Sensor message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: sensor.ISensor,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Sensor message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Sensor
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): sensor.Sensor;

    /**
     * Decodes a Sensor message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Sensor
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): sensor.Sensor;

    /**
     * Verifies a Sensor message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Sensor message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Sensor
     */
    public static fromObject(object: { [k: string]: any }): sensor.Sensor;

    /**
     * Creates a plain object from a Sensor message. Also converts values to other types if specified.
     * @param message Sensor
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: sensor.Sensor,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Sensor to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Sensor
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Xiaomi. */
  interface IXiaomi {
    /** Xiaomi id */
    id?: Uint8Array | null;

    /** Xiaomi temp */
    temp?: number | null;

    /** Xiaomi humi */
    humi?: number | null;

    /** Xiaomi batt */
    batt?: number | null;

    /** Xiaomi rssi */
    rssi?: number | null;

    /** Xiaomi name */
    name?: string | null;

    /** Xiaomi pos */
    pos?: Uint8Array | null;

    /** Xiaomi dist */
    dist?: number | null;
  }

  /** Represents a Xiaomi. */
  class Xiaomi implements IXiaomi {
    /**
     * Constructs a new Xiaomi.
     * @param [properties] Properties to set
     */
    constructor(properties?: sensor.IXiaomi);

    /** Xiaomi id. */
    public id: Uint8Array;

    /** Xiaomi temp. */
    public temp: number;

    /** Xiaomi humi. */
    public humi: number;

    /** Xiaomi batt. */
    public batt: number;

    /** Xiaomi rssi. */
    public rssi: number;

    /** Xiaomi name. */
    public name: string;

    /** Xiaomi pos. */
    public pos: Uint8Array;

    /** Xiaomi dist. */
    public dist: number;

    /**
     * Creates a new Xiaomi instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Xiaomi instance
     */
    public static create(properties?: sensor.IXiaomi): sensor.Xiaomi;

    /**
     * Encodes the specified Xiaomi message. Does not implicitly {@link sensor.Xiaomi.verify|verify} messages.
     * @param message Xiaomi message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: sensor.IXiaomi, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Xiaomi message, length delimited. Does not implicitly {@link sensor.Xiaomi.verify|verify} messages.
     * @param message Xiaomi message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: sensor.IXiaomi,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Xiaomi message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Xiaomi
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): sensor.Xiaomi;

    /**
     * Decodes a Xiaomi message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Xiaomi
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): sensor.Xiaomi;

    /**
     * Verifies a Xiaomi message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Xiaomi message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Xiaomi
     */
    public static fromObject(object: { [k: string]: any }): sensor.Xiaomi;

    /**
     * Creates a plain object from a Xiaomi message. Also converts values to other types if specified.
     * @param message Xiaomi
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: sensor.Xiaomi,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Xiaomi to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Xiaomi
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Mics. */
  interface IMics {
    /** Mics rs */
    rs?: number | null;

    /** Mics ro */
    ro?: number | null;
  }

  /** Represents a Mics. */
  class Mics implements IMics {
    /**
     * Constructs a new Mics.
     * @param [properties] Properties to set
     */
    constructor(properties?: sensor.IMics);

    /** Mics rs. */
    public rs: number;

    /** Mics ro. */
    public ro: number;

    /**
     * Creates a new Mics instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Mics instance
     */
    public static create(properties?: sensor.IMics): sensor.Mics;

    /**
     * Encodes the specified Mics message. Does not implicitly {@link sensor.Mics.verify|verify} messages.
     * @param message Mics message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: sensor.IMics, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Mics message, length delimited. Does not implicitly {@link sensor.Mics.verify|verify} messages.
     * @param message Mics message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: sensor.IMics,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Mics message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Mics
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): sensor.Mics;

    /**
     * Decodes a Mics message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Mics
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): sensor.Mics;

    /**
     * Verifies a Mics message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Mics message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Mics
     */
    public static fromObject(object: { [k: string]: any }): sensor.Mics;

    /**
     * Creates a plain object from a Mics message. Also converts values to other types if specified.
     * @param message Mics
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: sensor.Mics,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Mics to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Mics
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an Honey. */
  interface IHoney {
    /** Honey id */
    id?: Uint8Array | null;

    /** Honey ammo */
    ammo?: number | null;

    /** Honey temp */
    temp?: number | null;

    /** Honey humi */
    humi?: number | null;

    /** Honey name */
    name?: string | null;

    /** Honey pos */
    pos?: Uint8Array | null;

    /** Honey dist */
    dist?: number | null;
  }

  /** Represents an Honey. */
  class Honey implements IHoney {
    /**
     * Constructs a new Honey.
     * @param [properties] Properties to set
     */
    constructor(properties?: sensor.IHoney);

    /** Honey id. */
    public id: Uint8Array;

    /** Honey ammo. */
    public ammo: number;

    /** Honey temp. */
    public temp: number;

    /** Honey humi. */
    public humi: number;

    /** Honey name. */
    public name: string;

    /** Honey pos. */
    public pos: Uint8Array;

    /** Honey dist. */
    public dist: number;

    /**
     * Creates a new Honey instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Honey instance
     */
    public static create(properties?: sensor.IHoney): sensor.Honey;

    /**
     * Encodes the specified Honey message. Does not implicitly {@link sensor.Honey.verify|verify} messages.
     * @param message Honey message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: sensor.IHoney, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Honey message, length delimited. Does not implicitly {@link sensor.Honey.verify|verify} messages.
     * @param message Honey message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: sensor.IHoney,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an Honey message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Honey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): sensor.Honey;

    /**
     * Decodes an Honey message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Honey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): sensor.Honey;

    /**
     * Verifies an Honey message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an Honey message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Honey
     */
    public static fromObject(object: { [k: string]: any }): sensor.Honey;

    /**
     * Creates a plain object from an Honey message. Also converts values to other types if specified.
     * @param message Honey
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: sensor.Honey,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Honey to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Honey
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Wind. */
  interface IWind {
    /** Wind id */
    id?: Uint8Array | null;

    /** Wind speed */
    speed?: number | null;

    /** Wind name */
    name?: string | null;

    /** Wind pos */
    pos?: Uint8Array | null;

    /** Wind dist */
    dist?: number | null;
  }

  /** Represents a Wind. */
  class Wind implements IWind {
    /**
     * Constructs a new Wind.
     * @param [properties] Properties to set
     */
    constructor(properties?: sensor.IWind);

    /** Wind id. */
    public id: Uint8Array;

    /** Wind speed. */
    public speed: number;

    /** Wind name. */
    public name: string;

    /** Wind pos. */
    public pos: Uint8Array;

    /** Wind dist. */
    public dist: number;

    /**
     * Creates a new Wind instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Wind instance
     */
    public static create(properties?: sensor.IWind): sensor.Wind;

    /**
     * Encodes the specified Wind message. Does not implicitly {@link sensor.Wind.verify|verify} messages.
     * @param message Wind message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: sensor.IWind, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Wind message, length delimited. Does not implicitly {@link sensor.Wind.verify|verify} messages.
     * @param message Wind message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: sensor.IWind,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Wind message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Wind
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): sensor.Wind;

    /**
     * Decodes a Wind message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Wind
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): sensor.Wind;

    /**
     * Verifies a Wind message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Wind message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Wind
     */
    public static fromObject(object: { [k: string]: any }): sensor.Wind;

    /**
     * Creates a plain object from a Wind message. Also converts values to other types if specified.
     * @param message Wind
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: sensor.Wind,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Wind to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Wind
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}

/** Namespace smartcamera. */
export namespace smartcamera {
  /** DeviceImageState enum. */
  enum DeviceImageState {
    DONE = 0,
    ERROR_CAPTURE_IMAGE = 1,
    ERROR_UPLOAD_IMAGE = 2,
    CRC_FAILED = 4,
  }

  /** Properties of a Cam. */
  interface ICam {
    /** Cam meta */
    meta?: Uint8Array | null;

    /** Cam jobId */
    jobId?: string | null;

    /** Cam sensorCode */
    sensorCode?: string | null;

    /** Cam state */
    state?: smartcamera.DeviceImageState | null;

    /** Cam setCam */
    setCam?: smartcamera.ISetCam | null;

    /** Cam diagnosticsData */
    diagnosticsData?: smartcamera.IDiagnosticsData | null;

    /** Cam alertCameraOffline */
    alertCameraOffline?: smartcamera.IAlertCameraOffline | null;
  }

  /** Represents a Cam. */
  class Cam implements ICam {
    /**
     * Constructs a new Cam.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.ICam);

    /** Cam meta. */
    public meta: Uint8Array;

    /** Cam jobId. */
    public jobId: string;

    /** Cam sensorCode. */
    public sensorCode: string;

    /** Cam state. */
    public state: smartcamera.DeviceImageState;

    /** Cam setCam. */
    public setCam?: smartcamera.ISetCam | null;

    /** Cam diagnosticsData. */
    public diagnosticsData?: smartcamera.IDiagnosticsData | null;

    /** Cam alertCameraOffline. */
    public alertCameraOffline?: smartcamera.IAlertCameraOffline | null;

    /**
     * Creates a new Cam instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Cam instance
     */
    public static create(properties?: smartcamera.ICam): smartcamera.Cam;

    /**
     * Encodes the specified Cam message. Does not implicitly {@link smartcamera.Cam.verify|verify} messages.
     * @param message Cam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: smartcamera.ICam, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Cam message, length delimited. Does not implicitly {@link smartcamera.Cam.verify|verify} messages.
     * @param message Cam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.ICam,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Cam message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Cam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): smartcamera.Cam;

    /**
     * Decodes a Cam message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Cam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcamera.Cam;

    /**
     * Verifies a Cam message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Cam message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Cam
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.Cam;

    /**
     * Creates a plain object from a Cam message. Also converts values to other types if specified.
     * @param message Cam
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.Cam,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Cam to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Cam
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** DeviceErrorState enum. */
  enum DeviceErrorState {
    OTA_SUCCEED = 0,
    SET_CAM_SUCCEED = 1,
    OTA_FAILED = 2,
    SET_CAM_FAILED = 3,
    OTA_HASH_FAILED = 4,
    PROTO_CRC_FAILED = 5,
    PRESIGNED_URL_FAILED = 6,
  }

  /** Properties of a SetParam. */
  interface ISetParam {
    /** SetParam sensorCode */
    sensorCode?: string | null;

    /** SetParam ipCam */
    ipCam?: string | null;
  }

  /** Represents a SetParam. */
  class SetParam implements ISetParam {
    /**
     * Constructs a new SetParam.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.ISetParam);

    /** SetParam sensorCode. */
    public sensorCode: string;

    /** SetParam ipCam. */
    public ipCam: string;

    /**
     * Creates a new SetParam instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SetParam instance
     */
    public static create(properties?: smartcamera.ISetParam): smartcamera.SetParam;

    /**
     * Encodes the specified SetParam message. Does not implicitly {@link smartcamera.SetParam.verify|verify} messages.
     * @param message SetParam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcamera.ISetParam,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified SetParam message, length delimited. Does not implicitly {@link smartcamera.SetParam.verify|verify} messages.
     * @param message SetParam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.ISetParam,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a SetParam message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SetParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.SetParam;

    /**
     * Decodes a SetParam message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SetParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcamera.SetParam;

    /**
     * Verifies a SetParam message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SetParam message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SetParam
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.SetParam;

    /**
     * Creates a plain object from a SetParam message. Also converts values to other types if specified.
     * @param message SetParam
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.SetParam,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this SetParam to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SetParam
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SetOta. */
  interface ISetOta {
    /** SetOta fileName */
    fileName?: string | null;

    /** SetOta fileHash */
    fileHash?: string | null;

    /** SetOta fileLink */
    fileLink?: string | null;
  }

  /** Represents a SetOta. */
  class SetOta implements ISetOta {
    /**
     * Constructs a new SetOta.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.ISetOta);

    /** SetOta fileName. */
    public fileName: string;

    /** SetOta fileHash. */
    public fileHash: string;

    /** SetOta fileLink. */
    public fileLink: string;

    /**
     * Creates a new SetOta instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SetOta instance
     */
    public static create(properties?: smartcamera.ISetOta): smartcamera.SetOta;

    /**
     * Encodes the specified SetOta message. Does not implicitly {@link smartcamera.SetOta.verify|verify} messages.
     * @param message SetOta message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: smartcamera.ISetOta, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SetOta message, length delimited. Does not implicitly {@link smartcamera.SetOta.verify|verify} messages.
     * @param message SetOta message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.ISetOta,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a SetOta message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SetOta
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.SetOta;

    /**
     * Decodes a SetOta message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SetOta
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcamera.SetOta;

    /**
     * Verifies a SetOta message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SetOta message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SetOta
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.SetOta;

    /**
     * Creates a plain object from a SetOta message. Also converts values to other types if specified.
     * @param message SetOta
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.SetOta,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this SetOta to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SetOta
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SetError. */
  interface ISetError {
    /** SetError macAddress */
    macAddress?: string | null;

    /** SetError state */
    state?: smartcamera.DeviceErrorState | null;
  }

  /** Represents a SetError. */
  class SetError implements ISetError {
    /**
     * Constructs a new SetError.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.ISetError);

    /** SetError macAddress. */
    public macAddress: string;

    /** SetError state. */
    public state: smartcamera.DeviceErrorState;

    /**
     * Creates a new SetError instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SetError instance
     */
    public static create(properties?: smartcamera.ISetError): smartcamera.SetError;

    /**
     * Encodes the specified SetError message. Does not implicitly {@link smartcamera.SetError.verify|verify} messages.
     * @param message SetError message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcamera.ISetError,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified SetError message, length delimited. Does not implicitly {@link smartcamera.SetError.verify|verify} messages.
     * @param message SetError message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.ISetError,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a SetError message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SetError
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.SetError;

    /**
     * Decodes a SetError message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SetError
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcamera.SetError;

    /**
     * Verifies a SetError message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SetError message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SetError
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.SetError;

    /**
     * Creates a plain object from a SetError message. Also converts values to other types if specified.
     * @param message SetError
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.SetError,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this SetError to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SetError
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a SetCam. */
  interface ISetCam {
    /** SetCam setParam */
    setParam?: smartcamera.ISetParam | null;

    /** SetCam setOta */
    setOta?: smartcamera.ISetOta | null;

    /** SetCam setError */
    setError?: smartcamera.ISetError | null;
  }

  /** Represents a SetCam. */
  class SetCam implements ISetCam {
    /**
     * Constructs a new SetCam.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.ISetCam);

    /** SetCam setParam. */
    public setParam?: smartcamera.ISetParam | null;

    /** SetCam setOta. */
    public setOta?: smartcamera.ISetOta | null;

    /** SetCam setError. */
    public setError?: smartcamera.ISetError | null;

    /**
     * Creates a new SetCam instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SetCam instance
     */
    public static create(properties?: smartcamera.ISetCam): smartcamera.SetCam;

    /**
     * Encodes the specified SetCam message. Does not implicitly {@link smartcamera.SetCam.verify|verify} messages.
     * @param message SetCam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: smartcamera.ISetCam, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SetCam message, length delimited. Does not implicitly {@link smartcamera.SetCam.verify|verify} messages.
     * @param message SetCam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.ISetCam,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a SetCam message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SetCam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.SetCam;

    /**
     * Decodes a SetCam message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SetCam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcamera.SetCam;

    /**
     * Verifies a SetCam message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a SetCam message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SetCam
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.SetCam;

    /**
     * Creates a plain object from a SetCam message. Also converts values to other types if specified.
     * @param message SetCam
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.SetCam,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this SetCam to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for SetCam
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a DiagnosticsData. */
  interface IDiagnosticsData {
    /** DiagnosticsData cpuUsage */
    cpuUsage?: smartcamera.ICpuUsage | null;

    /** DiagnosticsData cpuTemperature */
    cpuTemperature?: smartcamera.ICpuTemp | null;

    /** DiagnosticsData diskStats */
    diskStats?: smartcamera.IDiskStatistics | null;

    /** DiagnosticsData memoryStats */
    memoryStats?: smartcamera.IMemoryStatistics | null;

    /** DiagnosticsData networkStats */
    networkStats?: smartcamera.INetworkStatistics | null;
  }

  /** Represents a DiagnosticsData. */
  class DiagnosticsData implements IDiagnosticsData {
    /**
     * Constructs a new DiagnosticsData.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.IDiagnosticsData);

    /** DiagnosticsData cpuUsage. */
    public cpuUsage?: smartcamera.ICpuUsage | null;

    /** DiagnosticsData cpuTemperature. */
    public cpuTemperature?: smartcamera.ICpuTemp | null;

    /** DiagnosticsData diskStats. */
    public diskStats?: smartcamera.IDiskStatistics | null;

    /** DiagnosticsData memoryStats. */
    public memoryStats?: smartcamera.IMemoryStatistics | null;

    /** DiagnosticsData networkStats. */
    public networkStats?: smartcamera.INetworkStatistics | null;

    /**
     * Creates a new DiagnosticsData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DiagnosticsData instance
     */
    public static create(properties?: smartcamera.IDiagnosticsData): smartcamera.DiagnosticsData;

    /**
     * Encodes the specified DiagnosticsData message. Does not implicitly {@link smartcamera.DiagnosticsData.verify|verify} messages.
     * @param message DiagnosticsData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcamera.IDiagnosticsData,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DiagnosticsData message, length delimited. Does not implicitly {@link smartcamera.DiagnosticsData.verify|verify} messages.
     * @param message DiagnosticsData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.IDiagnosticsData,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DiagnosticsData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DiagnosticsData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.DiagnosticsData;

    /**
     * Decodes a DiagnosticsData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DiagnosticsData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcamera.DiagnosticsData;

    /**
     * Verifies a DiagnosticsData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DiagnosticsData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DiagnosticsData
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.DiagnosticsData;

    /**
     * Creates a plain object from a DiagnosticsData message. Also converts values to other types if specified.
     * @param message DiagnosticsData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.DiagnosticsData,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this DiagnosticsData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DiagnosticsData
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a CpuUsage. */
  interface ICpuUsage {
    /** CpuUsage timestampUnix */
    timestampUnix?: number | Long | null;

    /** CpuUsage cpuUsagePercentage */
    cpuUsagePercentage?: number | null;
  }

  /** Represents a CpuUsage. */
  class CpuUsage implements ICpuUsage {
    /**
     * Constructs a new CpuUsage.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.ICpuUsage);

    /** CpuUsage timestampUnix. */
    public timestampUnix: number | Long;

    /** CpuUsage cpuUsagePercentage. */
    public cpuUsagePercentage: number;

    /**
     * Creates a new CpuUsage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CpuUsage instance
     */
    public static create(properties?: smartcamera.ICpuUsage): smartcamera.CpuUsage;

    /**
     * Encodes the specified CpuUsage message. Does not implicitly {@link smartcamera.CpuUsage.verify|verify} messages.
     * @param message CpuUsage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcamera.ICpuUsage,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified CpuUsage message, length delimited. Does not implicitly {@link smartcamera.CpuUsage.verify|verify} messages.
     * @param message CpuUsage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.ICpuUsage,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a CpuUsage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CpuUsage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.CpuUsage;

    /**
     * Decodes a CpuUsage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CpuUsage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcamera.CpuUsage;

    /**
     * Verifies a CpuUsage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CpuUsage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CpuUsage
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.CpuUsage;

    /**
     * Creates a plain object from a CpuUsage message. Also converts values to other types if specified.
     * @param message CpuUsage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.CpuUsage,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this CpuUsage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CpuUsage
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a CpuTemp. */
  interface ICpuTemp {
    /** CpuTemp timestampUnix */
    timestampUnix?: number | Long | null;

    /** CpuTemp cpuTemperatureCelcius */
    cpuTemperatureCelcius?: number | null;
  }

  /** Represents a CpuTemp. */
  class CpuTemp implements ICpuTemp {
    /**
     * Constructs a new CpuTemp.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.ICpuTemp);

    /** CpuTemp timestampUnix. */
    public timestampUnix: number | Long;

    /** CpuTemp cpuTemperatureCelcius. */
    public cpuTemperatureCelcius: number;

    /**
     * Creates a new CpuTemp instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CpuTemp instance
     */
    public static create(properties?: smartcamera.ICpuTemp): smartcamera.CpuTemp;

    /**
     * Encodes the specified CpuTemp message. Does not implicitly {@link smartcamera.CpuTemp.verify|verify} messages.
     * @param message CpuTemp message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcamera.ICpuTemp,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified CpuTemp message, length delimited. Does not implicitly {@link smartcamera.CpuTemp.verify|verify} messages.
     * @param message CpuTemp message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.ICpuTemp,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a CpuTemp message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CpuTemp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.CpuTemp;

    /**
     * Decodes a CpuTemp message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CpuTemp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcamera.CpuTemp;

    /**
     * Verifies a CpuTemp message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CpuTemp message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CpuTemp
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.CpuTemp;

    /**
     * Creates a plain object from a CpuTemp message. Also converts values to other types if specified.
     * @param message CpuTemp
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.CpuTemp,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this CpuTemp to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CpuTemp
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a DiskStatistics. */
  interface IDiskStatistics {
    /** DiskStatistics timestampUnix */
    timestampUnix?: number | Long | null;

    /** DiskStatistics diskUsed_KB */
    diskUsed_KB?: number | null;

    /** DiskStatistics diskAvailable_KB */
    diskAvailable_KB?: number | null;

    /** DiskStatistics diskUsedPercentage */
    diskUsedPercentage?: number | null;
  }

  /** Represents a DiskStatistics. */
  class DiskStatistics implements IDiskStatistics {
    /**
     * Constructs a new DiskStatistics.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.IDiskStatistics);

    /** DiskStatistics timestampUnix. */
    public timestampUnix: number | Long;

    /** DiskStatistics diskUsed_KB. */
    public diskUsed_KB: number;

    /** DiskStatistics diskAvailable_KB. */
    public diskAvailable_KB: number;

    /** DiskStatistics diskUsedPercentage. */
    public diskUsedPercentage: number;

    /**
     * Creates a new DiskStatistics instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DiskStatistics instance
     */
    public static create(properties?: smartcamera.IDiskStatistics): smartcamera.DiskStatistics;

    /**
     * Encodes the specified DiskStatistics message. Does not implicitly {@link smartcamera.DiskStatistics.verify|verify} messages.
     * @param message DiskStatistics message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcamera.IDiskStatistics,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DiskStatistics message, length delimited. Does not implicitly {@link smartcamera.DiskStatistics.verify|verify} messages.
     * @param message DiskStatistics message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.IDiskStatistics,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DiskStatistics message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DiskStatistics
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.DiskStatistics;

    /**
     * Decodes a DiskStatistics message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DiskStatistics
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcamera.DiskStatistics;

    /**
     * Verifies a DiskStatistics message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DiskStatistics message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DiskStatistics
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.DiskStatistics;

    /**
     * Creates a plain object from a DiskStatistics message. Also converts values to other types if specified.
     * @param message DiskStatistics
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.DiskStatistics,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this DiskStatistics to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DiskStatistics
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a MemoryStatistics. */
  interface IMemoryStatistics {
    /** MemoryStatistics timestampUnix */
    timestampUnix?: number | Long | null;

    /** MemoryStatistics memoryUsed_MiB */
    memoryUsed_MiB?: number | null;

    /** MemoryStatistics memoryAvailable_MiB */
    memoryAvailable_MiB?: number | null;
  }

  /** Represents a MemoryStatistics. */
  class MemoryStatistics implements IMemoryStatistics {
    /**
     * Constructs a new MemoryStatistics.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.IMemoryStatistics);

    /** MemoryStatistics timestampUnix. */
    public timestampUnix: number | Long;

    /** MemoryStatistics memoryUsed_MiB. */
    public memoryUsed_MiB: number;

    /** MemoryStatistics memoryAvailable_MiB. */
    public memoryAvailable_MiB: number;

    /**
     * Creates a new MemoryStatistics instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MemoryStatistics instance
     */
    public static create(properties?: smartcamera.IMemoryStatistics): smartcamera.MemoryStatistics;

    /**
     * Encodes the specified MemoryStatistics message. Does not implicitly {@link smartcamera.MemoryStatistics.verify|verify} messages.
     * @param message MemoryStatistics message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcamera.IMemoryStatistics,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified MemoryStatistics message, length delimited. Does not implicitly {@link smartcamera.MemoryStatistics.verify|verify} messages.
     * @param message MemoryStatistics message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.IMemoryStatistics,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a MemoryStatistics message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MemoryStatistics
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.MemoryStatistics;

    /**
     * Decodes a MemoryStatistics message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MemoryStatistics
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcamera.MemoryStatistics;

    /**
     * Verifies a MemoryStatistics message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a MemoryStatistics message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MemoryStatistics
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.MemoryStatistics;

    /**
     * Creates a plain object from a MemoryStatistics message. Also converts values to other types if specified.
     * @param message MemoryStatistics
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.MemoryStatistics,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this MemoryStatistics to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for MemoryStatistics
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a NetworkStatistics. */
  interface INetworkStatistics {
    /** NetworkStatistics timestampUnix */
    timestampUnix?: number | Long | null;

    /** NetworkStatistics pingMillis */
    pingMillis?: number | null;
  }

  /** Represents a NetworkStatistics. */
  class NetworkStatistics implements INetworkStatistics {
    /**
     * Constructs a new NetworkStatistics.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.INetworkStatistics);

    /** NetworkStatistics timestampUnix. */
    public timestampUnix: number | Long;

    /** NetworkStatistics pingMillis. */
    public pingMillis: number;

    /**
     * Creates a new NetworkStatistics instance using the specified properties.
     * @param [properties] Properties to set
     * @returns NetworkStatistics instance
     */
    public static create(
      properties?: smartcamera.INetworkStatistics,
    ): smartcamera.NetworkStatistics;

    /**
     * Encodes the specified NetworkStatistics message. Does not implicitly {@link smartcamera.NetworkStatistics.verify|verify} messages.
     * @param message NetworkStatistics message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcamera.INetworkStatistics,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified NetworkStatistics message, length delimited. Does not implicitly {@link smartcamera.NetworkStatistics.verify|verify} messages.
     * @param message NetworkStatistics message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.INetworkStatistics,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a NetworkStatistics message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns NetworkStatistics
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.NetworkStatistics;

    /**
     * Decodes a NetworkStatistics message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns NetworkStatistics
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcamera.NetworkStatistics;

    /**
     * Verifies a NetworkStatistics message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a NetworkStatistics message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns NetworkStatistics
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.NetworkStatistics;

    /**
     * Creates a plain object from a NetworkStatistics message. Also converts values to other types if specified.
     * @param message NetworkStatistics
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.NetworkStatistics,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this NetworkStatistics to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for NetworkStatistics
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an AlertCameraOffline. */
  interface IAlertCameraOffline {
    /** AlertCameraOffline sensorCode */
    sensorCode?: string[] | null;
  }

  /** Represents an AlertCameraOffline. */
  class AlertCameraOffline implements IAlertCameraOffline {
    /**
     * Constructs a new AlertCameraOffline.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcamera.IAlertCameraOffline);

    /** AlertCameraOffline sensorCode. */
    public sensorCode: string[];

    /**
     * Creates a new AlertCameraOffline instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AlertCameraOffline instance
     */
    public static create(
      properties?: smartcamera.IAlertCameraOffline,
    ): smartcamera.AlertCameraOffline;

    /**
     * Encodes the specified AlertCameraOffline message. Does not implicitly {@link smartcamera.AlertCameraOffline.verify|verify} messages.
     * @param message AlertCameraOffline message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcamera.IAlertCameraOffline,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified AlertCameraOffline message, length delimited. Does not implicitly {@link smartcamera.AlertCameraOffline.verify|verify} messages.
     * @param message AlertCameraOffline message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcamera.IAlertCameraOffline,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an AlertCameraOffline message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AlertCameraOffline
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcamera.AlertCameraOffline;

    /**
     * Decodes an AlertCameraOffline message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AlertCameraOffline
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcamera.AlertCameraOffline;

    /**
     * Verifies an AlertCameraOffline message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an AlertCameraOffline message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AlertCameraOffline
     */
    public static fromObject(object: { [k: string]: any }): smartcamera.AlertCameraOffline;

    /**
     * Creates a plain object from an AlertCameraOffline message. Also converts values to other types if specified.
     * @param message AlertCameraOffline
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcamera.AlertCameraOffline,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this AlertCameraOffline to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for AlertCameraOffline
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}

/** Namespace smartcontroller. */
export namespace smartcontroller {
  /** Properties of a ControllerContent. */
  interface IControllerContent {
    /** ControllerContent meta */
    meta?: Uint8Array | null;

    /** ControllerContent infoDevice */
    infoDevice?: commoniot.IInfoDevice | null;

    /** ControllerContent infoFarm */
    infoFarm?: commoniot.IInfoFarm | null;

    /** ControllerContent startCycle */
    startCycle?: commoniot.IStartCycle | null;

    /** ControllerContent stopCycle */
    stopCycle?: commoniot.IStopCycle | null;

    /** ControllerContent reset */
    reset?: commoniot.IReset | null;

    /** ControllerContent ping */
    ping?: commoniot.IPing | null;

    /** ControllerContent ota */
    ota?: commoniot.IOta | null;

    /** ControllerContent mapDevice */
    mapDevice?: commoniot.IMapDevice | null;

    /** ControllerContent reportSetting */
    reportSetting?: commoniot.IReportSetting | null;

    /** ControllerContent controllerData */
    controllerData?: smartcontroller.IControllerData | null;

    /** ControllerContent controllerStatus */
    controllerStatus?: smartcontroller.IControllerStatus | null;

    /** ControllerContent controllerSetting */
    controllerSetting?: smartcontroller.IControllerSetting | null;

    /** ControllerContent controllerLocalComm */
    controllerLocalComm?: smartcontroller.IControllerLocalComm | null;

    /** ControllerContent error */
    error?: commoniot.IError | null;
  }

  /** Represents a ControllerContent. */
  class ControllerContent implements IControllerContent {
    /**
     * Constructs a new ControllerContent.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IControllerContent);

    /** ControllerContent meta. */
    public meta: Uint8Array;

    /** ControllerContent infoDevice. */
    public infoDevice?: commoniot.IInfoDevice | null;

    /** ControllerContent infoFarm. */
    public infoFarm?: commoniot.IInfoFarm | null;

    /** ControllerContent startCycle. */
    public startCycle?: commoniot.IStartCycle | null;

    /** ControllerContent stopCycle. */
    public stopCycle?: commoniot.IStopCycle | null;

    /** ControllerContent reset. */
    public reset?: commoniot.IReset | null;

    /** ControllerContent ping. */
    public ping?: commoniot.IPing | null;

    /** ControllerContent ota. */
    public ota?: commoniot.IOta | null;

    /** ControllerContent mapDevice. */
    public mapDevice?: commoniot.IMapDevice | null;

    /** ControllerContent reportSetting. */
    public reportSetting?: commoniot.IReportSetting | null;

    /** ControllerContent controllerData. */
    public controllerData?: smartcontroller.IControllerData | null;

    /** ControllerContent controllerStatus. */
    public controllerStatus?: smartcontroller.IControllerStatus | null;

    /** ControllerContent controllerSetting. */
    public controllerSetting?: smartcontroller.IControllerSetting | null;

    /** ControllerContent controllerLocalComm. */
    public controllerLocalComm?: smartcontroller.IControllerLocalComm | null;

    /** ControllerContent error. */
    public error?: commoniot.IError | null;

    /**
     * Creates a new ControllerContent instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ControllerContent instance
     */
    public static create(
      properties?: smartcontroller.IControllerContent,
    ): smartcontroller.ControllerContent;

    /**
     * Encodes the specified ControllerContent message. Does not implicitly {@link smartcontroller.ControllerContent.verify|verify} messages.
     * @param message ControllerContent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IControllerContent,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ControllerContent message, length delimited. Does not implicitly {@link smartcontroller.ControllerContent.verify|verify} messages.
     * @param message ControllerContent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IControllerContent,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ControllerContent message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ControllerContent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.ControllerContent;

    /**
     * Decodes a ControllerContent message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ControllerContent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcontroller.ControllerContent;

    /**
     * Verifies a ControllerContent message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ControllerContent message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ControllerContent
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.ControllerContent;

    /**
     * Creates a plain object from a ControllerContent message. Also converts values to other types if specified.
     * @param message ControllerContent
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.ControllerContent,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ControllerContent to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ControllerContent
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ControllerData. */
  interface IControllerData {
    /** ControllerData fan */
    fan?: commoniot.ISignal[] | null;

    /** ControllerData heater */
    heater?: commoniot.ISignal | null;

    /** ControllerData cooler */
    cooler?: commoniot.ISignal | null;

    /** ControllerData lamp */
    lamp?: commoniot.ISignal | null;

    /** ControllerData alarm */
    alarm?: commoniot.ISignal | null;

    /** ControllerData intermit */
    intermit?: commoniot.ISignal[] | null;

    /** ControllerData temp */
    temp?: number[] | null;

    /** ControllerData humi */
    humi?: number[] | null;

    /** ControllerData rssi */
    rssi?: number | null;

    /** ControllerData extTemp */
    extTemp?: number | null;

    /** ControllerData extHumi */
    extHumi?: number | null;
  }

  /** Represents a ControllerData. */
  class ControllerData implements IControllerData {
    /**
     * Constructs a new ControllerData.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IControllerData);

    /** ControllerData fan. */
    public fan: commoniot.ISignal[];

    /** ControllerData heater. */
    public heater?: commoniot.ISignal | null;

    /** ControllerData cooler. */
    public cooler?: commoniot.ISignal | null;

    /** ControllerData lamp. */
    public lamp?: commoniot.ISignal | null;

    /** ControllerData alarm. */
    public alarm?: commoniot.ISignal | null;

    /** ControllerData intermit. */
    public intermit: commoniot.ISignal[];

    /** ControllerData temp. */
    public temp: number[];

    /** ControllerData humi. */
    public humi: number[];

    /** ControllerData rssi. */
    public rssi: number;

    /** ControllerData extTemp. */
    public extTemp: number;

    /** ControllerData extHumi. */
    public extHumi: number;

    /**
     * Creates a new ControllerData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ControllerData instance
     */
    public static create(
      properties?: smartcontroller.IControllerData,
    ): smartcontroller.ControllerData;

    /**
     * Encodes the specified ControllerData message. Does not implicitly {@link smartcontroller.ControllerData.verify|verify} messages.
     * @param message ControllerData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IControllerData,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ControllerData message, length delimited. Does not implicitly {@link smartcontroller.ControllerData.verify|verify} messages.
     * @param message ControllerData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IControllerData,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ControllerData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ControllerData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.ControllerData;

    /**
     * Decodes a ControllerData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ControllerData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcontroller.ControllerData;

    /**
     * Verifies a ControllerData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ControllerData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ControllerData
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.ControllerData;

    /**
     * Creates a plain object from a ControllerData message. Also converts values to other types if specified.
     * @param message ControllerData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.ControllerData,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ControllerData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ControllerData
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ControllerStatus. */
  interface IControllerStatus {
    /** ControllerStatus rtc */
    rtc?: number | null;

    /** ControllerStatus relay */
    relay?: number | null;

    /** ControllerStatus modbus */
    modbus?: number | null;

    /** ControllerStatus sdcard */
    sdcard?: number | null;

    /** ControllerStatus eeprom */
    eeprom?: number | null;

    /** ControllerStatus stm32 */
    stm32?: number | null;

    /** ControllerStatus hot */
    hot?: number | null;

    /** ControllerStatus cold */
    cold?: number | null;

    /** ControllerStatus undervolt */
    undervolt?: number | null;

    /** ControllerStatus errorSht20 */
    errorSht20?: smartcontroller.IErrorSht20[] | null;

    /** ControllerStatus button */
    button?: smartcontroller.IButton | null;

    /** ControllerStatus priority */
    priority?: number | null;
  }

  /** Represents a ControllerStatus. */
  class ControllerStatus implements IControllerStatus {
    /**
     * Constructs a new ControllerStatus.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IControllerStatus);

    /** ControllerStatus rtc. */
    public rtc: number;

    /** ControllerStatus relay. */
    public relay: number;

    /** ControllerStatus modbus. */
    public modbus: number;

    /** ControllerStatus sdcard. */
    public sdcard: number;

    /** ControllerStatus eeprom. */
    public eeprom: number;

    /** ControllerStatus stm32. */
    public stm32: number;

    /** ControllerStatus hot. */
    public hot: number;

    /** ControllerStatus cold. */
    public cold: number;

    /** ControllerStatus undervolt. */
    public undervolt: number;

    /** ControllerStatus errorSht20. */
    public errorSht20: smartcontroller.IErrorSht20[];

    /** ControllerStatus button. */
    public button?: smartcontroller.IButton | null;

    /** ControllerStatus priority. */
    public priority: number;

    /**
     * Creates a new ControllerStatus instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ControllerStatus instance
     */
    public static create(
      properties?: smartcontroller.IControllerStatus,
    ): smartcontroller.ControllerStatus;

    /**
     * Encodes the specified ControllerStatus message. Does not implicitly {@link smartcontroller.ControllerStatus.verify|verify} messages.
     * @param message ControllerStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IControllerStatus,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ControllerStatus message, length delimited. Does not implicitly {@link smartcontroller.ControllerStatus.verify|verify} messages.
     * @param message ControllerStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IControllerStatus,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ControllerStatus message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ControllerStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.ControllerStatus;

    /**
     * Decodes a ControllerStatus message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ControllerStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcontroller.ControllerStatus;

    /**
     * Verifies a ControllerStatus message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ControllerStatus message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ControllerStatus
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.ControllerStatus;

    /**
     * Creates a plain object from a ControllerStatus message. Also converts values to other types if specified.
     * @param message ControllerStatus
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.ControllerStatus,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ControllerStatus to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ControllerStatus
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ControllerSetting. */
  interface IControllerSetting {
    /** ControllerSetting tOffSet */
    tOffSet?: number | null;

    /** ControllerSetting heater */
    heater?: number | null;

    /** ControllerSetting growth */
    growth?: number | null;

    /** ControllerSetting reset */
    reset?: number | null;

    /** ControllerSetting tempDayOne */
    tempDayOne?: number | null;

    /** ControllerSetting reqTemp */
    reqTemp?: number | null;

    /** ControllerSetting cooler */
    cooler?: smartcontroller.ICooler | null;

    /** ControllerSetting alarm */
    alarm?: smartcontroller.IAlarm | null;

    /** ControllerSetting reduction */
    reduction?: smartcontroller.IReductionOpt[] | null;

    /** ControllerSetting fan */
    fan?: smartcontroller.IFanOpt[] | null;

    /** ControllerSetting light */
    light?: smartcontroller.ILightOpt[] | null;

    /** ControllerSetting sensor */
    sensor?: number | null;

    /** ControllerSetting rotMode */
    rotMode?: smartcontroller.IRotationMode | null;
  }

  /** Represents a ControllerSetting. */
  class ControllerSetting implements IControllerSetting {
    /**
     * Constructs a new ControllerSetting.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IControllerSetting);

    /** ControllerSetting tOffSet. */
    public tOffSet: number;

    /** ControllerSetting heater. */
    public heater: number;

    /** ControllerSetting growth. */
    public growth: number;

    /** ControllerSetting reset. */
    public reset: number;

    /** ControllerSetting tempDayOne. */
    public tempDayOne: number;

    /** ControllerSetting reqTemp. */
    public reqTemp: number;

    /** ControllerSetting cooler. */
    public cooler?: smartcontroller.ICooler | null;

    /** ControllerSetting alarm. */
    public alarm?: smartcontroller.IAlarm | null;

    /** ControllerSetting reduction. */
    public reduction: smartcontroller.IReductionOpt[];

    /** ControllerSetting fan. */
    public fan: smartcontroller.IFanOpt[];

    /** ControllerSetting light. */
    public light: smartcontroller.ILightOpt[];

    /** ControllerSetting sensor. */
    public sensor: number;

    /** ControllerSetting rotMode. */
    public rotMode?: smartcontroller.IRotationMode | null;

    /**
     * Creates a new ControllerSetting instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ControllerSetting instance
     */
    public static create(
      properties?: smartcontroller.IControllerSetting,
    ): smartcontroller.ControllerSetting;

    /**
     * Encodes the specified ControllerSetting message. Does not implicitly {@link smartcontroller.ControllerSetting.verify|verify} messages.
     * @param message ControllerSetting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IControllerSetting,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ControllerSetting message, length delimited. Does not implicitly {@link smartcontroller.ControllerSetting.verify|verify} messages.
     * @param message ControllerSetting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IControllerSetting,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ControllerSetting message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ControllerSetting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.ControllerSetting;

    /**
     * Decodes a ControllerSetting message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ControllerSetting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcontroller.ControllerSetting;

    /**
     * Verifies a ControllerSetting message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ControllerSetting message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ControllerSetting
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.ControllerSetting;

    /**
     * Creates a plain object from a ControllerSetting message. Also converts values to other types if specified.
     * @param message ControllerSetting
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.ControllerSetting,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ControllerSetting to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ControllerSetting
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an Alarm. */
  interface IAlarm {
    /** Alarm cold */
    cold?: number | null;

    /** Alarm hot */
    hot?: number | null;
  }

  /** Represents an Alarm. */
  class Alarm implements IAlarm {
    /**
     * Constructs a new Alarm.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IAlarm);

    /** Alarm cold. */
    public cold: number;

    /** Alarm hot. */
    public hot: number;

    /**
     * Creates a new Alarm instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Alarm instance
     */
    public static create(properties?: smartcontroller.IAlarm): smartcontroller.Alarm;

    /**
     * Encodes the specified Alarm message. Does not implicitly {@link smartcontroller.Alarm.verify|verify} messages.
     * @param message Alarm message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IAlarm,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Alarm message, length delimited. Does not implicitly {@link smartcontroller.Alarm.verify|verify} messages.
     * @param message Alarm message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IAlarm,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an Alarm message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Alarm
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.Alarm;

    /**
     * Decodes an Alarm message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Alarm
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcontroller.Alarm;

    /**
     * Verifies an Alarm message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an Alarm message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Alarm
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.Alarm;

    /**
     * Creates a plain object from an Alarm message. Also converts values to other types if specified.
     * @param message Alarm
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.Alarm,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Alarm to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Alarm
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Cooler. */
  interface ICooler {
    /** Cooler tempCool */
    tempCool?: number | null;

    /** Cooler TimeCool */
    TimeCool?: smartcontroller.ITime | null;
  }

  /** Represents a Cooler. */
  class Cooler implements ICooler {
    /**
     * Constructs a new Cooler.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.ICooler);

    /** Cooler tempCool. */
    public tempCool: number;

    /** Cooler TimeCool. */
    public TimeCool?: smartcontroller.ITime | null;

    /**
     * Creates a new Cooler instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Cooler instance
     */
    public static create(properties?: smartcontroller.ICooler): smartcontroller.Cooler;

    /**
     * Encodes the specified Cooler message. Does not implicitly {@link smartcontroller.Cooler.verify|verify} messages.
     * @param message Cooler message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.ICooler,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Cooler message, length delimited. Does not implicitly {@link smartcontroller.Cooler.verify|verify} messages.
     * @param message Cooler message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.ICooler,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Cooler message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Cooler
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.Cooler;

    /**
     * Decodes a Cooler message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Cooler
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcontroller.Cooler;

    /**
     * Verifies a Cooler message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Cooler message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Cooler
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.Cooler;

    /**
     * Creates a plain object from a Cooler message. Also converts values to other types if specified.
     * @param message Cooler
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.Cooler,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Cooler to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Cooler
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a LightOpt. */
  interface ILightOpt {
    /** LightOpt id */
    id?: number | null;

    /** LightOpt time */
    time?: smartcontroller.ITime | null;
  }

  /** Represents a LightOpt. */
  class LightOpt implements ILightOpt {
    /**
     * Constructs a new LightOpt.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.ILightOpt);

    /** LightOpt id. */
    public id: number;

    /** LightOpt time. */
    public time?: smartcontroller.ITime | null;

    /**
     * Creates a new LightOpt instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LightOpt instance
     */
    public static create(properties?: smartcontroller.ILightOpt): smartcontroller.LightOpt;

    /**
     * Encodes the specified LightOpt message. Does not implicitly {@link smartcontroller.LightOpt.verify|verify} messages.
     * @param message LightOpt message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.ILightOpt,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified LightOpt message, length delimited. Does not implicitly {@link smartcontroller.LightOpt.verify|verify} messages.
     * @param message LightOpt message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.ILightOpt,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a LightOpt message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LightOpt
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.LightOpt;

    /**
     * Decodes a LightOpt message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LightOpt
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcontroller.LightOpt;

    /**
     * Verifies a LightOpt message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a LightOpt message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LightOpt
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.LightOpt;

    /**
     * Creates a plain object from a LightOpt message. Also converts values to other types if specified.
     * @param message LightOpt
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.LightOpt,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this LightOpt to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for LightOpt
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ReductionOpt. */
  interface IReductionOpt {
    /** ReductionOpt id */
    id?: number | null;

    /** ReductionOpt tempDay */
    tempDay?: smartcontroller.ITempDay | null;
  }

  /** Represents a ReductionOpt. */
  class ReductionOpt implements IReductionOpt {
    /**
     * Constructs a new ReductionOpt.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IReductionOpt);

    /** ReductionOpt id. */
    public id: number;

    /** ReductionOpt tempDay. */
    public tempDay?: smartcontroller.ITempDay | null;

    /**
     * Creates a new ReductionOpt instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ReductionOpt instance
     */
    public static create(properties?: smartcontroller.IReductionOpt): smartcontroller.ReductionOpt;

    /**
     * Encodes the specified ReductionOpt message. Does not implicitly {@link smartcontroller.ReductionOpt.verify|verify} messages.
     * @param message ReductionOpt message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IReductionOpt,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ReductionOpt message, length delimited. Does not implicitly {@link smartcontroller.ReductionOpt.verify|verify} messages.
     * @param message ReductionOpt message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IReductionOpt,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ReductionOpt message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ReductionOpt
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.ReductionOpt;

    /**
     * Decodes a ReductionOpt message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ReductionOpt
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcontroller.ReductionOpt;

    /**
     * Verifies a ReductionOpt message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ReductionOpt message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ReductionOpt
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.ReductionOpt;

    /**
     * Creates a plain object from a ReductionOpt message. Also converts values to other types if specified.
     * @param message ReductionOpt
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.ReductionOpt,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ReductionOpt to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ReductionOpt
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a FanOpt. */
  interface IFanOpt {
    /** FanOpt id */
    id?: number | null;

    /** FanOpt mode */
    mode?: number | null;

    /** FanOpt diff */
    diff?: number | null;

    /** FanOpt time */
    time?: smartcontroller.ITime | null;

    /** FanOpt intKipas */
    intKipas?: number | null;
  }

  /** Represents a FanOpt. */
  class FanOpt implements IFanOpt {
    /**
     * Constructs a new FanOpt.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IFanOpt);

    /** FanOpt id. */
    public id: number;

    /** FanOpt mode. */
    public mode: number;

    /** FanOpt diff. */
    public diff: number;

    /** FanOpt time. */
    public time?: smartcontroller.ITime | null;

    /** FanOpt intKipas. */
    public intKipas: number;

    /**
     * Creates a new FanOpt instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FanOpt instance
     */
    public static create(properties?: smartcontroller.IFanOpt): smartcontroller.FanOpt;

    /**
     * Encodes the specified FanOpt message. Does not implicitly {@link smartcontroller.FanOpt.verify|verify} messages.
     * @param message FanOpt message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IFanOpt,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified FanOpt message, length delimited. Does not implicitly {@link smartcontroller.FanOpt.verify|verify} messages.
     * @param message FanOpt message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IFanOpt,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a FanOpt message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FanOpt
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.FanOpt;

    /**
     * Decodes a FanOpt message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FanOpt
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcontroller.FanOpt;

    /**
     * Verifies a FanOpt message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a FanOpt message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FanOpt
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.FanOpt;

    /**
     * Creates a plain object from a FanOpt message. Also converts values to other types if specified.
     * @param message FanOpt
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.FanOpt,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this FanOpt to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FanOpt
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Time. */
  interface ITime {
    /** Time on */
    on?: number | null;

    /** Time off */
    off?: number | null;
  }

  /** Represents a Time. */
  class Time implements ITime {
    /**
     * Constructs a new Time.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.ITime);

    /** Time on. */
    public on: number;

    /** Time off. */
    public off: number;

    /**
     * Creates a new Time instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Time instance
     */
    public static create(properties?: smartcontroller.ITime): smartcontroller.Time;

    /**
     * Encodes the specified Time message. Does not implicitly {@link smartcontroller.Time.verify|verify} messages.
     * @param message Time message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.ITime,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Time message, length delimited. Does not implicitly {@link smartcontroller.Time.verify|verify} messages.
     * @param message Time message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.ITime,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Time message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Time
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.Time;

    /**
     * Decodes a Time message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Time
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcontroller.Time;

    /**
     * Verifies a Time message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Time message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Time
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.Time;

    /**
     * Creates a plain object from a Time message. Also converts values to other types if specified.
     * @param message Time
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.Time,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Time to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Time
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a TempDay. */
  interface ITempDay {
    /** TempDay temp */
    temp?: number | null;

    /** TempDay days */
    days?: number | null;
  }

  /** Represents a TempDay. */
  class TempDay implements ITempDay {
    /**
     * Constructs a new TempDay.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.ITempDay);

    /** TempDay temp. */
    public temp: number;

    /** TempDay days. */
    public days: number;

    /**
     * Creates a new TempDay instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TempDay instance
     */
    public static create(properties?: smartcontroller.ITempDay): smartcontroller.TempDay;

    /**
     * Encodes the specified TempDay message. Does not implicitly {@link smartcontroller.TempDay.verify|verify} messages.
     * @param message TempDay message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.ITempDay,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified TempDay message, length delimited. Does not implicitly {@link smartcontroller.TempDay.verify|verify} messages.
     * @param message TempDay message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.ITempDay,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a TempDay message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TempDay
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.TempDay;

    /**
     * Decodes a TempDay message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TempDay
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcontroller.TempDay;

    /**
     * Verifies a TempDay message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a TempDay message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TempDay
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.TempDay;

    /**
     * Creates a plain object from a TempDay message. Also converts values to other types if specified.
     * @param message TempDay
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.TempDay,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this TempDay to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for TempDay
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a RotationMode. */
  interface IRotationMode {
    /** RotationMode mode */
    mode?: number | null;

    /** RotationMode time */
    time?: smartcontroller.ITime | null;

    /** RotationMode loop */
    loop?: number | null;
  }

  /** Represents a RotationMode. */
  class RotationMode implements IRotationMode {
    /**
     * Constructs a new RotationMode.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IRotationMode);

    /** RotationMode mode. */
    public mode: number;

    /** RotationMode time. */
    public time?: smartcontroller.ITime | null;

    /** RotationMode loop. */
    public loop: number;

    /**
     * Creates a new RotationMode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RotationMode instance
     */
    public static create(properties?: smartcontroller.IRotationMode): smartcontroller.RotationMode;

    /**
     * Encodes the specified RotationMode message. Does not implicitly {@link smartcontroller.RotationMode.verify|verify} messages.
     * @param message RotationMode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IRotationMode,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified RotationMode message, length delimited. Does not implicitly {@link smartcontroller.RotationMode.verify|verify} messages.
     * @param message RotationMode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IRotationMode,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a RotationMode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RotationMode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.RotationMode;

    /**
     * Decodes a RotationMode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RotationMode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcontroller.RotationMode;

    /**
     * Verifies a RotationMode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a RotationMode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RotationMode
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.RotationMode;

    /**
     * Creates a plain object from a RotationMode message. Also converts values to other types if specified.
     * @param message RotationMode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.RotationMode,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this RotationMode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for RotationMode
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an ErrorSht20. */
  interface IErrorSht20 {
    /** ErrorSht20 id */
    id?: number | null;

    /** ErrorSht20 exception */
    exception?: number | null;

    /** ErrorSht20 command */
    command?: number | null;
  }

  /** Represents an ErrorSht20. */
  class ErrorSht20 implements IErrorSht20 {
    /**
     * Constructs a new ErrorSht20.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IErrorSht20);

    /** ErrorSht20 id. */
    public id: number;

    /** ErrorSht20 exception. */
    public exception: number;

    /** ErrorSht20 command. */
    public command: number;

    /**
     * Creates a new ErrorSht20 instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ErrorSht20 instance
     */
    public static create(properties?: smartcontroller.IErrorSht20): smartcontroller.ErrorSht20;

    /**
     * Encodes the specified ErrorSht20 message. Does not implicitly {@link smartcontroller.ErrorSht20.verify|verify} messages.
     * @param message ErrorSht20 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IErrorSht20,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ErrorSht20 message, length delimited. Does not implicitly {@link smartcontroller.ErrorSht20.verify|verify} messages.
     * @param message ErrorSht20 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IErrorSht20,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an ErrorSht20 message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ErrorSht20
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.ErrorSht20;

    /**
     * Decodes an ErrorSht20 message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ErrorSht20
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcontroller.ErrorSht20;

    /**
     * Verifies an ErrorSht20 message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an ErrorSht20 message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ErrorSht20
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.ErrorSht20;

    /**
     * Creates a plain object from an ErrorSht20 message. Also converts values to other types if specified.
     * @param message ErrorSht20
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.ErrorSht20,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ErrorSht20 to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ErrorSht20
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Button. */
  interface IButton {
    /** Button id */
    id?: number | null;

    /** Button command */
    command?: number | null;
  }

  /** Represents a Button. */
  class Button implements IButton {
    /**
     * Constructs a new Button.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IButton);

    /** Button id. */
    public id: number;

    /** Button command. */
    public command: number;

    /**
     * Creates a new Button instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Button instance
     */
    public static create(properties?: smartcontroller.IButton): smartcontroller.Button;

    /**
     * Encodes the specified Button message. Does not implicitly {@link smartcontroller.Button.verify|verify} messages.
     * @param message Button message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IButton,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Button message, length delimited. Does not implicitly {@link smartcontroller.Button.verify|verify} messages.
     * @param message Button message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IButton,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Button message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Button
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.Button;

    /**
     * Decodes a Button message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Button
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartcontroller.Button;

    /**
     * Verifies a Button message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Button message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Button
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.Button;

    /**
     * Creates a plain object from a Button message. Also converts values to other types if specified.
     * @param message Button
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.Button,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Button to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Button
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ControllerLocalComm. */
  interface IControllerLocalComm {
    /** ControllerLocalComm mac */
    mac?: string | null;

    /** ControllerLocalComm atc */
    atc?: number[] | null;

    /** ControllerLocalComm status */
    status?: number | null;
  }

  /** Represents a ControllerLocalComm. */
  class ControllerLocalComm implements IControllerLocalComm {
    /**
     * Constructs a new ControllerLocalComm.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartcontroller.IControllerLocalComm);

    /** ControllerLocalComm mac. */
    public mac?: string | null;

    /** ControllerLocalComm atc. */
    public atc: number[];

    /** ControllerLocalComm status. */
    public status?: number | null;

    /** ControllerLocalComm _mac. */
    public _mac?: 'mac';

    /** ControllerLocalComm _status. */
    public _status?: 'status';

    /**
     * Creates a new ControllerLocalComm instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ControllerLocalComm instance
     */
    public static create(
      properties?: smartcontroller.IControllerLocalComm,
    ): smartcontroller.ControllerLocalComm;

    /**
     * Encodes the specified ControllerLocalComm message. Does not implicitly {@link smartcontroller.ControllerLocalComm.verify|verify} messages.
     * @param message ControllerLocalComm message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartcontroller.IControllerLocalComm,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ControllerLocalComm message, length delimited. Does not implicitly {@link smartcontroller.ControllerLocalComm.verify|verify} messages.
     * @param message ControllerLocalComm message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartcontroller.IControllerLocalComm,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ControllerLocalComm message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ControllerLocalComm
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartcontroller.ControllerLocalComm;

    /**
     * Decodes a ControllerLocalComm message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ControllerLocalComm
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartcontroller.ControllerLocalComm;

    /**
     * Verifies a ControllerLocalComm message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ControllerLocalComm message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ControllerLocalComm
     */
    public static fromObject(object: { [k: string]: any }): smartcontroller.ControllerLocalComm;

    /**
     * Creates a plain object from a ControllerLocalComm message. Also converts values to other types if specified.
     * @param message ControllerLocalComm
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartcontroller.ControllerLocalComm,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ControllerLocalComm to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ControllerLocalComm
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}

/** Namespace smartelmon. */
export namespace smartelmon {
  /** Properties of an ElmonContent. */
  interface IElmonContent {
    /** ElmonContent meta */
    meta?: Uint8Array | null;

    /** ElmonContent infoDevice */
    infoDevice?: commoniot.IInfoDevice | null;

    /** ElmonContent infoFarm */
    infoFarm?: commoniot.IInfoFarm | null;

    /** ElmonContent startCycle */
    startCycle?: commoniot.IStartCycle | null;

    /** ElmonContent stopCycle */
    stopCycle?: commoniot.IStopCycle | null;

    /** ElmonContent reset */
    reset?: commoniot.IReset | null;

    /** ElmonContent ping */
    ping?: commoniot.IPing | null;

    /** ElmonContent ota */
    ota?: commoniot.IOta | null;

    /** ElmonContent reportSetting */
    reportSetting?: commoniot.IReportSetting | null;

    /** ElmonContent elmonData */
    elmonData?: smartelmon.IElmonData | null;

    /** ElmonContent elmonStatus */
    elmonStatus?: smartelmon.IElmonStatus | null;

    /** ElmonContent elmonSetting */
    elmonSetting?: smartelmon.IElmonSetting | null;

    /** ElmonContent error */
    error?: commoniot.IError | null;
  }

  /** Represents an ElmonContent. */
  class ElmonContent implements IElmonContent {
    /**
     * Constructs a new ElmonContent.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.IElmonContent);

    /** ElmonContent meta. */
    public meta: Uint8Array;

    /** ElmonContent infoDevice. */
    public infoDevice?: commoniot.IInfoDevice | null;

    /** ElmonContent infoFarm. */
    public infoFarm?: commoniot.IInfoFarm | null;

    /** ElmonContent startCycle. */
    public startCycle?: commoniot.IStartCycle | null;

    /** ElmonContent stopCycle. */
    public stopCycle?: commoniot.IStopCycle | null;

    /** ElmonContent reset. */
    public reset?: commoniot.IReset | null;

    /** ElmonContent ping. */
    public ping?: commoniot.IPing | null;

    /** ElmonContent ota. */
    public ota?: commoniot.IOta | null;

    /** ElmonContent reportSetting. */
    public reportSetting?: commoniot.IReportSetting | null;

    /** ElmonContent elmonData. */
    public elmonData?: smartelmon.IElmonData | null;

    /** ElmonContent elmonStatus. */
    public elmonStatus?: smartelmon.IElmonStatus | null;

    /** ElmonContent elmonSetting. */
    public elmonSetting?: smartelmon.IElmonSetting | null;

    /** ElmonContent error. */
    public error?: commoniot.IError | null;

    /**
     * Creates a new ElmonContent instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ElmonContent instance
     */
    public static create(properties?: smartelmon.IElmonContent): smartelmon.ElmonContent;

    /**
     * Encodes the specified ElmonContent message. Does not implicitly {@link smartelmon.ElmonContent.verify|verify} messages.
     * @param message ElmonContent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartelmon.IElmonContent,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ElmonContent message, length delimited. Does not implicitly {@link smartelmon.ElmonContent.verify|verify} messages.
     * @param message ElmonContent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.IElmonContent,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an ElmonContent message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ElmonContent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartelmon.ElmonContent;

    /**
     * Decodes an ElmonContent message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ElmonContent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.ElmonContent;

    /**
     * Verifies an ElmonContent message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an ElmonContent message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ElmonContent
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.ElmonContent;

    /**
     * Creates a plain object from an ElmonContent message. Also converts values to other types if specified.
     * @param message ElmonContent
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.ElmonContent,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ElmonContent to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ElmonContent
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an ElmonSetting. */
  interface IElmonSetting {
    /** ElmonSetting voltParams */
    voltParams?: smartelmon.IVoltParams | null;

    /** ElmonSetting pfParams */
    pfParams?: number | null;
  }

  /** Represents an ElmonSetting. */
  class ElmonSetting implements IElmonSetting {
    /**
     * Constructs a new ElmonSetting.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.IElmonSetting);

    /** ElmonSetting voltParams. */
    public voltParams?: smartelmon.IVoltParams | null;

    /** ElmonSetting pfParams. */
    public pfParams: number;

    /**
     * Creates a new ElmonSetting instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ElmonSetting instance
     */
    public static create(properties?: smartelmon.IElmonSetting): smartelmon.ElmonSetting;

    /**
     * Encodes the specified ElmonSetting message. Does not implicitly {@link smartelmon.ElmonSetting.verify|verify} messages.
     * @param message ElmonSetting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartelmon.IElmonSetting,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ElmonSetting message, length delimited. Does not implicitly {@link smartelmon.ElmonSetting.verify|verify} messages.
     * @param message ElmonSetting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.IElmonSetting,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an ElmonSetting message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ElmonSetting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartelmon.ElmonSetting;

    /**
     * Decodes an ElmonSetting message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ElmonSetting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.ElmonSetting;

    /**
     * Verifies an ElmonSetting message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an ElmonSetting message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ElmonSetting
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.ElmonSetting;

    /**
     * Creates a plain object from an ElmonSetting message. Also converts values to other types if specified.
     * @param message ElmonSetting
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.ElmonSetting,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ElmonSetting to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ElmonSetting
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an ElmonData. */
  interface IElmonData {
    /** ElmonData voltage */
    voltage?: smartelmon.IVoltage | null;

    /** ElmonData current */
    current?: smartelmon.ICurrent | null;

    /** ElmonData power */
    power?: smartelmon.IPower | null;

    /** ElmonData freq */
    freq?: smartelmon.IFrequency | null;

    /** ElmonData thdVolt */
    thdVolt?: smartelmon.ITHDVoltage | null;

    /** ElmonData thdCurr */
    thdCurr?: smartelmon.ITHDCurrent | null;

    /** ElmonData wifiRssi */
    wifiRssi?: number | null;

    /** ElmonData energy */
    energy?: smartelmon.IEnergy | null;

    /** ElmonData angle */
    angle?: smartelmon.IAngle | null;

    /** ElmonData powerSource */
    powerSource?: number | null;
  }

  /** Represents an ElmonData. */
  class ElmonData implements IElmonData {
    /**
     * Constructs a new ElmonData.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.IElmonData);

    /** ElmonData voltage. */
    public voltage?: smartelmon.IVoltage | null;

    /** ElmonData current. */
    public current?: smartelmon.ICurrent | null;

    /** ElmonData power. */
    public power?: smartelmon.IPower | null;

    /** ElmonData freq. */
    public freq?: smartelmon.IFrequency | null;

    /** ElmonData thdVolt. */
    public thdVolt?: smartelmon.ITHDVoltage | null;

    /** ElmonData thdCurr. */
    public thdCurr?: smartelmon.ITHDCurrent | null;

    /** ElmonData wifiRssi. */
    public wifiRssi: number;

    /** ElmonData energy. */
    public energy?: smartelmon.IEnergy | null;

    /** ElmonData angle. */
    public angle?: smartelmon.IAngle | null;

    /** ElmonData powerSource. */
    public powerSource: number;

    /**
     * Creates a new ElmonData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ElmonData instance
     */
    public static create(properties?: smartelmon.IElmonData): smartelmon.ElmonData;

    /**
     * Encodes the specified ElmonData message. Does not implicitly {@link smartelmon.ElmonData.verify|verify} messages.
     * @param message ElmonData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartelmon.IElmonData,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ElmonData message, length delimited. Does not implicitly {@link smartelmon.ElmonData.verify|verify} messages.
     * @param message ElmonData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.IElmonData,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an ElmonData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ElmonData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartelmon.ElmonData;

    /**
     * Decodes an ElmonData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ElmonData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.ElmonData;

    /**
     * Verifies an ElmonData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an ElmonData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ElmonData
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.ElmonData;

    /**
     * Creates a plain object from an ElmonData message. Also converts values to other types if specified.
     * @param message ElmonData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.ElmonData,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ElmonData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ElmonData
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an ElmonStatus. */
  interface IElmonStatus {
    /** ElmonStatus underVoltage */
    underVoltage?: number | null;

    /** ElmonStatus overVoltage */
    overVoltage?: number | null;

    /** ElmonStatus underPF */
    underPF?: number | null;

    /** ElmonStatus phaseSequence */
    phaseSequence?: number | null;

    /** ElmonStatus onePhaseFailure */
    onePhaseFailure?: number | null;

    /** ElmonStatus rtc */
    rtc?: number | null;

    /** ElmonStatus sdcard */
    sdcard?: number | null;

    /** ElmonStatus modbus */
    modbus?: number | null;

    /** ElmonStatus powerOff */
    powerOff?: number | null;

    /** ElmonStatus buttonRst */
    buttonRst?: number | null;

    /** ElmonStatus priority */
    priority?: number | null;
  }

  /** Represents an ElmonStatus. */
  class ElmonStatus implements IElmonStatus {
    /**
     * Constructs a new ElmonStatus.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.IElmonStatus);

    /** ElmonStatus underVoltage. */
    public underVoltage: number;

    /** ElmonStatus overVoltage. */
    public overVoltage: number;

    /** ElmonStatus underPF. */
    public underPF: number;

    /** ElmonStatus phaseSequence. */
    public phaseSequence: number;

    /** ElmonStatus onePhaseFailure. */
    public onePhaseFailure: number;

    /** ElmonStatus rtc. */
    public rtc: number;

    /** ElmonStatus sdcard. */
    public sdcard: number;

    /** ElmonStatus modbus. */
    public modbus: number;

    /** ElmonStatus powerOff. */
    public powerOff: number;

    /** ElmonStatus buttonRst. */
    public buttonRst: number;

    /** ElmonStatus priority. */
    public priority: number;

    /**
     * Creates a new ElmonStatus instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ElmonStatus instance
     */
    public static create(properties?: smartelmon.IElmonStatus): smartelmon.ElmonStatus;

    /**
     * Encodes the specified ElmonStatus message. Does not implicitly {@link smartelmon.ElmonStatus.verify|verify} messages.
     * @param message ElmonStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartelmon.IElmonStatus,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ElmonStatus message, length delimited. Does not implicitly {@link smartelmon.ElmonStatus.verify|verify} messages.
     * @param message ElmonStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.IElmonStatus,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an ElmonStatus message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ElmonStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartelmon.ElmonStatus;

    /**
     * Decodes an ElmonStatus message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ElmonStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.ElmonStatus;

    /**
     * Verifies an ElmonStatus message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an ElmonStatus message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ElmonStatus
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.ElmonStatus;

    /**
     * Creates a plain object from an ElmonStatus message. Also converts values to other types if specified.
     * @param message ElmonStatus
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.ElmonStatus,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ElmonStatus to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ElmonStatus
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Voltage. */
  interface IVoltage {
    /** Voltage AN */
    AN?: number | null;

    /** Voltage BN */
    BN?: number | null;

    /** Voltage CN */
    CN?: number | null;

    /** Voltage AB */
    AB?: number | null;

    /** Voltage BC */
    BC?: number | null;

    /** Voltage CA */
    CA?: number | null;
  }

  /** Represents a Voltage. */
  class Voltage implements IVoltage {
    /**
     * Constructs a new Voltage.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.IVoltage);

    /** Voltage AN. */
    public AN: number;

    /** Voltage BN. */
    public BN: number;

    /** Voltage CN. */
    public CN: number;

    /** Voltage AB. */
    public AB: number;

    /** Voltage BC. */
    public BC: number;

    /** Voltage CA. */
    public CA: number;

    /**
     * Creates a new Voltage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Voltage instance
     */
    public static create(properties?: smartelmon.IVoltage): smartelmon.Voltage;

    /**
     * Encodes the specified Voltage message. Does not implicitly {@link smartelmon.Voltage.verify|verify} messages.
     * @param message Voltage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: smartelmon.IVoltage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Voltage message, length delimited. Does not implicitly {@link smartelmon.Voltage.verify|verify} messages.
     * @param message Voltage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.IVoltage,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Voltage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Voltage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartelmon.Voltage;

    /**
     * Decodes a Voltage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Voltage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.Voltage;

    /**
     * Verifies a Voltage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Voltage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Voltage
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.Voltage;

    /**
     * Creates a plain object from a Voltage message. Also converts values to other types if specified.
     * @param message Voltage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.Voltage,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Voltage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Voltage
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Current. */
  interface ICurrent {
    /** Current A */
    A?: number | null;

    /** Current B */
    B?: number | null;

    /** Current C */
    C?: number | null;
  }

  /** Represents a Current. */
  class Current implements ICurrent {
    /**
     * Constructs a new Current.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.ICurrent);

    /** Current A. */
    public A: number;

    /** Current B. */
    public B: number;

    /** Current C. */
    public C: number;

    /**
     * Creates a new Current instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Current instance
     */
    public static create(properties?: smartelmon.ICurrent): smartelmon.Current;

    /**
     * Encodes the specified Current message. Does not implicitly {@link smartelmon.Current.verify|verify} messages.
     * @param message Current message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: smartelmon.ICurrent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Current message, length delimited. Does not implicitly {@link smartelmon.Current.verify|verify} messages.
     * @param message Current message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.ICurrent,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Current message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Current
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartelmon.Current;

    /**
     * Decodes a Current message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Current
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.Current;

    /**
     * Verifies a Current message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Current message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Current
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.Current;

    /**
     * Creates a plain object from a Current message. Also converts values to other types if specified.
     * @param message Current
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.Current,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Current to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Current
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Power. */
  interface IPower {
    /** Power activeA */
    activeA?: number | null;

    /** Power activeB */
    activeB?: number | null;

    /** Power activeC */
    activeC?: number | null;

    /** Power activeTotal */
    activeTotal?: number | null;

    /** Power reactiveA */
    reactiveA?: number | null;

    /** Power reactiveB */
    reactiveB?: number | null;

    /** Power reactiveC */
    reactiveC?: number | null;

    /** Power reactiveTotal */
    reactiveTotal?: number | null;

    /** Power pfA */
    pfA?: number | null;

    /** Power pfB */
    pfB?: number | null;

    /** Power pfC */
    pfC?: number | null;

    /** Power pfTotal */
    pfTotal?: number | null;

    /** Power apparentA */
    apparentA?: number | null;

    /** Power apparentB */
    apparentB?: number | null;

    /** Power apparentC */
    apparentC?: number | null;

    /** Power apparentTotal */
    apparentTotal?: number | null;
  }

  /** Represents a Power. */
  class Power implements IPower {
    /**
     * Constructs a new Power.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.IPower);

    /** Power activeA. */
    public activeA: number;

    /** Power activeB. */
    public activeB: number;

    /** Power activeC. */
    public activeC: number;

    /** Power activeTotal. */
    public activeTotal: number;

    /** Power reactiveA. */
    public reactiveA: number;

    /** Power reactiveB. */
    public reactiveB: number;

    /** Power reactiveC. */
    public reactiveC: number;

    /** Power reactiveTotal. */
    public reactiveTotal: number;

    /** Power pfA. */
    public pfA: number;

    /** Power pfB. */
    public pfB: number;

    /** Power pfC. */
    public pfC: number;

    /** Power pfTotal. */
    public pfTotal: number;

    /** Power apparentA. */
    public apparentA: number;

    /** Power apparentB. */
    public apparentB: number;

    /** Power apparentC. */
    public apparentC: number;

    /** Power apparentTotal. */
    public apparentTotal: number;

    /**
     * Creates a new Power instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Power instance
     */
    public static create(properties?: smartelmon.IPower): smartelmon.Power;

    /**
     * Encodes the specified Power message. Does not implicitly {@link smartelmon.Power.verify|verify} messages.
     * @param message Power message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: smartelmon.IPower, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Power message, length delimited. Does not implicitly {@link smartelmon.Power.verify|verify} messages.
     * @param message Power message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.IPower,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Power message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Power
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): smartelmon.Power;

    /**
     * Decodes a Power message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Power
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.Power;

    /**
     * Verifies a Power message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Power message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Power
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.Power;

    /**
     * Creates a plain object from a Power message. Also converts values to other types if specified.
     * @param message Power
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.Power,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Power to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Power
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Frequency. */
  interface IFrequency {
    /** Frequency freq */
    freq?: number | null;
  }

  /** Represents a Frequency. */
  class Frequency implements IFrequency {
    /**
     * Constructs a new Frequency.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.IFrequency);

    /** Frequency freq. */
    public freq: number;

    /**
     * Creates a new Frequency instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Frequency instance
     */
    public static create(properties?: smartelmon.IFrequency): smartelmon.Frequency;

    /**
     * Encodes the specified Frequency message. Does not implicitly {@link smartelmon.Frequency.verify|verify} messages.
     * @param message Frequency message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartelmon.IFrequency,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Frequency message, length delimited. Does not implicitly {@link smartelmon.Frequency.verify|verify} messages.
     * @param message Frequency message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.IFrequency,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Frequency message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Frequency
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartelmon.Frequency;

    /**
     * Decodes a Frequency message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Frequency
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.Frequency;

    /**
     * Verifies a Frequency message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Frequency message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Frequency
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.Frequency;

    /**
     * Creates a plain object from a Frequency message. Also converts values to other types if specified.
     * @param message Frequency
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.Frequency,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Frequency to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Frequency
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a THDVoltage. */
  interface ITHDVoltage {
    /** THDVoltage AN */
    AN?: number | null;

    /** THDVoltage BN */
    BN?: number | null;

    /** THDVoltage CN */
    CN?: number | null;
  }

  /** Represents a THDVoltage. */
  class THDVoltage implements ITHDVoltage {
    /**
     * Constructs a new THDVoltage.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.ITHDVoltage);

    /** THDVoltage AN. */
    public AN: number;

    /** THDVoltage BN. */
    public BN: number;

    /** THDVoltage CN. */
    public CN: number;

    /**
     * Creates a new THDVoltage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns THDVoltage instance
     */
    public static create(properties?: smartelmon.ITHDVoltage): smartelmon.THDVoltage;

    /**
     * Encodes the specified THDVoltage message. Does not implicitly {@link smartelmon.THDVoltage.verify|verify} messages.
     * @param message THDVoltage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartelmon.ITHDVoltage,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified THDVoltage message, length delimited. Does not implicitly {@link smartelmon.THDVoltage.verify|verify} messages.
     * @param message THDVoltage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.ITHDVoltage,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a THDVoltage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns THDVoltage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartelmon.THDVoltage;

    /**
     * Decodes a THDVoltage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns THDVoltage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.THDVoltage;

    /**
     * Verifies a THDVoltage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a THDVoltage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns THDVoltage
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.THDVoltage;

    /**
     * Creates a plain object from a THDVoltage message. Also converts values to other types if specified.
     * @param message THDVoltage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.THDVoltage,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this THDVoltage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for THDVoltage
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a THDCurrent. */
  interface ITHDCurrent {
    /** THDCurrent A */
    A?: number | null;

    /** THDCurrent B */
    B?: number | null;

    /** THDCurrent C */
    C?: number | null;
  }

  /** Represents a THDCurrent. */
  class THDCurrent implements ITHDCurrent {
    /**
     * Constructs a new THDCurrent.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.ITHDCurrent);

    /** THDCurrent A. */
    public A: number;

    /** THDCurrent B. */
    public B: number;

    /** THDCurrent C. */
    public C: number;

    /**
     * Creates a new THDCurrent instance using the specified properties.
     * @param [properties] Properties to set
     * @returns THDCurrent instance
     */
    public static create(properties?: smartelmon.ITHDCurrent): smartelmon.THDCurrent;

    /**
     * Encodes the specified THDCurrent message. Does not implicitly {@link smartelmon.THDCurrent.verify|verify} messages.
     * @param message THDCurrent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartelmon.ITHDCurrent,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified THDCurrent message, length delimited. Does not implicitly {@link smartelmon.THDCurrent.verify|verify} messages.
     * @param message THDCurrent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.ITHDCurrent,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a THDCurrent message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns THDCurrent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartelmon.THDCurrent;

    /**
     * Decodes a THDCurrent message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns THDCurrent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.THDCurrent;

    /**
     * Verifies a THDCurrent message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a THDCurrent message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns THDCurrent
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.THDCurrent;

    /**
     * Creates a plain object from a THDCurrent message. Also converts values to other types if specified.
     * @param message THDCurrent
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.THDCurrent,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this THDCurrent to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for THDCurrent
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a VoltParams. */
  interface IVoltParams {
    /** VoltParams underVoltage1 */
    underVoltage1?: number | null;

    /** VoltParams underVoltage2 */
    underVoltage2?: number | null;

    /** VoltParams overVoltage1 */
    overVoltage1?: number | null;

    /** VoltParams overVoltage2 */
    overVoltage2?: number | null;
  }

  /** Represents a VoltParams. */
  class VoltParams implements IVoltParams {
    /**
     * Constructs a new VoltParams.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.IVoltParams);

    /** VoltParams underVoltage1. */
    public underVoltage1: number;

    /** VoltParams underVoltage2. */
    public underVoltage2: number;

    /** VoltParams overVoltage1. */
    public overVoltage1: number;

    /** VoltParams overVoltage2. */
    public overVoltage2: number;

    /**
     * Creates a new VoltParams instance using the specified properties.
     * @param [properties] Properties to set
     * @returns VoltParams instance
     */
    public static create(properties?: smartelmon.IVoltParams): smartelmon.VoltParams;

    /**
     * Encodes the specified VoltParams message. Does not implicitly {@link smartelmon.VoltParams.verify|verify} messages.
     * @param message VoltParams message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartelmon.IVoltParams,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified VoltParams message, length delimited. Does not implicitly {@link smartelmon.VoltParams.verify|verify} messages.
     * @param message VoltParams message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.IVoltParams,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a VoltParams message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns VoltParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartelmon.VoltParams;

    /**
     * Decodes a VoltParams message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns VoltParams
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.VoltParams;

    /**
     * Verifies a VoltParams message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a VoltParams message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns VoltParams
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.VoltParams;

    /**
     * Creates a plain object from a VoltParams message. Also converts values to other types if specified.
     * @param message VoltParams
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.VoltParams,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this VoltParams to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for VoltParams
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an Angle. */
  interface IAngle {
    /** Angle phaseA */
    phaseA?: number | null;

    /** Angle phaseB */
    phaseB?: number | null;

    /** Angle phaseC */
    phaseC?: number | null;
  }

  /** Represents an Angle. */
  class Angle implements IAngle {
    /**
     * Constructs a new Angle.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.IAngle);

    /** Angle phaseA. */
    public phaseA: number;

    /** Angle phaseB. */
    public phaseB: number;

    /** Angle phaseC. */
    public phaseC: number;

    /**
     * Creates a new Angle instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Angle instance
     */
    public static create(properties?: smartelmon.IAngle): smartelmon.Angle;

    /**
     * Encodes the specified Angle message. Does not implicitly {@link smartelmon.Angle.verify|verify} messages.
     * @param message Angle message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: smartelmon.IAngle, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Angle message, length delimited. Does not implicitly {@link smartelmon.Angle.verify|verify} messages.
     * @param message Angle message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.IAngle,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an Angle message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Angle
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): smartelmon.Angle;

    /**
     * Decodes an Angle message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Angle
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.Angle;

    /**
     * Verifies an Angle message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an Angle message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Angle
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.Angle;

    /**
     * Creates a plain object from an Angle message. Also converts values to other types if specified.
     * @param message Angle
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.Angle,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Angle to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Angle
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an Energy. */
  interface IEnergy {
    /** Energy absorptiveActive */
    absorptiveActive?: number | null;

    /** Energy releaseActive */
    releaseActive?: number | null;

    /** Energy inductiveReactive */
    inductiveReactive?: number | null;

    /** Energy capasitiveReactive */
    capasitiveReactive?: number | null;
  }

  /** Represents an Energy. */
  class Energy implements IEnergy {
    /**
     * Constructs a new Energy.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartelmon.IEnergy);

    /** Energy absorptiveActive. */
    public absorptiveActive: number;

    /** Energy releaseActive. */
    public releaseActive: number;

    /** Energy inductiveReactive. */
    public inductiveReactive: number;

    /** Energy capasitiveReactive. */
    public capasitiveReactive: number;

    /**
     * Creates a new Energy instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Energy instance
     */
    public static create(properties?: smartelmon.IEnergy): smartelmon.Energy;

    /**
     * Encodes the specified Energy message. Does not implicitly {@link smartelmon.Energy.verify|verify} messages.
     * @param message Energy message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: smartelmon.IEnergy, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Energy message, length delimited. Does not implicitly {@link smartelmon.Energy.verify|verify} messages.
     * @param message Energy message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartelmon.IEnergy,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an Energy message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Energy
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): smartelmon.Energy;

    /**
     * Decodes an Energy message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Energy
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartelmon.Energy;

    /**
     * Verifies an Energy message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an Energy message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Energy
     */
    public static fromObject(object: { [k: string]: any }): smartelmon.Energy;

    /**
     * Creates a plain object from an Energy message. Also converts values to other types if specified.
     * @param message Energy
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartelmon.Energy,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Energy to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Energy
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}

/** Namespace smartmonitor. */
export namespace smartmonitor {
  /** Properties of a MonitorContent. */
  interface IMonitorContent {
    /** MonitorContent meta */
    meta?: Uint8Array | null;

    /** MonitorContent infoDevice */
    infoDevice?: commoniot.IInfoDevice | null;

    /** MonitorContent infoFarm */
    infoFarm?: commoniot.IInfoFarm | null;

    /** MonitorContent startCycle */
    startCycle?: commoniot.IStartCycle | null;

    /** MonitorContent stopCycle */
    stopCycle?: commoniot.IStopCycle | null;

    /** MonitorContent reset */
    reset?: commoniot.IReset | null;

    /** MonitorContent ping */
    ping?: commoniot.IPing | null;

    /** MonitorContent ota */
    ota?: commoniot.IOta | null;

    /** MonitorContent mapSensor */
    mapSensor?: sensor.IMapSensor | null;

    /** MonitorContent mapDevice */
    mapDevice?: commoniot.IMapDevice | null;

    /** MonitorContent reportSetting */
    reportSetting?: commoniot.IReportSetting | null;

    /** MonitorContent monitorData */
    monitorData?: smartmonitor.IMonitorData | null;

    /** MonitorContent monitorStatus */
    monitorStatus?: smartmonitor.IMonitorStatus | null;

    /** MonitorContent storeR0 */
    storeR0?: smartmonitor.IstoreR0 | null;

    /** MonitorContent diagnosticsData */
    diagnosticsData?: smartmonitor.IDiagnosticsData | null;

    /** MonitorContent error */
    error?: commoniot.IError | null;
  }

  /** Represents a MonitorContent. */
  class MonitorContent implements IMonitorContent {
    /**
     * Constructs a new MonitorContent.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitor.IMonitorContent);

    /** MonitorContent meta. */
    public meta: Uint8Array;

    /** MonitorContent infoDevice. */
    public infoDevice?: commoniot.IInfoDevice | null;

    /** MonitorContent infoFarm. */
    public infoFarm?: commoniot.IInfoFarm | null;

    /** MonitorContent startCycle. */
    public startCycle?: commoniot.IStartCycle | null;

    /** MonitorContent stopCycle. */
    public stopCycle?: commoniot.IStopCycle | null;

    /** MonitorContent reset. */
    public reset?: commoniot.IReset | null;

    /** MonitorContent ping. */
    public ping?: commoniot.IPing | null;

    /** MonitorContent ota. */
    public ota?: commoniot.IOta | null;

    /** MonitorContent mapSensor. */
    public mapSensor?: sensor.IMapSensor | null;

    /** MonitorContent mapDevice. */
    public mapDevice?: commoniot.IMapDevice | null;

    /** MonitorContent reportSetting. */
    public reportSetting?: commoniot.IReportSetting | null;

    /** MonitorContent monitorData. */
    public monitorData?: smartmonitor.IMonitorData | null;

    /** MonitorContent monitorStatus. */
    public monitorStatus?: smartmonitor.IMonitorStatus | null;

    /** MonitorContent storeR0. */
    public storeR0?: smartmonitor.IstoreR0 | null;

    /** MonitorContent diagnosticsData. */
    public diagnosticsData?: smartmonitor.IDiagnosticsData | null;

    /** MonitorContent error. */
    public error?: commoniot.IError | null;

    /**
     * Creates a new MonitorContent instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MonitorContent instance
     */
    public static create(properties?: smartmonitor.IMonitorContent): smartmonitor.MonitorContent;

    /**
     * Encodes the specified MonitorContent message. Does not implicitly {@link smartmonitor.MonitorContent.verify|verify} messages.
     * @param message MonitorContent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitor.IMonitorContent,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified MonitorContent message, length delimited. Does not implicitly {@link smartmonitor.MonitorContent.verify|verify} messages.
     * @param message MonitorContent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitor.IMonitorContent,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a MonitorContent message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MonitorContent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitor.MonitorContent;

    /**
     * Decodes a MonitorContent message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MonitorContent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartmonitor.MonitorContent;

    /**
     * Verifies a MonitorContent message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a MonitorContent message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MonitorContent
     */
    public static fromObject(object: { [k: string]: any }): smartmonitor.MonitorContent;

    /**
     * Creates a plain object from a MonitorContent message. Also converts values to other types if specified.
     * @param message MonitorContent
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitor.MonitorContent,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this MonitorContent to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for MonitorContent
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a MonitorData. */
  interface IMonitorData {
    /** MonitorData local */
    local?: sensor.ISensor | null;

    /** MonitorData remote */
    remote?: sensor.ISensor | null;

    /** MonitorData rssi */
    rssi?: number | null;
  }

  /** Represents a MonitorData. */
  class MonitorData implements IMonitorData {
    /**
     * Constructs a new MonitorData.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitor.IMonitorData);

    /** MonitorData local. */
    public local?: sensor.ISensor | null;

    /** MonitorData remote. */
    public remote?: sensor.ISensor | null;

    /** MonitorData rssi. */
    public rssi: number;

    /**
     * Creates a new MonitorData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MonitorData instance
     */
    public static create(properties?: smartmonitor.IMonitorData): smartmonitor.MonitorData;

    /**
     * Encodes the specified MonitorData message. Does not implicitly {@link smartmonitor.MonitorData.verify|verify} messages.
     * @param message MonitorData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitor.IMonitorData,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified MonitorData message, length delimited. Does not implicitly {@link smartmonitor.MonitorData.verify|verify} messages.
     * @param message MonitorData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitor.IMonitorData,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a MonitorData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MonitorData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitor.MonitorData;

    /**
     * Decodes a MonitorData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MonitorData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartmonitor.MonitorData;

    /**
     * Verifies a MonitorData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a MonitorData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MonitorData
     */
    public static fromObject(object: { [k: string]: any }): smartmonitor.MonitorData;

    /**
     * Creates a plain object from a MonitorData message. Also converts values to other types if specified.
     * @param message MonitorData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitor.MonitorData,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this MonitorData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for MonitorData
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a MonitorStatus. */
  interface IMonitorStatus {
    /** MonitorStatus status */
    status?: number | null;
  }

  /** Represents a MonitorStatus. */
  class MonitorStatus implements IMonitorStatus {
    /**
     * Constructs a new MonitorStatus.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitor.IMonitorStatus);

    /** MonitorStatus status. */
    public status: number;

    /**
     * Creates a new MonitorStatus instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MonitorStatus instance
     */
    public static create(properties?: smartmonitor.IMonitorStatus): smartmonitor.MonitorStatus;

    /**
     * Encodes the specified MonitorStatus message. Does not implicitly {@link smartmonitor.MonitorStatus.verify|verify} messages.
     * @param message MonitorStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitor.IMonitorStatus,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified MonitorStatus message, length delimited. Does not implicitly {@link smartmonitor.MonitorStatus.verify|verify} messages.
     * @param message MonitorStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitor.IMonitorStatus,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a MonitorStatus message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MonitorStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitor.MonitorStatus;

    /**
     * Decodes a MonitorStatus message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MonitorStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartmonitor.MonitorStatus;

    /**
     * Verifies a MonitorStatus message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a MonitorStatus message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MonitorStatus
     */
    public static fromObject(object: { [k: string]: any }): smartmonitor.MonitorStatus;

    /**
     * Creates a plain object from a MonitorStatus message. Also converts values to other types if specified.
     * @param message MonitorStatus
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitor.MonitorStatus,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this MonitorStatus to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for MonitorStatus
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a storeR0. */
  interface IstoreR0 {
    /** storeR0 r0Value */
    r0Value?: number | null;
  }

  /** Represents a storeR0. */
  class storeR0 implements IstoreR0 {
    /**
     * Constructs a new storeR0.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitor.IstoreR0);

    /** storeR0 r0Value. */
    public r0Value: number;

    /**
     * Creates a new storeR0 instance using the specified properties.
     * @param [properties] Properties to set
     * @returns storeR0 instance
     */
    public static create(properties?: smartmonitor.IstoreR0): smartmonitor.storeR0;

    /**
     * Encodes the specified storeR0 message. Does not implicitly {@link smartmonitor.storeR0.verify|verify} messages.
     * @param message storeR0 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitor.IstoreR0,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified storeR0 message, length delimited. Does not implicitly {@link smartmonitor.storeR0.verify|verify} messages.
     * @param message storeR0 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitor.IstoreR0,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a storeR0 message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns storeR0
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitor.storeR0;

    /**
     * Decodes a storeR0 message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns storeR0
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartmonitor.storeR0;

    /**
     * Verifies a storeR0 message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a storeR0 message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns storeR0
     */
    public static fromObject(object: { [k: string]: any }): smartmonitor.storeR0;

    /**
     * Creates a plain object from a storeR0 message. Also converts values to other types if specified.
     * @param message storeR0
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitor.storeR0,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this storeR0 to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for storeR0
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a DiagnosticsData. */
  interface IDiagnosticsData {
    /** DiagnosticsData unixTimeData */
    unixTimeData?: number | Long | null;

    /** DiagnosticsData pingResponseTime */
    pingResponseTime?: number | null;

    /** DiagnosticsData wifiRSSI */
    wifiRSSI?: number | null;

    /** DiagnosticsData minFreeHeapSinceBoot */
    minFreeHeapSinceBoot?: number | null;
  }

  /** Represents a DiagnosticsData. */
  class DiagnosticsData implements IDiagnosticsData {
    /**
     * Constructs a new DiagnosticsData.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitor.IDiagnosticsData);

    /** DiagnosticsData unixTimeData. */
    public unixTimeData: number | Long;

    /** DiagnosticsData pingResponseTime. */
    public pingResponseTime: number;

    /** DiagnosticsData wifiRSSI. */
    public wifiRSSI: number;

    /** DiagnosticsData minFreeHeapSinceBoot. */
    public minFreeHeapSinceBoot: number;

    /**
     * Creates a new DiagnosticsData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DiagnosticsData instance
     */
    public static create(properties?: smartmonitor.IDiagnosticsData): smartmonitor.DiagnosticsData;

    /**
     * Encodes the specified DiagnosticsData message. Does not implicitly {@link smartmonitor.DiagnosticsData.verify|verify} messages.
     * @param message DiagnosticsData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitor.IDiagnosticsData,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DiagnosticsData message, length delimited. Does not implicitly {@link smartmonitor.DiagnosticsData.verify|verify} messages.
     * @param message DiagnosticsData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitor.IDiagnosticsData,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DiagnosticsData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DiagnosticsData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitor.DiagnosticsData;

    /**
     * Decodes a DiagnosticsData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DiagnosticsData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartmonitor.DiagnosticsData;

    /**
     * Verifies a DiagnosticsData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a DiagnosticsData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DiagnosticsData
     */
    public static fromObject(object: { [k: string]: any }): smartmonitor.DiagnosticsData;

    /**
     * Creates a plain object from a DiagnosticsData message. Also converts values to other types if specified.
     * @param message DiagnosticsData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitor.DiagnosticsData,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this DiagnosticsData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DiagnosticsData
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}

/** Namespace smartmonitorsensor. */
export namespace smartmonitorsensor {
  /** Properties of a MapSensor. */
  interface IMapSensor {
    /** MapSensor room */
    room?: number | null;

    /** MapSensor xiaomis */
    xiaomis?: smartmonitorsensor.IXiaomi[] | null;

    /** MapSensor honeys */
    honeys?: smartmonitorsensor.IHoney[] | null;

    /** MapSensor wind */
    wind?: smartmonitorsensor.IWind[] | null;

    /** MapSensor command */
    command?: number | null;
  }

  /** Represents a MapSensor. */
  class MapSensor implements IMapSensor {
    /**
     * Constructs a new MapSensor.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitorsensor.IMapSensor);

    /** MapSensor room. */
    public room: number;

    /** MapSensor xiaomis. */
    public xiaomis: smartmonitorsensor.IXiaomi[];

    /** MapSensor honeys. */
    public honeys: smartmonitorsensor.IHoney[];

    /** MapSensor wind. */
    public wind: smartmonitorsensor.IWind[];

    /** MapSensor command. */
    public command: number;

    /**
     * Creates a new MapSensor instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MapSensor instance
     */
    public static create(properties?: smartmonitorsensor.IMapSensor): smartmonitorsensor.MapSensor;

    /**
     * Encodes the specified MapSensor message. Does not implicitly {@link smartmonitorsensor.MapSensor.verify|verify} messages.
     * @param message MapSensor message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitorsensor.IMapSensor,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified MapSensor message, length delimited. Does not implicitly {@link smartmonitorsensor.MapSensor.verify|verify} messages.
     * @param message MapSensor message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitorsensor.IMapSensor,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a MapSensor message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MapSensor
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitorsensor.MapSensor;

    /**
     * Decodes a MapSensor message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MapSensor
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): smartmonitorsensor.MapSensor;

    /**
     * Verifies a MapSensor message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a MapSensor message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MapSensor
     */
    public static fromObject(object: { [k: string]: any }): smartmonitorsensor.MapSensor;

    /**
     * Creates a plain object from a MapSensor message. Also converts values to other types if specified.
     * @param message MapSensor
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitorsensor.MapSensor,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this MapSensor to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for MapSensor
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Sensor. */
  interface ISensor {
    /** Sensor room */
    room?: number | null;

    /** Sensor xiaomis */
    xiaomis?: smartmonitorsensor.IXiaomi[] | null;

    /** Sensor ammoniaMics */
    ammoniaMics?: smartmonitorsensor.IMics | null;

    /** Sensor nh3wsModbus */
    nh3wsModbus?: smartmonitorsensor.IHoney | null;

    /** Sensor light */
    light?: number | null;

    /** Sensor wind */
    wind?: smartmonitorsensor.IWind | null;

    /** Sensor oxygen */
    oxygen?: number | null;

    /** Sensor errorCodeSensor */
    errorCodeSensor?: number | null;
  }

  /** Represents a Sensor. */
  class Sensor implements ISensor {
    /**
     * Constructs a new Sensor.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitorsensor.ISensor);

    /** Sensor room. */
    public room: number;

    /** Sensor xiaomis. */
    public xiaomis: smartmonitorsensor.IXiaomi[];

    /** Sensor ammoniaMics. */
    public ammoniaMics?: smartmonitorsensor.IMics | null;

    /** Sensor nh3wsModbus. */
    public nh3wsModbus?: smartmonitorsensor.IHoney | null;

    /** Sensor light. */
    public light: number;

    /** Sensor wind. */
    public wind?: smartmonitorsensor.IWind | null;

    /** Sensor oxygen. */
    public oxygen: number;

    /** Sensor errorCodeSensor. */
    public errorCodeSensor: number;

    /**
     * Creates a new Sensor instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Sensor instance
     */
    public static create(properties?: smartmonitorsensor.ISensor): smartmonitorsensor.Sensor;

    /**
     * Encodes the specified Sensor message. Does not implicitly {@link smartmonitorsensor.Sensor.verify|verify} messages.
     * @param message Sensor message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitorsensor.ISensor,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Sensor message, length delimited. Does not implicitly {@link smartmonitorsensor.Sensor.verify|verify} messages.
     * @param message Sensor message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitorsensor.ISensor,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Sensor message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Sensor
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitorsensor.Sensor;

    /**
     * Decodes a Sensor message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Sensor
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartmonitorsensor.Sensor;

    /**
     * Verifies a Sensor message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Sensor message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Sensor
     */
    public static fromObject(object: { [k: string]: any }): smartmonitorsensor.Sensor;

    /**
     * Creates a plain object from a Sensor message. Also converts values to other types if specified.
     * @param message Sensor
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitorsensor.Sensor,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Sensor to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Sensor
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Xiaomi. */
  interface IXiaomi {
    /** Xiaomi id */
    id?: Uint8Array | null;

    /** Xiaomi temp */
    temp?: number | null;

    /** Xiaomi humi */
    humi?: number | null;

    /** Xiaomi batt */
    batt?: number | null;

    /** Xiaomi rssi */
    rssi?: number | null;

    /** Xiaomi name */
    name?: string | null;

    /** Xiaomi pos */
    pos?: Uint8Array | null;

    /** Xiaomi dist */
    dist?: number | null;
  }

  /** Represents a Xiaomi. */
  class Xiaomi implements IXiaomi {
    /**
     * Constructs a new Xiaomi.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitorsensor.IXiaomi);

    /** Xiaomi id. */
    public id: Uint8Array;

    /** Xiaomi temp. */
    public temp: number;

    /** Xiaomi humi. */
    public humi: number;

    /** Xiaomi batt. */
    public batt: number;

    /** Xiaomi rssi. */
    public rssi: number;

    /** Xiaomi name. */
    public name: string;

    /** Xiaomi pos. */
    public pos: Uint8Array;

    /** Xiaomi dist. */
    public dist: number;

    /**
     * Creates a new Xiaomi instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Xiaomi instance
     */
    public static create(properties?: smartmonitorsensor.IXiaomi): smartmonitorsensor.Xiaomi;

    /**
     * Encodes the specified Xiaomi message. Does not implicitly {@link smartmonitorsensor.Xiaomi.verify|verify} messages.
     * @param message Xiaomi message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitorsensor.IXiaomi,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Xiaomi message, length delimited. Does not implicitly {@link smartmonitorsensor.Xiaomi.verify|verify} messages.
     * @param message Xiaomi message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitorsensor.IXiaomi,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Xiaomi message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Xiaomi
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitorsensor.Xiaomi;

    /**
     * Decodes a Xiaomi message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Xiaomi
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartmonitorsensor.Xiaomi;

    /**
     * Verifies a Xiaomi message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Xiaomi message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Xiaomi
     */
    public static fromObject(object: { [k: string]: any }): smartmonitorsensor.Xiaomi;

    /**
     * Creates a plain object from a Xiaomi message. Also converts values to other types if specified.
     * @param message Xiaomi
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitorsensor.Xiaomi,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Xiaomi to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Xiaomi
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Mics. */
  interface IMics {
    /** Mics rs */
    rs?: number | null;

    /** Mics ro */
    ro?: number | null;
  }

  /** Represents a Mics. */
  class Mics implements IMics {
    /**
     * Constructs a new Mics.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitorsensor.IMics);

    /** Mics rs. */
    public rs: number;

    /** Mics ro. */
    public ro: number;

    /**
     * Creates a new Mics instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Mics instance
     */
    public static create(properties?: smartmonitorsensor.IMics): smartmonitorsensor.Mics;

    /**
     * Encodes the specified Mics message. Does not implicitly {@link smartmonitorsensor.Mics.verify|verify} messages.
     * @param message Mics message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitorsensor.IMics,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Mics message, length delimited. Does not implicitly {@link smartmonitorsensor.Mics.verify|verify} messages.
     * @param message Mics message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitorsensor.IMics,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Mics message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Mics
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitorsensor.Mics;

    /**
     * Decodes a Mics message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Mics
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartmonitorsensor.Mics;

    /**
     * Verifies a Mics message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Mics message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Mics
     */
    public static fromObject(object: { [k: string]: any }): smartmonitorsensor.Mics;

    /**
     * Creates a plain object from a Mics message. Also converts values to other types if specified.
     * @param message Mics
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitorsensor.Mics,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Mics to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Mics
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an Honey. */
  interface IHoney {
    /** Honey id */
    id?: Uint8Array | null;

    /** Honey ammo */
    ammo?: number | null;

    /** Honey temp */
    temp?: number | null;

    /** Honey humi */
    humi?: number | null;

    /** Honey name */
    name?: string | null;

    /** Honey pos */
    pos?: Uint8Array | null;

    /** Honey dist */
    dist?: number | null;
  }

  /** Represents an Honey. */
  class Honey implements IHoney {
    /**
     * Constructs a new Honey.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitorsensor.IHoney);

    /** Honey id. */
    public id: Uint8Array;

    /** Honey ammo. */
    public ammo: number;

    /** Honey temp. */
    public temp: number;

    /** Honey humi. */
    public humi: number;

    /** Honey name. */
    public name: string;

    /** Honey pos. */
    public pos: Uint8Array;

    /** Honey dist. */
    public dist: number;

    /**
     * Creates a new Honey instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Honey instance
     */
    public static create(properties?: smartmonitorsensor.IHoney): smartmonitorsensor.Honey;

    /**
     * Encodes the specified Honey message. Does not implicitly {@link smartmonitorsensor.Honey.verify|verify} messages.
     * @param message Honey message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitorsensor.IHoney,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Honey message, length delimited. Does not implicitly {@link smartmonitorsensor.Honey.verify|verify} messages.
     * @param message Honey message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitorsensor.IHoney,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an Honey message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Honey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitorsensor.Honey;

    /**
     * Decodes an Honey message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Honey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartmonitorsensor.Honey;

    /**
     * Verifies an Honey message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an Honey message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Honey
     */
    public static fromObject(object: { [k: string]: any }): smartmonitorsensor.Honey;

    /**
     * Creates a plain object from an Honey message. Also converts values to other types if specified.
     * @param message Honey
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitorsensor.Honey,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Honey to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Honey
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Wind. */
  interface IWind {
    /** Wind id */
    id?: Uint8Array | null;

    /** Wind speed */
    speed?: number | null;

    /** Wind name */
    name?: string | null;

    /** Wind pos */
    pos?: Uint8Array | null;

    /** Wind dist */
    dist?: number | null;
  }

  /** Represents a Wind. */
  class Wind implements IWind {
    /**
     * Constructs a new Wind.
     * @param [properties] Properties to set
     */
    constructor(properties?: smartmonitorsensor.IWind);

    /** Wind id. */
    public id: Uint8Array;

    /** Wind speed. */
    public speed: number;

    /** Wind name. */
    public name: string;

    /** Wind pos. */
    public pos: Uint8Array;

    /** Wind dist. */
    public dist: number;

    /**
     * Creates a new Wind instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Wind instance
     */
    public static create(properties?: smartmonitorsensor.IWind): smartmonitorsensor.Wind;

    /**
     * Encodes the specified Wind message. Does not implicitly {@link smartmonitorsensor.Wind.verify|verify} messages.
     * @param message Wind message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: smartmonitorsensor.IWind,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Wind message, length delimited. Does not implicitly {@link smartmonitorsensor.Wind.verify|verify} messages.
     * @param message Wind message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: smartmonitorsensor.IWind,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Wind message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Wind
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): smartmonitorsensor.Wind;

    /**
     * Decodes a Wind message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Wind
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): smartmonitorsensor.Wind;

    /**
     * Verifies a Wind message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Wind message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Wind
     */
    public static fromObject(object: { [k: string]: any }): smartmonitorsensor.Wind;

    /**
     * Creates a plain object from a Wind message. Also converts values to other types if specified.
     * @param message Wind
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: smartmonitorsensor.Wind,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Wind to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Wind
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}
