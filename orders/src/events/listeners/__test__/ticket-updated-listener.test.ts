import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { Message } from 'node-nats-streaming'
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@illaygal/ogcommon";

const setup = async () => {
    //Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    //Create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save();

    //Create fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: 'blabla'
    }

    //Create a fake msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    // return all
    return { msg, data, ticket, listener };
};

it('finds, updates and saves the ticket', async () => {
    const { msg, data, ticket, listener } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.title).toEqual(data.title);
    expect(updatedTicket?.price).toEqual(data.price);
    expect(updatedTicket?.version).toEqual(data.version);


})

it('acks the message', async () => {
    const { msg, data, ticket, listener } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})

it('doenst call ack if the event has a skipped version number', async () => {
    const { msg, data, ticket, listener } = await setup();
    data.version = 15;
    try {
        await listener.onMessage(data, msg);
    } catch (err) {

    }
    expect(msg.ack).not.toHaveBeenCalled();

})