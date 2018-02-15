const assert = require('assert');
const nock = require('nock');

const environment_id = 'fake-id';
const collection_id = 'fake-id';

describe('Front end tests', function() {

  beforeEach(function() {
    nock('https://openwhisk.ng.bluemix.net')
      .post('/api/v1/web/kahn.128%40osu.edu_dev/suggestions/suggestion-provider-sequence.json', { 'activities': 'Hiking'})
      .query(true)
      .reply(200, {
        results: [
          {
            'name': 'Taiwan',
            'comment': 'Better than Argentina' 
          }
        ]
      });
  });

  it('sanity test travis', function() {
    
  });
});
