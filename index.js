
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const dbConnection = require('./config/db');
const Event = require('./models/Event');
require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

dbConnection();

app.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post('/events', async (req, res) => {
  const event = new Event(req.body);
  await event.save();

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const googleEvent = {
    summary: event.title,
    description: event.description,
    start: { dateTime: new Date(event.date + ' ' + event.time).toISOString() },
    end: { dateTime: new Date(new Date(event.date + ' ' + event.time).getTime() + event.duration * 60 * 60 * 1000).toISOString() },
    attendees: event.participants.map(email => ({ email })),
  };

  const { data } = await calendar.events.insert({
    calendarId: 'primary',
    resource: googleEvent,
  });

  event.googleEventId = data.id;
  await event.save();

  res.json(event);
});

app.put('/events/:id', async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(event);
});

app.delete('/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event deleted' });
});

// OAuth2 for Google Calendar
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CLIENT_URL
);

app.get('/auth/google', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  res.redirect('/');
});



app.listen(8080, async () => {
    try {
        await dbConnection
    
        console.log("Connected to dbAtlas")

    } catch (e) {
        console.log(e.message)
    }
    console.log("listening on port 8080");
});