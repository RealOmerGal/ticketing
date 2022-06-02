import { Publisher, Subjects, TicketCreatedEvent } from "@illaygal/ogcommon";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
