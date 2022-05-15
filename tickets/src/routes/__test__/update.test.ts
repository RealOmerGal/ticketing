import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'test title',
            price: 19
        })
    expect(404);
})
it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'test title',
            price: 19
        })
    expect(401);

})
it('returns a 401 if the provided user does not own the ticket', async () => {
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'tdsasa',
            price: 19
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'sadsasa',
            price: 1000
        })
        .expect(401);
})
it('returns a 400 if the user provides invalid title or price', async () => {

    const cookie = global.signin();

    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'tdsasa',
            price: 19
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'sadassa',
            price: -1
        })
        .expect(400);
})

it('updates the ticket if all inputs provided are valid', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'tdsasa',
            price: 19
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new  title',
            price: 67
        })
    expect(200);

    const tickerResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(tickerResponse.body.title).toEqual('new title');
    expect(tickerResponse.body.price).toEqual(67);



})
