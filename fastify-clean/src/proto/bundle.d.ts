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
    mapSensor?: smartmonitorsensor.IMapSensor | null;

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
    public mapSensor?: smartmonitorsensor.IMapSensor | null;

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
    local?: smartmonitorsensor.ISensor | null;

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
    public local?: smartmonitorsensor.ISensor | null;

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
