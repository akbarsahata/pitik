import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CMSBase } from '../Base.entity';
import { IotDevice } from '../IotDevice.entity';
import { B2BFarmInfrastructure } from './B2BFarmInfrastructure.entity';

@Entity({
  name: 'b2b_iot_device',
  schema: 'b2b',
})
export class B2BIotDevice extends CMSBase {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'b2b_device_name', type: 'varchar' })
  b2bDeviceName: string;

  @Column({ name: 'ref_farm_infrastructure_id', type: 'uuid' })
  farmInfrastructureId: string;

  @Column({ name: 'ref_device_id', type: 'uuid' })
  deviceId: string;

  @OneToOne(() => IotDevice)
  @JoinColumn({ name: 'ref_device_id', referencedColumnName: 'id' })
  iotDevice: IotDevice;

  @ManyToOne(() => B2BFarmInfrastructure, (fi) => fi.devices)
  @JoinColumn({ name: 'ref_farm_infrastructure_id', referencedColumnName: 'id' })
  farmInfrastructure: B2BFarmInfrastructure;
}
