describe("angular-geohash", function() {
    beforeEach(module('angular-geohash'));
    

    it("testEncodeBasic", inject(function(geohash) {
        expect(geohash).not.toBe(null);
    }));
    
    it("testEncodeBasic", inject(function(geohash) {
        var hashString = geohash.encode(37.8324, 112.5584);
        expect(hashString).toEqual('ww8p1r4t8');

        hashString = geohash.encode(32, 117, 3);
        expect(hashString).toEqual('wte');
    }));

    it("testIntEncodeBasic", inject(function(geohash) {
        var hashStringUInt = geohash.encode_int(37.8324, 112.5584, 52);
        expect(hashStringUInt).toEqual(4064984913515641);
    }));

    it("testDecodeBasic", inject(function(geohash) {
        var latLon = geohash.decode('ww8p1r4t8');
        expect(Math.abs(37.8324 - latLon.latitude) < 0.0001).toBeTruthy();
        expect(Math.abs(112.5584 - latLon.longitude) < 0.0001).toBeTruthy();
    }));

    it("testDecodeIntBasic", inject(function(geohash) {
        var latLonUInt = geohash.decode_int(4064984913515641);
        expect(Math.abs(37.8324 - latLonUInt.latitude) < 0.0001, "(37.8324 - "+latLonUInt.latitude+" was >= 0.0001").toBeTruthy();
        expect(Math.abs(112.5584 - latLonUInt.longitude) < 0.0001, "(112.5584 - "+latLonUInt.longitude+" was >= 0.0001").toBeTruthy();
    }));

    it("teshEncodeAutoBasic", inject(function(geohash) {
        //Simple Auto Test
        //expect(geohash.encode(44.97, -93.26, geohash.ENCODE_AUTO)).toThrow();

        hashString = geohash.encode('44.97', '-93.26', geohash.ENCODE_AUTO);
        expect(hashString).toEqual('9zvxvfd');

        hashString = geohash.encode('44.978120', '-93.263536', geohash.ENCODE_AUTO);
        expect(hashString).toEqual('9zvxvsp8d170t');
    }));

    it("testEncodeAuto", inject(function(geohash) {
        var hashString;
      //Multi Auto Test
      for (var i = 0; i < 25; i++) {
        var lat = (Math.random() * 180 - 90).toString();
        var lon = (Math.random() * 360 - 180).toString();
        var length = Math.floor(Math.random() * 5);
        lat = lat.substr(0, 5 + length);
        lon = lon.substr(0, 5 + length);

        hashString = geohash.encode(lat, lon, geohash.ENCODE_AUTO);
        latlon = geohash.decode(hashString);

        var decodedLat = latlon.latitude.toString();
        var decodedLon = latlon.longitude.toString();

        var latLength = lat.split('.')[1].length;
        var lonLength = lon.split('.')[1].length;

        var roundedDecodedLat = Math.round(decodedLat * Math.pow(10, latLength)) / Math.pow(10, latLength);
        var roundedDecodedLon = Math.round(decodedLon * Math.pow(10, lonLength)) / Math.pow(10, lonLength);
        for (var j in lat) {
          // expect(lat.toString()).toEqual(roundedDecodedLat.toString());
          // expect(lon.toString()).toEqual(roundedDecodedLon.toString());
        }
      }
    }));
    
    it("testNeighbor", inject(function(geohash) {
      var north = geohash.neighbor('dqcjq', [1, 0]);
      expect(north).toEqual('dqcjw');

      var southwest = geohash.neighbor('DQCJQ', [-1, -1]);
      expect(southwest).toEqual('dqcjj');
    }));


    it("testNeighborInt", inject(function(geohash) {
      var north = geohash.neighbor_int(1702789509, [1, 0], 32);
      expect(north).toEqual(1702789520);

      var southwest = geohash.neighbor_int(27898503327470, [-1, -1], 46);
      expect(southwest).toEqual(27898503327465);
        
    }));

    it("testNeighbors", inject(function(geohash) {
        var neighbors = geohash.neighbors('dqcjq');
        var neighbor_test = ['dqcjw','dqcjx','dqcjr','dqcjp','dqcjn','dqcjj','dqcjm','dqcjt'];
        for(var i=0; i<neighbors.length; i++){
            expect(neighbors[i]).toEqual(neighbor_test[i]);
        }
        expect(neighbors[0]).toEqual(geohash.neighbor('dqcjq', [1, 0]));

        neighbors = geohash.neighbors('DQCJQ');
        neighbor_test = ['dqcjw','dqcjx','dqcjr','dqcjp','dqcjn','dqcjj','dqcjm','dqcjt'];
        for(i=0; i<neighbors.length; i++){
            expect(neighbors[i]).toEqual(neighbor_test[i]);
        }
        expect(neighbors[5]).toEqual(geohash.neighbor('DQCJQ', [-1, -1]));
        
    }));

    it("testNeighborsInt", inject(function(geohash) {
        var neighbors = geohash.neighbors_int(1702789509, 32);
        var neighbor_test = [ 1702789520,1702789522,1702789511,1702789510,1702789508,1702789422,1702789423,1702789434 ];
        for(var i=0; i<neighbors.length; i++){
            expect(neighbors[i], neighbor_test[i]);
        }
        expect(neighbors[0]).toEqual(geohash.neighbor_int(1702789509, [1, 0]));

        neighbors = geohash.neighbors_int(27898503327470, 46);
        neighbor_test = [ 27898503327471,27898503349317,27898503349316,27898503349313,27898503327467,27898503327465,27898503327468,27898503327469 ];
        for(i=0; i<neighbors.length; i++){
            expect(neighbors[i], neighbor_test[i]);
        }
        expect(neighbors[5]).toEqual(geohash.neighbor_int(27898503327470, [-1, -1]));
    }));
    
    it("testBBoxes", inject(function(geohash) {
        var bboxes = geohash.bboxes(30, 120, 30.0001, 120.0001, 8);
        expect(bboxes[bboxes.length - 1]).toEqual(geohash.encode(30.0001, 120.0001, 8));
        expect(bboxes[bboxes.length - 1]).toEqual(geohash.encode(30.0001, 120.0001, 8));
    }));

    it("testBBoxesInt", inject(function(geohash) {
        var bboxes = geohash.bboxes_int(30, 120, 30.0001, 120.0001, 50);
        expect(bboxes[bboxes.length - 1]).toEqual(geohash.encode_int(30.0001, 120.0001, 50));
        expect(bboxes[bboxes.length - 1]).toEqual(geohash.encode_int(30.0001, 120.0001, 50));
    }));
});