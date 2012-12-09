(function puzzle($) {
    var tile = {
        position: {
            x: null,
            y: null
        },
        neighbors: [],
        addNeighbor: function(tile) {
            this.neighbors.push(tile);
        },
        isNeighbour: function(tile) {
            return ($.inArray(tile, this.neighbors));
        }
    }

    var puzzle = {
        playground: null,
        baseImage: null,
        $viewport: null,
        image: new Image(),
        shuffle: function() {
            /* make a mess */
        },
        splitImageToTiles: function(image, x, y) {
            calcluateTileSize();
        },
        calculateTileSize: function() {
        },
        init: function(viewport) {
            this.$viewport = $(viewport);
            this.baseImage = this.$viewport.find('img')[0];
            $(this.baseImage).hide();
            this.playground = this.$viewport.find("#playground")[0].getContext('2d');
            this.playground.drawImage(this.baseImage,0,0);
        }
    }

    $puzzles = $(".puzzlejs_viewport");

    $puzzles.each(function() {
            var p = Object.create(puzzle);
            p.init(this);
    });
}(jQuery));
