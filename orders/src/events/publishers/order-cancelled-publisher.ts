import { Publisher, OrderCancelledEvent, Subjects } from "@illaygal/ogcommon";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
}
