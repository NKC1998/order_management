import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  productCode: string;

  @Column()
  productName: string;

  @Column()
  unitPrice: number;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;
}
