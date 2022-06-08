import { Publisher, Subjects, ExpirationCompleteEvent } from "@illaygal/ogcommon";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}