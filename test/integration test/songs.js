import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Songs API - Integration Tests', () => {
  describe('Public song endpoints', () => {
    it('returns a paginated song list', (done) => {
      chai
        .request(app)
        .get('/api/v1/songs/all')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.have.property('songs');
          expect(res.body.data.songs).to.be.an('array');
          expect(res.body.data).to.have.property('page');
          expect(res.body.data).to.have.property('total_count');
          expect(res.body.data).to.have.property('total_pages');
          done();
        });
    });

    it('returns 400 when search query is missing', (done) => {
      chai
        .request(app)
        .get('/api/v1/songs/search')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('user input required');
          done();
        });
    });

    it('returns search results when userInput is supplied', (done) => {
      chai
        .request(app)
        .get('/api/v1/songs/search?userInput=Where')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('returns 400 when genre query is missing', (done) => {
      chai
        .request(app)
        .get('/api/v1/songs/filter_genre')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('user input required');
          done();
        });
    });

    it('returns filtered songs for a valid genre', (done) => {
      chai
        .request(app)
        .get('/api/v1/songs/filter_genre?genre=Rock')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('Protected song endpoints', () => {
    it('requires authentication for viewing a song', (done) => {
      chai
        .request(app)
        .get('/api/v1/songs/view_song?song_id=00000000-0000-0000-0000-000000000000')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Please provide a token');
          done();
        });
    });

    it('requires authentication for liking a song', (done) => {
      chai
        .request(app)
        .post('/api/v1/songs/00000000-0000-0000-0000-000000000000/like?action=like')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Please provide a token');
          done();
        });
    });

    it('requires authentication for rating a song', (done) => {
      chai
        .request(app)
        .post('/api/v1/songs/00000000-0000-0000-0000-000000000000/rate?rating=5')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.equal('Please provide a token');
          done();
        });
    });
  });
});
