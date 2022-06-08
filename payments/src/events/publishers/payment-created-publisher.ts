import { Subjects, Publisher, PaymentCreatedEvent } from "@illaygal/ogcommon";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}