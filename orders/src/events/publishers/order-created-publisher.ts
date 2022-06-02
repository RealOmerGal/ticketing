import { Publisher, OrderCreatedEvent, Subjects } from "@illaygal/ogcommon";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
}
